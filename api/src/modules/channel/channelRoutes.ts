import { ChannelController } from "@api/modules/channel/ChannelController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";
import { channelMiddleware } from "@api/middlewares/channelMiddleware.js";

export const channelRoutes = Router();

const channelController = new ChannelController();

channelRoutes.post('/:channel/bind', channelMiddleware, channelController.bindChannelAccount);
channelRoutes.get('/:channel/generateLink', authMiddleware, channelController.generateChannelLink);
channelRoutes.get('/telegram/status/:telegramAccountId', channelMiddleware, channelController.checkTelegramStatus);