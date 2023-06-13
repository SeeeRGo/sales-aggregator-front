import { IMessage } from "@/types";
import {
  ArchiveOutlined,
  Check,
  Close,
  CopyAll,
  QuestionMark,
} from "@mui/icons-material";
import { Card, IconButton, Link } from "@mui/material";
import dayjs from "dayjs";
import { supabase } from "../db";
import React from "react";
import { MessageStatus } from "@/constants";
import { StatusTooltip } from "./StatusButton";
import { parseEntities } from "@/parseEntities";

interface IProps {
  message: IMessage;
}

export const FormattedMessage = ({ message }: IProps) => {
  const isProcessable = message.status === MessageStatus.APPROVED || message.status === MessageStatus.INTERESTING
  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
        <div>
          {dayjs.unix(message.date).format("DD.MM.YYYY HH:mm:ss")} -{" "}
          {message.status}
        </div>
        <div>{message.chatName}</div>
        {message.link && (
          <Link href={message.link}>Ссылка на оригинал сообщения</Link>
        )}
        <div className={`text-sm whitespace-pre-line`}>
          {parseEntities(message)}
        </div>
        <div>Статус обработки: {message.processStatus}</div>
      </div>
      <div className="flex justify-between flex-row">
        <div>
          <StatusTooltip title="INTERESTING">
            <IconButton
              onClick={async () => {
                await supabase.from("messages").upsert({
                  tg_message_id: message.messageId,
                  tg_chat_name: message.chatName,
                  message_date: message.date,
                  text: message.text,
                  status: MessageStatus.APPROVED,
                });
              }}
            >
              <Check color="success" />
            </IconButton>
          </StatusTooltip>
          <StatusTooltip title="POTENTIAL">
            <IconButton
              onClick={async () => {
                await supabase.from("messages").upsert({
                  tg_message_id: message.messageId,
                  tg_chat_name: message.chatName,
                  message_date: message.date,
                  text: message.text,
                  status: MessageStatus.INTERESTING,
                });
              }}
            >
              <QuestionMark />
            </IconButton>
          </StatusTooltip>
          <StatusTooltip title="IGNORED">
            <IconButton
              onClick={async () => {
                await supabase.from("messages").upsert({
                  tg_message_id: message.messageId,
                  tg_chat_name: message.chatName,
                  message_date: message.date,
                  text: message.text,
                  status: MessageStatus.REJECTED,
                });
              }}
            >
              <Close color="error" />
            </IconButton>
          </StatusTooltip>
          <StatusTooltip title="COPY">
            <IconButton
              onClick={async () => {
                await supabase.from("messages").upsert({
                  tg_message_id: message.messageId,
                  tg_chat_name: message.chatName,
                  message_date: message.date,
                  text: message.text,
                  status: MessageStatus.COPY,
                });
              }}
            >
              <CopyAll color="warning" />
            </IconButton>
          </StatusTooltip>
        </div>
        <div>
          {isProcessable ? (
            <StatusTooltip title="Сообщение обработано">
              <IconButton
                onClick={async () => {
                  await supabase.from("messages").upsert({
                    tg_message_id: message.messageId,
                    tg_chat_name: message.chatName,
                    message_date: message.date,
                    text: message.text,
                    processed_at: dayjs(),
                  });
                }}
              >
                <ArchiveOutlined color="primary" />
              </IconButton>
            </StatusTooltip>
          ) : null}
        </div>
      </div>
    </Card>
  );
};
