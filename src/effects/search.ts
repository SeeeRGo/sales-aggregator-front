import { supabase } from "@/db";
import { parseLoadedMessage } from "@/utils";
import dayjs from "dayjs";
import { createEffect, createEvent } from "effector";

export const fetchSearchResultsFx = createEffect(async (searchQuery: string) => {
  const lastFiveDays = dayjs().add(-5, "day").startOf("day").unix();

  const { data } = await supabase
    .from("messages")
    .select()
    .gte("message_date", lastFiveDays)
    .textSearch('text', searchQuery, {
    type: 'websearch',
  })
  return data?.map(parseLoadedMessage) ?? []
})

export const resetSearchResults = createEvent()

export const setSearchQuery = createEvent<string>()