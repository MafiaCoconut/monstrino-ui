import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";

/* ─── TOKENS ─── */
const T = {
  bg: "#06060b",
  bgDeep: "#04040a",
  bgPanel: "#0b0b14",
  bgCard: "#0f0f1a",
  bgCardUp: "#121222",
  bgCardHover: "#181830",
  bgGlass: "rgba(8,8,16,0.88)",
  border: "#191930",
  borderUp: "#2a1a3e",
  borderHover: "#2c2c4a",
  borderAccent: "#ff2d8a44",
  text: "#eae6f2",
  textMuted: "#8886a8",
  textDim: "#4e4e72",
  accent: "#ff2d8a",
  accentSoft: "#ff2d8a28",
  accentGlow: "#ff2d8a",
  purple: "#a855f7",
  purpleSoft: "#a855f718",
  cyan: "#22d3ee",
  cyanSoft: "#22d3ee18",
  gold: "#fbbf24",
  green: "#4ade80",
  orange: "#fb923c",
  red: "#f87171",
  font: "'Inter',system-ui,sans-serif",
  mono: "'JetBrains Mono','Fira Code',monospace",
  radius: "16px",
  radiusSm: "10px",
  radiusXs: "6px",
  pill: "999px",
  tr: "all .28s cubic-bezier(.4,0,.2,1)",
  trFast: "all .18s ease",
  shadow: "0 8px 32px rgba(0,0,0,.5)",
  glowPink: "0 0 24px #ff2d8a40, 0 0 80px #ff2d8a14",
  glowPinkStrong: "0 0 30px #ff2d8a55, 0 0 100px #ff2d8a22, inset 0 0 30px #ff2d8a08",
  glowCyan: "0 0 16px #22d3ee55, 0 0 48px #22d3ee22",
  glowPurple: "0 0 20px #a855f733",
};

/* ─── TYPES ─── */
type Status = "Rumored" | "Announced" | "Preorder" | "Releasing Soon" | "Released" | "Delayed" | "Cancelled";
interface Release {
  id: number; title: string; series: string; date: string; dateLabel: string;
  status: Status; characters?: string; region?: string; price?: string;
  year: number; month: number;
}

/* ─── STATUS COLORS ─── */
const SC: Record<Status, { c: string; bg: string; glow: string; border: string }> = {
  Rumored:          { c: "#c084fc", bg: "#a855f720", glow: "#a855f744", border: "#a855f730" },
  Announced:        { c: "#67e8f9", bg: "#22d3ee18", glow: "#22d3ee44", border: "#22d3ee30" },
  Preorder:         { c: "#ff6eb4", bg: "#ff2d8a1c", glow: "#ff2d8a44", border: "#ff2d8a30" },
  "Releasing Soon": { c: "#fbbf24", bg: "#f59e0b1c", glow: "#fbbf2444", border: "#fbbf2430" },
  Released:         { c: "#4ade80", bg: "#22c55e10", glow: "transparent", border: "#22c55e18" },
  Delayed:          { c: "#fb923c", bg: "#f9731620", glow: "#fb923c33", border: "#fb923c30" },
  Cancelled:        { c: "#f87171", bg: "#ef444420", glow: "transparent", border: "#ef444430" },
};

/* ─── DATA ─── */
const DATA: Release[] = [
  { id: 1, title:"Phantom Veil Seraphina", series:"Shadow Court", date:"2026-04-20", dateLabel:"Apr 20, 2026", status:"Rumored", characters:"Seraphina", region:"WW", year:2026, month:4 },
  { id: 2, title:"Neon Dusk Valkyrie", series:"Cyber Nocturne", date:"2026-03-01", dateLabel:"Mar 2026", status:"Rumored", characters:"Valkyrie", region:"NA/EU", year:2026, month:3 },
  { id: 3, title:"Obsidian Bloom Lilith", series:"Petal Noir", date:"2026-01-15", dateLabel:"Jan 15, 2026", status:"Announced", characters:"Lilith", region:"WW", price:"$115", year:2026, month:1 },
  { id: 4, title:"Starfire Eclipse Mira", series:"Celestial Drift", date:"2025-11-10", dateLabel:"Nov 10, 2025", status:"Announced", characters:"Mira", region:"Asia/NA", price:"$110", year:2025, month:11 },
  { id: 5, title:"Crimson Throne Valentina", series:"Petal Noir", date:"2025-09-20", dateLabel:"Sep 20, 2025", status:"Preorder", characters:"Valentina", region:"WW", price:"$99", year:2025, month:9 },
  { id: 6, title:"Glitch Siren Pixel", series:"Cyber Nocturne", date:"2025-08-05", dateLabel:"Aug 5, 2025", status:"Delayed", characters:"Pixel", region:"WW", price:"$95", year:2025, month:8 },
  { id: 7, title:"Iron Lily Vesper", series:"Shadow Court", date:"2025-07-12", dateLabel:"Jul 12, 2025", status:"Preorder", characters:"Vesper", region:"EU/NA", price:"$89", year:2025, month:7 },
  { id: 8, title:"Aurora Fang Selene", series:"Celestial Drift", date:"2025-06-01", dateLabel:"Jun 1, 2025", status:"Releasing Soon", characters:"Selene", region:"WW", price:"$105", year:2025, month:6 },
  { id: 9, title:"Neon Requiem Lucienne", series:"Cyber Nocturne", date:"2025-04-28", dateLabel:"Apr 28, 2025", status:"Releasing Soon", characters:"Lucienne", region:"NA", price:"$92", year:2025, month:4 },
  { id: 10, title:"Violet Storm Aria", series:"Cyber Nocturne", date:"2025-03-15", dateLabel:"Mar 15, 2025", status:"Released", characters:"Aria", region:"EU", price:"$85", year:2025, month:3 },
  { id: 11, title:"Obsidian Throne Kaelith", series:"Shadow Court", date:"2025-02-01", dateLabel:"Feb 1, 2025", status:"Released", characters:"Kaelith", region:"WW", price:"$99", year:2025, month:2 },
  { id: 12, title:"Ghost Petal Yuki", series:"Petal Noir", date:"2025-01-10", dateLabel:"Jan 10, 2025", status:"Released", characters:"Yuki", region:"JP", price:"$92", year:2025, month:1 },
  { id: 13, title:"Duskfire Ember", series:"Shadow Court", date:"2024-11-15", dateLabel:"Nov 15, 2024", status:"Released", characters:"Ember", region:"WW", price:"$88", year:2024, month:11 },
  { id: 14, title:"Hollow Circuit Nova", series:"Cyber Nocturne", date:"2024-09-01", dateLabel:"Sep 1, 2024", status:"Released", characters:"Nova", region:"NA", price:"$79", year:2024, month:9 },
  { id: 15, title:"Midnight Corsage Isolde", series:"Petal Noir", date:"2024-06-18", dateLabel:"Jun 18, 2024", status:"Released", characters:"Isolde", region:"WW", price:"$95", year:2024, month:6 },
  { id: 16, title:"Wither Rose Celeste", series:"Celestial Drift", date:"2024-04-05", dateLabel:"Apr 5, 2024", status:"Released", characters:"Celeste", region:"EU", price:"$102", year:2024, month:4 },
  { id: 17, title:"Prism Wraith Zenith", series:"Celestial Drift", date:"2024-02-22", dateLabel:"Feb 22, 2024", status:"Cancelled", characters:"Zenith", region:"NA/EU", price:"$120", year:2024, month:2 },
  { id: 18, title:"Moonlit Fang Elara", series:"Shadow Court", date:"2023-10-10", dateLabel:"Oct 10, 2023", status:"Released", characters:"Elara", region:"WW", price:"$82", year:2023, month:10 },
  { id: 19, title:"Neon Vow Kira", series:"Cyber Nocturne", date:"2023-06-01", dateLabel:"Jun 1, 2023", status:"Released", characters:"Kira", region:"NA", price:"$75", year:2023, month:6 },
  { id: 20, title:"Silk Specter Dahlia", series:"Petal Noir", date:"2023-02-14", dateLabel:"Feb 14, 2023", status:"Released", characters:"Dahlia", region:"WW", price:"$78", year:2023, month:2 },
];

const NOW = new Date("2025-04-05");
const NOW_STR = NOW.toISOString().slice(0, 10);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATUSES: Status[] = ["Rumored","Announced","Preorder","Releasing Soon","Released","Delayed","Cancelled"];
const SERIES = [...new Set(DATA.map(r => r.series))];
const YEARS = [...new Set(DATA.map(r => r.year))].sort((a,b) => b - a);

/* Date-based future/past classification.
   - Future = date >= NOW, unless Released or Cancelled
   - Past = date < NOW, or status is Released/Cancelled regardless of date
   - Delayed items with future dates remain in upcoming */
const isFuture = (r: Release): boolean => {
  if (r.status === "Released") return false;
  if (r.status === "Cancelled") return false;
  return r.date >= NOW_STR;
};

/* ─── INLINE SVG ICONS ─── */
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const ChevronDown = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ChevronRight = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>;
const ArchiveIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg>;

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm"|"md" }) {
  const s = SC[status];
  const isMd = size === "md";
  const future = isFuture({ status } as Release & { date: string });
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap: isMd ? 6 : 5,
      padding: isMd ? "4px 12px" : "3px 10px",
      fontSize: isMd ? 10 : 9, fontWeight:700, fontFamily:T.mono,
      letterSpacing:1.2, textTransform:"uppercase",
      background:s.bg, color:s.c, borderRadius:T.pill,
      border:`1px solid ${s.border}`,
      boxShadow: (status !== "Released" && status !== "Cancelled") ? `0 0 8px ${s.glow}` : "none",
    }}>
      <span style={{ width: isMd ? 6 : 5, height: isMd ? 6 : 5, borderRadius:"50%", background:s.c, boxShadow:`0 0 6px ${s.c}` }} />
      {status}
    </span>
  );
}

function StatCard({ value, label, color, icon }: { value: string|number; label: string; color: string; icon?: React.ReactNode }) {
  return (
    <div style={{
      padding:"14px 18px", background:`linear-gradient(135deg, ${T.bgCard}, ${T.bgPanel})`,
      border:`1px solid ${T.border}`, borderRadius:T.radiusSm, minWidth:130, flex:1,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:-16, right:-16, width:60, height:60, borderRadius:"50%", background:`radial-gradient(circle, ${color}08, transparent)`, pointerEvents:"none" }} />
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        {icon && <span style={{ color, opacity:.5 }}>{icon}</span>}
        <div style={{ fontSize:9, fontFamily:T.mono, letterSpacing:2.5, color:T.textDim, textTransform:"uppercase" }}>{label}</div>
      </div>
      <div style={{ fontSize:22, fontWeight:900, color, fontFamily:T.font, lineHeight:1, letterSpacing:"-0.02em" }}>{value}</div>
    </div>
  );
}

function SelectDropdown({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        appearance:"none", padding:"8px 30px 8px 14px", background:T.bgCard,
        border:`1px solid ${T.border}`, borderRadius:T.pill, color:T.text,
        fontSize:11, fontFamily:T.mono, cursor:"pointer", outline:"none",
        letterSpacing:.5, minWidth:95, transition:T.tr,
      }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position:"absolute", right:10, pointerEvents:"none", color:T.textDim }}><ChevronDown /></span>
    </div>
  );
}

function ImagePlaceholder({ id, height = 180, radius = `${T.radiusSm} ${T.radiusSm} 0 0` }: { id: number; height?: number; radius?: string }) {
  const h1 = (id * 47) % 360, h2 = (id * 113) % 360;
  return (
    <div style={{
      width:"100%", height, borderRadius:radius, overflow:"hidden", position:"relative",
      background:`linear-gradient(135deg, hsl(${h1},28%,13%), hsl(${h2},22%,8%))`,
    }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #06060bee 0%, #06060b55 35%, transparent 100%)" }} />
      <svg viewBox="0 0 100 100" width="36" height="36" style={{ position:"absolute", top:"45%", left:"50%", transform:"translate(-50%,-50%)", opacity:.12 }}>
        <circle cx="50" cy="35" r="18" fill="#fff" /><ellipse cx="50" cy="80" rx="30" ry="22" fill="#fff" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEXT DROP SPOTLIGHT (tighter, less dominant)
   ═══════════════════════════════════════════════════════ */
function NextDropSpotlight({ release }: { release: Release }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="v6-spotlight-inner"
      style={{
        display:"flex", gap:0, borderRadius:T.radius, overflow:"hidden",
        border:`1px solid ${hovered ? T.accent+"66" : T.borderAccent}`,
        background:T.bgCard, position:"relative", cursor:"pointer",
        boxShadow: hovered ? T.glowPinkStrong : T.glowPink,
        transition:T.tr,
      }}
    >
      <div style={{ position:"absolute", inset:-1, borderRadius:T.radius, background:`linear-gradient(135deg, ${T.accent}18, ${T.purple}08, transparent)`, pointerEvents:"none", zIndex:0 }} />

      {/* Image */}
      <div className="v6-spotlight-img" style={{ width:"clamp(180px,26%,280px)", flexShrink:0, position:"relative", zIndex:1 }}>
        <ImagePlaceholder id={release.id} height={260} radius="0" />
        <div style={{ position:"absolute", top:14, left:14 }}>
          <span style={{
            fontSize:8, fontFamily:T.mono, letterSpacing:2, textTransform:"uppercase",
            padding:"3px 10px", background:T.accent, color:"#fff", borderRadius:T.pill, fontWeight:800,
          }}>NEXT DROP</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex:1, padding:"20px 28px", display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", zIndex:1 }}>
        <StatusBadge status={release.status} size="md" />
        <h2 style={{ fontSize:24, fontWeight:900, letterSpacing:"-0.02em", marginTop:10, lineHeight:1.15 }}>{release.title}</h2>

        <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:14, rowGap:8 }}>
          {[
            { l:"SERIES", v:release.series },
            release.characters ? { l:"CHARACTER", v:release.characters } : null,
            { l:"DATE", v:release.dateLabel, color:T.cyan, mono:true },
            release.region ? { l:"REGION", v:release.region } : null,
            release.price ? { l:"PRICE", v:release.price, color:T.cyan, mono:true, big:true } : null,
          ].filter(Boolean).map((item: any, i) => (
            <div key={i}>
              <div style={{ fontSize:8, fontFamily:T.mono, letterSpacing:2, color:T.textDim, marginBottom:2 }}>{item.l}</div>
              <div style={{ fontSize: item.big ? 15 : 12, color: item.color || T.textMuted, fontWeight: item.mono ? 700 : 600, fontFamily: item.mono ? T.mono : T.font }}>{item.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:16 }}>
          <button style={{
            padding:"8px 24px", background:`linear-gradient(135deg, ${T.accent}, #d4247a)`,
            border:"none", borderRadius:T.pill, color:"#fff", fontSize:9, fontFamily:T.mono,
            letterSpacing:2, textTransform:"uppercase", fontWeight:800, cursor:"pointer",
            boxShadow:`0 0 16px ${T.accent}44`, display:"inline-flex", alignItems:"center", gap:8,
            transition:T.tr,
          }}>
            VIEW RELEASE <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UPCOMING TIMELINE CARD
   ═══════════════════════════════════════════════════════ */
function UpcomingTimelineCard({ r, isFirst }: { r: Release; isFirst: boolean }) {
  const [hovered, setHovered] = useState(false);
  const sc = SC[r.status];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:220 }}>
      {/* Date label */}
      <div style={{
        fontSize:10, fontFamily:T.mono, letterSpacing:1.5, color: isFirst ? T.accent : T.textMuted,
        marginBottom:8, fontWeight: isFirst ? 800 : 600, whiteSpace:"nowrap",
      }}>{r.dateLabel}</div>

      {/* Node */}
      <div style={{
        width: isFirst ? 14 : 10, height: isFirst ? 14 : 10, borderRadius:"50%",
        background: isFirst ? T.accent : sc.c,
        boxShadow: isFirst ? `0 0 12px ${T.accent}88, 0 0 30px ${T.accent}44` : `0 0 8px ${sc.glow}`,
        border: isFirst ? `2px solid ${T.accent}` : `2px solid ${sc.c}44`,
        marginBottom:10, position:"relative", zIndex:2,
        transition:T.tr,
        animation: isFirst ? "pulse-pink 2s ease-in-out infinite" : undefined,
      }} />

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:"100%",
          background: isFirst ? T.bgCardUp : T.bgCard,
          border:`1px solid ${hovered ? T.accent+"55" : (isFirst ? T.borderAccent : T.borderUp)}`,
          borderRadius:T.radius, overflow:"hidden", cursor:"pointer",
          transition:T.tr,
          transform: hovered ? "translateY(-3px)" : "none",
          boxShadow: hovered ? T.glowPink : (isFirst ? `0 0 16px ${T.accent}18` : "0 2px 12px rgba(0,0,0,.35)"),
        }}
      >
        <ImagePlaceholder id={r.id} height={130} />
        <div style={{ padding:"10px 12px 12px" }}>
          <StatusBadge status={r.status} />
          <div style={{ fontSize:12, fontWeight:800, lineHeight:1.3, marginTop:6 }}>{r.title}</div>
          <div style={{ fontSize:10, color:T.textMuted, marginTop:2 }}>{r.series}{r.characters ? ` · ${r.characters}` : ""}</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
            <span style={{ fontSize:11, fontFamily:T.mono, color:T.cyan, fontWeight:700 }}>{r.price || ""}</span>
            <button style={{
              padding:"3px 10px", border:`1px solid ${T.accent}33`, background:T.accentSoft,
              color:T.accent, borderRadius:T.pill, fontSize:8, fontFamily:T.mono,
              letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", fontWeight:700,
            }}>DETAILS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ARCHIVE ROW (with subtle interaction cue)
   ═══════════════════════════════════════════════════════ */
function ArchiveRow({ r }: { r: Release }) {
  const [hovered, setHovered] = useState(false);
  const isCancelled = r.status === "Cancelled";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:"flex", alignItems:"center", gap:12, padding:"9px 14px",
        background: hovered ? T.bgCardHover : T.bgCard,
        border:`1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius:T.radiusXs, cursor:"pointer", transition:T.trFast,
        opacity: isCancelled ? 0.55 : (hovered ? 1 : 0.78),
      }}
    >
      {/* Mini thumb */}
      <div style={{
        width:34, height:34, borderRadius:6, flexShrink:0,
        background:`linear-gradient(135deg, hsl(${(r.id*47)%360},22%,13%), hsl(${(r.id*113)%360},18%,9%))`,
      }} />
      {/* Date */}
      <div style={{ width:88, flexShrink:0, fontSize:11, fontFamily:T.mono, color:T.textDim, letterSpacing:.5 }}>{r.dateLabel}</div>
      {/* Title + series */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          textDecoration: isCancelled ? "line-through" : "none",
          textDecorationColor: isCancelled ? T.red + "44" : undefined,
        }}>{r.title}</div>
        <div style={{ fontSize:10, color:T.textDim, marginTop:1 }}>{r.series}{r.characters ? ` · ${r.characters}` : ""}</div>
      </div>
      {/* Status */}
      <StatusBadge status={r.status} />
      {/* Price */}
      <div style={{ width:55, textAlign:"right", flexShrink:0 }}>
        {r.price && <span style={{ fontSize:11, fontFamily:T.mono, color:T.textDim }}>{r.price}</span>}
      </div>
      {/* Interaction cue */}
      <div style={{
        flexShrink:0, color: hovered ? T.textMuted : T.textDim,
        transition:T.trFast, transform: hovered ? "translateX(2px)" : "none",
        opacity: hovered ? 1 : 0.4,
      }}>
        <ChevronRight />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPACT MODE ROW (denser, better aligned)
   ═══════════════════════════════════════════════════════ */
function CompactLogRow({ r, upcoming }: { r: Release; upcoming: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isCancelled = r.status === "Cancelled";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="v6-compact-grid"
      style={{
        display:"grid",
        gridTemplateColumns:"84px 1fr 100px auto 54px 16px",
        alignItems:"center", gap:10, padding:"6px 12px",
        background: hovered ? (upcoming ? T.bgCardUp : T.bgCardHover) : "transparent",
        borderBottom:`1px solid ${T.border}`,
        cursor:"pointer", transition:T.trFast,
        opacity: isCancelled ? 0.5 : (upcoming ? 1 : (hovered ? 0.9 : 0.7)),
      }}
    >
      <span style={{
        fontSize:11, fontFamily:T.mono, color: upcoming ? T.cyan : T.textDim,
        fontWeight: upcoming ? 700 : 400, letterSpacing:.3,
      }}>{r.dateLabel}</span>
      <div style={{ minWidth:0 }}>
        <span style={{
          fontSize:12, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", display:"block",
          textDecoration: isCancelled ? "line-through" : "none",
          textDecorationColor: isCancelled ? T.red + "44" : undefined,
        }}>{r.title}</span>
        <span style={{ fontSize:9, color:T.textDim }}>{r.series}{r.characters ? ` · ${r.characters}` : ""}{r.region ? ` · ${r.region}` : ""}</span>
      </div>
      <span style={{ fontSize:9, fontFamily:T.mono, color:T.textDim, letterSpacing:.5, whiteSpace:"nowrap" }}>{r.series}</span>
      <StatusBadge status={r.status} />
      <span style={{ fontSize:11, fontFamily:T.mono, color: upcoming ? T.cyan : T.textDim, textAlign:"right", fontWeight: upcoming ? 700 : 400 }}>{r.price || "—"}</span>
      <span style={{ color: hovered ? T.textMuted : "transparent", transition:T.trFast }}><ChevronRight /></span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NOW MARKER
   ═══════════════════════════════════════════════════════ */
function NowMarker() {
  return (
    <div style={{ padding:"36px 0", display:"flex", alignItems:"center", gap:0 }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right, transparent, ${T.cyan}55)` }} />
      <div style={{
        display:"flex", alignItems:"center", gap:10, padding:"7px 22px",
        background:T.cyanSoft, border:`1px solid ${T.cyan}33`,
        borderRadius:T.pill, flexShrink:0,
      }}>
        <div style={{
          width:8, height:8, borderRadius:"50%", background:T.cyan,
          boxShadow:T.glowCyan, animation:"pulse-cyan 2s ease-in-out infinite",
        }} />
        <span style={{ fontSize:10, fontFamily:T.mono, letterSpacing:3, color:T.cyan, fontWeight:700 }}>
          NOW — {MONTHS[NOW.getMonth()].toUpperCase()} {NOW.getFullYear()}
        </span>
        <div style={{
          width:8, height:8, borderRadius:"50%", background:T.cyan,
          boxShadow:T.glowCyan, animation:"pulse-cyan 2s ease-in-out infinite",
        }} />
      </div>
      <div style={{ flex:1, height:1, background:`linear-gradient(to left, transparent, ${T.cyan}55)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function ReleaseTimelineV6() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [sortDir, setSortDir] = useState<"newest"|"oldest">("newest");
  const [viewMode, setViewMode] = useState<"timeline"|"compact">("timeline");
  const yearRefs = useRef<Record<number, HTMLDivElement|null>>({});
  const [stickyVisible, setStickyVisible] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold:0 });
    if (controlsRef.current) obs.observe(controlsRef.current);
    return () => obs.disconnect();
  }, []);

  const sorted = useMemo(() => {
    let d = [...DATA];
    if (search) { const s = search.toLowerCase(); d = d.filter(r => r.title.toLowerCase().includes(s) || r.series.toLowerCase().includes(s) || (r.characters||"").toLowerCase().includes(s)); }
    if (statusFilter) d = d.filter(r => r.status === statusFilter);
    if (yearFilter) d = d.filter(r => r.year === Number(yearFilter));
    if (seriesFilter) d = d.filter(r => r.series === seriesFilter);
    d.sort((a,b) => sortDir === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return d;
  }, [search, statusFilter, yearFilter, seriesFilter, sortDir]);

  const upcomingReleases = useMemo(() => sorted.filter(isFuture), [sorted]);
  const pastReleases = useMemo(() => sorted.filter(r => !isFuture(r)), [sorted]);

  /* Next drop = nearest future release by date (unfiltered) */
  const nextDrop = useMemo(() =>
    DATA.filter(isFuture).sort((a,b) => a.date.localeCompare(b.date))[0] || null
  , []);

  /* Latest released */
  const latestReleased = useMemo(() =>
    DATA.filter(r => r.status === "Released").sort((a,b) => b.date.localeCompare(a.date))[0]?.dateLabel || "—"
  , []);

  const archiveByYear = useMemo(() => {
    const m: Record<number, Record<number, Release[]>> = {};
    pastReleases.forEach(r => {
      if (!m[r.year]) m[r.year] = {};
      if (!m[r.year][r.month]) m[r.year][r.month] = [];
      m[r.year][r.month].push(r);
    });
    return Object.entries(m).sort(([a],[b]) => Number(b)-Number(a)).map(([yr, months]) => ({
      year:Number(yr),
      months: Object.entries(months).sort(([a],[b]) => Number(b)-Number(a)).map(([mo,releases]) => ({ month:Number(mo), releases })),
    }));
  }, [pastReleases]);

  const archiveYears = archiveByYear.map(y => y.year);

  const scrollTo = useCallback((yr: number) => {
    yearRefs.current[yr]?.scrollIntoView({ behavior:"smooth", block:"start" });
  }, []);

  const stats = useMemo(() => {
    const upcoming = DATA.filter(isFuture).length;
    const nd = DATA.filter(isFuture).sort((a,b) => a.date.localeCompare(b.date))[0];
    const total = DATA.filter(r => r.status === "Released").length;
    return { upcoming, nextDrop: nd?.dateLabel || "—", latestReleased, total };
  }, [latestReleased]);

  const upcomingMinusNext = useMemo(() => {
    if (!nextDrop) return upcomingReleases;
    return upcomingReleases.filter(r => r.id !== nextDrop.id);
  }, [upcomingReleases, nextDrop]);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:T.font }}>
      <style>{`
        @keyframes pulse-cyan { 0%,100%{box-shadow:0 0 8px ${T.cyan}55,0 0 24px ${T.cyan}22} 50%{box-shadow:0 0 16px ${T.cyan}88,0 0 48px ${T.cyan}44} }
        @keyframes pulse-pink { 0%,100%{box-shadow:0 0 6px ${T.accent}44} 50%{box-shadow:0 0 14px ${T.accent}77, 0 0 36px ${T.accent}33} }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px; }
        @media(max-width:767px) {
          .v6-main-layout { flex-direction:column !important; }
          .v6-sidebar { display:none !important; }
          .v6-year-chips { display:flex !important; }
          .v6-spotlight-inner { flex-direction:column !important; }
          .v6-spotlight-img { width:100% !important; min-height:180px !important; }
          .v6-upcoming-track { overflow-x:auto !important; }
          .v6-compact-grid { grid-template-columns:70px 1fr auto 48px !important; }
          .v6-compact-grid > :nth-child(3) { display:none !important; }
          .v6-compact-grid > :nth-child(6) { display:none !important; }
        }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position:"fixed", top:-400, right:-300, width:900, height:900, background:`radial-gradient(circle, ${T.accent}05 0%, transparent 65%)`, pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-400, left:-200, width:800, height:800, background:`radial-gradient(circle, ${T.purple}04 0%, transparent 65%)`, pointerEvents:"none" }} />

      <div style={{ maxWidth:1440, margin:"0 auto", padding:"0 24px" }}>

        {/* ═══ HERO ═══ */}
        <header style={{ padding:"64px 0 16px", animation:"fade-up .6s ease" }}>
          <div style={{ marginBottom:16 }}>
            <span style={{ fontSize:9, fontFamily:T.mono, letterSpacing:6, color:T.accent }}>MONSTRINO ARCHIVES</span>
            <div style={{ marginTop:4, height:1, width:60, background:`linear-gradient(to right, ${T.accent}, transparent)` }} />
          </div>

          <h1 style={{
            fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1,
            background:`linear-gradient(135deg, ${T.accent} 0%, ${T.purple} 50%, ${T.cyan} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            marginBottom:10,
          }}>RELEASE TIMELINE</h1>

          <p style={{ color:T.textMuted, fontSize:14, maxWidth:460, lineHeight:1.6, marginBottom:24 }}>
            Every Monstrino release — past, present, and future — in strict chronological order.
          </p>

          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <StatCard value={stats.upcoming} label="Upcoming" color={T.accent} icon={<CalendarIcon />} />
            <StatCard value={stats.nextDrop} label="Next Drop" color={T.cyan} icon={<CalendarIcon />} />
            <StatCard value={stats.latestReleased} label="Latest Released" color={T.green} />
            <StatCard value={stats.total} label="Total Released" color={T.purple} icon={<ArchiveIcon />} />
          </div>
        </header>

        {/* ═══ NEXT DROP SPOTLIGHT ═══ */}
        {nextDrop && (
          <div style={{ animation:"fade-up .7s ease .1s both", margin:"28px 0 24px" }}>
            <NextDropSpotlight release={nextDrop} />
          </div>
        )}

        {/* ═══ CONTROLS ═══ */}
        <div ref={controlsRef} />
        <div style={{
          position:"sticky", top:0, zIndex:100, padding:"10px 0",
          background: stickyVisible ? T.bgGlass : "transparent",
          backdropFilter: stickyVisible ? "blur(20px) saturate(1.2)" : "none",
          borderBottom: stickyVisible ? `1px solid ${T.border}` : "1px solid transparent",
          transition:"all .3s ease", marginBottom:8,
        }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:"1 1 180px", maxWidth:260 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.textDim }}><SearchIcon /></span>
              <input placeholder="Search releases…" value={search} onChange={e => setSearch(e.target.value)} style={{
                width:"100%", padding:"8px 14px 8px 36px", background:T.bgCard, border:`1px solid ${T.border}`,
                borderRadius:T.pill, color:T.text, fontSize:12, fontFamily:T.font, outline:"none", transition:T.tr,
              }} />
            </div>
            <SelectDropdown value={statusFilter} onChange={setStatusFilter} options={STATUSES} placeholder="Status" />
            <SelectDropdown value={yearFilter} onChange={setYearFilter} options={YEARS.map(String)} placeholder="Year" />
            <SelectDropdown value={seriesFilter} onChange={setSeriesFilter} options={SERIES} placeholder="Series" />
            <SelectDropdown value={sortDir} onChange={v => setSortDir(v as any)} options={["newest","oldest"]} placeholder="Sort" />
            <div style={{ display:"flex", borderRadius:T.pill, overflow:"hidden", border:`1px solid ${T.border}` }}>
              {(["timeline","compact"] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{
                  padding:"7px 16px", border:"none", fontSize:9, fontFamily:T.mono, letterSpacing:1.5,
                  textTransform:"uppercase", cursor:"pointer", fontWeight:700, transition:T.tr,
                  background: viewMode === m ? T.accent : T.bgCard,
                  color: viewMode === m ? "#fff" : T.textDim,
                }}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ MAIN LAYOUT ═══ */}
        <div className="v6-main-layout" style={{ display:"flex", gap:28, paddingBottom:80 }}>

          {/* SIDEBAR year nav (desktop) */}
          <aside className="v6-sidebar" style={{
            width:140, flexShrink:0, position:"sticky", top:64, alignSelf:"flex-start",
            display: archiveYears.length > 0 ? "block" : "none",
          }}>
            <div style={{ background:T.bgPanel, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:"14px 10px" }}>
              <span style={{ fontSize:8, fontFamily:T.mono, letterSpacing:3, color:T.textDim }}>ARCHIVE NAV</span>
              <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:1 }}>
                {archiveYears.map(y => (
                  <button key={y} onClick={() => scrollTo(y)} style={{
                    padding:"5px 8px", border:"none", background:"transparent", color:T.textMuted,
                    fontSize:13, fontWeight:800, fontFamily:T.font, cursor:"pointer", textAlign:"left",
                    borderRadius:T.radiusXs, transition:T.trFast,
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.bgCard; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}
                  >
                    {y}
                    <span style={{ fontSize:9, color:T.textDim, fontFamily:T.mono }}>
                      {archiveByYear.find(b => b.year === y)?.months.reduce((s,m) => s+m.releases.length, 0)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <main style={{ flex:1, minWidth:0 }}>

            {/* Mobile year chips */}
            <div className="v6-year-chips" style={{ display:"none", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
              {archiveYears.map(y => (
                <button key={y} onClick={() => scrollTo(y)} style={{
                  padding:"5px 14px", border:`1px solid ${T.border}`, background:T.bgCard,
                  borderRadius:T.pill, color:T.textMuted, fontSize:12, fontWeight:700,
                  fontFamily:T.mono, cursor:"pointer", flexShrink:0,
                }}>{y}</button>
              ))}
            </div>

            {/* ═══ UPCOMING TIMELINE ═══ */}
            {upcomingMinusNext.length > 0 && (
              <section style={{ marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent, boxShadow:`0 0 10px ${T.accent}88`, animation:"pulse-pink 2s ease-in-out infinite" }} />
                  <span style={{ fontSize:11, fontFamily:T.mono, letterSpacing:4, fontWeight:700, color:T.accent }}>UPCOMING RELEASES</span>
                  <div style={{ flex:1, height:1, background:`linear-gradient(to right, ${T.accent}44, transparent)` }} />
                  <span style={{ fontSize:10, fontFamily:T.mono, color:T.textDim }}>{upcomingMinusNext.length} DROPS</span>
                </div>

                {viewMode === "timeline" ? (
                  <div style={{ position:"relative" }}>
                    {/* Horizontal connecting line behind nodes */}
                    <div style={{
                      position:"absolute", top:54, left:30, right:30, height:2,
                      background:`linear-gradient(to right, ${T.accent}88, ${T.purple}55, ${T.accent}22, transparent)`,
                      zIndex:1, pointerEvents:"none",
                    }} />
                    <div className="v6-upcoming-track" style={{
                      display:"flex", gap:24, overflowX:"auto", paddingBottom:16, paddingTop:36,
                      scrollSnapType:"x mandatory",
                    }}>
                      {upcomingMinusNext.map((r, i) => (
                        <div key={r.id} style={{ scrollSnapAlign:"start" }}>
                          <UpcomingTimelineCard r={r} isFirst={i === 0} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ border:`1px solid ${T.border}`, borderRadius:T.radiusSm, overflow:"hidden" }}>
                    {upcomingMinusNext.map(r => <CompactLogRow key={r.id} r={r} upcoming />)}
                  </div>
                )}
              </section>
            )}

            {/* ═══ NOW ═══ */}
            <NowMarker />

            {/* ═══ ARCHIVE ═══ */}
            {archiveByYear.length > 0 && (
              <section>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
                  <span style={{ fontSize:11, fontFamily:T.mono, letterSpacing:4, fontWeight:700, color:T.purple }}>RELEASE ARCHIVE</span>
                  <div style={{ flex:1, height:1, background:`linear-gradient(to right, ${T.purple}33, transparent)` }} />
                  <span style={{ fontSize:10, fontFamily:T.mono, color:T.textDim }}>{pastReleases.length} RELEASED</span>
                </div>

                {archiveByYear.map(({ year, months }) => (
                  <div key={year} ref={el => { yearRefs.current[year] = el; }} style={{ marginBottom:40, scrollMarginTop:70 }}>
                    {/* Year header */}
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                      <span style={{ fontSize:28, fontWeight:900, color:T.purple, letterSpacing:"-0.02em" }}>{year}</span>
                      <div style={{ height:1, flex:1, background:`linear-gradient(to right, ${T.purple}33, transparent)` }} />
                      <span style={{ fontSize:9, fontFamily:T.mono, color:T.textDim, letterSpacing:1 }}>
                        {months.reduce((s,m) => s+m.releases.length, 0)} RELEASES
                      </span>
                    </div>

                    {months.map(({ month, releases }) => (
                      <div key={month} style={{ marginBottom:16, paddingLeft:20, borderLeft:`2px solid ${T.border}`, position:"relative" }}>
                        <div style={{
                          position:"absolute", left:-5, top:5, width:8, height:8,
                          borderRadius:"50%", background:T.textDim,
                        }} />
                        <div style={{
                          fontSize:10, fontFamily:T.mono, letterSpacing:2.5, color:T.textMuted,
                          marginBottom:6, textTransform:"uppercase", fontWeight:600,
                        }}>{MONTHS[month-1]}</div>

                        {viewMode === "timeline" ? (
                          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                            {releases.map(r => <ArchiveRow key={r.id} r={r} />)}
                          </div>
                        ) : (
                          <div style={{ border:`1px solid ${T.border}`, borderRadius:T.radiusXs, overflow:"hidden" }}>
                            {releases.map(r => <CompactLogRow key={r.id} r={r} upcoming={false} />)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {sorted.length === 0 && (
              <div style={{ textAlign:"center", padding:"64px 0", color:T.textDim }}>
                <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>No releases found</div>
                <div style={{ fontSize:12 }}>Try adjusting your filters.</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
