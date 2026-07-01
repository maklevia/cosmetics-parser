import { getEnvOrThrow } from "@api/utils/getEnvOrThrow";
import { DAY, MINUTE } from "@api/utils/time";
import { CookieOptions } from "express";

export const cookiesRefreshOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: getEnvOrThrow('NODE_ENV') === 'production',
    path: '/auth/refresh',
    maxAge: 30 * DAY
}

export const cookiesAccessOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: getEnvOrThrow('NODE_ENV') === 'production',
    maxAge: 15 * MINUTE
}