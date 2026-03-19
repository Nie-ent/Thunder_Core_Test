"use client";

import { useState } from "react";

// ============================================================
// SEED DATA MIRROR — ข้อมูลจาก seed_poc.sql
// ============================================================

const TENANTS = [
  { id: "aaaaaaaa-0001", code: "BKK-CITY", name: "กรุงเทพมหานคร", type: "municipal", plan: "enterprise", color: "#003087", accent: "#FFD700" },
  { id: "aaaaaaaa-0002", code: "SCHOOL-01", name: "โรงเรียนสาธิตกรุงเทพ", type: "school", plan: "standard", color: "#1E5C3A", accent: "#FFFFFF" },
  { id: "aaaaaaaa-0003", code: "CORP-ALPHA", name: "บริษัท อัลฟ่า เทคโนโลยี", type: "enterprise", plan: "professional", color: "#6B21A8", accent: "#EC4899" },
];

const USERS = [
  { id: "bbbbbbbb-0001", code: "USR-0001", name: "สมชาย ใจดี", email: "admin@thunder.platform", status: "active", tenants: ["aaaaaaaa-0001"] },
  { id: "bbbbbbbb-0002", code: "USR-0002", name: "วิภา รักไทย", email: "manager.bkk@bkk.go.th", status: "active", tenants: ["aaaaaaaa-0001"] },
  { id: "bbbbbbbb-0003", code: "USR-0003", name: "ประเสริฐ ดีงาม", email: "staff.bkk@bkk.go.th", status: "active", tenants: ["aaaaaaaa-0001"] },
  { id: "bbbbbbbb-0004", code: "USR-0004", name: "นภัสสร ศรีสุวรรณ", email: "teacher@school01.ac.th", status: "active", tenants: ["aaaaaaaa-0002"] },
  { id: "bbbbbbbb-0005", code: "USR-0005", name: "ธีระ นวัตกรรม", email: "dev@alpha-tech.co.th", status: "active", tenants: ["aaaaaaaa-0003"] },
  { id: "bbbbbbbb-0006", code: "USR-0006", name: "สุดา มาใหม่", email: "newuser@bkk.go.th", status: "invited", tenants: ["aaaaaaaa-0001"] },
];

const DEPARTMENTS = [
  { id: "dddddddd-0001", code: "BKK-ROOT", name: "กรุงเทพมหานคร", tenant: "aaaaaaaa-0001", parent: null, isRoot: true },
  { id: "dddddddd-0002", code: "BKK-IT", name: "สำนักยุทธศาสตร์ฯ", tenant: "aaaaaaaa-0001", parent: "dddddddd-0001", isRoot: false },
  { id: "dddddddd-0003", code: "BKK-WORKS", name: "สำนักการโยธา", tenant: "aaaaaaaa-0001", parent: "dddddddd-0001", isRoot: false },
  { id: "dddddddd-0004", code: "BKK-ENV", name: "สำนักสิ่งแวดล้อม", tenant: "aaaaaaaa-0001", parent: "dddddddd-0001", isRoot: false },
  { id: "dddddddd-0005", code: "BKK-IT-DEV", name: "ฝ่ายพัฒนาระบบ", tenant: "aaaaaaaa-0001", parent: "dddddddd-0002", isRoot: false },
];

const LOCATIONS = [
  { id: "eeeeeeee-0001", code: "BKK-HQ", name: "ศาลาว่าการ กทม.", tenant: "aaaaaaaa-0001", type: "headquarters" },
  { id: "eeeeeeee-0002", code: "BKK-ZONE-N", name: "ศูนย์ฝั่งเหนือ", tenant: "aaaaaaaa-0001", type: "zone_office" },
  { id: "eeeeeeee-0003", code: "BKK-ZONE-S", name: "ศูนย์ฝั่งใต้", tenant: "aaaaaaaa-0001", type: "zone_office" },
  { id: "eeeeeeee-0004", code: "SCH-MAIN", name: "อาคารเรียนหลัก", tenant: "aaaaaaaa-0002", type: "building" },
];

const ROLES = [
  { id: "b0000001", code: "SUPER_ADMIN", name: "Super Administrator", type: "system", tenant: null },
  { id: "b0000002", code: "TENANT_OWNER", name: "Tenant Owner", type: "system", tenant: null },
  { id: "b0000003", code: "TENANT_ADMIN", name: "Tenant Administrator", type: "system", tenant: null },
  { id: "b0000004", code: "MEMBER", name: "General Member", type: "system", tenant: null },
  { id: "b0000005", code: "VIEWER", name: "Read-only Viewer", type: "system", tenant: null },
  { id: "b0000010", code: "BKK_MANAGER", name: "ผู้จัดการสำนัก", type: "custom", tenant: "aaaaaaaa-0001" },
  { id: "b0000011", code: "BKK_TECHNICIAN", name: "ช่างเทคนิค", type: "custom", tenant: "aaaaaaaa-0001" },
  { id: "b0000020", code: "TEACHER", name: "ครูผู้สอน", type: "custom", tenant: "aaaaaaaa-0002" },
  { id: "b0000030", code: "DEVELOPER", name: "นักพัฒนาระบบ", type: "custom", tenant: "aaaaaaaa-0003" },
];

const MEMBERSHIPS = [
  { id: "ee020001", user: "bbbbbbbb-0001", tenant: "aaaaaaaa-0001", dept: "dddddddd-0002", loc: "eeeeeeee-0001", title: "System Administrator", roles: ["b0000001"] },
  { id: "ee020002", user: "bbbbbbbb-0002", tenant: "aaaaaaaa-0001", dept: "dddddddd-0002", loc: "eeeeeeee-0001", title: "ผู้อำนวยการสำนักยุทธศาสตร์", roles: ["b0000003", "b0000010"] },
  { id: "ee020003", user: "bbbbbbbb-0003", tenant: "aaaaaaaa-0001", dept: "dddddddd-0005", loc: "eeeeeeee-0001", title: "นักวิชาการคอมพิวเตอร์", roles: ["b0000004", "b0000011"] },
  { id: "ee020004", user: "bbbbbbbb-0004", tenant: "aaaaaaaa-0002", dept: null, loc: "eeeeeeee-0004", title: "ครูวิชาวิทยาศาสตร์", roles: ["b0000004", "b0000020"] },
  { id: "ee020005", user: "bbbbbbbb-0005", tenant: "aaaaaaaa-0003", dept: null, loc: null, title: "Senior Software Engineer", roles: ["b0000004", "b0000030"] },
  { id: "ee020006", user: "bbbbbbbb-0006", tenant: "aaaaaaaa-0001", dept: null, loc: null, title: "เจ้าหน้าที่", roles: [], status: "invited" },
];

const ASSETS = [
  { id: "a55e0001", name: "Dell PowerEdge R750", type: "Server", serial: "DLSR750-2024-001", tenant: "aaaaaaaa-0001", loc: "eeeeeeee-0001", dept: "dddddddd-0002", cat: "SERVER", status: "active" },
  { id: "a55e0002", name: "HP EliteBook 840 G10", type: "Laptop", serial: "HPEB840-2024-001", tenant: "aaaaaaaa-0001", loc: "eeeeeeee-0001", dept: "dddddddd-0002", cat: "IT_EQUIP", status: "active" },
  { id: "a55e0003", name: "รถบรรทุกขยะ บษ-1234", type: "Vehicle", serial: "TRUCK-BKK-001", tenant: "aaaaaaaa-0001", loc: "eeeeeeee-0002", dept: "dddddddd-0003", cat: "BKK_TRUCK", status: "active" },
  { id: "a55e0004", name: "กล้อง CCTV อาคาร A ชั้น 1", type: "CCTV", serial: "CCTV-BKK-A-001", tenant: "aaaaaaaa-0001", loc: "eeeeeeee-0001", dept: "dddddddd-0004", cat: "IT_EQUIP", status: "maintenance" },
  { id: "a55e0005", name: "Projector Epson EB-2250U", type: "Projector", serial: "EPSON-EB2250-001", tenant: "aaaaaaaa-0002", loc: "eeeeeeee-0004", dept: null, cat: "IT_EQUIP", status: "active" },
];

const DEVICES = [
  { id: "de000001", uid: "CCTV-DEV-BKK-A-001", asset: "a55e0004", tenant: "aaaaaaaa-0001", type: "CCTV_IP", online: false, lastHb: "2 ชั่วโมงที่แล้ว" },
  { id: "de000002", uid: "GPS-TRUCK-BKK-001", asset: "a55e0003", tenant: "aaaaaaaa-0001", type: "GPS_TRACKER", online: true, lastHb: "5 นาทีที่แล้ว" },
  { id: "de000003", uid: "AQS-BKK-HQ-001", asset: null, tenant: "aaaaaaaa-0001", type: "AIR_QUALITY", online: true, lastHb: "1 นาทีที่แล้ว" },
];

const WORK_ORDERS = [
  { id: "c0000001", title: "กล้อง CCTV อาคาร A ขัดข้อง", asset: "a55e0004", tenant: "aaaaaaaa-0001", reporter: "bbbbbbbb-0003", assignee: "bbbbbbbb-0003", priority: "high", status: "in_progress" },
  { id: "c0000002", title: "รถบรรทุกขยะ ซ่อมบำรุงประจำปี", asset: "a55e0003", tenant: "aaaaaaaa-0001", reporter: "bbbbbbbb-0002", assignee: "bbbbbbbb-0003", priority: "medium", status: "open" },
  { id: "c0000003", title: "อัปเกรด RAM Server หลัก", asset: "a55e0001", tenant: "aaaaaaaa-0001", reporter: "bbbbbbbb-0003", assignee: "bbbbbbbb-0003", priority: "low", status: "resolved" },
  { id: "c0000004", title: "โปรเจคเตอร์ห้อง 301 ไม่ติด", asset: "a55e0005", tenant: "aaaaaaaa-0002", reporter: "bbbbbbbb-0004", assignee: null, priority: "high", status: "open" },
];

// ============================================================
// HELPERS
// ============================================================

const getTenant = (id: string) => TENANTS.find((t) => t.id === id);
const getUser = (id: string) => USERS.find((u) => u.id === id);
const getAsset = (id: string) => ASSETS.find((a) => a.id === id);
const getLocation = (id: string) => LOCATIONS.find((l) => l.id === id);
const getDept = (id: string) => DEPARTMENTS.find((d) => d.id === id);
const getRole = (id: string) => ROLES.find((r) => r.id === id);

const statusColor: Record<string, string> = {
  active: "#22c55e",
  invited: "#f59e0b",
  maintenance: "#f97316",
  open: "#3b82f6",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  offline: "#ef4444",
  online: "#22c55e",
};

const priorityColor: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

// ============================================================
// COMPONENTS
// ============================================================

function Badge({ label, color = "#6b7280" }: { label: string; color?: string }) {
  return (
    <span
      style={{
        background: color + "22",
        border: `1px solid ${color}44`,
        color: color,
        padding: "1px 7px",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: "monospace",
        fontWeight: 600,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#64748b",
        margin: "0 0 12px 0",
        paddingBottom: 6,
        borderBottom: "1px solid #1e293b",
      }}
    >
      {children}
    </h2>
  );
}

function Card({
  children,
  highlight,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  highlight?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? "#0f172a" : "#080f1a",
        borderTop: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
        borderRight: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
        borderBottom: `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
        borderLeft: highlight ? `3px solid ${highlight}` : `1px solid ${selected ? (highlight || "#334155") : "#1e293b"}`,
        borderRadius: 6,
        padding: "10px 12px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s",
        boxShadow: selected ? `0 0 0 1px ${highlight || "#334155"}33` : "none",
      }}
    >
      {children}
    </div>
  );
}

function TenantPanel({ tenant, selected, onSelect }: { tenant: typeof TENANTS[0]; selected: boolean; onSelect: () => void }) {
  const members = MEMBERSHIPS.filter((m) => m.tenant === tenant.id);
  const assets = ASSETS.filter((a) => a.tenant === tenant.id);
  const wos = WORK_ORDERS.filter((w) => w.tenant === tenant.id);
  const depts = DEPARTMENTS.filter((d) => d.tenant === tenant.id);
  const locs = LOCATIONS.filter((l) => l.tenant === tenant.id);

  return (
    <Card highlight={tenant.color} onClick={onSelect} selected={selected}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: tenant.color, flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{tenant.code}</span>
        <Badge label={tenant.type} color={tenant.color} />
        <Badge label={tenant.plan} color="#6366f1" />
      </div>
      <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 13, color: "#e2e8f0", marginBottom: 8, fontWeight: 600 }}>
        {tenant.name}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Pill icon="👥" count={members.length} label="members" />
        <Pill icon="🏢" count={depts.length} label="depts" />
        <Pill icon="📍" count={locs.length} label="locations" />
        <Pill icon="📦" count={assets.length} label="assets" />
        <Pill icon="🔧" count={wos.length} label="WOs" />
      </div>
    </Card>
  );
}

function Pill({ icon, count, label }: { icon: string; count: number; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, padding: "2px 7px", fontSize: 11, color: "#94a3b8" }}>
      {icon} <strong style={{ color: "#e2e8f0" }}>{count}</strong> {label}
    </span>
  );
}

function UserRow({ membership }: { membership: typeof MEMBERSHIPS[0] }) {
  const user = getUser(membership.user);
  const dept = getDept(membership.dept || "");
  const loc = getLocation(membership.loc || "");
  if (!user) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 0", borderBottom: "1px solid #0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
          {user.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{user.email}</div>
        </div>
        <Badge label={membership.status || user.status} color={statusColor[membership.status || user.status] || "#6b7280"} />
      </div>
      <div style={{ paddingLeft: 36, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {membership.roles.map((rid) => {
          const role = getRole(rid);
          return role ? <Badge key={rid} label={role.code} color={role.type === "system" ? "#6366f1" : "#f59e0b"} /> : null;
        })}
        {dept && <Badge label={dept.code} color="#06b6d4" />}
        {loc && <Badge label={loc.code} color="#8b5cf6" />}
      </div>
    </div>
  );
}

function AssetRow({ asset }: { asset: typeof ASSETS[0] }) {
  const device = DEVICES.find((d) => d.asset === asset.id);
  const loc = getLocation(asset.loc);
  const dept = getDept(asset.dept || "");
  const wos = WORK_ORDERS.filter((w) => w.asset === asset.id);

  return (
    <Card highlight={statusColor[asset.status]}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 18 }}>
          {asset.type === "Server" ? "🖥️" : asset.type === "Laptop" ? "💻" : asset.type === "Vehicle" ? "🚛" : asset.type === "CCTV" ? "📷" : "📽️"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{asset.name}</div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>{asset.serial}</div>
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            <Badge label={asset.status} color={statusColor[asset.status]} />
            {loc && <Badge label={loc.code} color="#8b5cf6" />}
            {dept && <Badge label={dept.code} color="#06b6d4" />}
            {device && (
              <Badge label={`📡 ${device.type}`} color={device.online ? "#22c55e" : "#ef4444"} />
            )}
            {wos.length > 0 && <Badge label={`🔧 ${wos.length} WO`} color="#f59e0b" />}
          </div>
        </div>
      </div>
    </Card>
  );
}

function WorkOrderRow({ wo }: { wo: typeof WORK_ORDERS[0] }) {
  const asset = getAsset(wo.asset);
  const reporter = getUser(wo.reporter);
  const assignee = wo.assignee ? getUser(wo.assignee) : null;

  return (
    <Card highlight={priorityColor[wo.priority]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 12, color: "#e2e8f0", fontWeight: 600, marginBottom: 4 }}>{wo.title}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Badge label={wo.status} color={statusColor[wo.status]} />
            <Badge label={wo.priority} color={priorityColor[wo.priority]} />
            {asset && <Badge label={asset.type} color="#64748b" />}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 12, fontSize: 10, color: "#475569" }}>
        {reporter && <span>📝 {reporter.name.split(" ")[0]}</span>}
        {assignee ? <span>👤 {assignee.name.split(" ")[0]}</span> : <span style={{ color: "#ef4444" }}>👤 ยังไม่มอบหมาย</span>}
      </div>
    </Card>
  );
}

function DeviceRow({ device }: { device: typeof DEVICES[0] }) {
  const asset = getAsset(device.asset || "");
  return (
    <Card highlight={device.online ? "#22c55e" : "#ef4444"}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: device.online ? "#22c55e" : "#ef4444", flexShrink: 0, boxShadow: device.online ? "0 0 6px #22c55e88" : "none" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#e2e8f0" }}>{device.uid}</div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
            {device.type} · {device.lastHb}
          </div>
        </div>
        {asset && <Badge label={asset.type} color="#64748b" />}
      </div>
    </Card>
  );
}

function RolePermTree({ tenantId }: { tenantId: string | null }) {
  const tenant = tenantId ? getTenant(tenantId) : null;
  const filteredRoles = ROLES.filter((r) => r.tenant === tenantId || r.tenant === null);

  const PERMS: Record<string, string[]> = {
    b0000001: ["users:*", "assets:*", "work_orders:*", "reports:*", "audit:read", "notifications:*"],
    b0000003: ["users:read/create/update", "assets:*", "work_orders:*", "reports:*", "audit:read", "notifications:*"],
    b0000004: ["users:read", "assets:read", "work_orders:read/create", "reports:read", "notifications:read"],
    b0000005: ["users:read", "assets:read", "work_orders:read", "reports:read", "notifications:read"],
    b0000010: ["assets:read/create/update", "work_orders:*", "reports:*"],
    b0000011: ["assets:read", "work_orders:read/create"],
    b0000020: ["assets:read", "work_orders:read/create"],
    b0000030: ["assets:read", "work_orders:read/create"],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {filteredRoles.map((role) => (
        <div key={role.id} style={{
          background: "#080f1a",
          border: `1px solid ${role.type === "system" ? "#312e81" : tenant?.color + "44" || "#1e293b"}`,
          borderRadius: 6,
          padding: "8px 10px",
        }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
            <Badge label={role.code} color={role.type === "system" ? "#6366f1" : tenant?.color || "#f59e0b"} />
            <span style={{ fontSize: 10, color: "#475569" }}>{role.name}</span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: 4 }}>
            {(PERMS[role.id] || []).map((p) => (
              <span key={p} style={{ fontSize: 9, fontFamily: "monospace", color: "#22c55e", background: "#022c2266", border: "1px solid #166534", borderRadius: 3, padding: "1px 5px" }}>{p}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeptTree({ tenantId }: { tenantId: string }) {
  const depts = DEPARTMENTS.filter((d) => d.tenant === tenantId);
  const root = depts.find((d) => d.isRoot);
  if (!root) return <div style={{ color: "#475569", fontSize: 12 }}>ไม่มีแผนก</div>;

  function renderNode(id: string, depth: number): React.ReactNode {
    const node = depts.find((d) => d.id === id);
    if (!node) return null;
    const children = depts.filter((d) => d.parent === id);
    const manager = MEMBERSHIPS.find((m) => m.dept === id && m.tenant === tenantId);
    const managerUser = manager ? getUser(manager.user) : null;

    return (
      <div key={id} style={{ marginLeft: depth * 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
          <div style={{ width: 1, height: "100%", background: "#1e293b" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: depth === 0 ? "#f59e0b" : "#334155", flexShrink: 0 }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: depth === 0 ? "#f59e0b" : "#94a3b8" }}>{node.code}</span>
          <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans Thai', sans-serif" }}>{node.name}</span>
          {managerUser && <Badge label={managerUser.name.split(" ")[0]} color="#06b6d4" />}
        </div>
        {children.map((c) => renderNode(c.id, depth + 1))}
      </div>
    );
  }

  return <div>{renderNode(root.id, 0)}</div>;
}

// ============================================================
// MAIN PAGE
// ============================================================

type Tab = "overview" | "users" | "assets" | "devices" | "workorders" | "roles";

export default function SeedMapPage() {
  const [selectedTenant, setSelectedTenant] = useState<string | null>("aaaaaaaa-0001");
  const [tab, setTab] = useState<Tab>("overview");

  const tenant = selectedTenant ? getTenant(selectedTenant) : null;
  const tenantColor = tenant?.color || "#334155";

  const filteredMemberships = MEMBERSHIPS.filter((m) => !selectedTenant || m.tenant === selectedTenant);
  const filteredAssets = ASSETS.filter((a) => !selectedTenant || a.tenant === selectedTenant);
  const filteredDevices = DEVICES.filter((d) => !selectedTenant || d.tenant === selectedTenant);
  const filteredWOs = WORK_ORDERS.filter((w) => !selectedTenant || w.tenant === selectedTenant);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◎" },
    { id: "users", label: "Users & Roles", icon: "👥" },
    { id: "assets", label: "Assets", icon: "📦" },
    { id: "devices", label: "Devices", icon: "📡" },
    { id: "workorders", label: "Work Orders", icon: "🔧" },
    { id: "roles", label: "Permissions", icon: "🔑" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #0f172a",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        background: "#030712cc",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#475569", textTransform: "uppercase" }}>Thunder Platform</div>
          <div style={{ fontSize: 16, color: "#e2e8f0", fontWeight: 700 }}>Seed Data Map</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#475569" }}>Tenant:</span>
          {TENANTS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTenant(selectedTenant === t.id ? null : t.id)}
              style={{
                background: selectedTenant === t.id ? t.color + "22" : "#0f172a",
                border: `1px solid ${selectedTenant === t.id ? t.color : "#1e293b"}`,
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 11,
                color: selectedTenant === t.id ? t.color : "#64748b",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {t.code}
            </button>
          ))}
          <button
            onClick={() => setSelectedTenant(null)}
            style={{
              background: !selectedTenant ? "#1e293b" : "#0f172a",
              border: `1px solid ${!selectedTenant ? "#475569" : "#1e293b"}`,
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 11,
              color: !selectedTenant ? "#e2e8f0" : "#475569",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            ALL
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #0f172a", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? (tenantColor + "18") : "transparent",
                border: `1px solid ${tab === t.id ? tenantColor + "44" : "transparent"}`,
                borderRadius: 5,
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: tab === t.id ? "#e2e8f0" : "#475569",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "monospace",
                transition: "all 0.1s",
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div style={{ marginTop: 24 }}>
            <SectionTitle>Legend</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { color: "#22c55e", label: "active / online / resolved" },
                { color: "#f59e0b", label: "invited / in_progress" },
                { color: "#ef4444", label: "maintenance / offline / high" },
                { color: "#6366f1", label: "system roles" },
                { color: "#f59e0b", label: "custom roles" },
                { color: "#06b6d4", label: "departments" },
                { color: "#8b5cf6", label: "locations" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#475569", lineHeight: 1.3 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionTitle>Stats</SectionTitle>
            {[
              ["Tenants", TENANTS.length],
              ["Users", USERS.length],
              ["Departments", DEPARTMENTS.length],
              ["Locations", LOCATIONS.length],
              ["Assets", ASSETS.length],
              ["Devices", DEVICES.length],
              ["Work Orders", WORK_ORDERS.length],
              ["Roles", ROLES.length],
            ].map(([label, count]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, borderBottom: "1px solid #0a1120" }}>
                <span style={{ color: "#475569" }}>{label}</span>
                <span style={{ color: "#94a3b8", fontWeight: 700 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ padding: 20, overflowY: "auto" }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div>
              <SectionTitle>Tenants</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 24 }}>
                {TENANTS.map((t) => (
                  <TenantPanel key={t.id} tenant={t} selected={selectedTenant === t.id} onSelect={() => setSelectedTenant(selectedTenant === t.id ? null : t.id)} />
                ))}
              </div>

              {selectedTenant && (
                <>
                  <SectionTitle>Department Structure — {tenant?.code}</SectionTitle>
                  <Card>
                    <DeptTree tenantId={selectedTenant} />
                  </Card>

                  <div style={{ marginTop: 20 }}>
                    <SectionTitle>Locations — {tenant?.code}</SectionTitle>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {LOCATIONS.filter((l) => l.tenant === selectedTenant).map((loc) => (
                        <div key={loc.id} style={{ background: "#080f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px" }}>
                          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#8b5cf6" }}>{loc.code}</div>
                          <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 12, color: "#e2e8f0", marginTop: 2 }}>{loc.name}</div>
                          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{loc.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div>
              <SectionTitle>Memberships & Role Assignments {selectedTenant && `— ${tenant?.code}`}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredMemberships.map((m) => {
                  const t = getTenant(m.tenant);
                  return (
                    <div key={m.id} style={{ borderLeft: `3px solid ${t?.color || "#334155"}`, paddingLeft: 10 }}>
                      <UserRow membership={m} />
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
                          {TENANTS.map((t) => (
                            <th key={t.id} style={{ padding: "6px 12px", borderBottom: "1px solid #1e293b", color: t.color }}>{t.code}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {USERS.map((u) => (
                          <tr key={u.id} style={{ borderBottom: "1px solid #0a1120" }}>
                            <td style={{ padding: "6px 12px", color: "#94a3b8", fontFamily: "'Noto Sans Thai', sans-serif" }}>{u.name}</td>
                            {TENANTS.map((t) => {
                              const mem = MEMBERSHIPS.find((m) => m.user === u.id && m.tenant === t.id);
                              return (
                                <td key={t.id} style={{ padding: "6px 12px", textAlign: "center" }}>
                                  {mem ? (
                                    <span style={{ color: t.color }}>✓</span>
                                  ) : (
                                    <span style={{ color: "#1e293b" }}>—</span>
                                  )}
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
          )}

          {/* ASSETS */}
          {tab === "assets" && (
            <div>
              <SectionTitle>Assets {selectedTenant && `— ${tenant?.code}`} ({filteredAssets.length})</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 8 }}>
                {filteredAssets.map((a) => (
                  <AssetRow key={a.id} asset={a} />
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <SectionTitle>Asset → Location → Department Map</SectionTitle>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, fontFamily: "monospace" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        {["Asset", "Type", "Serial", "Location", "Department", "Status", "Device"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: "#475569" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((a) => {
                        const loc = getLocation(a.loc);
                        const dept = getDept(a.dept || "");
                        const device = DEVICES.find((d) => d.asset === a.id);
                        return (
                          <tr key={a.id} style={{ borderBottom: "1px solid #0a1120" }}>
                            <td style={{ padding: "6px 10px", color: "#e2e8f0", fontFamily: "'Noto Sans Thai', sans-serif", maxWidth: 160 }}>{a.name}</td>
                            <td style={{ padding: "6px 10px", color: "#64748b" }}>{a.type}</td>
                            <td style={{ padding: "6px 10px", color: "#475569" }}>{a.serial}</td>
                            <td style={{ padding: "6px 10px" }}>{loc ? <Badge label={loc.code} color="#8b5cf6" /> : "—"}</td>
                            <td style={{ padding: "6px 10px" }}>{dept ? <Badge label={dept.code} color="#06b6d4" /> : "—"}</td>
                            <td style={{ padding: "6px 10px" }}><Badge label={a.status} color={statusColor[a.status]} /></td>
                            <td style={{ padding: "6px 10px" }}>
                              {device ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: device.online ? "#22c55e" : "#ef4444" }} />
                                  <span style={{ fontSize: 10, color: "#64748b" }}>{device.type}</span>
                                </div>
                              ) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DEVICES */}
          {tab === "devices" && (
            <div>
              <SectionTitle>Devices & Telemetry {selectedTenant && `— ${tenant?.code}`}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredDevices.map((d) => (
                  <DeviceRow key={d.id} device={d} />
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionTitle>Live Telemetry</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                  <Card highlight="#22c55e">
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>GPS-TRUCK-BKK-001 · live</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {[["lat", "13.7805"], ["lng", "100.5012"], ["speed", "45 km/h"], ["fuel", "72%"]].map(([k, v]) => (
                        <div key={k} style={{ background: "#030712", borderRadius: 4, padding: "4px 8px" }}>
                          <div style={{ fontSize: 9, color: "#475569" }}>{k}</div>
                          <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card highlight="#22c55e">
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>AQS-BKK-HQ-001 · live</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {[["PM2.5", "38.2"], ["PM10", "55.1"], ["CO₂", "412 ppm"], ["AQI", "87"], ["temp", "31.5°C"], ["humidity", "68%"]].map(([k, v]) => (
                        <div key={k} style={{ background: "#030712", borderRadius: 4, padding: "4px 8px" }}>
                          <div style={{ fontSize: 9, color: "#475569" }}>{k}</div>
                          <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card highlight="#ef4444">
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>CCTV-DEV-BKK-A-001 · offline</div>
                    <div style={{ color: "#ef4444", fontSize: 12 }}>⚠ No heartbeat 2h · Last seen: {new Date().toLocaleDateString("th-TH")}</div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* WORK ORDERS */}
          {tab === "workorders" && (
            <div>
              <SectionTitle>Work Orders {selectedTenant && `— ${tenant?.code}`} ({filteredWOs.length})</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 8 }}>
                {filteredWOs.map((wo) => (
                  <WorkOrderRow key={wo.id} wo={wo} />
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionTitle>Work Order → Asset → User Chain</SectionTitle>
                {filteredWOs.map((wo) => {
                  const asset = getAsset(wo.asset);
                  const reporter = getUser(wo.reporter);
                  const assignee = wo.assignee ? getUser(wo.assignee) : null;
                  const loc = asset ? getLocation(asset.loc) : null;
                  return (
                    <div key={wo.id} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, overflowX: "auto" }}>
                      <div style={{ background: "#080f1a", border: `1px solid ${priorityColor[wo.priority]}44`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: priorityColor[wo.priority], whiteSpace: "nowrap", flexShrink: 0 }}>
                        🔧 {wo.id.slice(-4)} · {wo.priority}
                      </div>
                      <div style={{ width: 20, height: 1, background: "#1e293b", flexShrink: 0 }} />
                      <div style={{ background: "#080f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                        📦 {asset?.name.substring(0, 20)}...
                      </div>
                      <div style={{ width: 20, height: 1, background: "#1e293b", flexShrink: 0 }} />
                      <div style={{ background: "#080f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#8b5cf6", whiteSpace: "nowrap", flexShrink: 0 }}>
                        📍 {loc?.code || "—"}
                      </div>
                      <div style={{ width: 20, height: 1, background: "#1e293b", flexShrink: 0 }} />
                      <div style={{ background: "#080f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#06b6d4", whiteSpace: "nowrap", flexShrink: 0 }}>
                        📝 {reporter?.name.split(" ")[0]}
                      </div>
                      <div style={{ width: 20, height: 1, background: "#1e293b", flexShrink: 0 }} />
                      <div style={{ background: "#080f1a", border: `1px solid ${assignee ? "#1e293b" : "#7f1d1d"}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: assignee ? "#94a3b8" : "#ef4444", whiteSpace: "nowrap", flexShrink: 0 }}>
                        👤 {assignee?.name.split(" ")[0] || "ไม่มีผู้รับผิดชอบ"}
                      </div>
                      <div style={{ width: 20, height: 1, background: "#1e293b", flexShrink: 0 }} />
                      <Badge label={wo.status} color={statusColor[wo.status]} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ROLES & PERMISSIONS */}
          {tab === "roles" && (
            <div>
              <SectionTitle>Role → Permission Map {selectedTenant ? `— ${tenant?.code} (+ system roles)` : "— All"}</SectionTitle>
              <RolePermTree tenantId={selectedTenant} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}