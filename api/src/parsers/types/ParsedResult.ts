import { Product } from "@api/parsers/types/Product.js";
import { StoreName } from "@api/parsers/types/StoreName.js";

export interface ParseResult {
  primaryStore: StoreName;
  products: Record<StoreName, Product | null>;   
}