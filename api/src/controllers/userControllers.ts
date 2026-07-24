import { UserServices } from "@api/services/userServices.js";
import { Request, Response } from "express";

const userServices = new UserServices();

export class UserControllers {
  getUserInfo = async (req: Request, res: Response) => {
    const userId: number = res.locals.user.userId;
    try {
      const userInfo = await userServices.getUserInfo(userId);

      res.status(200).json(userInfo);
    } catch (error) {
      console.log("API: error getting user info: ", error);
      res.status(400).json({ error: "Failed to get user info" });
    }
  };
}
