import axios from "axios";
import type { Product } from "../../types/Product.js";
import type { StoreName } from "../../types/StoreName.js";
import { BaseParser } from "./BaseParser.js";
import { simplifyString } from "../../utils/stringUtils.js";

export class EvaParser extends BaseParser {
    readonly storeName: StoreName = 'eva';

    private readonly evaApiUrl: string = 'https://api.eva.ua/v1/ua/api/products/';
    private readonly evaApiImageUrl: string = 'https://pwa-api.eva.ua/img/512/512/resize';
    private readonly evaApiSearchUrl: string = 'https://api.eva.ua/v1/ua/api/search/';
    private readonly evaUrl: string = 'https://eva.ua/ua/pr';

    private normalizeProductName(initialName: string, brand: string): string {
        const brandSimplyfied: string = simplifyString(brand);
        const initialNameSimplyfied: string = simplifyString(initialName);

        const startIndex: number = initialNameSimplyfied.indexOf(brandSimplyfied);
        const checkedStartIndex: number = startIndex === -1 ? 0 : startIndex;

        const endIndex: number = initialName.indexOf(',');
        const checkedEndIndex: number = endIndex === -1 ? initialName.length : endIndex;

        const normalizedName: string = initialName.substring(checkedStartIndex, checkedEndIndex);
        return normalizedName;
    }

    protected async fetchByLink(link: string): Promise<Product | null> {
        const productId = this.extractIdFromUrl(link, /\/pr(\d+)/);
        const apiLink = this.evaApiUrl + productId;

        const response = await axios.get(apiLink);
        const data = response.data?.data?.product || null;

        if (!data) return null;

        return {
            name: this.normalizeProductName(data.name, data.brand),
            brand: data.brand,
            price: data.final_price || 0,
            inStock: data.stock.is_in_stock,
            image: `${this.evaApiImageUrl}${data.image}` || null,
            link,
            storeName: this.storeName,
        };
    }

    protected async fetchByName(searchProductName: string, searchProductBrand: string): Promise<Product | null> {
        const response = await axios.get(this.evaApiSearchUrl, {
            params: { query: searchProductName },
        });
        const data = response.data?.data?.hits[0] || null;

        if (!data) return null;

        const resultName = this.normalizeProductName(data.name, data.brand);
        if (!this.validateMatch(searchProductName, searchProductBrand, resultName, data.brand)) {
            return null;
        }

        return {
            name: resultName,
            brand: data.brand,
            price: data.final_price || 0,
            inStock: data.stock.is_in_stock,
            image: `${this.evaApiImageUrl}${data.image}` || null,
            link: `${this.evaUrl}${data.id}/`,
            storeName: this.storeName,
        };
    }
}
