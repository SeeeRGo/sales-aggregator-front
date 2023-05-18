import { supabase } from "@/db";
import { IMessage } from "@/types";
import { parseLoadedMessage } from "@/utils";
import dayjs from "dayjs";

interface Messages {
  lastHourMessages: IMessage[];
  lastFourHourMessages: IMessage[];
  lastDayMessages: IMessage[];
  olderMessages: IMessage[];
}


export const getMessageData = async (): Promise<Messages> => {
  const hourAgo = dayjs().add(-1, "hour").unix();
  const fourHoursAgo = dayjs().add(-4, "hour").unix();
  const dayAgo = dayjs().add(-1, "day").unix();
  const monthAgo = dayjs().add(-1, "month").startOf("day").unix();

  const { data: lastHourMessages } = await supabase.from('messages').select().gte('message_date', hourAgo)
  const { data: lastFourHourMessages } = await supabase.from('messages').select().gte('message_date', fourHoursAgo).lte('message_date', hourAgo)
  const { data: lastDayMessages } = await supabase.from('messages').select().gte('message_date', dayAgo).lte('message_date', fourHoursAgo)
  const { data: olderMessages } = await supabase.from('messages').select().gte('message_date', monthAgo).lte('message_date', dayAgo)

  return Promise.resolve({
    lastHourMessages: lastHourMessages?.map(parseLoadedMessage).sort((a: IMessage, b: IMessage) => b.date - a.date) ?? [],
    lastFourHourMessages: lastFourHourMessages?.map(parseLoadedMessage).sort((a: IMessage, b: IMessage) => b.date - a.date) ?? [],
    lastDayMessages: lastDayMessages?.map(parseLoadedMessage).sort((a: IMessage, b: IMessage) => b.date - a.date) ?? [],
    olderMessages: olderMessages?.map(parseLoadedMessage).sort((a: IMessage, b: IMessage) => b.date - a.date) ?? [],
  })
};
