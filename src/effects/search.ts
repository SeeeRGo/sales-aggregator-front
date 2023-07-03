import { supabase } from "@/db";
import { parseLoadedMessage } from "@/utils";
import { createEffect, createEvent } from "effector";

export const fetchSearchResultsFx = createEffect(async (searchQuery: string) => {
  const parsedTextSearchQuery = searchQuery.split(' ').map(word => "'" + word + "'").join(' | ')
  const { data } = await supabase.from("messages").select().textSearch('text', parsedTextSearchQuery)
  return data?.map(parseLoadedMessage) ?? []
})

export const resetSearchResults = createEvent()

export const setSearchQuery = createEvent<string>()