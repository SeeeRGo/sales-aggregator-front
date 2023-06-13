import { fetchChannelsFx } from "@/effects/channels";
import { TgChannel } from "@/types";
import { createStore } from "effector";

export const $channels = createStore<TgChannel[]>([]).on(
  fetchChannelsFx.doneData,
  (_, channels) => channels
);
