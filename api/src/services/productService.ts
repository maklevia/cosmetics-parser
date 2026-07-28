import { ParserOrchestrator } from "@api/parsers/ParserOrchestrator.js";
import { ParseResult } from "@api/types/ProductTypes.js";
import { ProductRepository } from "@api/repositories/ProductRepository.js";
import {
  DuplicateProductError,
  InvalidParseData,
} from "@api/errors/ProductErrors.js";
import { StoreName } from "@api/types/Enums.js";
import { ParsedProduct } from "@api/types/ProductTypes.js";
import { CollectionProductResponse } from "@api/types/ProductTypes.js";
import { StoreRecordWithLowestPrice } from "@api/types/ProductTypes.js";
import { DAY } from "@api/utils/time.js";

const parser = new ParserOrchestrator();
const productRepository = new ProductRepository();

export class ProductService {
  async parse(productLink: string): Promise<{productId: number, parseResult: ParseResult}> {
    try {
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
          existingProductsObject[product.storeName] = this.mapToParsedProduct(product);
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
          throw new InvalidParseData();
        }

        const productId = await this.addNewProduct(parseResult);
        return { productId, parseResult };
      }
    } catch (error) {
      throw error;
    }
  }

  async addNewProduct(parseResults: ParseResult): Promise<number> {
    try {

      const primaryStoreName = parseResults.primaryStore;
      const primaryProduct = parseResults.products[primaryStoreName];

      if (!primaryProduct) {
        throw new InvalidParseData();
      }

      const productId = await productRepository.saveParsedProduct(primaryProduct, parseResults)

      return productId;
    } catch (error) {
      throw error;
    } 
  }

  async addProductToUsersCollection(userId: number, productId: number): Promise<void> {
    try {
      const collectionRecord =
        await productRepository.findCollectionByUserProductId(
          userId,
          productId,
        );

      if (collectionRecord) {
        throw new DuplicateProductError();
      } else {
        await productRepository.createCollection(userId, productId);
      }
    } catch (error) {
      throw error;
    }
  }

  async getCollection(userId: number, limit: number, offset: number): Promise<CollectionProductResponse[]> {
    try {
      const collection = await productRepository.getUserCollection(
        userId,
        limit,
        offset,
      );
      return collection.map(c => ({
        name: c.product.name,
        brand: c.product.brand,
        image: c.product.image ?? undefined,
        notifyOnPriceDrop: c.notifyOnPriceDrop,
        productId: c.product.id
      }));
    } catch (error) {
      throw error;
    }
  }

  async getProductStoreRecords(productId: number): Promise<Record<StoreName, ParsedProduct | null>> {
    try {
      const storeRecords =
        await productRepository.getStoreRecordsWithProductId(productId);
      if (storeRecords.length === 0) {
        throw new Error(
          "API: No store records found for the product (something is really wrong..)",
        );
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
    } catch (error) {
      console.log("API: error in store records service: ", error);
      throw error;
    }1
  }

  async deleteProductFromCollection(userId: number, productId: number): Promise<void> {
    try {
      await productRepository.deleteCollectionRecord(userId, productId);
    } catch (error) {
      console.log("API: error deleting product from db: ", error);
      throw error;
    }
  }

  private mapToParsedProduct(product: StoreRecordWithLowestPrice): ParsedProduct {
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

  private async ensureUpdatedRecords(records: StoreRecordWithLowestPrice[]): Promise<void> {
    for (const record of records) { 

      if(record.updatedAt && ((Date.now() - record.updatedAt.getTime()) > DAY)) {
        try {
          const freshRecord = await parser.parseSingleProduct(record.link);

          if (freshRecord) {
            await productRepository.updateStoreRecordsCron(record.id, freshRecord.inStock, freshRecord.price, freshRecord.image);
            await productRepository.createPriceHistory(record.id, freshRecord.storeName, freshRecord.inStock, freshRecord.price);

            record.latestPrice = freshRecord.price ?? null;
            record.inStock = freshRecord.inStock;
            record.image = freshRecord.image ?? null;
            record.updatedAt = new Date();
          }
        } catch (error) {
          console.log('API: Error while re-parsing old product on user input: ', error);
        }
      }
    }
  }
}
