import { Request, Response } from "express";
import UserService from "../services/userServices";
import { QueryResultRow } from "pg";
import { verifyPassword } from "../utils/hashingUtils";
import {
  createAccessToken,
  createRefreshToken,
  validateRefreshToken,
} from "../utils/jwtUtils";
import {
  cookiesAccessOptions,
  cookiesRefreshOptions,
} from "../utils/cookieUtils";
import { UserPayload } from "../utils/jwtUtils";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existingUser: QueryResultRow | null =
        await UserService.getUserByEmail(email);

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const newUser: QueryResultRow | null = await UserService.createUser(
        email,
        password,
      );

      if (!newUser) {
        return res.status(500).json({ message: "Internal server/db error" });
      }

      const accessToken = createAccessToken(newUser.id, newUser.email);
      const refreshToken = createRefreshToken(newUser.id, newUser.email);

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
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, enteredPassword } = req.body;
      const existingUser: QueryResultRow | null =
        await UserService.getUserByEmail(email);
      //checking if email is registered in db
      if (!existingUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const doPasswordsMatch: boolean = await verifyPassword(
        existingUser.password,
        enteredPassword,
      );
      if (!doPasswordsMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = createAccessToken(
        existingUser.id,
        existingUser.email,
      );
      const refreshToken = createRefreshToken(
        existingUser.id,
        existingUser.email,
      );

      res.cookie("accessToken", accessToken, cookiesAccessOptions);
      res.cookie("refreshToken", refreshToken, cookiesRefreshOptions);
      return res.status(200).json({ message: "User logged in" });
    } catch (error) {
      console.log("API AuthController: login error: ", error);
    }
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token. Not authorized" });
    }

    validateRefreshToken(refreshToken, (error, decodedUser) => {
      if (error || !decodedUser) {
        res.clearCookie('accessToken', cookiesAccessOptions);
        res.clearCookie('refreshToken', cookiesRefreshOptions);
        return res
          .status(401)
          .json({ message: "No refresh token. Not authorized" });
      }

      const user = decodedUser as UserPayload;

      //refresh token validated, can create new access token
      const accessToken = createAccessToken(
        user.userId,
        user.userEmail,
      );
      res.cookie('accessToken', accessToken, cookiesAccessOptions)
      return res
        .status(200)
        .json({
          message: "User refresh token validated. Can create new access token.",
        });
    });
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie('accessToken', cookiesAccessOptions);
    res.clearCookie('refreshToken', cookiesRefreshOptions);

    return res.status(200).json({ message: "Successfully logged out" });
  }
};

export default AuthController;
