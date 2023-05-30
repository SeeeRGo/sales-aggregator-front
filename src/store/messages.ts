import { fetchMessagesFx, updateMessage } from "@/effects/messages";
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
  const tenDaysAgo = dayjs().add(-10, "day").startOf("day").unix();

  return orderMessagesInTimeWindow(messages, tenDaysAgo, dayAgo);
});
