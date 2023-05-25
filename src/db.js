import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// export const channel = supabase
//   .channel('changes')
//   .on(
//     'postgres_changes',
//     {
//       event: 'UPDATE',
//       schema: 'public',
//       table: 'messages',
//     },
//     (payload) => console.log(payload)
//   )
//   .subscribe()