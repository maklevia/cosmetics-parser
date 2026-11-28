import type { StoreName } from "@fe/types/store.typedefs";

export interface VariantOptions {
  warehouse?: "ua" | "eu";
  shade?: string;
  size?: string;
}

export interface ProductRecord {
  name: string;
  brand: string;
  inStock: boolean;
  price?: number;
  image?: string;
  link: string;
  storeName: StoreName;
  lowestMonthPrice?: number;
  variantId?: string;
  options?: VariantOptions;
}

export interface ParsedProducts {
  eva: ProductRecord[];
  makeup: ProductRecord[];
  notino: ProductRecord[];
}

export interface ParsedProductOption {
  optionId: string;
  label: string;
  isDefault: boolean;
  offers: ProductRecord[];
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

export interface ParsedParseResult {
  primaryStore: StoreName;
  products: ParsedProducts;
}

export type ParseResponse =
  | ({ status: "needs_variant" } & NeedsVariantParseResult)
  | ({ status: "parsed"; productId: number } & ParsedParseResult);
