import { AppDataSource } from "@api/config/data-source.js";
import { User } from "@api/modules/user/User.js";

export class UserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async createUser(userEmail: string, userPassword: string): Promise<User> {
    const newUser = new User();
    newUser.email = userEmail;
    newUser.password = userPassword;

    const savedUser = await this.userRepo.save(newUser);

    return savedUser;
  }

  async findUserByEmail(userEmail: string): Promise<User | null> {
    const foundUser = await this.userRepo.findOneBy({ email: userEmail });
    return foundUser;
  }

  async findUserById(userId: number): Promise<User | null> {
    const foundUser = await this.userRepo.findOneBy({ id: userId });
    return foundUser;
  }

  async isTelegramAccountBinded(telegramAccountId: number): Promise<boolean> {
    const isBinded = await this.userRepo.existsBy({
      telegramAccountId: telegramAccountId,
    });
    return isBinded;
  }
}
