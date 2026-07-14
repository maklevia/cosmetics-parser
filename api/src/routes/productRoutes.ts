import { ParserControllers } from "@api/controllers/parserControllers.js";
import { ProductControllers } from "@api/controllers/productControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const productRoutes = Router();

const productControllers = new ProductControllers();
const parserControllers = new ParserControllers();

productRoutes.get('/collection', authMiddleware, productControllers.getCollection);
productRoutes.post('/parse', authMiddleware, parserControllers.parse);
productRoutes.post('/add-product-to-collection', authMiddleware, parserControllers.addProduct);
