import { ProductParserController } from "@api/controllers/productParserControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const productParserRoutes = Router();

productParserRoutes.post('/parse', authMiddleware, ProductParserController.parse);
productParserRoutes.post('/add-product-to-collection', authMiddleware, ProductParserController.addProduct);
