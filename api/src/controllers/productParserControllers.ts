import { InvalidLinkError, StoreRequestError } from "@api/parsers/errors/customErrorClasses.js";
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
    }
}
