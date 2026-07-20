import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { ProductRepositories } from "@api/repositories/productRepositories.js";
import { StoreRecordsForCronRow } from "@api/types/ProductTypes.js";
import { StoreName } from "@api/types/StoreName.js";

const productRepositories = new ProductRepositories();
const parser = new Parser();

interface GroupedRecords {
  fastStores: StoreRecordsForCronRow[]; //now it's Makeup and Eva
  slowStores: StoreRecordsForCronRow[]; //now it's Notino
}

export class CronServices {
  async dailyReparsing(): Promise<void> {
    try {
      console.log("Re-parsing products starting...");

      const groupedRecords = await this.fetchAndGroupRecords();
      console.log("Fetched links succsessfully...");

      await Promise.all([
        this.processQueue(groupedRecords.fastStores, 2000, "Makeup and Eva"),
        this.processQueue(groupedRecords.slowStores, 8000, "Notino"),
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
      const productId = await productRepositories.getProductsFromCollections();
      const storeRecordsToParse =
        await productRepositories.getStoreRecordsForCron(productId);

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

  private async parseAndUpdateRecords(
    record: StoreRecordsForCronRow,
  ): Promise<void> {
    try {
      const product = await parser.parseSingleProduct(record.link);
      if (!product) {
        console.log(`API CRON: Got null response for ${record.link}`);
        return;
      }



      await productRepositories.updateStoreRecordsCron(
        record.recordId,
        product.inStock,
        product.price,
        product.image,
      );

      if (record.price !== product.price) {
        await productRepositories.createPriceHistory(record.recordId, product.storeName, product.inStock, product.price);
      }
    } catch (error) {
      console.log(`API CRON: error parsing/updating `, error);
    }
  }

  private sleep = (delayMs: number) =>
    new Promise((resolve) => setTimeout(resolve, delayMs));

  private async processQueue(
    records: StoreRecordsForCronRow[],
    delayMs: number,
    label: string,
  ): Promise<void> {
    for (const record of records) {
      await this.parseAndUpdateRecords(record);
      await this.sleep(delayMs);
    }
  }
}
