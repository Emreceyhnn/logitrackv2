import { createClient } from "@supabase/supabase-js";

// Server-only client. This module is imported exclusively from "use server"
// code (see app/lib/actions/upload.ts) and MUST use the service-role key.
// Falling back to the public anon key here would silently strip privileges and
// make storage writes fail in confusing ways (or, worse, behave differently
// depending on RLS) — so we fail fast instead.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "The server Supabase client requires the service-role key; refusing to " +
      "start with a degraded/anon fallback."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
