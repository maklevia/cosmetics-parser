import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@api/entities/User.js";
import { Product } from "@api/entities/Product.js";
import { Collection } from "@api/entities/Collection.js";
import { StoreRecord } from "@api/entities/StoreRecord.js";
import { StoreRecordOverride } from "@api/entities/StoreRecordOverride.js";
import { PriceHistory } from "@api/entities/PriceHistory.js";
import { PriceDropQueue } from "@api/entities/PriceDropQueue.js";
import { UserNotification } from "@api/entities/UserNotification.js";
import { ChannelToken } from "@api/entities/ChannelToken.js";
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
