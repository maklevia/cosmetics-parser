import { StoreRecord } from "@api/entities/StoreRecord.js";
import { StoreName } from "./Enums.js";

export interface CollectionProductResponse {
    name: string;
    brand: string;
    image: string | undefined;
    notifyOnPriceDrop: boolean;
    productId: number;
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
}

export interface ParseResult {
  primaryStore: StoreName;
  products: Record<StoreName, ParsedProduct | null>;
}

export type StoreRecordWithLowestPrice = StoreRecord & {
  lowestMonthPrice?: number;
};
