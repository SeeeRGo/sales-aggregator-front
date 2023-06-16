import { supabase } from "@/db";
import { ChannelTypeFilter, SortingDirection } from "@/types";
import { parseChannel } from "@/utils";
import { createEffect, createEvent } from "effector";

export const fetchChannelsFx = createEffect(async () => {
  const { data } = await supabase
    .from("channels")
    .select()
  return data?.map(parseChannel) ?? [];
});

export const setChannelFilter = createEvent<ChannelTypeFilter>()
export const setRatingSorting = createEvent<SortingDirection>()
export const setChannelTypeSorting = createEvent<SortingDirection>()
