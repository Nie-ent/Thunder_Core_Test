import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const [
            { data: tenants, error: e1 },
            { data: users, error: e2 },
            { data: departments, error: e3 },
            { data: locations, error: e4 },
            { data: roles, error: e5 },
            { data: permissions, error: e6 },
            { data: memberships, error: e7 },
            { data: membershipRoles, error: e8 },
            { data: rolePermissions, error: e9 },
            { data: assets, error: e10 },
            { data: devices, error: e11 },
            { data: telemetry, error: e12 },
            { data: workOrders, error: e13 },
            { data: workOrderTasks, error: e14 },
            { data: notificationInbox, error: e15 },
            { data: auditEvents, error: e16 },
        ] = await Promise.all([
            supabaseAdmin
                .from("tenants")
                .select("id, tenant_code, name, tenant_type, status, subscription_plan, timezone, owner_user_id")
                .order("created_at"),

            supabaseAdmin
                .from("users")
                .select("id, global_user_code, email, first_name, last_name, display_name, status, is_email_verified, last_login_at")
                .order("created_at"),

            supabaseAdmin
                .from("departments")
                .select("id, tenant_id, parent_department_id, code, name, department_type, status, is_root, manager_id")
                .order("sort_order"),

            supabaseAdmin
                .from("locations")
                .select("id, tenant_id, parent_location_id, code, name, location_type, latitude, longitude, status")
                .order("created_at"),

            supabaseAdmin
                .from("roles")
                .select("id, tenant_id, code, name, role_type, role_scope, is_system, is_active")
                .order("created_at"),

            supabaseAdmin
                .from("permissions")
                .select("id, code, resource, action, group_name, description")
                .order("resource, action"),

            supabaseAdmin
                .from("memberships")
                .select("id, user_id, tenant_id, employee_code, job_title, user_type, default_department_id, default_location_id, status, joined_at")
                .order("created_at"),

            supabaseAdmin
                .from("membership_roles")
                .select("id, membership_id, role_id, assigned_at, expires_at"),

            supabaseAdmin
                .from("role_permissions")
                .select("id, role_id, permission_id, effect"),

            supabaseAdmin
                .from("assets")
                .select("id, tenant_id, location_id, owner_org_id, asset_category_id, name, serial_number, status, purchase_date, metadata")
                .order("created_at"),

            supabaseAdmin
                .from("devices")
                .select("id, tenant_id, asset_id, device_type_id, device_uid, is_online, last_heartbeat, firmware_version, config")
                .order("created_at"),

            supabaseAdmin
                .from("device_telemetry_latest")
                .select("device_id, payload, recorded_at"),

            supabaseAdmin
                .from("work_orders")
                .select("id, tenant_id, asset_id, reported_by, assigned_to, title, priority, status, due_date, resolved_at, created_at")
                .order("created_at"),

            supabaseAdmin
                .from("work_order_tasks")
                .select("id, work_order_id, task_name, is_completed, completed_at"),

            supabaseAdmin
                .from("notification_inbox")
                .select("id, tenant_id, user_id, category, severity, title, is_read, created_at")
                .order("created_at", { ascending: false })
                .limit(50),

            supabaseAdmin
                .from("audit_events")
                .select("id, tenant_id, actor_type, actor_name, event_category, event_action, event_result, severity, summary, event_time")
                .order("event_time", { ascending: false })
                .limit(20),
        ]);

        const errors = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16].filter(Boolean);
        if (errors.length > 0) {
            console.error("Supabase errors:", errors);
            return NextResponse.json({ error: errors[0]?.message }, { status: 500 });
        }

        return NextResponse.json({
            tenants: tenants ?? [],
            users: users ?? [],
            departments: departments ?? [],
            locations: locations ?? [],
            roles: roles ?? [],
            permissions: permissions ?? [],
            memberships: memberships ?? [],
            membershipRoles: membershipRoles ?? [],
            rolePermissions: rolePermissions ?? [],
            assets: assets ?? [],
            devices: devices ?? [],
            telemetry: telemetry ?? [],
            workOrders: workOrders ?? [],
            workOrderTasks: workOrderTasks ?? [],
            notificationInbox: notificationInbox ?? [],
            auditEvents: auditEvents ?? [],
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}