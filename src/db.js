import { createClient } from "@supabase/supabase-js";
import { insertMessage, updateMessage } from "./effects/messages";
import { parseLoadedMessage } from "./utils";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const channel = supabase
  .channel('changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
    },
    (payload) => updateMessage(parseLoadedMessage(payload.new))
  )
  .on('postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
  },
  (payload) => insertMessage(parseLoadedMessage(payload.new)))
  .subscribe()