import { CronServices } from '@api/services/cronServices.js'
import cron from 'node-cron'

const cronServices = new CronServices();

export const cronJob = () => {
    cron.schedule('21 11 * * *', () => cronServices.dailyReparsing(), {
        timezone: 'Europe/Kyiv'
    })
}
