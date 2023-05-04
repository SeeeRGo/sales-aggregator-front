import dayjs from "dayjs";
import { MessageStatus, ProcessStatus } from "./constants";
import {
  IChannelSummary,
  IMessage,
  LoadedMessage,
  UpdateChannelSummary,
} from "./types";

export const parseLoadedMessage = ({
  tg_chat_name,
  message_date,
  text,
  tg_message_id,
  status,
  processed_at,
  deleted_at,
}: LoadedMessage): IMessage => {
  return {
    date: message_date,
    text,
    entities: [],
    chatName: tg_chat_name,
    messageId: tg_message_id,
    status: status || MessageStatus.PENDING,
    processStatus: processed_at
      ? ProcessStatus.PROCESSED
      : deleted_at
      ? ProcessStatus.DELETED
      : ProcessStatus.PENDING,
  };
};

export const createUpdateChannelStatsFromMessage =
  ({ processStatus, status }: IMessage): UpdateChannelSummary =>
  (prevSummary) => ({
    ...prevSummary,
    totalMessages: prevSummary.totalMessages + 1,
    processedMessages:
      processStatus === ProcessStatus.PROCESSED
        ? prevSummary.processedMessages + 1
        : prevSummary.processedMessages,
    deletedMessages:
      processStatus === ProcessStatus.DELETED
        ? prevSummary.deletedMessages + 1
        : prevSummary.deletedMessages,
    interestingMessages:
      status === MessageStatus.APPROVED
        ? prevSummary.interestingMessages + 1
        : prevSummary.interestingMessages,
    uninterestingMessages:
      status === MessageStatus.REJECTED
        ? prevSummary.uninterestingMessages + 1
        : prevSummary.uninterestingMessages,
    potentiallyMessages:
      status === MessageStatus.INTERESTING
        ? prevSummary.potentiallyMessages + 1
        : prevSummary.potentiallyMessages,
  });

export const createUpdateChannelStatsWithMessageGroup =
  (
    messages: IMessage[],
    category: IChannelSummary["category"]
  ): UpdateChannelStats =>
  (prevStats) =>
    messages.reduce((acc, message) => {
      const chat = acc[message.chatName];
      if (chat) {
        return {
          ...acc,
          [message.chatName]: {
            ...chat,
            [category]: {
              ...createUpdateChannelStatsFromMessage(message)(chat[category]),
            },
          },
        };
      }
      return acc;
    }, prevStats);

const getMessagesInDateRange = (messages: LoadedMessage[], startDate: number, endDate: number) => messages
    .filter(({ message_date }) => message_date > startDate && message_date < endDate).map(parseLoadedMessage)

export const groupLoadedMessagesByCategory = (messages: LoadedMessage[]) => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  const fourHoursAgo = dayjs().add(-4, "hour").unix();
  const dayAgo = dayjs().add(-1, "day").unix();
  const monthAgo = dayjs().add(-1, "month").startOf("day").unix();
  const lastHour = getMessagesInDateRange(
    messages,
    hourAgo,
    dayjs().unix()
  );
  const lastFourHours = getMessagesInDateRange(
    messages,
    fourHoursAgo,
    hourAgo
  );
  const lastDay = getMessagesInDateRange(
    messages,
    dayAgo,
    fourHoursAgo
  );
  const older = getMessagesInDateRange(
    messages,
    monthAgo,
    dayAgo
  );
  return {
    lastFourHours,
    lastDay,
    lastHour,
    older
  }
}



