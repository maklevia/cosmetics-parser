import { Router } from "express";
import AuthController from "@api/controllers/authControllers.js";

export const authRoutes = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/refresh', AuthController.refresh);
authRoutes.post('/logout', AuthController.logout);

