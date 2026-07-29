import { ChannelService } from "@api/modules/channel/ChannelService.js";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";
import { ChannelName } from "@api/types/Enums.js";
import { Request, Response } from "express";

import { UserService } from "@api/modules/user/UserService.js";
import { ValidationError } from "@api/errors/AppError.js";

const channelService = new ChannelService();
const userService = new UserService();

interface ChannelRequest extends Request {
  params: {
    channelName: ChannelName;
  };
  body: {
    uuid: string;
    channelAccountId: number;
  };
}

export class ChannelController {
  bindChannelAccount = async (req: ChannelRequest, res: Response) => {
    const channelName = req.params.channelName;
    const { uuid, channelAccountId } = req.body;

    if (!uuid || !channelAccountId) {
      throw new ValidationError('"UUID and channel account ID are required')
    }

      await channelService.bindChannelAccount(
        uuid,
        channelAccountId,
        channelName,
      );
      res.status(201).json({ message: "Channel account binded to user." });
  };

  generateChannelLink = async (req: Request, res: Response) => {
    const channelName = req.params.channel as ChannelName;
    const userId: number = getAuthUser(res).userId;

      const channelLink = await channelService.generateChannelLink(userId, channelName);
      res.status(201).json({channelLink});
  }

  checkTelegramStatus = async (req: Request, res: Response) => {
    const telegramAccountId = parseInt(req.params.telegramAccountId, 10);

    if (isNaN(telegramAccountId)) {
      throw new ValidationError('Invalid telegram account ID')
    }

      const isBinded = await userService.isTelegramAccountBinded(telegramAccountId);
      res.status(200).json({ isBinded });
  }
}
