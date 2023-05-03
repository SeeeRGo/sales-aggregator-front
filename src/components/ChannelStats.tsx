import React, { useEffect, useState } from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ChannelSummary } from './ChannelSummary';
import { supabase } from '@/db';
import { getMessageData } from '@/api';
import { IChannelStats } from '@/types';
import { parseLoadedMessage } from '@/utils';
import { channel } from 'diagnostics_channel';

interface IProps {
  filter: (message: IMessage) => boolean;
}

const createEmptyChannelStats = (name: string): IChannelStats => ({
  name,
  total: {
    category: "total",
    totalMessages: 0,
    processedMessages: 0,
    deletedMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastHour: {
    category: "lastHour",
    totalMessages: 0,
    processedMessages: 0,
    deletedMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastFourHours: {
    category: "lastFourHours",
    totalMessages: 0,
    processedMessages: 0,
    deletedMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  lastDay: {
    category: "lastDay",
    totalMessages: 0,
    processedMessages: 0,
    deletedMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
  older: {
    category: "older",
    totalMessages: 0,
    processedMessages: 0,
    deletedMessages: 0,
    interestingMessages: 0,
    uninterestingMessages: 0,
    potentiallyMessages: 0,
  },
});
export const ChannelStats = ({ filter }: IProps) => {
  const [messages, setMessages] = useState<LoadedMessage[]>([]);

  useEffect(() => {
    supabase
      .from("messages")
      .select()
      .then(({ data }) => setMessages(data));
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
        .concat(messages.map(parseLoadedMessage))

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

  const updChannels = lastDayMessages.reduce((acc, message) => {
    const chat = acc[message.chatName];
    if (chat) {
      return {
        ...acc,
        [message.chatName]: {
          ...chat,
          lastDay: {
            ...chat.lastDay,
            totalMessages: chat.lastDay.totalMessages + 1,
          },
        },
      };
    }
    return acc
  }, channelsObj);

  const updChannelsWithOlder = olderMessages.reduce((acc, message) => {
    const chat = acc[message.chatName];
    if (chat) {
      return {
        ...acc,
        [message.chatName]: {
          ...chat,
          older: {
            ...chat.older,
            totalMessages: chat.older.totalMessages + 1,
          },
        },
      };
    }
    return acc;
  }, updChannels);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell /> */}
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
          {Object.values(updChannelsWithOlder).map((channel, i) => {
            return <ChannelSummary channel={channel} key={i} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
