import { Context } from "telegraf";

export function onMessage(ctx: Context): void {
    ctx.reply('I am a notification bot for Cosmetics Price Tracker!\n\nPlease use the web app to manage your alerts 💖')
}