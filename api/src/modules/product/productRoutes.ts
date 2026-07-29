import { ProductController } from "@api/modules/product/ProductController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const productRoutes = Router();

const productController = new ProductController();

productRoutes.get('/collection', authMiddleware, productController.getCollection);
productRoutes.post('/parse', authMiddleware, productController.parse);
productRoutes.post('/add-product-to-collection', authMiddleware, productController.addProduct);
productRoutes.get('/:productId/details', authMiddleware, productController.getProductStoreRecords);
productRoutes.delete('/:productId/delete', authMiddleware, productController.deleteProductFromCollection)
