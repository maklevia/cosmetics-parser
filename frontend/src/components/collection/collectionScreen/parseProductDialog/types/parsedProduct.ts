import type { StoreName } from "@/types/storeName";

export interface ProductRecord {
  name: string;
  brand: string;
  inStock: boolean;
  price?: number | undefined;
  image?: string | undefined;
  link: string;
  storeName: StoreName;
}
export interface ParsedProducts {
  eva: ProductRecord | null;
  makeup: ProductRecord | null;
  notino: ProductRecord | null;
}

export interface ParseResult {
  primaryStore: StoreName;
  products: ParsedProducts
}