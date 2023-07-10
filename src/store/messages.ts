import { ProcessStatus } from "@/constants";
import {
  fetchMessagesFx,
  insertMessage,
  updateMessage,
} from "@/effects/messages";
import {
  fetchSearchResultsFx,
  removeMessageFromSearchResults,
  resetSearchResults,
  setSearchQuery,
} from "@/effects/search";
import { IMessage } from "@/types";
import { orderMessagesInTimeWindow } from "@/utils";
import dayjs from "dayjs";
import { createStore } from "effector";

export const $messages = createStore<IMessage[]>([])
  .on(fetchMessagesFx.doneData, (_, messages) =>
    messages.sort((a: IMessage, b: IMessage) => b.date - a.date)
  )
  .on(updateMessage, (state, message) =>
    state.map((msg) => (msg.messageId === message.messageId ? message : msg))
  )
  .on(insertMessage, (state, message) =>
    state.concat([message]).sort((a: IMessage, b: IMessage) => b.date - a.date)
  );

export const $lastHourMessages = $messages.map((messages) => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  return orderMessagesInTimeWindow(messages, hourAgo);
});

export const $lastFourHourMessages = $messages.map((messages) => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  const fourHoursAgo = dayjs().add(-4, "hour").unix();

  return orderMessagesInTimeWindow(messages, fourHoursAgo, hourAgo);
});

export const $lastDayMessages = $messages.map((messages) => {
  const fourHoursAgo = dayjs().add(-4, "hour").unix();
  const dayAgo = dayjs().add(-1, "day").unix();

  return orderMessagesInTimeWindow(messages, dayAgo, fourHoursAgo);
});

export const $olderMessages = $messages.map((messages) => {
  const dayAgo = dayjs().add(-1, "day").unix();
  const fifteenDaysAgo = dayjs().add(-15, "day").startOf("day").unix();

  return orderMessagesInTimeWindow(messages, fifteenDaysAgo, dayAgo);
});

export const $searchResults = createStore<IMessage[]>([])
  .on(fetchSearchResultsFx.doneData, (_, messages) =>
    messages.sort((a: IMessage, b: IMessage) => b.date - a.date)
  )
  .on(resetSearchResults, () => [])
  .on(removeMessageFromSearchResults, (state, { messageId }) => state.filter(message => message.messageId !== messageId))

export const $searchQuery = createStore<string>("").on(
  setSearchQuery,
  (_, query) => query
);
