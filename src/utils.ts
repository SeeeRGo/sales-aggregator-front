import dayjs from "dayjs";
import React from "react";
import { MessageStatus, ProcessStatus } from "./constants";
import {
  IChannelStats,
  IChannelSummary,
  IMessage,
  LoadedMessage,
  TgChannel,
  UpdateChannelStats,
  UpdateChannelSummary,
} from "./types";

export const parseLoadedMessage = ({
  tg_chat_name,
  message_date,
  text,
  link,
  entities,
  tg_message_id,
  status,
  processed_at,
}: {
    [x: string]: any;
  }): IMessage => {
  return {
    date: message_date,
    text,
    link,
    entities: [],
    chatName: tg_chat_name,
    messageId: tg_message_id,
    status: status || MessageStatus.PENDING,
    processStatus: processed_at
      ? ProcessStatus.PROCESSED
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
    duplicateMessages:
      status === MessageStatus.COPY
        ? prevSummary.duplicateMessages + 1
        : prevSummary.duplicateMessages,
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

const getMessagesInDateRange = (
  messages: LoadedMessage[],
  startDate: number,
  endDate: number
) =>
  messages
    .filter(
      ({ message_date }) => message_date > startDate && message_date < endDate
    )
    .map(parseLoadedMessage);

export const groupLoadedMessagesByCategory = (messages: LoadedMessage[]) => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  const fourHoursAgo = dayjs().add(-4, "hour").unix();
  const dayAgo = dayjs().add(-1, "day").unix();
  const monthAgo = dayjs().add(-1, "month").startOf("day").unix();
  const lastHour = getMessagesInDateRange(messages, hourAgo, dayjs().unix());
  const lastFourHours = getMessagesInDateRange(messages, fourHoursAgo, hourAgo);
  const lastDay = getMessagesInDateRange(messages, dayAgo, fourHoursAgo);
  const older = getMessagesInDateRange(messages, monthAgo, dayAgo);
  return {
    lastFourHours,
    lastDay,
    lastHour,
    older,
  };
};

export const createEmptyChannelStats = (
  name: React.ReactNode
): IChannelStats => ({
  name,
  total: {
    category: "total",
    totalMessages: 0,
    processedMessages: 0,
    duplicateMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastHour: {
    category: "lastHour",
    totalMessages: 0,
    processedMessages: 0,
    duplicateMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastFourHours: {
    category: "lastFourHours",
    totalMessages: 0,
    processedMessages: 0,
    duplicateMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastDay: {
    category: "lastDay",
    totalMessages: 0,
    processedMessages: 0,
    duplicateMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  older: {
    category: "older",
    totalMessages: 0,
    processedMessages: 0,
    duplicateMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
});

export const addChannelToStats = (
  { name, total, lastDay, lastFourHours, lastHour, older }: IChannelStats,
  channel: IChannelStats
): IChannelStats =>
  ({
    name,
    total: {
      ...total,
      totalMessages: total.totalMessages + channel.total.totalMessages,
      processedMessages:
        total.processedMessages + channel.total.processedMessages,
      duplicateMessages: total.duplicateMessages + channel.total.duplicateMessages,
      interestingMessages:
        total.interestingMessages + channel.total.interestingMessages,
      uninterestingMessages:
        total.uninterestingMessages + channel.total.uninterestingMessages,
      potentiallyMessages:
        total.potentiallyMessages + channel.total.potentiallyMessages,
    },
    lastHour: {
      ...lastHour,
      totalMessages: lastHour.totalMessages + channel.lastHour.totalMessages,
      processedMessages:
        lastHour.processedMessages + channel.lastHour.processedMessages,
      duplicateMessages:
        lastHour.duplicateMessages + channel.lastHour.duplicateMessages,
      interestingMessages:
        lastHour.interestingMessages + channel.lastHour.interestingMessages,
      uninterestingMessages:
        lastHour.uninterestingMessages + channel.lastHour.uninterestingMessages,
      potentiallyMessages:
        lastHour.potentiallyMessages + channel.lastHour.potentiallyMessages,
    },
    lastFourHours: {
      ...lastFourHours,
      totalMessages:
        lastFourHours.totalMessages + channel.lastFourHours.totalMessages,
      processedMessages:
        lastFourHours.processedMessages +
        channel.lastFourHours.processedMessages,
      duplicateMessages:
        lastFourHours.duplicateMessages + channel.lastFourHours.duplicateMessages,
      interestingMessages:
        lastFourHours.interestingMessages +
        channel.lastFourHours.interestingMessages,
      uninterestingMessages:
        lastFourHours.uninterestingMessages +
        channel.lastFourHours.uninterestingMessages,
      potentiallyMessages:
        lastFourHours.potentiallyMessages +
        channel.lastFourHours.potentiallyMessages,
    },
    lastDay: {
      ...lastDay,
      totalMessages: lastDay.totalMessages + channel.lastDay.totalMessages,
      processedMessages:
        lastDay.processedMessages + channel.lastDay.processedMessages,
      duplicateMessages:
        lastDay.duplicateMessages + channel.lastDay.duplicateMessages,
      interestingMessages:
        lastDay.interestingMessages + channel.lastDay.interestingMessages,
      uninterestingMessages:
        lastDay.uninterestingMessages + channel.lastDay.uninterestingMessages,
      potentiallyMessages:
        lastDay.potentiallyMessages + channel.lastDay.potentiallyMessages,
    },
    older: {
      ...older,
      totalMessages: older.totalMessages + channel.older.totalMessages,
      processedMessages:
        older.processedMessages + channel.older.processedMessages,
      duplicateMessages: older.duplicateMessages + channel.older.duplicateMessages,
      interestingMessages:
        older.interestingMessages + channel.older.interestingMessages,
      uninterestingMessages:
        older.uninterestingMessages + channel.older.uninterestingMessages,
      potentiallyMessages:
        older.potentiallyMessages + channel.older.potentiallyMessages,
    },
  } as IChannelStats);

export const isLoadedMessages = (
  value:
    | {
        [x: string]: any;
      }[]
    | null
): value is LoadedMessage[] => !!value;

export const orderMessagesInTimeWindow = (
  messages: IMessage[],
  startTime: IMessage["date"],
  endTime?: IMessage["date"]
) =>
  messages
    .filter(({ date }) => date > startTime && (!endTime || date < endTime))
    .sort((a: IMessage, b: IMessage) => b.date - a.date);

export const getTimeWindowText = (dateToCompare: number) => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  const fourHoursAgo = dayjs().add(-4, "hour").unix();
  const dayAgo = dayjs().add(-1, "day").unix();
  switch (true) {
    case dateToCompare > hourAgo:
      return "Сообщения за последний час";
    case dateToCompare > fourHoursAgo:
      return "Сообщения за последние 4 часа";
    case dateToCompare > dayAgo:
      return "Сообщения за последние 24 часа";
    default:
      return "Сообщения за последние 15 дней";
  }
};

export const parseChannel = ({
  channelName,
  channelType,
  id,
  comment,
  channelLink,
  rating,
}: {
  [x: string]: any;
}): TgChannel => ({
  id,
  channelName,
  link: channelLink,
  comment,
  channelType,
  rating: typeof rating === 'number' ? `${rating}` : "",
});
