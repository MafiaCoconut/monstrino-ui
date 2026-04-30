import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
const STAGES = ["discovered","fetched","parsed","enriched","ready_to_import","imported","failed"] as const;
type Stage = typeof STAGES[number];
type Status = "pending"|"running"|"completed"|"failed"|"needs_review"|"skipped";
type SortKey = "newest"|"oldest"|"priority"|"stage";
type QuickFilter = "failed"|"pending"|"ready"|"needs_review"|"ai_enriched"|null;
type DensityMode = "comfortable"|"compact"|"dense";
const INSPECTOR_TABS = ["General","Raw Data","Parsed","Enriched","Diff","AI Suggestions","Logs","Errors"] as const;
type InspectorTab = typeof INSPECTOR_TABS[number];

interface TimelineStep {
  stage: string; timestamp: string; duration: string; status: "completed"|"running"|"failed"|"pending";
}

interface IngestItem {
  id: string; externalId: string; title: string; source: string; sourceUrl: string;
  stage: Stage; status: Status; progress: number; priority: 1|2|3;
  flags: { error: boolean; duplicate: boolean; ai: boolean; manualReview: boolean };
  discoveredAt: string; updatedAt: string; rawData: string;
  parsed: { title: string; series: string; characters: string[]; accessories: string[]; images: string[] };
  enriched: { title: string; series: string; characters: string[]; confidence: number };
  aiSuggestions: { title: string; series: string; characters: string[]; images: string[] };
  logs: { time: string; message: string }[];
  errors: { message: string; step: string; service: string }[];
  timeline: TimelineStep[];
  validation: { missing: string[]; warnings: string[]; duplicates: string[]; conflicts: string[] };
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const mock: IngestItem[] = [
  { id:"ING-0001", externalId:"EXT-A91", title:"Kaiju Neon Rex — Midnight Edition", source:"monstrino-scraper", sourceUrl:"https://source.io/a91", stage:"enriched", status:"completed", progress:75, priority:1, flags:{error:false,duplicate:false,ai:true,manualReview:false}, discoveredAt:"2025-04-04T12:00:00Z", updatedAt:"2025-04-04T14:32:00Z", rawData:'{"name":"Kaiju Neon Rex","variant":"Midnight","sku":"KNR-001","price":89.99,"currency":"USD","edition_size":200}', parsed:{title:"Kaiju Neon Rex",series:"Kaiju Legends",characters:["Neon Rex"],accessories:["Stand","Card"],images:["img1.jpg","img1b.jpg"]}, enriched:{title:"Kaiju Neon Rex — Midnight Edition",series:"Kaiju Legends",characters:["Neon Rex","Shadow Rex"],confidence:0.94}, aiSuggestions:{title:"Kaiju Neon Rex — Midnight Edition",series:"Kaiju Legends",characters:["Neon Rex"],images:["img1.jpg","img2.jpg"]}, logs:[{time:"14:30",message:"Enrichment completed — confidence 94%"},{time:"14:12",message:"AI model v3.2 applied"},{time:"14:00",message:"Parsing completed — 6 fields extracted"},{time:"12:05",message:"Content fetched — 2.4KB"},{time:"12:01",message:"Fetching from source.io"},{time:"12:00",message:"Discovered via scheduled scan"}], errors:[], timeline:[{stage:"discovered",timestamp:"12:00:00",duration:"1m",status:"completed"},{stage:"fetched",timestamp:"12:05:00",duration:"4m",status:"completed"},{stage:"parsed",timestamp:"14:00:00",duration:"12m",status:"completed"},{stage:"enriched",timestamp:"14:32:00",duration:"20m",status:"completed"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:[],warnings:["Edition size not verified"],duplicates:[],conflicts:[]} },
  { id:"ING-0002", externalId:"EXT-B12", title:"Vinyl Phantom Ghost Bear", source:"partner-api", sourceUrl:"https://partner.io/b12", stage:"failed", status:"failed", progress:40, priority:2, flags:{error:true,duplicate:false,ai:false,manualReview:true}, discoveredAt:"2025-04-04T10:15:00Z", updatedAt:"2025-04-04T11:05:00Z", rawData:'{"name":"Phantom Ghost Bear","type":"vinyl","height":"8in"}', parsed:{title:"Vinyl Phantom Ghost Bear",series:"Phantom Line",characters:["Ghost Bear"],accessories:["Box"],images:["img3.jpg"]}, enriched:{title:"",series:"",characters:[],confidence:0}, aiSuggestions:{title:"Vinyl Phantom Ghost Bear",series:"Phantom Line",characters:["Ghost Bear"],images:[]}, logs:[{time:"11:05",message:"Enrichment failed — AI timeout"},{time:"10:30",message:"Parsed OK — 4 fields"},{time:"10:20",message:"Fetched — 1.8KB"},{time:"10:16",message:"Fetching from partner.io"},{time:"10:15",message:"Discovered via partner webhook"}], errors:[{message:"AI service timeout after 30s — model overloaded",step:"enrichment",service:"monstrino-ai"},{message:"Retry #1 also failed — connection reset",step:"enrichment",service:"monstrino-ai"}], timeline:[{stage:"discovered",timestamp:"10:15:00",duration:"1m",status:"completed"},{stage:"fetched",timestamp:"10:20:00",duration:"5m",status:"completed"},{stage:"parsed",timestamp:"10:30:00",duration:"10m",status:"completed"},{stage:"enriched",timestamp:"11:05:00",duration:"35m",status:"failed"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:["enriched_title","enriched_series"],warnings:["AI enrichment incomplete"],duplicates:[],conflicts:[]} },
  { id:"ING-0003", externalId:"EXT-C44", title:"Drip Skull Resin — Gold Flake", source:"manual-upload", sourceUrl:"", stage:"ready_to_import", status:"completed", progress:95, priority:1, flags:{error:false,duplicate:true,ai:true,manualReview:false}, discoveredAt:"2025-04-03T08:00:00Z", updatedAt:"2025-04-04T09:12:00Z", rawData:'{"name":"Drip Skull Gold","material":"resin","finish":"gold flake"}', parsed:{title:"Drip Skull Resin",series:"Drip Skull",characters:["Skull King"],accessories:["Certificate","Stand"],images:["img4.jpg","img5.jpg"]}, enriched:{title:"Drip Skull Resin — Gold Flake",series:"Drip Skull",characters:["Skull King"],confidence:0.88}, aiSuggestions:{title:"Drip Skull Resin — Gold Flake",series:"Drip Skull",characters:["Skull King"],images:["img4.jpg"]}, logs:[{time:"09:12",message:"Ready to import — all checks passed"},{time:"09:00",message:"Enrichment completed — confidence 88%"},{time:"08:45",message:"Duplicate check: possible match ING-0099"},{time:"08:30",message:"Parsed successfully"}], errors:[], timeline:[{stage:"discovered",timestamp:"08:00:00",duration:"30m",status:"completed"},{stage:"fetched",timestamp:"08:05:00",duration:"5m",status:"completed"},{stage:"parsed",timestamp:"08:30:00",duration:"25m",status:"completed"},{stage:"enriched",timestamp:"09:00:00",duration:"30m",status:"completed"},{stage:"ready_to_import",timestamp:"09:12:00",duration:"12m",status:"completed"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:[],warnings:[],duplicates:["Possible match: ING-0099 — Drip Skull Resin (Original)"],conflicts:[]} },
  { id:"ING-0004", externalId:"EXT-D07", title:"Mecha Bunny Unit-07", source:"monstrino-scraper", sourceUrl:"https://source.io/d07", stage:"parsed", status:"needs_review", progress:50, priority:3, flags:{error:false,duplicate:false,ai:false,manualReview:true}, discoveredAt:"2025-04-04T16:00:00Z", updatedAt:"2025-04-04T16:45:00Z", rawData:'{"name":"Mecha Bunny","unit":"07","line":"Mecha Series"}', parsed:{title:"Mecha Bunny Unit-07",series:"Mecha Series",characters:["Bunny-07"],accessories:["Weapon Pack"],images:["img6.jpg"]}, enriched:{title:"",series:"",characters:[],confidence:0}, aiSuggestions:{title:"Mecha Bunny Unit-07",series:"Mecha Series",characters:["Bunny-07"],images:[]}, logs:[{time:"16:45",message:"Flagged for manual review"},{time:"16:30",message:"Parsed — low confidence fields"},{time:"16:20",message:"Fetched"},{time:"16:00",message:"Discovered"}], errors:[], timeline:[{stage:"discovered",timestamp:"16:00:00",duration:"20m",status:"completed"},{stage:"fetched",timestamp:"16:20:00",duration:"10m",status:"completed"},{stage:"parsed",timestamp:"16:45:00",duration:"15m",status:"completed"},{stage:"enriched",timestamp:"—",duration:"—",status:"pending"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:["enriched_title"],warnings:["Low confidence parse"],duplicates:[],conflicts:[]} },
  { id:"ING-0005", externalId:"EXT-E55", title:"Cosmic Ooze Blob — UV Reactive", source:"partner-api", sourceUrl:"https://partner.io/e55", stage:"imported", status:"completed", progress:100, priority:1, flags:{error:false,duplicate:false,ai:true,manualReview:false}, discoveredAt:"2025-04-02T06:00:00Z", updatedAt:"2025-04-03T18:00:00Z", rawData:'{"name":"Cosmic Ooze","feature":"UV reactive","size":"6in"}', parsed:{title:"Cosmic Ooze Blob",series:"Cosmic Line",characters:["Ooze"],accessories:["UV Lamp"],images:["img7.jpg"]}, enriched:{title:"Cosmic Ooze Blob — UV Reactive",series:"Cosmic Line",characters:["Ooze"],confidence:0.97}, aiSuggestions:{title:"Cosmic Ooze Blob — UV Reactive",series:"Cosmic Line",characters:["Ooze"],images:["img7.jpg"]}, logs:[{time:"18:00",message:"Imported successfully to catalog"},{time:"17:00",message:"Import approved"},{time:"12:00",message:"Enriched — confidence 97%"},{time:"08:00",message:"Parsed"},{time:"06:10",message:"Fetched"},{time:"06:00",message:"Discovered"}], errors:[], timeline:[{stage:"discovered",timestamp:"06:00:00",duration:"10m",status:"completed"},{stage:"fetched",timestamp:"06:10:00",duration:"1h50m",status:"completed"},{stage:"parsed",timestamp:"08:00:00",duration:"4h",status:"completed"},{stage:"enriched",timestamp:"12:00:00",duration:"5h",status:"completed"},{stage:"ready_to_import",timestamp:"17:00:00",duration:"1h",status:"completed"},{stage:"imported",timestamp:"18:00:00",duration:"—",status:"completed"}], validation:{missing:[],warnings:[],duplicates:[],conflicts:[]} },
  { id:"ING-0006", externalId:"EXT-F88", title:"Shadow Fang Vinyl — Obsidian", source:"monstrino-scraper", sourceUrl:"https://source.io/f88", stage:"fetched", status:"running", progress:20, priority:2, flags:{error:false,duplicate:false,ai:false,manualReview:false}, discoveredAt:"2025-04-04T17:30:00Z", updatedAt:"2025-04-04T17:35:00Z", rawData:'{"name":"Shadow Fang","variant":"Obsidian"}', parsed:{title:"",series:"",characters:[],accessories:[],images:[]}, enriched:{title:"",series:"",characters:[],confidence:0}, aiSuggestions:{title:"",series:"",characters:[],images:[]}, logs:[{time:"17:35",message:"Fetching content — 45% complete"},{time:"17:31",message:"Connection established"},{time:"17:30",message:"Discovered via scan"}], errors:[], timeline:[{stage:"discovered",timestamp:"17:30:00",duration:"1m",status:"completed"},{stage:"fetched",timestamp:"17:35:00",duration:"—",status:"running"},{stage:"parsed",timestamp:"—",duration:"—",status:"pending"},{stage:"enriched",timestamp:"—",duration:"—",status:"pending"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:["parsed_title","enriched_title"],warnings:[],duplicates:[],conflicts:[]} },
  { id:"ING-0007", externalId:"EXT-G22", title:"Toxic Slime Sofubi — Glow Edition", source:"partner-api", sourceUrl:"https://partner.io/g22", stage:"discovered", status:"pending", progress:5, priority:1, flags:{error:false,duplicate:false,ai:false,manualReview:false}, discoveredAt:"2025-04-04T18:00:00Z", updatedAt:"2025-04-04T18:01:00Z", rawData:'{"name":"Toxic Slime","glow":true}', parsed:{title:"",series:"",characters:[],accessories:[],images:[]}, enriched:{title:"",series:"",characters:[],confidence:0}, aiSuggestions:{title:"",series:"",characters:[],images:[]}, logs:[{time:"18:01",message:"Queued for fetching"},{time:"18:00",message:"Discovered via partner webhook"}], errors:[], timeline:[{stage:"discovered",timestamp:"18:00:00",duration:"1m",status:"completed"},{stage:"fetched",timestamp:"—",duration:"—",status:"pending"},{stage:"parsed",timestamp:"—",duration:"—",status:"pending"},{stage:"enriched",timestamp:"—",duration:"—",status:"pending"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:["parsed_title","enriched_title"],warnings:[],duplicates:[],conflicts:[]} },
  { id:"ING-0008", externalId:"EXT-H03", title:"Crystal Demon Lord — Amethyst Variant", source:"monstrino-scraper", sourceUrl:"https://source.io/h03", stage:"enriched", status:"needs_review", progress:80, priority:1, flags:{error:false,duplicate:false,ai:true,manualReview:true}, discoveredAt:"2025-04-04T14:00:00Z", updatedAt:"2025-04-04T15:20:00Z", rawData:'{"name":"Crystal Demon Lord","variant":"Amethyst","limited":true}', parsed:{title:"Crystal Demon Lord",series:"Demon Lords",characters:["Demon Lord"],accessories:["Throne","Cape"],images:["img8.jpg","img8b.jpg"]}, enriched:{title:"Crystal Demon Lord — Amethyst Variant",series:"Demon Lords",characters:["Demon Lord","Crystal Minion"],confidence:0.82}, aiSuggestions:{title:"Crystal Demon Lord — Amethyst Variant",series:"Demon Lords",characters:["Demon Lord"],images:["img8.jpg"]}, logs:[{time:"15:20",message:"Flagged for review — new character detected"},{time:"15:10",message:"Enriched — confidence 82%"},{time:"14:40",message:"Parsed"},{time:"14:10",message:"Fetched"},{time:"14:00",message:"Discovered"}], errors:[], timeline:[{stage:"discovered",timestamp:"14:00:00",duration:"10m",status:"completed"},{stage:"fetched",timestamp:"14:10:00",duration:"30m",status:"completed"},{stage:"parsed",timestamp:"14:40:00",duration:"30m",status:"completed"},{stage:"enriched",timestamp:"15:20:00",duration:"40m",status:"completed"},{stage:"ready_to_import",timestamp:"—",duration:"—",status:"pending"},{stage:"imported",timestamp:"—",duration:"—",status:"pending"}], validation:{missing:[],warnings:["New character 'Crystal Minion' not in database"],duplicates:[],conflicts:["Character count mismatch: parsed=1, enriched=2"]} },
];

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const P = {
  bg: "#08070d",
  bgSurface: "#0d0c15",
  bgCard: "#100f1a",
  bgElevated: "#151325",
  bgHover: "#1a1830",
  border: "#1e1b2e",
  borderSubtle: "#16142a",
  borderFocus: "#9333ea",
  textPrimary: "#eae6f5",
  textSecondary: "#9994b0",
  textMuted: "#5c5775",
  textDim: "#3e3a55",
  pink: "#ec4899",
  purple: "#a855f7",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  cyan: "#22d3ee",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  gradientPrimary: "linear-gradient(135deg,#ec4899,#a855f7)",
  gradientSubtle: "linear-gradient(135deg,#a855f710,#ec489908)",
  glowPink: "0 0 20px rgba(236,72,153,0.2)",
  glowPurple: "0 0 20px rgba(168,85,247,0.15)",
  font: "'Inter','SF Pro Display',system-ui,-apple-system,sans-serif",
  mono: "'JetBrains Mono','SF Mono','Fira Code',monospace",
};

const stageColor: Record<Stage,string> = {
  discovered: P.indigo, fetched: P.cyan, parsed: P.violet,
  enriched: P.purple, ready_to_import: "#06d6a0", imported: P.green, failed: P.red,
};
const stageLabel: Record<Stage,string> = {
  discovered:"Discovered", fetched:"Fetched", parsed:"Parsed",
  enriched:"Enriched", ready_to_import:"Ready", imported:"Imported", failed:"Failed",
};
const statusColor: Record<Status,string> = {
  pending: P.yellow, running: P.cyan, completed: P.green,
  failed: P.red, needs_review: P.orange, skipped: "#6b7280",
};

const priorityConfig: Record<1|2|3, { color: string; label: string; bg: string }> = {
  1: { color: P.pink, label: "P1", bg: P.pink + "18" },
  2: { color: P.purple, label: "P2", bg: P.purple + "10" },
  3: { color: P.textMuted, label: "P3", bg: P.textMuted + "10" },
};

const densityStyles: Record<DensityMode, { rowPad: string; gap: number; fontSize: number }> = {
  comfortable: { rowPad: "12px 14px", gap: 6, fontSize: 13 },
  compact: { rowPad: "8px 14px", gap: 3, fontSize: 12 },
  dense: { rowPad: "5px 14px", gap: 2, fontSize: 11 },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const MonstrinoVariant5: React.FC = () => {
  const [search, setSearch] = useState("");
  const [qf, setQf] = useState<QuickFilter>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [stageFilter, setStageFilter] = useState<Stage|null>(null);
  const [selected, setSelected] = useState<IngestItem|null>(null);
  const [tab, setTab] = useState<InspectorTab>("General");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(false);
  const [viewMode, setViewMode] = useState<"list"|"grid">("list");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [aiRerunning, setAiRerunning] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCheck = useCallback((id: string) => {
    setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const data = useMemo(() => {
    let d = [...mock];
    if (search) {
      const s = search.toLowerCase();
      d = d.filter(i => i.title.toLowerCase().includes(s) || i.id.toLowerCase().includes(s) || i.externalId.toLowerCase().includes(s) || i.source.toLowerCase().includes(s));
    }
    if (qf === "failed") d = d.filter(i => i.status === "failed");
    if (qf === "pending") d = d.filter(i => i.status === "pending" || i.status === "running");
    if (qf === "ready") d = d.filter(i => i.stage === "ready_to_import");
    if (qf === "needs_review") d = d.filter(i => i.flags.manualReview);
    if (qf === "ai_enriched") d = d.filter(i => i.flags.ai);
    if (stageFilter) d = d.filter(i => i.stage === stageFilter);
    if (sort === "newest") d.sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt));
    if (sort === "oldest") d.sort((a, b) => a.discoveredAt.localeCompare(b.discoveredAt));
    if (sort === "priority") d.sort((a, b) => a.priority - b.priority);
    if (sort === "stage") d.sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage));
    return d;
  }, [search, qf, sort, stageFilter]);

  const stats = useMemo(() => ({
    total: mock.length,
    failed: mock.filter(i => i.status === "failed").length,
    review: mock.filter(i => i.flags.manualReview).length,
    ai: mock.filter(i => i.flags.ai).length,
    ready: mock.filter(i => i.stage === "ready_to_import").length,
    imported: mock.filter(i => i.stage === "imported").length,
  }), []);

  const stageCounts = useMemo(() => {
    const m: Record<string, number> = {};
    STAGES.forEach(s => m[s] = mock.filter(i => i.stage === s).length);
    return m;
  }, []);

  // ─── KEYBOARD SHORTCUTS ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        setFocusIdx(prev => {
          const next = Math.min(prev + 1, data.length - 1);
          setSelected(data[next]); setTab("General");
          return next;
        });
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        setFocusIdx(prev => {
          const next = Math.max(prev - 1, 0);
          setSelected(data[next]); setTab("General");
          return next;
        });
      } else if (e.key === "Enter" && focusIdx >= 0 && focusIdx < data.length) {
        e.preventDefault();
        setSelected(data[focusIdx]); setTab("General");
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelected(null); setFocusIdx(-1);
      } else if (e.key === "r" || e.key === "R") {
        // retry - visual only
      } else if (e.key === "i" || e.key === "I") {
        // import - visual only
      } else if (e.key === "s" || e.key === "S") {
        // skip - visual only
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, focusIdx]);

  // ─── INLINE STYLES ──────────────────────────────────────────────────────
  const ds = densityStyles[density];

  const pill = (active: boolean, color?: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    background: active ? (color || P.gradientPrimary) : P.bgCard,
    border: `1px solid ${active ? (color ? color + "88" : P.borderFocus) : P.border}`,
    borderRadius: 20, padding: "5px 14px", color: active ? "#fff" : P.textSecondary,
    cursor: "pointer", fontSize: 11, fontWeight: active ? 600 : 400,
    transition: "all .2s", letterSpacing: 0.3, whiteSpace: "nowrap",
  });

  const controlBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: 20,
    padding: "5px 14px", color: P.textSecondary, cursor: "pointer", fontSize: 12,
    transition: "all .15s", whiteSpace: "nowrap",
  };

  const controlBtnSm: React.CSSProperties = {
    ...controlBtn, padding: "3px 10px", fontSize: 10, borderRadius: 14,
  };

  const glowBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: P.gradientPrimary, border: "none", borderRadius: 20,
    padding: "6px 16px", color: "#fff", cursor: "pointer", fontSize: 11,
    fontWeight: 700, letterSpacing: 0.5, boxShadow: P.glowPink, whiteSpace: "nowrap",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 10, color: P.textDim, textTransform: "uppercase",
    letterSpacing: 1.2, fontWeight: 600, marginBottom: 8,
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: 10, color: P.textMuted, textTransform: "uppercase",
    letterSpacing: 0.8, fontWeight: 500, marginBottom: 3,
  };

  const fieldValue: React.CSSProperties = {
    fontSize: 13, color: P.textPrimary, lineHeight: 1.5,
  };

  // ─── FLAG BADGE ─────────────────────────────────────────────────────────
  const FlagBadge = ({ label, color }: { label: string; color: string }) => (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8,
      background: color + "18", color, border: `1px solid ${color}30`,
      letterSpacing: 0.5, textTransform: "uppercase",
    }}>{label}</span>
  );

  // ─── PRIORITY BADGE ────────────────────────────────────────────────────
  const PriorityBadge = ({ priority }: { priority: 1|2|3 }) => {
    const cfg = priorityConfig[priority];
    return (
      <span style={{
        fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8,
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`,
        letterSpacing: 0.5, fontFamily: P.mono,
      }}>{cfg.label}</span>
    );
  };

  // ─── STEP RETRY BUTTONS ────────────────────────────────────────────────
  const StepRetryRow = ({ steps }: { steps: string[] }) => (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {steps.map(step => (
        <span key={step} style={{
          ...controlBtnSm,
          borderColor: P.cyan + "44", color: P.cyan,
        }} title={`Retry ${step}`}>↻ {step}</span>
      ))}
    </div>
  );

  // ─── TIMELINE ──────────────────────────────────────────────────────────
  const Timeline = ({ steps }: { steps: TimelineStep[] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
      {steps.map((step, idx) => {
        const color = step.status === "completed" ? P.green
          : step.status === "running" ? P.cyan
          : step.status === "failed" ? P.red : P.textDim;
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.stage} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: isLast ? 0 : 6 }}>
            {/* Line + dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14, flexShrink: 0 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: color,
                boxShadow: step.status === "running" ? `0 0 8px ${color}` : "none",
                flexShrink: 0, marginTop: 3,
              }} />
              {!isLast && (
                <div style={{ width: 1, flex: 1, minHeight: 16, background: P.border }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 11, color, fontWeight: 600, textTransform: "capitalize" }}>{step.stage.replace(/_/g, " ")}</span>
                <span style={{ fontSize: 10, color: P.textMuted, fontFamily: P.mono }}>{step.timestamp}</span>
              </div>
              <div style={{ fontSize: 10, color: P.textDim, marginTop: 1 }}>
                {step.status === "pending" ? "Waiting" : step.status === "running" ? "In progress…" : `Duration: ${step.duration}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ─── DIFF WITH HIGHLIGHTS ──────────────────────────────────────────────
  const DiffView = ({ item }: { item: IngestItem }) => {
    const fields = ["title", "series", "characters"] as const;
    type F = typeof fields[number];
    const hasChange = (f: F) => {
      if (f === "characters") return JSON.stringify(item.parsed.characters) !== JSON.stringify(item.enriched.characters);
      return (item.parsed as any)[f] !== (item.enriched as any)[f];
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderBottom: `1px solid ${P.border}`, padding: "8px 0" }}>
          <div style={{ fontSize: 10, color: P.textDim, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Field</div>
          <div style={{ fontSize: 10, color: P.violet, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Parsed</div>
          <div style={{ fontSize: 10, color: P.pink, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Enriched</div>
        </div>
        {fields.map(f => {
          const changed = hasChange(f) && !!item.enriched.title;
          const parsedVal = f === "characters" ? item.parsed.characters.join(", ") : (item.parsed as any)[f];
          const enrichedVal = f === "characters" ? item.enriched.characters.join(", ") : (item.enriched as any)[f];
          return (
            <div key={f} style={{
              display: "grid", gridTemplateColumns: "120px 1fr 1fr",
              padding: "10px 0", borderBottom: `1px solid ${P.borderSubtle}`,
              background: changed ? `${P.pink}06` : "transparent",
            }}>
              <div style={{ fontSize: 11, color: P.textMuted, textTransform: "capitalize", display: "flex", alignItems: "center", gap: 6 }}>
                {f}
                {changed && <span style={{ width: 5, height: 5, borderRadius: "50%", background: P.pink, flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 12, color: P.violet, fontFamily: P.mono, wordBreak: "break-word" }}>{parsedVal || "—"}</div>
              <div style={{
                fontSize: 12, color: P.pink, fontFamily: P.mono, wordBreak: "break-word",
                ...(changed ? { background: `${P.pink}10`, borderRadius: 4, padding: "2px 6px", margin: "-2px -6px" } : {}),
              }}>{enrichedVal || "—"}</div>
            </div>
          );
        })}
        {/* Additional fields */}
        {["accessories", "images"].map(f => {
          const parsedVal = (item.parsed as any)[f]?.join(", ") || "—";
          return (
            <div key={f} style={{
              display: "grid", gridTemplateColumns: "120px 1fr 1fr",
              padding: "10px 0", borderBottom: `1px solid ${P.borderSubtle}`,
            }}>
              <div style={{ fontSize: 11, color: P.textMuted, textTransform: "capitalize" }}>{f}</div>
              <div style={{ fontSize: 12, color: P.violet, fontFamily: P.mono }}>{parsedVal}</div>
              <div style={{ fontSize: 12, color: P.textDim, fontFamily: P.mono }}>—</div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── VALIDATION PANEL ──────────────────────────────────────────────────
  const ValidationPanel = ({ item }: { item: IngestItem }) => {
    const v = item.validation;
    const hasIssues = v.missing.length > 0 || v.warnings.length > 0 || v.duplicates.length > 0 || v.conflicts.length > 0;
    if (!hasIssues) return (
      <div style={{ background: P.green + "08", border: `1px solid ${P.green}25`, borderRadius: 10, padding: 14, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: P.green, fontSize: 13 }}>✓</span>
          <span style={{ fontSize: 12, color: P.green, fontWeight: 600 }}>Validation passed — ready to import</span>
        </div>
      </div>
    );
    return (
      <div style={{ background: P.orange + "06", border: `1px solid ${P.orange}20`, borderRadius: 10, padding: 14, marginTop: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: P.orange, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>⚠ Import Validation</div>
        {v.missing.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: P.red, fontWeight: 600, marginBottom: 4 }}>Missing Fields</div>
            {v.missing.map(m => <div key={m} style={{ fontSize: 11, color: P.textSecondary, fontFamily: P.mono, paddingLeft: 10 }}>• {m}</div>)}
          </div>
        )}
        {v.warnings.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: P.yellow, fontWeight: 600, marginBottom: 4 }}>Warnings</div>
            {v.warnings.map(w => <div key={w} style={{ fontSize: 11, color: P.textSecondary, paddingLeft: 10 }}>• {w}</div>)}
          </div>
        )}
        {v.duplicates.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: P.orange, fontWeight: 600, marginBottom: 4 }}>Duplicates</div>
            {v.duplicates.map(d => <div key={d} style={{ fontSize: 11, color: P.textSecondary, paddingLeft: 10 }}>• {d}</div>)}
          </div>
        )}
        {v.conflicts.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: P.pink, fontWeight: 600, marginBottom: 4 }}>Conflicts</div>
            {v.conflicts.map(c => <div key={c} style={{ fontSize: 11, color: P.textSecondary, paddingLeft: 10 }}>• {c}</div>)}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span style={{ ...glowBtn, fontSize: 10, padding: "5px 14px" }}>Import Anyway</span>
          <span style={{ ...controlBtnSm, fontSize: 10, borderColor: P.orange + "44", color: P.orange }}>Fix First</span>
        </div>
      </div>
    );
  };

  // ─── INSPECTOR ──────────────────────────────────────────────────────────
  const renderInspector = () => {
    if (!selected) return null;
    const i = selected;

    const renderTab = (): React.ReactNode => {
      switch (tab) {
        case "General":
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Metadata grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  ["Ingest ID", i.id], ["External ID", i.externalId],
                  ["Source", i.source], ["Source URL", i.sourceUrl || "—"],
                  ["Stage", i.stage.replace(/_/g, " ")], ["Status", i.status],
                  ["Priority", `P${i.priority}`], ["Progress", `${i.progress}%`],
                  ["Discovered", new Date(i.discoveredAt).toLocaleString()],
                  ["Updated", new Date(i.updatedAt).toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={fieldLabel}>{label as string}</div>
                    <div style={{
                      ...fieldValue,
                      fontFamily: ["Ingest ID","External ID","Source URL"].includes(label as string) ? P.mono : P.font,
                      fontSize: ["Ingest ID","External ID"].includes(label as string) ? 12 : 13,
                    }}>{value as string}</div>
                  </div>
                ))}
              </div>

              {/* Step retry */}
              <div>
                <div style={sectionLabel}>Retry Steps</div>
                <StepRetryRow steps={["fetch","parse","enrich","import"]} />
              </div>

              {/* Timeline */}
              <div>
                <div style={sectionLabel}>Pipeline Timeline</div>
                <Timeline steps={i.timeline} />
              </div>

              {/* Validation */}
              <ValidationPanel item={i} />
            </div>
          );

        case "Raw Data":
          return (
            <pre style={{
              background: "#06050c", border: `1px solid ${P.borderSubtle}`, borderRadius: 10,
              padding: 16, color: P.cyan, fontSize: 11, fontFamily: P.mono,
              lineHeight: 1.7, overflow: "auto", margin: 0, whiteSpace: "pre-wrap",
            }}>{JSON.stringify(JSON.parse(i.rawData), null, 2)}</pre>
          );

        case "Parsed":
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Title", i.parsed.title],
                ["Series", i.parsed.series],
                ["Characters", i.parsed.characters.join(", ")],
                ["Accessories", i.parsed.accessories.join(", ")],
                ["Images", i.parsed.images.join(", ")],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div style={fieldLabel}>{l as string}</div>
                  <div style={fieldValue}>{(v as string) || "—"}</div>
                </div>
              ))}
            </div>
          );

        case "Enriched":
          return i.enriched.title ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={fieldLabel}>Title</div>
                <div style={{ ...fieldValue, color: P.purple, fontWeight: 600 }}>{i.enriched.title}</div>
              </div>
              <div>
                <div style={fieldLabel}>Series</div>
                <div style={fieldValue}>{i.enriched.series}</div>
              </div>
              <div>
                <div style={fieldLabel}>Characters</div>
                <div style={fieldValue}>{i.enriched.characters.join(", ")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <div>
                  <div style={fieldLabel}>Confidence</div>
                  <div style={{
                    fontSize: 28, fontWeight: 800, letterSpacing: -1,
                    color: i.enriched.confidence > 0.9 ? P.green : i.enriched.confidence > 0.8 ? P.yellow : P.orange,
                  }}>{(i.enriched.confidence * 100).toFixed(0)}%</div>
                </div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: P.border, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${i.enriched.confidence * 100}%`, borderRadius: 3,
                    background: i.enriched.confidence > 0.9 ? P.green : i.enriched.confidence > 0.8 ? P.yellow : P.orange,
                    transition: "width .3s",
                  }} />
                </div>
              </div>
            </div>
          ) : <div style={{ color: P.textMuted, textAlign: "center", padding: 30 }}>No enrichment data</div>;

        case "Diff":
          return <DiffView item={i} />;

        case "AI Suggestions":
          return i.aiSuggestions.title ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: P.gradientSubtle, border: `1px solid ${P.pink}25`,
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🤖</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: P.pink, letterSpacing: 0.8, textTransform: "uppercase" }}>AI Recommendations</span>
                  </div>
                  <span
                    style={{
                      ...controlBtnSm,
                      borderColor: P.cyan + "44", color: P.cyan,
                      opacity: aiRerunning ? 0.5 : 1,
                      pointerEvents: aiRerunning ? "none" : "auto",
                    }}
                    onClick={() => {
                      setAiRerunning(true);
                      setTimeout(() => setAiRerunning(false), 2000);
                    }}
                  >{aiRerunning ? "⟳ Running…" : "⟳ Re-run AI"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["Title", i.aiSuggestions.title],
                    ["Series", i.aiSuggestions.series],
                    ["Characters", i.aiSuggestions.characters.join(", ")],
                    ["Images", i.aiSuggestions.images.join(", ")],
                  ].map(([l, v]) => (
                    <div key={l as string} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <span style={{ fontSize: 10, color: P.textMuted, minWidth: 70, textTransform: "uppercase", letterSpacing: 0.5 }}>{l as string}</span>
                      <span style={{ fontSize: 12, color: P.textPrimary }}>{(v as string) || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={glowBtn}>✓ Accept All</span>
                <span style={controlBtn}>✕ Reject</span>
                <span style={controlBtn}>✎ Edit</span>
              </div>
            </div>
          ) : <div style={{ color: P.textMuted, textAlign: "center", padding: 30 }}>No AI suggestions</div>;

        case "Logs":
          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {i.logs.map((l, idx) => (
                <div key={idx} style={{
                  display: "flex", gap: 12, padding: "8px 0",
                  borderBottom: idx < i.logs.length - 1 ? `1px solid ${P.borderSubtle}` : "none",
                }}>
                  <span style={{ color: P.cyan, fontSize: 11, fontFamily: P.mono, minWidth: 48, flexShrink: 0 }}>{l.time}</span>
                  <span style={{ color: P.textSecondary, fontSize: 12 }}>{l.message}</span>
                </div>
              ))}
            </div>
          );

        case "Errors":
          return i.errors.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {i.errors.map((e, idx) => (
                <div key={idx} style={{
                  background: `linear-gradient(135deg,${P.red}08,${P.red}04)`,
                  border: `1px solid ${P.red}25`, borderRadius: 12, padding: 16,
                }}>
                  <div style={{ color: P.red, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{e.message}</div>
                  <div style={{ fontSize: 11, color: P.textMuted, display: "flex", gap: 16, marginBottom: 10 }}>
                    <span>Step: <span style={{ color: P.orange }}>{e.step}</span></span>
                    <span>Service: <span style={{ color: P.orange }}>{e.service}</span></span>
                  </div>
                  <StepRetryRow steps={[e.step]} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: P.green, textAlign: "center", padding: 30, fontSize: 13 }}>✓ No errors</div>
          );

        default: return null;
      }
    };

    return (
      <div style={{
        width: 500, background: P.bgSurface, borderLeft: `1px solid ${P.border}`,
        display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
      }}>
        {/* Inspector header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${P.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: P.textPrimary, fontSize: 15, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.title}</div>
              <div style={{ fontSize: 11, color: P.textMuted, fontFamily: P.mono, marginBottom: 8 }}>{i.id} · {i.externalId}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <PriorityBadge priority={i.priority} />
                <span style={{
                  fontSize: 10, padding: "3px 10px", borderRadius: 10,
                  background: stageColor[i.stage] + "18", color: stageColor[i.stage],
                  border: `1px solid ${stageColor[i.stage]}30`, fontWeight: 600,
                }}>{stageLabel[i.stage]}</span>
                <span style={{
                  fontSize: 10, padding: "3px 10px", borderRadius: 10,
                  background: statusColor[i.status] + "18", color: statusColor[i.status],
                }}>{i.status.replace(/_/g, " ")}</span>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: P.bgCard, color: P.textMuted }}>{i.source}</span>
              </div>
            </div>
            <span style={{ ...controlBtn, padding: "4px 10px", fontSize: 14, lineHeight: 1 }} onClick={() => { setSelected(null); setFocusIdx(-1); }}>✕</span>
          </div>
        </div>

        {/* Inspector tabs */}
        <div style={{
          display: "flex", borderBottom: `1px solid ${P.border}`, padding: "0 16px",
          overflowX: "auto", background: P.bg + "80", gap: 2,
        }}>
          {INSPECTOR_TABS.map(t => (
            <span key={t} onClick={() => setTab(t)} style={{
              padding: "10px 11px", fontSize: 11, cursor: "pointer",
              borderBottom: `2px solid ${tab === t ? P.pink : "transparent"}`,
              color: tab === t ? P.textPrimary : P.textMuted,
              whiteSpace: "nowrap", transition: "all .15s",
              fontWeight: tab === t ? 600 : 400,
            }}>{t}</span>
          ))}
        </div>

        {/* Inspector body */}
        <div style={{ flex: 1, overflow: "auto", padding: 20, lineHeight: 1.7, fontSize: 12 }}>
          {renderTab()}
        </div>

        {/* Inspector footer actions */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${P.border}`, display: "flex", gap: 8 }}>
          <span style={controlBtn}>↻ Retry</span>
          <span style={controlBtn}>⊘ Skip</span>
          <span style={glowBtn}>⬆ Import</span>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} tabIndex={-1} style={{
      background: `radial-gradient(ellipse at 50% 0%, #1a123008 0%, transparent 60%), ${P.bg}`,
      color: P.textSecondary, fontFamily: P.font, minHeight: "100vh",
      display: "flex", flexDirection: "column", fontSize: 13, outline: "none",
    }}>
      {/* ─── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px", borderBottom: `1px solid ${P.border}`,
        background: `linear-gradient(180deg, ${P.bgCard}80, ${P.bg}80)`,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontSize: 16, fontWeight: 900, letterSpacing: 1,
            background: P.gradientPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>◆ MONSTRINO</span>
          <span style={{ color: P.textDim, fontSize: 11, letterSpacing: 1.5, fontWeight: 500, textTransform: "uppercase" }}>Ingestion Control v5</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Density toggle */}
          <div style={{ display: "flex", border: `1px solid ${P.border}`, borderRadius: 20, overflow: "hidden" }}>
            {(["comfortable","compact","dense"] as DensityMode[]).map(mode => (
              <span key={mode} onClick={() => setDensity(mode)} style={{
                padding: "4px 10px", cursor: "pointer", fontSize: 10,
                background: density === mode ? P.bgElevated : "transparent",
                color: density === mode ? P.textPrimary : P.textDim,
                transition: "all .15s", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500,
              }}>{mode.slice(0, 4)}</span>
            ))}
          </div>
          <span style={pill(live, P.green)} onClick={() => setLive(!live)}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: live ? P.green : P.textMuted,
              boxShadow: live ? `0 0 8px ${P.green}` : "none",
            }} />
            LIVE
          </span>
          <span style={controlBtn} title="Refresh">⟳</span>
        </div>
      </div>

      {/* ─── CONTROLS ROW ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
        borderBottom: `1px solid ${P.borderSubtle}`, flexWrap: "wrap",
      }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search title, ID, source…"
          style={{
            background: P.bgSurface, border: `1px solid ${P.border}`, borderRadius: 20,
            padding: "7px 16px", color: P.textPrimary, outline: "none", width: 260, fontSize: 13,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {([
            ["failed", "Failed"],
            ["pending", "Pending"],
            ["ready", "Ready"],
            ["needs_review", "Review"],
            ["ai_enriched", "AI"],
          ] as [QuickFilter, string][]).map(([key, label]) => (
            <span key={key!} style={pill(qf === key)} onClick={() => setQf(qf === key ? null : key)}>{label}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={{
          background: P.bgSurface, border: `1px solid ${P.border}`, borderRadius: 20,
          padding: "6px 14px", color: P.textSecondary, fontSize: 12, outline: "none",
        }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="stage">Stage</option>
        </select>
        <div style={{ display: "flex", border: `1px solid ${P.border}`, borderRadius: 20, overflow: "hidden" }}>
          {(["list", "grid"] as const).map(mode => (
            <span key={mode} onClick={() => setViewMode(mode)} style={{
              padding: "5px 12px", cursor: "pointer", fontSize: 12,
              background: viewMode === mode ? P.bgElevated : "transparent",
              color: viewMode === mode ? P.textPrimary : P.textMuted,
              transition: "all .15s",
            }}>{mode === "list" ? "☰" : "⊞"}</span>
          ))}
        </div>
      </div>

      {/* ─── PIPELINE + STATS ────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 20, padding: "16px 20px",
        borderBottom: `1px solid ${P.border}`,
      }}>
        {/* Pipeline rail */}
        <div style={{ flex: 3 }}>
          <div style={sectionLabel}>Pipeline</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: 12,
            padding: 3, overflow: "hidden",
          }}>
            {STAGES.map((s, idx) => {
              const count = stageCounts[s];
              const active = stageFilter === s;
              const color = stageColor[s];
              const isFailed = s === "failed";
              return (
                <React.Fragment key={s}>
                  {idx > 0 && !isFailed && (
                    <div style={{ width: 16, height: 1, background: P.border, flexShrink: 0 }} />
                  )}
                  {isFailed && <div style={{ flex: 0.3 }} />}
                  <div
                    onClick={() => setStageFilter(stageFilter === s ? null : s)}
                    style={{
                      flex: 1, textAlign: "center", padding: "10px 6px", cursor: "pointer",
                      borderRadius: 9, transition: "all .2s", position: "relative",
                      background: active ? `${color}15` : "transparent",
                      border: `1px solid ${active ? color + "44" : "transparent"}`,
                      boxShadow: active ? `0 0 12px ${color}15` : "none",
                    }}
                  >
                    <div style={{
                      fontSize: 20, fontWeight: 800, letterSpacing: -1,
                      color: active ? color : count > 0 ? P.textSecondary : P.textDim,
                      transition: "color .2s",
                    }}>{count}</div>
                    <div style={{
                      fontSize: 9, color: active ? color : P.textDim,
                      textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2,
                      fontWeight: 600,
                    }}>{stageLabel[s]}</div>
                    {active && (
                      <div style={{
                        position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                        width: 16, height: 2, borderRadius: 1, background: color,
                      }} />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ flex: 1.5, display: "flex", flexDirection: "column" }}>
          <div style={sectionLabel}>Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, flex: 1 }}>
            {([
              ["Total", stats.total, P.violet],
              ["Failed", stats.failed, P.red],
              ["Review", stats.review, P.orange],
              ["AI", stats.ai, P.purple],
              ["Ready", stats.ready, P.cyan],
              ["Today", stats.imported, P.green],
            ] as [string, number, string][]).map(([label, value, color]) => (
              <div key={label} style={{
                background: P.bgCard, border: `1px solid ${P.borderSubtle}`,
                borderRadius: 10, padding: "8px 10px", textAlign: "center",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 8, color: P.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Queue */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {viewMode === "list" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: ds.gap }}>
              {/* Table header */}
              <div style={{
                display: "grid", gridTemplateColumns: "28px 44px 1fr 36px 100px 80px 120px 60px 80px",
                gap: 10, padding: "6px 14px", alignItems: "center",
              }}>
                {["", "", "Item", "Pri", "Stage", "Status", "Flags", "%", "Actions"].map((h, idx) => (
                  <div key={idx} style={{
                    fontSize: 9, color: P.textDim, textTransform: "uppercase",
                    letterSpacing: 1, fontWeight: 600,
                  }}>{h}</div>
                ))}
              </div>

              {data.map((item, idx) => {
                const isSelected = selected?.id === item.id;
                const isFocused = focusIdx === idx;
                const color = stageColor[item.stage];
                return (
                  <div
                    key={item.id}
                    onClick={() => { setSelected(item); setTab("General"); setFocusIdx(idx); }}
                    style={{
                      display: "grid", gridTemplateColumns: "28px 44px 1fr 36px 100px 80px 120px 60px 80px",
                      gap: 10, padding: ds.rowPad, alignItems: "center",
                      borderRadius: 10, cursor: "pointer", transition: "all .15s",
                      background: isSelected ? `${color}0a` : isFocused ? P.bgCard : "transparent",
                      border: `1px solid ${isSelected ? color + "40" : isFocused ? P.border : "transparent"}`,
                      boxShadow: isSelected ? `0 0 12px ${color}08` : "none",
                    }}
                    onMouseEnter={e => { if (!isSelected && !isFocused) e.currentTarget.style.background = P.bgCard; }}
                    onMouseLeave={e => { if (!isSelected && !isFocused) e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Checkbox */}
                    <div onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggleCheck(item.id)} style={{ accentColor: P.purple, cursor: "pointer" }} />
                    </div>

                    {/* Icon */}
                    <div style={{
                      width: density === "dense" ? 30 : 38, height: density === "dense" ? 30 : 38, borderRadius: 8,
                      background: `linear-gradient(135deg, ${color}15, ${P.bgCard})`,
                      border: `1px solid ${color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: density === "dense" ? 13 : 16, flexShrink: 0,
                      color: color, fontWeight: 700, fontFamily: P.mono,
                    }}>{item.title.charAt(0)}</div>

                    {/* Title block */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, color: P.textPrimary, fontSize: ds.fontSize,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{item.title}</div>
                      <div style={{ fontSize: ds.fontSize - 2, color: P.textMuted, marginTop: 1, fontFamily: P.mono }}>
                        {item.source} · {item.id}
                      </div>
                    </div>

                    {/* Priority */}
                    <PriorityBadge priority={item.priority} />

                    {/* Stage */}
                    <span style={{
                      fontSize: 10, padding: "3px 9px", borderRadius: 8,
                      background: color + "15", color, border: `1px solid ${color}25`,
                      fontWeight: 600, textAlign: "center", whiteSpace: "nowrap",
                    }}>{stageLabel[item.stage]}</span>

                    {/* Status */}
                    <span style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 8,
                      background: statusColor[item.status] + "15",
                      color: statusColor[item.status], textAlign: "center",
                    }}>{item.status.replace(/_/g, " ")}</span>

                    {/* Flags */}
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {item.flags.error && <FlagBadge label="ERR" color={P.red} />}
                      {item.flags.ai && <FlagBadge label="AI" color={P.purple} />}
                      {item.flags.duplicate && <FlagBadge label="DUP" color={P.yellow} />}
                      {item.flags.manualReview && <FlagBadge label="REV" color={P.orange} />}
                    </div>

                    {/* Progress */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: P.border, overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", width: `${item.progress}%`, borderRadius: 2,
                          background: item.status === "failed" ? P.red : P.gradientPrimary,
                          transition: "width .3s",
                        }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                      <span style={{ ...controlBtn, padding: "3px 8px", fontSize: 11 }} title="Retry">↻</span>
                      <span style={{ ...controlBtn, padding: "3px 8px", fontSize: 11, background: P.gradientPrimary, border: "none", color: "#fff" }} title="Import">⬆</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Grid view */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {data.map((item, idx) => {
                const isSelected = selected?.id === item.id;
                const color = stageColor[item.stage];
                return (
                  <div
                    key={item.id}
                    onClick={() => { setSelected(item); setTab("General"); setFocusIdx(idx); }}
                    style={{
                      padding: 16, borderRadius: 12, cursor: "pointer",
                      background: isSelected ? P.bgElevated : P.bgCard,
                      border: `1px solid ${isSelected ? color + "44" : P.borderSubtle}`,
                      transition: "all .2s", boxShadow: isSelected ? `0 0 16px ${color}10` : "none",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${P.bg}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = isSelected ? `0 0 16px ${color}10` : "none"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: `linear-gradient(135deg, ${color}20, ${P.bgCard})`,
                          border: `1px solid ${color}25`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, color, fontWeight: 700, fontFamily: P.mono,
                        }}>{item.title.charAt(0)}</div>
                        <PriorityBadge priority={item.priority} />
                      </div>
                      <input type="checkbox" checked={checked.has(item.id)} onChange={e => { e.stopPropagation(); toggleCheck(item.id); }} style={{ accentColor: P.purple }} />
                    </div>
                    <div style={{ fontWeight: 700, color: P.textPrimary, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: P.textMuted, fontFamily: P.mono, marginBottom: 10 }}>{item.source} · {item.id}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                      <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: color + "15", color, fontWeight: 600 }}>{stageLabel[item.stage]}</span>
                      {item.flags.error && <FlagBadge label="ERR" color={P.red} />}
                      {item.flags.ai && <FlagBadge label="AI" color={P.purple} />}
                      {item.flags.duplicate && <FlagBadge label="DUP" color={P.yellow} />}
                      {item.flags.manualReview && <FlagBadge label="REV" color={P.orange} />}
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: P.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.progress}%`, borderRadius: 2, background: item.status === "failed" ? P.red : P.gradientPrimary }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {data.length === 0 && (
            <div style={{ color: P.textMuted, textAlign: "center", padding: 60, fontSize: 14 }}>
              No items match current filters
            </div>
          )}
        </div>

        {/* Inspector */}
        {renderInspector()}
      </div>

      {/* ─── BULK ACTION BAR ─────────────────────────────────────────────── */}
      {checked.size > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
          background: `linear-gradient(180deg, ${P.bgElevated}, ${P.bgCard})`,
          borderTop: `1px solid ${P.border}`,
        }}>
          <span style={{ color: P.pink, fontWeight: 700, fontSize: 12 }}>{checked.size} selected</span>
          <div style={{ width: 1, height: 16, background: P.border }} />
          <span style={controlBtn}>↻ Retry</span>
          <span style={controlBtn}>Mark Ready</span>
          <span style={controlBtn}>⊘ Skip</span>
          <span style={glowBtn}>⬆ Import</span>
          <span style={{ ...controlBtn, borderColor: P.red + "44", color: P.red }}>✕ Delete</span>
          <div style={{ flex: 1 }} />
          <span style={{ ...controlBtn, color: P.textMuted }} onClick={() => setChecked(new Set())}>Clear</span>
        </div>
      )}

      {/* ─── KEYBOARD HINTS ──────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 12, right: 12, display: "flex", gap: 6,
        background: P.bgCard + "ee", border: `1px solid ${P.borderSubtle}`, borderRadius: 10,
        padding: "6px 12px", fontSize: 10, color: P.textDim, fontFamily: P.mono,
        backdropFilter: "blur(8px)",
      }}>
        <span><span style={{ color: P.textMuted, background: P.bgElevated, padding: "1px 5px", borderRadius: 4, marginRight: 3 }}>J</span>/<span style={{ color: P.textMuted, background: P.bgElevated, padding: "1px 5px", borderRadius: 4, marginLeft: 3 }}>K</span> nav</span>
        <span style={{ color: P.border }}>·</span>
        <span><span style={{ color: P.textMuted, background: P.bgElevated, padding: "1px 5px", borderRadius: 4, marginRight: 3 }}>⏎</span> open</span>
        <span style={{ color: P.border }}>·</span>
        <span><span style={{ color: P.textMuted, background: P.bgElevated, padding: "1px 5px", borderRadius: 4, marginRight: 3 }}>Esc</span> close</span>
      </div>
    </div>
  );
};

export default MonstrinoVariant5;
