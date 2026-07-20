import type { StoreName } from "./StoreName.js";

export interface Product {
    name: string;
    brand: string;
    price?: number | undefined;
    inStock: boolean;
    image?: string | undefined;
    link: string;
    storeName: StoreName;

    lowest30DayPrice?: number;
}

export interface StoreRecordRow {
    id: number;
    productId: number;
    storeName: StoreName;
    price: number | undefined;
    inStock: boolean;
    image: string | undefined;
    link: string;
    name: string;
}

export interface StoreRecordJoinProductRow extends StoreRecordRow {
    brand: string;
    lowest30DayPrice?: number;
}

export interface CollectionRow {
    id: number;
    productId: number; 
    userId: number;
}

export interface UserCollectionRow {
    productId: number;
    name: string;
    brand: string;
    image?: string | undefined;
    notifyOnPriceDrop: boolean;
}

export interface StoreRecordsForCronRow {
    recordId: number;
    link: string;
    storeName: StoreName;
    productId: number;
    price?: number;
}