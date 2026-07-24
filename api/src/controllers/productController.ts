import { ProductService } from "@api/services/productService.js";
import { Request, Response } from "express";

export class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  getCollection = async (req: Request, res: Response) => {
    try {
      const userId: number = res.locals.user.userId;
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
    const userId: number = res.locals.user.userId
    try {
      await this.productService.deleteProductFromCollection(userId, productId);
      res.status(204).json({message: 'Product deleted successfully'});
    } catch (error) {
      res.status(400).json({error: 'Error deleting product from collection'});
    }
  }
}
