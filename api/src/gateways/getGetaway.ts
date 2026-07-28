import { BaseGateway } from "@api/gateways/BaseGateway.js";
import { TelegramGateway } from "@api/gateways/TelegramGateway.js";
import { ChannelName } from "@api/types/ChannelName.js";

const gateways = {
  [ChannelName.Telegram]: new TelegramGateway(),
} as Record<ChannelName, BaseGateway>;

export function getGetaway(channelName: ChannelName) {
  const gateway = gateways[channelName];
  if (!gateway) {
    throw new Error("Unsupported gateway!");
  }

  return gateway;
}

export type GatewayEntry = [ChannelName, BaseGateway];

export function getAllGateways(): GatewayEntry[] {
  return Object.entries(gateways) as GatewayEntry[];
}
