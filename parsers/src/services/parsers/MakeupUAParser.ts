import axios from "axios";
import { BaseParser } from "./BaseParser.js";
import type { Product } from "../../types/Product.js";
import type { StoreName } from "../../types/StoreName.js";
import { simplifyString, wordCount } from "../../utils/stringUtils.js";

export class MakeupUAParser extends BaseParser {
    readonly storeName: StoreName = 'makeup';

    private readonly makeupApiUrl: string = 'https://makeup.com.ua/shop/v1/products/';
    private readonly makeupApiSearchUrl: string = 'https://makeup.com.ua/shop/v1/search/products/';
    private readonly makeupUrl: string = 'https://makeup.com.ua/ua/product/';

    private titleOrSubtitle(title: string, subTitle: string, brand: string): string {
        const simplyfiedSubTitle: string = simplifyString(subTitle);
        const simplyfiedBrand: string = simplifyString(brand);

        if (simplyfiedSubTitle.includes(simplyfiedBrand) && wordCount(simplyfiedSubTitle) > wordCount(simplyfiedBrand)) {
            return subTitle;
        } else {
            return title;
        }
    }

    protected async fetchByLink(link: string): Promise<Product | null> {
        const productId = this.extractIdFromUrl(link, /\/product\/(\d+)/);
        const apiLink = this.makeupApiUrl + productId;

        const response = await axios.get(apiLink, {
            headers: { 'accept-language': 'uk' },
        });
        const data = response.data;

        if (!data) return null;

        const productName = this.titleOrSubtitle(data.title, data.subTitle, data.brand.title);

        return {
            name: productName,
            brand: data.brand.title,
            price: data.price?.current || 0,
            inStock: data.inStock,
            image: data.meta?.image || null,
            link,
            storeName: this.storeName,
        };
    }

    protected async fetchByName(searchProductName: string, searchProductBrand: string): Promise<Product | null> {
        const cleanSearchProductName = simplifyString(searchProductName);

        const response = await axios.get(this.makeupApiSearchUrl, {
            params: { query: cleanSearchProductName },
            headers: { 'accept-language': 'uk' },
        });

        const responseData = response.data.products;
        if (!responseData) return null;

        for (const product of responseData) {
            if (product.type !== 'product') continue;

            if (this.validateMatch(searchProductName, searchProductBrand, product.title, product.brand.title)) {
                return {
                    name: product.title,
                    brand: product.brand.title,
                    price: product.price?.current || 0,
                    inStock: product.inStock,
                    image: product.media[0]?.sizes?.sm?.thumbnail || null,
                    link: `${this.makeupUrl}${product.id}/`,
                    storeName: this.storeName,
                };
            }
        }

        return null;
    }
}