import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { ParsedProduct, ParsedProductOption, ParsedStoreProduct, VariantOptions } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/Enums.js";
import { BaseParser } from "@api/parsers/BaseParser.js";
import { decodeHtmlEntities } from "@api/utils/decodeHtmlEntities.js";

interface NotinoVariantLink {
    id: string;
    label: string;
    link: string;
}

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

  private cleanVariantLabel(label: string): string {
    return decodeHtmlEntities(label)
      .replace(/\s+/g, " ")
      .replace(/^відтінок\s*/i, "")
      .replace(/\d[\d\s]*грн.*$/i, "")
      .trim();
  }

  private inferVariantOptions(label: string): VariantOptions {
    const cleanLabel = this.cleanVariantLabel(label);
    const sizeMatch = cleanLabel.match(
      /(\d+(?:[.,]\d+)?\s*(?:мл|мл\.|ml|г|гр|гр\.|g))$/i,
    );

    if (sizeMatch?.index !== undefined) {
      const shade = cleanLabel.slice(0, sizeMatch.index).trim();
      const size = sizeMatch[0];

      return shade ? { shade, size } : { size };
    }

    return { shade: cleanLabel };
  }

  private extractVariantLinks(body: string, pageUrl: string): NotinoVariantLink[] {
    const $ = cheerio.load(body);
    const currentPage = new URL(pageUrl);
    const basePath = currentPage.pathname.replace(/\/p-\d+\/?$/, "");
    const variantLinks = new Map<string, NotinoVariantLink>();

    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      let variantUrl: URL;
      try {
        variantUrl = new URL(href, pageUrl);
      } catch {
        return;
      }

      if (variantUrl.hash) return;

      const idMatch = variantUrl.pathname.match(/\/p-(\d+)/);
      if (!idMatch) return;

      const variantBasePath = variantUrl.pathname.replace(/\/p-\d+\/?$/, "");
      if (variantBasePath !== basePath) return;

      const id = idMatch[1];
      const rawLabel =
        $(element).attr("title") ??
        $(element).attr("aria-label") ??
        $(element).text();

      const label = this.cleanVariantLabel(rawLabel ?? "");
      if (!label || /^перейти/i.test(label)) return;

      if (!variantLinks.has(id)) {
        variantLinks.set(id, {
          id,
          label,
          link: variantUrl.toString(),
        });
      }
    });

    return [...variantLinks.values()];
  }

  private buildVariantOptions(
    variantLinks: NotinoVariantLink[],
    currentVariantId: string | null,
    baseName: string,
    brand: string,
    image?: string,
  ): ParsedProductOption[] {
    return variantLinks.map((variantLink) => ({
      optionId: variantLink.id,
      label: variantLink.label,
      isDefault: currentVariantId
        ? currentVariantId === variantLink.id
        : false,
      offers: [
        {
          name: `${baseName} ${variantLink.label}`,
          brand,
          inStock: true,
          image,
          link: variantLink.link,
          storeName: this.storeName,
          variantId: variantLink.id,
          options: this.inferVariantOptions(variantLink.label),
        },
      ],
    }));
  }

  private mapProduct(
    data: any,
    body: string,
    link: string,
  ): ParsedStoreProduct | null {
    if (!data?.name || !data?.brand?.name) {
      return null;
    }

    const variantId = this.extractIdFromUrl(link, /\/p-(\d+)/);
    const variantLinks = this.extractVariantLinks(body, link);
    const baseName = decodeHtmlEntities(data.name);
    const options = this.buildVariantOptions(
      variantLinks,
      variantId,
      baseName,
      decodeHtmlEntities(data.brand.name),
      this.formatImageUrl(data.image?.[0]) ?? undefined,
    );

    const primaryOffer = data?.offers?.[0];
    const primaryOfferVariantId = primaryOffer?.url
      ? this.extractIdFromUrl(primaryOffer.url, /\/p-(\d+)/)
      : null;

    if (primaryOfferVariantId) {
      const primaryOption = options.find(
        (option) => option.optionId === primaryOfferVariantId,
      );

      if (primaryOption?.offers[0]) {
        primaryOption.offers[0] = {
          ...primaryOption.offers[0],
          price: primaryOffer?.price || undefined,
          inStock: this.normalizeInStockParam(primaryOffer?.availability ?? ""),
        };
      }
    }

    if (options.length === 1) {
      const offer = options[0].offers[0];
      return { ...offer, baseName };
    }

    const currentVariantLink = variantId
      ? variantLinks.find((variantLink) => variantLink.id === variantId)
      : null;

    return {
      name: decodeHtmlEntities(data?.offers?.[0]?.name ?? data.name),
      baseName,
      brand: decodeHtmlEntities(data.brand.name),
      price: data?.offers?.[0]?.price || undefined,
      inStock: this.normalizeInStockParam(data.offers[0].availability),
      image: this.formatImageUrl(data.image?.[0]) || undefined,
      link,
      storeName: this.storeName,
      variantId: variantId ?? undefined,
      options: currentVariantLink
        ? this.inferVariantOptions(currentVariantLink.label)
        : undefined,
      variants: options.length > 1 ? options : undefined,
    };
  }

  protected async fetchByLink(link: string): Promise<ParsedStoreProduct | null> {
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

        const product = this.mapProduct(data, body, link);
        if (!product) throw new Error();

        return product;
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
  ): Promise<ParsedStoreProduct | null> {
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
        product.baseName ?? product.name,
        product.brand,
      )
    ) {
      return null;
    }

    return product;
  }
}
