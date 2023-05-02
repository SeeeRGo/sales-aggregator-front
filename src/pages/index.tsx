import { useEffect, useState } from "react";
import axios from "axios";
import { IMessage } from "@/types";
import { MessageGrid } from "@/components/MessageGrid";
import { Typography } from "@mui/material";

export default function Home() {
  const [lastHourMessages, setLastHourMessages] = useState<IMessage[][]>([]);
  const [lastFourHoursMessages, setLastFourHoursMessages] = useState<IMessage[][]>([]);
  const [lastDayMessages, setLastDayMessages] = useState<IMessage[][]>([]);
  const [olderMessages, setOlderMessages] = useState<IMessage[][]>([]);
  useEffect(() => {
    const getData = () => {
      axios("http://localhost:5000")
      .then(({ data }) => {
        setLastHourMessages(data.lastHourMessages);
        setLastFourHoursMessages(data.lastFourHourMessages);
        setLastDayMessages(data.lastDayMessages);
        setOlderMessages(data.olderMessages);
        // setChatTitles(data.chatsInfo)
      })
      .catch();
    }
    getData()
    const interval = setInterval(getData, 180000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Сообщения за последний час:</Typography>
      <MessageGrid chats={lastHourMessages} />
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Сообщения за последние 4 часа:</Typography>
      <MessageGrid chats={lastFourHoursMessages} />
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Сообщения за последние 24 часа:</Typography>
      <MessageGrid chats={lastDayMessages} />
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Более старые сообщения:</Typography>
      <MessageGrid chats={olderMessages} />
    </main>
  );
}
