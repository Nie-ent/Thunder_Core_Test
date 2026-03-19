import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // สร้าง Response ตั้งต้นเพื่อเตรียมรับ Cookie ที่อัปเดตแล้ว
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );

                    supabaseResponse = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // สำคัญมาก! ต้องเรียก getUser() เพื่อให้ Supabase รีเฟรช Token (ถ้าจำเป็น)
    // อย่าใช้ getSession() ใน Middleware เพราะมันจะไม่อัปเดตความปลอดภัยล่าสุด
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // =========================================================
    // 🛡️ Route Protection Logic (ปรับแต่งได้ตามใจชอบ)
    // =========================================================

    // กรณีที่ 1: หน้าที่ต้อง Login ก่อนถึงจะเข้าได้ (Protected Routes)
    // สมมติว่าทุกหน้าที่ขึ้นต้นด้วย /dashboard หรือ /admin ต้องล็อกอิน
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

    if (isProtectedRoute && !user) {
        // ถ้ายังไม่ล็อกอิน ให้เด้งไปหน้า /login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // กรณีที่ 2: หน้า Login / Register 
    // ถ้า User ล็อกอินเข้ามาแล้ว ไม่ควรเห็นหน้านี้อีก ให้เด้งไป Dashboard เลย
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (isAuthRoute && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard'; // เด้งไปหน้าหลักของระบบ
        return NextResponse.redirect(url);
    }

    // ส่งคืน Response ที่มี Cookie อัปเดตล่าสุด
    return supabaseResponse;
}