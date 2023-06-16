import { fetchChannelsFx, setChannelFilter, setChannelTypeSorting, setRatingSorting } from "@/effects/channels";
import { $channelModificators, $filteredChannels } from "@/store/channels";
import { MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CHANNEL_TYPE_STRINGS } from "@/constants";
import { ChannelTypeFilter } from "@/types";
import Link from "next/link";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

export default function Channels() {
  const channels = useStore($filteredChannels)
  const { filter, ratingSort, channelTypeSort } = useStore($channelModificators)
  const router = useRouter()

  useEffect(() => {
    fetchChannelsFx()
  }, [])

  return (
    <>
      <Stack direction="row" alignItems="center" columnGap={2}>
        <Typography>Каналы:</Typography>
        <Select
          value={filter}
          label="Тип канала"
          onChange={(ev) => setChannelFilter(ev.target.value as ChannelTypeFilter)}
        >
          {Object.entries(CHANNEL_TYPE_STRINGS).map(([key, value]) => (
            <MenuItem key={key} value={key}>{value}</MenuItem>
          ))}
        </Select>
      </Stack>
      <Table sx={{ minWidth: 650, maxHeight: "calc(100vh - 48px)" }}>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 100,
          }}
        >
          <TableRow>
            <TableCell>Название канала</TableCell>
            <TableCell onClick={() => {
              if(channelTypeSort === 'none') {
                setChannelTypeSorting('asc')
              } else if (channelTypeSort === 'asc') {
                setChannelTypeSorting('desc')
              } else {
                setChannelTypeSorting('none')
              }
            }}>Тип канала {channelTypeSort === 'none' ? null : channelTypeSort === 'asc' ? <ArrowUpward /> : <ArrowDownward />}</TableCell>
            <TableCell onClick={() => {
              if(ratingSort === 'none') {
                setRatingSorting('asc')
              } else if (ratingSort === 'asc') {
                setRatingSorting('desc')
              } else {
                setRatingSorting('none')
              }
            }}>Рейтинг {ratingSort === 'none' ? null : ratingSort === 'asc' ? <ArrowUpward /> : <ArrowDownward />}</TableCell>
            <TableCell>Ссылка</TableCell>
            <TableCell>Комментарий</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channels.map(({ id, channelName, channelType, rating, link, comment }) => (
            <TableRow key={id} onClick={(e) => {
              e.stopPropagation()
              router.push(`channels/${id}`);
            }}>
              <TableCell>{channelName}</TableCell>
              <TableCell>{CHANNEL_TYPE_STRINGS[channelType]}</TableCell>
              <TableCell>{rating}</TableCell>
              <TableCell><Link href={link}>{link}</Link></TableCell>
              <TableCell>{comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
