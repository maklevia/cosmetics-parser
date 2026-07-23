import { Context } from "telegraf";
import axios from "axios";
import { getEnvOrThrow } from "../utils/getEnvOrThrow.js";

const API_URL = getEnvOrThrow("API_ORIGIN");

interface CommandContext extends Context {
  payload: string;
}

export async function onStartCommand(ctx: CommandContext) {
  const payloadUuid = ctx.payload;

  if (payloadUuid) {
    const telegramId = ctx.from?.id;
    try {
      await axios.post(`${API_URL}/channels/telegram/bind`, {
        uuid: payloadUuid,
        channelAccountId: telegramId,
      });

      ctx.reply(
        `Your account was successfully linked. You will recieve notifications about price drops 
        on tracked products from now on 💖`,
      );
    } catch {
      ctx.reply(
        "Your link is expired or invalid. Please, generate new one on the website 💖",
      );
    }
  } else {
    ctx.reply(
      "Please, use link on the website to recieve notifications via this bot 💖",
    );
  }
}
