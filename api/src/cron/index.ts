import { ChannelService } from "@api/modules/channel/ChannelService.js";
import { NotificationCron } from "./NotificationCron.js";
import { ParsingCron } from "./ParsingCron.js";
import cron from "node-cron";

const parsingCron = new ParsingCron();
const notificationCron = new NotificationCron();
const channelService = new ChannelService();

export const setupCronJobs = () => {
  cron.schedule("0 7 * * *", () => parsingCron.dailyReparsing(), {
    timezone: "Europe/Kyiv",
  });

  cron.schedule("0 13 * * 6", () => parsingCron.weeklyDiscovery(), {
    timezone: "Europe/Kyiv",
  });

  cron.schedule("0 11 * * *", () => notificationCron.sendNotifications(), {
    timezone: "Europe/Kyiv",
  });

  cron.schedule("0 13 * * 0", async () => {
    await channelService.clearOldChannelTokens();
    await notificationCron.clearOldRecords();
  });
};
