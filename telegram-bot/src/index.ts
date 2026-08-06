import { Telegraf } from "telegraf";
import { getEnvOrThrow } from "@bot/utils/getEnvOrThrow.js";
import { onStartCommand } from "@bot/handlers/onStartCommand.js";
import { onMessage } from "@bot/handlers/onMessage.js";
import { onShowPriceDrops } from "@bot/handlers/onShowPriceDrops.js";

const bot = new Telegraf(getEnvOrThrow("TELEGRAM_BOT_TOKEN"));

bot.start(onStartCommand);

bot.on("message", onMessage);

bot.action(/^pd:/, onShowPriceDrops);
bot.action("noop", (ctx) => ctx.answerCbQuery());

console.log("Telegram bot is running...");
bot.launch().catch((error) => {
  console.error("Failed to launch bot:", error);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
