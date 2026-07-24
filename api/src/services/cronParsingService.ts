import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { NotificationRepository } from "@api/repositories/notificationRepository.js";
import { ProductRepository } from "@api/repositories/productRepository.js";
import { StoreRecordsForCronRow } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";

const productRepository = new ProductRepository();
const notifRepositories = new NotificationRepository();
const parser = new Parser();

interface GroupedRecords {
  fastStores: StoreRecordsForCronRow[]; //now it's Makeup and Eva
  slowStores: StoreRecordsForCronRow[]; //now it's Notino
}

export class CronParsingService {
  async dailyReparsing(): Promise<void> {
    try {
      console.log("Re-parsing products starting...");

      const groupedRecords = await this.fetchAndGroupRecords();
      console.log("Fetched links succsessfully...");

      await Promise.all([
        this.processQueue(groupedRecords.fastStores, 2000),
        this.processQueue(groupedRecords.slowStores, 8000),
      ]);

      console.log("Re-parsing products finished.");
    } catch (error) {
      console.log(
        "API CRON: Something went wrong during daily reparsing: ",
        error,
      );
    }
  }

  private async fetchAndGroupRecords(): Promise<GroupedRecords> {
    const groupedRecords: GroupedRecords = {
      fastStores: [],
      slowStores: [],
    };

    try {
      const productId = await productRepository.getProductsFromCollections();
      const storeRecordsToParse =
        await productRepository.getStoreRecordsForCron(productId);

      for (const record of storeRecordsToParse) {
        if (record.storeName === StoreName.Notino) {
          groupedRecords.slowStores.push(record);
        } else {
          groupedRecords.fastStores.push(record);
        }
      }

      return groupedRecords;
    } catch (error) {
      throw error;
    }
  }
  private async processQueue(
    records: StoreRecordsForCronRow[],
    delayMs: number,
  ): Promise<void> {
    for (const record of records) {
      await this.parseAndUpdateRecords(record);
      await this.sleep(delayMs);
    }
  }

  private async parseAndUpdateRecords(
    oldRecord: StoreRecordsForCronRow,
  ): Promise<void> {
    try {
      const newRecordData = await parser.parseSingleProduct(oldRecord.link);
      if (!newRecordData) {
        console.log(`API CRON: Got null response for ${oldRecord.link}`);
        return;
      }

      await productRepository.updateStoreRecordsCron(
        oldRecord.recordId,
        newRecordData.inStock,
        newRecordData.price,
        newRecordData.image,
      );

      if (oldRecord.price !== newRecordData.price) {
        await productRepository.createPriceHistory(
          oldRecord.recordId,
          newRecordData.storeName,
          newRecordData.inStock,
          newRecordData.price,
        );
        console.log(`Creating price history repo for ${newRecordData.name}`)

        if (
          oldRecord.price &&
          newRecordData.price &&
          (oldRecord.price * 0.9 >= newRecordData.price)
        ) {
          console.log(`Creating notif record for ${newRecordData.name}`)
          await notifRepositories.createPriceDropQueue(
            oldRecord.recordId,
            oldRecord.productId,
            oldRecord.price,
            newRecordData.price,
          );
        }
      }
    } catch (error) {
      console.log(`API CRON: error parsing/updating `, error);
    }
  }

  private sleep = (delayMs: number) =>
    new Promise((resolve) => setTimeout(resolve, delayMs));

}
