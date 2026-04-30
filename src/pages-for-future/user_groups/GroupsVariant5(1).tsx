import React, { useState, useMemo } from 'react';

// ─── THEME ─────────────────────────────────────────────
const T = {
  bg: '#07070e',
  bgSurface: '#0c0c18',
  bgCard: '#111120',
  bgCardH: '#191932',
  bgInput: '#0f0f1e',
  border: '#1a1a34',
  borderH: '#2a2a50',
  pink: '#ff2d78',
  pinkD: 'rgba(255,45,120,0.12)',
  pinkG: 'rgba(255,45,120,0.22)',
  purple: '#8b5cf6',
  purpleD: 'rgba(139,92,246,0.10)',
  purpleG: 'rgba(139,92,246,0.22)',
  cyan: '#06b6d4',
  cyanD: 'rgba(6,182,212,0.10)',
  gold: '#f59e0b',
  goldD: 'rgba(245,158,11,0.10)',
  green: '#22c55e',
  yellow: '#eab308',
  text: '#eaeaf4',
  tm: '#6a6a90',
  td: '#404060',
  f: "'Inter','Helvetica Neue',system-ui,sans-serif",
  m: "'SF Mono','JetBrains Mono','Fira Code',monospace",
  r: 14,
  rp: 999,
};

// ─── TYPES & DATA ──────────────────────────────────────
type Access = 'public' | 'private' | 'invite-only';
type Cat = 'Trading' | 'Regional' | 'Series-based' | 'Curated' | 'Custom' | 'Alerts' | 'Archive';

interface Group {
  id: number; name: string; desc: string; cat: Cat; access: Access;
  members: number; activity: 'high' | 'medium' | 'low'; tags: string[]; last: string;
  topic?: string; isMember?: boolean; role?: string; unread?: number; event?: string;
  isElite?: boolean; value?: string; recommended?: boolean;
}

const GROUPS: Group[] = [
  { id: 1, name: 'Skullector Drop Hunters', desc: 'Track every Skullector collaboration drop in real time. Never miss a release.', cat: 'Alerts', access: 'public', members: 2340, activity: 'high', tags: ['drops', 'skullector', 'collab'], last: '2m', topic: 'New Skullector × Mattel leak spotted', isMember: true, role: 'member', unread: 5, event: 'Live Drop Watch — Fri 9PM', value: 'Real-time drop tracking', recommended: true },
  { id: 2, name: 'Monster High Germany', desc: 'German-speaking collector community. Meetups, trades, and local finds across DACH.', cat: 'Regional', access: 'public', members: 870, activity: 'medium', tags: ['germany', 'meetup', 'regional'], last: '15m', isMember: true, role: 'moderator', unread: 2, value: 'Weekly local meetups' },
  { id: 3, name: 'EU Trade Circle', desc: 'Verified European trading hub. Fair trades, insured shipping, trusted escrow.', cat: 'Trading', access: 'private', members: 1560, activity: 'high', tags: ['trading', 'EU', 'verified'], last: '5m', topic: 'ISO: G3 Cleo De Nile original packaging', isMember: true, role: 'admin', unread: 0, event: 'Monthly Trade Fair — Saturday', value: 'Verified trade moderation' },
  { id: 4, name: 'G1 Completion Society', desc: 'Dedicated to completing Generation 1 collections. Expert authentication and sourcing help.', cat: 'Series-based', access: 'invite-only', members: 320, activity: 'medium', tags: ['G1', 'vintage', 'authentication'], last: '1h', topic: 'Authentication guide updated for 2024', isElite: true, value: 'Authentication experts' },
  { id: 5, name: 'Creeproduction Watch', desc: 'All Creeproduction releases monitored. Quality reviews, comparisons, and defect reports.', cat: 'Series-based', access: 'public', members: 1890, activity: 'high', tags: ['creeproduction', 'reviews'], last: '8m', value: 'Quality comparison reviews', recommended: true },
  { id: 6, name: 'Custom Collectors Lab', desc: 'Share custom dolls, techniques, and commission work. All skill levels welcome.', cat: 'Custom', access: 'public', members: 2100, activity: 'high', tags: ['custom', 'art', 'commission'], last: '3m', topic: 'Reroot tutorial: kanekalon vs nylon', value: 'Curated technique tutorials' },
  { id: 7, name: 'Rare Variants Archive', desc: 'Cataloging and documenting rare factory variants, errors, and prototype finds.', cat: 'Archive', access: 'invite-only', members: 180, activity: 'low', tags: ['rare', 'prototype', 'archive'], last: '3h', isElite: true, value: 'Invite-only archive access' },
  { id: 8, name: 'Midnight Drop Alerts', desc: 'Real-time notifications for surprise drops, restocks, and limited releases worldwide.', cat: 'Alerts', access: 'public', members: 4200, activity: 'high', tags: ['alerts', 'drops', 'restock'], last: '1m', value: 'Instant restock notifications', recommended: true },
  { id: 9, name: 'Cologne Collector Meetup', desc: 'Köln-based collector group. Monthly meetups, local trades, and community events.', cat: 'Regional', access: 'public', members: 95, activity: 'low', tags: ['cologne', 'meetup', 'local'], last: '2d', value: 'Monthly in-person meetups' },
  { id: 10, name: 'The Vault', desc: 'Ultra-exclusive circle for verified high-value collectors. Strict vetting, trusted members only.', cat: 'Curated', access: 'invite-only', members: 42, activity: 'medium', tags: ['elite', 'verified', 'high-value'], last: '30m', topic: 'SDCC 2024 exclusive unboxing', isElite: true, value: 'High-value collector verification' },
  { id: 11, name: 'Haunt Couture Circle', desc: 'Fashion-focused collectors. Haunt Couture reviews, styling shoots, and photography.', cat: 'Curated', access: 'private', members: 650, activity: 'medium', tags: ['fashion', 'haunt-couture', 'photography'], last: '45m', value: 'Curated photography reviews' },
  { id: 12, name: 'Reel Drama Society', desc: 'Celebrating the Reel Drama line. News, reviews, display inspiration, and community votes.', cat: 'Series-based', access: 'public', members: 1200, activity: 'medium', tags: ['reel-drama', 'display'], last: '20m', value: 'Community display showcases' },
];

const ACTIVITIES = [
  { type: 'drop', group: 'Midnight Drop Alerts', text: '⚡ Mattel Creations restock detected — Draculaura Reel Drama', time: '1m', hot: true },
  { type: 'trade', group: 'EU Trade Circle', text: 'ISO: Draculaura first wave, mint in box — 3 offers received', time: '8m', hot: true },
  { type: 'discussion', group: 'Custom Collectors Lab', text: 'New reroot technique shared by @artisan_dolls — 24 reactions', time: '12m', hot: false },
  { type: 'event', group: 'Cologne Collector Meetup', text: 'Spring meetup confirmed — April 20th, Rheinpark venue', time: '1h', hot: false },
  { type: 'drop', group: 'Skullector Drop Hunters', text: 'Leak confirmed: new Skullector collab packaging spotted', time: '15m', hot: true },
];

// ─── ICONS ─────────────────────────────────────────────
const Ic = {
  search: (c = T.tm) => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  users: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  lock: <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  star: <svg width="12" height="12" fill={T.gold} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>,
  crown: <svg width="14" height="14" fill={T.gold} viewBox="0 0 24 24"><path d="M2 20h20l-2-12-5 4-3-6-3 6-5-4z"/></svg>,
  trend: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={T.pink} strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  bell: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={T.cyan} strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  activity: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  shield: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={T.green} strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  spark: <svg width="10" height="10" fill={T.pink} viewBox="0 0 24 24"><path d="M12 0l3 9h9l-7.5 5.5L19.5 24 12 18l-7.5 6 3-9.5L0 9h9z"/></svg>,
  live: <svg width="10" height="10" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill={T.pink}/><circle cx="6" cy="6" r="6" fill="none" stroke={T.pink} strokeWidth="1.5" opacity="0.4"/></svg>,
};

// ─── COMPONENT ─────────────────────────────────────────
const GroupsVariant5: React.FC = () => {
  const [search, setSearch] = useState('');
  const [accessF, setAccessF] = useState<Access | 'all'>('all');
  const [catF, setCatF] = useState<Cat | 'all'>('all');
  const [sort, setSort] = useState<'active' | 'members' | 'newest' | 'recommended'>('active');
  const [hov, setHov] = useState<number | null>(null);
  const [joined, setJoined] = useState<Set<number>>(new Set([1, 2, 3]));

  const myGroups = GROUPS.filter(g => g.isMember);
  const eliteGroups = GROUPS.filter(g => g.isElite || g.access === 'invite-only');
  const trending = GROUPS.filter(g => g.activity === 'high').slice(0, 4);
  const cats: Cat[] = ['Trading', 'Regional', 'Series-based', 'Curated', 'Custom', 'Alerts', 'Archive'];
  const totalCollectors = GROUPS.reduce((a, g) => a + g.members, 0);

  const filtered = useMemo(() => {
    let r = GROUPS.filter(g => {
      if (search) {
        const q = search.toLowerCase();
        if (!g.name.toLowerCase().includes(q) && !g.desc.toLowerCase().includes(q) && !g.tags.some(t => t.includes(q))) return false;
      }
      if (accessF !== 'all' && g.access !== accessF) return false;
      if (catF !== 'all' && g.cat !== catF) return false;
      return true;
    });
    const al: Record<string, number> = { high: 3, medium: 2, low: 1 };
    r.sort((a, b) => sort === 'members' ? b.members - a.members : sort === 'newest' ? b.id - a.id : sort === 'recommended' ? (b.activity === 'high' ? 1 : 0) - (a.activity === 'high' ? 1 : 0) || b.members - a.members : (al[b.activity] || 0) - (al[a.activity] || 0));
    return r;
  }, [search, accessF, catF, sort]);

  const toggleJoin = (id: number) => setJoined(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // ─── STYLE HELPERS ─────────────────────────────────
  const pill = (active: boolean, c?: string): React.CSSProperties => ({
    background: active ? (c || T.pink) : 'transparent',
    color: active ? (c === T.gold ? '#0a0a10' : c === T.purple ? '#fff' : '#0a0a10') : T.tm,
    border: `1px solid ${active ? 'transparent' : T.border}`,
    borderRadius: T.rp, padding: '6px 16px',
    fontSize: 10, fontWeight: 700, fontFamily: T.m,
    textTransform: 'uppercase', letterSpacing: 1.5,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .25s ease',
  });

  const badge = (a: Access): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 3,
    background: a === 'invite-only' ? T.purpleD : a === 'private' ? T.pinkD : T.cyanD,
    color: a === 'invite-only' ? T.purple : a === 'private' ? T.pink : T.cyan,
    borderRadius: T.rp, padding: '3px 10px', fontSize: 9, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 1,
  });

  const dot = (l: string): React.CSSProperties => ({
    width: 7, height: 7, borderRadius: '50%',
    background: l === 'high' ? T.green : l === 'medium' ? T.yellow : '#555',
    display: 'inline-block',
  });

  const joinBtn = (a: Access): React.CSSProperties => ({
    background: a === 'invite-only' ? `linear-gradient(135deg, ${T.purple}, #6d28d9)` : T.pink,
    color: a === 'invite-only' ? '#fff' : '#0a0a10',
    border: 'none', borderRadius: T.rp, padding: '7px 20px',
    fontFamily: T.m, fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 1.5, cursor: 'pointer', transition: 'all .25s ease',
  });

  const sectionLabel = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontSize: 11, fontWeight: 800, letterSpacing: 6,
    textTransform: 'uppercase', marginBottom: 22,
    display: 'flex', alignItems: 'center', gap: 8,
    color: T.tm,
    ...extra,
  });

  // Most active my-group = first one with highest unread or activity
  const primaryMyGroup = myGroups.reduce((best, g) => (g.unread || 0) > (best.unread || 0) ? g : best, myGroups[0]);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: T.f }}>

      {/* ═══════ HERO ═══════ */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '100px 0 80px' }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: -120, left: '22%', width: 600, height: 600, background: `radial-gradient(circle, ${T.purpleG} 0%, transparent 50%)`, filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, right: '16%', width: 450, height: 450, background: `radial-gradient(circle, ${T.pinkG} 0%, transparent 50%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '55%', width: 350, height: 350, background: `radial-gradient(circle, ${T.cyanD} 0%, transparent 55%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        {/* Network dots */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.03, zIndex: 0 }} viewBox="0 0 1400 500">
          {Array.from({ length: 50 }).map((_, i) => <circle key={`d${i}`} cx={60 + (i * 29) % 1340} cy={20 + (i * 43) % 470} r={1.2} fill="#fff" />)}
          {Array.from({ length: 18 }).map((_, i) => <line key={`l${i}`} x1={90 + (i * 67) % 1250} y1={40 + (i * 51) % 420} x2={190 + (i * 89) % 1250} y2={70 + (i * 41) % 420} stroke="#fff" strokeWidth={0.3} />)}
        </svg>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 7, textTransform: 'uppercase', color: T.purple, fontFamily: T.m, marginBottom: 24, opacity: 0.8 }}>Monstrino Collector Network</div>
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: 10, textTransform: 'uppercase', margin: 0, lineHeight: 1.1, background: `linear-gradient(135deg, ${T.pink}, ${T.purple}, ${T.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Groups & Communities
          </h1>
          <p style={{ color: T.tm, fontSize: 14, marginTop: 14, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.8, letterSpacing: 0.3 }}>
            Curated circles. Verified collectors. Trusted networks.
          </p>

          {/* Stats — collectors is dominant */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 56, marginTop: 44, alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: T.pink }}>{GROUPS.length}</div>
              <div style={{ fontSize: 9, color: T.td, textTransform: 'uppercase', letterSpacing: 3, marginTop: 6, fontFamily: T.m }}>Communities</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: T.cyan, lineHeight: 1 }}>{totalCollectors.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: T.td, textTransform: 'uppercase', letterSpacing: 3, marginTop: 8, fontFamily: T.m }}>Collectors</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: T.purple }}>{myGroups.length}</div>
              <div style={{ fontSize: 9, color: T.td, textTransform: 'uppercase', letterSpacing: 3, marginTop: 6, fontFamily: T.m }}>Your Circles</div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 40 }}>
            <button style={{ background: `linear-gradient(135deg, ${T.pink}, #e91e6d)`, color: '#080810', border: 'none', borderRadius: T.rp, padding: '12px 36px', fontFamily: T.m, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, cursor: 'pointer', transition: 'all .25s ease' }}>Explore</button>
            <button style={{ background: `linear-gradient(135deg, ${T.purple}, #7c3aed)`, color: '#fff', border: 'none', borderRadius: T.rp, padding: '12px 36px', fontFamily: T.m, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, cursor: 'pointer', transition: 'all .25s ease' }}>Create Group</button>
            <button style={{ background: 'transparent', color: T.text, border: `1px solid ${T.border}`, borderRadius: T.rp, padding: '12px 36px', fontFamily: T.m, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, cursor: 'pointer', transition: 'all .25s ease' }}>My Groups</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* ═══════ MY GROUPS ═══════ */}
        <div style={{ marginBottom: 72, paddingTop: 8 }}>
          <div style={sectionLabel({ color: T.text, fontSize: 12 })}>Your Communities</div>

          {/* Primary group — visually dominant */}
          <div
            style={{
              background: hov === primaryMyGroup.id + 1000 ? T.bgCardH : `linear-gradient(135deg, rgba(139,92,246,0.06), rgba(255,45,120,0.04))`,
              border: `1px solid ${hov === primaryMyGroup.id + 1000 ? T.borderH : 'rgba(139,92,246,0.15)'}`,
              borderRadius: T.r, padding: 26, cursor: 'pointer', transition: 'all .3s ease',
              transform: hov === primaryMyGroup.id + 1000 ? 'translateY(-2px)' : 'none',
              boxShadow: hov === primaryMyGroup.id + 1000 ? `0 14px 44px ${T.pinkD}` : 'none',
              marginBottom: 16,
            }}
            onMouseEnter={() => setHov(primaryMyGroup.id + 1000)} onMouseLeave={() => setHov(null)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${T.pink}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{primaryMyGroup.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{primaryMyGroup.name}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: T.m, color: primaryMyGroup.role === 'admin' ? T.pink : primaryMyGroup.role === 'moderator' ? T.purple : T.cyan }}>{primaryMyGroup.role}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.td }}><span style={dot(primaryMyGroup.activity)} /> {primaryMyGroup.activity} · {primaryMyGroup.last}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {primaryMyGroup.event && <div style={{ fontSize: 11, color: T.cyan, display: 'flex', alignItems: 'center', gap: 5, background: T.cyanD, padding: '5px 12px', borderRadius: T.rp }}>{Ic.bell} {primaryMyGroup.event}</div>}
                {(primaryMyGroup.unread || 0) > 0 && <span style={{ background: T.pink, color: '#0a0a10', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, boxShadow: `0 0 12px ${T.pinkD}` }}>{primaryMyGroup.unread}</span>}
              </div>
            </div>
          </div>

          {/* Other my-groups */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${myGroups.length - 1}, 1fr)`, gap: 14 }}>
            {myGroups.filter(g => g.id !== primaryMyGroup.id).map(g => (
              <div key={g.id}
                style={{
                  background: hov === g.id + 1000 ? T.bgCardH : T.bgCard,
                  border: `1px solid ${hov === g.id + 1000 ? T.borderH : T.border}`,
                  borderRadius: T.r, padding: 20, cursor: 'pointer', transition: 'all .3s ease',
                  transform: hov === g.id + 1000 ? 'translateY(-2px)' : 'none',
                  boxShadow: hov === g.id + 1000 ? `0 10px 36px ${T.pinkD}` : 'none',
                }}
                onMouseEnter={() => setHov(g.id + 1000)} onMouseLeave={() => setHov(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${T.pink}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0, opacity: 0.85 }}>{g.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: T.m, color: g.role === 'admin' ? T.pink : g.role === 'moderator' ? T.purple : T.cyan }}>{g.role}</span>
                    </div>
                  </div>
                  {(g.unread || 0) > 0 && <span style={{ background: T.pink, color: '#0a0a10', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{g.unread}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: T.td, marginTop: 12 }}>
                  <span style={dot(g.activity)} />
                  <span>{g.activity}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{g.last}</span>
                </div>
                {g.event && <div style={{ fontSize: 10, color: T.cyan, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>{Ic.bell} {g.event}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ PRESTIGE + TRENDING LAYER ═══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 72 }}>
          {/* Elite Circles */}
          <div>
            <div style={sectionLabel({ color: T.gold })}>{Ic.crown} Private Collector Circles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {eliteGroups.map(g => (
                <div key={g.id}
                  style={{
                    background: hov === g.id + 3000 ? 'rgba(139,92,246,0.10)' : 'rgba(139,92,246,0.03)',
                    border: `1px solid ${hov === g.id + 3000 ? 'rgba(245,158,11,0.25)' : 'rgba(139,92,246,0.12)'}`,
                    borderRadius: T.r, padding: 24, cursor: 'pointer', transition: 'all .3s ease',
                    transform: hov === g.id + 3000 ? 'translateY(-3px)' : 'none',
                    boxShadow: hov === g.id + 3000 ? '0 16px 50px rgba(139,92,246,0.18), 0 0 0 1px rgba(245,158,11,0.08)' : 'none',
                  }}
                  onMouseEnter={() => setHov(g.id + 3000)} onMouseLeave={() => setHov(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {Ic.star}
                    <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>{g.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.tm, lineHeight: 1.6, marginBottom: 12 }}>{g.desc}</div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: T.td, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{Ic.users} {g.members}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{Ic.lock} Invite Only</span>
                    <span style={dot(g.activity)} />
                  </div>
                  {g.value && <div style={{ fontSize: 10, color: T.gold, marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>{Ic.shield} {g.value}</div>}
                  <button style={{ ...joinBtn('invite-only'), marginTop: 14 }} onClick={e => { e.stopPropagation(); toggleJoin(g.id); }}>
                    {joined.has(g.id) ? 'Joined ✓' : 'Request Invite'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <div style={sectionLabel()}>{Ic.trend} Trending Communities</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {trending.map(g => (
                <div key={g.id}
                  style={{
                    background: hov === g.id + 2000 ? 'rgba(255,45,120,0.06)' : T.bgCard,
                    border: `1px solid ${hov === g.id + 2000 ? T.borderH : T.border}`,
                    borderRadius: T.r, padding: 22, cursor: 'pointer', transition: 'all .3s ease',
                    transform: hov === g.id + 2000 ? 'translateY(-2px)' : 'none',
                    boxShadow: hov === g.id + 2000 ? `0 10px 36px ${T.pinkD}` : 'none',
                  }}
                  onMouseEnter={() => setHov(g.id + 2000)} onMouseLeave={() => setHov(null)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{g.name}</div>
                    <span style={badge(g.access)}>{g.access}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.tm, lineHeight: 1.55, marginBottom: 10 }}>{g.desc}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: T.td, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{Ic.users} {g.members.toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={dot(g.activity)} /> {g.activity}</span>
                  </div>
                  {g.topic && <div style={{ fontSize: 11, color: T.pink, marginTop: 8, opacity: 0.85 }}>💬 {g.topic}</div>}
                  {g.value && <div style={{ fontSize: 10, color: T.cyan, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>{Ic.shield} {g.value}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ DISCOVER ═══════ */}
        <div style={{ marginBottom: 72 }}>
          <div style={sectionLabel()}>Discover Communities</div>

          {/* Search + Access Filters */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }}>{Ic.search()}</span>
              <input
                style={{ width: '100%', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.rp, padding: '11px 18px 11px 44px', color: T.text, fontSize: 14, fontFamily: T.f, outline: 'none', boxSizing: 'border-box', transition: 'border .25s ease' }}
                placeholder="Search communities..."
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={e => { e.currentTarget.style.borderColor = T.purple; }}
                onBlur={e => { e.currentTarget.style.borderColor = T.border; }}
              />
            </div>
            {(['all', 'public', 'private', 'invite-only'] as const).map(a => (
              <button key={a} style={pill(accessF === a)} onClick={() => setAccessF(a)}>
                {a === 'all' ? 'All Access' : a}
              </button>
            ))}
          </div>

          {/* Category + Sort */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <button style={pill(catF === 'all', T.purple)} onClick={() => setCatF('all')}>All Categories</button>
            {cats.map(c => <button key={c} style={pill(catF === c, T.purple)} onClick={() => setCatF(c)}>{c}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 10, color: T.td, fontFamily: T.m, letterSpacing: 1, textTransform: 'uppercase', marginRight: 4 }}>Sort:</span>
            {([['active', 'Most Active'], ['members', 'Most Members'], ['newest', 'Newest'], ['recommended', 'Recommended']] as const).map(([k, l]) => (
              <button key={k} style={pill(sort === k, T.cyan)} onClick={() => setSort(k as any)}>{l}</button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: T.td, fontFamily: T.m }}>{filtered.length} results</span>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {filtered.map(g => {
              const isSpecial = g.isElite || g.access === 'invite-only';
              const isHighActivity = g.activity === 'high';
              const isRecommended = g.recommended;
              return (
                <div key={g.id}
                  style={{
                    background: hov === g.id ? T.bgCardH : isSpecial ? 'rgba(139,92,246,0.04)' : T.bgCard,
                    border: `1px solid ${hov === g.id ? (isSpecial ? 'rgba(245,158,11,0.2)' : T.borderH) : isSpecial ? 'rgba(139,92,246,0.12)' : T.border}`,
                    borderRadius: T.r, padding: 22, cursor: 'pointer', transition: 'all .3s ease',
                    transform: hov === g.id ? 'translateY(-3px)' : 'none',
                    boxShadow: hov === g.id
                      ? isSpecial ? '0 14px 50px rgba(139,92,246,0.18)' : `0 12px 44px ${T.pinkD}`
                      : isHighActivity ? `0 0 0 1px rgba(34,197,94,0.06)` : 'none',
                    position: 'relative' as const,
                  }}
                  onMouseEnter={() => setHov(g.id)} onMouseLeave={() => setHov(null)}
                >
                  {/* Recommended badge */}
                  {isRecommended && (
                    <div style={{ position: 'absolute', top: -1, right: 20, background: `linear-gradient(135deg, ${T.pink}, ${T.purple})`, color: '#fff', fontSize: 8, fontWeight: 700, fontFamily: T.m, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px 4px', borderRadius: '0 0 8px 8px' }}>
                      Recommended
                    </div>
                  )}

                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 5, paddingRight: isRecommended ? 80 : 0 }}>
                      {g.isElite && Ic.star}
                      {g.name}
                    </span>
                    <span style={badge(g.access)}>{g.access === 'invite-only' && Ic.lock}{g.access}</span>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 12, color: T.tm, lineHeight: 1.6, marginBottom: 10 }}>{g.desc}</div>

                  {/* Value prop */}
                  {g.value && (
                    <div style={{ fontSize: 10, color: g.isElite ? T.gold : T.green, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      {Ic.shield} {g.value}
                    </div>
                  )}

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: T.td, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{Ic.users} {g.members.toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={dot(g.activity)} /> {g.activity}</span>
                    <span style={{ opacity: 0.5 }}>{g.cat}</span>
                    <span style={{ opacity: 0.5 }}>{g.last}</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
                    {g.tags.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: T.rp, padding: '2px 8px', fontSize: 9, color: T.td }}>#{t}</span>)}
                  </div>

                  {/* Featured topic */}
                  {g.topic && <div style={{ fontSize: 11, color: g.isElite ? T.gold : T.purple, marginTop: 10, opacity: 0.8 }}>{g.isElite ? '✦' : '💬'} {g.topic}</div>}

                  {/* Join button */}
                  <button style={{ ...joinBtn(g.access), marginTop: 14 }} onClick={e => { e.stopPropagation(); toggleJoin(g.id); }}>
                    {joined.has(g.id) ? 'Joined ✓' : g.access === 'invite-only' ? 'Request Invite' : g.access === 'private' ? 'Request Access' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: T.tm, padding: 48, fontSize: 14 }}>No communities match your criteria.</div>}
        </div>

        {/* ═══════ ACTIVITY PREVIEW ═══════ */}
        <div style={{ marginBottom: 48 }}>
          <div style={sectionLabel()}>{Ic.activity} Network Activity <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 8, fontSize: 9, color: T.pink, fontWeight: 700 }}>{Ic.live} Live</span></div>
          <div style={{ background: T.bgSurface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 24px',
                borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${T.border}` : 'none',
                alignItems: 'flex-start',
                background: a.hot ? 'rgba(255,45,120,0.02)' : 'transparent',
                transition: 'background .2s ease',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                  background: a.type === 'drop' ? T.pink : a.type === 'trade' ? T.cyan : a.type === 'event' ? T.purple : T.tm,
                  boxShadow: a.hot ? `0 0 8px ${a.type === 'drop' ? T.pinkD : T.cyanD}` : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: a.hot ? T.text : 'rgba(234,234,244,0.7)' }}>{a.text}</span>
                  <div style={{ fontSize: 10, color: T.td, marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span>{a.group}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{a.time}</span>
                    {a.hot && <span style={{ color: T.pink, fontWeight: 700, fontSize: 8, fontFamily: T.m, letterSpacing: 1, textTransform: 'uppercase' }}>Hot</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupsVariant5;
