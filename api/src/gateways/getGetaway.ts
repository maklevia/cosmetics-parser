import { BaseGateway } from "@api/gateways/BaseGateway.js";
import { TelegramGateway } from "@api/gateways/TelegramGateway.js";

const gateways: Record<string, BaseGateway> = {
  telegram: new TelegramGateway(),
};

export function getGetaway(channelName: string) {
  const gateway = gateways[channelName];
  if (!gateway) {
    throw new Error("Unsupported gateway!");
  }

  return gateway;
}

export function getAllGateways(): [string, BaseGateway][] {
  return Object.entries(gateways);
}
