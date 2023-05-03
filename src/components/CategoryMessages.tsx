import { getMessageData } from "@/api";
import { ProcessStatus } from "@/constants";
import { IMessage } from "@/types";
import { Chip, Divider, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MessageGrid } from "./MessageGrid";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const CategoryMessages = ({ filter }: IProps) => {
  const [lastHourMessages, setLastHourMessages] = useState<IMessage[]>([]);
  const [lastFourHoursMessages, setLastFourHoursMessages] = useState<
    IMessage[]
  >([]);
  const [lastDayMessages, setLastDayMessages] = useState<IMessage[]>([]);
  const [olderMessages, setOlderMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    getMessageData().then(({ lastDayMessages, lastFourHourMessages, lastHourMessages, olderMessages }) => {
      setLastHourMessages(lastHourMessages.filter(filter));
      setLastFourHoursMessages(lastFourHourMessages.filter(filter));
      setLastDayMessages(lastDayMessages.filter(filter));
      setOlderMessages(olderMessages.filter(filter));
    })
    const interval = setInterval(getMessageData, 180000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <>
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последний час" />
      </Divider>
      <MessageGrid
        chatMessages={lastHourMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 4 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastFourHoursMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 24 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastDayMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Более старые сообщения" />
      </Divider>
      <MessageGrid
        chatMessages={olderMessages}
        processStatus={ProcessStatus.PENDING}
      />
    </>
  );
};
