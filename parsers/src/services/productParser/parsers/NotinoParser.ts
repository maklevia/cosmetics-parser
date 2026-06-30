import { gotScraping } from 'got-scraping';
import type { Product } from "@parsers/types/Product.js";
import { StoreName } from "@parsers/types/StoreName.js";
import { BaseParser } from "./BaseParser.js";

export class NotinoParser extends BaseParser {
    readonly storeName = StoreName.Notino;

    private readonly notinoSearchUrl: string = 'https://www.notino.ua/search.asp?exps=';

    private normalizeInStockParam(link: string): boolean {
        return link.includes('InStock');
    }

    private extractLdJson(body: string, predicate: (parsed: any) => boolean): any | null {
        const jsonMatches = body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
        for (const match of jsonMatches) {
            try {
                const parsed = JSON.parse(match[1]);
                if (predicate(parsed)) return parsed;
            } catch {}
        }
        return null;
    }

    protected async fetchByLink(link: string): Promise<Product | null> {
        const { body } = await gotScraping({
            url: link,
            headerGeneratorOptions: {
                browsers: ['chrome'],
                operatingSystems: ['windows'],
                locales: ['uk-UA'],
            },
        });

        const data = this.extractLdJson(body, (p) => p?.['@type'] === 'Product');
        if (!data) return null;

        return {
            name: data.name,
            brand: data.brand.name,
            price: data?.offers[0]?.price || undefined,
            inStock: this.normalizeInStockParam(data.offers[0].availability),
            image: data.image[0] || null,
            link,
            storeName: this.storeName,
        };
    }

    protected async fetchByNameAndBrand(searchProductName: string, searchProductBrand: string): Promise<Product | null> {
        const { body } = await gotScraping({ url: this.notinoSearchUrl + searchProductName });

        const searchResult = this.extractLdJson(body, (p) => p?.description === 'підсумок пошуку');
        if (!searchResult) return null;

        const productUrl = searchResult.mainEntity[0]?.offers?.url;
        if (!productUrl) return null;

        const product = await this.fetchByLink(productUrl);
        if (!product) return null;

        if (!this.validateMatch(searchProductName, searchProductBrand, product.name, product.brand)) {
            return null;
        }

        return product;
    }
}
