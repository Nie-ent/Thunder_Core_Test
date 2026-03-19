import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// ใช้คีย์ฝั่ง Server เท่านั้น ห้ามให้ Frontend เห็นเด็ดขาด!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client ตัวนี้มีพลังระดับพระเจ้า (ทะลุ RLS ทุกตาราง)
// ใช้เฉพาะใน Server Actions, API Routes หรือ Edge Functions เท่านั้น
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false, // ฝั่ง Admin ไม่จำเป็นต้องจำ Session
    },
});