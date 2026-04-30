import React, { useState } from "react";

// ── Helpers ────────────────────────────────────────────────
const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)},${a})`;
};

// ── Data ───────────────────────────────────────────────────
const CRITICAL_STRIP = [
  { label: "Critical Issues", value: 3, color: "#ff4060" },
  { label: "Degraded Services", value: 2, color: "#ffaa00" },
  { label: "Needs Review", value: 14, color: "#a855f7" },
  { label: "Pending Reports", value: 17, color: "#ff4090" },
  { label: "Failed Media", value: 7, color: "#ff4060" },
  { label: "Queue Backlog", value: 342, color: "#00d4ff" },
];

const PLATFORM_STATUS = { state: "degraded" as string, message: "Degraded — Media Pipeline Failed, Enrichment Slow", services: { healthy: 6, degraded: 1, failed: 1 } };

const METRICS_PRIMARY = [
  { label: "Ingestion Queue", value: "342", delta: "+89 vs yesterday", icon: "📥", color: "#00d4ff" },
  { label: "Failed Jobs", value: "23", delta: "+3 today", icon: "⚠️", color: "#ff4060" },
  { label: "Reports Pending", value: "17", delta: "+5 urgent", icon: "🚩", color: "#ff4090" },
  { label: "AI Jobs Running", value: "8", delta: "2 batch queued", icon: "🤖", color: "#a855f7" },
];

const METRICS_SECONDARY = [
  { label: "Total Releases", value: "14,829", delta: "+124" },
  { label: "Total Characters", value: "89,412", delta: "+891" },
  { label: "Total Users", value: "3,241", delta: "+18" },
  { label: "Active Listings", value: "6,712", delta: "+47" },
];

const SERVICES = [
  { name: "Catalog Collector", status: "healthy", latency: "12ms", uptime: "99.98%", lastIncident: "14d ago" },
  { name: "Importer", status: "healthy", latency: "45ms", uptime: "99.95%", lastIncident: "3d ago" },
  { name: "Enrichment Service", status: "degraded", latency: "890ms", uptime: "97.2%", lastIncident: "now" },
  { name: "AI Orchestrator", status: "healthy", latency: "120ms", uptime: "99.9%", lastIncident: "7d ago" },
  { name: "Market Collector", status: "healthy", latency: "67ms", uptime: "99.99%", lastIncident: "30d ago" },
  { name: "Media Pipeline", status: "failed", latency: "—", uptime: "—", lastIncident: "now" },
  { name: "Public API", status: "healthy", latency: "23ms", uptime: "99.99%", lastIncident: "21d ago" },
  { name: "Database", status: "healthy", latency: "3ms", uptime: "100%", lastIncident: "none" },
];

const SOURCES = [
  { name: "Mattel", status: "healthy", lastSync: "2m ago" },
  { name: "partner-api", status: "degraded", lastSync: "18m ago" },
  { name: "vinyl-hub", status: "paused", lastSync: "2h ago" },
  { name: "discogs-feed", status: "healthy", lastSync: "5m ago" },
  { name: "hasbro-cdn", status: "failed", lastSync: "—" },
];

const ALERTS = [
  { title: "Media Pipeline Down", count: 7, sev: "critical", cta: "Open Media Admin" },
  { title: "Source Auth Failures", count: 3, sev: "critical", cta: "Open Sources" },
  { title: "Failed Ingestion Items", count: 23, sev: "critical", cta: "Open Ingestion Admin" },
  { title: "AI Low Confidence", count: 42, sev: "warning", cta: "Open AI Review" },
  { title: "Manual Review Required", count: 14, sev: "warning", cta: "Review Duplicates" },
  { title: "Duplicates Unresolved", count: 89, sev: "warning", cta: "Open Duplicates" },
  { title: "Reports Pending", count: 17, sev: "info", cta: "Open Moderation" },
];

const ATTENTION_QUEUE = [
  { title: "Investigate media pipeline failure", sev: "critical", domain: "Media", icon: "🔴" },
  { title: "Review 14 low-confidence AI enrichments", sev: "warning", domain: "AI Review", icon: "🟡" },
  { title: "Resolve duplicate batch #204 (89 items)", sev: "warning", domain: "Catalog", icon: "🟡" },
  { title: "Moderate 5 urgent reports", sev: "critical", domain: "Moderation", icon: "🔴" },
  { title: "Validate 12 ready-to-import items", sev: "info", domain: "Ingestion", icon: "🔵" },
  { title: "Fix hasbro-cdn source auth", sev: "critical", domain: "Ingestion", icon: "🔴" },
];

const DOMAINS = [
  { title: "Ingestion Admin", desc: "Sources, pipelines, queues", pending: 342, health: "warning", lastActivity: "2 min ago", icon: "📥", color: "#00d4ff" },
  { title: "Catalog Admin", desc: "Releases, characters, metadata", pending: 14, health: "healthy", lastActivity: "8 min ago", icon: "📚", color: "#a855f7" },
  { title: "Users Admin", desc: "Accounts, roles, moderation", pending: 5, health: "healthy", lastActivity: "15 min ago", icon: "👥", color: "#00ffb4" },
  { title: "Marketplace Admin", desc: "Listings, transactions, disputes", pending: 31, health: "warning", lastActivity: "22 min ago", icon: "🏪", color: "#ff4090" },
  { title: "Media Admin", desc: "Images, thumbnails, CDN", pending: 7, health: "critical", lastActivity: "now", icon: "🖼️", color: "#ffaa00" },
  { title: "AI Review", desc: "Enrichment, confidence, overrides", pending: 42, health: "warning", lastActivity: "30 min ago", icon: "🤖", color: "#00d4ff" },
  { title: "Moderation", desc: "Reports, flags, bans", pending: 17, health: "critical", lastActivity: "5 min ago", icon: "🛡️", color: "#ff4090" },
  { title: "System Jobs", desc: "Background tasks, cron, retries", pending: 23, health: "healthy", lastActivity: "1 min ago", icon: "⚙️", color: "#a855f7" },
];

const DATA_QUALITY = [
  { label: "Missing metadata", count: 234 },
  { label: "Unresolved duplicates", count: 89 },
  { label: "Releases without images", count: 47 },
  { label: "Releases without MSRP", count: 112 },
  { label: "Low-confidence enrichments", count: 42 },
];

const ACTIVITY = [
  { time: "2 min ago", text: "12 releases imported from Discogs", icon: "📦", actor: "system" },
  { time: "8 min ago", text: "3 duplicate characters merged by AI", icon: "🔗", actor: "system" },
  { time: "15 min ago", text: "User @collector42 flagged for review", icon: "🚩", actor: "admin" },
  { time: "22 min ago", text: "Report #4891 resolved — listing removed", icon: "✅", actor: "admin" },
  { time: "30 min ago", text: "AI enrichment batch #712 accepted", icon: "🤖", actor: "system" },
  { time: "45 min ago", text: "Manual edit: release metadata corrected", icon: "✏️", actor: "admin" },
  { time: "1h ago", text: "Source 'vinyl-hub' paused due to errors", icon: "⏸️", actor: "system" },
];

const COMMANDS_SAFE = ["Validate Imports", "Open Duplicates", "Refresh Pipelines"];
const COMMANDS_DANGER = ["Retry Failed Ingestion", "Re-run Enrichment Batch", "Pause Source"];

// ── Component ──────────────────────────────────────────────
const MonstrinoAdminV4: React.FC = () => {
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);
  const [showQuick, setShowQuick] = useState(false);
  const [search, setSearch] = useState("");
  const [cmdFlash, setCmdFlash] = useState<string | null>(null);
  const [alertDismissed, setAlertDismissed] = useState<Set<number>>(new Set());
  const [attentionDone, setAttentionDone] = useState<Set<number>>(new Set());
  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const flash = (s: string) => { setCmdFlash(s); setTimeout(() => setCmdFlash(null), 500); };
  const dismissAlert = (i: number) => setAlertDismissed(prev => new Set(prev).add(i));
  const markDone = (i: number) => setAttentionDone(prev => new Set(prev).add(i));
  const visibleAlerts = ALERTS.filter((a, i) => !alertDismissed.has(i) && (alertFilter === "all" || a.sev === alertFilter));
  const visibleAttention = ATTENTION_QUEUE.filter((_, i) => !attentionDone.has(i));
  const criticalCount = ALERTS.filter(a => a.sev === "critical").length;

  const statusColors = { healthy: "#00ff88", degraded: "#ffaa00", failed: "#ff4060", paused: "#888" };
  const sevColors = { critical: "#ff4060", warning: "#ffaa00", info: "#00b4ff" };
  const healthBadge = (h: string) => ({ fontSize: 9, fontWeight: 700 as const, letterSpacing: 0.5, padding: "2px 8px", borderRadius: 6, textTransform: "uppercase" as const, color: statusColors[h as keyof typeof statusColors] || "#888", background: rgba(statusColors[h as keyof typeof statusColors] || "#888", 0.12) });

  const sectionTitle = (text: string, extra?: React.ReactNode): React.CSSProperties => ({ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 } as React.CSSProperties);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 0%, #12102a 0%, #0a0a10 50%, #08080c 100%)", color: "#d0d0e8", fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif", fontSize: 14 }}>

      {/* ═══ HEADER ═══ */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,14,0.9)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #ff4090, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>MONSTRINO</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: "#666", fontWeight: 600 }}>PLATFORM ADMIN</div>
          </div>
          <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#00ffb418", color: "#00ffb4", border: "1px solid #00ffb425", marginLeft: 8 }}>PROD</span>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", width: 360 }}>
          <span style={{ color: "#555", marginRight: 8, fontSize: 13 }}>🔍</span>
          <input style={{ background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 13, width: "100%", fontFamily: "inherit" }} placeholder="Search releases, users, sources, jobs…" value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ fontSize: 10, color: "#444", border: "1px solid #222", padding: "1px 6px", borderRadius: 4, marginLeft: 8, whiteSpace: "nowrap" }}>⌘K</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
            🔔
            {criticalCount > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#ff4060", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{criticalCount}</div>}
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }} onClick={() => setShowQuick(!showQuick)}>⚡</div>
            {showQuick && (
              <div style={{ position: "absolute", top: 44, right: 0, minWidth: 220, background: "rgba(12,12,22,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 8, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
                {["Open Ingestion Admin", "Create Release", "Open Duplicates", "Open Reports", "Open Users Admin"].map((a, i) => (
                  <div key={i} style={{ padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "rgba(255,255,255,0.65)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,85,247,0.1)"; e.currentTarget.style.color = "#c084fc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                  >{a}</div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #ff4090, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>SA</div>
            <div style={{ fontSize: 10, color: "#555" }}>
              <div style={{ fontWeight: 600, color: "#888" }}>Super Admin</div>
              <div>read/write</div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ CRITICAL SUMMARY STRIP ═══ */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 32px", background: "rgba(255,64,96,0.02)", borderBottom: "1px solid rgba(255,64,96,0.06)" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#ff4060", marginRight: 8 }}>⚠ CRITICAL</span>
        {CRITICAL_STRIP.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 8, background: rgba(c.color, 0.04), border: `1px solid ${rgba(c.color, 0.08)}` }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 10, color: rgba(c.color, 0.55) }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* ═══ PLATFORM STATUS BANNER ═══ */}
      <div style={{ margin: "20px 32px 0", padding: "14px 24px", borderRadius: 14, background: PLATFORM_STATUS.state === "healthy" ? rgba("#00ff88", 0.04) : PLATFORM_STATUS.state === "degraded" ? rgba("#ffaa00", 0.04) : rgba("#ff4060", 0.04), border: `1px solid ${PLATFORM_STATUS.state === "healthy" ? rgba("#00ff88", 0.15) : PLATFORM_STATUS.state === "degraded" ? rgba("#ffaa00", 0.15) : rgba("#ff4060", 0.15)}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: statusColors[PLATFORM_STATUS.state], boxShadow: `0 0 12px ${rgba(statusColors[PLATFORM_STATUS.state], 0.5)}` }} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Platform Status: </span>
            <span style={{ fontSize: 14, color: statusColors[PLATFORM_STATUS.state] }}>{PLATFORM_STATUS.message}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "#666" }}>{PLATFORM_STATUS.services.healthy} healthy · {PLATFORM_STATUS.services.degraded} degraded · {PLATFORM_STATUS.services.failed} failed</span>
          <button style={{ padding: "6px 16px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: rgba("#ffaa00", 0.1), color: "#ffaa00", border: `1px solid ${rgba("#ffaa00", 0.2)}`, cursor: "pointer" }}>View Incidents</button>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 28px" }}>

        {/* ═══ METRICS ═══ */}
        <div style={{ padding: "24px 0 0" }}>
          {/* Primary operational metrics */}
          <div style={sectionTitle("ops")}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>OPERATIONAL METRICS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {METRICS_PRIMARY.map((m, i) => (
              <div key={i} onMouseEnter={() => setHoveredMetric(i)} onMouseLeave={() => setHoveredMetric(null)} style={{
                padding: "20px", borderRadius: 16,
                background: hoveredMetric === i ? `linear-gradient(135deg, ${rgba(m.color, 0.08)}, transparent)` : rgba(m.color, 0.02),
                border: `1px solid ${hoveredMetric === i ? rgba(m.color, 0.25) : rgba(m.color, 0.08)}`,
                transition: "all 0.3s ease", transform: hoveredMetric === i ? "translateY(-3px)" : "none",
                boxShadow: hoveredMetric === i ? `0 8px 24px ${rgba(m.color, 0.1)}` : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <span style={{ fontSize: 10, color: m.color, fontWeight: 600, background: rgba(m.color, 0.1), padding: "2px 8px", borderRadius: 8 }}>{m.delta}</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginTop: 10, letterSpacing: -0.5 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
          {/* Secondary totals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 10 }}>
            {METRICS_SECONDARY.map((m, i) => (
              <div key={i} style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{m.value}</div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(0,255,180,0.6)", fontWeight: 600, background: "#00ffb408", padding: "2px 8px", borderRadius: 8 }}>{m.delta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ATTENTION QUEUE + ALERTS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 28 }}>
          {/* Needs My Attention */}
          <div>
            <div style={{ ...sectionTitle("attn"), display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#ff4090" }}>🎯 NEEDS MY ATTENTION</span>
              <span style={{ background: "#ff409020", color: "#ff4090", padding: "1px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{visibleAttention.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {visibleAttention.map((item, i) => {
                const origIdx = ATTENTION_QUEUE.indexOf(item);
                const col = sevColors[item.sev as keyof typeof sevColors] || "#888";
                return (
                  <div key={origIdx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: rgba(col, 0.03), border: `1px solid ${rgba(col, 0.1)}`, transition: "all 0.2s" }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{item.domain}</div>
                    </div>
                    <button onClick={() => markDone(origIdx)} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600, background: rgba(col, 0.1), color: col, border: `1px solid ${rgba(col, 0.2)}`, cursor: "pointer" }}>Handle →</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>⚠ ALERTS</span>
              <span style={{ background: "#ff406020", color: "#ff4060", padding: "1px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{ALERTS.filter((_, i) => !alertDismissed.has(i)).length}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {(["all", "critical", "warning", "info"] as const).map(f => (
                  <button key={f} onClick={() => setAlertFilter(f)} style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "1px solid transparent", fontFamily: "inherit", textTransform: "uppercase",
                    background: alertFilter === f ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.03)",
                    color: alertFilter === f ? "#c084fc" : "#555",
                    borderColor: alertFilter === f ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {visibleAlerts.map((a, i) => {
                const origIdx = ALERTS.indexOf(a);
                const col = sevColors[a.sev as keyof typeof sevColors] || "#888";
                return (
                  <div key={origIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: rgba(col, 0.03), border: `1px solid ${rgba(col, 0.1)}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 5, height: 22, borderRadius: 3, background: col }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{a.title}</span>
                      <span style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>{a.count}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: rgba(col, 0.08), color: col, border: `1px solid ${rgba(col, 0.15)}`, cursor: "pointer" }}>{a.cta}</button>
                      <button onClick={() => dismissAlert(origIdx)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, color: "#555", cursor: "pointer", padding: "2px 6px", fontSize: 10 }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ SERVICES + SOURCES ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, paddingTop: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>SYSTEM SERVICES</div>
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, overflow: "hidden" }}>
              {SERVICES.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[s.status as keyof typeof statusColors], boxShadow: `0 0 8px ${rgba(statusColors[s.status as keyof typeof statusColors], 0.4)}` }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{s.latency}</span>
                    <span style={{ fontSize: 10, color: "#444" }}>{s.uptime}</span>
                    <span style={{ fontSize: 10, color: s.lastIncident === "now" ? "#ff4060" : "#333" }}>{s.lastIncident}</span>
                    <span style={healthBadge(s.status)}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>SOURCE HEALTH</div>
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, overflow: "hidden" }}>
              {SOURCES.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: i < SOURCES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[s.status as keyof typeof statusColors] || "#888" }} />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: "#444" }}>{s.lastSync}</span>
                    <span style={healthBadge(s.status)}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ADMIN DOMAINS ═══ */}
        <div style={{ paddingTop: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>ADMIN DOMAINS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {DOMAINS.map((d, i) => {
              const hovered = hoveredDomain === i;
              return (
              <div key={i} onMouseEnter={() => setHoveredDomain(i)} onMouseLeave={() => setHoveredDomain(null)} style={{
                padding: "22px 20px", borderRadius: 16, cursor: "pointer",
                background: hovered ? `linear-gradient(135deg, ${rgba(d.color, 0.07)}, ${rgba(d.color, 0.02)})` : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovered ? rgba(d.color, 0.3) : "rgba(255,255,255,0.05)"}`,
                transition: "all 0.3s ease", transform: hovered ? "translateY(-3px)" : "none",
                boxShadow: hovered ? `0 8px 28px ${rgba(d.color, 0.12)}` : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <span style={{ fontSize: 28 }}>{d.icon}</span>
                  <span style={healthBadge(d.health)}>{d.health}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 12 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.4 }}>{d.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <span style={{ fontSize: 10, color: "#444" }}>{d.lastActivity}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.color, background: rgba(d.color, 0.1), padding: "2px 10px", borderRadius: 8 }}>{d.pending} pending</span>
                </div>
                <button style={{
                  marginTop: 14, padding: "9px 0", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: hovered ? rgba(d.color, 0.15) : rgba(d.color, 0.08),
                  color: d.color, border: `1px solid ${hovered ? rgba(d.color, 0.3) : rgba(d.color, 0.15)}`,
                  width: "100%", transition: "all 0.2s", letterSpacing: 0.3,
                }}>Open {d.title} →</button>
              </div>
              );
            })}
          </div>
        </div>

        {/* ═══ DATA QUALITY + PREVIEWS + ACTIVITY ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 28, opacity: 0.85 }}>
          {/* Data Quality */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>DATA QUALITY</div>
            <div style={{ background: "rgba(255,255,255,0.012)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: "2px 0" }}>
              {DATA_QUALITY.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < DATA_QUALITY.length - 1 ? "1px solid rgba(255,255,255,0.025)" : "none" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{d.label}</span>
                  <span style={{ fontWeight: 700, color: d.count > 80 ? "rgba(255,170,0,0.8)" : "rgba(255,255,255,0.7)", fontSize: 12 }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Previews */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>OPERATIONAL PREVIEWS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { title: "Ingestion", items: [["Pending", "342"], ["Failed", "23"], ["Ready", "1,204"]] },
                { title: "Moderation", items: [["Reports", "17"], ["Flags", "9"]] },
                { title: "Marketplace", items: [["Suspicious", "4"], ["Missing", "18"]] },
              ].map((panel, pi) => (
                <div key={pi} style={{ background: "rgba(255,255,255,0.012)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 10, padding: "8px 12px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.2)", marginBottom: 5 }}>{panel.title.toUpperCase()}</div>
                  {panel.items.map(([k, v], ii) => (
                    <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{k}</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 11 }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>RECENT ACTIVITY</div>
            <div style={{ background: "rgba(255,255,255,0.012)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden" }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.025)" : "none" }}>
                  <span style={{ fontSize: 13 }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.text}</div>
                  </div>
                  <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 4, background: a.actor === "admin" ? rgba("#a855f7", 0.08) : rgba("#00d4ff", 0.08), color: a.actor === "admin" ? "rgba(168,85,247,0.7)" : "rgba(0,212,255,0.7)" }}>{a.actor}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ COMMAND STRIP ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "20px 0", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginRight: 8 }}>COMMANDS</span>
          {COMMANDS_SAFE.map(cmd => (
            <button key={cmd} onClick={() => flash(cmd)} style={{
              padding: "7px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: cmdFlash === cmd ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.05)",
              color: "#00d4ff", border: `1px solid ${cmdFlash === cmd ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.1)"}`,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}>{cmd}</button>
          ))}
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)", margin: "0 4px" }} />
          {COMMANDS_DANGER.map(cmd => (
            <button key={cmd} onClick={() => flash(cmd)} style={{
              padding: "7px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: cmdFlash === cmd ? "rgba(255,64,144,0.2)" : "rgba(255,64,144,0.05)",
              color: "#ff4090", border: `1px solid ${cmdFlash === cmd ? "rgba(255,64,144,0.3)" : "rgba(255,64,144,0.1)"}`,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}>{cmd}</button>
          ))}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "14px 28px", fontSize: 10, color: "rgba(255,255,255,0.08)", borderTop: "1px solid rgba(255,255,255,0.02)", marginTop: 8 }}>
        <span>Build v3.1.0</span>
        <span>Production</span>
        <span>Sync: 2m ago</span>
        <span>Queue: 30s ago</span>
        <span>Super Admin · R/W</span>
        <span>UTC+0</span>
      </div>
    </div>
  );
};

export default MonstrinoAdminV4;
