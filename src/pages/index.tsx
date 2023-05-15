import { useEffect, useState } from "react";
import { IMessage, LoadedMessage } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { TabPanel } from "@/components/TabPanel";
import { CategoryMessages } from "@/components/CategoryMessages";
import { LoadedMessages } from "@/components/LoadedMessages";
import { supabase } from "@/db";
import { ProcessStatus } from "@/constants";
import { ChannelStats } from "@/components/ChannelStats";
import { isLoadedMessages } from "@/utils";
import { getMessageData } from "@/api";

export default function Home() {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState<LoadedMessage[]>([]);
  const [lastHourMessages, setLastHourMessages] = useState<IMessage[]>([]);
  const [lastFourHoursMessages, setLastFourHoursMessages] = useState<
    IMessage[]
  >([]);
  const [lastDayMessages, setLastDayMessages] = useState<IMessage[]>([]);
  const [olderMessages, setOlderMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    const filter = ({ messageId }: IMessage) => {
      const message = messages.find(
        ({ tg_message_id }) => messageId === tg_message_id
      );
      return !message?.deleted_at && !message?.processed_at;
    }
    getMessageData().then(({ lastDayMessages, lastFourHourMessages, lastHourMessages, olderMessages }) => {
      setLastHourMessages(lastHourMessages.filter(filter));
      setLastFourHoursMessages(lastFourHourMessages.filter(filter));
      setLastDayMessages(lastDayMessages.filter(filter));
      setOlderMessages(olderMessages.filter(filter));
    })
    const interval = setInterval(getMessageData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [messages]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    supabase.from("messages").select().then(({ data }) => {
      if(isLoadedMessages(data)) {
        setMessages(data);
      }
    });
  }, []);

  return (
    <main
      className={`flex flex-col items-center justify-between`}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Несортированные сообщения" />
          <Tab label="Обработанные сообщения" />
          <Tab label="Удаленные сообщения" />
          <Tab label="Статистика по каналам" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CategoryMessages
          lastDayMessages={lastDayMessages}
          lastHourMessages={lastHourMessages}
          lastFourHoursMessages={lastFourHoursMessages}
          olderMessages={olderMessages}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LoadedMessages
          filter={({ deleted_at, processed_at }) => !!processed_at}
          processStatus={ProcessStatus.PROCESSED}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LoadedMessages
          filter={({ deleted_at, processed_at }) => !!deleted_at}
          processStatus={ProcessStatus.DELETED}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ChannelStats
          filter={({ messageId }) => {
            const message = messages.find(
              ({ tg_message_id }) => messageId === tg_message_id
            );
            return !message?.deleted_at && !message?.processed_at;
          }}
        />
      </TabPanel>
    </main>
  );
}
