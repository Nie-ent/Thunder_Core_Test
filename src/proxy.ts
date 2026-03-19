import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
    // โยนหน้าที่อัปเดต Session และเช็คสิทธิ์ไปให้ฟังก์ชันที่เราเขียนไว้
    return await updateSession(request);
}

// กำหนดว่าหน้าไหนบ้างที่ "ไม่ต้อง" ให้ Middleware ตัวนี้ทำงาน (เพื่อความเร็ว)
export const config = {
    matcher: [
        /*
         * Match ทุก paths ยกเว้น:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (ไฟล์ metadata)
         * - /images, /svg, /fonts (ไฟล์ asset ต่างๆ)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};