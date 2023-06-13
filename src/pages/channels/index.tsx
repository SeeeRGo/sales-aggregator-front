import { fetchChannelsFx } from "@/effects/channels";
import { $channels } from "@/store/channels";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Channels() {
  const channels = useStore($channels)
  const router = useRouter()

  useEffect(() => {
    fetchChannelsFx()
  }, [])

  return (
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
          <TableCell>Тип канала</TableCell>
          <TableCell>Рейтинг</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {channels.map(({ id, channelName, channelType, rating }) => (
          <TableRow key={id} onClick={() => router.push(`channels/${id}`)}>
            <TableCell>{channelName}</TableCell>
            <TableCell>{channelType}</TableCell>
            <TableCell>{rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
