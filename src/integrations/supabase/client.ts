// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wxicmwidtowsywrdyicf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aWNtd2lkdG93c3l3cmR5aWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTY1MjksImV4cCI6MjA1OTk3MjUyOX0.HIYnY929YGKtQ0xzgXjWfMtWOW96VH0iT_v2B_5icvg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);