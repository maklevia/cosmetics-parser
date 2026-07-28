import { AppDataSource } from "@api/config/data-source.js";
import { User } from "@api/entities/User.js";
import { ChannelName } from "@api/types/Enums.js";
import { ChannelToken } from "@api/entities/ChannelToken.js";
import { LessThan, MoreThan } from "typeorm";

export class ChannelRepository {
    private userRepo = AppDataSource.getRepository(User);
    private tokenRepo = AppDataSource.getRepository(ChannelToken);

    async bindChannelAccount(userUuid: string, channelAccountId: number): Promise<number | undefined> {
        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const token = await transactionalEntityManager.findOne(ChannelToken, {
                where: {
                    uuid: userUuid,
                    expiresAt: MoreThan(new Date())
                },
                relations: { user: true }
            });

            if (!token || !token.user) {
                return undefined;
            }

            const userId = token.user.id;

            await transactionalEntityManager.update(User, userId, {
                telegramAccountId: channelAccountId
            });

            await transactionalEntityManager.delete(ChannelToken, token.id);

            return userId;
        });
    }

    async createChannelToken(userId: number, channelName: ChannelName): Promise<string> {
        const token = new ChannelToken();
        token.user = { id: userId } as User;
        token.channel = channelName;
        
        const savedToken = await this.tokenRepo.save(token);
        return savedToken.uuid;
    }

    async clearChannelTokens(): Promise<void> {
        await this.tokenRepo.delete({
            expiresAt: LessThan(new Date())
        });
    }

    async disconnectChannelAccount(userId: number, channelName: ChannelName): Promise<void> {
        await this.userRepo.update(userId, {
            telegramAccountId: null
        });
    }
}
