import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, Grid } from "@mui/material";
import axios from "axios";
import { IMessage } from "@/types";
import { MessageGrid } from "@/components/MessageGrid";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todayMessages, setTodayMessages] = useState<IMessage[][]>([]);
  const [lastWeekMessages, setLastWeekMessages] = useState<IMessage[][]>([]);
  useEffect(() => {
    axios("http://localhost:5000")
      .then(({ data }) => {
        setTodayMessages(data.todayMessages);
        setLastWeekMessages(data.lastWeekMessages);
      })
      .catch();
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <p>Today messages:</p>
      <MessageGrid chats={todayMessages} />
      <p>Last week messages:</p>
      <MessageGrid chats={lastWeekMessages} />
    </main>
  );
}
