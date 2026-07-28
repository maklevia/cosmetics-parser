import { Router } from "express";
import { AuthController } from "@api/controllers/AuthController.js";

export const authRoutes = Router();

const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/signup', authController.signup);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);

