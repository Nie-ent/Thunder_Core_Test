import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// ใช้คีย์แบบ Public (Anon)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client ตัวนี้จะถูกควบคุมด้วย RLS เสมอ
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);