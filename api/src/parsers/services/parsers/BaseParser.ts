import {
  ParserError,
  StoreRequestError,
} from "@api/parsers/errors/ParserErrors.js";
import type { Product } from "@api/types/ProductTypes.js";
import type { StoreName } from "@api/types/StoreName.js";
import { checkProductNamesSimilarity } from "@api/parsers/utils/stringUtils.js";
import axios from "axios";

export abstract class BaseParser {
  abstract readonly storeName: StoreName;

  protected abstract fetchByLink(link: string): Promise<Product | null>;
  protected abstract fetchByNameAndBrand(
    searchProductName: string,
    searchProductBrand: string,
  ): Promise<Product | null>;

  async parseByLink(link: string): Promise<Product | null> {
    try {
      const product = await this.fetchByLink(link);
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      const isAxiosNetworkError = axios.isAxiosError(error);
      let isGotScrapingError = false;
      if (error instanceof Error) {
        isGotScrapingError =
          error.name === "HTTPError" ||
          error.name === "RequestError" ||
          error.name === "TimeoutError";
      }
      if (isAxiosNetworkError || isGotScrapingError) {
        throw new StoreRequestError(this.storeName);
      }

      throw new ParserError();
    }
  }

  async parseByNameAndBrand(
    searchProductName: string,
    searchProductBrand: string,
  ): Promise<Product | null> {
    try {
      const product = await this.fetchByNameAndBrand(
        searchProductName,
        searchProductBrand,
      );
      if (!product) {
        console.log(`No matching result on ${this.storeName}`);
        return null;
      }
      return product;
    } catch (error) {
      const isAxiosNetworkError = axios.isAxiosError(error);
      let isGotScrapingError = false;
      if (error instanceof Error) {
        isGotScrapingError =
          error.name === "HTTPError" ||
          error.name === "RequestError" ||
          error.name === "TimeoutError";
      }
      if (isAxiosNetworkError || isGotScrapingError) {
        throw new StoreRequestError(this.storeName);
      }

      throw new ParserError();
    }
  }

  protected extractIdFromUrl(link: string, pattern: RegExp): string | null {
    const match = link.match(pattern);
    return match?.[1] ?? null;
  }

  protected validateMatch(
    searchName: string,
    searchBrand: string,
    resultName: string,
    resultBrand: string,
  ): boolean {
    return checkProductNamesSimilarity(
      searchName,
      resultName,
      searchBrand,
      resultBrand,
    );
  }
}
