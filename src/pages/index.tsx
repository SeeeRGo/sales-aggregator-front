import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMessage } from "@/types";
import { MessageGrid } from "@/components/MessageGrid";
import { Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todayMessages, setTodayMessages] = useState<IMessage[][]>([]);
  const [chatTitles, setChatTitles] = useState<string[]>([])
  const [lastWeekMessages, setLastWeekMessages] = useState<IMessage[][]>([]);
  useEffect(() => {
    axios("http://localhost:5000")
      .then(({ data }) => {
        setTodayMessages(data.todayMessages);
        setLastWeekMessages(data.lastWeekMessages);
        setChatTitles(data.chatsInfo)
      })
      .catch();
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Today messages:</Typography>
      <MessageGrid chats={todayMessages} titles={chatTitles} />
      <Typography style={{ marginBottom: '12px' }} variant='h5'>Last week messages:</Typography>
      <MessageGrid chats={lastWeekMessages} titles={chatTitles} />
    </main>
  );
}
