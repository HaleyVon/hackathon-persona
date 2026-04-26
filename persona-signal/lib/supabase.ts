import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey);

// 서버 전용 (service role) - API route에서만 사용
export function createServiceClient() {
  return createClient(url, process.env.SUPABASE_SERVICE_KEY!);
}
