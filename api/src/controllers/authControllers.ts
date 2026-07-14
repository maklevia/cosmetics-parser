import { Request, Response } from "express";
import { UserServices } from "@api/services/userServices.js";
import { AuthServices } from "@api/services/authServices.js";
import {
  cookiesAccessOptions,
  cookiesRefreshOptions,
} from "@api/utils/cookieUtils.js";

export class AuthControllers {
  private userServices: UserServices;
  private authServices: AuthServices;

  constructor() {
    this.userServices = new UserServices();
    this.authServices = new AuthServices();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existingUser = await this.userServices.getUserByEmail(email);

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const newUser = await this.userServices.createUser(email, password);

      if (!newUser) {
        return res.status(500).json({ message: "Internal server/db error" });
      }

      const accessToken = this.authServices.createAccessToken(
        newUser.userId,
        newUser.userEmail,
      );
      const refreshToken = this.authServices.createRefreshToken(
        newUser.userId,
        newUser.userEmail,
      );

      res.cookie("accessToken", accessToken, cookiesAccessOptions);
      res.cookie("refreshToken", refreshToken, cookiesRefreshOptions);
      return res.status(201).json({
        message: "Created user",
        newUser,
      });
    } catch (error) {
      console.log("API AuthController: signup error: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  login = async (req: Request, res: Response) => {
    try {
      const { email, enteredPassword } = req.body;
      const existingUser = await this.userServices.getUserByEmail(email);
      //checking if email is registered in db
      if (!existingUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const doPasswordsMatch = await this.authServices.verifyPassword(
        existingUser.passwordHash,
        enteredPassword,
      );
      if (!doPasswordsMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = this.authServices.createAccessToken(
        existingUser.userId,
        existingUser.userEmail,
      );
      const refreshToken = this.authServices.createRefreshToken(
        existingUser.userId,
        existingUser.userEmail,
      );

      res.cookie("accessToken", accessToken, cookiesAccessOptions);
      res.cookie("refreshToken", refreshToken, cookiesRefreshOptions);
      return res.status(200).json({ message: "User logged in" });
    } catch (error) {
      console.log("API AuthController: login error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  refresh = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token. Not authorized" });
    }

    this.authServices.validateRefreshToken(refreshToken, (error, decodedUser) => {
      if (error || !decodedUser) {
        res.clearCookie("accessToken", cookiesAccessOptions);
        res.clearCookie("refreshToken", cookiesRefreshOptions);
        return res
          .status(401)
          .json({ message: "No refresh token. Not authorized" });
      }
      const user = decodedUser;

      //refresh token validated, can create new access token
      const accessToken = this.authServices.createAccessToken(
        user.userId,
        user.userEmail,
      );
      res.cookie("accessToken", accessToken, cookiesAccessOptions);
      return res.status(200).json({
        message: "User refresh token validated. Can create new access token.",
      });
    });
  }
  logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken", cookiesAccessOptions);
    res.clearCookie("refreshToken", cookiesRefreshOptions);

    return res.status(200).json({ message: "Successfully logged out" });
  }
}
