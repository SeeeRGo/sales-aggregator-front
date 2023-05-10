import { ProcessStatus } from "@/constants";
import { IMessage } from "@/types";
import { Card, Grid, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "./FormattedMessage";

interface IProps {
  chatMessages: IMessage[];
  processStatus: ProcessStatus;
}
export const MessageGrid = ({ chatMessages, processStatus }: IProps) => {
  return (
    <Grid container columnSpacing={2} rowSpacing={2} direction="row">
      {chatMessages.map((message, i) => (
        <Grid item xs={6} key={i}>
          <FormattedMessage message={message} processStatus={processStatus} />
        </Grid>
      ))}
    </Grid>
  );
};
