import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@api/modules/user/User.js";
import { Product } from "@api/modules/product/Product.js";
import { Collection } from "@api/modules/product/Collection.js";
import { StoreRecord } from "@api/modules/product/StoreRecord.js";
import { StoreRecordOverride } from "@api/modules/product/StoreRecordOverride.js";
import { PriceHistory } from "@api/modules/product/PriceHistory.js";
import { PriceDropQueue } from "@api/modules/notification/PriceDropQueue.js";
import { UserNotification } from "@api/modules/notification/UserNotification.js";
import { ChannelToken } from "@api/modules/channel/ChannelToken.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: getEnvOrThrow('DB_HOST'),
    port: Number(getEnvOrThrow('DB_PORT')),
    username: getEnvOrThrow('DB_USER'),
    password: getEnvOrThrow('DB_PASSWORD'),
    database: getEnvOrThrow('DB_NAME'),
    synchronize: false,
    logging: false,
    poolSize: 30,
    entities: [
        User, Product, Collection, StoreRecord, StoreRecordOverride,
        PriceHistory, PriceDropQueue, UserNotification, ChannelToken
    ],
})
