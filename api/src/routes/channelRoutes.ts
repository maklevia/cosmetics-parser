import { ChannelControllers } from "@api/controllers/channelControllers.js";
import { Router } from "express";

export const channelRoutes = Router();

const channelControllers = new ChannelControllers();

channelRoutes.post('/:channel/bind', channelControllers.bindChannelAccount);