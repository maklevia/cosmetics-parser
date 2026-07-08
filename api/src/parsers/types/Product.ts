import type { StoreName } from "./StoreName.js";

export interface Product {
    name: string;
    brand: string;
    price?: number | undefined;
    inStock: boolean;
    image?: string | null;

    link: string;
    storeName: StoreName;
}
