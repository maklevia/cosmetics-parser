import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { ParseResult } from "@api/types/ParseResult.js";
import { ProductRepository } from "@api/repositories/productRepository.js";
import {
  DuplicateProductError,
  InvalidParseData,
} from "@api/errors/ProductErrors.js";
import { StoreName } from "@api/types/StoreName.js";
import { ParsedProduct } from "@api/types/ParsedProduct.js";
import { Collection } from "@api/entities/Collection.js";
import { CollectionProductResponse } from "@api/types/CollectionProductResponse.js";
import { StoreRecordWithLowestPrice } from "@api/types/StoreRecordTypes.js";

const parser = new Parser();
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
      const responceObject: Record<StoreName, ParsedProduct | null> = {
        eva: null,
        notino: null,
        makeup: null,
      };
      for (const product of storeRecords) {
        responceObject[product.storeName] = this.mapToParsedProduct(product);
      }
      return responceObject;
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
}
