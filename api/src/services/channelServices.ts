import { ChannelBindingError } from "@api/errors/ChannelErrors.js";
import { ChannelRepositories } from "@api/repositories/channelRepositories.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";

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

  async generateChannelLink(userId: number, channelName: string): Promise<string> {
    try {
      const userUuid = await channelRepositories.createChannelToken(
        userId,
        channelName,
      );

      const link = this.linkCreating(userUuid, channelName);
      return link;
    } catch (error) {
      throw error;
    }
  }

  private linkCreating(userUuid: string, channelName: string): string {
    switch (channelName) {
      case "telegram":
        return `${getEnvOrThrow("TELEGRAM_BOT_LINK")}?start=${userUuid}`;
      default:
        throw new Error(
          `Unsupported channel for link generation: ${channelName}`,
        );
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
