import { supabase } from "@/db";
import { parseChannel } from "@/utils";
import { createEffect } from "effector";

export const fetchChannelsFx = createEffect(async () => {
  const { data } = await supabase
    .from("channels")
    .select()
  return data?.map(parseChannel) ?? [];
});
