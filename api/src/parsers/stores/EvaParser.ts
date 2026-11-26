import axios from "axios";
import { ParsedProduct, ParsedProductOption, ParsedStoreProduct, VariantOptions } from "@api/types/ProductTypes.js";
import type { EvaByLinkResponse, EvaProduct, EvaSearchResponse } from "@api/parsers/types/EvaApi.js";
import { StoreName } from "@api/types/Enums.js";
import { productNamesSimilarityScore, simplifyString } from "@api/parsers/utils/stringUtils.js";
import { BaseParser } from "@api/parsers/BaseParser.js";

export class EvaParser extends BaseParser {
  readonly storeName = StoreName.Eva;

  private readonly evaApiUrl: string = "https://api.eva.ua/v1/ua/api/products/";
  private readonly evaApiImageUrl: string =
    "https://pwa-api.eva.ua/img/512/512/resize";
  private readonly evaApiSearchUrl: string =
    "https://api.eva.ua/v1/ua/api/search/";
  private readonly evaUrl: string = "https://eva.ua/ua/pr";

  /**
   * Extracts the core product name from Eva's raw response by stripping
   * the Ukrainian type prefix and the option details (size, shade, etc.).
   *
   * Eva returns names like: "Туалетна вода Calvin Klein Eternity, 100 мл"
   * This method extracts: "Calvin Klein Eternity"
   *
   * @param initialName - The full product name as returned by the Eva API.
   * @param brand - The product brand, used to locate where the relevant name starts.
   */
  private normalizeProductName(initialName: string, brand: string): string {
    const brandSimplified: string = simplifyString(brand);
    const initialNameSimplified: string = simplifyString(initialName);

    const startIndex: number = initialNameSimplified.indexOf(brandSimplified);
    const checkedStartIndex: number = startIndex === -1 ? 0 : startIndex;

    const endIndex: number = initialName.indexOf(",");
    const checkedEndIndex: number =
      endIndex === -1 ? initialName.length : endIndex;

    const normalizedName: string = initialName.substring(
      checkedStartIndex,
      checkedEndIndex,
    );
    return normalizedName;
  }

  private extractVariantOptionsFromName(name: string): VariantOptions | undefined {
    const parts = name.split(",").map((part) => part.trim());
    const lastPart = parts[parts.length - 1];

    if (lastPart && /\d/.test(lastPart)) {
      return { size: lastPart };
    }

    return undefined;
  }

  private mapProduct(
    data: EvaProduct,
    link: string,
  ): ParsedStoreProduct {
    const baseName = this.normalizeProductName(data.name, data.brand);
    const variants = this.buildVariants(data);

    if (variants.length === 1) {
      const offer = variants[0].offers[0];
      return { ...offer, baseName };
    }

    return {
      name: data.name,
      baseName,
      brand: data.brand,
      price: data.final_price || undefined,
      inStock: data.stock.is_in_stock,
      image: `${this.evaApiImageUrl}${data.image}`,
      link,
      storeName: this.storeName,
      variantId: String(data.id),
      options: this.extractVariantOptionsFromName(data.name),
      variants: variants.length > 1 ? variants : undefined,
    };
  }

  private buildVariants(data: EvaProduct): ParsedProductOption[] {
    const swatchItems = data.swatches?.items ?? [];
    const configurationInfo = data.swatches?.configuration_info ?? {};
    const variants: ParsedProductOption[] = [];

    for (const item of swatchItems) {
      for (const option of item.options ?? []) {
        const configuration = configurationInfo[String(option.value)];
        if (!configuration) {
          continue;
        }

        const label = option.unit
          ? `${option.label} ${option.unit}`
          : option.label;

        const offer: ParsedProduct = {
          name: configuration.name,
          brand: data.brand,
          price: configuration.final_price || undefined,
          inStock: configuration.is_in_stock,
          image: `${this.evaApiImageUrl}${
            configuration.media_gallery?.[0]?.image ?? data.image
          }`,
          link: `${this.evaUrl}${configuration.id}/`,
          storeName: this.storeName,
          variantId: String(configuration.id),
          options: option.unit ? { size: label } : { shade: label },
        };

        variants.push({
          optionId: String(configuration.id),
          label,
          isDefault: Boolean(option.is_selected),
          offers: [offer],
        });
      }
    }

    return variants;
  }

  protected async fetchByLink(link: string): Promise<ParsedStoreProduct | null> {
    const productId = this.extractIdFromUrl(link, /\/pr(\d+)/);
    if (!productId) {
      return null;
    }

    const apiLink = this.evaApiUrl + productId;
    const response = await axios.get<EvaByLinkResponse>(apiLink);
    const data = response.data?.data?.product ?? null;

    if (!data) return null;

    return this.mapProduct(data, link);
  }

  protected async fetchByNameAndBrand(
    searchProductName: string,
    searchProductBrand: string,
  ): Promise<ParsedStoreProduct | null> {
    const response = await axios.get<EvaSearchResponse>(this.evaApiSearchUrl, {
      params: { query: searchProductName },
    });
    const hits = response.data?.data?.hits ?? [];

    let bestProduct: EvaProduct | null = null;
    let bestScore = 0;

    for (const data of hits) {
      const resultBaseName = this.normalizeProductName(data.name, data.brand);
      const score = productNamesSimilarityScore(
        searchProductName,
        resultBaseName,
        searchProductBrand,
        data.brand,
      );

      if (score > bestScore) {
        bestScore = score;
        bestProduct = data;
      }
    }

    if (!bestProduct || bestScore <= 90) {
      return null;
    }

    return await this.fetchByLink(`${this.evaUrl}${bestProduct.id}/`);
  }
}
