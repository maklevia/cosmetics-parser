import { Router } from "express";
import { AuthControllers } from "@api/controllers/authControllers.js";

export const authRoutes = Router();

const authControllers = new AuthControllers();

authRoutes.post('/login', authControllers.login);
authRoutes.post('/signup', authControllers.signup);
authRoutes.post('/refresh', authControllers.refresh);
authRoutes.post('/logout', authControllers.logout);

