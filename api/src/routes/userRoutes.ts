import { UserControllers } from "@api/controllers/userControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const userRoutes = Router();

const userControllers = new UserControllers();

userRoutes.get('/profile', authMiddleware, userControllers.getUserInfo);
