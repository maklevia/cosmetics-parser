import { StoreRecord } from "@api/modules/product/StoreRecord.js";
import { ParserOrchestrator } from "@api/parsers/ParserOrchestrator.js";
import { NotificationRepository } from "@api/modules/notification/NotificationRepository.js";
import { ProductRepository } from "@api/modules/product/ProductRepository.js";
import { StoreName } from "@api/types/Enums.js";
import { AppError } from "@api/errors/AppError.js";

const productRepository = new ProductRepository();
const notifRepositories = new NotificationRepository();
const parser = new ParserOrchestrator();

interface GroupedRecords {
  fastStores: StoreRecord[][]; //now it's Makeup and Eva
  slowStores: StoreRecord[][]; //now it's Notino
}

export class ParsingCron {
  async dailyReparsing(): Promise<void> {
    try {
      console.log("Re-parsing products starting...");

      const groupedRecords = await this.fetchAndGroupRecords();
      console.log("Fetched links successfully...");

      await Promise.all([
        this.processQueue(groupedRecords.fastStores, 2000, 3),
        this.processQueue(groupedRecords.slowStores, 8000, 5),
      ]);

      console.log("Re-parsing products finished.");
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.log(
          "API CRON: Something went wrong during daily reparsing: ",
          error,
        );
      }
    }
  }

  private async fetchAndGroupRecords(): Promise<GroupedRecords> {
    const groupedRecords: GroupedRecords = {
      fastStores: [],
      slowStores: [],
    };

    const productId = await productRepository.getProductsFromCollections();
    const storeRecordsToParse =
      await productRepository.getStoreRecordsForCron(productId);

    const fastRecords: StoreRecord[] = [];
    const slowRecords: StoreRecord[] = [];

    for (const record of storeRecordsToParse) {
      if (record.storeName === StoreName.Notino) {
        slowRecords.push(record);
      } else {
        fastRecords.push(record);
      }
    }

    groupedRecords.fastStores = this.groupRecordsByLink(fastRecords);
    groupedRecords.slowStores = this.groupRecordsByLink(slowRecords);

    return groupedRecords;
  }

  private groupRecordsByLink(records: StoreRecord[]): StoreRecord[][] {
    const groups = new Map<string, StoreRecord[]>();

    for (const record of records) {
      const group = groups.get(record.link) ?? [];
      group.push(record);
      groups.set(record.link, group);
    }

    return [...groups.values()];
  }

  private async processQueue(
    recordGroups: StoreRecord[][],
    delayMs: number,
    concurrency: number,
  ): Promise<void> {
    const queue = [...recordGroups];

    const workers = Array(concurrency)
      .fill(null)
      .map(async () => {
        while (queue.length > 0) {
          const recordGroup = queue.pop();

          if (recordGroup) {
            await this.parseAndUpdateRecords(recordGroup);
            await this.sleep(delayMs);
          }
        }
      });

    await Promise.all(workers);
  }

  private async parseAndUpdateRecords(oldRecords: StoreRecord[]): Promise<void> {
    const firstRecord = oldRecords[0];

    if (!firstRecord) {
      return;
    }

    try {
      const parsedProduct = await parser.parseSingleProduct(firstRecord.link);

      if (!parsedProduct) {
        console.log(`API CRON: Got null response for ${firstRecord.link}`);
        return;
      }

      for (const oldRecord of oldRecords) {
        const newRecordData = oldRecord.variantId
          ? parser.selectOfferFromProduct(
              oldRecord.storeName,
              parsedProduct,
              oldRecord.variantId,
            )
          : parsedProduct;

        if (!newRecordData) {
          console.log(
            `API CRON: Got null response for ${oldRecord.link} variant ${oldRecord.variantId}`,
          );
          continue;
        }

        await productRepository.updateStoreRecordsCron(
          oldRecord.id,
          newRecordData.inStock,
          newRecordData.price,
          newRecordData.image,
        );

        await productRepository.createPriceHistory(
          oldRecord.id,
          newRecordData.storeName,
          newRecordData.inStock,
          newRecordData.price,
        );

        if (
          oldRecord === firstRecord &&
          oldRecord.storeName === oldRecord.product.primaryStoreName &&
          newRecordData.image &&
          oldRecord.product.image !== newRecordData.image
        ) {
          await productRepository.updateProductImage(
            oldRecord.product.id,
            newRecordData.image
          );
        }

        if (
          newRecordData.inStock && 
          oldRecord.latestPrice !== newRecordData.price &&
          oldRecord.latestPrice &&
          newRecordData.price &&
          oldRecord.latestPrice * 0.9 >= newRecordData.price
        ) {
          await notifRepositories.createPriceDropQueue(
            oldRecord.id,
            oldRecord.product.id,
            oldRecord.latestPrice,
            newRecordData.price,
          );
        }
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.log(`API CRON: error parsing/updating `, error);
      }
    }
  }

  private sleep = (delayMs: number) =>
    new Promise((resolve) => setTimeout(resolve, delayMs));

  async weeklyDiscovery(): Promise<void> {
    try {
      const productsToSearch = await productRepository.getProductsWithMissingStores();

      for (const product of productsToSearch) {
        const offers = await parser.findVariantOffersInStore(
          product.missingStore,
          product.name,
          product.brand,
          product.options ?? {},
        );

        if (offers.length === 0) {
          continue;
        }

        console.log('Found missing store item ', offers);

        for (const offer of offers) {
          await productRepository.addDiscoveredStoreRecord(product.productId, offer);
        }
        await this.sleep(15000);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.log("API CRON: error during weekly discovery ", error);
      }
    }
  }
}
