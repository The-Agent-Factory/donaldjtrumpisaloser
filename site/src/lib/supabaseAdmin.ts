// src/lib/supabaseAdmin.ts
// Server-only Supabase client using the service role key.
// Never import this from a client component.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily construct the client on first use so `next build` (which evaluates
// route modules without secrets) does not throw at import time. The missing-key
// guard still fires at request time, keeping the fail-loud behavior.
let _client: SupabaseClient | null = null;

function getClientLazy(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return _client;
}

// A proxy so existing `supabaseAdmin.from(...)` call sites keep working
// unchanged, while the client is only created the first time it is touched.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClientLazy();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
