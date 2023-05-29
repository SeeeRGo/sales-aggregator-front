import { supabase } from "@/db";
import { IMessage } from "@/types";
import { parseLoadedMessage } from "@/utils";
import dayjs from "dayjs";
import { createEffect, createEvent } from "effector";

export const fetchMessagesFx = createEffect(async () => {
  const monthAgo = dayjs().add(-1, "month").startOf("day").unix();
  const { data } = await supabase
      .from("messages")
      .select()
      .gte("message_date", monthAgo)
  return data?.map(parseLoadedMessage) ?? [];
})

export const updateMessage = createEvent<IMessage>()