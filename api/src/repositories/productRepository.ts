import { CollectionRow, StoreRecordJoinProductRow, StoreRecordRow } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";
import { Pool, PoolClient } from "pg";
import { QueryResult } from "typeorm";

export const ProductRepository = {
  getStoreRecordByLink: async (
    client: PoolClient,
    link: string,
  ): Promise<StoreRecordRow | undefined> => {
    try {
      const queryText: string = `
            SELECT * FROM Store_Records
            WHERE link = $1;
            `;
      const result = await client.query(queryText, [link]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getCollectionByUserProductId: async (
    client: PoolClient,
    userId: number,
    productId: number,
  ): Promise<CollectionRow | undefined> => {
    try {
      const queryText = `
            SELECT * FROM Collections
            WHERE user_id = $1 AND product_id = $2;`;

      const result = await client.query(queryText, [userId, productId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  createCollection: async (
    client: PoolClient,
    userId: number,
    productId: number,
  ) => {
    try {
      const queryText = `
            INSERT INTO Collections (user_id, product_id)
            VALUES ($1, $2)`;

      await client.query(queryText, [userId, productId]);
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (
    client: PoolClient,
    productName: string,
    productBrand: string,
  ): Promise<number> => {
    try {
      const queryText = `
            INSERT INTO Products (name, brand)
            VALUES ($1, $2)
            RETURNING id`;

      const result = await client.query(queryText, [productName, productBrand]);
      return result.rows[0].id;
    } catch (error) {
      throw error;
    }
  },

  createStoreRecord: async (
    client: PoolClient,
    productId: number,
    productStoreName: string,
    storeName: StoreName,
    productLink: string,
    price: number | undefined,
    inStock: boolean,
    image: string | undefined,
  ) => {
    try {
      const queryText = `
           INSERT INTO Store_Records (product_id, store_name, latest_price, 
           in_stock, image, link, product_store_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`;

      await client.query(queryText, [
        productId,
        storeName,
        price,
        inStock,
        image,
        productLink,
        productStoreName,
      ]);
    } catch (error) {
      throw error;
    }
  },

  getStoreRecordsWithProductId: async (client: PoolClient, productId: number): Promise<StoreRecordJoinProductRow[]> => {
    try {
      const queryText = `
      SELECT * FROM Store_Records
      JOIN Products ON Products.id = Store_Records.product_id
      WHERE Store_Records.product_id = $1
      `;

      const result = await client.query(queryText, [productId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};
