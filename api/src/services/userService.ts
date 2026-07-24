import { AuthService } from "@api/services/authService.js";
import { UserRepository } from "@api/repositories/userRepository.js";
import { AuthUserRow, NewUserRow, UserRow } from "@api/types/UserTypes.js";

const userRepository = new UserRepository();
const authService = new AuthService();

export class UserService {
  async findUserByEmail(email: string): Promise<AuthUserRow | null> {
    try {
      const user = await userRepository.findUserByEmail(email);
      return user;
    } catch (error) {
      console.log("API UserService: error searching for user in DB: ", error);
      return null;
    }
  }

  async createUser(email: string, password: string): Promise<NewUserRow | null> {
    try {
      const hashedPassword = await authService.hashPassword(password);
      const createdUser = await userRepository.createUser(
        email,
        hashedPassword,
      );
      return createdUser;
    } catch (error) {
      console.log("API User Service: error creating new user in DB: ", error);
      return null;
    }
  }

  async getUserInfo(userId: number): Promise<UserRow> {
    try {
      const user = await userRepository.findUserById(userId);
      return user;
    } catch (error) {
      console.log('API: Error getting user info: ', error)
      throw error;
    }
  }

  async isTelegramAccountBinded(telegramAccountId: number): Promise<boolean> {
    try {
      return await userRepository.isTelegramAccountBinded(telegramAccountId);
    } catch (error) {
      console.log('API: Error checking telegram account registration: ', error);
      return false;
    }
  }
}
