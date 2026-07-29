import { ForbiddenError } from "@api/errors/AppError.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import { NextFunction, Request, Response } from "express";

export const channelMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const validApiKey = getEnvOrThrow('API_KEY');

    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey !== validApiKey) {
        throw new ForbiddenError('Invalid API key');
    }

    next();
}