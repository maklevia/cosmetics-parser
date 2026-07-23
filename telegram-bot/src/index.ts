import { Telegraf } from "telegraf";
import { getEnvOrThrow } from "./utils/getEnvOrThrow.js";
import { onStartCommand } from "./commands/onStartCommand.js";

const bot = new Telegraf(getEnvOrThrow("TELEGRAM_BOT_TOKEN"));

bot.launch().then(() => {
  console.log("Telegram bot is running");
});

bot.command("/start", onStartCommand);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
