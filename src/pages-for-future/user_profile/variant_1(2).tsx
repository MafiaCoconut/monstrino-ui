/**
 * Variant 1: "The Museum" — Production-refined
 * Dark cinematic gallery, neon accents, showcase-driven collector profile.
 */
import React, { useState } from "react";

/* ── Design Tokens ── */
const C = {
  bg: "#07070c",
  bgDeep: "#0a0a12",
  bgCard: "#101018",
  bgCardHover: "#161624",
  bgElevated: "#0d0d16",
  bgGlass: "rgba(16,16,24,0.85)",
  bgSurface: "#131320",

  pink: "#ff2d8a",
  pinkSoft: "#ff5ca3",
  pinkMuted: "rgba(255,45,138,0.10)",
  pinkGlow: "0 0 24px rgba(255,45,138,0.2)",
  pinkBorder: "rgba(255,45,138,0.25)",

  purple: "#9945ff",
  purpleSoft: "#b374ff",
  purpleMuted: "rgba(153,69,255,0.10)",
  purpleGlow: "0 0 20px rgba(153,69,255,0.18)",
  purpleBorder: "rgba(153,69,255,0.25)",

  cyan: "#00d4ee",
  cyanMuted: "rgba(0,212,238,0.08)",
  cyanBorder: "rgba(0,212,238,0.2)",

  text: "#e8e8f4",
  textSoft: "#9898b4",
  textDim: "#555570",
  textGhost: "#3a3a52",

  border: "#1a1a2c",
  borderSubtle: "#14141f",
  borderHover: "#2a2a42",
  borderActive: "#3a3a58",

  shadow: "0 8px 40px rgba(0,0,0,0.6)",
  shadowDeep: "0 16px 60px rgba(0,0,0,0.7)",
};

const F = {
  display: "'Georgia', 'Playfair Display', serif",
  body: "'Inter', 'Segoe UI', system-ui, sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
};

/* ── Helpers ── */
const Dot = ({ color, size = 5 }: { color: string; size?: number }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}88` }} />
);

const ShowcaseHeader = ({
  title, subtitle, accent = C.pink, tag, tagColor,
}: { title: string; subtitle?: string; accent?: string; tag?: string; tagColor?: string }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 5 : 0 }}>
        <Dot color={accent} size={6} />
        <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 400, color: C.text, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
        {tag && (
          <span style={{
            fontSize: 9, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: 1.5,
            color: tagColor || C.textDim, background: `${tagColor || C.textDim}15`,
            padding: "2px 8px", borderRadius: 4, border: `1px solid ${tagColor || C.textDim}30`,
          }}>{tag}</span>
        )}
      </div>
      {subtitle && <p style={{ fontFamily: F.body, fontSize: 12, color: C.textDim, margin: 0, paddingLeft: 16, fontStyle: "italic" }}>{subtitle}</p>}
    </div>
    <button
      style={{
        background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6,
        padding: "4px 10px", color: C.textDim, fontSize: 14, cursor: "pointer",
        transition: "all 0.15s", lineHeight: 1, marginTop: 2,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textSoft; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
      title="Showcase options"
    >⋯</button>
  </div>
);

/* ── Avatar ── */
const ProfileAvatar = ({ size = 120 }: { size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: `linear-gradient(135deg, ${C.pink} 0%, ${C.purple} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.36, fontFamily: F.display, color: "#fff", fontWeight: 700,
    border: `3px solid ${C.pink}`,
    boxShadow: `0 0 40px rgba(255,45,138,0.2), 0 0 80px rgba(153,69,255,0.1)`,
  }}>L</div>
);

/* ── Stat ── */
const StatPill = ({ label, value, accent = C.pink }: { label: string; value: string; accent?: string }) => (
  <button style={{
    background: `${accent}0d`, border: `1px solid ${accent}28`, borderRadius: 18,
    padding: "5px 16px", cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 0, transition: "all 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = `${accent}1a`; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = `${accent}0d`; e.currentTarget.style.transform = "none"; }}
  >
    <span style={{ color: accent, fontSize: 17, fontWeight: 700, fontFamily: F.display, lineHeight: 1.3 }}>{value}</span>
    <span style={{ color: C.textDim, fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: F.body }}>{label}</span>
  </button>
);

/* ── Doll Card ── */
const DollCard = ({ name, line, year, hue, size = "normal" }: {
  name: string; line: string; year: string; hue: string; size?: "large" | "normal" | "compact"
}) => {
  const isLarge = size === "large";
  const isCompact = size === "compact";
  return (
    <div style={{
      position: "relative", borderRadius: isCompact ? 10 : 12, overflow: "hidden",
      background: C.bgCard, border: `1px solid ${C.border}`,
      cursor: "pointer", transition: "all 0.25s ease",
      aspectRatio: isLarge ? "3/4" : isCompact ? "1/1" : "2/3",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.pinkBorder;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), ${C.pinkGlow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: "100%", height: isCompact ? "58%" : "70%",
        background: `radial-gradient(ellipse at 50% 40%, ${hue}88 0%, ${C.bgCard} 80%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: isLarge ? 52 : isCompact ? 26 : 36,
      }}>🎀</div>
      <div style={{ padding: isLarge ? 16 : isCompact ? 8 : 11 }}>
        <div style={{ color: C.text, fontSize: isLarge ? 14 : isCompact ? 10 : 12, fontWeight: 600, fontFamily: F.display, marginBottom: 2, lineHeight: 1.3 }}>{name}</div>
        {!isCompact && <div style={{ color: C.textDim, fontSize: 10, fontFamily: F.body }}>{line} · {year}</div>}
      </div>
    </div>
  );
};

/* ── Badge ── */
const AchievementBadge = ({ icon, name, rarity }: { icon: string; name: string; rarity: "legendary" | "rare" | "common" }) => {
  const color = rarity === "legendary" ? C.pink : rarity === "rare" ? C.purple : C.cyan;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      padding: 12, background: C.bgCard, borderRadius: 12,
      border: `1px solid ${C.border}`, minWidth: 80, transition: "all 0.25s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.boxShadow = `0 0 14px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ color: C.text, fontSize: 10, fontWeight: 600, textAlign: "center", fontFamily: F.body, lineHeight: 1.3 }}>{name}</span>
      <span style={{ color, fontSize: 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, fontFamily: F.mono }}>{rarity}</span>
    </div>
  );
};

/* ── Review ── */
const ReviewCard = ({ title, excerpt, rating, date }: { title: string; excerpt: string; rating: number; date: string }) => (
  <div style={{
    background: C.bgCard, borderRadius: 12, padding: 16,
    border: `1px solid ${C.border}`, transition: "border-color 0.2s", cursor: "pointer",
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHover}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ color: C.pink, fontSize: 12, letterSpacing: 2 }}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      <span style={{ color: C.textDim, fontSize: 10, fontFamily: F.mono }}>{date}</span>
    </div>
    <h4 style={{ color: C.text, fontFamily: F.display, fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{title}</h4>
    <p style={{ color: C.textSoft, fontSize: 11, lineHeight: 1.5, margin: 0, fontFamily: F.body }}>{excerpt}</p>
  </div>
);

/* ── Friend ── */
const FriendBubble = ({ name, initial }: { name: string; initial: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: `hsl(${name.charCodeAt(0) * 7 % 360}, 45%, 28%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: C.text, fontWeight: 700, fontSize: 14, fontFamily: F.display,
      border: `2px solid ${C.border}`, transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.purpleBorder}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >{initial}</div>
    <span style={{ color: C.textDim, fontSize: 9, fontFamily: F.body }}>{name}</span>
  </div>
);

/* ── Activity ── */
const activityTypeStyles: Record<string, { bg: string; border: string }> = {
  add: { bg: C.pinkMuted, border: C.pinkBorder },
  review: { bg: C.purpleMuted, border: C.purpleBorder },
  social: { bg: C.cyanMuted, border: C.cyanBorder },
  achievement: { bg: "rgba(255,200,50,0.08)", border: "rgba(255,200,50,0.2)" },
  article: { bg: C.purpleMuted, border: C.purpleBorder },
};

const ActivityItem = ({ text, time, icon, type = "add" }: { text: string; time: string; icon: string; type?: string }) => {
  const s = activityTypeStyles[type] || activityTypeStyles.add;
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${C.borderSubtle}` }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
        background: s.bg, border: `1px solid ${s.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ color: C.textSoft, fontSize: 11, margin: 0, fontFamily: F.body, lineHeight: 1.5 }}>{text}</p>
        <span style={{ color: C.textGhost, fontSize: 9, fontFamily: F.mono }}>{time}</span>
      </div>
    </div>
  );
};

/* ── Group Pill ── */
const GroupPill = ({ name, members, icon }: { name: string; members: number; icon: string }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
    background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`,
    cursor: "pointer", transition: "border-color 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHover}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    <div>
      <div style={{ color: C.text, fontSize: 11, fontWeight: 600, fontFamily: F.body }}>{name}</div>
      <div style={{ color: C.textDim, fontSize: 9, fontFamily: F.mono }}>{members} members</div>
    </div>
  </div>
);

/* ── Nav Tab ── */
const NavTab = ({ label, active = false }: { label: string; active?: boolean }) => (
  <button style={{
    background: active ? C.pinkMuted : "transparent",
    border: `1px solid ${active ? C.pinkBorder : "transparent"}`,
    borderRadius: 8, padding: "6px 16px",
    color: active ? C.pink : C.textDim, fontSize: 12, fontWeight: 500,
    cursor: "pointer", fontFamily: F.body, transition: "all 0.15s",
    letterSpacing: 0.3,
  }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.textSoft; e.currentTarget.style.background = C.bgCard; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.textDim; e.currentTarget.style.background = "transparent"; }}}
  >{label}</button>
);

/* ── Identity Tag ── */
const IdentityTag = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 10, fontFamily: F.mono, color: C.textSoft,
    background: `${color}0a`, border: `1px solid ${color}20`,
    padding: "3px 10px", borderRadius: 6,
  }}>
    <Dot color={color} size={4} />
    <span style={{ color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
    <span style={{ color }}>{value}</span>
  </span>
);

/* ════════════════════════════════════ MAIN ════════════════════════════════════ */

export default function Variant1() {
  const [activeTab] = useState("collection");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: F.body }}>

      {/* ── AMBIENT BG ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60vh", pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 30% 0%, rgba(153,69,255,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 70% 10%, rgba(255,45,138,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* ── HERO ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "64px 0 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 36px" }}>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-end" }}>
            <ProfileAvatar size={120} />
            <div style={{ flex: 1, paddingBottom: 4 }}>

              {/* Name + badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <h1 style={{ fontFamily: F.display, fontSize: 34, fontWeight: 400, margin: 0, letterSpacing: -0.8 }}>Luna Nightshade</h1>
                <span style={{
                  fontSize: 9, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: 1.8,
                  color: C.pink, background: C.pinkMuted, padding: "2px 9px", borderRadius: 5,
                  border: `1px solid ${C.pinkBorder}`,
                }}>OG Collector</span>
              </div>

              {/* Bio */}
              <p style={{ color: C.textSoft, fontSize: 13, margin: "0 0 10px", lineHeight: 1.6, maxWidth: 480, fontStyle: "italic" }}>
                Curator of darkness & glamour. Collecting Monster High since 2010. Specializing in first wave dolls and custom repaints.
              </p>

              {/* Identity tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <IdentityTag label="Era" value="G1" color={C.pink} />
                <IdentityTag label="Focus" value="Customs & Rares" color={C.purple} />
                <IdentityTag label="Aesthetic" value="Gothic Neon" color={C.cyan} />
              </div>

              {/* Stats + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <StatPill value="347" label="Dolls" accent={C.pink} />
                <StatPill value="128" label="Friends" accent={C.purple} />
                <StatPill value="12" label="Groups" accent={C.purple} />
                <StatPill value="89" label="Reviews" accent={C.cyan} />
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button style={{
                    background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                    border: "none", borderRadius: 8, padding: "7px 20px",
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: F.body, boxShadow: C.pinkGlow, transition: "transform 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >Follow</button>
                  <button style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "7px 14px", color: C.textDim, fontSize: 12, cursor: "pointer",
                    fontFamily: F.body, transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHover}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                  >Message</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── NAV TABS ── */}
          <div style={{ display: "flex", gap: 4, marginTop: 28, paddingBottom: 0, transform: "translateY(1px)" }}>
            <NavTab label="Collection" active={activeTab === "collection"} />
            <NavTab label="Customs" />
            <NavTab label="Reviews" />
            <NavTab label="Articles" />
            <NavTab label="Friends" />
            <NavTab label="Groups" />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto", padding: "48px 36px 80px" }}>

        {/* Edit showcases bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button style={{
            background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "5px 14px", color: C.textDim, fontSize: 11, cursor: "pointer",
            fontFamily: F.mono, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textSoft; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
          >
            <span style={{ fontSize: 13 }}>✎</span> Edit Showcases
          </button>
        </div>

        {/* ═══ SHOWCASE 1: Crown Jewels — Curated / Hero ═══ */}
        <section style={{ marginBottom: 60 }}>
          <ShowcaseHeader title="Crown Jewels" subtitle="Most prized pieces — the heart of the collection" accent={C.pink} tag="Curated" tagColor={C.pink} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
              <DollCard name="Draculaura First Wave" line="Original Collection" year="2010" hue="#3a1048" size="large" />
            </div>
            <DollCard name="Frankie Stein" line="Dawn of the Dance" year="2010" hue="#102030" />
            <DollCard name="Clawdeen Wolf" line="Gloom Beach" year="2011" hue="#302010" />
            <DollCard name="Cleo de Nile" line="Original Collection" year="2010" hue="#303018" />
            <DollCard name="Lagoona Blue" line="Dead Tired" year="2011" hue="#0e2838" />
            <DollCard name="Abbey Bominable" line="Original" year="2011" hue="#181838" />
          </div>
        </section>

        {/* ═══ SHOWCASE 2: Neon Dreams — Themed / Horizontal ═══ */}
        <section style={{ marginBottom: 60 }}>
          <ShowcaseHeader title="Neon Dreams" subtitle="Theme: Electrifying repaints & OOAKs" accent={C.purple} tag="Theme" tagColor={C.purple} />
          <div style={{
            display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10,
            scrollbarWidth: "thin", scrollbarColor: `${C.textGhost} transparent`,
          }}>
            {[
              { name: "Neon Draculaura", line: "Custom Repaint", year: "2023" },
              { name: "Cyber Frankie", line: "Custom OOAK", year: "2023" },
              { name: "Glitch Clawdeen", line: "Custom Repaint", year: "2022" },
              { name: "Plasma Lagoona", line: "Custom OOAK", year: "2024" },
              { name: "Void Spectra", line: "Custom Repaint", year: "2023" },
              { name: "Aurora Skelita", line: "Custom OOAK", year: "2024" },
            ].map(d => (
              <div key={d.name} style={{ minWidth: 170, flex: "0 0 170px" }}>
                <DollCard name={d.name} line={d.line} year={d.year} hue="#200838" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHOWCASE 3: My Customs — Highlight ═══ */}
        <section style={{ marginBottom: 60 }}>
          <ShowcaseHeader title="My Customs" subtitle="Original creations and one-of-a-kind repaints" accent={C.cyan} tag="Highlight" tagColor={C.cyan} />
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
            <div style={{ gridRow: "1 / 3" }}>
              <DollCard name="Midnight Draculaura" line="Full Custom OOAK" year="2024" hue="#1a0830" size="large" />
            </div>
            <DollCard name="Chrome Frankie" line="Custom Repaint" year="2023" hue="#0a1828" />
            <DollCard name="Prism Clawdeen" line="Custom OOAK" year="2024" hue="#180a28" />
            <DollCard name="Ghost Lagoona" line="Custom Repaint" year="2023" hue="#081820" />
            <DollCard name="Solar Cleo" line="Custom OOAK" year="2024" hue="#201808" />
          </div>
        </section>

        {/* ═══ ACHIEVEMENTS ═══ */}
        <section style={{ marginBottom: 60 }}>
          <ShowcaseHeader title="Achievements" subtitle="Milestones unlocked along the way" accent={C.pink} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AchievementBadge icon="👑" name="OG Collector" rarity="legendary" />
            <AchievementBadge icon="🎨" name="Custom Artist" rarity="rare" />
            <AchievementBadge icon="📝" name="Top Reviewer" rarity="rare" />
            <AchievementBadge icon="🌟" name="First 100" rarity="legendary" />
            <AchievementBadge icon="🤝" name="Community Pillar" rarity="rare" />
            <AchievementBadge icon="📸" name="Photo Master" rarity="common" />
            <AchievementBadge icon="🔥" name="30-Day Streak" rarity="common" />
          </div>
        </section>

        {/* ═══ THREE-COLUMN SECONDARY ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 60 }}>

          {/* Reviews */}
          <section>
            <ShowcaseHeader title="Reviews" accent={C.pink} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ReviewCard title="Haunt Couture Draculaura" excerpt="Exceeded every expectation. The fabric, sculpt, packaging — flawless." rating={5} date="Mar 28" />
              <ReviewCard title="G3 vs G1: Honest Take" excerpt="New gen has charm but misses the edge we loved from originals." rating={4} date="Mar 15" />
            </div>
          </section>

          {/* Friends */}
          <section>
            <ShowcaseHeader title="Collector Circle" accent={C.purple} />
            <div style={{
              background: C.bgCard, borderRadius: 12, padding: 16,
              border: `1px solid ${C.border}`,
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14,
            }}>
              {[
                { n: "Raven", i: "R" }, { n: "Ember", i: "E" }, { n: "Violet", i: "V" }, { n: "Jade", i: "J" },
                { n: "Scarlett", i: "S" }, { n: "Nyx", i: "N" }, { n: "Dahlia", i: "D" }, { n: "Storm", i: "S" },
              ].map(f => <FriendBubble key={f.n} name={f.n} initial={f.i} />)}
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <span style={{ color: C.purple, fontSize: 10, cursor: "pointer", fontFamily: F.mono }}>View all 128 →</span>
            </div>
          </section>

          {/* Groups */}
          <section>
            <ShowcaseHeader title="Groups" accent={C.cyan} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <GroupPill name="Monster High OGs" members={2340} icon="🏰" />
              <GroupPill name="Custom Repainters" members={890} icon="🎨" />
              <GroupPill name="Doll Photography" members={1560} icon="📸" />
              <GroupPill name="G1 Preservation" members={450} icon="🗝️" />
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <span style={{ color: C.cyan, fontSize: 10, cursor: "pointer", fontFamily: F.mono }}>All 12 groups →</span>
            </div>
          </section>
        </div>

        {/* ═══ SHOWCASE 4: Recently Added — Auto ═══ */}
        <section style={{ marginBottom: 60 }}>
          <ShowcaseHeader title="Recently Added" subtitle="Automatically updated as new items arrive" accent={C.pink} tag="Auto" tagColor={C.textDim} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {[
              "Howliday Draculaura", "Skulltimate Frankie", "Boo-riginal Clawdeen",
              "Reel Drama Lagoona", "Costume Ball Cleo", "Monster Ball Ghoulia",
            ].map(name => (
              <DollCard key={name} name={name} line="" year="" hue="#140a1e" size="compact" />
            ))}
          </div>
        </section>

        {/* ═══ ACTIVITY ═══ */}
        <section>
          <ShowcaseHeader title="Recent Activity" accent={C.purple} />
          <div style={{ background: C.bgCard, borderRadius: 12, padding: "2px 20px", border: `1px solid ${C.border}` }}>
            <ActivityItem icon="✨" text='Added "Howliday Draculaura" to Crown Jewels' time="2 hours ago" type="add" />
            <ActivityItem icon="⭐" text='Wrote a 5-star review for "Haunt Couture Draculaura"' time="3 hours ago" type="review" />
            <ActivityItem icon="🤝" text="Became friends with Ember" time="1 day ago" type="social" />
            <ActivityItem icon="🏆" text='Unlocked "First 100 Dolls" achievement' time="2 days ago" type="achievement" />
            <ActivityItem icon="📝" text='Published: "The Art of Custom Repaints"' time="4 days ago" type="article" />
          </div>
        </section>
      </div>
    </div>
  );
}
