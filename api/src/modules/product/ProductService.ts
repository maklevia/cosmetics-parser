import { ParserOrchestrator } from "@api/parsers/ParserOrchestrator.js";
import { ParseResult } from "@api/types/ProductTypes.js";
import { ProductRepository } from "@api/modules/product/ProductRepository.js";
import { StoreName } from "@api/types/Enums.js";
import { ParsedProduct } from "@api/types/ProductTypes.js";
import { CollectionProductResponse } from "@api/types/ProductTypes.js";
import { StoreRecordWithLowestPrice } from "@api/types/ProductTypes.js";
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
  ): Promise<{ productId: number; parseResult: ParseResult }> {
    const storeRecord =
      await productRepository.findStoreRecordByLink(productLink);

    //check for last updated required, to be implemented when re-parsing will work
    if (storeRecord) {
      const productId = storeRecord.product.id;
      const primaryStoreName = storeRecord.storeName;

      const existingStoreRecords =
        await productRepository.getStoreRecordsWithProductId(productId);

      await this.ensureUpdatedRecords(existingStoreRecords);

      let existingProductsObject: Record<StoreName, ParsedProduct | null> = {
        eva: null,
        notino: null,
        makeup: null,
      };

      for (const product of existingStoreRecords) {
        existingProductsObject[product.storeName] =
          this.mapToParsedProduct(product);
      }

      const existingProducts: ParseResult = {
        primaryStore: primaryStoreName,
        products: existingProductsObject,
      };

      //naming it parseResult so frontend will handle it the same as actual parseResult
      return { productId, parseResult: existingProducts };
    } else {
      const parseResult = await parser.getProductByLink(productLink);

      if (!parseResult) {
        throw new ValidationError("Invalid parsing result");
      }

      const productId = await this.addNewProduct(parseResult);
      return { productId, parseResult };
    }
  }

  async addNewProduct(parseResults: ParseResult): Promise<number> {
    const primaryStoreName = parseResults.primaryStore;
    const primaryProduct = parseResults.products[primaryStoreName];

    if (!primaryProduct) {
      throw new ValidationError("Invalid parsing result");
    }

    const productId = await productRepository.saveParsedProduct(
      primaryProduct,
      parseResults,
    );

    return productId;
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
  ): Promise<Record<StoreName, ParsedProduct | null>> {
    const storeRecords =
      await productRepository.getStoreRecordsWithProductId(productId);

    if (storeRecords.length === 0) {
      if (storeRecords.length === 0) {
        throw new NotFoundError("No store records found for this product");
      }
    }
    const storeProducts: Record<StoreName, ParsedProduct | null> = {
      eva: null,
      notino: null,
      makeup: null,
    };
    for (const product of storeRecords) {
      storeProducts[product.storeName] = this.mapToParsedProduct(product);
    }
    return storeProducts;
  }

  async deleteProductFromCollection(
    userId: number,
    productId: number,
  ): Promise<void> {
    await productRepository.deleteCollectionRecord(userId, productId);
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
    };
  }

  private async ensureUpdatedRecords(
    records: StoreRecordWithLowestPrice[],
  ): Promise<void> {
    for (const record of records) {
      if (record.updatedAt && Date.now() - record.updatedAt.getTime() > DAY) {
        const freshRecord = await parser.parseSingleProduct(record.link);

        if (freshRecord) {
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
}
