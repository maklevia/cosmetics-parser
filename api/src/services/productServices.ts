import pool from "@api/config/db.js";
import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { ParseResult } from "@api/types/ParsedResult.js";
import { ProductRepository } from "@api/repositories/productRepository.js";
import { DuplicateProductError, InvalidParseData } from "@api/errors/ProductErrors.js";

const parser = new Parser();

export class ProductServices {
  async parse(productLink: string) {
    const parseResult = await parser.getProductByLink(productLink);
    if (!parseResult) {
      throw new InvalidParseData();
    }
    return parseResult;
  }

  async addNewProduct(userId: number, parseResults: ParseResult) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const primaryStoreName = parseResults.primaryStore;
      const primaryProduct = parseResults.products[primaryStoreName];

      if (!primaryProduct) {
        throw new InvalidParseData();
      }

      const primaryProductRes = await ProductRepository.createProduct(
        client,
        primaryProduct.name,
        primaryProduct.brand,
      );

      const productId: number = primaryProductRes;

      await ProductRepository.createCollectionRecord(client, userId, productId);

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
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async addProductToUsersCollection(userId: number, parseResult: ParseResult) {
    const client = await pool.connect();
    try {
      const primaryProduct = parseResult.products[parseResult.primaryStore];
      if (!primaryProduct) {
        throw new InvalidParseData();
      }
      const primaryProductLink = primaryProduct.link;

      const storeRecordByLink = await ProductRepository.getStoreRecordByLink(
        client,
        primaryProductLink,
      );

      if (!storeRecordByLink) {
        await this.addNewProduct(userId, parseResult);
        return;
      }

      const collectionRecord = await ProductRepository.getCollectionRecord(
        client,
        userId,
        storeRecordByLink.product_id,
      );

      if (collectionRecord) {
        throw new DuplicateProductError();
      } else {
        await ProductRepository.createCollectionRecord(
          client,
          userId,
          storeRecordByLink.product_id,
        );
      }

      await client.query("BEGIN");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
