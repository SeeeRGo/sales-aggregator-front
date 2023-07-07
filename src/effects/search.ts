import { supabase } from "@/db";
import { IMessage } from "@/types";
import { parseLoadedMessage } from "@/utils";
import dayjs from "dayjs";
import { createEffect, createEvent } from "effector";

export const fetchSearchResultsFx = createEffect(async (searchQuery: string) => {
  const searchDepth = dayjs().add(-30, "day").startOf("day").unix();

  const { data } = await supabase
    .from("messages")
    .select()
    .gte("message_date", searchDepth)
    .textSearch('text', searchQuery, {
    type: 'websearch',
  })
  return data?.map(parseLoadedMessage) ?? []
})

export const resetSearchResults = createEvent()
export const removeMessageFromSearchResults = createEvent<IMessage>()

export const setSearchQuery = createEvent<string>()