import { MessageStatus, ProcessStatus } from "@/constants"

export interface IMessage {
  date: number;
  text: string;
  entities: any[];
  chatName: string;
  messageId: string;
  status: MessageStatus;
  processStatus: ProcessStatus;
}

export interface LoadedMessage {
  tg_message_id: string
  tg_chat_name: string
  text: string
  message_date: number
  status: MessageStatus | null
  deleted_at: string | null
  processed_at: string | null
}

type Category = 'total' | 'lastHour' | 'lastFourHours' | 'lastDay' | 'older'

export interface IChannelSummary {
  category: Category
  totalMessages: number
  processedMessages: number
  deletedMessages: number
  interestingMessages: number
  uninterestingMessages: number
  potentiallyMessages: number
}

export type IChannelStats = Record<Category, IChannelSummary> & { name: string }
