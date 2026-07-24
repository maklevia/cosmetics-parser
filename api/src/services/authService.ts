import { compare, hash } from "bcrypt-ts";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  userId: number;
  userEmail: string;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const result: string = await hash(password, saltRounds);
    return result;
  }

  async verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    const match: boolean = await compare(password, passwordHash);
    return match;
  }

  createAccessToken(userId: number, userEmail: string): string {
    const accessTokenSecret = getEnvOrThrow("ACCESS_TOKEN_SECRET");
    const accessToken: string = jwt.sign(
      {
        userId: userId,
        userEmail: userEmail,
      },
      accessTokenSecret,
      { expiresIn: "15m" },
    );
    return accessToken;
  }

  createRefreshToken(userId: number, userEmail: string): string {
    const refreshTokenSecret = getEnvOrThrow("REFRESH_TOKEN_SECRET");
    const refreshToken: string = jwt.sign(
      {
        userId: userId,
        userEmail: userEmail,
      },
      refreshTokenSecret,
      { expiresIn: "30d" },
    );
    return refreshToken;
  }

  validateAccessToken(
    accessToken: string,
    callback: (
      error: jwt.VerifyErrors | null,
      decoded: UserPayload | undefined,
    ) => void,
  ): void {
    const accessSecret = getEnvOrThrow("ACCESS_TOKEN_SECRET");
    jwt.verify(accessToken, accessSecret, (error, decoded) => {
      callback(error, decoded as UserPayload | undefined);
    });
  }

  validateRefreshToken(
    refreshToken: string,
    callback: (
      error: jwt.VerifyErrors | null,
      decoded: UserPayload | undefined,
    ) => void,
  ): void {
    const refreshSecret = getEnvOrThrow("REFRESH_TOKEN_SECRET");
    jwt.verify(refreshToken, refreshSecret, (error, decoded) => {
      callback(error, decoded as UserPayload | undefined);
    });
  }
}
