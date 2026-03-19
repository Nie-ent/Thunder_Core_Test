import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// สังเกตว่าต้องเป็น async function เพราะ cookies() ใน Next.js 15+ เป็น Promise
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // โค้ดจะตกมาที่ catch ถ้าเราพยายาม set cookie ใน Server Component
                        // ซึ่งปกติ Next.js ไม่อนุญาต แต่ไม่ต้องกังวล เพราะเราจะมี Middleware คอยจัดการเรื่องนี้
                    }
                },
            },
        }
    );
}