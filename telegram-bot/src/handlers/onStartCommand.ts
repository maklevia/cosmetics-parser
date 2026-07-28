import axios from "axios";
import { Context } from "telegraf";
import { getEnvOrThrow } from "@bot/utils/getEnvOrThrow.js";

const API_URL = getEnvOrThrow("API_ORIGIN");

interface CommandContext extends Context {
  payload: string;
}

interface StatusResponse {
  isBinded: boolean;
}

export async function onStartCommand(ctx: CommandContext): Promise<void> {
  const payloadUuid = ctx.payload;
  const telegramId = ctx.from?.id;

  if (payloadUuid) {
    try {
      const response = await axios.post(`${API_URL}/channel/telegram/bind`, {
        uuid: payloadUuid,
        channelAccountId: telegramId,
      });

      ctx.reply(
        `Your account was successfully linked. You will recieve notifications about price drops on tracked products from now on 💖`,
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        // This is an expected error (expired/invalid UUID), no need to log it.
        ctx.reply(
          "Your link is expired or invalid. Please, generate new one on the website 💖",
        );

      } else {
        console.error("BOT: Unexpected error while binding account:", error);
        ctx.reply("Something went wrong. Please try again later 💖");
      }
    }
  } else {
    const isBinded = await checkIsUserBinded(ctx);

    if (isBinded) {
      ctx.reply(
        "Welcome back! Your account is already linked and you are actively receiving notifications 💖",
      );

    } else {
      ctx.reply(
        "Please, use link on the website to recieve notifications via this bot 💖",
      );
    }
  }
}

async function checkIsUserBinded(ctx: Context): Promise<boolean> {
  const telegramId = ctx.from?.id;

  if (telegramId) {
    try {
      const response = await axios.get<StatusResponse>(
        `${API_URL}/channel/telegram/status/${telegramId}`
      );
      return response.data.isBinded;

    } catch (error) {
      console.log("BOT: Unexpected error while checking user binded status:", error);
      ctx.reply("Something went wrong. Please try again later 💖");
      return false;
    }
  }
  
  return false;
}
