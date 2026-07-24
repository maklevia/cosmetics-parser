import pool from "@api/config/db.js";
import {
  CollectionRow,
  StoreRecordJoinProductRow,
  StoreRecordRow,
  StoreRecordsForCronRow,
  UserCollectionRow,
} from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";
import { Pool, PoolClient } from "pg";

export class ProductRepositories {
  async getStoreRecordByLink(
    client: PoolClient,
    link: string,
  ): Promise<StoreRecordRow | undefined> {
    const queryText: string = `
            SELECT product_id AS "productId",
            id,
            store_name AS "storeName",
            latest_price AS price,
            in_stock AS "inStock",
            product_store_name AS "name"
            FROM Store_Records
            WHERE link = $1;
            `;
    const result = await client.query(queryText, [link]);
    return result.rows[0];
  }

  async getCollectionByUserProductId(
    client: PoolClient,
    userId: number,
    productId: number,
  ): Promise<CollectionRow | undefined> {
    const queryText: string = `
            SELECT id, 
            product_id AS "productId",
            user_id AS userId  
            FROM Collections
            WHERE user_id = $1 AND product_id = $2;`;

    const result = await client.query<CollectionRow>(queryText, [
      userId,
      productId,
    ]);
    return result.rows[0];
  }

  async createCollection(
    client: PoolClient,
    userId: number,
    productId: number,
  ) {
    const queryText: string = `
            INSERT INTO Collections (user_id, product_id)
            VALUES ($1, $2)`;

    await client.query(queryText, [userId, productId]);
  }

  async createPriceHistory(
    storeRecordId: number,
    storeName: StoreName,
    inStock: boolean,
    price?: number,
    client: PoolClient | Pool = pool,
  ) {
    const queryText: string = `
    INSERT INTO Price_History (store_record_id, store_name, price, in_stock)
    VALUES ($1, $2, $3, $4)`;

    await client.query(queryText, [storeRecordId, storeName, price, inStock]);
  }

  async createProduct(
    client: PoolClient,
    productName: string,
    productBrand: string,
    productImage?: string,
  ): Promise<number> {
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
  }

  async createStoreRecord(
    client: PoolClient,
    productId: number,
    productStoreName: string,
    storeName: StoreName,
    productLink: string,
    price: number | undefined,
    inStock: boolean,
    image: string | undefined,
  ): Promise<number> {
    const queryText: string = `
           INSERT INTO Store_Records (product_id, store_name, latest_price, 
           in_stock, image, link, product_store_name, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING id`;

    const storeRecordId = await client.query(queryText, [
      productId,
      storeName,
      price,
      inStock,
      image,
      productLink,
      productStoreName,
    ]);
    return storeRecordId.rows[0].id;
  }

  async getStoreRecordsWithProductId(
    client: PoolClient,
    productId: number,
  ): Promise<StoreRecordJoinProductRow[]> {
    const queryText: string = `
      SELECT  Store_Records.id as id,
      product_id AS "productId",
      store_name AS "storeName",
      latest_price AS price,
      in_stock AS "inStock",
      product_store_name AS "name",
      brand,
      link,
      Store_Records.image,

      (
        SELECT MIN(p) FROM (
          SELECT price AS p
          FROM Price_History
          WHERE store_record_id = Store_Records.id
            AND recorded_at >= NOW() - INTERVAL '30 days'
          UNION ALL
          (
            SELECT price AS p
            FROM Price_History
            WHERE store_record_id = Store_Records.id
              AND recorded_at < NOW() - INTERVAL '30 days'
            ORDER BY recorded_at DESC
            LIMIT 1
          )
        ) AS history_window
      ) AS "lowest30DayPrice"

      FROM Store_Records
      JOIN Products ON Products.id = Store_Records.product_id
      WHERE Store_Records.product_id = $1
      `;

    const result = await client.query<StoreRecordJoinProductRow>(queryText, [
      productId,
    ]);
    return result.rows;
  }

  async getUserCollection(
    client: PoolClient,
    userId: number,
    limit: number,
    offset: number,
  ): Promise<UserCollectionRow[]> {
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

    const result = await client.query<UserCollectionRow>(queryText, [
      userId,
      limit,
      offset,
    ]);
    return result.rows;
  }

  async deleteCollectionRecord(userId: number, productId: number) {
    const queryText: string = `
    DELETE FROM Collections
    WHERE user_id = $1 AND product_id = $2`;

    await pool.query(queryText, [userId, productId]);
  }

  async getProductsFromCollections(): Promise<number[]> {
    const queryText: string = `
    SELECT DISTINCT product_id
    FROM Collections`;

    const result = await pool.query<{ product_id: number }>(queryText);
    return result.rows.map((row) => row.product_id); //array of pure id's
  }

  async getStoreRecordsForCron(
    productsIds: number[],
  ): Promise<StoreRecordsForCronRow[]> {
    const queryText: string = `
    SELECT id as "recordId",
    product_id AS "productId",
    link,
    store_name AS "storeName",
    latest_price AS price
    FROM Store_Records
    WHERE product_id = ANY($1)`;

    const result = await pool.query<StoreRecordsForCronRow>(queryText, [
      productsIds,
    ]);
    return result.rows;
  }

  async updateStoreRecordsCron(
    id: number,
    inStock: boolean,
    price?: number,
    image?: string,
  ) {
    const queryText: string = `
    UPDATE Store_Records 
    SET in_stock = $2, 
    latest_price = $3, 
    image = COALESCE($4, image),
    updated_at = NOW()
    WHERE id = $1;`;

    await pool.query(queryText, [id, inStock, price, image]);
  }
}
