import { CronNotifServices } from '@api/services/cronNotifServices.js';
import { CronParsingServices } from '@api/services/cronParsingServices.js'
import cron from 'node-cron'

const cronParsingServices = new CronParsingServices();
const cronNotifServices = new CronNotifServices();

export const startCronJob = () => {
    cron.schedule('0 7 * * *', () => cronParsingServices.dailyReparsing(), {
        timezone: 'Europe/Kyiv'
    })

    cron.schedule('0 11 * * *', () => cronNotifServices.sendNotifications(), {
        timezone: 'Europe/Kyiv'
    })

    cron.schedule('0 3 * * 0', () => cronNotifServices.clearOldRecords());
}
