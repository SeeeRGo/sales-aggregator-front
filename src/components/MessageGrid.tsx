import { IMessage } from "@/types";
import { Grid } from "@mui/material";
import React from "react";
import { FormattedMessage } from "./FormattedMessage";

interface IProps {
  chatMessages: IMessage[];
}
export const MessageGrid = ({ chatMessages }: IProps) => {
  return (
    <Grid container columnSpacing={2} rowSpacing={2} direction="row">
      {chatMessages.map((message, i) => (
        <Grid item xs={3} key={i}>
          <FormattedMessage message={message} />
        </Grid>
      ))}
    </Grid>
  );
};
