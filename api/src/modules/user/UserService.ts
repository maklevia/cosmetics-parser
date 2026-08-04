import { AuthService } from "@api/modules/auth/AuthService.js";
import { UserRepository } from "@api/modules/user/UserRepository.js";
import { User } from "@api/modules/user/User.js";
import { NotFoundError } from "@api/errors/AppError.js";

const userRepository = new UserRepository();
const authService = new AuthService();

export class UserService {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await userRepository.findUserByEmail(email);

    return user;
  }

  async createUser(email: string, password: string): Promise<User | null> {
    const hashedPassword = await authService.hashPassword(password);

    const createdUser = await userRepository.createUser(email, hashedPassword);
    return createdUser;
  }

  async getUserInfo(userId: number): Promise<User> {
      const user = await userRepository.findUserById(userId);

      if (!user) {
        throw new NotFoundError('No user data found')
      }

      return user;
  }

  async isTelegramAccountBinded(telegramAccountId: number): Promise<boolean> {
    return await userRepository.isTelegramAccountBinded(telegramAccountId);
  }

  async updateUser(userId: number, updateData: Partial<User>): Promise<void> {
    return await userRepository.updateUser(userId, updateData);
  }
}
