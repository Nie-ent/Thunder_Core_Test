import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ใช้ route นี้ชั่วคราวเพื่อ debug — ลบทิ้งหลัง fix เสร็จ
// เปิด: /api/seed-map/debug
export async function GET() {
    const tables = [
        "tenants", "users", "departments", "locations",
        "roles", "permissions", "memberships", "membership_roles",
        "role_permissions", "assets", "devices", "device_telemetry_latest",
        "work_orders", "work_order_tasks", "notification_inbox", "audit_events",
    ];

    const results: Record<string, { count: number | null; error: string | null; sample?: unknown }> = {};

    await Promise.all(
        tables.map(async (table) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const client = supabaseAdmin as any;
            const { data, error } = await client
                .from(table)
                .select("*", { count: "exact", head: false })
                .limit(1);

            results[table] = {
                count: data?.length ?? null,
                error: error ? `${error.code}: ${error.message}` : null,
                sample: data?.[0] ?? null,
            };
        })
    );


    // ตรวจสอบว่า client ใช้ key ประเภทไหน
    const { data: authCheck } = await supabaseAdmin.auth.getSession();

    return NextResponse.json({
        clientInfo: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20) + "...",
            session: authCheck?.session ? "has session" : "no session (expected for service role)",
        },
        tables: results,
    });
}