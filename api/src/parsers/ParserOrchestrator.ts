import { ParsedProduct } from "@api/types/ProductTypes.js";
import { MakeupUAParser } from "@api/parsers/stores/MakeupUAParser.js";
import { EvaParser } from "@api/parsers/stores/EvaParser.js";
import { NotinoParser } from "@api/parsers/stores/NotinoParser.js";
import { StoreName } from "@api/types/Enums.js";
import type { BaseParser } from "@api/parsers/BaseParser.js";
import { ParseResult } from "@api/types/ProductTypes.js";
import { BadGatewayError, ValidationError } from "@api/errors/AppError.js";

export class ParserOrchestrator {
  private readonly parsers: Record<StoreName, BaseParser>;
  constructor() {
    this.parsers = {
      [StoreName.Eva]: new EvaParser(),
      [StoreName.Makeup]: new MakeupUAParser(),
      [StoreName.Notino]: new NotinoParser(),
    };
  }

  private recognizeStoreName(link: string): StoreName {
    try {
      const url = new URL(link);
      const path = url.pathname;
      //link is for makeup and for product (contains /product)
      if (url.hostname.endsWith("makeup.com.ua") && /\/product\/\d+/.test(path))
        return StoreName.Makeup;
      //link is for eva and for product (contains /pr)
      else if (url.hostname.endsWith("eva.ua") && /\/pr\d+/.test(path))
        return StoreName.Eva;
      //link is for notino and there are at least 2 parts in the path
      else if (
        url.hostname.endsWith("notino.ua") &&
        path.split("/").filter(Boolean).length >= 2
      )
        return StoreName.Notino;
      else throw new ValidationError("Provided link is not supported");
    } catch (error) {
      throw new ValidationError("Provided link is invalid");
    }
  }

  async getProductByLink(link: string): Promise<ParseResult> {
    const primaryStore = this.recognizeStoreName(link);

    const primaryParser = this.parsers[primaryStore];
    const primaryProduct = await primaryParser.parseByLink(link);

    if (!primaryProduct) {
      throw new BadGatewayError(
        "Could not parse product from the provided link",
      );
    }

    const parsedProducts: Record<StoreName, ParsedProduct | null> = {
      [StoreName.Eva]: null,
      [StoreName.Notino]: null,
      [StoreName.Makeup]: null,
    };

    parsedProducts[primaryStore] = primaryProduct;

    const secondaryFetches = (Object.keys(parsedProducts) as StoreName[])
      .filter((store) => !parsedProducts[store])
      .map(async (store) => {
        const secondaryParser = this.parsers[store];
        const secondaryProduct = await secondaryParser.parseByNameAndBrand(
          primaryProduct.name,
          primaryProduct.brand,
        );

        parsedProducts[store] = secondaryProduct;
      });
    await Promise.allSettled(secondaryFetches);

    return { primaryStore: primaryStore, products: parsedProducts };
  }

  async parseSingleProduct(link: string): Promise<ParsedProduct | null> {
    const storeName = this.recognizeStoreName(link);
    return await this.parsers[storeName].parseByLink(link);
  }

  async parseSpecificStoreByProductNameAndBrand(
    storeName: StoreName,
    productName: string,
    productBrand: string,
  ): Promise<ParsedProduct | null> {
    const product = await this.parsers[storeName].parseByNameAndBrand(productName, productBrand);
    return product;
  }
}
