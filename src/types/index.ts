import { MessageStatus, ProcessStatus } from "@/constants";
import React from "react";

export interface BaseMessage {
  date: number;
  text: string;
  link: string;
  entities: TextEntity[];
  chatName: string;
  messageId: string;
}
export interface IMessage extends BaseMessage {
  status: MessageStatus;
  processStatus: ProcessStatus;
}

export interface LoadedMessage {
  tg_message_id: string;
  tg_chat_name: string;
  text: string;
  link: string;
  message_date: number;
  status: MessageStatus | null;
  deleted_at: string | null;
  processed_at: string | null;
}

export type Category =
  | "total"
  | "lastHour"
  | "lastFourHours"
  | "lastDay"
  | "older";

export interface IChannelSummary {
  category: Category;
  totalMessages: number;
  processedMessages: number;
  deletedMessages: number;
  interestingMessages: number;
  uninterestingMessages: number;
  potentiallyMessages: number;
}

export type UpdateChannelSummary = (prev: IChannelSummary) => IChannelSummary;
export type UpdateChannelStats = (
  prev: Record<string, IChannelStats>
) => Record<string, IChannelStats>;

export type IChannelStats = Record<Category, IChannelSummary> & {
  name: React.ReactNode;
};

export type TextEntityTypeTextUrl = Required<TextEntity>

export type TextEntityType =
  | "MessageEntityHashtag"
  | "MessageEntityUrl"
  | "MessageEntityBold"
  | "MessageEntityItalic"
  | "MessageEntityUnderline"
  | "MessageEntityStrikethrough"
  | "MessageEntityTextUrl";

export interface TextEntity {
  /** Offset of the entity, in UTF-16 code units */
  offset: number;
  /** Length of the entity, in UTF-16 code units */
  length: number;
  /** Type of the entity */
  className: TextEntityType;
  url?: string
}
