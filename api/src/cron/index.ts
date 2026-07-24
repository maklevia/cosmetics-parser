import { CronServices } from '@api/services/cronServices.js'
import cron from 'node-cron'

const cronServices = new CronServices();

export const cronJob = () => {
    cron.schedule('0 7 * * *', () => cronServices.dailyReparsing(), {
        timezone: 'Europe/Kyiv'
    })
}
