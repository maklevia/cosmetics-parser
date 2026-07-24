import { Product } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";

export interface ParseResult {
  primaryStore: StoreName;
  products: Record<StoreName, Product | null>;
}
