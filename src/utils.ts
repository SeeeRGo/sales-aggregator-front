import { MessageStatus, ProcessStatus } from "./constants";
import { IMessage, LoadedMessage } from "./types";

export const parseLoadedMessage = ({ tg_chat_name, message_date, text, tg_message_id, status, processed_at, deleted_at }: LoadedMessage): IMessage => {
  return {
    date: message_date,
    text,
    entities: [],
    chatName: tg_chat_name,
    messageId: tg_message_id,
    status: status || MessageStatus.PENDING,
    processStatus: processed_at ? ProcessStatus.PROCESSED : deleted_at ? ProcessStatus.DELETED : ProcessStatus.PENDING,
  };
}