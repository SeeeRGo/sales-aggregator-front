import { IMessage } from "@/types";
import {
  ArchiveOutlined,
  Check,
  Close,
  Delete,
  QuestionMark,
} from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { supabase } from "../db";
import React, { useState } from "react";
import { MessageStatus, ProcessStatus } from "@/constants";

interface IProps {
  message: IMessage;
  processStatus: ProcessStatus;
}

export const FormattedMessage = ({ message, processStatus }: IProps) => {
  const [status, setStatus] = useState(message.status);

  const [process, setProcessStatus] = useState(processStatus);
  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>{dayjs.unix(message.date).format("DD.MM.YYYY HH:MM")}</div>
        <div>{message.chatName}</div>
        <div className={`text-sm`}>{message.text}</div>
        <div>
          {status} / {process}
        </div>
      </div>
      <div className="flex justify-between flex-row">
        <div>
          <IconButton
            onClick={async () => {
              await supabase.from("messages").upsert({
                tg_message_id: message.messageId,
                tg_chat_name: message.chatName,
                message_date: message.date,
                text: message.text,
                status: MessageStatus.APPROVED,
              });
              return setStatus(MessageStatus.APPROVED);
            }}
          >
            <Check color="success" />
          </IconButton>
          <IconButton
            onClick={async () => {
              await supabase.from("messages").upsert({
                tg_message_id: message.messageId,
                tg_chat_name: message.chatName,
                message_date: message.date,
                text: message.text,
                status: MessageStatus.REJECTED,
              });
              return setStatus(MessageStatus.REJECTED);
            }}
          >
            <Close color="error" />
          </IconButton>
          <IconButton
            onClick={async () => {
              await supabase.from("messages").upsert({
                tg_message_id: message.messageId,
                tg_chat_name: message.chatName,
                message_date: message.date,
                text: message.text,
                status: MessageStatus.INTERESTING,
              });
              return setStatus(MessageStatus.INTERESTING);
            }}
          >
            <QuestionMark />
          </IconButton>
        </div>
        <div>
          <IconButton
            onClick={async () => {
              await supabase.from("messages").upsert({
                tg_message_id: message.messageId,
                tg_chat_name: message.chatName,
                message_date: message.date,
                text: message.text,
                processed_at: dayjs(),
                deleted_at: null,
              });
              return setProcessStatus(ProcessStatus.PROCESSED);
            }}
          >
            <ArchiveOutlined color="primary" />
          </IconButton>
          <IconButton
            onClick={async () => {
              await supabase.from("messages").upsert({
                tg_message_id: message.messageId,
                tg_chat_name: message.chatName,
                message_date: message.date,
                text: message.text,
                deleted_at: dayjs(),
                processed_at: null,
              });
              return setProcessStatus(ProcessStatus.DELETED);
            }}
          >
            <Delete color="secondary" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};
