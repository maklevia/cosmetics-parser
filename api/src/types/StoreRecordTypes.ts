import { StoreRecord } from "@api/entities/StoreRecord.js";

export type StoreRecordWithLowestPrice = StoreRecord & {
  lowestMonthPrice?: number;
};
