import pool from "@api/config/db.js";
import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { ParseResult } from "@api/parsers/types/ParsedResult.js";
import { Product } from "@api/parsers/types/Product.js";
import { Request, Response } from "express";

const parser = new Parser();
export const ProductServices = {
  parse: async (productLink: string) => {
    const parseResult = await parser.getProductByLink(productLink);
    if (!parseResult) {
      throw new Error(`API: no product was parsed from link ${productLink}`);
    }
    return parseResult;
  },

  addNewProductToCollection: async (
    userId: number,
    parseResults: ParseResult,
  ) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const primaryStoreName = parseResults.primaryStore;
      const primaryProduct = parseResults.products[primaryStoreName];

      if (!primaryProduct) {
        throw new Error("API: Error adding new Product: null primary result.");
      }

      const primaryProductRes = await client.query(
        `INSERT INTO Products (name, brand)
        VALUES ($1, $2)
        RETURNING id;`,
        [primaryProduct.name, primaryProduct.brand],
      );

      const productId: number = primaryProductRes.rows[0].id;

      await client.query(
        `INSERT INTO Collections (user_id, product_id)
        VALUES ($1, $2);`,
        [userId, productId],
      );

      for (const [storeName, product] of Object.entries(
        parseResults.products,
      )) {
        if (!product) continue;

        await client.query(
          `INSERT INTO Store_Records (
          product_id, store_name, link, latest_price, in_stock, image, product_store_name
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [productId, storeName, product?.link, product?.price, product?.inStock, product?.image, product?.name]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
