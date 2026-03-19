-- ==============================================================================
-- POC SEED DATA — Thunder Platform
-- สร้างข้อมูลตัวอย่างสำหรับทดสอบระบบ
-- ==============================================================================
-- หมายเหตุ: UUID คงที่เพื่อให้ FK references ถูกต้องและทำซ้ำได้
-- ใช้คำสั่ง: psql -d <your_db> -f seed_poc.sql
-- ==============================================================================
-- 0. CLEANUP (รันซ้ำได้อย่างปลอดภัย)
-- ==============================================================================
-- ปิด triggers ชั่วคราวเพื่อใส่ข้อมูล audit โดยตรง (optional)
-- SET session_replication_role = replica;
-- ==============================================================================
-- 1. TENANTS (3 องค์กรตัวอย่าง)
-- ==============================================================================
INSERT INTO public.tenants (
        id,
        tenant_code,
        name,
        legal_name,
        tenant_type,
        status,
        subscription_plan,
        timezone,
        locale,
        country_code,
        currency_code,
        onboarding_status,
        activated_at
    )
VALUES (
        'aaaaaaaa-0001-0001-0001-000000000001',
        'BKK-CITY',
        'กรุงเทพมหานคร',
        'กรุงเทพมหานคร (องค์กรปกครองส่วนท้องถิ่น)',
        'municipal',
        'active',
        'enterprise',
        'Asia/Bangkok',
        'th-TH',
        'TH',
        'THB',
        'completed',
        NOW() - INTERVAL '1 year'
    ),
    (
        'aaaaaaaa-0002-0002-0002-000000000002',
        'SCHOOL-01',
        'โรงเรียนสาธิตกรุงเทพ',
        'โรงเรียนสาธิตกรุงเทพ จำกัด',
        'school',
        'active',
        'standard',
        'Asia/Bangkok',
        'th-TH',
        'TH',
        'THB',
        'completed',
        NOW() - INTERVAL '6 months'
    ),
    (
        'aaaaaaaa-0003-0003-0003-000000000003',
        'CORP-ALPHA',
        'บริษัท อัลฟ่า เทคโนโลยี จำกัด',
        'บริษัท อัลฟ่า เทคโนโลยี จำกัด (มหาชน)',
        'enterprise',
        'active',
        'professional',
        'Asia/Bangkok',
        'th-TH',
        'TH',
        'THB',
        'completed',
        NOW() - INTERVAL '3 months'
    );
-- ==============================================================================
-- 2. USERS (ใส่ใน auth.users ก่อน จากนั้น trigger จะ sync ไป public.users)
--    สำหรับ POC: ใส่ตรง public.users แทน (bypass trigger)
-- ==============================================================================
INSERT INTO public.users (
        id,
        global_user_code,
        email,
        phone,
        first_name,
        last_name,
        display_name,
        preferred_language,
        timezone,
        status,
        is_email_verified,
        is_phone_verified,
        last_login_at
    )
VALUES -- Super Admin
    (
        'bbbbbbbb-0001-0001-0001-000000000001',
        'USR-0001',
        'admin@thunder.platform',
        '+66891234001',
        'สมชาย',
        'ใจดี',
        'Admin สมชาย',
        'th',
        'Asia/Bangkok',
        'active',
        true,
        true,
        NOW() - INTERVAL '1 hour'
    ),
    -- BKK Manager
    (
        'bbbbbbbb-0002-0002-0002-000000000002',
        'USR-0002',
        'manager.bkk@bkk.go.th',
        '+66891234002',
        'วิภา',
        'รักไทย',
        'ผู้จัดการ วิภา',
        'th',
        'Asia/Bangkok',
        'active',
        true,
        false,
        NOW() - INTERVAL '2 hours'
    ),
    -- BKK Staff
    (
        'bbbbbbbb-0003-0003-0003-000000000003',
        'USR-0003',
        'staff.bkk@bkk.go.th',
        '+66891234003',
        'ประเสริฐ',
        'ดีงาม',
        'พนักงาน ประเสริฐ',
        'th',
        'Asia/Bangkok',
        'active',
        true,
        false,
        NOW() - INTERVAL '1 day'
    ),
    -- School Teacher
    (
        'bbbbbbbb-0004-0004-0004-000000000004',
        'USR-0004',
        'teacher@school01.ac.th',
        '+66891234004',
        'นภัสสร',
        'ศรีสุวรรณ',
        'ครู นภัสสร',
        'th',
        'Asia/Bangkok',
        'active',
        true,
        true,
        NOW() - INTERVAL '3 hours'
    ),
    -- Corp Alpha Developer
    (
        'bbbbbbbb-0005-0005-0005-000000000005',
        'USR-0005',
        'dev@alpha-tech.co.th',
        '+66891234005',
        'ธีระ',
        'นวัตกรรม',
        'Dev ธีระ',
        'th',
        'Asia/Bangkok',
        'active',
        true,
        false,
        NOW() - INTERVAL '30 minutes'
    ),
    -- Invited (ยังไม่ active)
    (
        'bbbbbbbb-0006-0006-0006-000000000006',
        'USR-0006',
        'newuser@bkk.go.th',
        NULL,
        'สุดา',
        'มาใหม่',
        'สุดา มาใหม่',
        'th',
        'Asia/Bangkok',
        'invited',
        false,
        false,
        NULL
    );
-- Update owner_user_id ให้ tenant
UPDATE public.tenants
SET owner_user_id = 'bbbbbbbb-0002-0002-0002-000000000002'
WHERE id = 'aaaaaaaa-0001-0001-0001-000000000001';
UPDATE public.tenants
SET owner_user_id = 'bbbbbbbb-0004-0004-0004-000000000004'
WHERE id = 'aaaaaaaa-0002-0002-0002-000000000002';
UPDATE public.tenants
SET owner_user_id = 'bbbbbbbb-0005-0005-0005-000000000005'
WHERE id = 'aaaaaaaa-0003-0003-0003-000000000003';
-- ==============================================================================
-- 3. AUTH IDENTITIES
-- ==============================================================================
INSERT INTO public.auth_identities (
        id,
        user_id,
        identity_type,
        identity_value,
        is_verified,
        is_primary,
        verified_at
    )
VALUES (
        'cccccccc-0001-0001-0001-000000000001',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'email',
        'admin@thunder.platform',
        true,
        true,
        NOW() - INTERVAL '1 year'
    ),
    (
        'cccccccc-0002-0002-0002-000000000002',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'email',
        'manager.bkk@bkk.go.th',
        true,
        true,
        NOW() - INTERVAL '6 months'
    ),
    (
        'cccccccc-0003-0003-0003-000000000003',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'phone',
        '+66891234002',
        false,
        false,
        NULL
    ),
    (
        'cccccccc-0004-0004-0004-000000000004',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'email',
        'staff.bkk@bkk.go.th',
        true,
        true,
        NOW() - INTERVAL '5 months'
    ),
    (
        'cccccccc-0005-0005-0005-000000000005',
        'bbbbbbbb-0004-0004-0004-000000000004',
        'email',
        'teacher@school01.ac.th',
        true,
        true,
        NOW() - INTERVAL '4 months'
    ),
    (
        'cccccccc-0006-0006-0006-000000000006',
        'bbbbbbbb-0005-0005-0005-000000000005',
        'email',
        'dev@alpha-tech.co.th',
        true,
        true,
        NOW() - INTERVAL '2 months'
    ),
    (
        'cccccccc-0007-0007-0007-000000000007',
        'bbbbbbbb-0005-0005-0005-000000000005',
        'google',
        'google-oauth2|dev.thirawut@gmail.com',
        true,
        false,
        NOW() - INTERVAL '2 months'
    );
-- ==============================================================================
-- 4. DEPARTMENTS (สำหรับ BKK Tenant)
-- ==============================================================================
INSERT INTO public.departments (
        id,
        tenant_id,
        parent_department_id,
        code,
        name,
        name_en,
        department_type,
        status,
        is_root,
        manager_id,
        sort_order
    )
VALUES -- Root
    (
        'dddddddd-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        NULL,
        'BKK-ROOT',
        'กรุงเทพมหานคร',
        'Bangkok Metropolitan Administration',
        'root',
        'active',
        true,
        'bbbbbbbb-0002-0002-0002-000000000002',
        0
    ),
    -- สำนัก
    (
        'dddddddd-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'dddddddd-0001-0001-0001-000000000001',
        'BKK-IT',
        'สำนักยุทธศาสตร์และประเมินผล',
        'Strategy and Evaluation Office',
        'division',
        'active',
        false,
        'bbbbbbbb-0002-0002-0002-000000000002',
        1
    ),
    (
        'dddddddd-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'dddddddd-0001-0001-0001-000000000001',
        'BKK-WORKS',
        'สำนักการโยธา',
        'Public Works Department',
        'division',
        'active',
        false,
        NULL,
        2
    ),
    (
        'dddddddd-0004-0004-0004-000000000004',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'dddddddd-0001-0001-0001-000000000001',
        'BKK-ENV',
        'สำนักสิ่งแวดล้อม',
        'Environment Department',
        'division',
        'active',
        false,
        NULL,
        3
    ),
    -- แผนกย่อย
    (
        'dddddddd-0005-0005-0005-000000000005',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'dddddddd-0002-0002-0002-000000000002',
        'BKK-IT-DEV',
        'ฝ่ายพัฒนาระบบ',
        'IT Development Section',
        'section',
        'active',
        false,
        'bbbbbbbb-0003-0003-0003-000000000003',
        1
    );
-- ==============================================================================
-- 5. LOCATIONS
-- ==============================================================================
INSERT INTO public.locations (
        id,
        tenant_id,
        parent_location_id,
        code,
        name,
        location_type,
        latitude,
        longitude,
        address,
        status
    )
VALUES (
        'eeeeeeee-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        NULL,
        'BKK-HQ',
        'ศาลาว่าการกรุงเทพมหานคร',
        'headquarters',
        13.7525,
        100.4942,
        '173 ถนนดินสอ แขวงเสาชิงช้า เขตพระนคร กรุงเทพฯ 10200',
        'active'
    ),
    (
        'eeeeeeee-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0001-0001-0001-000000000001',
        'BKK-ZONE-N',
        'ศูนย์บริการเขตพื้นที่ฝั่งเหนือ',
        'zone_office',
        13.8500,
        100.5500,
        'กรุงเทพฯ ฝั่งเหนือ',
        'active'
    ),
    (
        'eeeeeeee-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0001-0001-0001-000000000001',
        'BKK-ZONE-S',
        'ศูนย์บริการเขตพื้นที่ฝั่งใต้',
        'zone_office',
        13.6800,
        100.5200,
        'กรุงเทพฯ ฝั่งใต้',
        'active'
    ),
    -- School location
    (
        'eeeeeeee-0004-0004-0004-000000000004',
        'aaaaaaaa-0002-0002-0002-000000000002',
        NULL,
        'SCH-MAIN',
        'อาคารเรียนหลัก',
        'building',
        13.7400,
        100.5100,
        '99 ถนนพหลโยธิน กรุงเทพฯ',
        'active'
    );
-- ==============================================================================
-- 6. TENANT SETTINGS & BRANDING
-- ==============================================================================
INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value_json)
VALUES (
        'aaaaaaaa-0001-0001-0001-000000000001',
        'auth.mfa_required',
        'true'
    ),
    (
        'aaaaaaaa-0001-0001-0001-000000000001',
        'auth.session_timeout_minutes',
        '480'
    ),
    (
        'aaaaaaaa-0001-0001-0001-000000000001',
        'notifications.email_enabled',
        'true'
    ),
    (
        'aaaaaaaa-0001-0001-0001-000000000001',
        'notifications.line_enabled',
        'true'
    ),
    (
        'aaaaaaaa-0002-0002-0002-000000000002',
        'auth.mfa_required',
        'false'
    ),
    (
        'aaaaaaaa-0002-0002-0002-000000000002',
        'auth.session_timeout_minutes',
        '240'
    ),
    (
        'aaaaaaaa-0003-0003-0003-000000000003',
        'auth.mfa_required',
        'true'
    ),
    (
        'aaaaaaaa-0003-0003-0003-000000000003',
        'api.rate_limit_override',
        '5000'
    );
INSERT INTO public.branding_profiles (
        id,
        tenant_id,
        logo_url,
        primary_color,
        secondary_color,
        theme_mode
    )
VALUES (
        'ffffffff-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'https://cdn.bkk.go.th/logo.png',
        '#003087',
        '#FFD700',
        'light'
    ),
    (
        'ffffffff-0002-0002-0002-000000000002',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'https://cdn.school01.ac.th/logo.png',
        '#1E5C3A',
        '#FFFFFF',
        'light'
    ),
    (
        'ffffffff-0003-0003-0003-000000000003',
        'aaaaaaaa-0003-0003-0003-000000000003',
        'https://cdn.alpha-tech.co.th/logo.png',
        '#6B21A8',
        '#EC4899',
        'dark'
    );
-- ==============================================================================
-- 7. APP MODULES
-- ==============================================================================
INSERT INTO public.app_modules (id, code, name, category, status)
VALUES (
        'a0000001-0000-0000-0000-000000000001',
        'IAM',
        'Identity & Access Management',
        'core',
        'active'
    ),
    (
        'a0000002-0000-0000-0000-000000000002',
        'ASSET',
        'Asset Management',
        'business',
        'active'
    ),
    (
        'a0000003-0000-0000-0000-000000000003',
        'WORK_ORDER',
        'Work Order Management',
        'business',
        'active'
    ),
    (
        'a0000004-0000-0000-0000-000000000004',
        'NOTIFY',
        'Notification Engine',
        'platform',
        'active'
    ),
    (
        'a0000005-0000-0000-0000-000000000005',
        'IOT',
        'IoT & Device Management',
        'business',
        'active'
    ),
    (
        'a0000006-0000-0000-0000-000000000006',
        'REPORT',
        'Analytics & Reports',
        'platform',
        'active'
    ),
    (
        'a0000007-0000-0000-0000-000000000007',
        'FILE_MGR',
        'File Management',
        'platform',
        'active'
    ),
    (
        'a0000008-0000-0000-0000-000000000008',
        'AUDIT',
        'Audit & Compliance',
        'platform',
        'active'
    );
-- ==============================================================================
-- 8. ROLES (System roles + Tenant-specific)
-- ==============================================================================
INSERT INTO public.roles (
        id,
        tenant_id,
        code,
        name,
        role_type,
        role_scope,
        is_system,
        is_active
    )
VALUES -- System Roles (tenant_id = NULL)
    (
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'SUPER_ADMIN',
        'Super Administrator',
        'system',
        'platform',
        true,
        true
    ),
    (
        'b0000002-0000-0000-0000-000000000002',
        NULL,
        'TENANT_OWNER',
        'Tenant Owner',
        'system',
        'tenant',
        true,
        true
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        NULL,
        'TENANT_ADMIN',
        'Tenant Administrator',
        'system',
        'tenant',
        true,
        true
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        NULL,
        'MEMBER',
        'General Member',
        'system',
        'tenant',
        true,
        true
    ),
    (
        'b0000005-0000-0000-0000-000000000005',
        NULL,
        'VIEWER',
        'Read-only Viewer',
        'system',
        'tenant',
        true,
        true
    ),
    -- BKK Custom Roles
    (
        'b0000010-0000-0000-0000-000000000010',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'BKK_MANAGER',
        'ผู้จัดการสำนัก',
        'custom',
        'department',
        false,
        true
    ),
    (
        'b0000011-0000-0000-0000-000000000011',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'BKK_TECHNICIAN',
        'ช่างเทคนิค',
        'custom',
        'tenant',
        false,
        true
    ),
    -- School Custom Roles
    (
        'b0000020-0000-0000-0000-000000000020',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'TEACHER',
        'ครูผู้สอน',
        'custom',
        'tenant',
        false,
        true
    ),
    -- Corp Alpha Custom Roles
    (
        'b0000030-0000-0000-0000-000000000030',
        'aaaaaaaa-0003-0003-0003-000000000003',
        'DEVELOPER',
        'นักพัฒนาระบบ',
        'custom',
        'app',
        false,
        true
    );
-- ==============================================================================
-- 9. PERMISSIONS
-- ==============================================================================
INSERT INTO public.permissions (
        id,
        code,
        resource,
        action,
        group_name,
        description
    )
VALUES -- Users
    (
        'c0000001-0000-0000-0000-000000000001',
        'users:read',
        'users',
        'read',
        'User Management',
        'ดูข้อมูลผู้ใช้'
    ),
    (
        'c0000002-0000-0000-0000-000000000002',
        'users:create',
        'users',
        'create',
        'User Management',
        'สร้างผู้ใช้ใหม่'
    ),
    (
        'c0000003-0000-0000-0000-000000000003',
        'users:update',
        'users',
        'update',
        'User Management',
        'แก้ไขข้อมูลผู้ใช้'
    ),
    (
        'c0000004-0000-0000-0000-000000000004',
        'users:delete',
        'users',
        'delete',
        'User Management',
        'ลบผู้ใช้'
    ),
    -- Assets
    (
        'c0000010-0000-0000-0000-000000000010',
        'assets:read',
        'assets',
        'read',
        'Asset Management',
        'ดูข้อมูลทรัพย์สิน'
    ),
    (
        'c0000011-0000-0000-0000-000000000011',
        'assets:create',
        'assets',
        'create',
        'Asset Management',
        'เพิ่มทรัพย์สิน'
    ),
    (
        'c0000012-0000-0000-0000-000000000012',
        'assets:update',
        'assets',
        'update',
        'Asset Management',
        'แก้ไขทรัพย์สิน'
    ),
    (
        'c0000013-0000-0000-0000-000000000013',
        'assets:delete',
        'assets',
        'delete',
        'Asset Management',
        'ลบทรัพย์สิน'
    ),
    -- Work Orders
    (
        'c0000020-0000-0000-0000-000000000020',
        'work_orders:read',
        'work_orders',
        'read',
        'Work Orders',
        'ดู Work Order'
    ),
    (
        'c0000021-0000-0000-0000-000000000021',
        'work_orders:create',
        'work_orders',
        'create',
        'Work Orders',
        'สร้าง Work Order'
    ),
    (
        'c0000022-0000-0000-0000-000000000022',
        'work_orders:assign',
        'work_orders',
        'assign',
        'Work Orders',
        'มอบหมายงาน'
    ),
    (
        'c0000023-0000-0000-0000-000000000023',
        'work_orders:close',
        'work_orders',
        'close',
        'Work Orders',
        'ปิด Work Order'
    ),
    -- Reports
    (
        'c0000030-0000-0000-0000-000000000030',
        'reports:read',
        'reports',
        'read',
        'Reports',
        'ดูรายงาน'
    ),
    (
        'c0000031-0000-0000-0000-000000000031',
        'reports:export',
        'reports',
        'export',
        'Reports',
        'ส่งออกรายงาน'
    ),
    -- Audit
    (
        'c0000040-0000-0000-0000-000000000040',
        'audit:read',
        'audit',
        'read',
        'Audit',
        'ดู Audit Log'
    ),
    -- Notifications
    (
        'c0000050-0000-0000-0000-000000000050',
        'notifications:read',
        'notifications',
        'read',
        'Notifications',
        'รับการแจ้งเตือน'
    ),
    (
        'c0000051-0000-0000-0000-000000000051',
        'notifications:manage',
        'notifications',
        'manage',
        'Notifications',
        'จัดการการแจ้งเตือน'
    );
-- ==============================================================================
-- 10. ROLE PERMISSIONS (กำหนดสิทธิ์ให้แต่ละ Role)
-- ==============================================================================
INSERT INTO public.role_permissions (role_id, permission_id, effect)
VALUES -- SUPER_ADMIN: ทุกสิทธิ์
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000002-0000-0000-0000-000000000002',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000003-0000-0000-0000-000000000003',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000004-0000-0000-0000-000000000004',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000011-0000-0000-0000-000000000011',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000012-0000-0000-0000-000000000012',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000013-0000-0000-0000-000000000013',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000021-0000-0000-0000-000000000021',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000022-0000-0000-0000-000000000022',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000023-0000-0000-0000-000000000023',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000030-0000-0000-0000-000000000030',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000031-0000-0000-0000-000000000031',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000040-0000-0000-0000-000000000040',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000050-0000-0000-0000-000000000050',
        'allow'
    ),
    (
        'b0000001-0000-0000-0000-000000000001',
        'c0000051-0000-0000-0000-000000000051',
        'allow'
    ),
    -- TENANT_ADMIN: ส่วนใหญ่ ยกเว้น delete users
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000001',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000002-0000-0000-0000-000000000002',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000003-0000-0000-0000-000000000003',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000011-0000-0000-0000-000000000011',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000012-0000-0000-0000-000000000012',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000021-0000-0000-0000-000000000021',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000022-0000-0000-0000-000000000022',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000030-0000-0000-0000-000000000030',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000031-0000-0000-0000-000000000031',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000040-0000-0000-0000-000000000040',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000050-0000-0000-0000-000000000050',
        'allow'
    ),
    (
        'b0000003-0000-0000-0000-000000000003',
        'c0000051-0000-0000-0000-000000000051',
        'allow'
    ),
    -- MEMBER: ดู + สร้าง work order + รับ notification
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000001-0000-0000-0000-000000000001',
        'allow'
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000021-0000-0000-0000-000000000021',
        'allow'
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000030-0000-0000-0000-000000000030',
        'allow'
    ),
    (
        'b0000004-0000-0000-0000-000000000004',
        'c0000050-0000-0000-0000-000000000050',
        'allow'
    ),
    -- VIEWER: ดูอย่างเดียว
    (
        'b0000005-0000-0000-0000-000000000005',
        'c0000001-0000-0000-0000-000000000001',
        'allow'
    ),
    (
        'b0000005-0000-0000-0000-000000000005',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000005-0000-0000-0000-000000000005',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000005-0000-0000-0000-000000000005',
        'c0000030-0000-0000-0000-000000000030',
        'allow'
    ),
    (
        'b0000005-0000-0000-0000-000000000005',
        'c0000050-0000-0000-0000-000000000050',
        'allow'
    ),
    -- BKK_MANAGER: + assign work orders
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000011-0000-0000-0000-000000000011',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000012-0000-0000-0000-000000000012',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000021-0000-0000-0000-000000000021',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000022-0000-0000-0000-000000000022',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000023-0000-0000-0000-000000000023',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000030-0000-0000-0000-000000000030',
        'allow'
    ),
    (
        'b0000010-0000-0000-0000-000000000010',
        'c0000031-0000-0000-0000-000000000031',
        'allow'
    ),
    -- BKK_TECHNICIAN: เฉพาะงานที่ตัวเองรับผิดชอบ
    (
        'b0000011-0000-0000-0000-000000000011',
        'c0000010-0000-0000-0000-000000000010',
        'allow'
    ),
    (
        'b0000011-0000-0000-0000-000000000011',
        'c0000020-0000-0000-0000-000000000020',
        'allow'
    ),
    (
        'b0000011-0000-0000-0000-000000000011',
        'c0000021-0000-0000-0000-000000000021',
        'allow'
    );
-- ==============================================================================
-- 11. MEMBERSHIPS
-- ==============================================================================
INSERT INTO public.memberships (
        id,
        user_id,
        tenant_id,
        employee_code,
        job_title,
        user_type,
        default_department_id,
        default_location_id,
        is_primary,
        status,
        joined_at,
        start_date
    )
VALUES -- Admin @ BKK
    (
        'ee020001-0001-0001-0001-000000000001',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'EMP-0001',
        'System Administrator',
        'internal',
        'dddddddd-0002-0002-0002-000000000002',
        'eeeeeeee-0001-0001-0001-000000000001',
        true,
        'active',
        NOW() - INTERVAL '1 year',
        CURRENT_DATE - INTERVAL '1 year'
    ),
    -- Manager @ BKK
    (
        'ee020002-0002-0002-0002-000000000002',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'EMP-0002',
        'ผู้อำนวยการสำนักยุทธศาสตร์',
        'internal',
        'dddddddd-0002-0002-0002-000000000002',
        'eeeeeeee-0001-0001-0001-000000000001',
        true,
        'active',
        NOW() - INTERVAL '6 months',
        CURRENT_DATE - INTERVAL '6 months'
    ),
    -- Staff @ BKK
    (
        'ee020003-0003-0003-0003-000000000003',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'EMP-0003',
        'นักวิชาการคอมพิวเตอร์',
        'internal',
        'dddddddd-0005-0005-0005-000000000005',
        'eeeeeeee-0001-0001-0001-000000000001',
        true,
        'active',
        NOW() - INTERVAL '5 months',
        CURRENT_DATE - INTERVAL '5 months'
    ),
    -- Teacher @ School
    (
        'ee020004-0004-0004-0004-000000000004',
        'bbbbbbbb-0004-0004-0004-000000000004',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'TCH-0001',
        'ครูวิชาวิทยาศาสตร์',
        'internal',
        NULL,
        'eeeeeeee-0004-0004-0004-000000000004',
        true,
        'active',
        NOW() - INTERVAL '4 months',
        CURRENT_DATE - INTERVAL '4 months'
    ),
    -- Developer @ Corp Alpha
    (
        'ee020005-0005-0005-0005-000000000005',
        'bbbbbbbb-0005-0005-0005-000000000005',
        'aaaaaaaa-0003-0003-0003-000000000003',
        'DEV-0001',
        'Senior Software Engineer',
        'internal',
        NULL,
        NULL,
        true,
        'active',
        NOW() - INTERVAL '2 months',
        CURRENT_DATE - INTERVAL '2 months'
    ),
    -- Invited user @ BKK (ยังไม่ join)
    (
        'ee020006-0006-0006-0006-000000000006',
        'bbbbbbbb-0006-0006-0006-000000000006',
        'aaaaaaaa-0001-0001-0001-000000000001',
        NULL,
        'เจ้าหน้าที่',
        'internal',
        NULL,
        NULL,
        true,
        'invited',
        NULL,
        NULL
    );
-- ==============================================================================
-- 12. MEMBERSHIP ROLES (มอบหมาย role ให้สมาชิก)
-- ==============================================================================
INSERT INTO public.membership_roles (
        id,
        membership_id,
        role_id,
        assigned_by,
        assigned_at
    )
VALUES -- Admin → SUPER_ADMIN
    (
        'ee030001-0001-0001-0001-000000000001',
        'ee020001-0001-0001-0001-000000000001',
        'b0000001-0000-0000-0000-000000000001',
        'bbbbbbbb-0001-0001-0001-000000000001',
        NOW() - INTERVAL '1 year'
    ),
    -- Manager → TENANT_ADMIN + BKK_MANAGER
    (
        'ee030002-0002-0002-0002-000000000002',
        'ee020002-0002-0002-0002-000000000002',
        'b0000003-0000-0000-0000-000000000003',
        'bbbbbbbb-0001-0001-0001-000000000001',
        NOW() - INTERVAL '6 months'
    ),
    (
        'ee030003-0003-0003-0003-000000000003',
        'ee020002-0002-0002-0002-000000000002',
        'b0000010-0000-0000-0000-000000000010',
        'bbbbbbbb-0001-0001-0001-000000000001',
        NOW() - INTERVAL '6 months'
    ),
    -- Staff → MEMBER + BKK_TECHNICIAN
    (
        'ee030004-0004-0004-0004-000000000004',
        'ee020003-0003-0003-0003-000000000003',
        'b0000004-0000-0000-0000-000000000004',
        'bbbbbbbb-0002-0002-0002-000000000002',
        NOW() - INTERVAL '5 months'
    ),
    (
        'ee030005-0005-0005-0005-000000000005',
        'ee020003-0003-0003-0003-000000000003',
        'b0000011-0000-0000-0000-000000000011',
        'bbbbbbbb-0002-0002-0002-000000000002',
        NOW() - INTERVAL '5 months'
    ),
    -- Teacher → MEMBER + TEACHER
    (
        'ee030006-0006-0006-0006-000000000006',
        'ee020004-0004-0004-0004-000000000004',
        'b0000004-0000-0000-0000-000000000004',
        'bbbbbbbb-0004-0004-0004-000000000004',
        NOW() - INTERVAL '4 months'
    ),
    (
        'ee030007-0007-0007-0007-000000000007',
        'ee020004-0004-0004-0004-000000000004',
        'b0000020-0000-0000-0000-000000000020',
        'bbbbbbbb-0004-0004-0004-000000000004',
        NOW() - INTERVAL '4 months'
    ),
    -- Developer → MEMBER + DEVELOPER
    (
        'ee030008-0008-0008-0008-000000000008',
        'ee020005-0005-0005-0005-000000000005',
        'b0000004-0000-0000-0000-000000000004',
        'bbbbbbbb-0005-0005-0005-000000000005',
        NOW() - INTERVAL '2 months'
    ),
    (
        'ee030009-0009-0009-0009-000000000009',
        'ee020005-0005-0005-0005-000000000005',
        'b0000030-0000-0000-0000-000000000030',
        'bbbbbbbb-0005-0005-0005-000000000005',
        NOW() - INTERVAL '2 months'
    );
-- ==============================================================================
-- 13. ASSET CATEGORIES (หมวดหมู่ทรัพย์สิน)
-- ==============================================================================
INSERT INTO public.asset_categories (
        id,
        tenant_id,
        parent_id,
        code,
        name_th,
        name_en,
        depreciation_class,
        default_uom,
        status,
        is_system_seed
    )
VALUES -- Global categories (tenant_id NULL)
    (
        'accccccc-0001-0001-0001-000000000001',
        NULL,
        NULL,
        'IT_EQUIP',
        'อุปกรณ์ไอที',
        'IT Equipment',
        'class-5yr',
        'unit',
        'active',
        true
    ),
    (
        'accccccc-0002-0002-0002-000000000002',
        NULL,
        NULL,
        'VEHICLE',
        'ยานพาหนะ',
        'Vehicle',
        'class-10yr',
        'unit',
        'active',
        true
    ),
    (
        'accccccc-0003-0003-0003-000000000003',
        NULL,
        NULL,
        'BUILDING',
        'อาคารและสิ่งปลูกสร้าง',
        'Building & Structure',
        'class-20yr',
        'sqm',
        'active',
        true
    ),
    (
        'accccccc-0004-0004-0004-000000000004',
        NULL,
        NULL,
        'FURNITURE',
        'เฟอร์นิเจอร์และครุภัณฑ์',
        'Furniture & Equipment',
        'class-5yr',
        'unit',
        'active',
        true
    ),
    -- Sub-category: Server (ลูกของ IT)
    (
        'accccccc-0005-0005-0005-000000000005',
        NULL,
        'accccccc-0001-0001-0001-000000000001',
        'SERVER',
        'เซิร์ฟเวอร์',
        'Server',
        'class-5yr',
        'unit',
        'active',
        true
    ),
    -- BKK-specific
    (
        'accccccc-0006-0006-0006-000000000006',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'accccccc-0002-0002-0002-000000000002',
        'BKK_TRUCK',
        'รถบรรทุกขยะ',
        'Garbage Truck',
        'class-10yr',
        'unit',
        'active',
        false
    );
-- ==============================================================================
-- 14. ASSETS (ทรัพย์สิน)
-- ==============================================================================
INSERT INTO public.assets (
        id,
        tenant_id,
        location_id,
        owner_org_id,
        asset_category_id,
        name,
        serial_number,
        status,
        purchase_date,
        metadata
    )
VALUES (
        'a55e0001-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0001-0001-0001-000000000001',
        'dddddddd-0002-0002-0002-000000000002',
        'accccccc-0005-0005-0005-000000000005',
        'Dell PowerEdge R750 (ตู้หลัก)',
        'DLSR750-2024-001',
        'active',
        '2024-01-15',
        '{"cpu": "Intel Xeon Gold 6330", "ram_gb": 256, "storage_tb": 20, "warranty_until": "2027-01-15"}'
    ),
    (
        'a55e0002-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0001-0001-0001-000000000001',
        'dddddddd-0002-0002-0002-000000000002',
        'accccccc-0001-0001-0001-000000000001',
        'HP EliteBook 840 G10 (สมชาย)',
        'HPEB840-2024-001',
        'active',
        '2024-03-01',
        '{"os": "Windows 11 Pro", "assigned_to": "bbbbbbbb-0001-0001-0001-000000000001"}'
    ),
    (
        'a55e0003-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0002-0002-0002-000000000002',
        'dddddddd-0003-0003-0003-000000000003',
        'accccccc-0006-0006-0006-000000000006',
        'รถบรรทุกขยะ หมายเลข บษ-1234',
        'TRUCK-BKK-001',
        'active',
        '2022-06-01',
        '{"plate_number": "บษ-1234", "fuel_type": "diesel", "capacity_tons": 10}'
    ),
    (
        'a55e0004-0004-0004-0004-000000000004',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'eeeeeeee-0001-0001-0001-000000000001',
        'dddddddd-0004-0004-0004-000000000004',
        'accccccc-0001-0001-0001-000000000001',
        'กล้อง CCTV อาคาร A ชั้น 1',
        'CCTV-BKK-A-001',
        'maintenance',
        '2021-11-01',
        '{"resolution": "4K", "night_vision": true, "ip_address": "192.168.10.101"}'
    ),
    -- School asset
    (
        'a55e0005-0005-0005-0005-000000000005',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'eeeeeeee-0004-0004-0004-000000000004',
        NULL,
        'accccccc-0001-0001-0001-000000000001',
        'Projector Epson EB-2250U (ห้อง 301)',
        'EPSON-EB2250-001',
        'active',
        '2023-05-01',
        '{"lumens": 5000, "resolution": "WUXGA", "room": "301"}'
    );
-- ==============================================================================
-- 15. DEVICE TYPES
-- ==============================================================================
INSERT INTO public.device_types (
        id,
        tenant_id,
        code,
        name,
        manufacturer,
        connectivity_type,
        status,
        is_system_seed
    )
VALUES (
        'd1e0e001-0001-0001-0001-000000000001',
        NULL,
        'SMART_METER',
        'มิเตอร์อัจฉริยะ',
        'Landis+Gyr',
        'NB-IoT',
        'active',
        true
    ),
    (
        'd1e0e002-0002-0002-0002-000000000002',
        NULL,
        'CCTV_IP',
        'กล้อง IP Camera',
        'Hikvision',
        'Ethernet',
        'active',
        true
    ),
    (
        'd1e0e003-0003-0003-0003-000000000003',
        NULL,
        'AIR_QUALITY',
        'เซนเซอร์คุณภาพอากาศ',
        'Sensirion',
        'LoRaWAN',
        'active',
        true
    ),
    (
        'd1e0e004-0004-0004-0004-000000000004',
        NULL,
        'GPS_TRACKER',
        'GPS Tracker',
        'Teltonika',
        '4G LTE',
        'active',
        true
    );
-- ==============================================================================
-- 16. DEVICES & TELEMETRY
-- ==============================================================================
INSERT INTO public.devices (
        id,
        tenant_id,
        asset_id,
        device_type_id,
        device_uid,
        is_online,
        last_heartbeat,
        firmware_version
    )
VALUES (
        'de000001-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'a55e0004-0004-0004-0004-000000000004',
        'd1e0e002-0002-0002-0002-000000000002',
        'CCTV-DEV-BKK-A-001',
        false,
        NOW() - INTERVAL '2 hours',
        'v3.2.1'
    ),
    (
        'de000002-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'a55e0003-0003-0003-0003-000000000003',
        'd1e0e004-0004-0004-0004-000000000004',
        'GPS-TRUCK-BKK-001',
        true,
        NOW() - INTERVAL '5 minutes',
        'v2.0.4'
    ),
    (
        'de000003-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        NULL,
        'd1e0e003-0003-0003-0003-000000000003',
        'AQS-BKK-HQ-001',
        true,
        NOW() - INTERVAL '1 minute',
        'v1.5.0'
    );
INSERT INTO public.device_telemetry_latest (device_id, payload, recorded_at)
VALUES (
        'de000002-0002-0002-0002-000000000002',
        '{"lat": 13.7805, "lng": 100.5012, "speed_kmh": 45, "engine_status": "on", "fuel_level_pct": 72}',
        NOW() - INTERVAL '5 minutes'
    ),
    (
        'de000003-0003-0003-0003-000000000003',
        '{"pm25": 38.2, "pm10": 55.1, "co2_ppm": 412, "temp_celsius": 31.5, "humidity_pct": 68, "aqi": 87}',
        NOW() - INTERVAL '1 minute'
    );
-- ==============================================================================
-- 17. WORK ORDERS
-- ==============================================================================
INSERT INTO public.work_orders (
        id,
        tenant_id,
        asset_id,
        reported_by,
        assigned_to,
        title,
        description,
        priority,
        status,
        due_date,
        resolved_at
    )
VALUES (
        'c0000001-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'a55e0004-0004-0004-0004-000000000004',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'กล้อง CCTV อาคาร A ขัดข้อง - ภาพไม่ชัด',
        'กล้อง CCTV ชั้น 1 อาคาร A แสดงภาพขาดหายเป็นระยะ ตรวจสอบพบว่าสายสัญญาณมีปัญหา',
        'high',
        'in_progress',
        NOW() + INTERVAL '2 days',
        NULL
    ),
    (
        'c0000002-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'a55e0003-0003-0003-0003-000000000003',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'รถบรรทุกขยะ บษ-1234 ซ่อมบำรุงประจำปี',
        'ถึงรอบซ่อมบำรุงประจำปี เปลี่ยนน้ำมันเครื่อง กรองอากาศ และตรวจสอบระบบไฮดรอลิก',
        'medium',
        'open',
        NOW() + INTERVAL '7 days',
        NULL
    ),
    (
        'c0000003-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'a55e0001-0001-0001-0001-000000000001',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'อัปเกรด RAM Server หลัก',
        'เพิ่ม RAM จาก 256GB เป็น 512GB เพื่อรองรับโหลดที่เพิ่มขึ้น',
        'low',
        'resolved',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '1 day'
    ),
    -- School work order
    (
        'c0000004-0004-0004-0004-000000000004',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'a55e0005-0005-0005-0005-000000000005',
        'bbbbbbbb-0004-0004-0004-000000000004',
        NULL,
        'โปรเจคเตอร์ห้อง 301 ไม่ติด',
        'โปรเจคเตอร์ในห้อง 301 เปิดไม่ติดตั้งแต่เช้า ต้องใช้งานในวันพรุ่งนี้',
        'high',
        'open',
        NOW() + INTERVAL '1 day',
        NULL
    );
INSERT INTO public.work_order_tasks (
        work_order_id,
        task_name,
        is_completed,
        completed_at,
        completed_by
    )
VALUES -- WO-001 tasks
    (
        'c0000001-0001-0001-0001-000000000001',
        'ตรวจสอบสายสัญญาณ BNC',
        true,
        NOW() - INTERVAL '3 hours',
        'bbbbbbbb-0003-0003-0003-000000000003'
    ),
    (
        'c0000001-0001-0001-0001-000000000001',
        'เปลี่ยนสาย RG6 ช่วง A1-A3',
        false,
        NULL,
        NULL
    ),
    (
        'c0000001-0001-0001-0001-000000000001',
        'ทดสอบภาพหลังซ่อม',
        false,
        NULL,
        NULL
    ),
    -- WO-003 tasks (resolved)
    (
        'c0000003-0003-0003-0003-000000000003',
        'Shutdown server และสำรองข้อมูล',
        true,
        NOW() - INTERVAL '2 days',
        'bbbbbbbb-0003-0003-0003-000000000003'
    ),
    (
        'c0000003-0003-0003-0003-000000000003',
        'ติดตั้ง RAM 256GB เพิ่มเติม',
        true,
        NOW() - INTERVAL '1 day',
        'bbbbbbbb-0003-0003-0003-000000000003'
    ),
    (
        'c0000003-0003-0003-0003-000000000003',
        'ทดสอบ POST และ benchmark',
        true,
        NOW() - INTERVAL '1 day',
        'bbbbbbbb-0003-0003-0003-000000000003'
    );
-- ==============================================================================
-- 18. NOTIFICATION CHANNELS & EVENT TYPES
-- ==============================================================================
INSERT INTO public.notification_channels (code, name, is_active)
VALUES ('email', 'อีเมล', true),
    ('sms', 'SMS', true),
    ('line', 'LINE Notify', true),
    ('in_app', 'In-App', true),
    ('push', 'Push Notification', true),
    ('webhook', 'Webhook', true);
INSERT INTO public.notification_event_types (
        id,
        code,
        name,
        category,
        severity_default,
        entity_type,
        description
    )
VALUES (
        'ee040001-0001-0001-0001-000000000001',
        'WORK_ORDER_CREATED',
        'Work Order สร้างใหม่',
        'work_order',
        'info',
        'work_orders',
        'เมื่อมีการสร้าง Work Order ใหม่'
    ),
    (
        'ee040002-0002-0002-0002-000000000002',
        'WORK_ORDER_ASSIGNED',
        'Work Order ถูกมอบหมาย',
        'work_order',
        'info',
        'work_orders',
        'เมื่อมีการมอบหมายงาน'
    ),
    (
        'ee040003-0003-0003-0003-000000000003',
        'WORK_ORDER_OVERDUE',
        'Work Order เกินกำหนด',
        'work_order',
        'warning',
        'work_orders',
        'เมื่องานเกินกำหนดเวลา'
    ),
    (
        'ee040004-0004-0004-0004-000000000004',
        'DEVICE_OFFLINE',
        'อุปกรณ์ออฟไลน์',
        'iot',
        'warning',
        'devices',
        'เมื่ออุปกรณ์ไม่ส่งสัญญาณ'
    ),
    (
        'ee040005-0005-0005-0005-000000000005',
        'DEVICE_ALERT',
        'อุปกรณ์แจ้งเตือน',
        'iot',
        'critical',
        'devices',
        'เมื่ออุปกรณ์ส่งสัญญาณอันตราย'
    ),
    (
        'ee040006-0006-0006-0006-000000000006',
        'USER_INVITED',
        'ผู้ใช้ถูกเชิญ',
        'auth',
        'info',
        'users',
        'เมื่อมีการส่งคำเชิญ'
    ),
    (
        'ee040007-0007-0007-0007-000000000007',
        'USER_LOGIN_FAILED',
        'Login ล้มเหลวหลายครั้ง',
        'security',
        'warning',
        'users',
        'Login ผิดเกิน 5 ครั้ง'
    ),
    (
        'ee040008-0008-0008-0008-000000000008',
        'ASSET_WARRANTY_EXPIRE',
        'ใบรับประกันทรัพย์สินหมดอายุ',
        'asset',
        'info',
        'assets',
        'เตือน 30 วันก่อนหมดประกัน'
    );
-- ==============================================================================
-- 19. NOTIFICATION INBOX (ตัวอย่างการแจ้งเตือน)
-- ==============================================================================
INSERT INTO public.notification_inbox (
        id,
        tenant_id,
        user_id,
        event_type_id,
        category,
        severity,
        title,
        message,
        deeplink_url,
        entity_type,
        entity_id,
        is_read,
        created_at
    )
VALUES (
        '1b000001-0001-0001-0001-000000000001',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'ee040002-0002-0002-0002-000000000002',
        'work_order',
        'info',
        'ได้รับมอบหมายงานใหม่: กล้อง CCTV อาคาร A ขัดข้อง',
        'คุณ วิภา รักไทย ได้มอบหมาย Work Order #WO-001 ให้คุณดำเนินการ กรุณาตรวจสอบและดำเนินการโดยเร็ว',
        '/work-orders/c0000001-0001-0001-0001-000000000001',
        'work_orders',
        'c0000001-0001-0001-0001-000000000001',
        false,
        NOW() - INTERVAL '3 hours'
    ),
    (
        '1b000002-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'ee040004-0004-0004-0004-000000000004',
        'iot',
        'warning',
        'อุปกรณ์ออฟไลน์: กล้อง CCTV DEV-BKK-A-001',
        'อุปกรณ์ CCTV-DEV-BKK-A-001 ไม่ส่ง heartbeat มาเป็นเวลา 2 ชั่วโมง กรุณาตรวจสอบ',
        '/devices/de000001-0001-0001-0001-000000000001',
        'devices',
        'de000001-0001-0001-0001-000000000001',
        false,
        NOW() - INTERVAL '2 hours'
    ),
    (
        '1b000003-0003-0003-0003-000000000003',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'ee040001-0001-0001-0001-000000000001',
        'work_order',
        'info',
        'Work Order ใหม่: รถบรรทุกขยะ บษ-1234 ซ่อมบำรุงประจำปี',
        'Work Order #WO-002 ถูกสร้างโดย วิภา รักไทย รอการมอบหมายช่างเทคนิค',
        '/work-orders/c0000002-0002-0002-0002-000000000002',
        'work_orders',
        'c0000002-0002-0002-0002-000000000002',
        true,
        NOW() - INTERVAL '1 day'
    ),
    (
        '1b000004-0004-0004-0004-000000000004',
        'aaaaaaaa-0002-0002-0002-000000000002',
        'bbbbbbbb-0004-0004-0004-000000000004',
        'ee040001-0001-0001-0001-000000000001',
        'work_order',
        'high',
        'Work Order ด่วน: โปรเจคเตอร์ห้อง 301 ไม่ติด',
        'กรุณาติดต่อฝ่ายเทคนิคโดยเร็ว มีการสอนในพรุ่งนี้',
        '/work-orders/c0000004-0004-0004-0004-000000000004',
        'work_orders',
        'c0000004-0004-0004-0004-000000000004',
        false,
        NOW() - INTERVAL '30 minutes'
    );
-- ==============================================================================
-- 20. API CONSUMERS & CREDENTIALS (Corp Alpha API Access)
-- ==============================================================================
INSERT INTO public.api_consumers (
        id,
        tenant_id,
        consumer_type,
        name,
        description,
        owner_user_id,
        status
    )
VALUES (
        'a9100001-0001-0001-0001-000000000001',
        'aaaaaaaa-0003-0003-0003-000000000003',
        'service_account',
        'Alpha Tech Mobile App Backend',
        'Backend service สำหรับ Mobile Application ของ Alpha Tech',
        'bbbbbbbb-0005-0005-0005-000000000005',
        'active'
    ),
    (
        'a9100002-0002-0002-0002-000000000002',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'integration',
        'BKK Data Platform Connector',
        'เชื่อมต่อกับระบบ Open Data ของ กทม.',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'active'
    );
-- ==============================================================================
-- 21. MASTER DATA (md_domains, md_types, md_records)
-- ==============================================================================
INSERT INTO public.md_domains (id, code, name, description)
VALUES (
        'ddd0a001-0001-0001-0001-000000000001',
        'HR',
        'ทรัพยากรบุคคล',
        'ข้อมูลอ้างอิงด้าน HR'
    ),
    (
        'ddd0a002-0002-0002-0002-000000000002',
        'ASSET_MD',
        'ข้อมูลทรัพย์สิน',
        'ข้อมูลอ้างอิงด้านทรัพย์สิน'
    ),
    (
        'ddd0a003-0003-0003-0003-000000000003',
        'GEO',
        'ภูมิศาสตร์',
        'ข้อมูลพื้นที่และภูมิศาสตร์'
    ),
    (
        'ddd0a004-0004-0004-0004-000000000004',
        'FINANCE',
        'การเงิน',
        'ข้อมูลอ้างอิงด้านการเงิน'
    );
INSERT INTO public.md_types (
        id,
        domain_id,
        code,
        name,
        scope_level,
        storage_mode
    )
VALUES (
        'ddf00001-0001-0001-0001-000000000001',
        'ddd0a001-0001-0001-0001-000000000001',
        'EMPLOYEE_TYPE',
        'ประเภทพนักงาน',
        'platform',
        'generic'
    ),
    (
        'ddf00002-0002-0002-0002-000000000002',
        'ddd0a002-0002-0002-0002-000000000002',
        'ASSET_CONDITION',
        'สภาพทรัพย์สิน',
        'platform',
        'generic'
    ),
    (
        'ddf00003-0003-0003-0003-000000000003',
        'ddd0a003-0003-0003-0003-000000000003',
        'PROVINCE',
        'จังหวัด',
        'platform',
        'generic'
    ),
    (
        'ddf00004-0004-0004-0004-000000000004',
        'ddd0a004-0004-0004-0004-000000000004',
        'BUDGET_CATEGORY',
        'หมวดงบประมาณ',
        'platform',
        'generic'
    );
INSERT INTO public.md_records (
        id,
        md_type_id,
        tenant_id,
        code,
        name,
        status,
        approval_status,
        is_system_seed,
        sort_order
    )
VALUES -- Employee Types
    (
        'dde00001-0001-0001-0001-000000000001',
        'ddf00001-0001-0001-0001-000000000001',
        NULL,
        'PERMANENT',
        'พนักงานประจำ',
        'active',
        'approved',
        true,
        1
    ),
    (
        'dde00002-0002-0002-0002-000000000002',
        'ddf00001-0001-0001-0001-000000000001',
        NULL,
        'CONTRACT',
        'พนักงานสัญญาจ้าง',
        'active',
        'approved',
        true,
        2
    ),
    (
        'dde00003-0003-0003-0003-000000000003',
        'ddf00001-0001-0001-0001-000000000001',
        NULL,
        'PART_TIME',
        'พนักงานนอกเวลา',
        'active',
        'approved',
        true,
        3
    ),
    (
        'dde00004-0004-0004-0004-000000000004',
        'ddf00001-0001-0001-0001-000000000001',
        NULL,
        'OUTSOURCE',
        'Outsource',
        'active',
        'approved',
        true,
        4
    ),
    -- Asset Conditions
    (
        'dde00010-0010-0010-0010-000000000010',
        'ddf00002-0002-0002-0002-000000000002',
        NULL,
        'EXCELLENT',
        'สภาพดีเยี่ยม',
        'active',
        'approved',
        true,
        1
    ),
    (
        'dde00011-0011-0011-0011-000000000011',
        'ddf00002-0002-0002-0002-000000000002',
        NULL,
        'GOOD',
        'สภาพดี',
        'active',
        'approved',
        true,
        2
    ),
    (
        'dde00012-0012-0012-0012-000000000012',
        'ddf00002-0002-0002-0002-000000000002',
        NULL,
        'FAIR',
        'สภาพพอใช้',
        'active',
        'approved',
        true,
        3
    ),
    (
        'dde00013-0013-0013-0013-000000000013',
        'ddf00002-0002-0002-0002-000000000002',
        NULL,
        'POOR',
        'สภาพไม่ดี',
        'active',
        'approved',
        true,
        4
    ),
    (
        'dde00014-0014-0014-0014-000000000014',
        'ddf00002-0002-0002-0002-000000000002',
        NULL,
        'SCRAPPED',
        'ชำรุด/เสื่อมสภาพ',
        'active',
        'approved',
        true,
        5
    ),
    -- Budget Categories
    (
        'dde00020-0020-0020-0020-000000000020',
        'ddf00004-0004-0004-0004-000000000004',
        NULL,
        'CAPEX',
        'งบลงทุน',
        'active',
        'approved',
        true,
        1
    ),
    (
        'dde00021-0021-0021-0021-000000000021',
        'ddf00004-0004-0004-0004-000000000004',
        NULL,
        'OPEX',
        'งบดำเนินงาน',
        'active',
        'approved',
        true,
        2
    ),
    (
        'dde00022-0022-0022-0022-000000000022',
        'ddf00004-0004-0004-0004-000000000004',
        NULL,
        'MAINTENANCE',
        'งบบำรุงรักษา',
        'active',
        'approved',
        true,
        3
    );
-- ==============================================================================
-- 22. MENU ITEMS
-- ==============================================================================
INSERT INTO public.menu_items (
        id,
        app_id,
        parent_menu_id,
        code,
        name,
        route_path,
        icon,
        sort_order,
        visibility_type,
        required_permission_code
    )
VALUES -- Dashboard (public)
    (
        'ee010001-0001-0001-0001-000000000001',
        NULL,
        NULL,
        'DASHBOARD',
        'แดชบอร์ด',
        '/dashboard',
        'LayoutDashboard',
        0,
        'authenticated',
        NULL
    ),
    -- Assets
    (
        'ee010002-0002-0002-0002-000000000002',
        'a0000002-0000-0000-0000-000000000002',
        NULL,
        'ASSETS',
        'ทรัพย์สิน',
        '/assets',
        'Package',
        1,
        'permission_based',
        'assets:read'
    ),
    (
        'ee010003-0003-0003-0003-000000000003',
        'a0000002-0000-0000-0000-000000000002',
        'ee010002-0002-0002-0002-000000000002',
        'ASSETS_LIST',
        'รายการทรัพย์สิน',
        '/assets/list',
        'List',
        0,
        'permission_based',
        'assets:read'
    ),
    (
        'ee010004-0004-0004-0004-000000000004',
        'a0000002-0000-0000-0000-000000000002',
        'ee010002-0002-0002-0002-000000000002',
        'ASSETS_ADD',
        'เพิ่มทรัพย์สิน',
        '/assets/new',
        'Plus',
        1,
        'permission_based',
        'assets:create'
    ),
    -- Work Orders
    (
        'ee010005-0005-0005-0005-000000000005',
        'a0000003-0000-0000-0000-000000000003',
        NULL,
        'WORK_ORDERS',
        'Work Orders',
        '/work-orders',
        'Wrench',
        2,
        'permission_based',
        'work_orders:read'
    ),
    -- IoT
    (
        'ee010006-0006-0006-0006-000000000006',
        'a0000005-0000-0000-0000-000000000005',
        NULL,
        'DEVICES',
        'อุปกรณ์ IoT',
        '/devices',
        'Cpu',
        3,
        'permission_based',
        'assets:read'
    ),
    -- Reports
    (
        'ee010007-0007-0007-0007-000000000007',
        'a0000006-0000-0000-0000-000000000006',
        NULL,
        'REPORTS',
        'รายงาน',
        '/reports',
        'BarChart3',
        4,
        'permission_based',
        'reports:read'
    ),
    -- Settings (admin only)
    (
        'ee010008-0008-0008-0008-000000000008',
        NULL,
        NULL,
        'SETTINGS',
        'ตั้งค่า',
        '/settings',
        'Settings',
        99,
        'permission_based',
        'users:update'
    );
-- ==============================================================================
-- 23. AUDIT EVENTS (ตัวอย่าง — ใส่โดยตรงสำหรับ POC)
-- ==============================================================================
-- หมายเหตุ: ใน production trigger จะป้องกัน INSERT ผ่าน API
-- สำหรับ POC ให้ bypass ผ่าน SQL โดยตรง
INSERT INTO public.audit_events (
        id,
        event_time,
        tenant_id,
        actor_type,
        actor_user_id,
        actor_name,
        actor_email,
        actor_ip,
        event_category,
        event_action,
        event_result,
        severity,
        target_type,
        target_id,
        target_name,
        module_code,
        summary,
        is_sensitive
    )
VALUES (
        'a0d10001-0001-0001-0001-000000000001',
        NOW() - INTERVAL '1 year',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'user',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'สมชาย ใจดี',
        'admin@thunder.platform',
        '127.0.0.1',
        'auth',
        'login',
        'success',
        'info',
        'users',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'สมชาย ใจดี',
        'IAM',
        'ผู้ใช้ admin@thunder.platform เข้าสู่ระบบสำเร็จ',
        false
    ),
    (
        'a0d10002-0002-0002-0002-000000000002',
        NOW() - INTERVAL '6 months',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'user',
        'bbbbbbbb-0001-0001-0001-000000000001',
        'สมชาย ใจดี',
        'admin@thunder.platform',
        '127.0.0.1',
        'user_management',
        'user.invite',
        'success',
        'info',
        'users',
        'bbbbbbbb-0002-0002-0002-000000000002',
        'วิภา รักไทย',
        'IAM',
        'ส่งคำเชิญผู้ใช้ manager.bkk@bkk.go.th เข้าร่วม BKK-CITY',
        false
    ),
    (
        'a0d10003-0003-0003-0003-000000000003',
        NOW() - INTERVAL '3 hours',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'user',
        'bbbbbbbb-0003-0003-0003-000000000003',
        'ประเสริฐ ดีงาม',
        'staff.bkk@bkk.go.th',
        '10.0.1.55',
        'work_order',
        'work_order.create',
        'success',
        'info',
        'work_orders',
        'c0000001-0001-0001-0001-000000000001',
        'กล้อง CCTV อาคาร A ขัดข้อง',
        'WORK_ORDER',
        'สร้าง Work Order: กล้อง CCTV อาคาร A ขัดข้อง - ภาพไม่ชัด',
        false
    ),
    (
        'a0d10004-0004-0004-0004-000000000004',
        NOW() - INTERVAL '2 hours',
        'aaaaaaaa-0001-0001-0001-000000000001',
        'system',
        NULL,
        'System',
        'system@thunder.platform',
        NULL,
        'iot',
        'device.offline',
        'success',
        'warning',
        'devices',
        'de000001-0001-0001-0001-000000000001',
        'CCTV-DEV-BKK-A-001',
        'IOT',
        'อุปกรณ์ CCTV-DEV-BKK-A-001 ไม่ส่ง heartbeat เกิน threshold (2 ชั่วโมง)',
        false
    );
-- ==============================================================================
-- 24. CONNECTOR DEFINITIONS (System-level connectors)
-- ==============================================================================
INSERT INTO public.connector_definitions (
        id,
        code,
        name,
        category,
        protocol_type,
        auth_type,
        direction,
        status,
        version
    )
VALUES (
        'c0de0001-0001-0001-0001-000000000001',
        'LINE_NOTIFY',
        'LINE Notify',
        'messaging',
        'REST',
        'oauth2',
        'outbound',
        'active',
        '1.0.0'
    ),
    (
        'c0de0002-0002-0002-0002-000000000002',
        'SMTP_GMAIL',
        'Gmail SMTP',
        'email',
        'SMTP',
        'oauth2',
        'outbound',
        'active',
        '1.0.0'
    ),
    (
        'c0de0003-0003-0003-0003-000000000003',
        'EGOV_API',
        'eGovernment API (กรมการปกครอง)',
        'government',
        'REST',
        'api_key',
        'bidirectional',
        'active',
        '2.1.0'
    ),
    (
        'c0de0004-0004-0004-0004-000000000004',
        'SAP_HR',
        'SAP HR Integration',
        'erp',
        'REST',
        'basic',
        'inbound',
        'active',
        '1.5.0'
    );
-- ==============================================================================
-- SEED COMPLETE — สรุปข้อมูลที่ใส่
-- ==============================================================================
DO $$ BEGIN RAISE NOTICE '========================================';
RAISE NOTICE 'POC Seed Data Complete!';
RAISE NOTICE '========================================';
RAISE NOTICE 'Tenants     : 3 (BKK, School, Corp Alpha)';
RAISE NOTICE 'Users       : 6 (1 admin, 2 BKK, 1 teacher, 1 dev, 1 invited)';
RAISE NOTICE 'Departments : 5 (BKK hierarchy)';
RAISE NOTICE 'Locations   : 4 (BKK HQ, 2 zones, School)';
RAISE NOTICE 'App Modules : 8';
RAISE NOTICE 'Roles       : 9 (5 system + 4 custom)';
RAISE NOTICE 'Permissions : 17';
RAISE NOTICE 'Memberships : 6 + 9 role assignments';
RAISE NOTICE 'Assets      : 5 (Server, Laptop, Truck, CCTV, Projector)';
RAISE NOTICE 'Devices     : 3 (CCTV, GPS, Air Quality)';
RAISE NOTICE 'Work Orders : 4 (open/in-progress/resolved)';
RAISE NOTICE 'Notifications: 4 inbox items';
RAISE NOTICE 'Master Data : 4 domains, 4 types, 12 records';
RAISE NOTICE 'Audit Events: 4';
RAISE NOTICE '========================================';
RAISE NOTICE 'Test Credentials (ต้องสร้างใน auth.users ก่อน):';
RAISE NOTICE '  admin@thunder.platform';
RAISE NOTICE '  manager.bkk@bkk.go.th';
RAISE NOTICE '  staff.bkk@bkk.go.th';
RAISE NOTICE '  teacher@school01.ac.th';
RAISE NOTICE '  dev@alpha-tech.co.th';
RAISE NOTICE '========================================';
END $$;