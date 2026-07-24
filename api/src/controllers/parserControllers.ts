import {
  InvalidLinkError,
  StoreRequestError,
} from "@api/parsers/errors/ParserErrors.js";
import { ProductServices } from "@api/services/productServices.js";
import { Response, Request } from "express";
import {
  DuplicateProductError,
  InvalidParseData,
} from "@api/errors/ProductErrors.js";

export class ParserControllers {
  private productServices: ProductServices;
  constructor() {
    this.productServices = new ProductServices();
  }

  parse = async (req: Request, res: Response) => {
    try {
      const productLink: string = req.body.url;
      const result = await this.productServices.parse(productLink);
      const productId = result.productId;
      const parsedResults = result.parseResult;
      return res.status(200).json({ productId, parsedResults });
    } catch (error) {
      if (error instanceof InvalidLinkError) {
        res.status(400).json({ error: "Please, provide valid link." });
      } else if (error instanceof StoreRequestError) {
        res.status(502).json({
          error: "Store is temporaly unavailable. Please, try again later.",
        });
      } else if (error instanceof InvalidParseData) {
        res.status(400).json({
          error:
            "Cannot find your product. Please, check if your link is correct, or try again later.",
        });
      } else {
        res
          .status(500)
          .json({ error: "Something went wrong. Please, try again later." });
      }
    }
  }
  addProduct = async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.user.userId;
      const productId: number = req.body.productId;
      await this.productServices.addProductToUsersCollection(userId, productId);

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      console.log("API: error adding new product: ", error);
      if (error instanceof DuplicateProductError) {
        res
          .status(409)
          .json({ error: "This product is already in your Collection." });
      } else {
        res
          .status(400)
          .json({ error: "Something went wrong. Please, try again later." });
      }
    }
  }
}
