import { InvalidLinkError, StoreRequestError } from "@api/parsers/errors/customErrorClasses.js";
import { ParseResult } from "@api/parsers/types/ParsedResult.js";
import { ProductServices } from "@api/services/productServices.js";
import { Response, Request } from "express";

export const ProductParserController = {
    parse: async (req: Request, res: Response) => {
        try {
            const productLink: string = req.body.url
            const parsedResults = await ProductServices.parse(productLink);
            return res.status(200).json(parsedResults);
        } catch (error) {
            if (error instanceof InvalidLinkError) {
                res.status(400).json({error: 'Please, provide valid link.'});
            } else if (error instanceof StoreRequestError) {
                res.status(502).json({error: 'Store is temporaly unavailable. Please, try again later.'})
            } else {
                res.status(500).json({error: 'Something went wrong. Please, try again later.'})
            }
        }
    },

    addProduct: async (req: Request, res: Response) => {
        try {
            const userId: number = res.locals.user.userId;
            const data: ParseResult = req.body.parseResult;
            await ProductServices.addNewProductToCollection(userId, data);

            res.status(201).json({message: 'Product created successfully'});
        } catch (error) {
            console.log('API: error adding new product: ', error)
            res.status(400).json({message: 'Something went wrong. Please, try again later.'})
        }
    }
}
