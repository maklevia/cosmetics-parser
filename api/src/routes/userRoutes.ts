import { UserController } from "@api/controllers/UserController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const userRoutes = Router();

const userController = new UserController();

userRoutes.get('/profile', authMiddleware, userController.getUserInfo);
