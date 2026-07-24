import { AuthServices } from "@api/services/authServices.js";
import { UserRepositories } from "@api/repositories/userRepositories.js";

const userRepositories = new UserRepositories();
const authServices = new AuthServices();

export class UserServices {
  async getUserByEmail(email: string) {
    try {
      const user = await userRepositories.getUserByEmail(email);
      return user;
    } catch (error) {
      console.log("API UserService: error searching for user in DB: ", error);
      return null;
    }
  }

  async createUser(email: string, password: string) {
    try {
      const hashedPassword = await authServices.hashPassword(password);
      const createdUser = await userRepositories.createUser(
        email,
        hashedPassword,
      );
      return createdUser;
    } catch (error) {
      console.log("API User Service: error creating new user in DB: ", error);
      return null;
    }
  }

  async getUserInfo(userId: number) {
    try {
      const user = await userRepositories.getUserById(userId);
      return user;
    } catch (error) {
      console.log('API: Error getting user info: ', error)
      throw error;
    }
  }

  async isTelegramAccountBinded(telegramAccountId: number): Promise<boolean> {
    try {
      return await userRepositories.isTelegramAccountBinded(telegramAccountId);
    } catch (error) {
      console.log('API: Error checking telegram account registration: ', error);
      return false;
    }
  }
}
