import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, Grid } from "@mui/material";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todayMessages, setTodayMessages] = useState<any[]>([]);
  const [lastWeekMessages, setLastWeekMessages] = useState<any[]>([]);
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
      <div>
        {todayMessages?.map((chatMessages) =>
          chatMessages.map((message, i) => (
            <Card key={i}>
              {message.date},{message.text}
            </Card>
          ))
        )}
      </div>
      <p>Last week messages:</p>
      <Grid container columnSpacing={2} direction="row">
        {lastWeekMessages?.map((chatMessages, colIndex) => (
          <Grid
            item
            xs={3}
            rowSpacing={2}
            container
            direction="column"
            key={colIndex}
          >
            {chatMessages.map((message, i) => (
              <Grid item key={i}>
                <Card>
                  {message.date},{message.text}
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </main>
  );
}
