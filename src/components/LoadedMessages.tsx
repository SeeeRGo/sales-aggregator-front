import { ProcessStatus } from "@/constants";
import { supabase } from "@/db";
import { IMessage, LoadedMessage } from "@/types";
import { isLoadedMessages, parseLoadedMessage } from "@/utils";
import { Chip, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { MessageGrid } from "./MessageGrid";

interface IProps {
  filter: (message: LoadedMessage) => boolean;
  processStatus: ProcessStatus;
}

export const LoadedMessages = ({ filter, processStatus }: IProps) => {
  const [lastHourMessages, setLastHourMessages] = useState<IMessage[]>([]);
  const [lastFourHoursMessages, setLastFourHoursMessages] = useState<
    IMessage[]
  >([]);
  const [lastDayMessages, setLastDayMessages] = useState<IMessage[]>([]);
  const [olderMessages, setOlderMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    const getData = () => {
      supabase
        .from("messages")
        .select()
        .then(({ data }) => {
          const hourAgo = dayjs().add(-1, "hour").unix();
          const fourHoursAgo = dayjs().add(-4, "hour").unix();
          const dayAgo = dayjs().add(-1, "day").unix();
          const monthAgo = dayjs().add(-1, "month").startOf("day").unix();
          if (isLoadedMessages(data)) {
            const lastHour = data
              ?.filter(({ message_date }) => message_date > hourAgo)
              .filter(filter)
              .map(parseLoadedMessage)
              .sort((a, b) => b.date - a.date);

            if (lastHour) {
              setLastHourMessages(lastHour);
            }

            const oneToFourHours = data
              ?.filter(
                ({ message_date }) =>
                  message_date < hourAgo && message_date > fourHoursAgo
              )
              .filter(filter)
              .map(parseLoadedMessage)
              .sort((a, b) => b.date - a.date);

            if (oneToFourHours) {
              setLastFourHoursMessages(oneToFourHours);
            }

            const fourHoursToDay = data
              ?.filter(
                ({ message_date }) =>
                  message_date < fourHoursAgo && message_date > dayAgo
              )
              .filter(filter)
              .map(parseLoadedMessage)
              .sort((a, b) => b.date - a.date);

            if (fourHoursToDay) {
              setLastDayMessages(fourHoursToDay);
            }

            const olderMessages = data
              ?.filter(
                ({ message_date }) =>
                  message_date < dayAgo && message_date > monthAgo
              )
              .filter(filter)
              .map(parseLoadedMessage)
              .sort((a, b) => b.date - a.date);

            if (olderMessages) {
              setOlderMessages(olderMessages);
            }
          }
        });
    };
    getData();
    const interval = setInterval(getData, 180000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <>
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последний час" />
      </Divider>
      <MessageGrid
        chatMessages={lastHourMessages}
        processStatus={processStatus}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 4 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastFourHoursMessages}
        processStatus={processStatus}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 24 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastDayMessages}
        processStatus={processStatus}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Более старые сообщения" />
      </Divider>
      <MessageGrid chatMessages={olderMessages} processStatus={processStatus} />
    </>
  );
};
