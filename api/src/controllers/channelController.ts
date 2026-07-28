import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { ChannelService } from "@api/services/channelService.js";
import { ChannelName } from "@api/types/Enums.js";
import { Request, Response } from "express";

import { UserService } from "@api/services/userService.js";

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

    try {
      await channelService.bindChannelAccount(
        uuid,
        channelAccountId,
        channelName,
      );
      res.status(201).json({ message: "Channel account binded to user." });
    } catch (error) {
      if (error instanceof ChannelBindingError) {
        res
          .status(403)
          .json({ error: "Could not bind channel account to user." });
      } else {
        res.status(400).json({ error: "Something went wrong." });
      }
    }
  };

  generateChannelLink = async (req: Request, res: Response) => {
    const channelName = req.params.channel as ChannelName;
    const userId: number = res.locals.user.userId;

    try {
      const channelLink = await channelService.generateChannelLink(userId, channelName);
      res.status(201).json({channelLink});
    } catch (error) {
      console.log(error);
      res.status(400).json({error: 'Error generating link for channel'});
    }
  }

  checkTelegramStatus = async (req: Request, res: Response) => {
    const telegramAccountId = parseInt(req.params.telegramAccountId, 10);

    if (isNaN(telegramAccountId)) {
      return res.status(400).json({ error: "Invalid telegram account ID" });
    }

    try {
      const isBinded = await userService.isTelegramAccountBinded(telegramAccountId);
      res.status(200).json({ isBinded });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error checking telegram status' });
    }
  }
}
