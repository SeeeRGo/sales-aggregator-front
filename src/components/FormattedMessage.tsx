import { IMessage } from "@/types";
import {
  ArchiveOutlined,
  Check,
  Close as CloseIcon,
  CopyAll,
  DomainVerificationOutlined,
  HourglassTop,
  QuestionMark,
} from "@mui/icons-material";
import { Box, Card, IconButton, Link, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { supabase } from "../db";
import React, { useCallback, useState } from "react";
import { MessageStatus, ProcessStatus } from "@/constants";
import { StatusTooltip } from "./StatusButton";
import { parseEntities } from "@/parseEntities";
import { DuplicateMessages } from "./DuplicateMessages";
import { parseLoadedMessage } from "@/utils";
import { Close } from "./Close";

interface IProps {
  message: IMessage;
  ignoreDuplicates?: boolean;
  onStatusChange?: () => void;
  onClose?: () => void;
}


export const FormattedMessage = ({ message, ignoreDuplicates, onStatusChange, onClose }: IProps) => {
  const [open, setOpen] = useState(false);
  const [copyMessages, setCopyMessages] = useState<{
    [x: string]: any;
}[] | null>(null)
  const isProcessable = message.processStatus !== ProcessStatus.PROCESSED && (message.status === MessageStatus.APPROVED || message.status === MessageStatus.INTERESTING) 
  const baseRequest = useCallback(async (status: MessageStatus) => {
    await supabase.from("messages").upsert({
      tg_message_id: message.messageId,
      tg_chat_name: message.chatName,
      message_date: message.date,
      text: message.text,
      status,
    });
  }, [message])

  const handleProcessable = useCallback(async (status: MessageStatus) => {
    if (ignoreDuplicates) {
      await baseRequest(status)
    } else {
      const { data } = await supabase.from("messages").select().eq('text', message.text).in('status', [MessageStatus.INTERESTING, MessageStatus.APPROVED])
      if (!data?.length) {
        await baseRequest(status)
  
      } else {
        setCopyMessages(data)
        setOpen(true)
      }
    }
  }, [message, ignoreDuplicates, baseRequest])
  return (
    <Card>
      
      <div style={{ display: "flex", flexDirection: "column", padding: 12, position: 'relative' }}>
        {onClose ? <Close onClose={onClose} /> : null}
        <Stack rowGap={0.5}>
          <div>
            {dayjs.unix(message.date).format("DD.MM.YYYY HH:mm:ss")} -{" "}
            {message.status}
          </div>
          <div style={{ fontSize: '16px', display: 'flex', alignItems: 'flex-end' }}>Статус обработки: {message.processStatus} {message.processStatus === ProcessStatus.PENDING ? <HourglassTop color="info" /> : <DomainVerificationOutlined color="success" />}</div>
          <div>{message.chatName}</div>
          {message.link && (
            <Link href={message.link}>Ссылка на оригинал сообщения</Link>
          )}
        </Stack>
        <div className={`text-sm whitespace-pre-line`}>
          {parseEntities(message)}
        </div>
        <div>Статус обработки: {message.processStatus}</div>
      </div>
      <div className="flex justify-between flex-row">
        <div>
          <StatusTooltip title="INTERESTING">
            <IconButton
              onClick={() => {
                handleProcessable(MessageStatus.APPROVED);
                if(onStatusChange) onStatusChange()
              }}
            >
              <Check color="success" />
            </IconButton>
          </StatusTooltip>
          <StatusTooltip title="POTENTIAL">
            <IconButton
              onClick={() => {
                handleProcessable(MessageStatus.INTERESTING);
                if(onStatusChange) onStatusChange()
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
                if(onStatusChange) onStatusChange()
              }}
            >
              <CloseIcon color="error" />
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
                if(onStatusChange) onStatusChange()
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
                  if(onStatusChange) onStatusChange()
                }}
              >
                <ArchiveOutlined color="primary" />
              </IconButton>
            </StatusTooltip>
          ) : null}
        </div>
      </div>
      <DuplicateMessages open={open} handleClose={() => setOpen(false)}>
        {copyMessages ? (
          <Stack direction='row' columnGap={2}>
            <Stack rowGap={1}>
              <Typography variant="subtitle1">Сообщение на рассмотрении</Typography>
              <FormattedMessage message={message} ignoreDuplicates onStatusChange={() => setOpen(false)} />
            </Stack>
            <Stack rowGap={1}>
              <Typography variant="subtitle1">Потенциальные копии</Typography>
              {copyMessages.map((msg, i) => (
                <FormattedMessage key={i} message={parseLoadedMessage(msg)} ignoreDuplicates onStatusChange={() => setOpen(false)} />
              ))}
            </Stack>
          </Stack>
        ) : null}
      </DuplicateMessages>
    </Card>
  );
};
