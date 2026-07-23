import { ChannelControllers } from "@api/controllers/channelControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const channelRoutes = Router();

const channelControllers = new ChannelControllers();

channelRoutes.post('/:channel/bind', channelControllers.bindChannelAccount);
channelRoutes.get('/:channel/generateLink', authMiddleware, channelControllers.generateChannelLink);