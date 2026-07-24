import { ChannelController } from "@api/controllers/channelController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const channelRoutes = Router();

const channelController = new ChannelController();

channelRoutes.post('/:channel/bind', channelController.bindChannelAccount);
channelRoutes.get('/:channel/generateLink', authMiddleware, channelController.generateChannelLink);
channelRoutes.get('/telegram/status/:telegramAccountId', channelController.checkTelegramStatus);