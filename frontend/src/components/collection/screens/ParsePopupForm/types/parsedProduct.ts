import type { StoreName } from "@fe/types/store.typedefs";

export interface ProductRecord {
  name: string;
  brand: string;
  inStock: boolean;
  price?: number | undefined;
  image?: string | undefined;
  link: string;
  storeName: StoreName;
  lowest30DayPrice?: number;
}
export interface ParsedProducts {
  eva: ProductRecord | null;
  makeup: ProductRecord | null;
  notino: ProductRecord | null;
}

export interface ParseResult {
  products: ParsedProducts
}