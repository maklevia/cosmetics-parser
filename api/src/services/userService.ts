import { AuthService } from "@api/services/AuthService.js";
import { UserRepository } from "@api/repositories/UserRepository.js";
import { User } from "@api/entities/User.js";

const userRepository = new UserRepository();
const authService = new AuthService();

export class UserService {
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await userRepository.findUserByEmail(email);
      return user;
    } catch (error) {
      console.log("API UserService: error searching for user in DB: ", error);
      return null;
    }
  }

  async createUser(email: string, password: string): Promise<User | null> {
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

  async getUserInfo(userId: number): Promise<User> {
    try {
      const user = await userRepository.findUserById(userId);

      if (!user) {
        throw new Error('API: No user info found')
      }
      
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
