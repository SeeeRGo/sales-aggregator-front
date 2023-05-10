import { Check } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

interface IProps {
  children: React.ReactElement<any, any>;
  title: string;
}
export const StatusTooltip = ({ children, title }: IProps) => {
  return <Tooltip title={title}>{children}</Tooltip>;
};
