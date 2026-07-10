import type { StoreName } from "./StoreName.js";

export interface Product {
    name: string;
    brand: string;
    price?: number | undefined;
    inStock: boolean;
    image?: string | undefined;

    link: string;
    storeName: StoreName;
}
