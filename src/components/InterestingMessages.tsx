import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { TabPanel } from './TabPanel'
import { LoadedMessages } from './LoadedMessages'
import { MessageStatus, ProcessStatus } from '@/constants'

export const InterestingMessages = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Несортированные" />
          <Tab label="Обработанные" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <LoadedMessages
          filter={({ status, processStatus }) =>
            status === MessageStatus.APPROVED &&
            processStatus === ProcessStatus.PENDING
          }
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LoadedMessages
          filter={({ status, processStatus }) =>
            status === MessageStatus.APPROVED &&
            processStatus === ProcessStatus.PROCESSED
          }
        />
      </TabPanel>
    </>
  );
}