import {
  CollectionRow,
  StoreRecordJoinProductRow,
  StoreRecordRow,
  UserCollectionRow,
} from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";
import { PoolClient } from "pg";
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
      const queryText: string = `
            SELECT * FROM Collections
            WHERE user_id = $1 AND product_id = $2;`;

      const result = await client.query<CollectionRow>(queryText, [
        userId,
        productId,
      ]);
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
      const queryText: string = `
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
    productImage?: string,
  ): Promise<number> => {
    try {
      const queryText: string = `
            INSERT INTO Products (name, brand, image)
            VALUES ($1, $2, $3)
            RETURNING id`;

      const result = await client.query(queryText, [
        productName,
        productBrand,
        productImage,
      ]);
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
      const queryText: string = `
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

  getStoreRecordsWithProductId: async (
    client: PoolClient,
    productId: number,
  ): Promise<StoreRecordJoinProductRow[]> => {
    try {
      const queryText: string = `
      SELECT * FROM Store_Records
      JOIN Products ON Products.id = Store_Records.product_id
      WHERE Store_Records.product_id = $1
      `;

      const result = await client.query<StoreRecordJoinProductRow>(queryText, [
        productId,
      ]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getUserCollection: async (
    client: PoolClient,
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserCollectionRow[]> => {
    try {
      const queryText = `
      SELECT Products.id AS "productId",
      Products.name,
      Products.brand,
      Products.image,
      Collections.notify_on_price_drop AS "notifyOnPriceDrop"
      FROM Collections JOIN Products on Collections.product_id = Products.id
      WHERE Collections.user_id = $1
      ORDER BY Collections.created_at DESC
      LIMIT $2 OFFSET $3;`;

      const result = await client.query<UserCollectionRow>(queryText, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};
