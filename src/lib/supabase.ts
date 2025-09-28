// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

type Extra = Record<string, string | undefined> | undefined;
const extra: Extra =
  // SDK 50+ (dev/build)
  (Constants.expoConfig?.extra as any) ??
  // older / fallback
  ((Constants as any).manifest?.extra as any);

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or ANON key");
  console.warn(
    "Add them under expo.extra in app.json (or app.config.js), then restart with cache clear."
  );
  // Throw a clearer error than the default
  throw new Error("Supabase env not set: check app.json expo.extra");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
