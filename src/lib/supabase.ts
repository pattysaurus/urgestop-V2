import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  sobriety_start_date: string | null;
  substance_focus: string;
  estimated_daily_spend_usd: number;
};

export type UrgeLog = {
  id: string;
  logged_at: string;
  intensity_raw: number;
  trigger_tags: string[];
  context_location: string | null;
  narrative: string | null;
  coping_used: string | null;
  coping_successful: boolean | null;
};

export type PledgeCompletion = {
  id: string;
  completed_date: string;
  period: "morning" | "evening";
  pledge_ids: string[];
  mood_score: number | null;
};
