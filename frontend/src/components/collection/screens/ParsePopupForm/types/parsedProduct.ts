import type { StoreName } from "@fe/types/store.typedefs";

export interface ProductRecord {
  name: string;
  brand: string;
  inStock: boolean;
  price?: number;
  image?: string;
  link: string;
  storeName: StoreName;
  lowestMonthPrice?: number;
}
export interface ParsedProducts {
  eva: ProductRecord | null;
  makeup: ProductRecord | null;
  notino: ProductRecord | null;
}

export interface ParseResult {
  products: ParsedProducts;
}
