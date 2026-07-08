import { ProductParserController } from "@api/controllers/productParserControllers.js";
import { Router } from "express";

export const productParserRoutes = Router();

productParserRoutes.post('/parse', ProductParserController.parse);
