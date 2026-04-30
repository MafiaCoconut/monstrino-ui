import React, { useState, useMemo } from "react";

const T = {
  bg: "#07070d", bgPanel: "#0e0e18", bgCard: "#12121e", bgCardAlt: "#16162a",
  border: "#1c1c34", pink: "#ff2d8a", purple: "#a44aff", cyan: "#00e5cc", gold: "#ffb347",
  text: "#ebe7f3", textMuted: "#6f6b85", textDim: "#3d3b52",
  mono: "'JetBrains Mono','SF Mono',monospace", font: "'Inter',system-ui,sans-serif", radius: "10px",
};

const TRENDING = ["Skullector","Draculaura","Blood Moon Edition","Phantom Court","UV-reactive"];
const RECENT = ["Obsidian Fae","Crimson Banshee","Freak Du Chic"];
const CHIPS = ["Rare Editions","New Releases","Elite Collectors","Hunt Posts","Wishlist Finds","Fan Art"];
const CATS = ["All","Releases","Characters","Series","Users","Groups","Posts","Reviews","Tags"] as const;
const TYPE_MAP: Record<string,string> = { Releases:"release",Characters:"character",Series:"series",Users:"user",Groups:"group",Posts:"post",Reviews:"post",Tags:"tag" };
const SORTS = ["Relevance","Newest","Popular"] as const;
const FILTERS = ["Rarity","Year","Line","Availability"] as const;
const SEARCH_MODES = ["All","Releases","Characters","Users","Groups"] as const;

interface R { type:string;[k:string]:any }
const MOCK: R[] = [
  { type:"release", title:"Obsidian Fae — Midnight Edition", series:"Phantom Court", rarity:"Ultra Rare", year:2024, img:"🖤" },
  { type:"release", title:"Crimson Banshee — Blood Moon", series:"Shadowveil", rarity:"Limited", year:2023, img:"🩸" },
  { type:"release", title:"Draculaura — Skullector", series:"Skullector", rarity:"Collector Edition", year:2024, img:"🦇" },
  { type:"release", title:"Celestial Wraith — Aurora Variant", series:"Phantom Court", rarity:"Exclusive", year:2024, img:"✨" },
  { type:"release", title:"Neon Specter — Blacklight", series:"Dark Bloom", rarity:"Rare", year:2023, img:"💜" },
  { type:"character", name:"Draculaura", releases:47, series:"Monster High", img:"🧛‍♀️" },
  { type:"character", name:"Shadowveil Banshee", releases:12, series:"Phantom Court", img:"👻" },
  { type:"character", name:"Obsidian Fae", releases:8, series:"Dark Bloom", img:"🧚" },
  { type:"series", title:"Phantom Court", count:24, era:"2023–2024" },
  { type:"series", title:"Skullector", count:18, era:"2022–2024" },
  { type:"series", title:"Freak Du Chic", count:14, era:"2015–2016" },
  { type:"user", username:"NightCollector", handle:"@nightcollector", items:342, avatar:"🌙" },
  { type:"user", username:"PhantomHunter", handle:"@phantomhunter", items:218, avatar:"👤" },
  { type:"user", username:"VelvetCrypt", handle:"@velvetcrypt", items:571, avatar:"🦇" },
  { type:"group", name:"Phantom Court Collectors", members:1240, theme:"Exclusive releases & trades" },
  { type:"group", name:"UV Hunters Guild", members:890, theme:"UV-reactive finds" },
  { type:"post", snippet:"Just found a mint Obsidian Fae — absolutely unreal condition!", author:"NightCollector", entity:"Obsidian Fae", likes:89 },
  { type:"post", snippet:"Blood Moon Banshee restock confirmed for next Friday.", author:"PhantomHunter", entity:"Crimson Banshee", likes:214 },
  { type:"tag", title:"UV-reactive", count:1340 },
  { type:"tag", title:"Blood Moon", count:890 },
  { type:"tag", title:"Skullector", count:2100 },
  { type:"tag", title:"rare find", count:3200 },
  { type:"tag", title:"wishlist", count:4500 },
];

const TYPE_LABELS: Record<string,string> = {
  release:"Releases", character:"Characters", series:"Series",
  user:"Users", group:"Groups", post:"Posts", tag:"Tags",
};

const MAX_PREVIEW = 3;

const SearchV4HybridUniversal: React.FC = () => {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Relevance");
  const [searchMode, setSearchMode] = useState<string>("All");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return [];
    let r = MOCK.filter(i => JSON.stringify(i).toLowerCase().includes(q));
    if (cat !== "All" && TYPE_MAP[cat]) r = r.filter(i => i.type === TYPE_MAP[cat]);
    return r;
  }, [q, cat]);

  const noResults = q.length > 0 && filtered.length === 0;
  const hasResults = q.length > 0 && filtered.length > 0;
  const isEmpty = q.length === 0;

  const grouped = useMemo(() => {
    const g: Record<string, R[]> = {};
    filtered.forEach(r => { if (!g[r.type]) g[r.type] = []; g[r.type].push(r); });
    return g;
  }, [filtered]);

  const topResults = useMemo(() => {
    const t: R[] = []; const s = new Set<string>();
    for (const r of filtered) { if (!s.has(r.type)) { t.push(r); s.add(r.type); } if (t.length >= 4) break; }
    return t;
  }, [filtered]);

  const activeTypes = useMemo(() => Object.keys(grouped), [grouped]);

  const HCard = ({ children, color = T.pink, style: x = {}, glow = false }: { children: React.ReactNode; color?: string; style?: React.CSSProperties; glow?: boolean }) => {
    const [h, setH] = useState(false);
    return (
      <div style={{
        background: T.bgCard, border: `1px solid ${h ? color + "55" : glow ? color + "30" : T.border}`,
        borderRadius: T.radius, padding: 16, cursor: "pointer", transition: "all .25s",
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h ? `0 8px 28px ${color}18` : glow ? `0 4px 20px ${color}10` : "none", ...x,
      }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</div>
    );
  };

  const SectionHeader = ({ type, count, isFirst }: { type: string; count: number; isFirst: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
      <div>
        <span style={{ fontFamily: T.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: T.textMuted }}>
          {TYPE_LABELS[type] || type} ({count})
        </span>
      </div>
      <button style={{
        background: isFirst ? T.pink + "14" : "none",
        border: isFirst ? `1px solid ${T.pink}30` : "none",
        color: T.pink, fontFamily: T.mono, fontSize: 10, cursor: "pointer",
        textTransform: "uppercase", letterSpacing: 1,
        padding: isFirst ? "6px 16px" : "4px 8px",
        borderRadius: 6, transition: "all .2s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.pink + "22"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isFirst ? T.pink + "14" : "transparent"; }}
      >
        Search all {TYPE_LABELS[type]?.toLowerCase() || type} →
      </button>
    </div>
  );

  const renderCard = (r: R, i: number, glow = false) => {
    if (r.type === "release") return (
      <HCard key={i} color={T.pink} glow={glow}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 56, height: 72, background: "#1a1a30", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{r.img}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6 }}>{r.series} · {r.year}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ padding: "2px 8px", borderRadius: 4, background: T.pink + "18", color: T.pink, fontFamily: T.mono, fontSize: 10, textTransform: "uppercase" }}>{r.rarity}</span>
              {glow && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase" }}>View release →</span>}
            </div>
          </div>
        </div>
      </HCard>
    );
    if (r.type === "character") return (
      <HCard key={i} color={T.purple} glow={glow}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a1a30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.img}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{r.releases} releases · {r.series}</div>
          </div>
          {glow && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase" }}>Explore →</span>}
        </div>
      </HCard>
    );
    if (r.type === "series") return (
      <HCard key={i} color={T.cyan} glow={glow}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.textMuted }}>{r.count} releases · {r.era}</span>
          {glow && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase" }}>See series →</span>}
        </div>
      </HCard>
    );
    if (r.type === "user") return (
      <HCard key={i} color={T.gold} glow={glow}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1a1a30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{r.username}</div><div style={{ fontSize: 12, color: T.textMuted }}>{r.handle} · {r.items} items</div></div>
          <button style={{ padding: "5px 14px", borderRadius: 6, border: `1px solid ${T.pink}`, background: T.pink + "10", color: T.pink, fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", cursor: "pointer", flexShrink: 0 }}>Follow</button>
        </div>
      </HCard>
    );
    if (r.type === "group") return (
      <HCard key={i} color={T.purple} glow={glow}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{r.name}</div><div style={{ fontSize: 12, color: T.textMuted }}>{r.members.toLocaleString()} members · {r.theme}</div></div>
          <button style={{ padding: "5px 14px", borderRadius: 6, border: `1px solid ${T.purple}`, background: "transparent", color: T.purple, fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", cursor: "pointer", flexShrink: 0 }}>Join</button>
        </div>
      </HCard>
    );
    if (r.type === "post") return (
      <HCard key={i} color={T.cyan} glow={glow}>
        <div style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.5, fontStyle: "italic" }}>"{r.snippet}"</div>
        <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted, fontSize: 11 }}><span>@{r.author.toLowerCase()} · {r.entity}</span><span>♥ {r.likes}</span></div>
      </HCard>
    );
    if (r.type === "tag") return (
      <HCard key={i} color={T.pink} style={{ padding: 12 }} glow={glow}>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.pink }}>#{r.title}</div>
        <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{r.count.toLocaleString()} uses</div>
      </HCard>
    );
    return null;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, backgroundImage: `radial-gradient(ellipse 60% 40% at 50% 0%, #10062a 0%, transparent 60%)` }}>
      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase" }}><span style={{ color: T.pink }}>◆</span> MONSTRINO</div>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 2 }}>Search Gateway — V4.5</span>
      </header>

      {/* Hero Search */}
      <div style={{ background: hasResults ? "transparent" : `linear-gradient(180deg, ${T.bgPanel} 0%, transparent 100%)`, padding: isEmpty ? "56px 32px 40px" : "28px 32px 20px", transition: "padding .3s" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          {isEmpty && <>
            <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 4, color: T.pink, marginBottom: 14 }}>Universal Search Gateway</div>
            <h1 style={{ fontSize: 36, fontWeight: 300, marginBottom: 6, lineHeight: 1.2 }}>
              Search <span style={{ fontWeight: 700, background: `linear-gradient(90deg, ${T.pink}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>everything</span>. Discover <span style={{ fontWeight: 700, color: T.cyan }}>anything</span>.
            </h1>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 32 }}>Releases · Characters · Series · Collectors · Groups · Tags · Posts</p>
          </>}

          <div style={{ position: "relative", background: T.bgCard, border: `1px solid ${query ? T.pink + "55" : T.border}`, borderRadius: 14, boxShadow: query ? `0 0 30px ${T.pink}15, 0 0 60px ${T.purple}08` : "0 4px 20px #0004", transition: "all .3s" }}>
            <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: T.textMuted }}>⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search releases, characters, users, series, groups..."
              style={{ width: "100%", padding: "20px 50px 20px 52px", background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 16, fontFamily: T.font }} />
            {query && <button onClick={() => setQuery("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16 }}>✕</button>}
          </div>

          {/* Search Mode Switch */}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            {SEARCH_MODES.map(m => (
              <button key={m} onClick={() => setSearchMode(m)} style={{
                padding: "6px 16px", borderRadius: 20,
                border: `1px solid ${searchMode === m ? T.pink + "50" : T.border}`,
                background: searchMode === m ? T.pink + "14" : "transparent",
                color: searchMode === m ? T.pink : T.textMuted,
                fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 1,
                cursor: "pointer", transition: "all .2s",
              }}>{m === "All" ? "⌕ All" : m}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 64px" }}>
        {/* Empty State */}
        {isEmpty && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
              {CHIPS.map(c => (
                <button key={c} onClick={() => setQuery(c)} style={{
                  padding: "8px 18px", borderRadius: 24, border: `1px solid ${T.border}`, background: "transparent",
                  color: T.textMuted, fontFamily: T.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, cursor: "pointer", transition: "all .2s",
                }} onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = T.pink; (e.target as HTMLElement).style.color = T.pink; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = T.border; (e.target as HTMLElement).style.color = T.textMuted; }}>{c}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, maxWidth: 800, margin: "0 auto" }}>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: T.textDim }} /> Recent
                </div>
                {RECENT.map(s => <div key={s} onClick={() => setQuery(s)} style={{ padding: "6px 0", color: T.textMuted, fontSize: 13, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = T.text)} onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>↻ {s}</div>)}
              </div>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: T.pink }} /> Trending
                </div>
                {TRENDING.slice(0, 3).map(s => <div key={s} onClick={() => setQuery(s)} style={{ padding: "6px 0", color: T.textMuted, fontSize: 13, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = T.pink)} onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>↗ {s}</div>)}
              </div>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: T.cyan }} /> Featured
                </div>
                {["Phantom Court", "Skullector"].map(s => <div key={s} onClick={() => setQuery(s)} style={{ padding: "6px 0", color: T.textMuted, fontSize: 13, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = T.cyan)} onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>★ {s}</div>)}
              </div>
            </div>
          </>
        )}

        {/* Results */}
        {hasResults && (
          <div style={{ display: "flex", gap: 28, marginTop: 8 }}>
            {/* Left Rail */}
            <div style={{ width: 200, flexShrink: 0 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textDim, marginBottom: 14 }}>Categories</div>
              {CATS.map(c => (
                <div key={c} onClick={() => setCat(c)} style={{
                  padding: "9px 14px", borderRadius: 6, cursor: "pointer", marginBottom: 2,
                  background: cat === c ? T.pink + "12" : "transparent", color: cat === c ? T.pink : T.textMuted,
                  fontFamily: T.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: 1,
                  borderLeft: cat === c ? `2px solid ${T.pink}` : "2px solid transparent", transition: "all .15s",
                }}>{c} {cat === c && grouped[TYPE_MAP[c]] ? `(${grouped[TYPE_MAP[c]]?.length || filtered.length})` : ""}</div>
              ))}
              <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 16, paddingTop: 16 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textDim, marginBottom: 12 }}>Filters</div>
                {FILTERS.map(f => (
                  <div key={f} style={{ padding: "7px 14px", color: T.textDim, fontFamily: T.mono, fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.textMuted)} onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
                    {f} <span style={{ float: "right", fontSize: 10 }}>▸</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Results */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Query Context */}
              <div style={{ marginBottom: 20, padding: "14px 18px", background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                      Showing results for "<span style={{ color: T.pink }}>{query}</span>"
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                      Across {activeTypes.map(t => TYPE_LABELS[t] || t).join(", ").toLowerCase()} · {filtered.length} matches
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {SORTS.map(s => (
                      <button key={s} onClick={() => setSort(s)} style={{
                        padding: "4px 12px", borderRadius: 4, border: `1px solid ${sort === s ? T.purple : "transparent"}`,
                        background: sort === s ? T.purple + "12" : "transparent", color: sort === s ? T.purple : T.textDim,
                        fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", cursor: "pointer",
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                {/* Related search chips */}
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {TRENDING.filter(t => t.toLowerCase() !== q).slice(0, 3).map(t => (
                    <button key={t} onClick={() => setQuery(t)} style={{
                      padding: "3px 10px", borderRadius: 12, border: `1px solid ${T.border}`, background: "transparent",
                      color: T.textDim, fontFamily: T.mono, fontSize: 9, textTransform: "uppercase", cursor: "pointer", transition: "all .2s",
                    }} onMouseEnter={e => (e.currentTarget.style.color = T.textMuted)} onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
                      Related: {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Results — enhanced */}
              {cat === "All" && topResults.length > 0 && (
                <div style={{ marginBottom: 32, padding: "20px", background: `linear-gradient(135deg, ${T.bgCard} 0%, ${T.bgCardAlt} 100%)`, border: `1px solid ${T.pink}20`, borderRadius: 12, boxShadow: `0 4px 30px ${T.pink}08` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: T.pink, boxShadow: `0 0 10px ${T.pink}` }} />
                      <span style={{ fontFamily: T.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: T.text, fontWeight: 600 }}>Top Results</span>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase", marginLeft: 4 }}>Best matches across all categories</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {topResults.map((r, i) => renderCard(r, i, true))}
                  </div>
                </div>
              )}

              {/* Segmented sections — preview mode */}
              {cat === "All" ? Object.entries(grouped).map(([type, items], sectionIdx) => (
                <div key={type} style={{ marginBottom: sectionIdx < 2 ? 28 : 20, opacity: sectionIdx > 2 ? 0.85 : 1 }}>
                  <SectionHeader type={type} count={items.length} isFirst={sectionIdx < 2} />
                  <div style={{ display: "grid", gridTemplateColumns: type === "tag" ? "repeat(auto-fill,minmax(140px,1fr))" : "1fr 1fr", gap: sectionIdx < 2 ? 10 : 8 }}>
                    {items.slice(0, MAX_PREVIEW).map((r, i) => renderCard(r, i))}
                  </div>
                  {items.length > MAX_PREVIEW && (
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textTransform: "uppercase" }}>
                        +{items.length - MAX_PREVIEW} more · <span style={{ color: T.pink, cursor: "pointer" }}>Explore all {TYPE_LABELS[type]?.toLowerCase()} →</span>
                      </span>
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {filtered.slice(0, 5).map((r, i) => renderCard(r, i))}
                  {filtered.length > 5 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 16 }}>
                      <button style={{
                        padding: "10px 28px", borderRadius: 8, border: `1px solid ${T.pink}40`,
                        background: T.pink + "10", color: T.pink, fontFamily: T.mono, fontSize: 11,
                        textTransform: "uppercase", letterSpacing: 1, cursor: "pointer",
                      }}>Search all {cat.toLowerCase()} for "{query}" →</button>
                    </div>
                  )}
                </div>
              )}

              {/* Gateway hint */}
              {cat === "All" && hasResults && (
                <div style={{ textAlign: "center", marginTop: 16, padding: "20px", borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                    Looking for deeper results?
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    {activeTypes.map(type => (
                      <button key={type} style={{
                        padding: "7px 18px", borderRadius: 20, border: `1px solid ${T.border}`,
                        background: T.bgCard, color: T.textMuted, fontFamily: T.mono, fontSize: 10,
                        textTransform: "uppercase", cursor: "pointer", transition: "all .2s",
                      }} onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink + "60"; e.currentTarget.style.color = T.pink; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                        Deep search {TYPE_LABELS[type]?.toLowerCase()} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {noResults && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30 }}>◇</div>
            <div style={{ fontFamily: T.mono, fontSize: 15, textTransform: "uppercase", letterSpacing: 3, color: T.textMuted, marginBottom: 8 }}>No exact matches</div>
            <p style={{ color: T.textDim, fontSize: 13, marginBottom: 8 }}>We couldn't find anything for "{query}"</p>
            <p style={{ color: T.textDim, fontSize: 12, marginBottom: 28 }}>Collectible naming can be tricky — try a different spelling or explore below</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["Draculaura", "Phantom Court", "Skullector", "Blood Moon"].map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{ padding: "8px 18px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textMuted, fontFamily: T.mono, fontSize: 11, cursor: "pointer", textTransform: "uppercase" }}>{s}</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {["#UV-reactive", "#rare find", "#wishlist"].map(s => (
                <span key={s} style={{ padding: "5px 14px", borderRadius: 16, border: `1px solid ${T.border}`, color: T.textDim, fontFamily: T.mono, fontSize: 11 }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchV4HybridUniversal;
