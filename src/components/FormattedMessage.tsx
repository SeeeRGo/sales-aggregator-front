import { IMessage } from "@/types";
import {
  ArchiveOutlined,
  Check,
  Close,
  Delete,
  QuestionMark,
} from "@mui/icons-material";
import { Card, IconButton, Link, Typography } from "@mui/material";
import dayjs from "dayjs";
import { supabase } from "../db";
import React, { useState } from "react";
import { MessageStatus, ProcessStatus } from "@/constants";
import { StatusTooltip } from "./StatusButton";
import { parseEntities } from "@/parseEntities";

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
        <div>{dayjs.unix(message.date).format("DD.MM.YYYY HH:mm:ss")}</div>
        <div>{message.chatName}</div>
        {message.link && (
          <Link href={message.link}>Ссылка на оригинал сообщения</Link>
        )}
        <div className={`text-sm whitespace-pre-line`}>
          {parseEntities(message)}
        </div>
        <div>
          {status} / {process}
        </div>
      </div>
      <div className="flex justify-between flex-row">
        <div>
          <StatusTooltip title="Пометить как интересное">
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
          </StatusTooltip>
          <StatusTooltip title="Пометить как неинтересное">
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
          </StatusTooltip>
          <StatusTooltip title="Пометить как потенциально интересное">
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
          </StatusTooltip>
        </div>
        <div>
          <StatusTooltip title="Сообщение обработано. Нельзя поставить пока не установлен статус сообщения">
            <IconButton
              onClick={async () => {
                if (status === MessageStatus.PENDING) return;
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
          </StatusTooltip>
          <StatusTooltip title="Переместить сообщение в корзину. Нельзя поставить пока не установлен статус сообщения">
            <IconButton
              onClick={async () => {
                if (status === MessageStatus.PENDING) return;
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
          </StatusTooltip>
        </div>
      </div>
    </Card>
  );
};
