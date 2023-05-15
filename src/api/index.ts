import { MessageStatus, ProcessStatus } from "@/constants";
import { BaseMessage, IMessage } from "@/types";
import axios from "axios";

interface Messages {
  lastHourMessages: IMessage[];
  lastFourHourMessages: IMessage[];
  lastDayMessages: IMessage[];
  olderMessages: IMessage[];
}

export const getMessageData = (): Promise<Messages> => {
  if(process.env.API_URL) {
    return axios(process.env.API_URL)
      .then(({ data }) => ({
        lastHourMessages: data.lastHourMessages
          .sort((a: BaseMessage, b: BaseMessage) => b.date - a.date)
          .map((message: BaseMessage) => ({
            ...message,
            status: MessageStatus.PENDING,
            processStatus: ProcessStatus.PENDING,
          })),
        lastFourHourMessages: data.lastFourHourMessages
          .sort((a: BaseMessage, b: BaseMessage) => b.date - a.date)
          .map((message: BaseMessage) => ({
            ...message,
            status: MessageStatus.PENDING,
            processStatus: ProcessStatus.PENDING,
          })),
        lastDayMessages: data.lastDayMessages
          .sort((a: BaseMessage, b: BaseMessage) => b.date - a.date)
          .map((message: BaseMessage) => ({
            ...message,
            status: MessageStatus.PENDING,
            processStatus: ProcessStatus.PENDING,
          })),
        olderMessages: data.olderMessages
          .sort((a: BaseMessage, b: BaseMessage) => b.date - a.date)
          .map((message: BaseMessage) => ({
            ...message,
            status: MessageStatus.PENDING,
            processStatus: ProcessStatus.PENDING,
          })),
      }))
      .catch();
  }
  return Promise.resolve({
    lastHourMessages: [],
    lastFourHourMessages: [],
    lastDayMessages: [],
    olderMessages: [],
  })
};
