import { NextFunction, Request, Response } from "express";
import { AuthService } from "@api/services/AuthService.js";
import { UserPayload } from "@api/types/AuthTypes.js";

const authService = new AuthService();

export const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const accessToken: string | null = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({message: 'No access token, not authorised'})
    }

    authService.validateAccessToken(accessToken, (error, decodedUser) => {
        if (error || !decodedUser) {
            return res.status(401).json({message: 'Can`t validate access token'});
        }
        res.locals.user = decodedUser;
        next();
    });
}

export function getAuthUser(res: Response): UserPayload {
    const user = res.locals.user as UserPayload | undefined;
    if (!user) {
        throw new Error("User is not authenticated or missing from response locals.");
    }
    return user;
}
