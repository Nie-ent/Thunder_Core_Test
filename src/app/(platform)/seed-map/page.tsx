"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================

interface Tenant {
    id: string; tenant_code: string; name: string; tenant_type: string;
    status: string; subscription_plan: string; timezone: string; owner_user_id: string | null;
}
interface User {
    id: string; global_user_code: string | null; email: string;
    first_name: string | null; last_name: string | null; display_name: string | null;
    status: string; is_email_verified: boolean; last_login_at: string | null;
}
interface Department {
    id: string; tenant_id: string; parent_department_id: string | null;
    code: string; name: string; department_type: string | null;
    status: string; is_root: boolean; manager_id: string | null;
}
interface Location {
    id: string; tenant_id: string; parent_location_id: string | null;
    code: string; name: string; location_type: string | null;
    latitude: number | null; longitude: number | null; status: string;
}
interface Role {
    id: string; tenant_id: string | null; code: string; name: string;
    role_type: string; role_scope: string; is_system: boolean; is_active: boolean;
}
interface Permission {
    id: string; code: string; resource: string; action: string;
    group_name: string | null; description: string | null;
}
interface Membership {
    id: string; user_id: string; tenant_id: string; employee_code: string | null;
    job_title: string | null; user_type: string; default_department_id: string | null;
    default_location_id: string | null; status: string; joined_at: string | null;
}
interface MembershipRole {
    id: string; membership_id: string; role_id: string;
    assigned_at: string; expires_at: string | null;
}
interface RolePermission {
    id: string; role_id: string; permission_id: string; effect: string;
}
interface Asset {
    id: string; tenant_id: string; location_id: string | null; owner_org_id: string | null;
    asset_category_id: string | null; name: string; serial_number: string | null;
    status: string; purchase_date: string | null; metadata: Record<string, unknown>;
}
interface Device {
    id: string; tenant_id: string; asset_id: string | null; device_type_id: string | null;
    device_uid: string; is_online: boolean; last_heartbeat: string | null;
    firmware_version: string | null; config: Record<string, unknown>;
}
interface Telemetry {
    device_id: string; payload: Record<string, unknown>; recorded_at: string;
}
interface WorkOrder {
    id: string; tenant_id: string; asset_id: string | null; reported_by: string | null;
    assigned_to: string | null; title: string; priority: string; status: string;
    due_date: string | null; resolved_at: string | null; created_at: string;
}
interface WorkOrderTask {
    id: string; work_order_id: string; task_name: string;
    is_completed: boolean; completed_at: string | null;
}
interface NotificationInbox {
    id: string; tenant_id: string; user_id: string; category: string | null;
    severity: string; title: string; is_read: boolean; created_at: string;
}
interface AuditEvent {
    id: string; tenant_id: string | null; actor_type: string; actor_name: string | null;
    event_category: string; event_action: string; event_result: string;
    severity: string; summary: string; event_time: string;
}

interface SeedMapData {
    tenants: Tenant[]; users: User[]; departments: Department[]; locations: Location[];
    roles: Role[]; permissions: Permission[]; memberships: Membership[];
    membershipRoles: MembershipRole[]; rolePermissions: RolePermission[];
    assets: Asset[]; devices: Device[]; telemetry: Telemetry[];
    workOrders: WorkOrder[]; workOrderTasks: WorkOrderTask[];
    notificationInbox: NotificationInbox[]; auditEvents: AuditEvent[];
}

// ============================================================
// CONSTANTS
// ============================================================

const TENANT_COLORS = ["#003087", "#1E5C3A", "#6B21A8", "#b45309", "#0f766e", "#be123c"];

const STATUS_COLOR: Record<string, string> = {
    active: "#22c55e", invited: "#f59e0b", suspended: "#f97316",
    maintenance: "#f97316", open: "#3b82f6", in_progress: "#f59e0b",
    resolved: "#22c55e", archived: "#6b7280", locked: "#ef4444",
};
const PRIORITY_COLOR: Record<string, string> = {
    high: "#ef4444", medium: "#f59e0b", low: "#6b7280", critical: "#dc2626",
};

// ============================================================
// HELPERS
// ============================================================

const userName = (u: User | undefined) =>
    u ? (u.display_name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email) : "—";

const relativeTime = (iso: string | null) => {
    if (!iso) return null;
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} วินาที`;
    if (diff < 3600) return `${Math.floor(diff / 60)} นาที`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมง`;
    return `${Math.floor(diff / 86400)} วัน`;
};

// ============================================================
// UI PRIMITIVES
// ============================================================

function Badge({ label, color = "#6b7280" }: { label: string; color?: string }) {
    return (
        <span style={{
            background: color + "22", border: `1px solid ${color}44`, color,
            padding: "1px 7px", borderRadius: 4, fontSize: 10,
            fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap",
        }}>
            {label}
        </span>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#64748b",
            margin: "0 0 12px 0", paddingBottom: 6, borderBottom: "1px solid #1e293b",
        }}>
            {children}
        </h2>
    );
}

function Card({ children, highlight, onClick, selected }: {
    children: React.ReactNode; highlight?: string; onClick?: () => void; selected?: boolean;
}) {
    return (
        <div onClick={onClick} style={{
            background: selected ? "#0f172a" : "#080f1a",
            borderTop: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
            borderRight: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
            borderBottom: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
            borderLeft: highlight
                ? `3px solid ${highlight}`
                : `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
            borderRadius: 6, padding: "10px 12px",
            cursor: onClick ? "pointer" : "default", transition: "all 0.15s",
            boxShadow: selected ? `0 0 0 1px ${highlight || "#334155"}33` : "none",
        }}>
            {children}
        </div>
    );
}

function Pill({ icon, count, label }: { icon: string; count: number; label: string }) {
    return (
        <span style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: 4, padding: "2px 7px", fontSize: 11, color: "#94a3b8",
        }}>
            {icon} <strong style={{ color: "#e2e8f0" }}>{count}</strong> {label}
        </span>
    );
}

function Skeleton({ height = 80 }: { height?: number }) {
    return (
        <div style={{
            width: "100%", height, background: "linear-gradient(90deg,#0f172a 25%,#1e293b 50%,#0f172a 75%)",
            backgroundSize: "200% 100%", borderRadius: 6, animation: "shimmer 1.5s infinite",
        }} />
    );
}

// ============================================================
// TAB: OVERVIEW
// ============================================================

function OverviewTab({ data, selectedTenant, tenantColorMap }: {
    data: SeedMapData; selectedTenant: string | null; tenantColorMap: Record<string, string>;
}) {
    return (
        <div>
            <SectionTitle>Tenants ({data.tenants.length})</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10, marginBottom: 24 }}>
                {data.tenants.map((t) => {
                    const color = tenantColorMap[t.id];
                    const members = data.memberships.filter((m) => m.tenant_id === t.id);
                    const assets = data.assets.filter((a) => a.tenant_id === t.id);
                    const wos = data.workOrders.filter((w) => w.tenant_id === t.id);
                    const depts = data.departments.filter((d) => d.tenant_id === t.id);
                    const locs = data.locations.filter((l) => l.tenant_id === t.id);
                    return (
                        <Card key={t.id} highlight={color}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{t.tenant_code}</span>
                                <Badge label={t.tenant_type} color={color} />
                                <Badge label={t.subscription_plan} color="#6366f1" />
                                <Badge label={t.status} color={STATUS_COLOR[t.status] || "#6b7280"} />
                            </div>
                            <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 13, color: "#e2e8f0", marginBottom: 8, fontWeight: 600 }}>{t.name}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <Pill icon="👥" count={members.length} label="members" />
                                <Pill icon="🏢" count={depts.length} label="depts" />
                                <Pill icon="📍" count={locs.length} label="locs" />
                                <Pill icon="📦" count={assets.length} label="assets" />
                                <Pill icon="🔧" count={wos.length} label="WOs" />
                            </div>
                        </Card>
                    );
                })}
            </div>

            {selectedTenant && (() => {
                const depts = data.departments.filter((d) => d.tenant_id === selectedTenant);
                const locs = data.locations.filter((l) => l.tenant_id === selectedTenant);

                function renderNode(id: string, depth: number): React.ReactNode {
                    const node = depts.find((d) => d.id === id);
                    if (!node) return null;
                    const children = depts.filter((d) => d.parent_department_id === id);
                    const manager = data.users.find((u) => u.id === node.manager_id);
                    const memberCount = data.memberships.filter((m) => m.default_department_id === id).length;
                    return (
                        <div key={id} style={{ marginLeft: depth * 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid #0a1120" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: depth === 0 ? "#f59e0b" : "#334155", flexShrink: 0 }} />
                                <span style={{ fontFamily: "monospace", fontSize: 11, color: depth === 0 ? "#f59e0b" : "#94a3b8" }}>{node.code}</span>
                                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans Thai',sans-serif" }}>{node.name}</span>
                                {manager && <Badge label={userName(manager).split(" ")[0]} color="#06b6d4" />}
                                {memberCount > 0 && <Badge label={`${memberCount} คน`} color="#6366f1" />}
                            </div>
                            {children.map((c) => renderNode(c.id, depth + 1))}
                        </div>
                    );
                }

                const root = depts.find((d) => d.is_root);

                return (
                    <>
                        <SectionTitle>Department Tree</SectionTitle>
                        <Card>{root ? renderNode(root.id, 0) : <span style={{ color: "#475569", fontSize: 12 }}>ไม่มีแผนก</span>}</Card>

                        <div style={{ marginTop: 20 }}>
                            <SectionTitle>Locations ({locs.length})</SectionTitle>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {locs.map((loc) => (
                                    <div key={loc.id} style={{ background: "#080f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px" }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#8b5cf6" }}>{loc.code}</div>
                                        <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 12, color: "#e2e8f0", marginTop: 2 }}>{loc.name}</div>
                                        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{loc.location_type}</div>
                                        {loc.latitude && (
                                            <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginTop: 2 }}>
                                                {loc.latitude.toFixed(4)}, {loc.longitude?.toFixed(4)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
            })()}
        </div>
    );
}

// ============================================================
// TAB: USERS
// ============================================================

function UsersTab({ data, selectedTenant, tenantColorMap }: {
    data: SeedMapData; selectedTenant: string | null; tenantColorMap: Record<string, string>;
}) {
    const filtered = data.memberships.filter((m) => !selectedTenant || m.tenant_id === selectedTenant);

    const membershipRolesMap: Record<string, Role[]> = {};
    for (const mr of data.membershipRoles) {
        const role = data.roles.find((r) => r.id === mr.role_id);
        if (!role) continue;
        if (!membershipRolesMap[mr.membership_id]) membershipRolesMap[mr.membership_id] = [];
        membershipRolesMap[mr.membership_id].push(role);
    }

    return (
        <div>
            <SectionTitle>Memberships ({filtered.length})</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filtered.map((m) => {
                    const user = data.users.find((u) => u.id === m.user_id);
                    const tenant = data.tenants.find((t) => t.id === m.tenant_id);
                    const dept = data.departments.find((d) => d.id === m.default_department_id);
                    const loc = data.locations.find((l) => l.id === m.default_location_id);
                    const roles = membershipRolesMap[m.id] || [];
                    const color = tenantColorMap[m.tenant_id] || "#334155";

                    return (
                        <div key={m.id} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 0", borderBottom: "1px solid #0f172a" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                                        {userName(user)[0] || "?"}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{userName(user)}</div>
                                        <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{user?.email}</div>
                                        {m.job_title && <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans Thai',sans-serif" }}>{m.job_title}</div>}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
                                        <Badge label={m.status} color={STATUS_COLOR[m.status] || "#6b7280"} />
                                        {tenant && <Badge label={tenant.tenant_code} color={color} />}
                                    </div>
                                </div>
                                <div style={{ paddingLeft: 36, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {roles.map((role) => <Badge key={role.id} label={role.code} color={role.is_system ? "#6366f1" : "#f59e0b"} />)}
                                    {dept && <Badge label={dept.code} color="#06b6d4" />}
                                    {loc && <Badge label={loc.code} color="#8b5cf6" />}
                                    {m.employee_code && <Badge label={m.employee_code} color="#334155" />}
                                    {m.joined_at && (
                                        <span style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", alignSelf: "center" }}>
                                            joined {relativeTime(m.joined_at)} ago
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!selectedTenant && (
                <div style={{ marginTop: 20 }}>
                    <SectionTitle>User ↔ Tenant Matrix</SectionTitle>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, fontFamily: "monospace" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "6px 12px", borderBottom: "1px solid #1e293b", color: "#475569" }}>User</th>
                                    {data.tenants.map((t, i) => (
                                        <th key={t.id} style={{ padding: "6px 12px", borderBottom: "1px solid #1e293b", color: TENANT_COLORS[i % TENANT_COLORS.length] }}>{t.tenant_code}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: "1px solid #0a1120" }}>
                                        <td style={{ padding: "6px 12px", color: "#94a3b8", fontFamily: "'Noto Sans Thai',sans-serif" }}>{userName(u)}</td>
                                        {data.tenants.map((t, i) => {
                                            const mem = data.memberships.find((m) => m.user_id === u.id && m.tenant_id === t.id);
                                            return (
                                                <td key={t.id} style={{ padding: "6px 12px", textAlign: "center" }}>
                                                    {mem ? <span style={{ color: TENANT_COLORS[i % TENANT_COLORS.length] }}>✓</span> : <span style={{ color: "#1e293b" }}>—</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// TAB: ASSETS
// ============================================================

function AssetsTab({ data, selectedTenant }: { data: SeedMapData; selectedTenant: string | null }) {
    const filtered = data.assets.filter((a) => !selectedTenant || a.tenant_id === selectedTenant);

    return (
        <div>
            <SectionTitle>Assets ({filtered.length})</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 8, marginBottom: 24 }}>
                {filtered.map((asset) => {
                    const device = data.devices.find((d) => d.asset_id === asset.id);
                    const loc = data.locations.find((l) => l.id === asset.location_id);
                    const dept = data.departments.find((d) => d.id === asset.owner_org_id);
                    const wos = data.workOrders.filter((w) => w.asset_id === asset.id);
                    const telemetry = device ? data.telemetry.find((t) => t.device_id === device.id) : null;
                    const n = asset.name.toLowerCase();
                    const icon = n.includes("server") ? "🖥️"
                        : n.includes("laptop") || n.includes("elitebook") ? "💻"
                            : n.includes("รถ") || n.includes("truck") ? "🚛"
                                : n.includes("cctv") || n.includes("กล้อง") ? "📷"
                                    : n.includes("projector") || n.includes("epson") ? "📽️" : "📦";

                    return (
                        <Card key={asset.id} highlight={STATUS_COLOR[asset.status]}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <div style={{ fontSize: 20 }}>{icon}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{asset.name}</div>
                                    <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>{asset.serial_number}</div>
                                    <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                        <Badge label={asset.status} color={STATUS_COLOR[asset.status] || "#6b7280"} />
                                        {loc && <Badge label={loc.code} color="#8b5cf6" />}
                                        {dept && <Badge label={dept.code} color="#06b6d4" />}
                                        {device && <Badge label={`📡 ${device.is_online ? "online" : "offline"}`} color={device.is_online ? "#22c55e" : "#ef4444"} />}
                                        {wos.length > 0 && <Badge label={`🔧 ${wos.length} WO`} color="#f59e0b" />}
                                        {asset.purchase_date && <Badge label={new Date(asset.purchase_date).getFullYear().toString()} color="#334155" />}
                                    </div>
                                    {telemetry && (
                                        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {Object.entries(telemetry.payload).slice(0, 3).map(([k, v]) => (
                                                <span key={k} style={{ fontSize: 9, fontFamily: "monospace", color: "#22c55e", background: "#022c2266", border: "1px solid #166834", borderRadius: 3, padding: "1px 5px" }}>
                                                    {k}: {String(v)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <SectionTitle>Asset Chain Table</SectionTitle>
            <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, fontFamily: "monospace" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #1e293b" }}>
                            {["Asset", "Serial", "Location", "Department", "Status", "Device", "WOs"].map((h) => (
                                <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: "#475569" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((a) => {
                            const loc = data.locations.find((l) => l.id === a.location_id);
                            const dept = data.departments.find((d) => d.id === a.owner_org_id);
                            const device = data.devices.find((d) => d.asset_id === a.id);
                            const wos = data.workOrders.filter((w) => w.asset_id === a.id);
                            return (
                                <tr key={a.id} style={{ borderBottom: "1px solid #0a1120" }}>
                                    <td style={{ padding: "6px 10px", color: "#e2e8f0", fontFamily: "'Noto Sans Thai',sans-serif", maxWidth: 160 }}>{a.name}</td>
                                    <td style={{ padding: "6px 10px", color: "#475569" }}>{a.serial_number || "—"}</td>
                                    <td style={{ padding: "6px 10px" }}>{loc ? <Badge label={loc.code} color="#8b5cf6" /> : "—"}</td>
                                    <td style={{ padding: "6px 10px" }}>{dept ? <Badge label={dept.code} color="#06b6d4" /> : "—"}</td>
                                    <td style={{ padding: "6px 10px" }}><Badge label={a.status} color={STATUS_COLOR[a.status] || "#6b7280"} /></td>
                                    <td style={{ padding: "6px 10px" }}>
                                        {device ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: device.is_online ? "#22c55e" : "#ef4444" }} />
                                                <span style={{ fontSize: 10, color: "#64748b" }}>{device.device_uid}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                    <td style={{ padding: "6px 10px", color: wos.length > 0 ? "#f59e0b" : "#334155" }}>{wos.length}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============================================================
// TAB: DEVICES
// ============================================================

function DevicesTab({ data, selectedTenant }: { data: SeedMapData; selectedTenant: string | null }) {
    const filtered = data.devices.filter((d) => !selectedTenant || d.tenant_id === selectedTenant);

    return (
        <div>
            <SectionTitle>Devices ({filtered.length})</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((device) => {
                    const asset = data.assets.find((a) => a.id === device.asset_id);
                    const telemetry = data.telemetry.find((t) => t.device_id === device.id);
                    return (
                        <Card key={device.id} highlight={device.is_online ? "#22c55e" : "#ef4444"}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: device.is_online ? "#22c55e" : "#ef4444", flexShrink: 0, marginTop: 4, boxShadow: device.is_online ? "0 0 6px #22c55e88" : "none" }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0" }}>{device.device_uid}</span>
                                        <Badge label={device.is_online ? "online" : "offline"} color={device.is_online ? "#22c55e" : "#ef4444"} />
                                        {asset && <Badge label={asset.name.substring(0, 20)} color="#64748b" />}
                                        {device.firmware_version && <Badge label={`fw: ${device.firmware_version}`} color="#334155" />}
                                    </div>
                                    {device.last_heartbeat && (
                                        <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>
                                            Last heartbeat: {relativeTime(device.last_heartbeat)} ago · {new Date(device.last_heartbeat).toLocaleString("th-TH")}
                                        </div>
                                    )}
                                    {telemetry && (
                                        <div style={{ marginTop: 8 }}>
                                            <div style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>Telemetry · {relativeTime(telemetry.recorded_at)} ago</div>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 4 }}>
                                                {Object.entries(telemetry.payload).map(([k, v]) => (
                                                    <div key={k} style={{ background: "#030712", borderRadius: 4, padding: "4px 8px" }}>
                                                        <div style={{ fontSize: 9, color: "#475569" }}>{k}</div>
                                                        <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>{String(v)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// TAB: WORK ORDERS
// ============================================================

function WorkOrdersTab({ data, selectedTenant }: { data: SeedMapData; selectedTenant: string | null }) {
    const filtered = data.workOrders.filter((w) => !selectedTenant || w.tenant_id === selectedTenant);

    return (
        <div>
            <SectionTitle>Work Orders ({filtered.length})</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 8, marginBottom: 24 }}>
                {filtered.map((wo) => {
                    const asset = data.assets.find((a) => a.id === wo.asset_id);
                    const reporter = data.users.find((u) => u.id === wo.reported_by);
                    const assignee = data.users.find((u) => u.id === wo.assigned_to);
                    const tasks = data.workOrderTasks.filter((t) => t.work_order_id === wo.id);
                    const done = tasks.filter((t) => t.is_completed).length;
                    const overdue = wo.due_date && new Date(wo.due_date) < new Date() && wo.status !== "resolved";

                    return (
                        <Card key={wo.id} highlight={PRIORITY_COLOR[wo.priority]}>
                            <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600, marginBottom: 6 }}>{wo.title}</div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                                <Badge label={wo.status} color={STATUS_COLOR[wo.status] || "#6b7280"} />
                                <Badge label={wo.priority} color={PRIORITY_COLOR[wo.priority]} />
                                {asset && <Badge label={asset.name.substring(0, 15)} color="#64748b" />}
                                {overdue && <Badge label="OVERDUE" color="#dc2626" />}
                            </div>
                            {tasks.length > 0 && (
                                <div style={{ marginBottom: 6 }}>
                                    <div style={{ height: 3, background: "#0f172a", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{ width: `${(done / tasks.length) * 100}%`, height: "100%", background: "#22c55e" }} />
                                    </div>
                                    <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{done}/{tasks.length} tasks</div>
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#475569" }}>
                                {reporter && <span>📝 {userName(reporter).split(" ")[0]}</span>}
                                {assignee ? <span>👤 {userName(assignee).split(" ")[0]}</span> : <span style={{ color: "#ef4444" }}>👤 ไม่มีผู้รับ</span>}
                                {wo.due_date && <span style={{ color: overdue ? "#ef4444" : "#475569" }}>📅 {new Date(wo.due_date).toLocaleDateString("th-TH")}</span>}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <SectionTitle>Chain: WO → Asset → Location → Reporter → Assignee</SectionTitle>
            {filtered.map((wo) => {
                const asset = data.assets.find((a) => a.id === wo.asset_id);
                const reporter = data.users.find((u) => u.id === wo.reported_by);
                const assignee = data.users.find((u) => u.id === wo.assigned_to);
                const loc = asset ? data.locations.find((l) => l.id === asset.location_id) : null;
                const nodes = [
                    { label: `🔧 ${wo.priority}`, color: PRIORITY_COLOR[wo.priority] },
                    { label: `📦 ${(asset?.name || "—").substring(0, 16)}`, color: "#64748b" },
                    { label: `📍 ${loc?.code || "—"}`, color: "#8b5cf6" },
                    { label: `📝 ${reporter ? userName(reporter).split(" ")[0] : "—"}`, color: "#06b6d4" },
                    { label: assignee ? `👤 ${userName(assignee).split(" ")[0]}` : "👤 ไม่มีผู้รับ", color: assignee ? "#94a3b8" : "#ef4444" },
                    { label: wo.status, color: STATUS_COLOR[wo.status] || "#6b7280" },
                ];

                return (
                    <div key={wo.id} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, overflowX: "auto" }}>
                        {nodes.flatMap((node, idx) => [
                            <div key={`n${idx}`} style={{ background: "#080f1a", border: `1px solid ${node.color}44`, borderRadius: 6, padding: "5px 9px", fontSize: 11, color: node.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                                {node.label}
                            </div>,
                            idx < nodes.length - 1 ? <div key={`a${idx}`} style={{ width: 16, height: 1, background: "#1e293b", flexShrink: 0 }} /> : null,
                        ])}
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// TAB: ROLES & PERMISSIONS
// ============================================================

function RolesTab({ data, selectedTenant, tenantColorMap }: {
    data: SeedMapData; selectedTenant: string | null; tenantColorMap: Record<string, string>;
}) {
    const filtered = data.roles.filter((r) => !selectedTenant || r.tenant_id === selectedTenant || r.tenant_id === null);

    const rolePermsMap: Record<string, Permission[]> = {};
    for (const rp of data.rolePermissions) {
        const perm = data.permissions.find((p) => p.id === rp.permission_id);
        if (!perm) continue;
        if (!rolePermsMap[rp.role_id]) rolePermsMap[rp.role_id] = [];
        rolePermsMap[rp.role_id].push(perm);
    }

    return (
        <div>
            <SectionTitle>Roles ({filtered.length}) · Permissions ({data.permissions.length})</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((role) => {
                    const perms = rolePermsMap[role.id] || [];
                    const color = role.is_system ? "#6366f1" : (role.tenant_id ? tenantColorMap[role.tenant_id] : "#f59e0b") || "#f59e0b";
                    const tenant = role.tenant_id ? data.tenants.find((t) => t.id === role.tenant_id) : null;

                    // Group by resource
                    const grouped: Record<string, string[]> = {};
                    for (const p of perms) {
                        if (!grouped[p.resource]) grouped[p.resource] = [];
                        grouped[p.resource].push(p.action);
                    }

                    return (
                        <div key={role.id} style={{ background: "#080f1a", border: `1px solid ${color}33`, borderRadius: 6, padding: "10px 12px" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                                <Badge label={role.code} color={color} />
                                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans Thai',sans-serif" }}>{role.name}</span>
                                <Badge label={role.is_system ? "system" : "custom"} color={role.is_system ? "#6366f1" : "#f59e0b"} />
                                {tenant && <Badge label={tenant.tenant_code} color={color} />}
                                <Badge label={`${perms.length} perms`} color="#334155" />
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 4 }}>
                                {Object.keys(grouped).length > 0
                                    ? Object.entries(grouped).map(([resource, actions]) => (
                                        <span key={resource} style={{ fontSize: 9, fontFamily: "monospace", color: "#22c55e", background: "#022c2266", border: "1px solid #166834", borderRadius: 3, padding: "2px 6px" }}>
                                            {resource}: {actions.join(", ")}
                                        </span>
                                    ))
                                    : <span style={{ fontSize: 10, color: "#334155" }}>ยังไม่มี permissions</span>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// TAB: AUDIT LOG
// ============================================================

function AuditTab({ data, selectedTenant }: { data: SeedMapData; selectedTenant: string | null }) {
    const filtered = data.auditEvents.filter((e) => !selectedTenant || e.tenant_id === selectedTenant);
    const SEV: Record<string, string> = { info: "#3b82f6", warning: "#f59e0b", error: "#ef4444", critical: "#dc2626" };

    return (
        <div>
            <SectionTitle>Audit Events ({filtered.length} recent)</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {filtered.map((event) => (
                    <div key={event.id} style={{ background: "#080f1a", border: `1px solid ${SEV[event.severity] || "#1e293b"}22`, borderRadius: 6, padding: "8px 12px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                            <Badge label={event.severity} color={SEV[event.severity] || "#6b7280"} />
                            <Badge label={event.event_category} color="#6366f1" />
                            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#64748b" }}>{event.event_action}</span>
                            <Badge label={event.event_result} color={event.event_result === "success" ? "#22c55e" : "#ef4444"} />
                            <span style={{ fontSize: 9, color: "#334155", marginLeft: "auto" }}>{relativeTime(event.event_time)} ago</span>
                        </div>
                        <div style={{ fontFamily: "'Noto Sans Thai',sans-serif", fontSize: 11, color: "#94a3b8" }}>{event.summary}</div>
                        {event.actor_name && <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>by {event.actor_name} ({event.actor_type})</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================
// ROOT PAGE
// ============================================================

type Tab = "overview" | "users" | "assets" | "devices" | "workorders" | "roles" | "audit";

export default function SeedMapPage() {
    const [data, setData] = useState<SeedMapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>("overview");
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/seed-map");
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
            const json: SeedMapData = await res.json();
            setData(json);
            setLastFetched(new Date());
            setSelectedTenant((prev) => prev ?? json.tenants?.[0]?.id ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const tenantColorMap = data
        ? Object.fromEntries(data.tenants.map((t, i) => [t.id, TENANT_COLORS[i % TENANT_COLORS.length]]))
        : {} as Record<string, string>;

    const tenantColor = selectedTenant ? (tenantColorMap[selectedTenant] || "#334155") : "#334155";

    const TABS: { id: Tab; label: string; icon: string; count?: number }[] = [
        { id: "overview", label: "Overview", icon: "◎" },
        { id: "users", label: "Users & Roles", icon: "👥", count: data?.memberships.length },
        { id: "assets", label: "Assets", icon: "📦", count: data?.assets.length },
        { id: "devices", label: "Devices", icon: "📡", count: data?.devices.length },
        { id: "workorders", label: "Work Orders", icon: "🔧", count: data?.workOrders.length },
        { id: "roles", label: "Permissions", icon: "🔑", count: data?.roles.length },
        { id: "audit", label: "Audit Log", icon: "📋", count: data?.auditEvents.length },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+Thai:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030712; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        button { font-family: inherit; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: "'DM Mono',monospace" }}>

                {/* ── Header ── */}
                <div style={{ borderBottom: "1px solid #0f172a", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, background: "#030712dd", backdropFilter: "blur(10px)", zIndex: 100, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#475569", textTransform: "uppercase" }}>Thunder Platform</div>
                        <div style={{ fontSize: 15, color: "#e2e8f0", fontWeight: 700 }}>Seed Data Map</div>
                    </div>

                    <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        {data && (
                            <>
                                <span style={{ fontSize: 10, color: "#475569" }}>Tenant:</span>
                                {data.tenants.map((t) => (
                                    <button key={t.id} onClick={() => setSelectedTenant(selectedTenant === t.id ? null : t.id)}
                                        style={{ background: selectedTenant === t.id ? tenantColorMap[t.id] + "22" : "#0f172a", border: `1px solid ${selectedTenant === t.id ? tenantColorMap[t.id] : "#1e293b"}`, borderRadius: 4, padding: "3px 10px", fontSize: 11, color: selectedTenant === t.id ? tenantColorMap[t.id] : "#64748b", cursor: "pointer" }}>
                                        {t.tenant_code}
                                    </button>
                                ))}
                                <button onClick={() => setSelectedTenant(null)}
                                    style={{ background: !selectedTenant ? "#1e293b" : "#0f172a", border: `1px solid ${!selectedTenant ? "#475569" : "#1e293b"}`, borderRadius: 4, padding: "3px 10px", fontSize: 11, color: !selectedTenant ? "#e2e8f0" : "#475569", cursor: "pointer" }}>
                                    ALL
                                </button>
                            </>
                        )}
                        <button onClick={fetchData} disabled={loading}
                            style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: loading ? "#334155" : "#64748b", cursor: loading ? "not-allowed" : "pointer" }}>
                            {loading ? "⟳" : "↺"} Refresh
                        </button>
                        {lastFetched && <span style={{ fontSize: 9, color: "#334155" }}>{lastFetched.toLocaleTimeString("th-TH")}</span>}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "calc(100vh - 53px)" }}>

                    {/* ── Sidebar ── */}
                    <div style={{ borderRight: "1px solid #0f172a", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
                        {TABS.map((t) => (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                style={{ background: tab === t.id ? tenantColor + "18" : "transparent", border: `1px solid ${tab === t.id ? tenantColor + "44" : "transparent"}`, borderRadius: 5, padding: "7px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, fontSize: 12, color: tab === t.id ? "#e2e8f0" : "#475569", cursor: "pointer", textAlign: "left", transition: "all 0.1s" }}>
                                <span style={{ display: "flex", gap: 6, alignItems: "center" }}><span>{t.icon}</span>{t.label}</span>
                                {t.count !== undefined && (
                                    <span style={{ fontSize: 10, background: "#0f172a", borderRadius: 3, padding: "1px 5px", color: "#334155" }}>{t.count}</span>
                                )}
                            </button>
                        ))}

                        {data && (
                            <div style={{ marginTop: 20 }}>
                                <SectionTitle>Quick Stats</SectionTitle>
                                {([
                                    ["Tenants", data.tenants.length],
                                    ["Users", data.users.length],
                                    ["Roles", data.roles.length],
                                    ["Permissions", data.permissions.length],
                                    ["Assets", data.assets.length],
                                    ["Devices", data.devices.length],
                                    ["Work Orders", data.workOrders.length],
                                    ["Notifications", data.notificationInbox.length],
                                    ["Audit Events", data.auditEvents.length],
                                ] as [string, number][]).map(([label, count]) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 10, borderBottom: "1px solid #0a1120" }}>
                                        <span style={{ color: "#475569" }}>{label}</span>
                                        <span style={{ color: "#94a3b8", fontWeight: 700 }}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Main content ── */}
                    <div style={{ padding: 20, overflowY: "auto" }}>
                        {error && (
                            <div style={{ background: "#450a0a", border: "1px solid #991b1b", borderRadius: 6, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#fca5a5" }}>
                                ⚠ Error: {error}
                            </div>
                        )}

                        {loading && !data && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[1, 2, 3].map((i) => <Skeleton key={i} height={80} />)}
                            </div>
                        )}

                        {data && tab === "overview" && <OverviewTab data={data} selectedTenant={selectedTenant} tenantColorMap={tenantColorMap} />}
                        {data && tab === "users" && <UsersTab data={data} selectedTenant={selectedTenant} tenantColorMap={tenantColorMap} />}
                        {data && tab === "assets" && <AssetsTab data={data} selectedTenant={selectedTenant} />}
                        {data && tab === "devices" && <DevicesTab data={data} selectedTenant={selectedTenant} />}
                        {data && tab === "workorders" && <WorkOrdersTab data={data} selectedTenant={selectedTenant} />}
                        {data && tab === "roles" && <RolesTab data={data} selectedTenant={selectedTenant} tenantColorMap={tenantColorMap} />}
                        {data && tab === "audit" && <AuditTab data={data} selectedTenant={selectedTenant} />}
                    </div>
                </div>
            </div>
        </>
    );
}