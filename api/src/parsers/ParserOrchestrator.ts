import { ParsedProduct, ParsedProductOption, ParsedStoreProduct, VariantOptions } from "@api/types/ProductTypes.js";
import { MakeupUAParser } from "@api/parsers/stores/MakeupUAParser.js";
import { EvaParser } from "@api/parsers/stores/EvaParser.js";
import { NotinoParser } from "@api/parsers/stores/NotinoParser.js";
import { StoreName } from "@api/types/Enums.js";
import type { BaseParser } from "@api/parsers/BaseParser.js";
import { BadGatewayError, ValidationError } from "@api/errors/AppError.js";
import { normalizeVariantValue } from "@api/parsers/utils/stringUtils.js";

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
    let url: URL;

    try {
      url = new URL(link);
    } catch {
      throw new ValidationError("Provided link is invalid");
    }

    const path = url.pathname;

    if (url.hostname.endsWith("makeup.com.ua") && /\/product\/\d+/.test(path)) {
      return StoreName.Makeup;
    }

    if (url.hostname.endsWith("eva.ua") && /\/pr\d+/.test(path)) {
      return StoreName.Eva;
    }

    if (
      url.hostname.endsWith("notino.ua") &&
      path.split("/").filter(Boolean).length >= 2
    ) {
      return StoreName.Notino;
    }

    throw new ValidationError("Provided link is not supported");
  }

  getStoreNameFromLink(link: string): StoreName {
    return this.recognizeStoreName(link);
  }

  extractVariantIdFromLink(storeName: StoreName, link: string): string | null {
    if (storeName === StoreName.Eva) {
      return link.match(/\/pr(\d+)/)?.[1] ?? null;
    }

    if (storeName === StoreName.Notino) {
      return link.match(/\/p-(\d+)/)?.[1] ?? null;
    }

    return null;
  }

  async getPrimaryProductByLink(
    link: string,
  ): Promise<{ storeName: StoreName; product: ParsedStoreProduct }> {
    const storeName = this.recognizeStoreName(link);
    const product = await this.parsers[storeName].parseByLink(link);

    if (!product) {
      throw new BadGatewayError(
        "Could not parse product from the provided link",
      );
    }

    return { storeName, product };
  }

  async findVariantOffersInStore(
    storeName: StoreName,
    baseName: string,
    brand: string,
    selectedOptions: VariantOptions,
  ): Promise<ParsedProduct[]> {
    const preview = await this.parsers[storeName].parseByNameAndBrand(
      baseName,
      brand,
    );

    if (!preview) {
      return [];
    }

    if (!preview.variants?.length) {
      return this.productMatchesSelectedOptions(preview, selectedOptions)
        ? [preview]
        : [];
    }

    if (!selectedOptions.shade && !selectedOptions.size) {
      return preview.variants.length === 1 ? preview.variants[0].offers : [];
    }

    const matchingOptions = preview.variants.filter((option) =>
      this.optionMatchesSelectedOptions(option, selectedOptions),
    );

    if (matchingOptions.length !== 1) {
      return [];
    }

    return matchingOptions[0].offers;
  }

  async parseSingleProduct(
    link: string,
    variantId?: string,
  ): Promise<ParsedStoreProduct | null> {
    const storeName = this.recognizeStoreName(link);
    const product = await this.parsers[storeName].parseByLink(link);

    if (!product || !variantId) {
      return product;
    }

    return this.parsers[storeName].selectOffer(product, variantId);
  }

  selectOfferFromProduct(
    storeName: StoreName,
    product: ParsedStoreProduct,
    variantId: string,
  ): ParsedProduct | null {
    return this.parsers[storeName].selectOffer(product, variantId);
  }

  async parseSpecificStoreByProductNameAndBrand(
    storeName: StoreName,
    productName: string,
    productBrand: string,
  ): Promise<ParsedStoreProduct | null> {
    const product = await this.parsers[storeName].parseByNameAndBrand(
      productName,
      productBrand,
    );
    return product;
  }

  private optionMatchesSelectedOptions(
    option: ParsedProductOption,
    selectedOptions: VariantOptions,
  ): boolean {
    const offer = option.offers[0];
    if (!offer) return false;

    return this.productMatchesSelectedOptions(offer, selectedOptions);
  }

  private productMatchesSelectedOptions(
    product: ParsedProduct,
    selectedOptions: VariantOptions,
  ): boolean {
    if (
      !this.variantValueMatches(
        selectedOptions.shade,
        product.options?.shade,
        product.name,
      )
    ) {
      return false;
    }

    if (
      !this.variantValueMatches(
        selectedOptions.size,
        product.options?.size,
        product.name,
      )
    ) {
      return false;
    }

    return true;
  }

  private variantValueMatches(
    selectedValue: string | undefined,
    candidateValue: string | undefined,
    candidateName: string,
  ): boolean {
    if (!selectedValue) {
      return true;
    }

    if (candidateValue) {
      return (
        normalizeVariantValue(candidateValue) ===
        normalizeVariantValue(selectedValue)
      );
    }

    return normalizeVariantValue(candidateName).includes(
      normalizeVariantValue(selectedValue),
    );
  }
}
