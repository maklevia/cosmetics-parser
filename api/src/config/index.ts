import "reflect-metadata";
import { AppDataSource } from "@api/config/data-source.js";

try {
    AppDataSource.initialize()
} catch (error) {
    console.log('API: error connecting to TypeOrm ', error)
}