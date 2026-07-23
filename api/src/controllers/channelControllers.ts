import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { ChannelServices } from "@api/services/channelServices.js";
import { Request, Response } from "express";

const channelServices = new ChannelServices();

interface ChannelRequest extends Request {
  body: {
    uuid: string;
    channelAccountId: number;
  };
}

export class ChannelControllers {
  bindChannelAccount = async (req: ChannelRequest, res: Response) => {
    const { channelName } = req.params;
    const { uuid, channelAccountId } = req.body;

    try {
      await channelServices.bindChannelAccount(
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
}
