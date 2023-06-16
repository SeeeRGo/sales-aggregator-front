import { ChannelTypeFilter } from "./types";

export enum MessageStatus {
  PENDING = "PENDING",
  APPROVED = "INTERESTING",
  REJECTED = "IGNORED",
  INTERESTING = "POTENTIAL",
  COPY = "COPY",
}

export enum ProcessStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  DELETED = "DELETED",
}

export const CHANNEL_TYPE_STRINGS: Record<ChannelTypeFilter, string> = {
  ALL: 'Все',
  СHAT: 'Чат',
  CHANNEL: 'Канал',
  BOT: 'Бот',
}