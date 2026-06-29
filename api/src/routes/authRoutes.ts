import { Router } from "express";
import AuthController from "../controllers/authControllers";

const router: Router = Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

export default router;
