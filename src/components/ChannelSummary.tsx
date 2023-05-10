import React from 'react'
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Collapse, IconButton, TableBody } from '@mui/material';
import { IChannelStats } from '@/types';
import { ChannelRow } from './ChannelRow';

interface IProps {
  channel: IChannelStats
}

export const ChannelSummary = ({ channel }: IProps) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{channel.name}</TableCell>
        <ChannelRow channel={channel.total} />
      </TableRow>
      {open && (
        <>
          <TableRow>
            <TableCell />
            <TableCell />
            <ChannelRow channel={channel.lastHour} />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <ChannelRow channel={channel.lastFourHours} />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <ChannelRow channel={channel.lastDay} />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <ChannelRow channel={channel.older} />
          </TableRow>
        </>
      )
      }
    </>
  );
}