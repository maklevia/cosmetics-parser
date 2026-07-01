import axios from "axios";
import type { Product } from "@parsers/types/Product.js";
import type { EvaByLinkResponse, EvaSearchResponse } from "@parsers/types/EvaApi.js";
import { StoreName } from "@parsers/types/StoreName.js";
import { simplifyString } from "@parsers/utils/stringUtils.js";
import { BaseParser } from "./BaseParser.js";

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
    const brandSimplyfied: string = simplifyString(brand);
    const initialNameSimplyfied: string = simplifyString(initialName);

    const startIndex: number = initialNameSimplyfied.indexOf(brandSimplyfied);
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

  protected async fetchByLink(link: string): Promise<Product | null> {
    const productId = this.extractIdFromUrl(link, /\/pr(\d+)/);
    const apiLink = this.evaApiUrl + productId;

    const response = await axios.get<EvaByLinkResponse>(apiLink);
    const data = response.data?.data?.product ?? null;

    if (!data) return null;

    return {
      name: this.normalizeProductName(data.name, data.brand),
      brand: data.brand,
      price: data.final_price || undefined,
      inStock: data.stock.is_in_stock,
      image: `${this.evaApiImageUrl}${data.image}` || null,
      link,
      storeName: this.storeName,
    };
  }

  protected async fetchByNameAndBrand(
    searchProductName: string,
    searchProductBrand: string,
  ): Promise<Product | null> {
    const response = await axios.get<EvaSearchResponse>(this.evaApiSearchUrl, {
      params: { query: searchProductName },
    });
    const data = response.data?.data?.hits[0] ?? null;

    if (!data) return null;

    const resultName = this.normalizeProductName(data.name, data.brand);
    if (
      !this.validateMatch(
        searchProductName,
        searchProductBrand,
        resultName,
        data.brand,
      )
    ) {
      return null;
    }

    return {
      name: resultName,
      brand: data.brand,
      price: data.final_price || undefined,
      inStock: data.stock.is_in_stock,
      image: `${this.evaApiImageUrl}${data.image}` || null,
      link: `${this.evaUrl}${data.id}/`,
      storeName: this.storeName,
    };
  }
}
