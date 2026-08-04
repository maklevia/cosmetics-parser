import { UserService } from "@api/modules/user/UserService.js";
import { Request, Response } from "express";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";

const userService = new UserService();

export class UserController {
  getUserInfo = async (req: Request, res: Response) => {
    const userId: number = getAuthUser(res).userId;
    const userInfo = await userService.getUserInfo(userId);

    res.status(200).json(userInfo);
  };

  updateUserName = async (req: Request, res: Response) => {
    const userId: number = getAuthUser(res).userId;
    const newName: string = req.body.newName;

    await userService.updateUser(userId, { name: newName });

    res.status(200).json({message: 'User name updated successfully'});
  };
}
