import { NextFunction, Request, Response } from "express";
import {AuthServices} from "@api/services/authServices.js";

const authServices = new AuthServices();

export const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const accessToken: string | null = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({message: 'No access token, not authorised'})
    }

    authServices.validateAccessToken(accessToken, (error, decodedUser) => {
        if (error || !decodedUser) {
            return res.status(401).json({message: 'Can`t validate access token'});
        }
        res.locals.user = decodedUser;
        next();
    });
}
