import { MessageStatus, ProcessStatus } from "@/constants";
import { IMessage } from "@/types";
import axios from "axios";

interface Messages {
  lastHourMessages: IMessage[];
  lastFourHourMessages: IMessage[];
  lastDayMessages: IMessage[];
  olderMessages: IMessage[];
}

export const getMessageData = (): Promise<Messages> => {
  return axios("http://localhost:5000")
    .then(({ data }) => ({
      lastHourMessages: data.lastHourMessages
        .sort((a, b) => b.date - a.date)
        .map((message) => ({
          ...message,
          status: MessageStatus.PENDING,
          processStatus: ProcessStatus.PENDING,
        })),
      lastFourHourMessages: data.lastFourHourMessages
        .sort((a, b) => b.date - a.date)
        .map((message) => ({
          ...message,
          status: MessageStatus.PENDING,
          processStatus: ProcessStatus.PENDING,
        })),
      lastDayMessages: data.lastDayMessages
        .sort((a, b) => b.date - a.date)
        .map((message) => ({
          ...message,
          status: MessageStatus.PENDING,
          processStatus: ProcessStatus.PENDING,
        })),
      olderMessages: data.olderMessages
        .sort((a, b) => b.date - a.date)
        .map((message) => ({
          ...message,
          status: MessageStatus.PENDING,
          processStatus: ProcessStatus.PENDING,
        })),
    }))
    .catch();
};
