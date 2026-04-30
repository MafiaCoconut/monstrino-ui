import React, { useState, useMemo, useEffect } from "react";

// ─── THEME ──────────────────────────────────────────────
const T = {
  bg: "#06060c",
  bgAlt: "#080814",
  surface: "#0c0c18",
  card: "#10101e",
  cardHover: "#141428",
  border: "#1a1a30",
  borderLight: "#24244a",
  pink: "#ff2d78",
  pinkDim: "#ff2d7833",
  purple: "#9945ff",
  purpleDim: "#9945ff33",
  cyan: "#00e5ff",
  cyanDim: "#00e5ff33",
  gold: "#ffd700",
  goldDim: "#ffd70033",
  white: "#eeeef4",
  light: "#c8c8d8",
  muted: "#6a6a85",
  dim: "#38384e",
  dimmer: "#22223a",
  font: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  r: 14,
  rLg: 20,
  pill: 999,
};

// ─── TYPES ──────────────────────────────────────────────
type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
type Category = "Collection" | "Completion" | "Hunting" | "Social" | "Activity";
type Status = "unlocked" | "locked" | "in-progress";

interface Achievement {
  id: number;
  title: string;
  desc: string;
  rarity: Rarity;
  category: Category;
  status: Status;
  progress: number;
  total: number;
  unlockDate?: string;
  pinned?: boolean;
  featured?: string;
  xp: number;
}

// ─── DATA ───────────────────────────────────────────────
const DATA: Achievement[] = [
  { id: 1, title: "GENESIS COLLECTOR", desc: "Acquire your first Monstrino release", rarity: "Common", category: "Collection", status: "unlocked", progress: 1, total: 1, unlockDate: "2025-12-01", featured: "latest", xp: 50 },
  { id: 2, title: "SHADOW HUNTER", desc: "Discover 5 hidden releases before public launch", rarity: "Legendary", category: "Hunting", status: "unlocked", progress: 5, total: 5, unlockDate: "2025-11-20", featured: "rarest", pinned: true, xp: 500 },
  { id: 3, title: "SERIES MASTER", desc: "Complete an entire release series from start to finish", rarity: "Epic", category: "Completion", status: "in-progress", progress: 8, total: 10, xp: 300 },
  { id: 4, title: "VAULT KEEPER", desc: "Collect 25 releases in your vault", rarity: "Rare", category: "Collection", status: "in-progress", progress: 18, total: 25, xp: 150 },
  { id: 5, title: "SOCIAL ECHO", desc: "Share 10 collection milestones with the community", rarity: "Common", category: "Social", status: "in-progress", progress: 6, total: 10, xp: 50 },
  { id: 6, title: "NIGHT OWL", desc: "Make 3 acquisitions between midnight and 4 AM", rarity: "Rare", category: "Activity", status: "locked", progress: 1, total: 3, xp: 150 },
  { id: 7, title: "CHROMATIC SET", desc: "Collect all color variants of a single release", rarity: "Epic", category: "Completion", status: "locked", progress: 2, total: 5, xp: 300 },
  { id: 8, title: "FIRST BLOOD", desc: "Be the first collector to acquire a new release", rarity: "Legendary", category: "Hunting", status: "locked", progress: 0, total: 1, xp: 500 },
  { id: 9, title: "CONSTELLATION", desc: "Unlock 10 achievements to prove your dedication", rarity: "Common", category: "Activity", status: "in-progress", progress: 7, total: 10, xp: 50 },
  { id: 10, title: "PATRON SAINT", desc: "Support 5 different creators through acquisitions", rarity: "Rare", category: "Social", status: "unlocked", progress: 5, total: 5, unlockDate: "2026-01-15", xp: 150 },
  { id: 11, title: "OBSIDIAN RANK", desc: "Reach collector level 20 through consistent activity", rarity: "Epic", category: "Activity", status: "locked", progress: 12, total: 20, xp: 300 },
  { id: 12, title: "PHANTOM DROP", desc: "Acquire a release within 60 seconds of its drop", rarity: "Legendary", category: "Hunting", status: "locked", progress: 0, total: 1, xp: 500 },
  { id: 13, title: "ARCHIVIST", desc: "Catalog every release in a single collection era", rarity: "Epic", category: "Completion", status: "in-progress", progress: 14, total: 18, xp: 300 },
  { id: 14, title: "WHISPER NETWORK", desc: "Receive 3 private invitations from other collectors", rarity: "Rare", category: "Social", status: "locked", progress: 1, total: 3, xp: 150 },
  { id: 15, title: "IRON WILL", desc: "Maintain a 30-day collection streak", rarity: "Epic", category: "Activity", status: "in-progress", progress: 22, total: 30, xp: 300 },
];

const RC: Record<Rarity, string> = { Common: T.muted, Rare: T.cyan, Epic: T.purple, Legendary: T.pink };
const RO: Record<Rarity, number> = { Common: 0, Rare: 1, Epic: 2, Legendary: 3 };
const CATS: Category[] = ["Collection", "Completion", "Hunting", "Social", "Activity"];

// ─── ANIMATION KEYFRAMES ────────────────────────────────
const styleTag = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
@keyframes orbFloat { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(12px, -8px); } }
`;

// ─── HELPER COMPONENTS ──────────────────────────────────

const Bar = ({ v, m, c = T.pink, h = 6, showLabel = false }: { v: number; m: number; c?: string; h?: number; showLabel?: boolean }) => {
  const pct = Math.min((v / m) * 100, 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", height: h, background: T.dimmer, borderRadius: T.pill, overflow: "hidden", position: "relative" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${c}, ${c}cc)`,
          borderRadius: T.pill,
          boxShadow: `0 0 12px ${c}44`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{Math.round(pct)}%</span>
          <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{v}/{m}</span>
        </div>
      )}
    </div>
  );
};

const Pill = ({ active, children, onClick, c = T.purple }: { active?: boolean; children: React.ReactNode; onClick: () => void; c?: string }) => (
  <button onClick={onClick} style={{
    padding: "6px 16px", borderRadius: T.pill,
    border: `1px solid ${active ? c : T.border}`,
    background: active ? c + "18" : "transparent",
    color: active ? c : T.muted,
    fontFamily: T.mono, fontSize: 10, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: 1.2,
    cursor: "pointer", transition: "all 0.25s",
    whiteSpace: "nowrap",
  }}>{children}</button>
);

const Emblem = ({ rarity, locked, size = 40 }: { rarity: Rarity; locked: boolean; size?: number }) => {
  const c = locked ? T.dim : RC[rarity];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <polygon points="24,2 32,16 46,18 36,30 38,44 24,38 10,44 12,30 2,18 16,16"
        fill={locked ? "none" : c} opacity={locked ? 0.1 : 0.1}
        stroke={c} strokeWidth={1} />
      {locked ? (
        <g transform="translate(14,16)">
          <rect x="2" y="6" width="16" height="10" rx="2" fill={T.dim} opacity={0.5} />
          <path d="M6 6V4a4 4 0 018 0v2" stroke={T.dim} strokeWidth={1.5} fill="none" />
        </g>
      ) : (
        <>
          <circle cx={24} cy={24} r={5} fill={c} opacity={0.6} />
          <circle cx={24} cy={24} r={8} fill="none" stroke={c} opacity={0.15} strokeWidth={0.5} />
        </>
      )}
    </svg>
  );
};

const GlowOrb = ({ color, x, y, size, blur = 60 }: { color: string; x: string; y: string; size: number; blur?: number }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: size, height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
    pointerEvents: "none", filter: `blur(${blur}px)`,
    animation: "orbFloat 20s ease-in-out infinite",
  }} />
);

const RarityBadge = ({ rarity, locked }: { rarity: Rarity; locked: boolean }) => {
  const c = locked ? T.dim : RC[rarity];
  return (
    <span style={{
      fontSize: 8, padding: "2px 10px", borderRadius: T.pill,
      border: `1px solid ${c}44`,
      color: c, fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 1.2,
      background: locked ? "none" : c + "0d",
    }}>{rarity}</span>
  );
};

const SectionLabel = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 4, color: T.muted, fontFamily: T.mono }}>{children}</div>
    {sub && <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginTop: 2 }}>{sub}</div>}
  </div>
);

// ─── MAIN COMPONENT ─────────────────────────────────────
const AchievementsV5: React.FC = () => {
  const [cat, setCat] = useState<Category | "All">("All");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sort, setSort] = useState<"rarity" | "progress" | "newest">("rarity");
  const [detail, setDetail] = useState<Achievement | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const list = useMemo(() => {
    let l = [...DATA];
    if (cat !== "All") l = l.filter(a => a.category === cat);
    if (status !== "all") l = l.filter(a => a.status === status);
    l.sort((a, b) =>
      sort === "rarity" ? RO[b.rarity] - RO[a.rarity] :
      sort === "progress" ? (b.progress / b.total) - (a.progress / a.total) :
      (b.unlockDate || "").localeCompare(a.unlockDate || "")
    );
    return l;
  }, [cat, status, sort]);

  const unlocked = DATA.filter(a => a.status === "unlocked");
  const locked = DATA.filter(a => a.status === "locked");
  const inProgress = DATA.filter(a => a.status === "in-progress");
  const almost = DATA.filter(a => a.status === "in-progress" && a.progress / a.total >= 0.6);
  const pct = Math.round((unlocked.length / DATA.length) * 100);
  const totalXp = unlocked.reduce((s, a) => s + a.xp, 0);
  const rareCount = unlocked.filter(a => RO[a.rarity] >= 2).length;
  const legendaryCount = DATA.filter(a => a.rarity === "Legendary" && a.status === "unlocked").length;

  const rarest = DATA.find(a => a.featured === "rarest")!;
  const latest = DATA.find(a => a.featured === "latest")!;
  const pinnedAch = DATA.find(a => a.pinned)!;

  const rarityBreakdown = (["Common", "Rare", "Epic", "Legendary"] as Rarity[]).map(r => ({
    rarity: r,
    total: DATA.filter(a => a.rarity === r).length,
    unlocked: DATA.filter(a => a.rarity === r && a.status === "unlocked").length,
    color: RC[r],
  }));

  const catBreakdown = CATS.map(c => ({
    cat: c,
    total: DATA.filter(a => a.category === c).length,
    unlocked: DATA.filter(a => a.category === c && a.status === "unlocked").length,
  }));

  const anim = (delay: number) => mounted ? {
    animation: `fadeUp 0.5s ${delay}s both`,
  } : { opacity: 0 };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: T.font, position: "relative", overflow: "hidden" }}>
      <style>{styleTag}</style>

      {/* Background glow orbs */}
      <GlowOrb color={T.pink} x="-8%" y="2%" size={700} blur={80} />
      <GlowOrb color={T.purple} x="65%" y="10%" size={600} blur={70} />
      <GlowOrb color={T.cyan} x="30%" y="55%" size={450} blur={60} />
      <GlowOrb color={T.purple} x="80%" y="70%" size={350} blur={50} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "48px 40px 100px" }}>

        {/* ════════════════════════════════════════════════
            1. HERO — COLLECTOR IDENTITY
        ════════════════════════════════════════════════ */}
        <div style={{
          ...anim(0),
          textAlign: "center", marginBottom: 56, position: "relative",
          padding: "48px 0 40px",
        }}>
          {/* Subtle hero glow */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            width: 500, height: 300, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.pink}08 0%, ${T.purple}05 40%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Avatar */}
          <div style={{
            width: 120, height: 120, borderRadius: "50%", margin: "0 auto 24px",
            background: `conic-gradient(from 180deg, ${T.pink}, ${T.purple}, ${T.cyan}, ${T.pink})`,
            padding: 3, position: "relative",
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              background: T.bg, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 42, fontWeight: 900, letterSpacing: 2,
            }}>M</div>
            {/* Pulse ring */}
            <div style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              border: `1px solid ${T.pink}22`,
              animation: "pulseGlow 3s ease-in-out infinite",
            }} />
          </div>

          {/* Identity */}
          <div style={{ fontSize: 36, fontWeight: 900, textTransform: "uppercase", letterSpacing: 6, marginBottom: 6 }}>
            NOCTURNE
          </div>
          <div style={{
            fontSize: 12, fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 5,
            background: `linear-gradient(90deg, ${T.pink}, ${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 4,
          }}>
            ✦ ARCHIVE PHANTOM ✦
          </div>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 2, marginBottom: 20 }}>
            OBSIDIAN RANK · LEVEL 12 · TOP 12% COLLECTORS
          </div>

          {/* Level progress */}
          <div style={{ maxWidth: 300, margin: "0 auto" }}>
            <Bar v={12} m={20} c={T.purple} h={6} showLabel />
            <div style={{ fontSize: 8, color: T.dim, fontFamily: T.mono, marginTop: 2 }}>XP TO NEXT LEVEL</div>
          </div>

          {/* Social proof */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
            padding: "6px 18px", borderRadius: T.pill,
            border: `1px solid ${T.border}`,
            background: T.surface,
          }}>
            <span style={{ fontSize: 9, color: T.gold, fontFamily: T.mono }}>★</span>
            <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: 1 }}>
              {legendaryCount} LEGENDARY · {rareCount} EPIC+ UNLOCKS · {totalXp} XP EARNED
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            2. QUICK STATS ROW
        ════════════════════════════════════════════════ */}
        <div style={{ ...anim(0.1), display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 48 }}>
          {[
            { l: "SCORE", v: totalXp, c: T.pink },
            { l: "UNLOCKED", v: unlocked.length, c: T.purple },
            { l: "LOCKED", v: locked.length, c: T.dim },
            { l: "IN PROGRESS", v: inProgress.length, c: T.cyan },
            { l: "COMPLETE", v: `${pct}%`, c: T.cyan },
            { l: "STREAK", v: "14d", c: T.gold },
          ].map(s => (
            <div key={s.l} style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r,
              padding: "16px 12px", textAlign: "center",
              transition: "border-color 0.3s",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 7, color: T.muted, fontFamily: T.mono, letterSpacing: 1.5, marginTop: 6, textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            3. FEATURED SHOWCASE
        ════════════════════════════════════════════════ */}
        <div style={anim(0.15)}>
          <SectionLabel sub="Your most notable accomplishments">FEATURED SHOWCASE</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 16, marginBottom: 48 }}>
            {/* Rarest — large card */}
            {[
              { a: rarest, label: "RAREST ACHIEVEMENT", icon: "◆" },
              { a: latest, label: "LATEST UNLOCK", icon: "◇" },
              { a: pinnedAch, label: "PINNED TROPHY", icon: "⬡" },
            ].map(({ a, label, icon }, idx) => {
              const c = RC[a.rarity];
              const isMain = idx === 0;
              return (
                <div key={a.id} onClick={() => setDetail(a)} style={{
                  background: `linear-gradient(135deg, ${c}08, ${T.card})`,
                  border: `1px solid ${c}33`,
                  borderRadius: T.rLg, padding: isMain ? 28 : 22, cursor: "pointer",
                  position: "relative", overflow: "hidden",
                  transition: "all 0.35s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c + "66"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${c}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c + "33"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${c}12 0%, transparent 70%)` }} />
                  <div style={{ fontSize: 8, color: c, fontFamily: T.mono, letterSpacing: 3, marginBottom: 10 }}>{icon} {label}</div>
                  <Emblem rarity={a.rarity} locked={false} size={isMain ? 44 : 36} />
                  <div style={{ fontSize: isMain ? 18 : 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginTop: 10, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginBottom: 12, lineHeight: 1.6 }}>{a.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <RarityBadge rarity={a.rarity} locked={false} />
                    <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{a.xp} XP</span>
                    {a.unlockDate && <span style={{ fontSize: 8, color: T.dim, fontFamily: T.mono }}>{a.unlockDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            4. BREAKDOWN PANELS
        ════════════════════════════════════════════════ */}
        <div style={{ ...anim(0.2), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
          {/* Rarity breakdown */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 16 }}>BY RARITY</div>
            {rarityBreakdown.map(r => (
              <div key={r.rarity} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: r.color, fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 1 }}>{r.rarity}</span>
                  <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{r.unlocked}/{r.total}</span>
                </div>
                <Bar v={r.unlocked} m={r.total} c={r.color} h={4} />
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: T.muted, fontFamily: T.mono, marginBottom: 16 }}>BY CATEGORY</div>
            {catBreakdown.map(c => (
              <div key={c.cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: T.light, fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 1 }}>{c.cat}</span>
                  <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{c.unlocked}/{c.total}</span>
                </div>
                <Bar v={c.unlocked} m={c.total} c={T.purple} h={4} />
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            5. ALMOST THERE
        ════════════════════════════════════════════════ */}
        <div style={anim(0.25)}>
          <SectionLabel sub={`${almost.length} achievements within reach`}>ALMOST THERE</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 48 }}>
            {almost.map((a, i) => {
              const c = RC[a.rarity];
              const pctVal = Math.round((a.progress / a.total) * 100);
              return (
                <div key={a.id} onClick={() => setDetail(a)} style={{
                  background: T.card,
                  border: `1px solid ${T.purple}22`,
                  borderRadius: T.r, padding: 20, cursor: "pointer",
                  marginTop: i === 1 ? 14 : 0,
                  transition: "all 0.3s",
                  position: "relative", overflow: "hidden",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c + "55"; e.currentTarget.style.boxShadow = `0 0 24px ${c}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.purple + "22"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "absolute", right: 12, top: 12, fontSize: 20, fontWeight: 900, color: c, opacity: 0.12, fontFamily: T.mono }}>{pctVal}%</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Emblem rarity={a.rarity} locked={false} size={28} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.title}</div>
                      <div style={{ fontSize: 9, color: T.muted }}>{a.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <RarityBadge rarity={a.rarity} locked={false} />
                    <span style={{ fontSize: 9, color: c, fontFamily: T.mono, fontWeight: 600 }}>{a.progress}/{a.total}</span>
                    <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>+{a.xp} XP</span>
                  </div>
                  <Bar v={a.progress} m={a.total} c={c} h={5} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            6. FILTER BAR
        ════════════════════════════════════════════════ */}
        <div style={{ ...anim(0.3), display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, alignItems: "center" }}>
          <Pill active={cat === "All"} onClick={() => setCat("All")}>All</Pill>
          {CATS.map(c => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}
          <div style={{ width: 1, height: 20, background: T.border, margin: "0 4px" }} />
          {(["all", "unlocked", "locked", "in-progress"] as const).map(s => (
            <Pill key={s} active={status === s} onClick={() => setStatus(s)} c={T.pink}>
              {s === "all" ? "All" : s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Pill>
          ))}
          <div style={{ width: 1, height: 20, background: T.border, margin: "0 4px" }} />
          {(["rarity", "progress", "newest"] as const).map(s => (
            <Pill key={s} active={sort === s} onClick={() => setSort(s)} c={T.cyan}>{s}</Pill>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 9, color: T.dim, fontFamily: T.mono }}>{list.length} RESULTS</div>
        </div>

        {/* ════════════════════════════════════════════════
            7. MAIN ACHIEVEMENTS GRID
        ════════════════════════════════════════════════ */}
        <div style={{ ...anim(0.35), display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, gridAutoRows: "minmax(170px, auto)", marginBottom: 56 }}>
          {list.map((a, i) => {
            const lk = a.status === "locked";
            const ip = a.status === "in-progress";
            const c = RC[a.rarity];
            const isLegendary = a.rarity === "Legendary" && !lk;
            const isEpic = a.rarity === "Epic" && !lk;
            const isHovered = hoveredId === a.id;
            const span = isLegendary ? "span 2" : "span 1";

            return (
              <div key={a.id}
                onClick={() => setDetail(a)}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  gridColumn: isLegendary && i < 10 ? span : undefined,
                  background: isHovered && !lk ? `linear-gradient(145deg, ${c}0a, ${T.card})` : T.card,
                  border: `1px solid ${lk ? T.dimmer : isHovered ? c + "55" : c + "18"}`,
                  borderRadius: T.r,
                  padding: isLegendary ? 26 : 20,
                  cursor: "pointer",
                  opacity: lk ? 0.35 : 1,
                  transform: isHovered && !lk ? "translateY(-5px)" : "none",
                  boxShadow: isHovered && !lk ? `0 12px 36px ${c}28` : "none",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  position: "relative", overflow: "hidden",
                  display: "flex", flexDirection: "column",
                }}>
                {/* Corner glow for high rarity */}
                {(isLegendary || isEpic) && (
                  <div style={{
                    position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%",
                    background: `radial-gradient(circle, ${c}15 0%, transparent 70%)`, pointerEvents: "none",
                  }} />
                )}

                {/* Pinned indicator */}
                {a.pinned && !lk && (
                  <div style={{ position: "absolute", top: 10, right: 12, fontSize: 8, color: T.gold, fontFamily: T.mono, letterSpacing: 1 }}>⬡ PINNED</div>
                )}

                <Emblem rarity={a.rarity} locked={lk} size={isLegendary ? 44 : 36} />

                <div style={{
                  fontSize: isLegendary ? 14 : 11, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: isLegendary ? 2 : 1,
                  color: lk ? T.dim : T.white, marginTop: 8, marginBottom: 4,
                }}>{a.title}</div>

                <div style={{
                  fontSize: isLegendary ? 10 : 9, color: T.muted, marginBottom: 10,
                  lineHeight: 1.5, flex: 1,
                }}>{a.desc}</div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ip ? 8 : 0, flexWrap: "wrap", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <RarityBadge rarity={a.rarity} locked={lk} />
                    {!lk && <span style={{ fontSize: 8, color: T.dim, fontFamily: T.mono }}>{a.xp} XP</span>}
                  </div>
                  {a.status === "unlocked" && a.unlockDate && (
                    <span style={{ fontSize: 8, color: T.dim, fontFamily: T.mono }}>{a.unlockDate}</span>
                  )}
                  {ip && <span style={{ fontSize: 9, color: c, fontFamily: T.mono, fontWeight: 600 }}>{a.progress}/{a.total}</span>}
                </div>
                {ip && <Bar v={a.progress} m={a.total} c={c} h={4} />}
                {lk && a.progress > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 8, color: T.dim, fontFamily: T.mono, marginBottom: 3 }}>{a.progress}/{a.total} tracked</div>
                    <Bar v={a.progress} m={a.total} c={T.dim} h={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════
            8. TIMELINE — RECENT UNLOCKS
        ════════════════════════════════════════════════ */}
        <div style={anim(0.4)}>
          <SectionLabel sub="Your collector journey">RECENT UNLOCKS</SectionLabel>
          <div style={{ position: "relative", paddingLeft: 32, marginBottom: 40 }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 7, top: 0, bottom: 0, width: 1,
              background: `linear-gradient(to bottom, ${T.pink}44, ${T.purple}22, transparent)`,
            }} />

            {unlocked
              .sort((a, b) => (b.unlockDate || "").localeCompare(a.unlockDate || ""))
              .map((a, i) => {
                const c = RC[a.rarity];
                return (
                  <div key={a.id} style={{ marginBottom: 20, position: "relative" }}>
                    {/* Dot */}
                    <div style={{
                      position: "absolute", left: -29, top: 8,
                      width: 10, height: 10, borderRadius: "50%",
                      background: c, boxShadow: `0 0 8px ${c}66`,
                    }} />

                    <div onClick={() => setDetail(a)} style={{
                      background: T.card, border: `1px solid ${T.border}`,
                      borderRadius: T.r, padding: 18, cursor: "pointer",
                      transition: "all 0.3s",
                      display: "flex", alignItems: "center", gap: 16,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = c + "44"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
                    >
                      <Emblem rarity={a.rarity} locked={false} size={32} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.title}</span>
                          <RarityBadge rarity={a.rarity} locked={false} />
                        </div>
                        <div style={{ fontSize: 9, color: T.muted }}>{a.desc}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono }}>{a.unlockDate}</div>
                        <div style={{ fontSize: 9, color: c, fontFamily: T.mono, marginTop: 2 }}>+{a.xp} XP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════
          DETAIL MODAL
      ════════════════════════════════════════════════ */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{
          position: "fixed", inset: 0,
          background: "rgba(3,3,8,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(16px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, border: `1px solid ${RC[detail.rarity]}44`,
            borderRadius: T.rLg, padding: 40,
            maxWidth: 520, width: "92%", position: "relative", overflow: "hidden",
            boxShadow: `0 0 80px ${RC[detail.rarity]}18, 0 0 160px ${RC[detail.rarity]}0a`,
            animation: "fadeUp 0.3s both",
          }}>
            {/* Decorative glow */}
            <div style={{
              position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%",
              background: `radial-gradient(circle, ${RC[detail.rarity]}10 0%, transparent 70%)`,
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: RC[detail.rarity], fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 3 }}>✦ {detail.rarity}</span>
                {detail.pinned && <span style={{ fontSize: 8, color: T.gold, fontFamily: T.mono }}>⬡ PINNED</span>}
              </div>
              <button onClick={() => setDetail(null)} style={{
                background: "none", border: `1px solid ${T.border}`, borderRadius: "50%",
                width: 32, height: 32, color: T.muted, fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.2s",
              }}>×</button>
            </div>

            <Emblem rarity={detail.rarity} locked={detail.status === "locked"} size={48} />

            <div style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 3, marginTop: 16, marginBottom: 6 }}>
              {detail.title}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>{detail.desc}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { l: "Category", v: detail.category },
                { l: "Status", v: detail.status, c: detail.status === "unlocked" ? T.pink : T.muted },
                { l: "Value", v: `${detail.xp} XP` },
                { l: detail.unlockDate ? "Unlocked" : "Progress", v: detail.unlockDate || `${detail.progress}/${detail.total}` },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 7, color: T.dim, fontFamily: T.mono, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: (s as any).c || T.white, textTransform: "capitalize" }}>{s.v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted, fontFamily: T.mono, marginBottom: 6 }}>
              <span>PROGRESS</span>
              <span>{detail.progress}/{detail.total} ({Math.round((detail.progress / detail.total) * 100)}%)</span>
            </div>
            <Bar v={detail.progress} m={detail.total} c={RC[detail.rarity]} h={8} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsV5;
