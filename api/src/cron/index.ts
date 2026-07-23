import { ChannelServices } from '@api/services/channelServices.js';
import CronNotifServices from '@api/services/cronNotifServices.js';
import { CronParsingServices } from '@api/services/cronParsingServices.js'
import cron from 'node-cron'

const cronParsingServices = new CronParsingServices();
const cronNotifServices = new CronNotifServices();
const channelServices = new ChannelServices();

export const startCronJob = () => {
    cron.schedule('0 7 * * *', () => cronParsingServices.dailyReparsing(), {
        timezone: 'Europe/Kyiv'
    })

    cron.schedule('0 11 * * *', () => cronNotifServices.sendNotifications(), {
        timezone: 'Europe/Kyiv'
    })

    cron.schedule('54 15 * * *', async () => { 
        await channelServices.clearOldChannelTokens();
        await cronNotifServices.clearOldRecords();
    });
}
