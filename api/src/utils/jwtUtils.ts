import jwt, { JwtPayload, VerifyCallback } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
    userId: number,
    userEmail: string,
}

export function createAccessToken(
  userId: number,
  userEmail: string,
): string {
  const accessToken: string = jwt.sign(
    {
      userId: userId,
      userEmail: userEmail,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" },
  );
  return accessToken;
}

export function createRefreshToken(
  userId: number,
  userEmail: string,
): string {
  const refreshToken: string = jwt.sign(
    {
      userId: userId,
      userEmail: userEmail,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "30d" },
  );
  return refreshToken;
}

export function validateAccessToken(
  accessToken: string,
  callback: VerifyCallback
): void {
  const accessSecret: string = process.env.ACCESS_TOKEN_SECRET as string;
  jwt.verify(accessToken, accessSecret, callback);
}

export function validateRefreshToken(
  refreshToken: string,
  callback: VerifyCallback
): void {
  const refreshSecret: string = process.env.REFRESH_TOKEN_SECRET as string;

  jwt.verify(refreshToken, refreshSecret, callback);
}
