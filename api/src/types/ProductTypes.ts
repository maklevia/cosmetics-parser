import { StoreRecord } from "@api/modules/product/StoreRecord.js";
import { StoreName } from "./Enums.js";

export interface CollectionProductResponse {
    name: string;
    brand: string;
    image: string | undefined;
    notifyOnPriceDrop: boolean;
    productId: number;
}

export interface VariantOptions {
    warehouse?: "ua" | "eu";
    shade?: string;
    size?: string;
}

export interface ParsedProduct {
    name: string;
    brand: string;
    price?: number;
    inStock: boolean;
    image?: string;
    link: string;
    storeName: StoreName;
    lowestMonthPrice?: number;
    variantId?: string;
    options?: VariantOptions;
}

export interface ParsedProductOption {
    optionId: string;
    label: string;
    isDefault: boolean;
    offers: ParsedProduct[];
}

export interface ParsedStoreProduct extends ParsedProduct {
    variants?: ParsedProductOption[];
}

export interface ParseResult {
  primaryStore: StoreName;
  products: Record<StoreName, ParsedProduct | null>;
}

export interface NeedsVariantParseResult {
  primaryStore: StoreName;
  product: {
    name: string;
    brand: string;
    image?: string;
  };
  options: ParsedProductOption[];
}

export type ParseResponse =
  | ({ status: "needs_variant" } & NeedsVariantParseResult)
  | ({ status: "parsed"; productId: number } & ParseResult);

export type StoreRecordWithLowestPrice = StoreRecord & {
  lowestMonthPrice?: number;
};
