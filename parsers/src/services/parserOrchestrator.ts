import type { Product } from "../types/Product.js";
import { MakeupUAParser } from "./parsers/MakeupUAParser.js";
import { EvaParser } from "./parsers/EvaParser.js";
import { NotinoParser } from "./parsers/NotinoParser.js";
import type { StoreName } from "../types/StoreName.js";
import type { BaseParser } from "./parsers/BaseParser.js";

export class Parser {
    private readonly parsers: Record<StoreName, BaseParser>;
    constructor() {
        this.parsers = {
            eva: new EvaParser(),
            makeup: new MakeupUAParser(),
            notino: new NotinoParser(),
        };
    }

    private recognizeStoreName(link: string): StoreName | null {
        const url = new URL(link)

        if (url.hostname.endsWith('makeup.com.ua'))
            return 'makeup';
        else if (url.hostname.endsWith('eva.ua')) 
            return 'eva';
        else if (url.hostname.endsWith('notino.ua'))
            return 'notino'
        else
            return null
    }

    async getProductByLink(link: string): Promise<Record<StoreName, Product | null> | null> {
        const primaryStore: StoreName | null = this.recognizeStoreName(link);

        const parsedProducts: Record<StoreName, Product | null> = {
            eva: null,
            notino: null,
            makeup: null,
        }

        if (!primaryStore) {
            console.log('Unsupported link!');
            return null;
        }

        const primaryParser: BaseParser = this.parsers[primaryStore];
        const primaryProduct: (Product | null) = await primaryParser.parseByLink(link);

        if (!primaryProduct) {
            console.log('No product parsed from provided link');
            return null;
        }

        parsedProducts[primaryStore] = primaryProduct;

        const secondaryFetches = (Object.keys(parsedProducts) as StoreName[])
            .filter(store => !parsedProducts[store])
            .map(async (store) => {
                const secondaryParser = this.parsers[store];
                const secondaryProduct: (Product | null) = await secondaryParser.parseByName(primaryProduct.name, primaryProduct.brand);

                parsedProducts[store] = secondaryProduct;
            });
        await Promise.all(secondaryFetches);

        console.log(parsedProducts);

        return parsedProducts;
    }
}
