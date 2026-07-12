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

export interface StoreRecordRow {
    id: number,
    product_id: number, 
    store_name: StoreName,
    latest_price: number | undefined,
    in_stock: boolean,
    image: string | undefined,
    link: string,
    product_store_name: string,
}

export interface StoreRecordJoinProductRow extends StoreRecordRow {
    brand: string;
}

export interface CollectionRow {
    id: number,
    product_id: number, 
    user_id: number,
}