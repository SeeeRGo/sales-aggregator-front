import { ProcessStatus } from "@/constants";
import { supabase } from "@/db";
import { IMessage, LoadedMessage } from "@/types";
import { isLoadedMessages, parseLoadedMessage } from "@/utils";
import { Chip, Divider, ListSubheader, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { MessageGrid } from "./MessageGrid";
import { useStore } from "effector-react";
import { $lastDayMessages, $lastFourHourMessages, $lastHourMessages, $messages, $olderMessages } from "@/store/messages";
import { MessageSection } from "./MessagesSection";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const LoadedMessages = ({ filter }: IProps) => {
  const messages = useStore($messages)
  const lastHourMessages = useStore($lastHourMessages);
  const lastFourHoursMessages = useStore($lastFourHourMessages);
  const lastDayMessages = useStore($lastDayMessages);
  const olderMessages = useStore($olderMessages);
  
  return (
    <div>
      <MessageSection
        messages={messages.filter(filter)}
      />
    </div>
  );
};
