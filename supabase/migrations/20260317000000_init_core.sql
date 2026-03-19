-- ==============================================================================
-- 1. EXTENSIONS & ENUMS (ประเภทข้อมูลพื้นฐาน)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_status'
) THEN CREATE TYPE user_status AS ENUM (
    'invited',
    'active',
    'suspended',
    'locked',
    'archived',
    'deleted'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'identity_type'
) THEN CREATE TYPE identity_type AS ENUM (
    'email',
    'phone',
    'username',
    'google',
    'microsoft',
    'line',
    'citizen_id_stub',
    'employee_code'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'credential_type'
) THEN CREATE TYPE credential_type AS ENUM (
    'password',
    'totp',
    'recovery_code',
    'oauth_link'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'tenant_status'
) THEN CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'archived');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'membership_status'
) THEN CREATE TYPE membership_status AS ENUM (
    'invited',
    'active',
    'suspended',
    'removed',
    'archived'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'role_effect'
) THEN CREATE TYPE role_effect AS ENUM ('allow', 'deny');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'scope_type'
) THEN CREATE TYPE scope_type AS ENUM (
    'platform',
    'tenant',
    'app',
    'department',
    'location',
    'resource'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'visibility_type'
) THEN CREATE TYPE visibility_type AS ENUM ('public', 'authenticated', 'permission_based');
END IF;
END $$;
-- ==============================================================================
-- 2. IDENTITY & AUTHENTICATION (ผู้ใช้และการเข้าสู่ระบบ)
-- ==============================================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    global_user_code VARCHAR(100) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) UNIQUE,
    first_name VARCHAR(120),
    last_name VARCHAR(120),
    display_name VARCHAR(255),
    avatar_url TEXT,
    preferred_language VARCHAR(20) DEFAULT 'th',
    timezone VARCHAR(100) DEFAULT 'Asia/Bangkok',
    status user_status NOT NULL DEFAULT 'invited',
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE public.auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    identity_type identity_type NOT NULL,
    identity_value VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    access_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (identity_type, identity_value)
);
CREATE UNIQUE INDEX unique_primary_per_type_per_user ON public.auth_identities (user_id, identity_type)
WHERE (is_primary = true);
CREATE TABLE public.user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    credential_type credential_type NOT NULL,
    mfa_enabled BOOLEAN DEFAULT false,
    password_hash TEXT,
    password_algo VARCHAR(50) DEFAULT 'argon2id',
    password_updated_at TIMESTAMPTZ,
    mfa_secret_encrypted TEXT,
    failed_attempt_count INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT,
    access_token_jti TEXT,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address INET,
    location_hint TEXT,
    is_revoked BOOLEAN DEFAULT false,
    revoke_reason TEXT,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ==============================================================================
-- 3. TENANTS, ORGANIZATIONS & SETTINGS (โครงสร้างองค์กร)
-- ==============================================================================
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tenant_type VARCHAR(50) NOT NULL,
    -- municipal, school, enterprise
    status tenant_status NOT NULL DEFAULT 'active',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    timezone VARCHAR(100) DEFAULT 'Asia/Bangkok',
    locale VARCHAR(20) DEFAULT 'th-TH',
    country_code VARCHAR(10) DEFAULT 'TH',
    currency_code VARCHAR(10) DEFAULT 'THB',
    owner_user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        parent_tenant_id UUID REFERENCES public.tenants(id) ON DELETE
    SET NULL,
        onboarding_status VARCHAR(50) DEFAULT 'pending',
        activated_at TIMESTAMPTZ,
        suspended_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
);
CREATE TABLE public.tenant_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    domain_type VARCHAR(50) DEFAULT 'custom',
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'pending',
    ssl_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.tenant_settings (
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value_json JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tenant_id, setting_key)
);
CREATE TABLE public.branding_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    theme_mode VARCHAR(20) DEFAULT 'light',
    login_background_url TEXT,
    custom_css_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    parent_department_id UUID REFERENCES public.departments(id) ON DELETE
    SET NULL,
        code VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        department_type VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        is_root BOOLEAN DEFAULT false,
        cost_center_code VARCHAR(100),
        manager_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ,
        UNIQUE (tenant_id, code)
);
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    parent_location_id UUID REFERENCES public.locations(id) ON DELETE
    SET NULL,
        code VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        location_type VARCHAR(100),
        latitude NUMERIC(10, 7),
        longitude NUMERIC(10, 7),
        address TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (tenant_id, code)
);
-- ==============================================================================
-- 4. MEMBERSHIPS & INVITATIONS (การเป็นสมาชิกและคำเชิญ)
-- ==============================================================================
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    employee_code VARCHAR(100),
    job_title VARCHAR(255),
    user_type VARCHAR(50) NOT NULL DEFAULT 'internal',
    default_department_id UUID REFERENCES public.departments(id) ON DELETE
    SET NULL,
        default_location_id UUID REFERENCES public.locations(id) ON DELETE
    SET NULL,
        is_primary BOOLEAN DEFAULT true,
        status membership_status NOT NULL DEFAULT 'invited',
        joined_at TIMESTAMPTZ,
        invited_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        start_date DATE,
        end_date DATE,
        last_accessed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (user_id, tenant_id)
);
CREATE TABLE public.user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    invited_role_id UUID,
    -- Will link to roles table
    department_id UUID REFERENCES public.departments(id) ON DELETE
    SET NULL,
        invited_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        accepted_by_user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ==============================================================================
-- 5. ACCESS CONTROL (RBAC & SCOPES)
-- ==============================================================================
CREATE TABLE public.app_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    -- Null = System Level
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    -- system, tenant, app, custom
    role_scope VARCHAR(50) DEFAULT 'tenant',
    parent_role_id UUID REFERENCES public.roles(id) ON DELETE
    SET NULL,
        app_id UUID REFERENCES public.app_modules(id) ON DELETE
    SET NULL,
        description TEXT,
        is_system BOOLEAN NOT NULL DEFAULT false,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(tenant_id, code)
);
-- Update invitation foreign key now that roles table exists
ALTER TABLE public.user_invitations
ADD CONSTRAINT fk_invited_role FOREIGN KEY (invited_role_id) REFERENCES public.roles(id) ON DELETE
SET NULL;
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(150) NOT NULL UNIQUE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    group_name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    effect role_effect NOT NULL DEFAULT 'allow',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (role_id, permission_id)
);
CREATE TABLE public.membership_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (membership_id, role_id)
);
CREATE TABLE public.scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    scope_type scope_type NOT NULL,
    scope_ref_id UUID,
    scope_ref_code VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.membership_role_scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_role_id UUID NOT NULL REFERENCES public.membership_roles(id) ON DELETE CASCADE,
    scope_type scope_type NOT NULL,
    scope_ref_id UUID,
    scope_ref_code VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ==============================================================================
-- 6. MASTER DATA ENGINE (ระบบฐานข้อมูลอ้างอิงกลาง)
-- ==============================================================================
CREATE TABLE public.md_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.md_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES public.md_domains(id) ON DELETE CASCADE,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope_level VARCHAR(30) DEFAULT 'hybrid',
    -- platform, tenant, hybrid
    storage_mode VARCHAR(30) DEFAULT 'generic',
    -- fixed, generic
    hierarchy_enabled BOOLEAN DEFAULT false,
    version_enabled BOOLEAN DEFAULT false,
    approval_required BOOLEAN DEFAULT false,
    tenant_override_allowed BOOLEAN DEFAULT true,
    external_mapping_enabled BOOLEAN DEFAULT false,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.md_type_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    md_type_id UUID NOT NULL REFERENCES public.md_types(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    is_unique BOOLEAN DEFAULT false,
    is_searchable BOOLEAN DEFAULT true,
    default_value TEXT,
    validation_rule_json JSONB DEFAULT '{}',
    ui_config_json JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    UNIQUE(md_type_id, field_key)
);
CREATE TABLE public.md_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    md_type_id UUID NOT NULL REFERENCES public.md_types(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    -- Null = Global Platform Data
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_record_id UUID REFERENCES public.md_records(id) ON DELETE
    SET NULL,
        status VARCHAR(30) DEFAULT 'draft',
        approval_status VARCHAR(30) DEFAULT 'approved',
        version_no INT DEFAULT 1,
        effective_from DATE DEFAULT CURRENT_DATE,
        effective_to DATE,
        is_system_seed BOOLEAN DEFAULT false,
        is_locked BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(md_type_id, tenant_id, code)
);
CREATE TABLE public.md_record_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    md_record_id UUID NOT NULL REFERENCES public.md_records(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    value_text TEXT,
    value_number NUMERIC,
    value_boolean BOOLEAN,
    value_date DATE,
    value_datetime TIMESTAMPTZ,
    value_json JSONB,
    UNIQUE(md_record_id, field_key)
);
CREATE TABLE public.asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.asset_categories(id) ON DELETE
    SET NULL,
        code VARCHAR(100) NOT NULL,
        name_th VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        icon_url TEXT,
        color_code VARCHAR(20),
        depreciation_class VARCHAR(100),
        default_uom VARCHAR(50),
        status VARCHAR(30) DEFAULT 'active',
        is_system_seed BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(tenant_id, code)
);
CREATE TABLE public.device_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    connectivity_type VARCHAR(100),
    firmware_schema_json JSONB DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'active',
    is_system_seed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);
CREATE TABLE public.budget_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    year_code VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, year_code)
);
CREATE TABLE public.md_version_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    md_record_id UUID NOT NULL REFERENCES public.md_records(id) ON DELETE CASCADE,
    version_no INT NOT NULL,
    snapshot_json JSONB NOT NULL,
    changed_fields_json JSONB,
    change_type VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.md_external_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    md_record_id UUID NOT NULL REFERENCES public.md_records(id) ON DELETE CASCADE,
    external_system VARCHAR(100) NOT NULL,
    external_code VARCHAR(255) NOT NULL,
    external_name VARCHAR(255),
    mapping_status VARCHAR(30) DEFAULT 'active',
    synced_at TIMESTAMPTZ,
    UNIQUE(md_record_id, external_system)
);
-- ==============================================================================
-- 7. BUSINESS CORE (ASSETS, DEVICES, WORK ORDERS)
-- ==============================================================================
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE
    SET NULL,
        owner_org_id UUID REFERENCES public.departments(id) ON DELETE
    SET NULL,
        asset_category_id UUID REFERENCES public.asset_categories(id) ON DELETE
    SET NULL,
        asset_type VARCHAR(100),
        -- Legacy string support if needed
        name TEXT NOT NULL,
        serial_number TEXT,
        status TEXT DEFAULT 'active',
        purchase_date DATE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE
    SET NULL,
        device_type_id UUID REFERENCES public.device_types(id) ON DELETE
    SET NULL,
        device_type TEXT,
        -- Legacy string support
        device_uid TEXT UNIQUE NOT NULL,
        is_online BOOLEAN DEFAULT false,
        last_heartbeat TIMESTAMPTZ,
        firmware_version TEXT,
        config JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.device_telemetry_latest (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE
    SET NULL,
        reported_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        assigned_to UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'open',
        due_date TIMESTAMPTZ,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.work_order_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL
);
-- ==============================================================================
-- 8. FILE MANAGEMENT (CONTENT & MEDIA)
-- ==============================================================================
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    module_key VARCHAR(50) NOT NULL,
    bucket_name VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    stored_filename TEXT,
    file_extension VARCHAR(20),
    mime_type VARCHAR(100),
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    checksum VARCHAR(128),
    visibility VARCHAR(30) NOT NULL DEFAULT 'private',
    status VARCHAR(30) NOT NULL DEFAULT 'uploading',
    current_version_no INT NOT NULL DEFAULT 1,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        is_deleted BOOLEAN NOT NULL DEFAULT false,
        deleted_at TIMESTAMPTZ,
        deleted_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.file_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    link_role VARCHAR(50) NOT NULL DEFAULT 'attachment',
    linked_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(file_id, entity_type, entity_id)
);
CREATE TABLE public.file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    version_no INT NOT NULL,
    bucket_name VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    checksum VARCHAR(128),
    uploaded_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        change_note TEXT,
        is_current BOOLEAN NOT NULL DEFAULT false,
        UNIQUE(file_id, version_no)
);
CREATE TABLE public.file_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    action VARCHAR(30) NOT NULL,
    actor_user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(100),
        user_agent TEXT,
        result VARCHAR(30)
);
-- ==============================================================================
-- INDEXES สำหรับ Part 2
-- ==============================================================================
CREATE INDEX idx_md_records_type_tenant ON public.md_records(md_type_id, tenant_id);
CREATE INDEX idx_md_values_record ON public.md_record_values(md_record_id);
CREATE INDEX idx_asset_cat_tenant ON public.asset_categories(tenant_id);
CREATE INDEX idx_device_type_tenant ON public.device_types(tenant_id);
CREATE INDEX idx_files_tenant_id ON public.files(tenant_id);
CREATE INDEX idx_files_module_key ON public.files(module_key);
CREATE INDEX idx_file_links_file_id ON public.file_links(file_id);
CREATE INDEX idx_file_links_entity ON public.file_links(entity_type, entity_id);
-- ==============================================================================
-- 9. NOTIFICATION ENGINE (ระบบแจ้งเตือนอัจฉริยะ)
-- ==============================================================================
CREATE TABLE public.notification_event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity_default VARCHAR(20) DEFAULT 'info',
    entity_type VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.notification_channels (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);
CREATE TABLE public.notification_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    channel_code VARCHAR(50) REFERENCES public.notification_channels(code),
    provider_name VARCHAR(100) NOT NULL,
    config_json JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'active',
    is_default BOOLEAN DEFAULT false,
    last_tested_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    event_type_id UUID REFERENCES public.notification_event_types(id) ON DELETE CASCADE,
    channel_code VARCHAR(50) REFERENCES public.notification_channels(code),
    language_code VARCHAR(10) DEFAULT 'th',
    template_name VARCHAR(255) NOT NULL,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    body_format VARCHAR(20) DEFAULT 'text',
    variables_schema_json JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.notification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    event_type_id UUID REFERENCES public.notification_event_types(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    severity_override VARCHAR(20),
    condition_json JSONB DEFAULT '{}',
    recipient_strategy VARCHAR(50) NOT NULL,
    recipient_config_json JSONB DEFAULT '{}',
    channel_policy_json JSONB DEFAULT '{}',
    dedup_window_seconds INT DEFAULT 0,
    cooldown_seconds INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    priority_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type_id UUID REFERENCES public.notification_event_types(id) ON DELETE CASCADE,
    channel_code VARCHAR(50) REFERENCES public.notification_channels(code),
    is_enabled BOOLEAN DEFAULT true,
    mute_until TIMESTAMPTZ,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(100) DEFAULT 'Asia/Bangkok',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, user_id, event_type_id, channel_code)
);
CREATE TABLE public.notification_inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type_id UUID REFERENCES public.notification_event_types(id),
    category VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    deeplink_url TEXT,
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);
CREATE TABLE public.notification_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_inbox_id UUID REFERENCES public.notification_inbox(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    action_value TEXT,
    action_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meta_json JSONB DEFAULT '{}'
);
-- ==============================================================================
-- 10. API GATEWAY & WEBHOOKS (ประตูเชื่อมต่อ)
-- ==============================================================================
CREATE TABLE public.api_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(100) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    base_url TEXT NOT NULL,
    environment VARCHAR(50) DEFAULT 'production',
    is_active BOOLEAN DEFAULT true,
    timeout_ms INT DEFAULT 5000,
    retry_policy JSONB DEFAULT '{"max_retries": 3, "backoff": "exponential"}',
    health_check_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.api_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.api_services(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    path_pattern VARCHAR(255) NOT NULL,
    version VARCHAR(20) DEFAULT 'v1',
    auth_type VARCHAR(50) DEFAULT 'jwt',
    rate_limit_policy_id UUID,
    permission_policy_id UUID,
    transform_request_rule JSONB DEFAULT '{}',
    transform_response_rule JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (method, path_pattern)
);
CREATE TABLE public.api_consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    consumer_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        status VARCHAR(30) DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.api_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumer_id UUID NOT NULL REFERENCES public.api_consumers(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) DEFAULT 'api_key',
    key_prefix VARCHAR(20) NOT NULL,
    secret_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.api_rate_limit_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(255) NOT NULL,
    scope_type VARCHAR(50) DEFAULT 'consumer',
    requests_per_minute INT DEFAULT 60,
    requests_per_hour INT DEFAULT 1000,
    burst_limit INT DEFAULT 10,
    concurrent_limit INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.api_quota_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_code VARCHAR(100) UNIQUE NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    daily_quota INT NOT NULL DEFAULT 1000,
    monthly_quota BIGINT NOT NULL DEFAULT 10000,
    webhook_limit INT DEFAULT 5,
    data_transfer_limit_mb BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.api_consumer_plan_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumer_id UUID NOT NULL REFERENCES public.api_consumers(id) ON DELETE CASCADE,
    quota_plan_id UUID NOT NULL REFERENCES public.api_quota_plans(id),
    start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'active',
    UNIQUE (consumer_id, quota_plan_id, status)
);
CREATE TABLE public.webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    consumer_id UUID REFERENCES public.api_consumers(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    callback_url TEXT NOT NULL,
    signing_secret_hash TEXT,
    retry_policy JSONB DEFAULT '{"max_retries": 5, "backoff": "exponential"}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.webhook_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_endpoint_id UUID NOT NULL REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
    event_id UUID NOT NULL,
    http_status INT,
    request_body JSONB,
    response_body TEXT,
    attempt_no INT DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'pending'
);
CREATE TABLE public.api_usage_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    consumer_id UUID REFERENCES public.api_consumers(id) ON DELETE CASCADE,
    route_id UUID REFERENCES public.api_routes(id) ON DELETE
    SET NULL,
        request_count BIGINT DEFAULT 0,
        success_count BIGINT DEFAULT 0,
        error_count BIGINT DEFAULT 0,
        total_latency_ms BIGINT DEFAULT 0,
        total_data_mb NUMERIC(10, 4) DEFAULT 0,
        UNIQUE (usage_date, tenant_id, consumer_id, route_id)
);
CREATE TABLE public.api_request_logs (
    id BIGSERIAL PRIMARY KEY,
    request_id VARCHAR(255) UNIQUE NOT NULL,
    trace_id VARCHAR(255),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE
    SET NULL,
        user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        consumer_id UUID REFERENCES public.api_consumers(id) ON DELETE
    SET NULL,
        route_id UUID REFERENCES public.api_routes(id) ON DELETE
    SET NULL,
        method VARCHAR(10) NOT NULL,
        path TEXT NOT NULL,
        status_code INT NOT NULL,
        latency_ms INT,
        request_size_bytes INT,
        response_size_bytes INT,
        ip_address INET,
        user_agent TEXT,
        source_type VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ==============================================================================
-- 11. INTEGRATION CONNECTORS (เชื่อมต่อระบบภายนอก)
-- ==============================================================================
CREATE TABLE public.connector_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    protocol_type VARCHAR(50) NOT NULL,
    auth_type VARCHAR(50) NOT NULL,
    direction VARCHAR(20) DEFAULT 'outbound',
    config_schema_json JSONB DEFAULT '{}',
    mapping_schema_json JSONB DEFAULT '{}',
    capability_json JSONB DEFAULT '{"test_connection": true, "webhook": false}',
    status VARCHAR(30) DEFAULT 'active',
    version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.connector_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    definition_id UUID NOT NULL REFERENCES public.connector_definitions(id),
    name VARCHAR(255) NOT NULL,
    environment VARCHAR(50) DEFAULT 'production',
    status VARCHAR(30) DEFAULT 'configured',
    is_enabled BOOLEAN DEFAULT false,
    auth_config_ref VARCHAR(255),
    connection_config_json JSONB DEFAULT '{}',
    advanced_config_json JSONB DEFAULT '{}',
    last_tested_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(tenant_id, definition_id, environment)
);
CREATE TABLE public.connector_field_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_instance_id UUID NOT NULL REFERENCES public.connector_instances(id) ON DELETE CASCADE,
    mapping_group VARCHAR(100) DEFAULT 'default',
    source_field VARCHAR(255) NOT NULL,
    target_field VARCHAR(255) NOT NULL,
    transform_type VARCHAR(50) DEFAULT 'direct',
    transform_rule_json JSONB DEFAULT '{}',
    validation_rule_json JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    UNIQUE(
        connector_instance_id,
        mapping_group,
        source_field
    )
);
CREATE TABLE public.connector_sync_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_instance_id UUID NOT NULL REFERENCES public.connector_instances(id) ON DELETE CASCADE,
    sync_mode VARCHAR(50) DEFAULT 'manual',
    cron_expression VARCHAR(100),
    timezone VARCHAR(100) DEFAULT 'Asia/Bangkok',
    batch_size INT DEFAULT 100,
    retry_policy_json JSONB DEFAULT '{"max_retries": 3, "backoff": "exponential"}',
    conflict_policy VARCHAR(50) DEFAULT 'overwrite',
    watermark_field VARCHAR(100),
    last_watermark_value VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(connector_instance_id)
);
CREATE TABLE public.integration_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_instance_id UUID NOT NULL REFERENCES public.connector_instances(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    source_event_id VARCHAR(255),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'pending',
    headers_json JSONB DEFAULT '{}',
    payload_json JSONB NOT NULL,
    signature_valid BOOLEAN DEFAULT false,
    error_message TEXT
);
CREATE TABLE public.integration_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_instance_id UUID NOT NULL REFERENCES public.connector_instances(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL,
    trigger_type VARCHAR(50) DEFAULT 'manual',
    priority INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'queued',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    processed_count INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    error_summary TEXT,
    request_context_json JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.integration_job_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.integration_jobs(id) ON DELETE CASCADE,
    external_record_id VARCHAR(255),
    internal_record_id VARCHAR(255),
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    error_code VARCHAR(100),
    error_message TEXT,
    payload_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.integration_state_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_instance_id UUID NOT NULL REFERENCES public.connector_instances(id) ON DELETE CASCADE,
    state_key VARCHAR(100) NOT NULL,
    state_value_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(connector_instance_id, state_key)
);
-- ==============================================================================
-- 12. UX/UI & SYSTEM MENUS (โครงสร้างหน้าจอ)
-- ==============================================================================
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES public.app_modules(id) ON DELETE CASCADE,
    parent_menu_id UUID REFERENCES public.menu_items(id) ON DELETE
    SET NULL,
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        route_path VARCHAR(255),
        icon VARCHAR(100),
        sort_order INTEGER NOT NULL DEFAULT 0,
        visibility_type visibility_type NOT NULL DEFAULT 'permission_based',
        required_permission_code VARCHAR(150),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ==============================================================================
-- 13. AUDIT & COMPLIANCE (บันทึกและตรวจสอบย้อนหลังที่แก้ไขไม่ได้)
-- ==============================================================================
CREATE TABLE public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    platform_code VARCHAR(50) DEFAULT 'thunder',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE
    SET NULL,
        department_id UUID REFERENCES public.departments(id) ON DELETE
    SET NULL,
        location_id UUID REFERENCES public.locations(id) ON DELETE
    SET NULL,
        actor_type VARCHAR(30) NOT NULL DEFAULT 'user',
        actor_user_id UUID REFERENCES public.users(id) ON DELETE
    SET NULL,
        actor_name VARCHAR(255),
        actor_email VARCHAR(255),
        actor_role_snapshot JSONB,
        actor_ip INET,
        actor_user_agent TEXT,
        session_id UUID REFERENCES public.user_sessions(id) ON DELETE
    SET NULL,
        request_id VARCHAR(255),
        correlation_id VARCHAR(255),
        event_category VARCHAR(50) NOT NULL,
        event_action VARCHAR(100) NOT NULL,
        event_result VARCHAR(20) NOT NULL,
        severity VARCHAR(20) NOT NULL DEFAULT 'info',
        target_type VARCHAR(50),
        target_id UUID,
        target_name VARCHAR(255),
        module_code VARCHAR(50),
        summary TEXT NOT NULL,
        reason_code VARCHAR(100),
        metadata_json JSONB DEFAULT '{}',
        is_sensitive BOOLEAN NOT NULL DEFAULT false,
        hash_chain_prev VARCHAR(128),
        hash_chain_self VARCHAR(128)
);
CREATE TABLE public.audit_event_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_event_id UUID NOT NULL REFERENCES public.audit_events(id) ON DELETE CASCADE,
    field_path VARCHAR(255) NOT NULL,
    change_type VARCHAR(20) NOT NULL,
    old_value_text TEXT,
    new_value_text TEXT,
    old_value_json JSONB,
    new_value_json JSONB,
    is_sensitive_masked BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0
);
CREATE TABLE public.audit_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_code VARCHAR(50) UNIQUE NOT NULL,
    event_category VARCHAR(50),
    severity VARCHAR(20),
    retention_days INT NOT NULL DEFAULT 365,
    archive_enabled BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE public.audit_export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES public.users(id),
    filters_json JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    file_url TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
-- ==============================================================================
-- 14. POWERFUL VIEWS (ระบบประมวลผลสิทธิ์แบบ Real-time)
-- ==============================================================================
CREATE OR REPLACE VIEW public.v_membership_effective_permissions AS
SELECT mr.membership_id,
    mr.id AS membership_role_id,
    r.id AS role_id,
    r.code AS role_code,
    p.id AS permission_id,
    p.code AS permission_code,
    rp.effect,
    mr.expires_at
FROM public.membership_roles mr
    JOIN public.roles r ON r.id = mr.role_id
    JOIN public.role_permissions rp ON rp.role_id = r.id
    JOIN public.permissions p ON p.id = rp.permission_id
WHERE mr.expires_at IS NULL
    OR mr.expires_at > NOW();
CREATE OR REPLACE VIEW public.v_membership_role_scope_permissions AS
SELECT mr.membership_id,
    r.code AS role_code,
    p.code AS permission_code,
    mrs.scope_type,
    mrs.scope_ref_id,
    mrs.scope_ref_code
FROM public.membership_roles mr
    JOIN public.roles r ON r.id = mr.role_id
    JOIN public.role_permissions rp ON rp.role_id = r.id
    JOIN public.permissions p ON p.id = rp.permission_id
    LEFT JOIN public.membership_role_scopes mrs ON mrs.membership_role_id = mr.id
WHERE (
        mr.expires_at IS NULL
        OR mr.expires_at > NOW()
    )
    AND rp.effect = 'allow';
-- ==============================================================================
-- 15. SYSTEM FUNCTIONS & TRIGGERS (ระบบอัตโนมัติ)
-- ==============================================================================
-- 15.1 ป้องกันการแก้ไข Audit Log (Immutability)
CREATE OR REPLACE FUNCTION public.prevent_audit_modification() RETURNS TRIGGER AS $$ BEGIN RAISE EXCEPTION 'Audit logs are immutable. UPDATE and DELETE operations are strictly forbidden.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER block_audit_update BEFORE
UPDATE ON public.audit_events FOR EACH ROW EXECUTE PROCEDURE public.prevent_audit_modification();
CREATE TRIGGER block_audit_delete BEFORE DELETE ON public.audit_events FOR EACH ROW EXECUTE PROCEDURE public.prevent_audit_modification();
CREATE TRIGGER block_audit_change_update BEFORE
UPDATE ON public.audit_event_changes FOR EACH ROW EXECUTE PROCEDURE public.prevent_audit_modification();
CREATE TRIGGER block_audit_change_delete BEFORE DELETE ON public.audit_event_changes FOR EACH ROW EXECUTE PROCEDURE public.prevent_audit_modification();
-- 15.2 อัปเดต updated_at อัตโนมัติสำหรับทุกตาราง
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DO $$
DECLARE t TEXT;
tables TEXT [] := ARRAY [
    'users', 'auth_identities', 'user_credentials', 'tenants', 'tenant_domains', 'tenant_settings', 'branding_profiles', 'departments', 'locations', 'memberships',
    'app_modules', 'roles', 'menu_items', 'notification_event_types', 'notification_providers', 'notification_templates', 'notification_rules', 'notification_preferences',
    'api_services', 'api_routes', 'api_consumers', 'webhook_endpoints', 'connector_definitions', 'connector_instances', 'connector_sync_profiles', 'integration_state_store',
    'audit_retention_policies'
];
BEGIN FOREACH t IN ARRAY tables LOOP EXECUTE format(
    'DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I',
    t,
    t
);
EXECUTE format(
    'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at()',
    t,
    t
);
END LOOP;
END $$;
-- 15.3 Sync ผู้ใช้งานจาก Supabase Auth สู่ Public Users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.users (id, email, display_name, status)
VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'active'
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();
-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) & ISOLATION POLICIES
-- ==============================================================================
-- เปิดใช้งาน RLS ทุกตาราง
DO $$
DECLARE r RECORD;
BEGIN FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
) LOOP EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
END LOOP;
END $$;
-- RLS Helper
CREATE OR REPLACE FUNCTION public.is_tenant_member(check_tenant_id UUID) RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
        SELECT 1
        FROM public.memberships
        WHERE tenant_id = check_tenant_id
            AND user_id = auth.uid()
            AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 🛡️ Master & Config Data (Public Read)
CREATE POLICY "App Modules are public read" ON public.app_modules FOR
SELECT USING (true);
CREATE POLICY "Roles are public read" ON public.roles FOR
SELECT USING (true);
CREATE POLICY "Permissions are public read" ON public.permissions FOR
SELECT USING (true);
CREATE POLICY "Menus are public read" ON public.menu_items FOR
SELECT USING (true);
CREATE POLICY "Event Types are public read" ON public.notification_event_types FOR
SELECT USING (true);
CREATE POLICY "Channels are public read" ON public.notification_channels FOR
SELECT USING (true);
CREATE POLICY "Services are public read" ON public.api_services FOR
SELECT USING (true);
CREATE POLICY "Routes are public read" ON public.api_routes FOR
SELECT USING (true);
CREATE POLICY "Connector Definitions are public read" ON public.connector_definitions FOR
SELECT USING (status != 'deprecated');
-- 🛡️ Tenant Isolation Rules (Golden Rule: ข้อมูลใครข้อมูลมัน)
CREATE POLICY "Users edit own profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Tenants viewable by active members" ON public.tenants FOR
SELECT USING (public.is_tenant_member(id));
CREATE POLICY "Departments isolated by tenant" ON public.departments FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Locations isolated by tenant" ON public.locations FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Memberships viewable within same tenant" ON public.memberships FOR
SELECT USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Assets isolated by tenant" ON public.assets FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Devices isolated by tenant" ON public.devices FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Work Orders isolated by tenant" ON public.work_orders FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Files isolated by tenant" ON public.files FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "File links isolated by tenant" ON public.file_links FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Inbox isolated by user/tenant" ON public.notification_inbox FOR ALL USING (
    auth.uid() = user_id
    AND public.is_tenant_member(tenant_id)
);
CREATE POLICY "User Preferences isolated by user/tenant" ON public.notification_preferences FOR ALL USING (
    auth.uid() = user_id
    AND public.is_tenant_member(tenant_id)
);
CREATE POLICY "Consumers viewable by tenant" ON public.api_consumers FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Webhooks isolated by tenant" ON public.webhook_endpoints FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Instances viewable by tenant" ON public.connector_instances FOR ALL USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Jobs viewable by tenant" ON public.integration_jobs FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.connector_instances
        WHERE connector_instances.id = connector_instance_id
            AND public.is_tenant_member(connector_instances.tenant_id)
    )
);
CREATE POLICY "Audit events viewable by tenant members" ON public.audit_events FOR
SELECT USING (public.is_tenant_member(tenant_id));
CREATE POLICY "Audit changes viewable by tenant members" ON public.audit_event_changes FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.audit_events
            WHERE audit_events.id = audit_event_id
                AND public.is_tenant_member(audit_events.tenant_id)
        )
    );
-- 🛡️ Security Blockers (ป้องกัน API เข้าถึงข้อมูล Sensitive)
CREATE POLICY "Block API insert to audit_events" ON public.audit_events FOR
INSERT WITH CHECK (false);
CREATE POLICY "Block API access to Invitations" ON public.user_invitations FOR ALL USING (false);
CREATE POLICY "Block API access to User Sessions" ON public.user_sessions FOR ALL USING (false);
CREATE POLICY "Block API access to API Keys" ON public.api_credentials FOR ALL USING (false);
CREATE POLICY "Block API insert on webhook events" ON public.integration_webhook_events FOR
INSERT WITH CHECK (false);
--=====================================================
--ลบด้วยตอนจะไปใช้จริง
--=====================================================
ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
-- รัน seed ...
-- เพิ่ม constraint กลับถ้าต้องการ
--ALTER TABLE public.users
--ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;