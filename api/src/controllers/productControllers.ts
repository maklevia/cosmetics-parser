import { ProductServices } from "@api/services/productServices.js";
import { Request, Response } from "express";

export class ProductControllers {
  private productServices: ProductServices;
  constructor() {
    this.productServices = new ProductServices();
  }

  getCollection = async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.user.userId;
      const isInitial = req.query.all === "false";
      const { limit, offset } = isInitial
        ? { limit: 8, offset: 0 }
        : { limit: 1000, offset: 8 };
      const collection = await this.productServices.getCollection(
        userId,
        limit,
        offset,
      );
      console.log(collection);
      res.status(200).json({ collection });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong." });
      console.log(error);
    }
  }
}
