import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import { DAY, MINUTE } from "@api/utils/time.js";
import { CookieOptions } from "express";

export const cookiesRefreshOptions: CookieOptions = {
    httpOnly: true,
    sameSite: getEnvOrThrow('NODE_ENV') === 'production' ? 'none' : 'strict',
    secure: getEnvOrThrow('NODE_ENV') === 'production',
    path: '/auth/refresh',
    maxAge: 30 * DAY
}

export const cookiesAccessOptions: CookieOptions = {
    httpOnly: true,
    sameSite: getEnvOrThrow('NODE_ENV') === 'production' ? 'none' : 'strict',
    secure: getEnvOrThrow('NODE_ENV') === 'production',
    path: '/',
    maxAge: 15 * MINUTE
}