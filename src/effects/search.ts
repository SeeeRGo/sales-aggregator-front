import { supabase } from "@/db";
import { parseLoadedMessage } from "@/utils";
import { createEffect, createEvent } from "effector";

export const fetchSearchResultsFx = createEffect(async (searchQuery: string) => {
  const { data } = await supabase.from("messages").select().textSearch('text', searchQuery)
  return data?.map(parseLoadedMessage) ?? []
})

export const resetSearchResults = createEvent()

export const setSearchQuery = createEvent<string>()