import { ParsedProduct } from "@api/types/ParsedProduct.js";
import { StoreName } from "@api/types/StoreName.js";

export interface ParseResult {
  primaryStore: StoreName;
  products: Record<StoreName, ParsedProduct | null>;
}
