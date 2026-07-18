import { CronServices } from '@api/services/cronServices.js'
import cron from 'node-cron'

const cronServices = new CronServices();

export const cronJob = () => {
    cron.schedule('19 15 * * *', () => cronServices.dailyReparsing())
}
