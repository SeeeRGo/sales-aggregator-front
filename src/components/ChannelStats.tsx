import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ChannelSummary } from "./ChannelSummary";
import {
  IChannelStats,
} from "@/types";
import {
  addChannelToStats,
  createEmptyChannelStats,
  createUpdateChannelStatsWithMessageGroup,
} from "@/utils";
import { useStore } from "effector-react";
import {
  $lastDayMessages,
  $lastFourHourMessages,
  $lastHourMessages,
  $messages,
  $olderMessages,
} from "@/store/messages";
import { fetchChannelsFx } from "@/effects/channels";
import { $trackedChannels } from "@/store/channels";

export const ChannelStats = () => {
  const messages = useStore($messages);
  const loadedChannels = useStore($trackedChannels)

  const lastHourMessages = useStore($lastHourMessages);
  const lastFourHoursMessages = useStore($lastFourHourMessages);
  const lastDayMessages = useStore($lastDayMessages);
  const olderMessages = useStore($olderMessages);


  useEffect(() => {
    fetchChannelsFx()
  }, []);

  const channels = loadedChannels
    .map(({ channelName }) => channelName)
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
    <Table sx={{ minWidth: 650, maxHeight: "calc(100vh - 72px)" }}>
      <TableHead sx={{ position: "sticky", top: 48, backgroundColor: 'white', zIndex: 100, }}>
        <TableRow>
          <TableCell />
          <TableCell>Название канала</TableCell>
          <TableCell align="right">Период</TableCell>
          <TableCell align="right">Всего сообщений</TableCell>
          <TableCell align="right">Интересные</TableCell>
          <TableCell align="right">Потенциально интересные</TableCell>
          <TableCell align="right">Игнор</TableCell>
          <TableCell align="right">Дублированные</TableCell>
          <TableCell align="right">Обработанные</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <ChannelSummary channel={totalStats} />
        {channelsVals
          .sort((a, b) => b.total.totalMessages - a.total.totalMessages)
          .map((channel, i: number) => {
          return <ChannelSummary channel={channel as IChannelStats} key={i} />;
        })}
      </TableBody>
    </Table>
  );
};
