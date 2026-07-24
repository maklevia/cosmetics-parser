import { ChannelService } from "@api/services/channelService.js";
import { CronNotifService } from "@api/services/cronNotifService.js";
import { CronParsingService } from "@api/services/cronParsingService.js";
import cron from "node-cron";

const cronParsingService = new CronParsingService();
const cronNotifService = new CronNotifService();
const channelService = new ChannelService();

export const setupCronJobs = () => {
  cron.schedule("0 7 * * *", () => cronParsingService.dailyReparsing(), {
    timezone: "Europe/Kyiv",
  });

  cron.schedule("56 21 * * *", () => cronNotifService.sendNotifications(), {
    timezone: "Europe/Kyiv",
  });

  cron.schedule("0 15 * * *", async () => {
    await channelService.clearOldChannelTokens();
    await cronNotifService.clearOldRecords();
  });
};
