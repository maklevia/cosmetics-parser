import { Product } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";

export interface ParseResult extends ProductStoreRecords {
  primaryStore: StoreName;
  products: Record<StoreName, Product | null>;
}

export interface ProductStoreRecords {
  
}
