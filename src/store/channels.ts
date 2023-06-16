import { fetchChannelsFx, setChannelFilter, setChannelTypeSorting, setRatingSorting } from "@/effects/channels";
import { ChannelTypeFilter, SortingDirection, TgChannel } from "@/types";
import { createStore, sample } from "effector";

export const $channels = createStore<TgChannel[]>([]).on(
  fetchChannelsFx.doneData,
  (_, channels) => channels
);
export const $filteredChannels = createStore<TgChannel[]>([]).on(
  fetchChannelsFx.doneData,
  (_, channels) => channels
);

export const $channelModificators = createStore<{
  filter: ChannelTypeFilter,
  ratingSort: SortingDirection,
  channelTypeSort: SortingDirection,
}>({
  filter: 'ALL',
  ratingSort: 'none',
  channelTypeSort: 'none',
}).on(
  setChannelFilter, (state, filter) => ({
    ...state,
    filter
  })
).on(
  setRatingSorting, (state, sortDirection) => ({
    ...state,
    ratingSort: sortDirection
  })
).on(
  setChannelTypeSorting, (state, sortDirection) => ({
    ...state,
    channelTypeSort: sortDirection
  })
)

sample({
  source: $channels,
  clock: $channelModificators,
  fn: (channels, { filter, ratingSort, channelTypeSort }) => channels
    .filter(({ channelType }) => filter === 'ALL' || filter === channelType)
    .sort((a, b) => {
      if(ratingSort === 'asc') {
        return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0)
      } else if(ratingSort === 'desc') {
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
      }
      return 0
    })
    .sort((a, b) => {
      const sortCoef = channelTypeSort === 'none' ? 0 : channelTypeSort === 'asc' ? 1 : -1
      return sortCoef * a.channelType.localeCompare(b.channelType)
    }),
  target: $filteredChannels,
})
