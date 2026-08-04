import { compare, hash } from "bcrypt-ts";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import jwt from "jsonwebtoken";
import { UserPayload } from "@api/types/AuthTypes.js";
import { UserRepository } from "@api/modules/user/UserRepository.js";
import { NotFoundError, ValidationError } from "@api/errors/AppError.js";

export class AuthService {
  private readonly userRepository = new UserRepository();

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

  async resetPassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isOldPasswordCorrect: boolean = await this.verifyPassword(user.password, oldPassword);
    if (!isOldPasswordCorrect) {
      throw new ValidationError('Old password is not correct');
    }

    const newPasswordHash: string = await this.hashPassword(newPassword);
    await this.userRepository.updateUser(userId, {password: newPasswordHash});
  }
}
