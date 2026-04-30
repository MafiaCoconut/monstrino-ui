import React, { useState, useMemo } from "react";

// === DATA ===

const FRIENDS = [
  {
    id: 1, name: "Maren Foxglove", username: "@marenfox", avatar: "MF",
    bio: "G1 restoration artist & pattern maker", dolls: 187, mutuals: 5,
    tags: ["G1 Collector", "Custom Artist"], overlap: 14, activity: "active",
    sharedInterests: ["G1 Earth Ponies", "Bait Restorations"],
    sharedItems: ["Wind Whistler G1", "Firefly Rehair", "Moondancer NM"],
    lastActive: "2h ago", collection: ["🦄", "🌸", "✨"],
    accent: "#EC4899",
  },
  {
    id: 2, name: "Suki Delacroix", username: "@sukidolls", avatar: "SD",
    bio: "Monster High OOAK & face-up specialist", dolls: 93, mutuals: 12,
    tags: ["OOAK Artist", "Face-up"], overlap: 8, activity: "active",
    sharedInterests: ["Monster High", "Repaints"],
    sharedItems: ["Draculaura Wave 1"],
    lastActive: "5h ago", collection: ["💀", "🎨", "🖌️"],
    accent: "#A855F7",
  },
  {
    id: 3, name: "Tobias Wren", username: "@tobiascollects", avatar: "TW",
    bio: "Vintage Barbie archivist & historian", dolls: 412, mutuals: 3,
    tags: ["Vintage Collector", "Archivist"], overlap: 3, activity: "moderate",
    sharedInterests: ["Vintage Dolls"],
    sharedItems: [],
    lastActive: "1d ago", collection: ["👗", "📚", "🏛️"],
    accent: "#22D3EE",
  },
  {
    id: 4, name: "Liora Patel", username: "@lioramakes", avatar: "LP",
    bio: "Miniature furniture & diorama creator", dolls: 56, mutuals: 8,
    tags: ["Diorama Artist", "Miniaturist"], overlap: 6, activity: "active",
    sharedInterests: ["Dioramas", "1:6 Scale"],
    sharedItems: ["Lundby Kitchen Set"],
    lastActive: "3h ago", collection: ["🪑", "🏠", "🎭"],
    accent: "#EC4899",
  },
  {
    id: 5, name: "Ren Castillo", username: "@rencastillo", avatar: "RC",
    bio: "BJD enthusiast & resin caster", dolls: 28, mutuals: 2,
    tags: ["BJD Collector", "Resin Caster"], overlap: 2, activity: "quiet",
    sharedInterests: ["BJD", "Resin Casting"],
    sharedItems: [],
    lastActive: "3d ago", collection: ["🎭", "🔮", "⚗️"],
    accent: "#7C3AED",
  },
  {
    id: 6, name: "Hana Okamoto", username: "@hanadolly", avatar: "HO",
    bio: "Blythe customizer & sewing enthusiast", dolls: 134, mutuals: 7,
    tags: ["Blythe Artist", "Seamstress"], overlap: 11, activity: "active",
    sharedInterests: ["Blythe", "Doll Fashion"],
    sharedItems: ["Kenner Blythe Original"],
    lastActive: "1h ago", collection: ["👁️", "🧵", "✂️"],
    accent: "#EC4899",
  },
  {
    id: 7, name: "Dex Moreau", username: "@dexmor", avatar: "DM",
    bio: "Horror doll collector & photographer", dolls: 67, mutuals: 4,
    tags: ["Horror Collector", "Photographer"], overlap: 5, activity: "moderate",
    sharedInterests: ["Horror Dolls", "Photography"],
    sharedItems: ["Living Dead Dolls S1"],
    lastActive: "12h ago", collection: ["📷", "🖤", "🕷️"],
    accent: "#A855F7",
  },
  {
    id: 8, name: "Noor Al-Rashid", username: "@noorcollects", avatar: "NR",
    bio: "Rainbow High & fashion doll curator", dolls: 205, mutuals: 9,
    tags: ["Fashion Collector", "Curator"], overlap: 9, activity: "active",
    sharedInterests: ["Rainbow High", "Fashion Dolls"],
    sharedItems: ["Jett Dawson S1", "Amaya Raine"],
    lastActive: "30m ago", collection: ["🌈", "👠", "💅"],
    accent: "#22D3EE",
  },
];

const SUGGESTED = [
  { name: "Ivy Thornton", username: "@ivythorn", avatar: "IT", reason: "4 mutual friends · Pullip collector" },
  { name: "Marco Soleil", username: "@marcosoleil", avatar: "MS", reason: "Shares 6 items with you" },
  { name: "Zara Kim", username: "@zarakim", avatar: "ZK", reason: "Both collect BJD resin" },
];

type ViewMode = "gallery" | "network";

// === STYLES ===

const S = {
  bg: "#0D0D0D",
  bgCard: "#141417",
  bgCardHover: "#1A1A20",
  bgSurface: "#111114",
  bgInput: "#18181C",
  border: "#222228",
  borderHover: "#333340",
  text: "#FFFFFF",
  textMuted: "#888892",
  textDim: "#555560",
  pink: "#EC4899",
  pinkDark: "#DB2777",
  purple: "#9333EA",
  purpleLight: "#A855F7",
  cyan: "#22D3EE",
  glowPink: "0 0 20px rgba(236,72,153,0.3)",
  glowPurple: "0 0 20px rgba(147,51,234,0.3)",
  glowCyan: "0 0 20px rgba(34,211,238,0.2)",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  radius: 14,
};

// === COMPONENTS ===

function GlowAvatar({ initials, size = 56, accent, glow = false }: { initials: string; size?: number; accent: string; glow?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
      border: `2px solid ${accent}${glow ? "90" : "40"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.32, color: accent,
      fontFamily: S.mono, letterSpacing: "0.05em",
      boxShadow: glow ? `0 0 24px ${accent}30, inset 0 0 12px ${accent}10` : "none",
      transition: "all 0.3s ease",
    }}>
      {initials}
    </div>
  );
}

function TagPill({ label, accent }: { label: string; accent: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "3px 10px", borderRadius: 20,
      background: `${accent}12`, color: accent, border: `1px solid ${accent}20`,
      fontFamily: S.mono,
    }}>{label}</span>
  );
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: S.text, fontFamily: S.mono }}>{value}</div>
      <div style={{ fontSize: 9, fontWeight: 600, color: S.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// Gallery Card
function FriendCard({ friend, onSelect }: { friend: typeof FRIENDS[0]; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? S.bgCardHover : S.bgCard,
        border: `1px solid ${hovered ? friend.accent + "40" : S.border}`,
        borderRadius: S.radius, padding: 22, cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${friend.accent}15` : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Subtle top gradient line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${friend.accent}${hovered ? "80" : "30"}, transparent)`,
        transition: "all 0.3s ease",
      }} />

      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <GlowAvatar initials={friend.avatar} size={50} accent={friend.accent} glow={hovered} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: S.text, marginBottom: 2 }}>{friend.name}</div>
          <div style={{ fontSize: 12, color: S.textDim, fontFamily: S.mono }}>{friend.username}</div>
        </div>
        <div style={{
          fontSize: 10, color: friend.activity === "active" ? "#22C55E" : S.textDim,
          fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: friend.activity === "active" ? "#22C55E" : friend.activity === "moderate" ? "#F59E0B" : S.textDim,
          }} />
          {friend.lastActive}
        </div>
      </div>

      <p style={{ fontSize: 13, color: S.textMuted, lineHeight: 1.5, margin: "0 0 12px" }}>{friend.bio}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {friend.tags.map(t => <TagPill key={t} label={t} accent={friend.accent} />)}
      </div>

      {/* Collection preview */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 14,
      }}>
        {friend.collection.map((c, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${friend.accent}08`, border: `1px solid ${friend.accent}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>{c}</div>
        ))}
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: S.bgSurface, border: `1px solid ${S.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: S.textDim, fontWeight: 700, fontFamily: S.mono,
        }}>+{friend.dolls}</div>
      </div>

      {/* Shared context footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: `1px solid ${S.border}`,
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ fontSize: 11, color: S.textDim }}>
            <span style={{ color: friend.accent, fontWeight: 700, fontFamily: S.mono }}>{friend.mutuals}</span> mutual
          </div>
          <div style={{ fontSize: 11, color: S.textDim }}>
            <span style={{ color: friend.accent, fontWeight: 700, fontFamily: S.mono }}>{friend.overlap}</span> shared
          </div>
        </div>
        {friend.sharedInterests.length > 0 && (
          <div style={{ fontSize: 10, color: S.textMuted }}>
            {friend.sharedInterests[0]}
          </div>
        )}
      </div>
    </div>
  );
}

// Network Node
function NetworkNode({ friend, isSelected, onSelect }: { friend: typeof FRIENDS[0]; isSelected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const strength = Math.min(friend.overlap / 15, 1);
  const baseSize = 52 + strength * 28;
  const active = isSelected || hovered;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        padding: "20px 12px", borderRadius: 16, cursor: "pointer",
        background: active ? `${friend.accent}08` : "transparent",
        border: `1px solid ${active ? friend.accent + "30" : "transparent"}`,
        transition: "all 0.3s ease",
        transform: active ? "scale(1.05)" : "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <GlowAvatar initials={friend.avatar} size={baseSize} accent={friend.accent} glow={active} />
        {/* Strength ring */}
        <svg width={baseSize + 12} height={baseSize + 12} style={{
          position: "absolute", top: -6, left: -6, transform: "rotate(-90deg)",
        }}>
          <circle cx={(baseSize + 12) / 2} cy={(baseSize + 12) / 2} r={(baseSize + 4) / 2}
            fill="none" stroke={`${friend.accent}15`} strokeWidth={2} />
          <circle cx={(baseSize + 12) / 2} cy={(baseSize + 12) / 2} r={(baseSize + 4) / 2}
            fill="none" stroke={friend.accent} strokeWidth={2}
            strokeDasharray={Math.PI * (baseSize + 4)}
            strokeDashoffset={Math.PI * (baseSize + 4) * (1 - strength)}
            strokeLinecap="round"
            style={{ transition: "all 0.5s ease", opacity: active ? 0.8 : 0.4 }}
          />
        </svg>
        {/* Overlap badge */}
        <div style={{
          position: "absolute", bottom: -2, right: -2,
          width: 22, height: 22, borderRadius: "50%",
          background: S.bg, border: `2px solid ${friend.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, color: friend.accent, fontFamily: S.mono,
        }}>{friend.overlap}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: S.text }}>{friend.name.split(" ")[0]}</div>
        <div style={{ fontSize: 10, color: S.textDim, marginTop: 2 }}>{friend.tags[0]}</div>
      </div>
    </div>
  );
}

// Detail Panel
function DetailPanel({ friend, onClose }: { friend: typeof FRIENDS[0]; onClose: () => void }) {
  return (
    <div style={{
      background: S.bgCard, borderRadius: 20, padding: 28,
      border: `1px solid ${friend.accent}20`,
      boxShadow: `0 0 40px ${friend.accent}08`,
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: S.textDim, cursor: "pointer",
          fontSize: 18, lineHeight: 1,
        }}>×</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <GlowAvatar initials={friend.avatar} size={72} accent={friend.accent} glow />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: S.text }}>{friend.name}</div>
          <div style={{ fontSize: 13, color: S.textDim, fontFamily: S.mono }}>{friend.username}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: S.textMuted, lineHeight: 1.6, textAlign: "center", margin: "0 0 20px" }}>{friend.bio}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 24 }}>
        <StatBlock label="Dolls" value={friend.dolls} />
        <StatBlock label="Mutual" value={friend.mutuals} />
        <StatBlock label="Shared" value={friend.overlap} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
        {friend.tags.map(t => <TagPill key={t} label={t} accent={friend.accent} />)}
      </div>

      {/* Shared interests */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: S.textDim, textTransform: "uppercase",
          letterSpacing: "0.12em", marginBottom: 10, fontFamily: S.mono,
        }}>Shared Interests</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {friend.sharedInterests.map(i => (
            <span key={i} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 20,
              background: `${friend.accent}10`, color: friend.accent,
              border: `1px solid ${friend.accent}18`, fontWeight: 500,
            }}>{i}</span>
          ))}
        </div>
      </div>

      {/* Shared items */}
      {friend.sharedItems.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: S.textDim, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 10, fontFamily: S.mono,
          }}>Items You Both Own</div>
          {friend.sharedItems.map(item => (
            <div key={item} style={{
              fontSize: 12, color: S.textMuted, padding: "6px 0",
              borderBottom: `1px solid ${S.border}`,
            }}>↳ {item}</div>
          ))}
        </div>
      )}

      {/* Activity */}
      <div style={{
        fontSize: 11, color: S.textDim, textAlign: "center", marginBottom: 24,
        fontFamily: S.mono,
      }}>
        Last active {friend.lastActive}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{
          flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${friend.accent}, ${friend.accent}CC)`,
          color: "#FFF", fontWeight: 800, fontSize: 12, cursor: "pointer",
          fontFamily: S.mono, letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: `0 0 16px ${friend.accent}30`,
        }}>View Profile</button>
        <button style={{
          padding: "12px 20px", borderRadius: 10,
          border: `1.5px solid ${friend.accent}40`, background: "transparent",
          color: friend.accent, fontWeight: 700, fontSize: 12, cursor: "pointer",
          fontFamily: S.mono, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>Message</button>
      </div>
    </div>
  );
}

// === MAIN ===

export default function FriendsVariant5() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("gallery");
  const [selected, setSelected] = useState<number | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    FRIENDS.forEach(f => f.tags.forEach(t => set.add(t)));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() =>
    FRIENDS.filter(f => {
      const q = search.toLowerCase();
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.username.includes(q) || f.tags.some(t => t.toLowerCase().includes(q));
      const matchTag = !filterTag || f.tags.includes(filterTag);
      return matchSearch && matchTag;
    }),
  [search, filterTag]);

  const sel = selected !== null ? FRIENDS.find(f => f.id === selected) ?? null : null;
  const totalShared = FRIENDS.reduce((a, f) => a + f.overlap, 0);

  return (
    <div style={{
      minHeight: "100vh", fontFamily: S.font, color: S.text,
      background: `radial-gradient(ellipse at 20% 0%, #1a0a20 0%, ${S.bg} 50%), radial-gradient(ellipse at 80% 100%, #0a1520 0%, ${S.bg} 50%)`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* === HEADER === */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{
              fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${S.text}, ${S.textMuted})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Collector Circle
            </h1>
            <span style={{
              fontSize: 13, fontWeight: 800, color: S.pink, fontFamily: S.mono,
              padding: "4px 12px", borderRadius: 20,
              background: `${S.pink}12`, border: `1px solid ${S.pink}20`,
            }}>{FRIENDS.length}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: S.textDim, letterSpacing: "0.01em" }}>
            {totalShared} shared items across your network · {FRIENDS.filter(f => f.activity === "active").length} active now
          </p>
        </div>

        {/* === SEARCH + VIEW SWITCH === */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 380 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search collectors…"
              style={{
                width: "100%", padding: "11px 16px 11px 40px", fontSize: 13,
                borderRadius: 12, border: `1px solid ${S.border}`,
                background: S.bgInput, color: S.text, outline: "none",
                fontFamily: S.font, boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = S.pink + "50"}
              onBlur={e => e.currentTarget.style.borderColor = S.border}
            />
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 14, color: S.textDim, pointerEvents: "none",
            }}>⌕</span>
          </div>

          {/* View toggle */}
          <div style={{
            display: "flex", borderRadius: 12, overflow: "hidden",
            border: `1px solid ${S.border}`, background: S.bgSurface,
          }}>
            {(["gallery", "network"] as ViewMode[]).map(m => (
              <button key={m} onClick={() => setView(m)} style={{
                padding: "9px 20px", border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: S.mono, transition: "all 0.2s ease",
                background: view === m ? `linear-gradient(135deg, ${S.pink}20, ${S.purple}15)` : "transparent",
                color: view === m ? S.pink : S.textDim,
                borderBottom: view === m ? `2px solid ${S.pink}` : "2px solid transparent",
              }}>{m === "gallery" ? "◫ Gallery" : "◉ Network"}</button>
            ))}
          </div>
        </div>

        {/* === FILTER TAGS === */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          <button onClick={() => setFilterTag(null)} style={{
            padding: "5px 14px", borderRadius: 20, border: `1px solid ${!filterTag ? S.pink + "40" : S.border}`,
            background: !filterTag ? `${S.pink}12` : "transparent",
            color: !filterTag ? S.pink : S.textDim,
            fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.mono,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>All</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setFilterTag(filterTag === t ? null : t)} style={{
              padding: "5px 14px", borderRadius: 20,
              border: `1px solid ${filterTag === t ? S.pink + "40" : S.border}`,
              background: filterTag === t ? `${S.pink}12` : "transparent",
              color: filterTag === t ? S.pink : S.textDim,
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.mono,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>{t}</button>
          ))}
        </div>

        {/* === VIEWS === */}
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {view === "gallery" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 18,
              }}>
                {filtered.map(f => (
                  <FriendCard key={f.id} friend={f} onSelect={() => setSelected(selected === f.id ? null : f.id)} />
                ))}
              </div>
            ) : (
              <div>
                {/* Network view */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8,
                  padding: 24, borderRadius: 20,
                  background: `radial-gradient(ellipse at center, ${S.pink}04, transparent 70%)`,
                  border: `1px solid ${S.border}`,
                }}>
                  {filtered.map(f => (
                    <NetworkNode key={f.id} friend={f} isSelected={selected === f.id}
                      onSelect={() => setSelected(selected === f.id ? null : f.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* === SUGGESTED === */}
            <div style={{ marginTop: 48 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: S.textDim, textTransform: "uppercase",
                letterSpacing: "0.12em", marginBottom: 16, fontFamily: S.mono,
              }}>Discover Collectors</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {SUGGESTED.map(s => (
                  <div key={s.username} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px", borderRadius: 14,
                    background: S.bgCard, border: `1px solid ${S.border}`,
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = S.borderHover)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: `${S.purple}15`, border: `1.5px solid ${S.purple}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 11, color: S.purpleLight, fontFamily: S.mono,
                    }}>{s.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: S.text }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: S.textDim }}>{s.reason}</div>
                    </div>
                    <button style={{
                      marginLeft: 12, padding: "6px 14px", borderRadius: 8,
                      border: `1px solid ${S.purple}30`, background: `${S.purple}10`,
                      color: S.purpleLight, fontWeight: 700, fontSize: 10, cursor: "pointer",
                      fontFamily: S.mono, letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>Connect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === DETAIL PANEL === */}
          {sel && (
            <div style={{
              width: 320, flexShrink: 0, position: "sticky", top: 32, alignSelf: "flex-start",
            }}>
              <DetailPanel friend={sel} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
