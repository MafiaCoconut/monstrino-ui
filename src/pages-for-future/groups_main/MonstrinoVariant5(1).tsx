import React, { useState } from "react";

const T = {
  bg: "#08080f", surface: "#0e0e18", surfaceAlt: "#13131f", border: "#1c1c30",
  borderHover: "#2a2a44", text: "#e8e8f4", textMuted: "#8080a4", textDim: "#4e4e6a",
  pink: "#ff2d78", pinkSoft: "rgba(255,45,120,0.12)", pinkGlow: "rgba(255,45,120,0.25)",
  purple: "#a855f7", purpleSoft: "rgba(168,85,247,0.12)", purpleGlow: "rgba(168,85,247,0.2)",
  cyan: "#22d3ee", cyanSoft: "rgba(34,211,238,0.08)",
  radius: "14px", radiusPill: "999px",
  fontSans: "'Inter','Segoe UI',system-ui,sans-serif",
  fontMono: "'SF Mono','JetBrains Mono','Fira Code',monospace",
};

const pill = (bg: string, color: string, border?: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", padding: "6px 16px",
  borderRadius: T.radiusPill, background: bg, color, fontSize: 11,
  fontFamily: T.fontMono, textTransform: "uppercase", letterSpacing: 1.2,
  border: border ? `1px solid ${border}` : "none", cursor: "pointer", transition: "all .2s",
  fontWeight: 600,
});

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`,
  padding: 20, transition: "all .25s", ...extra,
});

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: T.fontMono, textTransform: "uppercase",
  letterSpacing: 2.5, color: T.textDim, marginBottom: 12,
};

const POSTS = [
  { id: 1, type: "discussion", author: "VelvetCrypt", time: "12m ago", title: "Best era for MH playline quality?", body: "Wave 1 vs reboot vs G3 — drop your takes. Serious opinions only.", likes: 24, replies: 18, hot: true },
  { id: 2, type: "trade", tag: "WTS", author: "SkullTrader99", time: "38m ago", title: "WTS Skullector Elvira — EU only", body: "NRFB, shipping from Berlin. €220 shipped. Full refs on profile.", likes: 15, replies: 7, hot: false },
  { id: 3, type: "drop", author: "MonstrinoAlerts", time: "1h ago", title: "⚡ DROP ALERT: Haunt Couture restock", body: "Mattel Creations page updated — expected drop 3PM EST today. Set alarms!", likes: 89, replies: 42, hot: true },
  { id: 4, type: "showcase", author: "GhoulGallery", time: "2h ago", title: "My G1 shelf — finally complete!", body: "Full original 2010 wave on display. Years of hunting.", likes: 112, replies: 31, hot: true },
  { id: 5, type: "iso", tag: "ISO", author: "DarkDollHunter", time: "3h ago", title: "ISO Draculaura Reel Drama", body: "Any condition considered. US preferred. DM me!", likes: 8, replies: 4, hot: false },
  { id: 6, type: "event", author: "MeetupCrew", time: "5h ago", title: "🗓 Cologne collector meetup — next Saturday", body: "Café Noir, 14:00. Bring trades and display pieces. RSVP in thread.", likes: 34, replies: 19, hot: false },
  { id: 7, type: "guide", author: "AuthExpert", time: "8h ago", title: "Authentication: spotting repro shoes", body: "Quick expert guide — check sole markings, materials, and weight first.", likes: 67, replies: 22, hot: true },
  { id: 8, type: "trade", tag: "WTT", author: "NeonCollector", time: "9h ago", title: "WTT Cleo de Nile for Lagoona Blue", body: "Both NRFB G3. US only. Can add PayPal diff.", likes: 11, replies: 5, hot: false },
];

const PINNED = [
  { icon: "📌", title: "Welcome — Rules & Trust System", sub: "Read before posting. Trading guidelines, authentication policy, community standards.", primary: true },
  { icon: "🔥", title: "Haunt Couture Wave 3 Megathread", sub: "All leaks, speculation, and sourcing in one place. Updated daily.", primary: false },
  { icon: "📅", title: "Cologne Meetup — May 17", sub: "23 members confirmed. RSVP open until Friday.", primary: false },
  { icon: "🔍", title: "Authentication Request Queue", sub: "Submit items for community verification. 4 pending reviews.", primary: false },
];

const FILTERS = ["All", "Discussion", "Trade", "Drop", "Showcase", "ISO", "Event", "Guide"];
const SORTS = ["Newest", "Popular", "Most Replies", "Hot"];

const MEMBERS = [
  { name: "VelvetCrypt", role: "Admin", online: true, posts: 312 },
  { name: "SkullTrader99", role: "Mod", online: true, posts: 187 },
  { name: "GhoulGallery", role: "Mod", online: false, posts: 204 },
  { name: "DarkDollHunter", role: null, online: true, posts: 89 },
  { name: "AuthExpert", role: null, online: false, posts: 156 },
  { name: "NeonCollector", role: null, online: true, posts: 43 },
  { name: "MeetupCrew", role: null, online: false, posts: 67 },
];

const typeColor = (t: string) => {
  const m: Record<string, string> = { trade: T.cyan, iso: T.cyan, drop: T.pink, showcase: T.purple, event: "#ffb347", guide: "#4ecdc4" };
  return m[t] || T.textMuted;
};

const MonstrinoVariant5: React.FC = () => {
  const [isMember, setIsMember] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState("discussion");
  const [composerText, setComposerText] = useState("");

  const toggleLike = (id: number) => setLiked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const feed = POSTS
    .filter(p => filter === "All" || p.type === filter.toLowerCase())
    .sort((a, b) => {
      if (sort === "Popular") return b.likes - a.likes;
      if (sort === "Most Replies") return b.replies - a.replies;
      if (sort === "Hot") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.likes - a.likes;
      return a.id - b.id;
    });

  const onlineCount = MEMBERS.filter(m => m.online).length;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontSans }}>
      {/* ═══ HERO ═══ */}
      <div style={{ position: "relative", padding: "68px 0 52px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 10%, ${T.purpleGlow} 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 75% 70%, ${T.pinkSoft} 0%, transparent 50%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(transparent, ${T.bg})` }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${T.pink}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, flexShrink: 0, boxShadow: `0 0 32px ${T.pinkSoft}` }}>M</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ ...pill(T.pinkSoft, T.pink), fontSize: 9, padding: "4px 10px" }}>COLLECTORS CLUB</span>
                <span style={{ ...pill("transparent", T.textMuted, T.border), fontSize: 9, padding: "4px 10px" }}>PUBLIC</span>
                <span style={{ ...pill(T.cyanSoft, T.cyan), fontSize: 9, padding: "4px 10px" }}>✓ VERIFIED MODS</span>
                <span style={{ ...pill("transparent", T.textMuted, T.border), fontSize: 9, padding: "4px 10px" }}>🛡 TRADE-SAFE</span>
              </div>
            </div>

            <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -0.5, textTransform: "uppercase", margin: "0 0 10px", background: `linear-gradient(135deg, ${T.text} 50%, ${T.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Monstrino Collectors HQ
            </h1>
            <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.6, margin: "0 0 6px", maxWidth: 560 }}>
              Where Monster High collectors authenticate, trade, and showcase — backed by verified experts and a zero-fraud track record.
            </p>
            <p style={{ color: T.textDim, fontSize: 12, fontStyle: "italic", margin: "0 0 18px", letterSpacing: 0.3 }}>"Every piece authenticated. Every trade protected."</p>

            <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, color: T.textMuted, marginBottom: 22 }}>
              <span><b style={{ color: T.text }}>2,847</b> members</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.pink, display: "inline-block", boxShadow: `0 0 8px ${T.pink}` }} /> <b style={{ color: T.text }}>142</b> online</span>
              <span style={{ color: T.textDim }}>·</span>
              <span>🔍 Auth experts</span>
              <span style={{ color: T.textDim }}>·</span>
              <span>Est. 2023</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {isMember ? (
                <>
                  <button style={{ ...pill(T.pink, "#fff"), padding: "11px 28px", fontSize: 12 }} onClick={() => setComposerOpen(!composerOpen)}>+ NEW POST</button>
                  <button style={{ ...pill("transparent", T.textMuted, T.border), padding: "11px 20px", fontSize: 11 }} onClick={() => setIsMember(false)}>LEAVE GROUP</button>
                </>
              ) : (
                <button style={{ ...pill(T.pink, "#fff"), padding: "11px 28px", fontSize: 12 }} onClick={() => setIsMember(true)}>JOIN THE CIRCLE</button>
              )}
            </div>
          </div>

          {/* Right-side trust signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 11, color: T.textDim, textAlign: "right", paddingBottom: 4 }}>
            {[
              "3 verified moderators",
              "Zero fraud incidents",
              "Auth required for trades >€100",
              "Active since 2023",
            ].map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                <span style={{ color: T.text, fontSize: 11 }}>{s}</span>
                <span style={{ color: "#22c55e", fontSize: 10 }}>✓</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px 64px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* PINNED HIGHLIGHTS */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={sectionLabel}>📌 PINNED & HIGHLIGHTS</h3>
            {/* Primary pinned item — full width */}
            <div
              style={{ ...card({ padding: 18, cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 10, borderColor: `${T.pink}25` }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.borderHover; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3)`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${T.pink}25`; el.style.transform = "none"; el.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{PINNED[0].icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{PINNED[0].title}</div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{PINNED[0].sub}</div>
              </div>
              <span style={{ ...pill(T.pinkSoft, T.pink), fontSize: 8, padding: "3px 8px", flexShrink: 0, marginLeft: "auto" }}>ESSENTIAL</span>
            </div>
            {/* Secondary pinned items */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {PINNED.slice(1).map((p, i) => (
                <div key={i} style={{ ...card({ padding: 14, cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }) }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.borderHover; el.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.border; el.style.transform = "none"; }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 10, color: T.textDim, lineHeight: 1.4 }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NON-MEMBER CTA */}
          {!isMember && (
            <div style={{ ...card({ textAlign: "center", padding: "36px 24px", marginBottom: 24, border: `1px solid ${T.pink}20`, background: `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)` }) }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✨</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Join the Collectors Circle</h3>
              <p style={{ fontSize: 13, color: T.textMuted, maxWidth: 400, margin: "0 auto 16px", lineHeight: 1.5 }}>
                Get access to exclusive trades, authentication experts, drop alerts, and a community of 2,800+ verified collectors.
              </p>
              <button style={{ ...pill(T.pink, "#fff"), padding: "12px 32px", fontSize: 12 }} onClick={() => setIsMember(true)}>JOIN NOW — IT'S FREE</button>
            </div>
          )}

          {/* COMPOSER */}
          {isMember && composerOpen && (
            <div style={{ ...card({ marginBottom: 24, border: `1px solid ${T.pink}30` }) }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {["discussion", "trade", "iso", "drop", "showcase", "event", "guide"].map(t => (
                  <button key={t} onClick={() => setComposerType(t)}
                    style={{ ...pill(composerType === t ? T.pink : "transparent", composerType === t ? "#fff" : T.textDim, composerType === t ? undefined : T.border), fontSize: 9, padding: "4px 12px" }}>
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <textarea value={composerText} onChange={e => setComposerText(e.target.value)}
                placeholder="What's on your mind, collector?"
                style={{ width: "100%", background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, color: T.text, fontSize: 13, resize: "vertical", minHeight: 72, fontFamily: T.fontSans, outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button style={{ ...pill(T.pink, "#fff"), padding: "8px 22px" }} onClick={() => { setComposerText(""); setComposerOpen(false); }}>POST</button>
              </div>
            </div>
          )}

          {/* FEED CONTROLS */}
          <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ ...pill(filter === f ? T.pink : "transparent", filter === f ? "#fff" : T.textDim, filter === f ? undefined : T.border), fontSize: 9, padding: "4px 11px" }}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono, letterSpacing: 1 }}>{feed.length} POSTS · {feed.filter(p => p.hot).length} TRENDING</span>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 12px", color: T.textMuted, fontSize: 11, fontFamily: T.fontMono, outline: "none" }}>
                  {SORTS.map(sv => <option key={sv}>{sv}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* FEED */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {feed.map(post => {
              const tc = typeColor(post.type);
              const isShowcase = post.type === "showcase";
              const isDrop = post.type === "drop";
              const isTrade = post.type === "trade" || post.type === "iso";

              return (
                <div key={post.id}
                  style={{
                    ...card({ cursor: "pointer" }),
                    ...(isDrop ? { borderLeft: `3px solid ${T.pink}`, background: `linear-gradient(90deg, ${T.pinkSoft} 0%, ${T.surface} 10%)` } : {}),
                    ...(isTrade ? { borderLeft: `3px solid ${T.cyan}`, background: `linear-gradient(90deg, ${T.cyanSoft} 0%, ${T.surface} 10%)` } : {}),
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.borderHover; el.style.boxShadow = `0 0 20px ${T.pinkSoft}`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = (isDrop || isTrade) ? "transparent" : T.border; el.style.borderLeftColor = isDrop ? T.pink : isTrade ? T.cyan : T.border; el.style.boxShadow = "none"; el.style.transform = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.pink}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{post.author[0]}</div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{post.author}</span>
                      <span style={{ fontSize: 10, color: T.textDim }}>{post.time}</span>
                      {post.hot && <span style={{ fontSize: 8, color: T.pink, fontFamily: T.fontMono, background: T.pinkSoft, padding: "2px 6px", borderRadius: T.radiusPill, letterSpacing: 0.8 }}>🔥 HOT</span>}
                    </div>
                    <span style={{ fontSize: 9, fontFamily: T.fontMono, color: tc, textTransform: "uppercase", letterSpacing: 1, background: `${tc}15`, padding: "3px 10px", borderRadius: T.radiusPill, fontWeight: 600 }}>
                      {(post as any).tag || post.type}
                    </span>
                  </div>

                  {isShowcase && (
                    <div style={{ height: 140, borderRadius: 10, background: `linear-gradient(135deg, #0a0520, #1a0a2e 40%, #2d1b4e 70%, #0f0a1a)`, marginBottom: 12, boxShadow: `inset 0 0 40px ${T.purpleSoft}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, fontFamily: T.fontMono, color: T.textDim, textTransform: "uppercase", letterSpacing: 2 }}>📷 Gallery</span>
                    </div>
                  )}

                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{post.title}</h4>
                  <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{post.body}</p>

                  <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                    <button onClick={e => { e.stopPropagation(); toggleLike(post.id); }}
                      style={{ background: "none", border: "none", color: liked.has(post.id) ? T.pink : T.textDim, cursor: "pointer", fontSize: 12, fontFamily: T.fontSans, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                      {liked.has(post.id) ? "♥" : "♡"} {post.likes + (liked.has(post.id) ? 1 : 0)}
                    </button>
                    <span style={{ color: T.textDim, display: "flex", alignItems: "center", gap: 4 }}>💬 {post.replies}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* About */}
          <div style={card()}>
            <h3 style={sectionLabel}>ABOUT</h3>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: "0 0 4px" }}>
              A curated space for serious Monster High collectors. Authentication-first trading, verified community, zero fraud tolerance.
            </p>
            <p style={{ fontSize: 11, color: T.textDim, margin: "0 0 12px" }}>
              Specializing in rare finds, Skullector, Haunt Couture, and G1 originals.
            </p>
            <div style={{ paddingTop: 10, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.textDim }}>
              <i style={{ color: T.text }}>"Every piece authenticated. Every trade protected."</i>
            </div>
          </div>

          {/* Trust & Standards */}
          <div style={card()}>
            <h3 style={sectionLabel}>TRUST & STANDARDS</h3>
            {[
              "Verified moderators on duty 24/7",
              "Authentication required for trades >€100",
              "Zero tolerance for counterfeits",
              "No price shaming or lowballing",
              "Tag all posts correctly",
            ].map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "3px 0", display: "flex", gap: 6 }}>
                <span style={{ color: T.pink, flexShrink: 0 }}>{i + 1}.</span> {r}
              </div>
            ))}
          </div>

          {/* Members */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ ...sectionLabel, marginBottom: 0 }}>MEMBERS · 2,847</h3>
              <span style={{ fontSize: 9, fontFamily: T.fontMono, color: "#22c55e", letterSpacing: 1 }}>{onlineCount} ONLINE</span>
            </div>
            {/* Staff first */}
            {MEMBERS.filter(m => m.role).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i === MEMBERS.filter(x => x.role).length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${m.role === "Admin" ? T.pink : T.purple}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{m.name[0]}</div>
                  {m.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#22c55e", border: `2px solid ${T.surface}` }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</span>
                  <span style={{ fontSize: 9, fontFamily: T.fontMono, textTransform: "uppercase", color: m.role === "Admin" ? T.pink : T.purple, marginLeft: 6 }}>{m.role}</span>
                </div>
                <span style={{ fontSize: 9, color: T.textDim }}>{m.posts}p</span>
              </div>
            ))}
            {/* Regular members */}
            {MEMBERS.filter(m => !m.role).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purple}, ${T.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{m.name[0]}</div>
                  {m.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#22c55e", border: `2px solid ${T.surface}` }} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: T.textDim }}>{m.posts}p</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={card()}>
            <h3 style={sectionLabel}>CATEGORIES</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["Monster High", "Trading", "Authentication", "G1", "Haunt Couture", "Skullector", "Meetups", "Guides"].map(t => (
                <span key={t} style={{ ...pill("transparent", T.textDim, T.border), fontSize: 9, padding: "3px 9px", cursor: "pointer" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Events */}
          <div style={card()}>
            <h3 style={sectionLabel}>UPCOMING EVENTS</h3>
            <div style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Cologne Meetup</div>
              <div style={{ fontSize: 11, color: T.textDim }}>May 17 · 23 attending · RSVP open</div>
            </div>
            <div style={{ padding: "8px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Virtual Auth Workshop</div>
              <div style={{ fontSize: 11, color: T.textDim }}>May 24 · Online · Free for members</div>
            </div>
          </div>

          {/* Related */}
          <div style={card()}>
            <h3 style={sectionLabel}>RELATED GROUPS</h3>
            {["Bratz Collectors Vault", "Rainbow High Trading", "Doll Photography Club"].map((g, i) => (
              <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "4px 0", cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.textMuted; }}
              >→ {g}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonstrinoVariant5;
