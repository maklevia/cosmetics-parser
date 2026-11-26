import axios from "axios";
import { BaseParser } from "@api/parsers/BaseParser.js";
import { ParsedProduct, ParsedProductOption, ParsedStoreProduct, VariantOptions } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/Enums.js";
import { productNamesSimilarityScore, simplifyString, wordCount } from "@api/parsers/utils/stringUtils.js";
import { MakeupByLinkResponse, MakeupProduct, MakeupSearchResponse, MakeupVariant } from "@api/parsers/types/MakeupApi.js";

export class MakeupUAParser extends BaseParser {
    readonly storeName = StoreName.Makeup;

    private readonly makeupApiUrl: string = 'https://makeup.com.ua/shop/v1/products/';
    private readonly makeupApiSearchUrl: string = 'https://makeup.com.ua/shop/v1/search/products/';
    private readonly makeupUrl: string = 'https://makeup.com.ua/ua/product/';

    private titleOrSubtitle(title: string, subTitle: string, brand: string): string {
        const simplifiedSubTitle = simplifyString(subTitle);
        const simplifiedBrand = simplifyString(brand);

        if (simplifiedSubTitle.includes(simplifiedBrand) && wordCount(simplifiedSubTitle) > wordCount(simplifiedBrand)) {
            return subTitle;
        } else {
            return title;
        }
    }

    private inferVariantOptions(variant: MakeupVariant): VariantOptions {
        const title = variant.title.trim();
        const type = (variant.type ?? '').toLowerCase();
        const warehouse = variant.region === 'eu' || String(variant.id).endsWith('_3')
            ? 'eu'
            : 'ua';

        if (type.includes('color') || type.includes('shade')) {
            return { warehouse, shade: title };
        }

        if (type.includes('size') || type.includes('volume')) {
            return { warehouse, size: title };
        }

        if (/\d/.test(title) && /(мл|мл\.|г|гр|g|ml)/i.test(title)) {
            return { warehouse, size: title };
        }

        return { warehouse, shade: title };
    }

    private buildVariantOptions(data: MakeupProduct): ParsedProductOption[] {
        const allVariants = [
            ...(data.variants ?? []),
            ...(data.notAvailableVariants ?? []),
        ];

        const groupedVariants = new Map<string, MakeupVariant[]>();

        for (const variant of allVariants) {
            const optionId = String(variant.id).replace(/_3$/, '');
            const variants = groupedVariants.get(optionId) ?? [];
            variants.push(variant);
            groupedVariants.set(optionId, variants);
        }

        const defaultOptionId = data.defaultVariant
            ? String(data.defaultVariant.id).replace(/_3$/, '')
            : undefined;

        const options: ParsedProductOption[] = [];

        for (const [optionId, variants] of groupedVariants.entries()) {
            const sortedVariants = [...variants].sort((left, right) => {
                const leftIsEu = left.region === 'eu' || String(left.id).endsWith('_3');
                const rightIsEu = right.region === 'eu' || String(right.id).endsWith('_3');

                if (leftIsEu === rightIsEu) {
                    return 0;
                }

                return leftIsEu ? 1 : -1;
            });

            const offers: ParsedProduct[] = sortedVariants.map((variant) => ({
                name: variant.meta?.name ?? `${data.title} ${variant.title}`,
                brand: data.brand.title,
                price: variant.price?.current || undefined,
                inStock: variant.inStock,
                image: variant.media?.sizes?.sm?.url
                    ?? variant.media?.sizes?.sm?.thumbnail
                    ?? data.meta?.image
                    ?? undefined,
                link: `${this.makeupUrl}${data.id}/`,
                storeName: this.storeName,
                variantId: String(variant.id),
                options: this.inferVariantOptions(variant),
            }));

            options.push({
                optionId,
                label: sortedVariants[0]?.title ?? optionId,
                isDefault: defaultOptionId
                    ? defaultOptionId === optionId
                    : options.length === 0,
                offers,
            });
        }

        return options;
    }

    private mapProduct(data: MakeupByLinkResponse, link: string): ParsedStoreProduct {
        const baseName = this.titleOrSubtitle(data.title, data.subTitle, data.brand.title);
        const variants = this.buildVariantOptions(data);

        return {
            name: baseName,
            baseName,
            brand: data.brand.title,
            price: data.price?.current || undefined,
            inStock: data.inStock,
            image: data.meta?.image ?? data.media?.[0]?.sizes?.sm?.thumbnail ?? undefined,
            link,
            storeName: this.storeName,
            variantId: String(data.id),
            variants: variants.length > 0 ? variants : undefined,
        };
    }

    protected async fetchByLink(link: string): Promise<ParsedStoreProduct | null> {
        const productId = this.extractIdFromUrl(link, /\/product\/(\d+)/);
        if (!productId) {
            return null;
        }

        const apiLink = this.makeupApiUrl + productId;
        const response = await axios.get<MakeupByLinkResponse>(apiLink, {
            headers: { 'accept-language': 'uk' },
        });
        const data = response.data;

        if (!data) return null;

        return this.mapProduct(data, link);
    }

    protected async fetchByNameAndBrand(searchProductName: string, searchProductBrand: string): Promise<ParsedStoreProduct | null> {
        const cleanSearchProductName = simplifyString(searchProductName);

        const response = await axios.get<MakeupSearchResponse>(this.makeupApiSearchUrl, {
            params: { query: cleanSearchProductName },
            headers: { 'accept-language': 'uk' },
        });

        const responseData = response.data.products;
        if (!responseData) return null;

        let bestProductId: number | null = null;
        let bestScore = 0;

        for (const product of responseData) {
            if (product.type !== 'product') continue;

            const productName = this.titleOrSubtitle(product.title, product.subTitle, product.brand.title);
            const score = productNamesSimilarityScore(
                searchProductName,
                productName,
                searchProductBrand,
                product.brand.title,
            );

            if (score > bestScore) {
                bestScore = score;
                bestProductId = product.id;
            }
        }

        if (bestProductId === null || bestScore <= 90) {
            return null;
        }

        return await this.fetchByLink(`${this.makeupUrl}${bestProductId}/`);
    }
}
