import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { getGetaway } from "@api/gateways/getGetaway.js";
import { ChannelName } from "@api/types/Enums.js";
import { ChannelRepository } from "@api/repositories/channelRepository.js";

const channelRepository = new ChannelRepository();

export class ChannelService {
  async bindChannelAccount(
    userUuid: string,
    channelAccountId: number,
    channelName: ChannelName,
  ): Promise<void> {
    try {
      const userId = await channelRepository.bindChannelAccount(
        userUuid,
        channelAccountId,
      );
      if (!userId) {
        throw new ChannelBindingError();
      }
    } catch (error) {
      throw error;
    }
  }

  async generateChannelLink(
    userId: number,
    channelName: ChannelName,
  ): Promise<string> {
    try {
      const userUuid = await channelRepository.createChannelToken(
        userId,
        channelName,
      );
      const gateway = getGetaway(channelName);
      return gateway.generateBindingLink(userUuid);
    } catch (error) {
      throw error;
    }
  }

  async clearOldChannelTokens(): Promise<void> {
    try {
      await channelRepository.clearChanellTokens();
    } catch (error) {
      console.log('API: Error clearing old channel tokens: ', error);
    }
  }
}
