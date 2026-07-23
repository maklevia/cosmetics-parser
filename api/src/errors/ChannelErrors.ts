export class ChannelBindingError extends Error {
  constructor(message: string = "Could not bind channel account to user") {
    super(message);
    this.name = "ChannelBindingError";
  }
}

export class ChannelNotificationError extends Error {
  constructor(message: string = "Could not send notification to user") {
    super(message);
    this.name = "ChannelNotificationError"
  }
}
