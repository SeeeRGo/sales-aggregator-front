import { useEffect, useState } from "react";
import { LoadedMessage } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { TabPanel } from "@/components/TabPanel";
import { CategoryMessages } from "@/components/CategoryMessages";
import { LoadedMessages } from "@/components/LoadedMessages";
import { supabase } from "@/db";
import { ProcessStatus } from "@/constants";
import { ChannelStats } from "@/components/ChannelStats";
import { isLoadedMessages } from "@/utils";

export default function Home() {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState<LoadedMessage[]>([]);

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
          filter={({ messageId }) => {
            const message = messages.find(
              ({ tg_message_id }) => messageId === tg_message_id
            );
            return !message?.deleted_at && !message?.processed_at;
          }}
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
