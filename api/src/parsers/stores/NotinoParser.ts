import { gotScraping } from "got-scraping";
import { ParsedProduct } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/Enums.js";
import { BaseParser } from "@api/parsers/BaseParser.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import { decodeHtmlEntities } from "@api/utils/decodeHtmlEntities.js";

export class NotinoParser extends BaseParser {
  readonly storeName = StoreName.Notino;

  private readonly notinoSearchUrl: string =
    "https://www.notino.ua/search.asp?exps=";

  private normalizeInStockParam(link: string): boolean {
    return link.includes("InStock");
  }

  private formatImageUrl(imageUrl: string | undefined): string | null {
    if (!imageUrl) return null;
    return imageUrl.replace("order_2k", "detail_main_uhq");
  }

  private extractLdJson(
    body: string,
    predicate: (parsed: any) => boolean,
  ): any | null {
    const jsonMatches = body.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    );
    for (const match of jsonMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (predicate(parsed)) return parsed;
      } catch {}
    }
    return null;
  }

  protected async fetchByLink(link: string): Promise<ParsedProduct | null> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { body } = await gotScraping({
          url: link,
          headerGeneratorOptions: {
            browsers: ["chrome"],
            operatingSystems: ["windows"],
            locales: ["uk-UA"],
          },
        });

        const data = this.extractLdJson(
          body,
          (p) => p?.["@type"] === "Product",
        );
        if (!data) throw new Error();

        return {
          name: decodeHtmlEntities(data.name),
          brand: decodeHtmlEntities(data.brand.name),
          price: data?.offers[0]?.price || undefined,
          inStock: this.normalizeInStockParam(data.offers[0].availability),
          image: this.formatImageUrl(data.image?.[0]) || undefined,
          link,
          storeName: this.storeName,
        };
      } catch (error) {
        if (attempt === 3) return null;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return null;
  }

  protected async fetchByNameAndBrand(
    searchProductName: string,
    searchProductBrand: string,
  ): Promise<ParsedProduct | null> {
    let searchBody: string | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { body } = await gotScraping({
          url: this.notinoSearchUrl + searchProductName,
        });
        const searchResult = this.extractLdJson(
          body,
          (p) => p?.description === "підсумок пошуку",
        );
        if (!searchResult) throw new Error();

        searchBody = body;
        break;
      } catch (error) {
        if (attempt === 3) return null;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!searchBody) return null;
    const searchResult = this.extractLdJson(
      searchBody,
      (p) => p?.description === "підсумок пошуку",
    );
    const productUrl = searchResult?.mainEntity[0]?.offers?.url;
    if (!productUrl) return null;

    const product = await this.fetchByLink(productUrl);
    if (!product) return null;

    if (
      !this.validateMatch(
        searchProductName,
        searchProductBrand,
        product.name,
        product.brand,
      )
    ) {
      return null;
    }

    return product;
  }
}
