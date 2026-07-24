import { UserService } from "@api/services/userService.js";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
  getUserInfo = async (req: Request, res: Response) => {
    const userId: number = res.locals.user.userId;
    try {
      const userInfo = await userService.getUserInfo(userId);

      res.status(200).json(userInfo);
    } catch (error) {
      console.log("API: error getting user info: ", error);
      res.status(400).json({ error: "Failed to get user info" });
    }
  };
}
