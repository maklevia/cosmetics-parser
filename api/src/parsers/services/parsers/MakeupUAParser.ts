import axios from "axios";
import { BaseParser } from "@api/parsers/services/parsers/BaseParser.js";
import type { ParsedProduct } from "@api/types/ParsedProduct.js";
import { StoreName } from "@api/types/StoreName.js";
import { simplifyString, wordCount } from "@api/parsers/utils/stringUtils.js";
import { MakeupByLinkResponse, MakeupSearchResponse } from "@api/parsers/types/MakeupApi.js";

export class MakeupUAParser extends BaseParser {
    readonly storeName = StoreName.Makeup;

    private readonly makeupApiUrl: string = 'https://makeup.com.ua/shop/v1/products/';
    private readonly makeupApiSearchUrl: string = 'https://makeup.com.ua/shop/v1/search/products/';
    private readonly makeupUrl: string = 'https://makeup.com.ua/ua/product/';

    private titleOrSubtitle(title: string, subTitle: string, brand: string): string {
        const simplyfiedSubTitle = simplifyString(subTitle);
        const simplyfiedBrand = simplifyString(brand);

        if (simplyfiedSubTitle.includes(simplyfiedBrand) && wordCount(simplyfiedSubTitle) > wordCount(simplyfiedBrand)) {
            return subTitle;
        } else {
            return title;
        }
    }

    protected async fetchByLink(link: string): Promise<ParsedProduct | null> {
        const productId = this.extractIdFromUrl(link, /\/product\/(\d+)/);
        const apiLink = this.makeupApiUrl + productId;

        const response = await axios.get<MakeupByLinkResponse>(apiLink, {
            headers: { 'accept-language': 'uk' },
        });
        const data = response.data;

        if (!data) return null;

        const productName = this.titleOrSubtitle(data.title, data.subTitle, data.brand.title);

        return {
            name: productName,
            brand: data.brand.title,
            price: data.price?.current || undefined,
            inStock: data.inStock,
            image: data.meta?.image || undefined,
            link,
            storeName: this.storeName,
        };
    }

    protected async fetchByNameAndBrand(searchProductName: string, searchProductBrand: string): Promise<ParsedProduct | null> {
        const cleanSearchProductName = simplifyString(searchProductName);

        const response = await axios.get<MakeupSearchResponse>(this.makeupApiSearchUrl, {
            params: { query: cleanSearchProductName },
            headers: { 'accept-language': 'uk' },
        });

        const responseData = response.data.products;
        if (!responseData) return null;

        for (const product of responseData) {
            if (product.type !== 'product') continue;

            const productName = this.titleOrSubtitle(product.title, product.subTitle, product.brand.title);

            if (this.validateMatch(searchProductName, searchProductBrand, productName, product.brand.title)) {
                return {
                    name: productName,
                    brand: product.brand.title,
                    price: product.price?.current || undefined,
                    inStock: product.inStock,
                    image: product.media[0]?.sizes?.sm?.thumbnail || undefined,
                    link: `${this.makeupUrl}${product.id}/`,
                    storeName: this.storeName,
                };
            }
        }

        return null;
    }
}
