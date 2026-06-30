import type { Product } from "@parsers/types/Product.js";
import { MakeupUAParser } from "./parsers/MakeupUAParser.js";
import { EvaParser } from "./parsers/EvaParser.js";
import { NotinoParser } from "./parsers/NotinoParser.js";
import { StoreName } from "@parsers/types/StoreName.js";
import type { BaseParser } from "./parsers/BaseParser.js";

export class Parser {
    private readonly parsers: Record<StoreName, BaseParser>;
    constructor() {
        this.parsers = {
            [StoreName.Eva]: new EvaParser(),
            [StoreName.Makeup]: new MakeupUAParser(),
            [StoreName.Notino]: new NotinoParser(),
        };
    }

    private recognizeStoreName(link: string): StoreName | null {
        const url = new URL(link)

        if (url.hostname.endsWith('makeup.com.ua'))
            return StoreName.Makeup;
        else if (url.hostname.endsWith('eva.ua')) 
            return StoreName.Eva;
        else if (url.hostname.endsWith('notino.ua'))
            return StoreName.Notino;
        else
            return null
    }

    async getProductByLink(link: string): Promise<Record<StoreName, Product | null> | null> {
        const primaryStore = this.recognizeStoreName(link);

        const parsedProducts: Record<StoreName, Product | null> = {
            [StoreName.Eva]: null,
            [StoreName.Notino]: null,
            [StoreName.Makeup]: null,
        }

        if (!primaryStore) {
            console.log('Unsupported link!');
            return null;
        }

        const primaryParser = this.parsers[primaryStore];
        const primaryProduct = await primaryParser.parseByLink(link);

        if (!primaryProduct) {
            console.log('No product parsed from provided link');
            return null;
        }

        parsedProducts[primaryStore] = primaryProduct;

        const secondaryFetches = (Object.keys(parsedProducts) as StoreName[])
            .filter(store => !parsedProducts[store])
            .map(async (store) => {
                const secondaryParser = this.parsers[store];
                const secondaryProduct: (Product | null) = await secondaryParser.parseByNameAndBrand(primaryProduct.name, primaryProduct.brand);

                parsedProducts[store] = secondaryProduct;
            });
        await Promise.allSettled(secondaryFetches);

        console.log(parsedProducts);

        return parsedProducts;
    }
}
