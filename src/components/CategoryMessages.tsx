import { getMessageData } from "@/api";
import { ProcessStatus } from "@/constants";
import { IMessage } from "@/types";
import { Chip, Divider, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MessageGrid } from "./MessageGrid";

interface IProps {
  lastHourMessages: IMessage[]
  lastFourHoursMessages: IMessage[]
  lastDayMessages: IMessage[]
  olderMessages: IMessage[]
}

export const CategoryMessages = ({ lastHourMessages, lastFourHoursMessages, lastDayMessages, olderMessages }: IProps) => {
  return (
    <>
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последний час" />
      </Divider>
      <MessageGrid
        chatMessages={lastHourMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 4 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastFourHoursMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Сообщения за последние 24 часа" />
      </Divider>
      <MessageGrid
        chatMessages={lastDayMessages}
        processStatus={ProcessStatus.PENDING}
      />
      <Divider style={{ marginBottom: "12px" }}>
        <Chip label="Более старые сообщения" />
      </Divider>
      <MessageGrid
        chatMessages={olderMessages}
        processStatus={ProcessStatus.PENDING}
      />
    </>
  );
};
