import { AppDataSource } from "@api/config/data-source.js";
import { Collection } from "@api/entities/Collection.js";
import { PriceHistory } from "@api/entities/PriceHistory.js";
import { Product } from "@api/entities/Product.js";
import { StoreRecord } from "@api/entities/StoreRecord.js";

import { StoreName } from "@api/types/StoreName.js";
import { ParsedProduct } from "@api/types/ParsedProduct.js";
import { ParseResult } from "@api/types/ParseResult.js";
import { StoreRecordWithLowestPrice } from "@api/types/StoreRecordTypes.js";
import { In } from "typeorm";

interface CreateStoreRecordOptions {
  productId: number;
  productStoreName: string;
  storeName: StoreName;
  productLink: string;
  price?: number;
  inStock: boolean;
  image?: string;
}

export class ProductRepository {
  private storeRecordRepo = AppDataSource.getRepository(StoreRecord);
  private collectionRepo = AppDataSource.getRepository(Collection);
  private priceHistoryRepo = AppDataSource.getRepository(PriceHistory);
  private productRepo = AppDataSource.getRepository(Product);

  async findStoreRecordByLink(link: string): Promise<StoreRecord | null> {
    const foundStoreRecord = await this.storeRecordRepo.findOne({
      where: { link: link },
      relations: { product: true }
    });
    return foundStoreRecord;
  }

  async findCollectionByUserProductId(
    userId: number,
    productId: number,
  ): Promise<Collection | null> {
    const foundCollection = await this.collectionRepo.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });
    return foundCollection;
  }

  async createCollection(userId: number, productId: number): Promise<void> {
    const newCollection = new Collection();
    newCollection.user = { id: userId } as any;
    newCollection.product = { id: productId } as any;

    await this.collectionRepo.save(newCollection);
  }

  async createPriceHistory(
    storeRecordId: number,
    storeName: StoreName,
    inStock: boolean,
    price?: number,
  ): Promise<void> {
    const newPriceHistory = new PriceHistory();
    newPriceHistory.inStock = inStock;
    newPriceHistory.price = price ?? null;
    newPriceHistory.storeName = storeName;
    newPriceHistory.storeRecord = { id: storeRecordId } as StoreRecord;

    await this.priceHistoryRepo.insert(newPriceHistory);
  }

  async saveParsedProduct(
    primaryProduct: ParsedProduct,
    parsedProducts: ParseResult,
  ): Promise<number> {
    const newProduct = new Product();
    newProduct.name = primaryProduct.name;
    newProduct.brand = primaryProduct.brand;
    newProduct.image = primaryProduct.image ?? null;

    newProduct.storeRecords = [];

    for (const [storeName, product] of Object.entries(
      parsedProducts.products,
    )) {
      if (!product) continue;

      const newStoreRecord = StoreRecord.fromParsedProduct(product);

      const newPriceHistory = PriceHistory.fromParsedProduct(product);

      newStoreRecord.priceHistory = [newPriceHistory];

      newProduct.storeRecords.push(newStoreRecord);
    }

    const savedProduct = await this.productRepo.save(newProduct);
    return savedProduct.id;
  }
  async getStoreRecordsWithProductId(productId: number): Promise<StoreRecordWithLowestPrice[]> {
    const { entities, raw } = await this.storeRecordRepo
      .createQueryBuilder("storeRecord")
      .leftJoinAndSelect("storeRecord.product", "product")
      .addSelect(`(
        SELECT MIN(price)
        FROM "Price_History"
        WHERE store_record_id = "storeRecord"."id"
          AND recorded_at >= NOW() - INTERVAL '30 days'
      )`, "lowestMonthPrice")
      .where("storeRecord.product_id = :productId", { productId })
      .getRawAndEntities();

    const recordsWithPrice = entities as StoreRecordWithLowestPrice[];
    
    for (let i = 0; i < recordsWithPrice.length; i++) {
      recordsWithPrice[i].lowestMonthPrice = raw[i].lowestMonthPrice;
    }

    return recordsWithPrice;
  }

  async getUserCollection(userId: number, limit: number, offset: number): Promise<Collection[]> {
    return await this.collectionRepo.find({
      where: { user: { id: userId } },
      relations: { product: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset
    });
  }

  async deleteCollectionRecord(
    userId: number,
    productId: number,
  ): Promise<void> {
    await this.collectionRepo.delete({
      user: { id: userId },
      product: { id: productId },
    });
  }

  async getProductsFromCollections(): Promise<number[]> {
    const result = await this.collectionRepo
      .createQueryBuilder("collection")
      .select("collection.product_id", "productId")
      .distinct(true)
      .getRawMany();

    const productIds: number[] = result.map((row) => row.productId);

    return productIds;
  }

  async getStoreRecordsForCron(productsIds: number[]): Promise<StoreRecord[]> {
    return await this.storeRecordRepo.find({
      where: { product: { id: In(productsIds) } },
      relations: { product: true }
    });
  }

  async updateStoreRecordsCron(id: number, inStock: boolean, price?: number, image?: string): Promise<void> {
    const updateData: any = {
        inStock: inStock,
        latestPrice: price ?? null 
    };

    if (image !== undefined) {
        updateData.image = image; 
    }

    await this.storeRecordRepo.update(id, updateData);
  }
}
