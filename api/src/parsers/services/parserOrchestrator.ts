import type { Product } from "@api/types/ProductTypes.js";
import { MakeupUAParser } from "./parsers/MakeupUAParser.js";
import { EvaParser } from "./parsers/EvaParser.js";
import { NotinoParser } from "./parsers/NotinoParser.js";
import { StoreName } from "@api/types/StoreName.js";
import type { BaseParser } from "./parsers/BaseParser.js";
import {
  InvalidLinkError,
  ParserError,
} from "@api/parsers/errors/ParserErrors.js";
import { ParseResult } from "@api/types/ParsedResult.js";

export class Parser {
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
      else throw new InvalidLinkError();
    } catch (error) {
      throw new InvalidLinkError();
    }
  }

  async getProductByLink(
    link: string,
  ): Promise<ParseResult> {
    const primaryStore = this.recognizeStoreName(link);

    const primaryParser = this.parsers[primaryStore];
    const primaryProduct = await primaryParser.parseByLink(link);

    if (!primaryProduct) {
      throw new ParserError();
    }

    const parsedProducts: Record<StoreName, Product | null> = {
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

    console.log(parsedProducts);

    return {primaryStore: primaryStore, products: parsedProducts};
  }
}
