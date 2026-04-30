import React, { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// MONSTRINO — Seller Storefront V5 · Final Polish
// ═══════════════════════════════════════════════════════════

const T = {
  bg: "#060610", bgDeep: "#04040a", bgSurface: "#0a0a18", bgCard: "#0d0d1b",
  bgCardHover: "#131327", bgElevated: "#111122",
  border: "rgba(255,255,255,0.04)", borderHov: "rgba(255,45,138,0.25)",
  borderSubtle: "rgba(255,255,255,0.025)", borderAccent: "rgba(147,51,234,0.12)",
  text: "#eaeaf6", textSoft: "#b4b4d0", textMuted: "#7474a0", textDim: "#454568",
  pink: "#ff2d8a", pinkSoft: "#ff5ea8", pinkDim: "#cc2470",
  purple: "#9333ea", purpleLight: "#b06cf0", purpleDim: "#7928c8",
  cyan: "#22d3ee", cyanDim: "#18a8bb", gold: "#f5b731", goldDim: "#c8960a",
  font: "'Inter',system-ui,-apple-system,sans-serif",
  mono: "'JetBrains Mono','SF Mono','Fira Code',monospace",
  pill: "9999px", radius: "16px", radiusSm: "10px",
  ease: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  easeFast: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
};

// ─── Data ───

const seller = {
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=monstrino5&backgroundColor=0d0d1b",
  name: "Velvet Crypt",
  handle: "@velvetcrypt",
  role: "Verified Seller",
  tier: "Platinum",
  bio: "Curating the rarest horror dolls, limited-edition figures, and bespoke customs since 2015. Every piece authenticated. Every shipment insured.",
  location: "Salem, MA",
  joined: "Oct 2015",
  specialties: ["Monster High", "Living Dead Dolls", "Custom BJD", "Horror Figures", "Pullip", "Blythe"],
  stats: { rating: 4.97, sales: 1243, listings: 28, followers: 6800, repeatBuyers: 340 },
  responseTime: "~30 min",
  shippingNote: "Worldwide insured shipping. Double-boxed. 24-48h dispatch. Tracking always included.",
  aboutNote: "Velvet Crypt is a premium collector storefront for discerning horror and fashion doll enthusiasts. We specialize in rare, discontinued, and custom pieces — each hand-inspected and documented before listing. No fakes. No surprises. Just obsession, done right.",
  acceptsOffers: true,
  payments: ["PayPal", "Stripe", "Apple Pay", "Crypto"],
};

const pinnedListing = {
  id: 0, title: "Draculaura — Haunt Couture Crimson LE", franchise: "Monster High",
  cond: "New In Box · Sealed", price: 1200,
  img: "https://placehold.co/600x400/0d0d1b/ff2d8a?text=⟐+GRAIL+⟐",
  desc: "Limited to 500 pieces worldwide. Factory sealed with certificate of authenticity. The crown jewel of any Monster High collection.",
  likes: 891, views: 5200, watchers: 214,
};

const listings = [
  { id: 1, title: "Draculaura — Haunt Couture Midnight", franchise: "Monster High", cond: "New In Box", price: 425, oldPrice: 510, img: "https://placehold.co/400x480/0d0d1b/ff2d8a?text=Haunt+Couture", badges: ["Rare", "Price Drop"], likes: 287, views: 1540, watchers: 72 },
  { id: 2, title: "Resurrection Posey — Series IV", franchise: "Living Dead Dolls", cond: "Mint", price: 310, img: "https://placehold.co/400x480/0d0d1b/9333ea?text=Posey+IV", badges: ["Rare"], likes: 198, views: 920, watchers: 53 },
  { id: 3, title: "Pullip Noir Fantasia — LE 300", franchise: "Pullip", cond: "New", price: 245, img: "https://placehold.co/400x480/0d0d1b/22d3ee?text=Noir+LE", badges: ["New"], likes: 104, views: 560, watchers: 31 },
  { id: 4, title: "Custom BJD — Absinthe Revenant", franchise: "BJD", cond: "Custom OOAK", price: 1350, img: "https://placehold.co/400x480/0d0d1b/b06cf0?text=Absinthe", badges: ["Rare"], likes: 412, views: 2800, watchers: 118 },
  { id: 5, title: "Blythe Neo — Phantom Lace", franchise: "Blythe", cond: "Mint In Box", price: 340, img: "https://placehold.co/400x480/0d0d1b/ff5ea8?text=Phantom", badges: [], likes: 89, views: 480, watchers: 22 },
  { id: 6, title: "Cleo de Nile — Vault Edition", franchise: "Monster High", cond: "New In Box", price: 590, oldPrice: 680, img: "https://placehold.co/400x480/0d0d1b/f5b731?text=Vault+Cleo", badges: ["Rare", "Price Drop"], likes: 324, views: 1780, watchers: 95 },
  { id: 7, title: "Frankie Stein — Dawn of the Dance", franchise: "Monster High", cond: "Like New", price: 185, img: "https://placehold.co/400x480/0d0d1b/22d3ee?text=Dawn+Dance", badges: [], likes: 67, views: 310, watchers: 14 },
  { id: 8, title: "Isul Nightmare King", franchise: "Pullip", cond: "New", price: 270, img: "https://placehold.co/400x480/0d0d1b/9333ea?text=Nightmare", badges: ["New"], likes: 53, views: 240, watchers: 11 },
];

const reviews = [
  { user: "NocturneCollects", rating: 5, text: "Immaculate packaging, perfectly described. Velvet Crypt is the gold standard for collector transactions.", date: "2 days ago", tags: ["Great Packaging", "Accurate Description", "Fast Shipping"] },
  { user: "DollHouseNoir", rating: 5, text: "Third purchase here. Blythe arrived pristine. Already watching the next drop.", date: "1 week ago", tags: ["Fast Shipping", "Great Communication", "Repeat Buyer"] },
  { user: "CrypticToyVault", rating: 5, text: "The custom BJD exceeded expectations. True artisan quality.", date: "2 weeks ago", tags: ["Accurate Description", "Premium Quality"] },
  { user: "PhantomShelfie", rating: 4, text: "Lovely item, international shipping was a bit slow but communication was perfect throughout.", date: "1 month ago", tags: ["Great Communication", "Accurate Description"] },
];

const tabList = ["For Sale", "Sold", "Collection", "Reviews", "About"];
const sortOpts = ["Newest", "Price: Low → High", "Price: High → Low", "Most Popular"];
const condOpts = ["All", "New", "Mint", "Like New", "Custom"];
const catOpts = ["All", "Monster High", "Living Dead Dolls", "Pullip", "BJD", "Blythe"];

// ─── Inline Components ───

const Star = ({ filled }: { filled: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? T.gold : "none"} stroke={T.gold} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Stars = ({ rating }: { rating: number }) => (
  <span style={{ display: "inline-flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}
  </span>
);

const badgeMap: Record<string, string> = { Rare: T.gold, New: T.cyan, "Price Drop": T.pink, Reserved: T.purple };

const Badge = ({ label }: { label: string }) => {
  const c = badgeMap[label] || T.textMuted;
  return (
    <span style={{
      padding: "3px 11px", borderRadius: T.pill, fontSize: "9px", fontWeight: 800,
      textTransform: "uppercase", letterSpacing: "1px",
      background: c + "14", color: c, border: `1px solid ${c}20`,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>{label}</span>
  );
};

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const GradientDivider = ({ vertical = false }: { vertical?: boolean }) => (
  <div style={{
    background: `linear-gradient(${vertical ? "180deg" : "90deg"}, transparent, ${T.border}80, transparent)`,
    ...(vertical ? { width: "1px", alignSelf: "stretch", margin: "0 4px" } : { height: "1px", width: "100%" }),
  }} />
);

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px",
    color: T.purpleLight, marginBottom: "16px", fontFamily: T.mono,
    display: "flex", alignItems: "center", gap: "10px",
  }}>
    <span style={{ width: "16px", height: "1px", background: T.purpleLight, opacity: 0.3 }} />
    {children}
  </div>
);

// ─── Main Component ───

export default function SellerVariant5() {
  const [tab, setTab] = useState("For Sale");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("Newest");
  const [cond, setCond] = useState("All");
  const [cat, setCat] = useState("All");
  const [hovCard, setHovCard] = useState<number | null>(null);
  const [hovBtn, setHovBtn] = useState<string | null>(null);
  const [hovPinned, setHovPinned] = useState(false);

  const items = useMemo(() => {
    let r = [...listings];
    if (q) r = r.filter(i => i.title.toLowerCase().includes(q.toLowerCase()));
    if (cond !== "All") r = r.filter(i => i.cond.toLowerCase().includes(cond.toLowerCase()));
    if (cat !== "All") r = r.filter(i => i.franchise === cat);
    if (sort.includes("Low")) r.sort((a, b) => a.price - b.price);
    else if (sort.includes("High →")) r.sort((a, b) => b.price - a.price);
    else if (sort === "Most Popular") r.sort((a, b) => b.likes - a.likes);
    return r;
  }, [q, sort, cond, cat]);

  const trustData: { val: string; sub?: string; label: string; color: string }[] = [
    { val: `${seller.stats.rating}`, sub: "/ 5", label: "Seller Rating", color: T.gold },
    { val: seller.stats.sales.toLocaleString(), label: "Completed Sales", color: T.pink },
    { val: `${seller.stats.listings}`, label: "Active Listings", color: T.text },
    { val: seller.stats.followers.toLocaleString(), label: "Followers", color: T.purpleLight },
    { val: seller.responseTime, label: "Avg Response", color: T.cyan },
    { val: `${seller.stats.repeatBuyers}`, label: "Return Buyers", color: T.pinkSoft },
  ];

  const btnStyle = (
    bg: string, fg: string, key: string,
    extra?: React.CSSProperties
  ): React.CSSProperties => ({
    background: bg, color: fg, border: "none", borderRadius: T.pill,
    padding: "12px 0", fontSize: "10px", fontWeight: 900, width: "100%",
    textTransform: "uppercase", letterSpacing: "2.5px", fontFamily: T.mono,
    cursor: "pointer", transition: T.ease,
    boxShadow: hovBtn === key ? `0 0 28px ${bg}35` : "none",
    transform: hovBtn === key ? "scale(1.03)" : "scale(1)",
    ...extra,
  });

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", color: T.text, fontFamily: T.font,
      position: "relative", overflow: "hidden",
    }}>
      {/* ─── Atmosphere ─── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-400px", right: "-300px", width: "900px", height: "900px", borderRadius: "50%", background: `radial-gradient(circle, ${T.purple}08 0%, transparent 60%)`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-300px", left: "-250px", width: "700px", height: "700px", borderRadius: "50%", background: `radial-gradient(circle, ${T.pink}04 0%, transparent 60%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "35%", right: "-50px", width: "450px", height: "450px", borderRadius: "50%", background: `radial-gradient(circle, ${T.cyan}03 0%, transparent 55%)`, filter: "blur(50px)" }} />
        {/* Top edge accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent 10%, ${T.pink}12 35%, ${T.purple}10 65%, transparent 90%)` }} />
      </div>

      <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "0 36px", position: "relative", zIndex: 1 }}>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  HERO                                                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", paddingTop: "52px", paddingBottom: "44px" }}>
          {/* Backdrop surface */}
          <div style={{
            position: "absolute", top: "16px", left: "-48px", right: "-48px", bottom: "-8px",
            background: `linear-gradient(180deg, ${T.bgSurface}60 0%, transparent 100%)`,
            borderRadius: "28px", border: `1px solid ${T.borderSubtle}`,
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", display: "flex", gap: "44px", alignItems: "flex-start" }}>
            {/* ── Avatar Column ── */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{ position: "relative" }}>
                {/* Outer ring glow */}
                <div style={{
                  position: "absolute", inset: "-8px", borderRadius: "50%",
                  background: `conic-gradient(from 200deg, ${T.pink}35, ${T.purple}30, ${T.cyan}15, ${T.purple}30, ${T.pink}35)`,
                  filter: "blur(8px)", opacity: 0.65,
                }} />
                {/* Ring border */}
                <div style={{
                  position: "absolute", inset: "-4px", borderRadius: "50%",
                  background: `conic-gradient(from 200deg, ${T.pink}50, ${T.purple}40, ${T.cyan}25, ${T.purple}40, ${T.pink}50)`,
                  padding: "2px",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
                }} />
                <img src={seller.avatar} alt={seller.name} style={{
                  position: "relative", width: "130px", height: "130px", borderRadius: "50%",
                  border: `3px solid ${T.bgDeep}`,
                  boxShadow: `0 0 60px ${T.pink}12, 0 0 120px ${T.purple}06`,
                  background: T.bgCard,
                }} />
                {/* Tier badge */}
                <div style={{
                  position: "absolute", bottom: "0px", left: "50%", transform: "translateX(-50%)",
                  padding: "4px 18px", borderRadius: T.pill, fontSize: "8px", fontWeight: 900,
                  textTransform: "uppercase", letterSpacing: "2.5px",
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`, color: "#08080f",
                  boxShadow: `0 3px 16px ${T.gold}28`,
                  border: `1px solid ${T.gold}40`,
                }}>
                  {seller.tier}
                </div>
              </div>
              {/* Storefront indicator */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <span style={{
                  fontSize: "7px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px",
                  color: T.textDim, fontFamily: T.mono,
                }}>
                  Storefront
                </span>
                <div style={{
                  width: "20px", height: "2px", borderRadius: "1px",
                  background: `linear-gradient(90deg, ${T.pink}30, ${T.purple}30)`,
                }} />
              </div>
            </div>

            {/* ── Identity Column ── */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: "6px" }}>
              {/* Name row */}
              <div style={{ marginBottom: "6px" }}>
                <h1 style={{
                  fontSize: "38px", fontWeight: 900, margin: "0 0 0", letterSpacing: "-0.8px",
                  lineHeight: 1.0, display: "inline",
                }}>
                  {seller.name}
                </h1>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 14px", borderRadius: T.pill, fontSize: "9px", fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "1.5px",
                  background: `${T.cyan}08`, color: T.cyan, border: `1px solid ${T.cyan}12`,
                  marginLeft: "16px", verticalAlign: "middle", position: "relative", top: "-4px",
                }}>
                  <ShieldIcon /> {seller.role}
                </span>
              </div>

              <p style={{
                fontSize: "13px", color: T.textMuted, fontFamily: T.mono, margin: "0 0 14px",
                letterSpacing: "0.3px",
              }}>
                {seller.handle}
              </p>

              <p style={{
                fontSize: "14px", color: T.textSoft, lineHeight: 1.75, margin: "0 0 16px",
                maxWidth: "520px",
              }}>
                {seller.bio}
              </p>

              {/* Meta row */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "14px",
                fontSize: "11px", color: T.textDim, marginBottom: "18px",
                padding: "8px 18px", borderRadius: T.pill,
                background: `${T.bgCard}80`, border: `1px solid ${T.borderSubtle}`,
              }}>
                <span>📍 {seller.location}</span>
                <GradientDivider vertical />
                <span>Since {seller.joined}</span>
                <GradientDivider vertical />
                <span>{seller.payments.slice(0, 3).join(" · ")}</span>
              </div>

              {/* Specialty tags */}
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                {seller.specialties.map(sp => (
                  <span key={sp} style={{
                    padding: "5px 14px", borderRadius: T.pill, fontSize: "10px", fontWeight: 700,
                    background: `${T.purple}08`, color: T.purpleLight, border: `1px solid ${T.purple}10`,
                    transition: T.easeFast,
                  }}>{sp}</span>
                ))}
              </div>
            </div>

            {/* ── Actions Column ── */}
            <div style={{
              flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px",
              paddingTop: "10px", minWidth: "164px",
            }}>
              <button style={btnStyle(T.pink, "#08080f", "follow")}
                onMouseEnter={() => setHovBtn("follow")} onMouseLeave={() => setHovBtn(null)}
              >Follow</button>
              <button style={btnStyle(T.purple, "#fff", "msg")}
                onMouseEnter={() => setHovBtn("msg")} onMouseLeave={() => setHovBtn(null)}
              >Message</button>
              <button style={{
                background: "transparent", color: T.textSoft, border: `1px solid ${T.border}`,
                borderRadius: T.pill, padding: "11px 0", fontSize: "10px", fontWeight: 700,
                width: "100%", textTransform: "uppercase", letterSpacing: "2.5px",
                fontFamily: T.mono, cursor: "pointer", transition: T.ease,
              }}>Share</button>
              <div style={{ height: "6px" }} />
              <button style={{
                background: `linear-gradient(135deg, ${T.purple}, ${T.pink})`, color: "#fff",
                border: "none", borderRadius: T.pill, padding: "12px 0", fontSize: "10px",
                fontWeight: 900, width: "100%", textTransform: "uppercase", letterSpacing: "2.5px",
                fontFamily: T.mono, cursor: "pointer", transition: T.ease,
                boxShadow: `0 4px 24px ${T.purple}18, 0 0 0 1px ${T.pink}08`,
              }}>+ New Listing</button>
              <div style={{
                textAlign: "center", fontSize: "8px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "2px",
                color: T.textDim, fontFamily: T.mono, marginTop: "2px",
              }}>Manage Storefront</div>
            </div>
          </div>
        </div>

        {/* Hero-Trust divider */}
        <div style={{
          height: "1px", margin: "0 -36px",
          background: `linear-gradient(90deg, transparent 5%, ${T.pink}10 25%, ${T.purple}0c 50%, ${T.pink}10 75%, transparent 95%)`,
        }} />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  TRUST STRIP                                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div style={{ padding: "30px 0 28px", display: "flex", alignItems: "stretch" }}>
          {trustData.map((d, i) => (
            <React.Fragment key={d.label}>
              {i > 0 && <GradientDivider vertical />}
              <div style={{ flex: 1, textAlign: "center", padding: "8px 8px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "3px", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "22px", fontWeight: 900, color: d.color, letterSpacing: "-0.5px",
                  }}>{d.val}</span>
                  {d.sub && <span style={{ fontSize: "11px", fontWeight: 700, color: T.textDim }}>{d.sub}</span>}
                </div>
                <div style={{
                  fontSize: "8px", fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "2px", color: T.textDim, fontFamily: T.mono,
                }}>{d.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${T.border}, transparent)`,
        }} />

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  TABS                                                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div style={{
          display: "flex", gap: "0", marginTop: "4px",
          borderBottom: `1px solid ${T.border}`, marginBottom: "32px",
        }}>
          {tabList.map(t => {
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "14px 28px", background: "transparent", border: "none",
                borderBottom: active ? `2px solid ${T.pink}` : "2px solid transparent",
                fontSize: "11px", fontWeight: active ? 900 : 700,
                textTransform: "uppercase", letterSpacing: "2px",
                color: active ? T.pink : T.textDim,
                cursor: "pointer", transition: T.ease,
              }}>
                {t}
                {t === "For Sale" && (
                  <span style={{
                    marginLeft: "8px", padding: "2px 8px", borderRadius: T.pill,
                    fontSize: "9px", fontWeight: 800,
                    background: active ? `${T.pink}12` : `${T.border}`,
                    color: active ? T.pink : T.textDim,
                  }}>{seller.stats.listings}</span>
                )}
                {t === "Reviews" && (
                  <span style={{
                    marginLeft: "8px", padding: "2px 8px", borderRadius: T.pill,
                    fontSize: "9px", fontWeight: 800,
                    background: active ? `${T.pink}12` : `${T.border}`,
                    color: active ? T.pink : T.textDim,
                  }}>{seller.stats.sales}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  FOR SALE                                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab === "For Sale" && (
          <>
            {/* ─── Pinned Grail ─── */}
            <div
              style={{
                position: "relative", marginBottom: "36px", borderRadius: "20px",
                border: `1px solid ${hovPinned ? T.borderHov : T.borderAccent}`,
                background: `linear-gradient(135deg, ${T.bgSurface} 0%, ${T.bgCard} 100%)`,
                overflow: "hidden", cursor: "pointer", transition: T.ease,
                boxShadow: hovPinned
                  ? `0 12px 48px ${T.pink}0c, inset 0 1px 0 ${T.pink}08`
                  : `inset 0 1px 0 rgba(255,255,255,0.02)`,
              }}
              onMouseEnter={() => setHovPinned(true)}
              onMouseLeave={() => setHovPinned(false)}
            >
              {/* Subtle corner glow */}
              <div style={{
                position: "absolute", top: "-60px", left: "-60px", width: "200px", height: "200px",
                borderRadius: "50%", background: `radial-gradient(circle, ${T.gold}06 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", minHeight: "220px" }}>
                {/* Image side */}
                <div style={{ position: "relative", width: "340px", flexShrink: 0, overflow: "hidden" }}>
                  <img src={pinnedListing.img} alt={pinnedListing.title} style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    transition: T.ease, transform: hovPinned ? "scale(1.06)" : "scale(1)",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(100deg, transparent 55%, ${T.bgSurface}f0 100%)`,
                  }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(180deg, transparent 70%, ${T.bgSurface}80 100%)`,
                  }} />
                  {/* Grail badge */}
                  <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                    <span style={{
                      padding: "5px 16px", borderRadius: T.pill, fontSize: "9px", fontWeight: 900,
                      textTransform: "uppercase", letterSpacing: "2.5px",
                      background: `${T.gold}12`, color: T.gold, border: `1px solid ${T.gold}20`,
                      backdropFilter: "blur(16px)",
                    }}>⟐ Pinned Grail</span>
                  </div>
                </div>
                {/* Content side */}
                <div style={{ flex: 1, padding: "32px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{
                    fontSize: "8px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px",
                    color: T.gold, marginBottom: "10px", fontFamily: T.mono,
                    display: "flex", alignItems: "center", gap: "8px",
                  }}>
                    <span style={{ width: "12px", height: "1px", background: T.gold, opacity: 0.4 }} />
                    Featured Listing
                  </div>
                  <h3 style={{
                    fontSize: "22px", fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.4px",
                    lineHeight: 1.15,
                  }}>
                    {pinnedListing.title}
                  </h3>
                  <div style={{
                    fontSize: "10px", color: T.textDim, textTransform: "uppercase",
                    letterSpacing: "1.5px", marginBottom: "10px",
                  }}>{pinnedListing.franchise} · {pinnedListing.cond}</div>
                  <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.7, margin: "0 0 18px", maxWidth: "400px" }}>
                    {pinnedListing.desc}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: T.pink, letterSpacing: "-0.5px" }}>
                      ${pinnedListing.price.toLocaleString()}
                    </span>
                    <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: T.textDim }}>
                      <span>♡ {pinnedListing.likes}</span>
                      <span>👁 {pinnedListing.views.toLocaleString()}</span>
                      <span>🔖 {pinnedListing.watchers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Filters ─── */}
            <div style={{
              display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center",
            }}>
              <input style={{
                flex: "1 1 240px", background: T.bgCard, border: `1px solid ${T.border}`,
                borderRadius: T.pill, padding: "11px 20px", fontSize: "13px",
                color: T.text, outline: "none", fontFamily: T.font, transition: T.ease,
              }} placeholder="Search listings…" value={q} onChange={e => setQ(e.target.value)} />
              {[
                { val: sort, set: setSort, opts: sortOpts },
                { val: cond, set: setCond, opts: condOpts },
                { val: cat, set: setCat, opts: catOpts },
              ].map((f, i) => (
                <select key={i} style={{
                  background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.pill,
                  padding: "11px 16px", fontSize: "11px", color: T.text, outline: "none",
                  fontFamily: T.font, cursor: "pointer",
                }} value={f.val} onChange={e => f.set(e.target.value)}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>

            <div style={{
              fontSize: "11px", color: T.textDim, marginBottom: "22px",
              fontFamily: T.mono, letterSpacing: "0.5px",
            }}>
              {items.length} listing{items.length !== 1 ? "s" : ""} available
            </div>

            {/* ─── Cards Grid ─── */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
              gap: "20px", marginBottom: "80px",
            }}>
              {items.map(item => {
                const isHov = hovCard === item.id;
                const hasRare = item.badges.includes("Rare");
                return (
                  <div key={item.id}
                    style={{
                      background: T.bgCard, borderRadius: T.radius,
                      border: `1px solid ${isHov ? T.borderHov : hasRare ? `${T.gold}08` : T.borderSubtle}`,
                      overflow: "hidden", cursor: "pointer", transition: T.ease,
                      transform: isHov ? "translateY(-5px)" : "none",
                      boxShadow: isHov
                        ? `0 20px 56px ${T.pink}0c, 0 0 0 1px ${T.pink}06`
                        : "none",
                    }}
                    onMouseEnter={() => setHovCard(item.id)}
                    onMouseLeave={() => setHovCard(null)}
                  >
                    {/* Image zone */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img src={item.img} alt={item.title} style={{
                        width: "100%", height: "320px", objectFit: "cover", display: "block",
                        transition: T.ease, transform: isHov ? "scale(1.05)" : "scale(1)",
                      }} />
                      {/* Atmospheric overlays */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: `linear-gradient(180deg, ${T.bgCard}10 0%, transparent 30%, ${T.bgCard}d0 85%, ${T.bgCard} 100%)`,
                      }} />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: `radial-gradient(ellipse at 50% 30%, transparent 40%, ${T.bgCard}30 100%)`,
                      }} />
                      {/* Badges */}
                      {item.badges.length > 0 && (
                        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "5px" }}>
                          {item.badges.map(b => <Badge key={b} label={b} />)}
                        </div>
                      )}
                      {/* Price overlay at bottom of image */}
                      <div style={{
                        position: "absolute", bottom: "14px", left: "16px", right: "16px",
                        display: "flex", alignItems: "baseline", justifyContent: "space-between",
                      }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{
                            fontSize: "24px", fontWeight: 900, color: T.pink,
                            textShadow: `0 2px 20px ${T.bgCard}`,
                          }}>
                            ${item.price}
                          </span>
                          {item.oldPrice && (
                            <span style={{ fontSize: "13px", color: T.textDim, textDecoration: "line-through" }}>
                              ${item.oldPrice}
                            </span>
                          )}
                        </div>
                        {/* Condition tag on image */}
                        <span style={{
                          padding: "3px 10px", borderRadius: T.pill,
                          fontSize: "8px", fontWeight: 800, letterSpacing: "1px",
                          background: `${T.bgCard}b0`, color: T.cyanDim,
                          border: `1px solid ${T.cyan}10`, textTransform: "uppercase",
                          backdropFilter: "blur(12px)",
                        }}>{item.cond}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "14px 18px 18px" }}>
                      <div style={{
                        fontSize: "10px", color: T.textDim, textTransform: "uppercase",
                        letterSpacing: "1.5px", marginBottom: "5px", fontFamily: T.mono,
                      }}>{item.franchise}</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.35 }}>
                        {item.title}
                      </div>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: "14px",
                      }}>
                        <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: T.textDim }}>
                          <span>♡ {item.likes}</span>
                          <span>👁 {item.views.toLocaleString()}</span>
                          <span>🔖 {item.watchers}</span>
                        </div>
                      </div>
                      <button style={{
                        width: "100%", padding: "10px", borderRadius: T.pill,
                        background: isHov ? `${T.pink}12` : `${T.pink}06`,
                        color: T.pink,
                        border: `1px solid ${isHov ? `${T.pink}22` : `${T.pink}0e`}`,
                        fontSize: "9px", fontWeight: 900, textTransform: "uppercase",
                        letterSpacing: "2.5px", fontFamily: T.mono, cursor: "pointer",
                        transition: T.ease,
                      }}>View Listing</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  REVIEWS                                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab === "Reviews" && (
          <div style={{ maxWidth: "720px" }}>
            {/* Rating summary */}
            <div style={{
              display: "flex", alignItems: "center", gap: "24px", marginBottom: "36px",
              padding: "28px 32px", background: T.bgSurface, borderRadius: "20px",
              border: `1px solid ${T.border}`,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "46px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1 }}>
                  {seller.stats.rating}
                </div>
                <div style={{ marginTop: "6px" }}><Stars rating={seller.stats.rating} /></div>
              </div>
              <GradientDivider vertical />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "10px" }}>
                  Based on {seller.stats.sales.toLocaleString()} verified transactions
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["98% Positive", "Top Seller", "Fast Shipper"].map(tag => (
                    <span key={tag} style={{
                      padding: "4px 14px", borderRadius: T.pill, fontSize: "10px", fontWeight: 700,
                      background: `${T.cyan}08`, color: T.cyanDim, border: `1px solid ${T.cyan}0c`,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {reviews.map((r, i) => (
              <div key={i} style={{
                background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius,
                padding: "24px 26px", marginBottom: "14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Mini avatar */}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${T.purple}20, ${T.pink}15)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 800, color: T.purpleLight,
                    }}>{r.user[0]}</div>
                    <span style={{ fontWeight: 800, fontSize: "13px" }}>{r.user}</span>
                    {r.tags.includes("Repeat Buyer") && (
                      <span style={{
                        padding: "2px 9px", borderRadius: T.pill, fontSize: "8px", fontWeight: 800,
                        background: `${T.purple}10`, color: T.purpleLight, border: `1px solid ${T.purple}12`,
                        textTransform: "uppercase", letterSpacing: "1px",
                      }}>Repeat</span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: T.textDim }}>{r.date}</span>
                </div>
                <Stars rating={r.rating} />
                <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.75, margin: "10px 0 14px" }}>{r.text}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {r.tags.filter(t => t !== "Repeat Buyer").map(t => (
                    <span key={t} style={{
                      padding: "4px 12px", borderRadius: T.pill, fontSize: "10px", fontWeight: 700,
                      background: `${T.cyan}06`, color: T.cyanDim, border: `1px solid ${T.cyan}0a`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  ABOUT                                                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab === "About" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", maxWidth: "900px" }}>
            {[
              { label: "About", content: <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.8, margin: 0 }}>{seller.aboutNote}</p> },
              { label: "Specialties", content: (
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                  {seller.specialties.map(x => (
                    <span key={x} style={{
                      padding: "6px 16px", borderRadius: T.pill, fontSize: "10px", fontWeight: 700,
                      background: `${T.purple}08`, color: T.purpleLight, border: `1px solid ${T.purple}0e`,
                    }}>{x}</span>
                  ))}
                </div>
              )},
              { label: "Shipping & Handling", content: <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.8, margin: 0 }}>{seller.shippingNote}</p> },
              { label: "Seller Preferences", content: (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.borderSubtle}` }}>
                    <span style={{ fontSize: "12px", color: T.textMuted }}>Accepts Offers</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: seller.acceptsOffers ? T.cyan : T.textDim }}>{seller.acceptsOffers ? "Yes" : "No"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                    <span style={{ fontSize: "12px", color: T.textMuted }}>Payment</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: T.textSoft }}>{seller.payments.join(", ")}</span>
                  </div>
                </div>
              )},
            ].map(({ label, content }) => (
              <div key={label} style={{
                background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius,
                padding: "28px",
              }}>
                <SectionLabel>{label}</SectionLabel>
                {content}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*  EMPTY STATES                                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        {(tab === "Sold" || tab === "Collection") && (() => {
          const isSold = tab === "Sold";
          const accent = isSold ? T.pink : T.purple;
          return (
            <div style={{ textAlign: "center", padding: "90px 0 80px" }}>
              <div style={{
                position: "relative", width: "120px", height: "120px", margin: "0 auto 28px",
              }}>
                {/* Outer ring */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: `1px solid ${accent}10`,
                }} />
                <div style={{
                  position: "absolute", inset: "12px", borderRadius: "50%",
                  border: `1px dashed ${accent}0c`,
                }} />
                <div style={{
                  position: "absolute", inset: "24px", borderRadius: "50%",
                  background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "32px", opacity: 0.5 }}>{isSold ? "📦" : "💎"}</span>
                </div>
              </div>
              <div style={{
                fontSize: "14px", fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "4px", color: T.textMuted, marginBottom: "12px",
              }}>
                {isSold ? "Sold Archive" : "Collection Showcase"}
              </div>
              <p style={{
                fontSize: "13px", color: T.textDim, maxWidth: "380px",
                margin: "0 auto", lineHeight: 1.75,
              }}>
                {isSold
                  ? "Completed transactions and sold items will appear here with full history and buyer ratings."
                  : "Personal collection highlights, grail pieces, and wishlist items will be showcased here."}
              </p>
              <div style={{
                marginTop: "28px", padding: "9px 28px", borderRadius: T.pill,
                background: `${accent}06`, display: "inline-block",
                fontSize: "9px", fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "2.5px", color: accent, fontFamily: T.mono,
                border: `1px solid ${accent}0c`,
              }}>Coming Soon</div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
