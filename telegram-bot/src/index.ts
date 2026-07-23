import { Telegraf } from "telegraf";
import { getEnvOrThrow } from "./utils/getEnvOrThrow.js";
import { onStartCommand } from "./commands/onStartCommand.js";

const bot = new Telegraf(getEnvOrThrow("TELEGRAM_BOT_TOKEN"));

bot.start(onStartCommand);

console.log("Telegram bot is running...");
bot.launch().catch((error) => {
  console.error("Failed to launch bot:", error);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
