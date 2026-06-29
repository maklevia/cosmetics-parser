import { NextFunction, Request, Response } from "express";
import { validateAccessToken } from "../utils/jwtUtils";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) => {
    const accessToken: string | null = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({message: 'No access token, not authorised'})
    }

    validateAccessToken(accessToken, (error, decodedUser) => {
        if (error) {
            return res.status(401).json({message: 'Can`t validate access token'});
        }
        req.user = decodedUser;
        next();
    });
}
