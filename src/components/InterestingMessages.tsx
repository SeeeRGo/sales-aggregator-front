import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { TabPanel } from "./TabPanel";
import { LoadedMessages } from "./LoadedMessages";
import { MessageStatus, ProcessStatus } from "@/constants";

export const InterestingMessages = () => {
  return (
    <LoadedMessages
      filter={({ status, processStatus }) =>
        status === MessageStatus.APPROVED &&
        processStatus === ProcessStatus.PENDING
      }
    />
  );
};
