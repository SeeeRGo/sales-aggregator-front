import React from 'react'
import TableCell from "@mui/material/TableCell";
import { IChannelSummary } from '@/types';
import { categoryStrings } from '@/string';

interface IProps {
  channel: IChannelSummary;
}
export const ChannelRow = ({ channel }: IProps) => {
  return (
    <>
      <TableCell align="right">{categoryStrings[channel.category]}</TableCell>
      <TableCell align="right">{channel.totalMessages}</TableCell>
      <TableCell align="right">{channel.interestingMessages}</TableCell>
      <TableCell align="right">{channel.potentiallyMessages}</TableCell>
      <TableCell align="right">{channel.uninterestingMessages}</TableCell>
      <TableCell align="right">{channel.processedMessages}</TableCell>
      <TableCell align="right">{channel.deletedMessages}</TableCell>
    </>
  );
};