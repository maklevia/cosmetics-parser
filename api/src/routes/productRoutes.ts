import { ParserController } from "@api/controllers/parserControllers.js";
import { ProductController } from "@api/controllers/productControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const productRoutes = Router();

const productController = new ProductController();

productRoutes.get('/collection', authMiddleware, productController.getCollection);
productRoutes.post('/parse', authMiddleware, ParserController.parse);
productRoutes.post('/add-product-to-collection', authMiddleware, ParserController.addProduct);
