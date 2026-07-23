import { Context } from "telegraf";
import axios from "axios";
import { getEnvOrThrow } from "../utils/getEnvOrThrow.js";

const API_URL = getEnvOrThrow("API_ORIGIN");

interface CommandContext extends Context {
  payload: string;
}

interface StatusResponce {
  isBinded: boolean;
}

export async function onStartCommand(ctx: CommandContext) {
  const payloadUuid = ctx.payload;
  const telegramId = ctx.from?.id;

  if (payloadUuid) {
    try {
      await axios.post(`${API_URL}/channel/telegram/bind`, {
        uuid: payloadUuid,
        channelAccountId: telegramId,
      });

      ctx.reply(
        `Your account was successfully linked. You will recieve notifications about price drops on tracked products from now on 💖`,
      );
    } catch {
      ctx.reply(
        "Your link is expired or invalid. Please, generate new one on the website 💖",
      );
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

async function checkIsUserBinded(ctx: Context) {
  const telegramId = ctx.from?.id;

  if (telegramId) {
    try {
      // The API currently returns { isConnected: boolean }, so we use that property
      const response = await axios.get<{ isConnected: boolean }>(
        `${API_URL}/channel/telegram/status/${telegramId}`
      );
      return response.data.isConnected;
    } catch (error) {
      console.log("Bot: Error checking user status:", error);
      ctx.reply("Something went wrong. Please try again later. 💖");
      return false;
    }
  }
  
  return false;
}
