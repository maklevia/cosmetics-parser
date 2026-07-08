import { Parser } from "@api/parsers/services/parserOrchestrator.js";
import { Request, Response } from "express";

const parser = new Parser()
export const ProductServices = {
    parse: async (productLink: string) => {
        try {
            const parseResult = await parser.getProductByLink(productLink);
            if (!parseResult) {
                throw new Error(`API: no product was parsed from link ${productLink}`);
            } 
            return parseResult;
        } catch (error) {
            console.log(`API: error parsing product from link ${productLink}: `, error)
            return null;
        }
    },
    addToCollection: async () => {

    }
}
