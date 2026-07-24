import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { getGetaway } from "@api/getaways/getGetaway.js";
import { ChannelRepository } from "@api/repositories/channelRepository.js";

const channelRepository = new ChannelRepository();

export class ChannelService {
  async bindChannelAccount(
    userUuid: string,
    channelAccountId: number,
    channelName: string,
  ): Promise<void> {
    //channel name not used here. it will be needed for repository in case we decide to add channel besides telegram
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
    channelName: string,
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
