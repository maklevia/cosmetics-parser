import type { Product } from "../../types/Product.js";
import type { StoreName } from "../../types/StoreName.js";
import { checkProductNamesSimilarity } from "../../utils/stringUtils.js";

export abstract class BaseParser {
    abstract readonly storeName: StoreName;

    protected abstract fetchByLink(link: string): Promise<Product | null>;
    protected abstract fetchByName(searchProductName: string, searchProductBrand: string): Promise<Product | null>;

    async parseByLink(link: string): Promise<Product | null> {
        try {
            const product = await this.fetchByLink(link);
            if (!product) {
                console.log(`Empty response from ${this.storeName}`);
                return null;
            }
            return product;
        } catch (error) {
            console.log(`Error parsing link from ${this.storeName}: `, error);
            return null;
        }
    }

    async parseByName(
        searchProductName: string,
        searchProductBrand: string,
    ): Promise<Product | null> {
        try {
            const product = await this.fetchByName(searchProductName, searchProductBrand);
            if (!product) {
                console.log(`No matching result on ${this.storeName}`);
                return null;
            }
            return product;
        } catch (error) {
            console.log(`Error parsing by name from ${this.storeName}: `, error);
            return null;
        }
    }

    protected extractIdFromUrl(link: string, pattern: RegExp): string | null {
        const match = link.match(pattern);
        return match?.[1] ?? null;
    }

    protected validateMatch(
        searchName: string,
        searchBrand: string,
        resultName: string,
        resultBrand: string,
    ): boolean {
        return checkProductNamesSimilarity(searchName, resultName, searchBrand, resultBrand);
    }
}