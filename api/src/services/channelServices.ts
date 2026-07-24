import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { getGetaway } from "@api/getaways/getGetaway.js";
import { ChannelRepositories } from "@api/repositories/channelRepositories.js";

const channelRepositories = new ChannelRepositories();

export class ChannelServices {
  async bindChannelAccount(
    userUuid: string,
    channelAccountId: number,
    channelName: string,
  ) {
    //channel name not used here. it will be needed for repository in case we decide to add channel besides telegram
    try {
      const userId = await channelRepositories.bindChannelAccount(
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
      const userUuid = await channelRepositories.createChannelToken(
        userId,
        channelName,
      );
      const gateway = getGetaway(channelName);
      return gateway.generateBindingLink(userUuid);
    } catch (error) {
      throw error;
    }
  }

  async clearOldChannelTokens() {
    try {
      await channelRepositories.clearChanellTokens();
    } catch (error) {
      console.log('API: Error clearing old channel tokens: ', error);
    }
  }
}
