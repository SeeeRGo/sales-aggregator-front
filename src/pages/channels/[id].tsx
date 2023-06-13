import { supabase } from "@/db";
import { $channels } from "@/store/channels";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useStore } from "effector-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function ChannelPage() {
  const { back, query: { id }} = useRouter();
  const channels = useStore($channels);

  const selectedChannel = channels.find(({ id: channelId }) => `${id}` === `${channelId}`)
  
  return selectedChannel ? (
    <Stack rowGap={2}>
      <Typography variant="h5">Информация о канале</Typography>
      <TextField value={selectedChannel.channelName} label="Название канала" />
      <TextField value={selectedChannel.channelType} label="Тип канала" />
      <TextField value={selectedChannel.rating} label="Рейтинг" />
      <Stack direction="row" columnGap={2}>
        <Button>Сохранить</Button>
        <Button color="error">Удалить</Button>
        <Button onClick={() => {
          back()
        }} sx={{ color: 'black' }}>Отмена</Button>
      </Stack>
    </Stack>
  ) : null;
}
