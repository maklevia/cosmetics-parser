import { BadGatewayError, NotFoundError } from "./AppError.js";

export class ChannelBindingError extends NotFoundError {
  constructor(message: string = "Could not bind channel account to user") {
    super(message);
  }
}

export class ChannelNotificationError extends BadGatewayError {
  constructor(message: string = "Could not send notification to user") {
    super(message);
  }
}
