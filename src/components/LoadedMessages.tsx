import { ProcessStatus } from "@/constants";
import { supabase } from "@/db";
import { IMessage, LoadedMessage } from "@/types";
import { isLoadedMessages, parseLoadedMessage } from "@/utils";
import { Chip, Divider, ListSubheader, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { MessageGrid } from "./MessageGrid";
import { useStore } from "effector-react";
import { $lastDayMessages, $lastFourHourMessages, $lastHourMessages, $olderMessages } from "@/store/messages";
import { MessageSection } from "./MessagesSection";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const LoadedMessages = ({ filter }: IProps) => {
  const lastHourMessages = useStore($lastHourMessages);
  const lastFourHoursMessages = useStore($lastFourHourMessages);
  const lastDayMessages = useStore($lastDayMessages);
  const olderMessages = useStore($olderMessages);
  
  return (
    <div style={{ width: "100vw" }}>
      <MessageSection
        sectionLabel="За последний час"
        messages={lastHourMessages.filter(filter)}
      />
      <MessageSection
        sectionLabel="За последние 4 часа"
        messages={lastFourHoursMessages.filter(filter)}
      />
      <MessageSection
        sectionLabel="За последние 24 часа"
        messages={lastDayMessages.filter(filter)}
      />
      <MessageSection
        sectionLabel="За последние 10 дней"
        messages={olderMessages.filter(filter)}
      />
    </div>
  );
};
