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
import { useStore } from "effector-react";
import {
  $lastDayMessages,
  $lastFourHourMessages,
  $lastHourMessages,
  $messages,
  $olderMessages,
} from "@/store/messages";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const ChannelStats = ({ filter }: IProps) => {
  const messages = useStore($messages);

  const lastHourMessages = useStore($lastHourMessages);
  const lastFourHoursMessages = useStore($lastFourHourMessages);
  const lastDayMessages = useStore($lastDayMessages);
  const olderMessages = useStore($olderMessages);

  const [loadedChannels, setLoadedChannels] = useState([]);
  console.log("loadedChannels", loadedChannels);

  useEffect(() => {
    supabase
      .from("distinct_chat")
      .select()
      .then(({ data }) => setLoadedChannels(data));
  }, []);

  const channels = loadedChannels
    .map(({ tg_chat_name }) => tg_chat_name)
    .map(createEmptyChannelStats);

  const channelsObj = channels.reduce(
    (acc, channel) => ({
      ...acc,
      [typeof channel.name === "string" ? channel.name : "summary channel"]:
        channel,
    }),
    {} as Record<string, IChannelStats>
  );

  const updChannels = createUpdateChannelStatsWithMessageGroup(
    lastDayMessages,
    "lastDay"
  )(channelsObj);

  const updChannelsWithOlder = createUpdateChannelStatsWithMessageGroup(
    olderMessages,
    "older"
  )(updChannels);

  const updChannelsWithLastHour = createUpdateChannelStatsWithMessageGroup(
    lastHourMessages,
    "lastHour"
  )(updChannelsWithOlder);

  const updChannelsWithLastFourHours = createUpdateChannelStatsWithMessageGroup(
    lastFourHoursMessages,
    "lastFourHours"
  )(updChannelsWithLastHour);

  const updChannelsWithTotals = createUpdateChannelStatsWithMessageGroup(
    messages,
    "total"
  )(updChannelsWithLastFourHours);

  const channelsVals = Object.values<IChannelStats>(updChannelsWithTotals);
  const totalStats = channelsVals.reduce(
    (acc: IChannelStats, channel: IChannelStats) =>
      addChannelToStats(acc, channel),
    createEmptyChannelStats(
      <>
        Общая статистика по каналам:{" "}
        <b style={{ fontSize: 20 }}>{channelsVals.length}</b>
      </>
    ) // Активных каналов в последний час, четыре часа, сутки, более старые
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
