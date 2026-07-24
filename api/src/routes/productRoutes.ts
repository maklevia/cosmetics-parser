import { ParserController } from "@api/controllers/parserController.js";
import { ProductController } from "@api/controllers/productController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const productRoutes = Router();

const productController = new ProductController();
const parserController = new ParserController();

productRoutes.get('/collection', authMiddleware, productController.getCollection);
productRoutes.post('/parse', authMiddleware, parserController.parse);
productRoutes.post('/add-product-to-collection', authMiddleware, parserController.addProduct);
productRoutes.get('/:productId/details', authMiddleware, productController.getProductStoreRecords);
productRoutes.delete('/:productId/delete', authMiddleware, productController.deleteProductFromCollection)
