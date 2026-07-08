import { ProductServices } from "@api/services/productServices.js";
import { Response, Request } from "express";

export const ProductParserController = {
    parse: async (req: Request, res: Response) => {
        const productLink: string = req.body.url;
        const parseResult = await ProductServices.parse(productLink);

        res.status(200).json(parseResult); 
    }
}
