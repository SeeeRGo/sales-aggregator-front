import { useEffect, useState } from "react";
import { Box, Button, Fab, Stack, Tab, Tabs } from "@mui/material";
import { TabPanel } from "@/components/TabPanel";
import { LoadedMessages } from "@/components/LoadedMessages";
import { MessageStatus, ProcessStatus } from "@/constants";
import { ChannelStats } from "@/components/ChannelStats";
import { InterestingMessages } from "@/components/InterestingMessages";
import { fetchMessagesFx } from "@/effects/messages";
import Link from "next/link";
import AddChannelForm from "@/components/AddChannelForm";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { resetSearchResults, setSearchQuery } from "@/effects/search";
import { useStore } from "effector-react";
import { CSVLink } from "react-csv";

export default function Home() {
  const [value, setValue] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchMessagesFx();
  }, []);

  return (
    <main className={`flex flex-col items-center justify-between`}>
      <AddChannelForm />
      <SearchForm onSubmit={() => setSearchOpen(true)} />
      <SearchResults
        open={searchOpen}
        handleClose={() => {
          setSearchOpen(false);
          resetSearchResults();
          setSearchQuery("");
        }}
      />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          justifyContent: "space-around",
          zIndex: 100,
          backgroundColor: "rgb(214, 219, 220)",
        }}
      >
        <Stack>
          <Link href="/channels">Каналы</Link>
        </Stack>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Несортированные" />
          <Tab label="Интересные" />
          <Tab label="Потенциально интересные" />
          <Tab label="Обработанные" />
          <Tab label="Игнор" />
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
          filter={({ status, processStatus }) =>
            status === MessageStatus.INTERESTING &&
            processStatus === ProcessStatus.PENDING
          }
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <LoadedMessages
          filter={({ processStatus }) =>
            processStatus === ProcessStatus.PROCESSED
          }
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.REJECTED}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <LoadedMessages
          filter={({ status }) => status === MessageStatus.COPY}
        />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <ChannelStats />
      </TabPanel>
    </main>
  );
}
