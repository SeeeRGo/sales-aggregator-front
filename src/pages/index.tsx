import { useEffect, useState } from "react";
import { IMessage, LoadedMessage } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { TabPanel } from "@/components/TabPanel";
import { CategoryMessages } from "@/components/CategoryMessages";
import { LoadedMessages } from "@/components/LoadedMessages";
import { supabase } from "@/db";
import { MessageStatus, ProcessStatus } from "@/constants";
import { ChannelStats } from "@/components/ChannelStats";
import { isLoadedMessages } from "@/utils";
import { getMessageData } from "@/api";
import { InterestingMessages } from "@/components/InterestingMessages";
import { fetchMessagesFx } from "@/effects/messages";

export default function Home() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchMessagesFx();
  }, [])

  return (
    <main className={`flex flex-col items-center justify-between`}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Несортированные" />
          <Tab label="Интересные" />
          <Tab label="Потенциально интересные" />
          <Tab label="В игноре" />
          <Tab label="Дублированные" />
          <Tab label="Статистика по каналам" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.PENDING}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InterestingMessages />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.INTERESTING}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.REJECTED}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.COPY}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
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
