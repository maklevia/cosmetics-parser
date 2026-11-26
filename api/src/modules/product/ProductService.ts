import { ParserOrchestrator } from "@api/parsers/ParserOrchestrator.js";
import {
  CollectionProductResponse,
  ParsedProduct,
  ParseResponse,
  ParseResult,
  ParsedStoreProduct,
  StoreRecordWithLowestPrice,
  VariantOptions,
} from "@api/types/ProductTypes.js";
import { ProductRepository } from "@api/modules/product/ProductRepository.js";
import { StoreName } from "@api/types/Enums.js";
import { DAY } from "@api/utils/time.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@api/errors/AppError.js";

const parser = new ParserOrchestrator();
const productRepository = new ProductRepository();

export class ProductService {
  async parse(
    productLink: string,
    variantId?: string,
  ): Promise<ParseResponse> {
    const storeName = parser.getStoreNameFromLink(productLink);

    const cacheVariantIds = this.getCacheVariantIds(
      storeName,
      productLink,
      variantId,
    );

    if (cacheVariantIds.length > 0) {
      const storeRecord = await productRepository.findStoreRecordByVariantIds(
        storeName,
        cacheVariantIds,
      );

      if (storeRecord) {
        return this.getExistingProductResponse(storeRecord);
      }
    }

    const { product } = await parser.getPrimaryProductByLink(productLink);

    if (variantId) {
      return this.parseSelectedVariant(storeName, product, variantId);
    }

    if (product.variants && product.variants.length > 1) {
      return {
        status: "needs_variant",
        primaryStore: storeName,
        product: {
          name: product.baseName ?? product.name,
          brand: product.brand,
          image: product.image,
        },
        options: product.variants,
      };
    }

    const primaryOffers =
      product.variants && product.variants.length === 1
        ? product.variants[0].offers
        : [product];

    return this.parseAndSaveProduct(storeName, product, primaryOffers);
  }

  async addProductToUsersCollection(
    userId: number,
    productId: number,
  ): Promise<void> {
    const collectionRecord =
      await productRepository.findCollectionByUserProductId(userId, productId);

    if (collectionRecord) {
      throw new ConflictError("This product is already in your collection");
    } else {
      await productRepository.createCollection(userId, productId);
    }
  }

  async getCollection(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ products: CollectionProductResponse[]; totalCount: number }> {
    const [collection, totalCount] = await Promise.all([
      productRepository.getUserCollection(userId, limit, offset),
      productRepository.getUserCollectionCount(userId),
    ]);

    const products = collection.map((c) => ({
      name: c.product.name,
      brand: c.product.brand,
      image: c.product.image ?? undefined,
      notifyOnPriceDrop: c.notifyOnPriceDrop,
      productId: c.product.id,
    }));

    return { products, totalCount };
  }

  async getProductStoreRecords(
    productId: number,
  ): Promise<Record<StoreName, ParsedProduct[]>> {
    const storeRecords =
      await productRepository.getStoreRecordsWithProductId(productId);

    if (storeRecords.length === 0) {
      throw new NotFoundError("No store records found for this product");
    }

    const storeProducts: Record<StoreName, ParsedProduct[]> = {
      eva: [],
      notino: [],
      makeup: [],
    };

    for (const product of storeRecords) {
      storeProducts[product.storeName].push(
        this.mapToParsedProduct(product),
      );
    }

    return storeProducts;
  }

  async deleteProductFromCollection(
    userId: number,
    productId: number,
  ): Promise<void> {
    await productRepository.deleteCollectionRecord(userId, productId);
  }

  private getCacheVariantIds(
    storeName: StoreName,
    productLink: string,
    variantId?: string,
  ): string[] {
    if (variantId) {
      return storeName === StoreName.Makeup
        ? [variantId, `${variantId}_3`]
        : [variantId];
    }

    if (storeName === StoreName.Makeup) {
      return [];
    }

    const urlVariantId = parser.extractVariantIdFromLink(
      storeName,
      productLink,
    );

    return urlVariantId ? [urlVariantId] : [];
  }

  private async getExistingProductResponse(
    storeRecord: StoreRecordWithLowestPrice,
  ): Promise<ParseResponse> {
    const productId = storeRecord.product.id;
    const primaryStoreName = storeRecord.storeName;

    const existingStoreRecords =
      await productRepository.getStoreRecordsWithProductId(productId);

    await this.ensureUpdatedRecords(existingStoreRecords);

    const products = this.groupStoreRecordsByStore(existingStoreRecords);

    return {
      status: "parsed",
      productId,
      primaryStore: primaryStoreName,
      products,
    };
  }

  private async parseSelectedVariant(
    storeName: StoreName,
    product: ParsedStoreProduct,
    variantId: string,
  ): Promise<ParseResponse> {
    const option = product.variants?.find(
      (option) => option.optionId === variantId,
    );

    const primaryOffers = option
      ? option.offers
      : product.variantId === variantId
        ? [product]
        : null;

    if (!primaryOffers) {
      throw new ValidationError("Selected variant was not found");
    }

    return this.parseAndSaveProduct(storeName, product, primaryOffers);
  }

  private async parseAndSaveProduct(
    storeName: StoreName,
    product: ParsedStoreProduct,
    primaryOffers: ParsedProduct[],
  ): Promise<ParseResponse> {
    const selectedOptions = this.getSelectedOptions(primaryOffers);

    const products: Record<StoreName, ParsedProduct[]> = {
      eva: [],
      notino: [],
      makeup: [],
    };

    products[storeName] = primaryOffers;

    const secondaryStores = (Object.keys(products) as StoreName[]).filter(
      (store) => store !== storeName,
    );

    const secondaryFetches = secondaryStores.map(async (store) => {
      products[store] = await parser.findVariantOffersInStore(
        store,
        product.baseName ?? product.name,
        product.brand,
        selectedOptions,
      );
    });

    await Promise.allSettled(secondaryFetches);

    const parseResult: ParseResult = {
      primaryStore: storeName,
      products,
    };

    const productId = await productRepository.saveParsedProduct(
      primaryOffers,
      parseResult,
    );

    return {
      status: "parsed",
      productId,
      primaryStore: storeName,
      products,
    };
  }

  private getSelectedOptions(offers: ParsedProduct[]): VariantOptions {
    const offer = offers.find((offer) => offer.options?.shade || offer.options?.size);
    return offer?.options ?? {};
  }

  private groupStoreRecordsByStore(
    records: StoreRecordWithLowestPrice[],
  ): Record<StoreName, ParsedProduct[]> {
    const products: Record<StoreName, ParsedProduct[]> = {
      eva: [],
      notino: [],
      makeup: [],
    };

    for (const record of records) {
      products[record.storeName].push(this.mapToParsedProduct(record));
    }

    return products;
  }

  private mapToParsedProduct(
    product: StoreRecordWithLowestPrice,
  ): ParsedProduct {
    return {
      name: product.productStoreName,
      brand: product.product.brand,
      price: product.latestPrice ?? undefined,
      inStock: product.inStock,
      image: product.image ?? undefined,
      link: product.link,
      storeName: product.storeName,
      lowestMonthPrice: product.lowestMonthPrice,
      variantId: product.variantId ?? undefined,
      options: product.options ?? undefined,
    };
  }

  private async ensureUpdatedRecords(
    records: StoreRecordWithLowestPrice[],
  ): Promise<void> {
    const groups = new Map<string, StoreRecordWithLowestPrice[]>();

    for (const record of records) {
      const group = groups.get(record.link) ?? [];
      group.push(record);
      groups.set(record.link, group);
    }

    for (const group of groups.values()) {
      const staleRecords = group.filter(
        (record) =>
          record.updatedAt &&
          Date.now() - record.updatedAt.getTime() > DAY,
      );

      if (staleRecords.length === 0) {
        continue;
      }

      const parsedProduct = await parser.parseSingleProduct(group[0].link);

      if (!parsedProduct) {
        continue;
      }

      for (const record of staleRecords) {
        const freshRecord = record.variantId
          ? parser.selectOfferFromProduct(
              record.storeName,
              parsedProduct,
              record.variantId,
            )
          : parsedProduct;

        if (!freshRecord) {
          continue;
        }

        await productRepository.updateStoreRecordsCron(
          record.id,
          freshRecord.inStock,
          freshRecord.price,
          freshRecord.image,
        );
        await productRepository.createPriceHistory(
          record.id,
          freshRecord.storeName,
          freshRecord.inStock,
          freshRecord.price,
        );

        record.latestPrice = freshRecord.price ?? null;
        record.inStock = freshRecord.inStock;
        record.image = freshRecord.image ?? null;
        record.updatedAt = new Date();
      }
    }
  }
}
