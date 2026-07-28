import { ProductService } from "@api/modules/product/ProductService.js";
import { Request, Response } from "express";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";
import {
  InvalidLinkError,
  StoreRequestError,
} from "@api/parsers/errors/ParserErrors.js";
import {
  DuplicateProductError,
  InvalidParseData,
} from "@api/errors/ProductErrors.js";

export class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  getCollection = async (req: Request, res: Response) => {
    try {
      const userId: number = getAuthUser(res).userId;
      const isInitial = req.query.all === "false";
      const { limit, offset } = isInitial
        ? { limit: 8, offset: 0 }
        : { limit: 1000, offset: 8 };
      const collection = await this.productService.getCollection(
        userId,
        limit,
        offset,
      );
      res.status(200).json({ collection });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong." });
      console.log(error);
    }
  }

  getProductStoreRecords = async (req: Request, res: Response) => {
    const productId: number = parseInt(req.params.productId, 10);
    try {
      const storeRecords = await this.productService.getProductStoreRecords(productId);
      res.status(200).json({message: `Got product details for product ${productId}`, storeRecords})
    } catch {
      res.status(400).json({error: `Error getting product ${productId}`});
    }
  }

  deleteProductFromCollection = async (req: Request, res: Response) => {
    const productId: number = parseInt(req.params.productId, 10);
    const userId: number = getAuthUser(res).userId;
    try {
      await this.productService.deleteProductFromCollection(userId, productId);
      res.status(204).json({message: 'Product deleted successfully'});
    } catch (error) {
      res.status(400).json({error: 'Error deleting product from collection'});
    }
  }

  parse = async (req: Request, res: Response) => {
    try {
      const productLink: string = req.body.url;
      const result = await this.productService.parse(productLink);
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
      const userId: number = getAuthUser(res).userId;
      const productId: number = req.body.productId;
      await this.productService.addProductToUsersCollection(userId, productId);

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
