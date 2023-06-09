import { supabase } from "@/db";
import { IMessage } from "@/types";
import { parseLoadedMessage } from "@/utils";
import dayjs from "dayjs";
import { createEffect, createEvent } from "effector";

export const fetchMessagesFx = createEffect(async () => {
  const lastFifteenDays = dayjs().add(-15, "day").startOf("day").unix();
  const { data } = await supabase
      .from("messages")
      .select()
      .gte("message_date", lastFifteenDays)
      .order('message_date', { ascending: false })
  return data?.map(parseLoadedMessage) ?? [];
})

export const updateMessage = createEvent<IMessage>()
export const insertMessage = createEvent<IMessage>()