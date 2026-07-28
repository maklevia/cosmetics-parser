import { ValidationError } from "@api/errors/AppError.js";
import { BaseGateway } from "@api/gateways/BaseGateway.js";
import { TelegramGateway } from "@api/gateways/TelegramGateway.js";
import { ChannelName } from "@api/types/Enums.js";

const gateways = {
  [ChannelName.Telegram]: new TelegramGateway(),
} as Record<ChannelName, BaseGateway>;

export function getGateaway(channelName: ChannelName): BaseGateway {
  const gateway = gateways[channelName];
  if (!gateway) {
    throw new ValidationError('Unsupported channel');
  }

  return gateway;
}

export type GatewayEntry = [ChannelName, BaseGateway];

export function getAllGateways(): GatewayEntry[] {
  return Object.entries(gateways) as GatewayEntry[];
}
