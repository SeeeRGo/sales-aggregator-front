import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ChannelSummary } from "./ChannelSummary";
import { supabase } from "@/db";
import { getMessageData } from "@/api";
import {
  IChannelStats,
  IChannelSummary,
  IMessage,
  LoadedMessage,
} from "@/types";
import {
  addChannelToStats,
  createEmptyChannelStats,
  createUpdateChannelStatsWithMessageGroup,
  groupLoadedMessagesByCategory,
  isLoadedMessages,
  parseLoadedMessage,
} from "@/utils";
import { channel } from "diagnostics_channel";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const ChannelStats = ({ filter }: IProps) => {
  const [messages, setMessages] = useState<LoadedMessage[]>([]);

  useEffect(() => {
    supabase
      .from("messages")
      .select()
      .then(({ data }) => {
        if (isLoadedMessages(data)) {
          setMessages(data);
        }
      });
  }, []);

  const [lastHourMessages, setLastHourMessages] = useState<IMessage[]>([]);
  const [lastFourHoursMessages, setLastFourHoursMessages] = useState<
    IMessage[]
  >([]);
  const [lastDayMessages, setLastDayMessages] = useState<IMessage[]>([]);
  const [olderMessages, setOlderMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    getMessageData().then(
      ({
        lastDayMessages,
        lastFourHourMessages,
        lastHourMessages,
        olderMessages,
      }) => {
        setLastHourMessages(lastHourMessages.filter(filter));
        setLastFourHoursMessages(lastFourHourMessages.filter(filter));
        setLastDayMessages(lastDayMessages.filter(filter));
        setOlderMessages(olderMessages.filter(filter));
      }
    );
    const interval = setInterval(getMessageData, 180000);
    return () => clearInterval(interval);
  }, [filter]);

  const messagesAll = lastHourMessages
    .concat(lastFourHoursMessages)
    .concat(lastDayMessages)
    .concat(olderMessages)
    .concat(messages.map(parseLoadedMessage));

  const channels = Array.from(
    new Set(messagesAll.map(({ chatName }) => chatName))
  ).map(createEmptyChannelStats);

  const channelsObj = channels.reduce(
    (acc, channel) => ({
      ...acc,
      [channel.name]: channel,
    }),
    {} as Record<string, IChannelStats>
  );

  const { lastDay, lastHour, older, lastFourHours } =
    groupLoadedMessagesByCategory(messages);

  const updChannels = createUpdateChannelStatsWithMessageGroup(
    lastDayMessages.concat(lastDay),
    "lastDay"
  )(channelsObj);

  const updChannelsWithOlder = createUpdateChannelStatsWithMessageGroup(
    olderMessages.concat(older),
    "older"
  )(updChannels);

  const updChannelsWithLastHour = createUpdateChannelStatsWithMessageGroup(
    lastHourMessages.concat(lastHour),
    "lastHour"
  )(updChannelsWithOlder);

  const updChannelsWithLastFourHours = createUpdateChannelStatsWithMessageGroup(
    lastFourHoursMessages.concat(lastFourHours),
    "lastFourHours"
  )(updChannelsWithLastHour);
  const allMessagesAll = [
    ...lastDayMessages.concat(lastDay),
    ...olderMessages.concat(older),
    ...lastHourMessages.concat(lastHour),
    ...lastFourHoursMessages.concat(lastFourHours),
  ];

  const updChannelsWithTotals = createUpdateChannelStatsWithMessageGroup(
    allMessagesAll,
    "total"
  )(updChannelsWithLastFourHours);

  const channelsVals = Object.values<IChannelStats>(updChannelsWithTotals);
  const totalStats = channelsVals.reduce(
    (acc: IChannelStats, channel: IChannelStats) =>
      addChannelToStats(acc, channel),
    createEmptyChannelStats(`Общая статистика - ${channelsVals.length} каналов`) // Активных каналов в последний час, четыре часа, сутки, более старые
  );

  return (
    <Table stickyHeader sx={{ minWidth: 650, maxHeight: "calc(100vh - 72px)" }}>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Название канала</TableCell>
          <TableCell align="right">Период</TableCell>
          <TableCell align="right">Всего сообщений</TableCell>
          <TableCell align="right">Интересные сообщения</TableCell>
          <TableCell align="right">Потенциально интересные</TableCell>
          <TableCell align="right">Неинтересные сообщения</TableCell>
          <TableCell align="right">Обработанные сообщения</TableCell>
          <TableCell align="right">Удаленные сообщения</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <ChannelSummary channel={totalStats} />
        {channelsVals.map((channel, i: number) => {
          return <ChannelSummary channel={channel as IChannelStats} key={i} />;
        })}
      </TableBody>
    </Table>
  );
};
