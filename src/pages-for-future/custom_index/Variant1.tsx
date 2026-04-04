import React, { useState } from "react";

// =============================================================================
// VARIANT 1 — "CINEMATIC GALLERY"
// Dark, editorial, full-bleed. Museum-exhibit feel. Image-first storytelling.
// Mood: dramatic, luxurious, immersive. Minimal chrome, maximal visual impact.
// =============================================================================

const IMAGES = {
  hero: "/images/doll-hero.jpg",
  detail1: "/images/doll-detail1.jpg",
  detail2: "/images/doll-detail2.jpg",
  detail3: "/images/doll-detail3.jpg",
  before: "/images/doll-before.jpg",
  artist: "/images/artist-avatar.jpg",
  other1: "/images/doll-other1.jpg",
  other2: "/images/doll-other2.jpg",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

  .v1-root {
    --bg: #0a0a0c;
    --fg: #e8e6e1;
    --fg-dim: #8a8780;
    --fg-muted: #5a5854;
    --accent: #c9a87c;
    --accent-glow: #e8c99b;
    --surface: #141416;
    --surface-hover: #1c1c1f;
    --border: #2a2a2d;
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'Inter', -apple-system, sans-serif;

    margin: 0; padding: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--sans);
    font-weight: 300;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  .v1-root *, .v1-root *::before, .v1-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ---- NAV ---- */
  .v1-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    background: linear-gradient(180deg, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0) 100%);
    pointer-events: none;
  }
  .v1-nav > * { pointer-events: auto; }
  .v1-logo {
    font-family: var(--serif); font-size: 20px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--accent);
    text-decoration: none;
  }
  .v1-nav-actions { display: flex; gap: 24px; align-items: center; }
  .v1-nav-btn {
    background: none; border: none; color: var(--fg-dim); cursor: pointer;
    font-family: var(--sans); font-size: 13px; letter-spacing: 1px;
    text-transform: uppercase; transition: color 0.3s;
  }
  .v1-nav-btn:hover { color: var(--fg); }

  /* ---- HERO ---- */
  .v1-hero {
    position: relative; width: 100%; height: 100vh;
    display: flex; align-items: flex-end;
    overflow: hidden;
  }
  .v1-hero-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center 20%;
    filter: brightness(0.7) contrast(1.1);
  }
  .v1-hero-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(0deg, var(--bg) 0%, rgba(10,10,12,0.4) 40%, transparent 70%);
  }
  .v1-hero-content {
    position: relative; z-index: 2; padding: 0 48px 80px; max-width: 720px;
  }
  .v1-hero-label {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 16px; font-weight: 500;
  }
  .v1-hero-title {
    font-family: var(--serif); font-size: 64px; font-weight: 700;
    line-height: 1.1; margin-bottom: 16px; color: var(--fg);
  }
  .v1-hero-subtitle {
    font-size: 18px; color: var(--fg-dim); line-height: 1.5; max-width: 540px;
  }
  .v1-hero-scroll {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 2; color: var(--fg-muted); font-size: 11px; letter-spacing: 2px;
    text-transform: uppercase; display: flex; flex-direction: column; align-items: center; gap: 8px;
    animation: v1-pulse 2s ease-in-out infinite;
  }
  @keyframes v1-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

  /* ---- SECTIONS ---- */
  .v1-section {
    padding: 120px 48px; max-width: 1400px; margin: 0 auto;
  }
  .v1-section-label {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 32px; font-weight: 500;
  }
  .v1-divider {
    width: 60px; height: 1px; background: var(--accent); margin: 0 auto 64px;
    opacity: 0.5;
  }

  /* ---- STORY ---- */
  .v1-story {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .v1-story-text h2 {
    font-family: var(--serif); font-size: 36px; font-weight: 400;
    font-style: italic; line-height: 1.3; margin-bottom: 32px; color: var(--fg);
  }
  .v1-story-text p {
    font-size: 15px; color: var(--fg-dim); line-height: 1.8; margin-bottom: 20px;
  }
  .v1-story-img {
    width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px;
  }

  /* ---- GALLERY STRIP ---- */
  .v1-gallery-strip {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;
    padding: 0;
  }
  .v1-gallery-item {
    position: relative; overflow: hidden; cursor: pointer;
    aspect-ratio: 1;
  }
  .v1-gallery-item img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease, filter 0.6s ease;
    filter: brightness(0.85);
  }
  .v1-gallery-item:hover img { transform: scale(1.05); filter: brightness(1); }
  .v1-gallery-item-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 24px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--fg); background: linear-gradient(transparent, rgba(0,0,0,0.7));
    opacity: 0; transition: opacity 0.4s;
  }
  .v1-gallery-item:hover .v1-gallery-item-label { opacity: 1; }

  /* ---- BEFORE/AFTER ---- */
  .v1-compare {
    display: grid; grid-template-columns: 1fr 48px 1fr; gap: 0; align-items: center;
    max-width: 900px; margin: 0 auto;
  }
  .v1-compare img {
    width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px;
  }
  .v1-compare-arrow {
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 24px;
  }
  .v1-compare-labels {
    display: grid; grid-template-columns: 1fr 48px 1fr;
    max-width: 900px; margin: 16px auto 0; text-align: center;
  }
  .v1-compare-labels span {
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-muted);
  }

  /* ---- SPECS ---- */
  .v1-specs {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
  }
  .v1-specs-col h3 {
    font-family: var(--serif); font-size: 22px; margin-bottom: 32px; font-weight: 400;
    color: var(--fg);
  }
  .v1-spec-row {
    display: flex; justify-content: space-between; padding: 14px 0;
    border-bottom: 1px solid var(--border); font-size: 14px;
  }
  .v1-spec-row dt { color: var(--fg-muted); }
  .v1-spec-row dd { color: var(--fg); text-align: right; font-weight: 400; }

  /* ---- TAGS ---- */
  .v1-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 40px; }
  .v1-tag {
    padding: 6px 16px; border: 1px solid var(--border); border-radius: 100px;
    font-size: 12px; color: var(--fg-dim); letter-spacing: 0.5px;
    transition: all 0.3s;
  }
  .v1-tag:hover { border-color: var(--accent); color: var(--accent); }

  /* ---- ARTIST ---- */
  .v1-artist {
    display: flex; align-items: center; gap: 24px;
    padding: 40px; background: var(--surface); border-radius: 8px;
    max-width: 600px;
  }
  .v1-artist-avatar {
    width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
    border: 2px solid var(--accent);
  }
  .v1-artist-name {
    font-family: var(--serif); font-size: 20px; margin-bottom: 4px; color: var(--fg);
  }
  .v1-artist-bio {
    font-size: 13px; color: var(--fg-dim); line-height: 1.5;
  }

  /* ---- MORE CUSTOMS ---- */
  .v1-more-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
    max-width: 700px;
  }
  .v1-more-card {
    position: relative; overflow: hidden; border-radius: 4px; cursor: pointer;
    aspect-ratio: 2/3;
  }
  .v1-more-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s; filter: brightness(0.8);
  }
  .v1-more-card:hover img { transform: scale(1.04); filter: brightness(0.95); }
  .v1-more-card-info {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
  }
  .v1-more-card-info h4 { font-family: var(--serif); font-size: 16px; color: var(--fg); }
  .v1-more-card-info span { font-size: 12px; color: var(--fg-muted); }

  /* ---- ACTIONS BAR ---- */
  .v1-actions {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 12px; padding: 12px 20px;
    background: rgba(20,20,22,0.9); backdrop-filter: blur(12px);
    border: 1px solid var(--border); border-radius: 100px; z-index: 50;
  }
  .v1-action-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--fg-dim);
    font-family: var(--sans); font-size: 13px; cursor: pointer;
    padding: 8px 16px; border-radius: 100px; transition: all 0.3s;
  }
  .v1-action-btn:hover { color: var(--fg); background: var(--surface-hover); }
  .v1-action-btn.liked { color: #e85d75; }

  /* ---- FOOTER ---- */
  .v1-footer {
    padding: 48px; text-align: center; font-size: 12px; color: var(--fg-muted);
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .v1-hero-title { font-size: 36px; }
    .v1-hero-content { padding: 0 24px 60px; }
    .v1-section { padding: 80px 24px; }
    .v1-story { grid-template-columns: 1fr; gap: 40px; }
    .v1-gallery-strip { grid-template-columns: 1fr; }
    .v1-specs { grid-template-columns: 1fr; gap: 40px; }
    .v1-compare { grid-template-columns: 1fr; gap: 16px; }
    .v1-compare-arrow { transform: rotate(90deg); }
    .v1-compare-labels { grid-template-columns: 1fr; }
    .v1-nav { padding: 16px 24px; }
    .v1-more-grid { grid-template-columns: 1fr; }
  }
`;

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Variant1() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(247);

  return (
    <div className="v1-root">
      <style>{css}</style>

      {/* NAV */}
      <nav className="v1-nav">
        <a href="/" className="v1-logo">Monstrino</a>
        <div className="v1-nav-actions">
          <button className="v1-nav-btn">Explore</button>
          <button className="v1-nav-btn">Artists</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="v1-hero">
        <img src={IMAGES.hero} alt="Nebula Draculaura custom doll" className="v1-hero-img" />
        <div className="v1-hero-gradient" />
        <div className="v1-hero-content">
          <div className="v1-hero-label">One-of-a-Kind Custom</div>
          <h1 className="v1-hero-title">Nebula Draculaura</h1>
          <p className="v1-hero-subtitle">
            A galaxy-inspired reimagining of Draculaura, featuring hand-painted nebula eyes,
            full reroot in iridescent purple and teal, and a couture black lace gown.
          </p>
        </div>
        <div className="v1-hero-scroll">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* STORY */}
      <section className="v1-section">
        <div className="v1-divider" />
        <div className="v1-story">
          <div className="v1-story-text">
            <div className="v1-section-label">The Story</div>
            <h2>"She was born from stardust and velvet darkness"</h2>
            <p>
              Nebula Draculaura began as a standard Draculaura from the original Monster High line.
              Over three months of careful work, she was transformed into a celestial being — her
              factory face wiped clean, then rebuilt stroke by stroke with galaxy-themed eyes that
              seem to hold entire constellations.
            </p>
            <p>
              Every detail is intentional: the iridescent hair was rerooted strand by strand using
              heat-resistant nylon in custom-blended purple and teal tones. The black lace gown was
              hand-sewn with silver thread embroidery and crystal micro-beading.
            </p>
          </div>
          <img src={IMAGES.detail1} alt="Face detail close-up" className="v1-story-img" loading="lazy" />
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section style={{ padding: "0" }}>
        <div className="v1-gallery-strip">
          <div className="v1-gallery-item">
            <img src={IMAGES.detail1} alt="Galaxy eyes detail" loading="lazy" />
            <div className="v1-gallery-item-label">Face Repaint</div>
          </div>
          <div className="v1-gallery-item">
            <img src={IMAGES.detail2} alt="Rerooted hair detail" loading="lazy" />
            <div className="v1-gallery-item-label">Hair Reroot</div>
          </div>
          <div className="v1-gallery-item">
            <img src={IMAGES.detail3} alt="Handmade gown detail" loading="lazy" />
            <div className="v1-gallery-item-label">Couture Outfit</div>
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="v1-section">
        <div className="v1-section-label" style={{ textAlign: "center" }}>Transformation</div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, textAlign: "center", marginBottom: 48, fontWeight: 400 }}>
          Before &amp; After
        </h2>
        <div className="v1-compare">
          <img src={IMAGES.before} alt="Original Draculaura" loading="lazy" />
          <div className="v1-compare-arrow"><ArrowRight /></div>
          <img src={IMAGES.hero} alt="Custom Nebula Draculaura" loading="lazy" />
        </div>
        <div className="v1-compare-labels">
          <span>Original</span>
          <span></span>
          <span>Custom</span>
        </div>
      </section>

      {/* SPECS */}
      <section className="v1-section">
        <div className="v1-divider" />
        <div className="v1-specs">
          <div className="v1-specs-col">
            <h3>Custom Details</h3>
            <dl>
              {[
                ["Custom Name", "Nebula Draculaura"],
                ["Artist", "Luna Voss"],
                ["Created", "January 2024"],
                ["Modifications", "Full repaint, reroot, outfit, accessories"],
                ["Techniques", "Acrylic & pastel repaint, nylon reroot, hand sewing"],
                ["Materials", "Mr. Super Clear, Liquitex acrylics, Saran hair, silk lace"],
                ["Time to Complete", "~3 months"],
              ].map(([k, v]) => (
                <div className="v1-spec-row" key={k}>
                  <dt>{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="v1-specs-col">
            <h3>Original Base Doll</h3>
            <dl>
              {[
                ["Character", "Draculaura"],
                ["Line", "Original Monster High"],
                ["Series", "Basic / Wave 1"],
                ["Manufacturer", "Mattel"],
                ["Year", "2010"],
                ["Body Type", "Standard articulated"],
                ["Skin Tone", "Pale pink"],
              ].map(([k, v]) => (
                <div className="v1-spec-row" key={k}>
                  <dt>{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="v1-tags">
              {["galaxy", "celestial", "dark couture", "fantasy", "repaint", "reroot", "OOAK", "gothic glam"].map(t => (
                <span className="v1-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTIST */}
      <section className="v1-section">
        <div className="v1-section-label">The Artist</div>
        <div className="v1-artist">
          <img src={IMAGES.artist} alt="Luna Voss" className="v1-artist-avatar" loading="lazy" />
          <div>
            <div className="v1-artist-name">Luna Voss</div>
            <div className="v1-artist-bio">
              Doll customizer based in Portland, OR. Specializing in fantasy repaints and
              couture miniature fashion. 4 years of custom work, 60+ completed OOAKs.
            </div>
          </div>
        </div>
      </section>

      {/* MORE BY ARTIST */}
      <section className="v1-section">
        <div className="v1-section-label">More by Luna Voss</div>
        <div className="v1-more-grid">
          <div className="v1-more-card">
            <img src={IMAGES.other1} alt="Silver Specter Frankie" loading="lazy" />
            <div className="v1-more-card-info">
              <h4>Silver Specter Frankie</h4>
              <span>2023</span>
            </div>
          </div>
          <div className="v1-more-card">
            <img src={IMAGES.other2} alt="Blossom Phantom Lagoona" loading="lazy" />
            <div className="v1-more-card-info">
              <h4>Blossom Phantom Lagoona</h4>
              <span>2023</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHIVAL META */}
      <section className="v1-section" style={{ paddingBottom: 160 }}>
        <div className="v1-divider" />
        <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
          <div className="v1-section-label" style={{ textAlign: "center" }}>Archive</div>
          <div style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.8 }}>
            Published on Monstrino · January 18, 2024<br />
            Catalog ID: MNS-2024-0842<br />
            Photography by Luna Voss<br />
            247 likes · 18 saves
          </div>
        </div>
      </section>

      {/* FLOATING ACTIONS */}
      <div className="v1-actions">
        <button
          className={`v1-action-btn ${liked ? "liked" : ""}`}
          onClick={() => { setLiked(!liked); setLikeCount(c => liked ? c - 1 : c + 1); }}
        >
          <HeartIcon filled={liked} /> {likeCount}
        </button>
        <button className="v1-action-btn"><BookmarkIcon /> Save</button>
        <button className="v1-action-btn"><ShareIcon /> Share</button>
      </div>

      <footer className="v1-footer">
        Monstrino © 2024 — Where monsters become art
      </footer>
    </div>
  );
}
