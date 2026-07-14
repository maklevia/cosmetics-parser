import pool from "@api/config/db.js";
import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { ParseResult } from "@api/types/ParsedResult.js";
import { ProductRepository } from "@api/repositories/productRepository.js";
import {
  DuplicateProductError,
  InvalidParseData,
} from "@api/errors/ProductErrors.js";
import { DatePickerWeekNumberHeaderCellProps } from "@chakra-ui/react/date-picker";
import { PoolClient } from "pg";
import { StoreName } from "@api/types/StoreName.js";
import { Product } from "@api/types/ProductTypes.js";

const parser = new Parser();

export class ProductServices {
  async parse(productLink: string) {
    const client = await pool.connect();
    try {
      const storeRecord = await ProductRepository.getStoreRecordByLink(
        client,
        productLink,
      );

      //check for last updated required, to be implemented when re-parsing will work
      if (storeRecord) {
        const productId = storeRecord.product_id;
        const primaryStoreName = storeRecord.store_name;

        const existingStoreRecords =
          await ProductRepository.getStoreRecordsWithProductId(
            client,
            productId,
          );

        let existingProductsObject: Record<StoreName, Product | null> = {
          eva: null,
          notino: null,
          makeup: null,
        };
        for (const product of existingStoreRecords) {
          existingProductsObject[product.store_name] = {
            name: product.product_store_name,
            brand: product.brand,
            price: product.latest_price,
            inStock: product.in_stock,
            image: product.image,
            link: product.link,
            storeName: product.store_name,
          };
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

        const productId = await this.addNewProduct(client, parseResult);
        return { productId, parseResult };
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async addNewProduct(client: PoolClient, parseResults: ParseResult) {
    try {
      await client.query("BEGIN");

      const primaryStoreName = parseResults.primaryStore;
      const primaryProduct = parseResults.products[primaryStoreName];

      if (!primaryProduct) {
        throw new InvalidParseData();
      }

      const productId = await ProductRepository.createProduct(
        client,
        primaryProduct.name,
        primaryProduct.brand,
        primaryProduct.image,
      );

      for (const [storeName, product] of Object.entries(
        parseResults.products,
      )) {
        if (!product) continue;

        await ProductRepository.createStoreRecord(
          client,
          productId,
          product.name,
          product.storeName,
          product.link,
          product.price,
          product.inStock,
          product.image,
        );
      }

      await client.query("COMMIT");
      return productId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  async addProductToUsersCollection(userId: number, productId: number) {
    const client = await pool.connect();
    try {
      const collectionRecord =
        await ProductRepository.getCollectionByUserProductId(
          client,
          userId,
          productId,
        );

      if (collectionRecord) {
        throw new DuplicateProductError();
      } else {
        await ProductRepository.createCollection(
          client,
          userId,
          productId,
        );
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async getCollection(userId: number, limit: number, offset: number) {
    const client = await pool.connect();
    try {
      const collection = await ProductRepository.getUserCollection(client, userId, limit, offset);
      return collection;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

}
