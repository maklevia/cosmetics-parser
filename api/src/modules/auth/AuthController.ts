import { NextFunction, Request, Response } from "express";
import { UserService } from "@api/modules/user/UserService.js";
import { AuthService } from "@api/modules/auth/AuthService.js";
import {
  cookiesAccessOptions,
  cookiesRefreshOptions,
} from "@api/utils/cookieUtils.js";
import { AuthenticationError, ConflictError } from "@api/errors/AppError.js";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";

export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictError("User already registered");
    }

    const newUser = await this.userService.createUser(email, password);

    if (!newUser) {
      throw new Error();
    }

    const accessToken = this.authService.createAccessToken(
      newUser.id,
      newUser.email,
    );
    const refreshToken = this.authService.createRefreshToken(
      newUser.id,
      newUser.email,
    );

    res.cookie("accessToken", accessToken, cookiesAccessOptions);
    res.cookie("refreshToken", refreshToken, cookiesRefreshOptions);
    return res.status(201).json({
      message: "Created user",
      newUser,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, enteredPassword } = req.body;
    const existingUser = await this.userService.findUserByEmail(email);
    //checking if email is registered in db
    if (!existingUser) {
      throw new AuthenticationError("Invalid credentials");
    }
    const doPasswordsMatch = await this.authService.verifyPassword(
      existingUser.password,
      enteredPassword,
    );
    if (!doPasswordsMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    const accessToken = this.authService.createAccessToken(
      existingUser.id,
      existingUser.email,
    );
    const refreshToken = this.authService.createRefreshToken(
      existingUser.id,
      existingUser.email,
    );

    res.cookie("accessToken", accessToken, cookiesAccessOptions);
    res.cookie("refreshToken", refreshToken, cookiesRefreshOptions);
    return res.status(200).json({ message: "User logged in" });
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AuthenticationError("No refresh token");
    }

    this.authService.validateRefreshToken(
      refreshToken,
      (error, decodedUser) => {
        if (error || !decodedUser) {
          res.clearCookie("accessToken", cookiesAccessOptions);
          res.clearCookie("refreshToken", cookiesRefreshOptions);
          return next(new AuthenticationError("No refresh token"));
        }

        const user = decodedUser;

        //refresh token validated, can create new access token
        const accessToken = this.authService.createAccessToken(
          user.userId,
          user.userEmail,
        );
        res.cookie("accessToken", accessToken, cookiesAccessOptions);
        return res.status(200).json({
          message: "User refresh token validated. Can create new access token.",
        });
      },
    );
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken", cookiesAccessOptions);
    res.clearCookie("refreshToken", cookiesRefreshOptions);

    return res.status(200).json({ message: "Successfully logged out" });
  };

  resetPassword = async (req: Request, res: Response) => {
    const userId: number = getAuthUser(res).userId;
    const newPassword: string = req.body.newPassword;
    const oldPassword: string = req.body.oldPassword;

    await this.authService.resetPassword(userId, oldPassword, newPassword);

    res.status(200).json({message: 'Password resetted successfully'});
  }
}
