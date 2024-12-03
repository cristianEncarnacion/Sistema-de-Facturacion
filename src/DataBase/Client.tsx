import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvxjgavndrljpjsewpsh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eGpnYXZuZHJsanBqc2V3cHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTcwNjMsImV4cCI6MjA0ODczMzA2M30.ITk6BBLqLPobH177ZV9NujkeC0WSU44KaKZuA-ZEi3k";
export const supabase = createClient(supabaseUrl, supabaseKey);
