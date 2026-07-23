import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
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
}
