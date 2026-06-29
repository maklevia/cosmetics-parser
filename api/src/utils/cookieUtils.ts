import { CookieOptions } from "express";

export const cookiesRefreshOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
}

export const cookiesAccessOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000 //15 mins
}