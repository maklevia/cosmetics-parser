import type { StoreName } from "@api/types/StoreName.js";

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