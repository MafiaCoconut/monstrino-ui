import { useState, useMemo, MouseEvent } from "react";
import {
  Box, Typography, Button, TextField, InputAdornment, Avatar, Chip, LinearProgress,
  Card, CardContent, IconButton, Menu, MenuItem, FormControl, InputLabel,
  Select, SelectChangeEvent, ToggleButtonGroup, ToggleButton, Paper, Collapse,
  ThemeProvider, createTheme, CssBaseline, Stack, Tooltip,
} from "@mui/material";
import {
  Add, Share, Settings, Search, GridView, ViewList, Visibility, VisibilityOff,
  Lock, Public, Star, EmojiEvents, AutoAwesome, Edit, Delete, StickyNote2,
  MoreHoriz, Close, TrendingUp, Inventory2, Favorite, FilterList, Sort,
  ExpandMore, ExpandLess, ImageNotSupported,
} from "@mui/icons-material";

/* ─────────────── Colors ─────────────── */
const C = {
  bg: "#0D0D0D", bgAlt: "#1A1A1A", surface: "#171717", surfaceAlt: "#262626",
  text: "#FFFFFF", textSec: "#E5E5E5", textMuted: "#9CA3AF",
  purple: "#9333EA", purpleLight: "#7C3AED", pink: "#EC4899",
  green: "#22C55E", gold: "#EAB308", red: "#EF4444",
  border: "#2E2E2E",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: C.bg, paper: C.surface },
    primary: { main: C.purple },
    secondary: { main: C.pink },
    success: { main: C.green },
    warning: { main: C.gold },
    error: { main: C.red },
    text: { primary: C.text, secondary: C.textMuted },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { backgroundImage: "none", border: `1px solid ${C.border}` } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
  },
});

/* ─────────────── Types ─────────────── */
type DollStatus = "owned" | "wishlist" | "missing";
type DollCondition = "boxed" | "unboxed" | "damaged";
type DollRarity = "common" | "rare" | "exclusive" | "ultra-rare";

interface DollV5 {
  id: string; releaseName: string; characterName: string; series: string;
  status: DollStatus; condition: DollCondition; rarity: DollRarity;
  estimatedValue: number; purchasePrice?: number; acquiredDate?: string;
  releaseDate: string; image?: string; note?: string;
}
interface SeriesInfo { name: string; total: number; owned: number; }
interface Achievement { id: string; title: string; description: string; icon: string; unlocked: boolean; unlockedDate?: string; }
interface CollectorProfile {
  username: string; totalDolls: number; ownedDolls: number; wishlistCount: number;
  completedSeries: number; totalSeries: number; rareCount: number; estimatedValue: number; joinedDate: string;
}

/* ─────────────── Mock Data ─────────────── */
const seriesNames = [
  "Original Ghouls","Dawn of the Dance","Gloom Beach","Dead Tired","School's Out",
  "Skull Shores","Ghouls Rule","Scaris: City of Frights","13 Wishes",
  "Frights Camera Action","Boo York Boo York","Great Scarrier Reef",
];
const characters = [
  "Draculaura","Frankie Stein","Clawdeen Wolf","Cleo de Nile","Lagoona Blue",
  "Ghoulia Yelps","Abbey Bominable","Spectra Vondergeist","Toralei Stripe",
  "Catrine DeMew","Rochelle Goyle","Robecca Steam",
];
const statuses: DollStatus[] = ["owned","owned","owned","wishlist","missing"];
const conditions: DollCondition[] = ["boxed","boxed","unboxed","unboxed","damaged"];
const rarities: DollRarity[] = ["common","common","common","rare","exclusive","ultra-rare"];

const dollsV5: DollV5[] = Array.from({ length: 60 }, (_, i) => {
  const st = statuses[i % statuses.length];
  const ev = Math.floor(Math.random() * 300) + 15;
  return {
    id: `doll-${i + 1}`,
    releaseName: `${characters[i % characters.length]} - ${seriesNames[i % seriesNames.length]}`,
    characterName: characters[i % characters.length],
    series: seriesNames[i % seriesNames.length],
    status: st, condition: conditions[i % conditions.length], rarity: rarities[i % rarities.length],
    estimatedValue: ev,
    purchasePrice: st === "owned" ? Math.floor(ev * 0.7) : undefined,
    acquiredDate: st === "owned" ? `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}` : undefined,
    releaseDate: `20${10 + Math.floor(i / 5)}-${String((i % 12) + 1).padStart(2, "0")}-01`,
    image: undefined,
    note: i % 7 === 0 ? "Signed by artist" : undefined,
  };
});

const seriesData: SeriesInfo[] = seriesNames.map((name) => {
  const inS = dollsV5.filter((d) => d.series === name);
  return { name, total: inS.length + Math.floor(Math.random() * 4), owned: inS.filter((d) => d.status === "owned").length };
});

const profile: CollectorProfile = {
  username: "GhoulCollector", totalDolls: 356, ownedDolls: 124, wishlistCount: 87,
  completedSeries: 3, totalSeries: 12, rareCount: 18, estimatedValue: 12450, joinedDate: "2022-03-15",
};

const achievements: Achievement[] = [
  { id: "a1", title: "First Steps", description: "Added first doll", icon: "🎀", unlocked: true, unlockedDate: "2022-03-15" },
  { id: "a2", title: "Half Century", description: "Collected 50 dolls", icon: "🏆", unlocked: true, unlockedDate: "2023-06-20" },
  { id: "a3", title: "Century Club", description: "Collected 100 dolls", icon: "💎", unlocked: true, unlockedDate: "2024-01-10" },
  { id: "a4", title: "Series Master", description: "Completed a full series", icon: "⭐", unlocked: true, unlockedDate: "2023-11-05" },
  { id: "a5", title: "Rare Hunter", description: "Own 10 rare items", icon: "🔮", unlocked: true, unlockedDate: "2024-02-14" },
  { id: "a6", title: "Treasure Keeper", description: "Value exceeds $10,000", icon: "💰", unlocked: true, unlockedDate: "2024-08-01" },
  { id: "a7", title: "Completionist", description: "Complete 5 series", icon: "👑", unlocked: false },
  { id: "a8", title: "Legendary", description: "Own an ultra-rare item", icon: "🌟", unlocked: true, unlockedDate: "2024-05-22" },
];

const allSeries = [...new Set(dollsV5.map((d) => d.series))];
const allCharacters = [...new Set(dollsV5.map((d) => d.characterName))];

/* ─────────────── Helpers ─────────────── */
const rarityColor: Record<DollRarity, string> = {
  common: C.textMuted, rare: C.purple, exclusive: C.pink, "ultra-rare": C.gold,
};
const statusEmoji: Record<DollStatus, string> = { owned: "✅", wishlist: "⭐", missing: "❌" };
const conditionColor = (c: DollCondition) => c === "boxed" ? C.green : c === "damaged" ? C.red : C.textMuted;

/* ─────────────── Sub-components ─────────────── */

function StatChip({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" fontWeight={700} sx={{ color: color || C.text, lineHeight: 1.2 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, fontSize: 10 }}>{label}</Typography>
    </Box>
  );
}

function RarityBadge({ rarity }: { rarity: DollRarity }) {
  if (rarity === "common") return null;
  const label = rarity === "ultra-rare" ? "✦ Ultra Rare" : rarity.charAt(0).toUpperCase() + rarity.slice(1);
  return (
    <Chip label={label} size="small"
      sx={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", height: 20,
        bgcolor: `${rarityColor[rarity]}22`, color: rarityColor[rarity], border: `1px solid ${rarityColor[rarity]}44` }} />
  );
}

function DollCard({ doll }: { doll: DollV5 }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMenu = (e: MouseEvent<HTMLElement>) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const closeMenu = () => setAnchorEl(null);

  const menuActions = [
    { label: "Mark as Owned", icon: <Inventory2 sx={{ fontSize: 16 }} /> },
    { label: "Move to Wishlist", icon: <Favorite sx={{ fontSize: 16 }} /> },
    { label: "Edit Condition", icon: <Edit sx={{ fontSize: 16 }} /> },
    { label: "Add Note", icon: <StickyNote2 sx={{ fontSize: 16 }} /> },
    { label: "Remove", icon: <Delete sx={{ fontSize: 16, color: C.red }} /> },
  ];

  return (
    <Card
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      sx={{ display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.2s",
        "&:hover": { borderColor: `${C.purple}66`, boxShadow: `0 4px 20px ${C.purple}15` } }}
    >
      {/* Image area */}
      <Box sx={{ position: "relative", aspectRatio: "3/4", bgcolor: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {doll.image ? (
          <Box component="img" src={doll.image} alt={doll.releaseName} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <ImageNotSupported sx={{ fontSize: 40, color: `${C.textMuted}33` }} />
        )}
        {doll.rarity !== "common" && (
          <Box sx={{ position: "absolute", top: 8, right: 8 }}><RarityBadge rarity={doll.rarity} /></Box>
        )}
        <Typography sx={{ position: "absolute", top: 8, left: 8, fontSize: 14 }}>{statusEmoji[doll.status]}</Typography>

        {/* Hover overlay */}
        <Box sx={{
          position: "absolute", inset: 0, bgcolor: `${C.bg}CC`, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 1, opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
        }}>
          <Button variant="contained" size="small" sx={{ fontSize: 12 }}>View Details</Button>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Status"><IconButton size="small" sx={{ bgcolor: C.surfaceAlt }}><Edit sx={{ fontSize: 14 }} /></IconButton></Tooltip>
            <Tooltip title="Add Note"><IconButton size="small" sx={{ bgcolor: C.surfaceAlt }}><StickyNote2 sx={{ fontSize: 14 }} /></IconButton></Tooltip>
            <Tooltip title="Remove"><IconButton size="small" sx={{ bgcolor: C.surfaceAlt }}><Delete sx={{ fontSize: 14 }} /></IconButton></Tooltip>
          </Stack>
        </Box>
      </Box>

      {/* Info */}
      <CardContent sx={{ flex: 1, p: 1.5, "&:last-child": { pb: 1.5 }, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>{doll.releaseName}</Typography>
          <IconButton size="small" onClick={handleMenu} sx={{ ml: 0.5, p: 0.25 }}><MoreHoriz sx={{ fontSize: 16 }} /></IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" noWrap>{doll.characterName}</Typography>
        <Typography sx={{ fontSize: 10, color: C.textMuted, opacity: 0.7 }} noWrap>{doll.series}</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 0.5 }}>
          <Typography variant="caption" fontWeight={700} sx={{ color: C.green }}>${doll.estimatedValue}</Typography>
          <Chip label={doll.condition} size="small"
            sx={{ fontSize: 10, height: 18, textTransform: "capitalize", bgcolor: `${conditionColor(doll.condition)}15`, color: conditionColor(doll.condition) }} />
        </Stack>
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}
        slotProps={{ paper: { sx: { bgcolor: C.surface, border: `1px solid ${C.border}`, minWidth: 160 } } }}>
        {menuActions.map((a) => (
          <MenuItem key={a.label} onClick={closeMenu} sx={{ fontSize: 13, gap: 1 }}>{a.icon} {a.label}</MenuItem>
        ))}
      </Menu>
    </Card>
  );
}

function SeriesBlock({ seriesName, items }: { seriesName: string; items: DollV5[] }) {
  const [open, setOpen] = useState(true);
  const owned = items.filter((d) => d.status === "owned").length;
  const total = seriesData.find((s) => s.name === seriesName)?.total ?? items.length;
  const pctS = total > 0 ? Math.round((owned / total) * 100) : 0;

  return (
    <Card>
      <Box onClick={() => setOpen(!open)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, cursor: "pointer",
          "&:hover": { bgcolor: `${C.surfaceAlt}88` }, transition: "background 0.15s" }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {open ? <ExpandLess sx={{ fontSize: 18, color: C.textMuted }} /> : <ExpandMore sx={{ fontSize: 18, color: C.textMuted }} />}
          <Box>
            <Typography variant="body2" fontWeight={600}>{seriesName}</Typography>
            <Typography variant="caption" color="text.secondary">{owned} / {total} collected</Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 120 }}><LinearProgress variant="determinate" value={pctS} sx={{ height: 6, borderRadius: 3 }} /></Box>
          <Typography variant="body2" fontWeight={700} sx={{ color: pctS === 100 ? C.green : C.purple, minWidth: 32, textAlign: "right" }}>{pctS}%</Typography>
        </Stack>
      </Box>
      <Collapse in={open}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 1.5, px: 2.5, pb: 2.5 }}>
          {items.map((d) => <DollCard key={d.id} doll={d} />)}
        </Box>
      </Collapse>
    </Card>
  );
}

function InsightsSidebar({ filtered }: { filtered: DollV5[] }) {
  const owned = filtered.filter((d) => d.status === "owned");
  const totalVal = owned.reduce((s, d) => s + d.estimatedValue, 0);
  const avgVal = owned.length > 0 ? Math.round(totalVal / owned.length) : 0;
  const rarityCounts: Record<DollRarity, number> = { common: 0, rare: 0, exclusive: 0, "ultra-rare": 0 };
  owned.forEach((d) => rarityCounts[d.rarity]++);

  const topSeries = allSeries.map((s) => ({ name: s, count: owned.filter((d) => d.series === s).length }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  const incomplete = allSeries.map((s) => {
    const o = filtered.filter((d) => d.series === s && d.status === "owned").length;
    const t = seriesData.find((sd) => sd.name === s)?.total ?? 0;
    return { name: s, owned: o, total: t, missing: t - o };
  }).filter((s) => s.owned > 0 && s.missing > 0).sort((a, b) => a.missing - b.missing).slice(0, 4);

  const recentlyAdded = [...owned].sort((a, b) => (b.acquiredDate ?? "").localeCompare(a.acquiredDate ?? "")).slice(0, 5);

  const insightCard = (icon: React.ReactNode, title: string, children: React.ReactNode) => (
    <Card sx={{ bgcolor: C.surface }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          {icon}
          <Typography variant="caption" fontWeight={500} color="text.secondary">{title}</Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={2}>
      {insightCard(<TrendingUp sx={{ fontSize: 16, color: C.textMuted }} />, "Collection Value", <>
        <Typography variant="h5" fontWeight={700} sx={{ color: C.green }}>${totalVal.toLocaleString()}</Typography>
        <Typography variant="caption" color="text.secondary">Avg ${avgVal} per item</Typography>
      </>)}

      {insightCard(<AutoAwesome sx={{ fontSize: 16, color: C.textMuted }} />, "Rarity Breakdown",
        <Stack spacing={0.75}>
          {(["ultra-rare", "exclusive", "rare", "common"] as DollRarity[]).map((r) => (
            <Stack key={r} direction="row" justifyContent="space-between" alignItems="center">
              {r === "common"
                ? <Typography variant="caption" color="text.secondary">Common</Typography>
                : <RarityBadge rarity={r} />}
              <Typography variant="body2" fontWeight={600}>{rarityCounts[r]}</Typography>
            </Stack>
          ))}
        </Stack>
      )}

      {insightCard(<EmojiEvents sx={{ fontSize: 16, color: C.textMuted }} />, "Top Series",
        <Stack spacing={0.5}>
          {topSeries.map((s) => (
            <Stack key={s.name} direction="row" justifyContent="space-between">
              <Typography variant="caption" noWrap sx={{ flex: 1 }}>{s.name}</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: C.purple }}>{s.count}</Typography>
            </Stack>
          ))}
        </Stack>
      )}

      {incomplete.length > 0 && insightCard(<Star sx={{ fontSize: 16, color: C.textMuted }} />, "Almost Complete",
        <Stack spacing={1}>
          {incomplete.map((s) => (
            <Box key={s.name}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="caption" noWrap>{s.name}</Typography>
                <Typography variant="caption" color="text.secondary">{s.owned}/{s.total}</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={(s.owned / s.total) * 100} sx={{ height: 4, borderRadius: 2 }} />
            </Box>
          ))}
        </Stack>
      )}

      {insightCard(<Inventory2 sx={{ fontSize: 16, color: C.textMuted }} />, "Recently Added",
        <Stack spacing={1}>
          {recentlyAdded.map((d) => (
            <Stack key={d.id} direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ImageNotSupported sx={{ fontSize: 14, color: `${C.textMuted}55` }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" fontWeight={600} noWrap display="block">{d.releaseName}</Typography>
                <Typography sx={{ fontSize: 10, color: C.textMuted }} noWrap>{d.characterName}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function AchievementsStrip() {
  const unlocked = achievements.filter((a) => a.unlocked);
  return (
    <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5 }}>
      {unlocked.map((a) => (
        <Paper key={a.id} variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, flexShrink: 0, bgcolor: C.surface, borderColor: C.border }}>
          <Typography fontSize={18}>{a.icon}</Typography>
          <Box>
            <Typography variant="caption" fontWeight={600} display="block">{a.title}</Typography>
            <Typography sx={{ fontSize: 10, color: C.textMuted }}>{a.description}</Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}

function EmptyCollection() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 12 }}>
      <Box sx={{ width: 80, height: 80, borderRadius: 4, bgcolor: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
        <Inventory2 sx={{ fontSize: 40, color: `${C.textMuted}66` }} />
      </Box>
      <Typography variant="h6" fontWeight={600}>Your collection is empty</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360, textAlign: "center" }}>
        Start adding dolls to track your collection, monitor progress, and showcase your rare finds.
      </Typography>
      <Button variant="contained" startIcon={<Add />} sx={{ mt: 3 }}>Add Your First Doll</Button>
    </Box>
  );
}

function PrivateState() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 12 }}>
      <Box sx={{ width: 80, height: 80, borderRadius: 4, bgcolor: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
        <Lock sx={{ fontSize: 40, color: `${C.textMuted}66` }} />
      </Box>
      <Typography variant="h6" fontWeight={600}>This collection is private</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>The owner has chosen to keep this collection private.</Typography>
    </Box>
  );
}

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */

export default function Variant5() {
  const [viewMode, setViewMode] = useState<"grid" | "series">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [characterFilter, setCharacterFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showInsights, setShowInsights] = useState(true);

  const filtered = useMemo(() => {
    let list = [...dollsV5];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.releaseName.toLowerCase().includes(q) || d.characterName.toLowerCase().includes(q) || d.series.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (seriesFilter !== "all") list = list.filter((d) => d.series === seriesFilter);
    if (characterFilter !== "all") list = list.filter((d) => d.characterName === characterFilter);
    if (conditionFilter !== "all") list = list.filter((d) => d.condition === conditionFilter);
    if (rarityFilter !== "all") list = list.filter((d) => d.rarity === rarityFilter);

    list.sort((a, b) => {
      switch (sortBy) {
        case "newest": return (b.acquiredDate ?? b.releaseDate).localeCompare(a.acquiredDate ?? a.releaseDate);
        case "release": return b.releaseDate.localeCompare(a.releaseDate);
        case "value": return b.estimatedValue - a.estimatedValue;
        case "rarity": {
          const order: Record<string, number> = { "ultra-rare": 0, exclusive: 1, rare: 2, common: 3 };
          return (order[a.rarity] ?? 4) - (order[b.rarity] ?? 4);
        }
        default: return 0;
      }
    });
    return list;
  }, [search, statusFilter, seriesFilter, characterFilter, conditionFilter, rarityFilter, sortBy]);

  const seriesGroups = useMemo(() => {
    const map = new Map<string, DollV5[]>();
    filtered.forEach((d) => { const arr = map.get(d.series) || []; arr.push(d); map.set(d.series, arr); });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const hasActiveFilters = statusFilter !== "all" || seriesFilter !== "all" || characterFilter !== "all" || conditionFilter !== "all" || rarityFilter !== "all" || search !== "";
  const resetFilters = () => { setSearch(""); setStatusFilter("all"); setSeriesFilter("all"); setCharacterFilter("all"); setConditionFilter("all"); setRarityFilter("all"); setSortBy("newest"); };

  const ownedCount = dollsV5.filter((d) => d.status === "owned").length;
  const totalVal = dollsV5.filter((d) => d.status === "owned").reduce((s, d) => s + d.estimatedValue, 0);
  const pct = Math.round((profile.ownedDolls / profile.totalDolls) * 100);

  const sel = (label: string, value: string, onChange: (v: string) => void, options: { value: string; label: string }[]) => (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel sx={{ fontSize: 13 }}>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e: SelectChangeEvent) => onChange(e.target.value)} sx={{ fontSize: 13 }}>
        {options.map((o) => <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13 }}>{o.label}</MenuItem>)}
      </Select>
    </FormControl>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: C.bg }}>
        {/* ═══════ HEADER ═══════ */}
        <Box sx={{ borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.purple}22, ${C.bg}, ${C.pink}11)` }} />
          <Box sx={{ position: "relative", maxWidth: 1440, mx: "auto", px: 3, py: 4 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "flex-start" }} spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Avatar sx={{ width: 72, height: 72, borderRadius: 3, background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, fontSize: 28, fontWeight: 700 }}>
                  {profile.username.charAt(0)}
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" fontWeight={700}>{profile.username}</Typography>
                    <Chip
                      icon={isPrivate ? <Lock sx={{ fontSize: 14 }} /> : <Public sx={{ fontSize: 14 }} />}
                      label={isPrivate ? "Private" : "Public"} size="small" onClick={() => setIsPrivate(!isPrivate)}
                      sx={{ fontSize: 10, fontWeight: 600, height: 22, cursor: "pointer",
                        bgcolor: isPrivate ? `${C.red}18` : `${C.green}18`, color: isPrivate ? C.red : C.green,
                        border: `1px solid ${isPrivate ? C.red : C.green}44`,
                        "& .MuiChip-icon": { color: "inherit" } }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Collector since {new Date(profile.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" startIcon={<Add />}>Add Doll</Button>
                <Button variant="outlined" size="small" startIcon={<Share />}>Share</Button>
                <Button variant="outlined" size="small" startIcon={<Settings />}>Edit</Button>
              </Stack>
            </Stack>

            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={{ xs: 3, md: 5 }} sx={{ mt: 3 }}>
              <StatChip label="Owned" value={ownedCount} color={C.green} />
              <StatChip label="Wishlist" value={profile.wishlistCount} color={C.gold} />
              <StatChip label="Series Done" value={`${profile.completedSeries}/${profile.totalSeries}`} color={C.purple} />
              <StatChip label="Rare Items" value={profile.rareCount} color={C.pink} />
              <StatChip label="Est. Value" value={`$${totalVal.toLocaleString()}`} color={C.green} />
              <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right" }}>
                    {ownedCount} / {profile.totalDolls} collected
                  </Typography>
                  <LinearProgress variant="determinate" value={pct} sx={{ mt: 0.5, height: 6, borderRadius: 3, width: 180 }} />
                </Box>
                <Typography variant="body2" fontWeight={700} sx={{ color: C.purple }}>{pct}%</Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 2.5 }}><AchievementsStrip /></Box>
          </Box>
        </Box>

        {/* ═══════ CONTROLS ═══════ */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 30, borderBottom: `1px solid ${C.border}`, bgcolor: `${C.bg}EE`, backdropFilter: "blur(12px)" }}>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5} sx={{ maxWidth: 1440, mx: "auto", px: 3, py: 1.5 }}>
            <TextField size="small" placeholder="Search releases, characters, series…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
              sx={{ width: 260, "& .MuiInputBase-input": { fontSize: 13 } }} />

            {sel("Status", statusFilter, setStatusFilter, [
              { value: "all", label: "All Status" }, { value: "owned", label: "Owned" },
              { value: "wishlist", label: "Wishlist" }, { value: "missing", label: "Missing" },
            ])}
            {sel("Series", seriesFilter, setSeriesFilter, [{ value: "all", label: "All Series" }, ...allSeries.map((s) => ({ value: s, label: s }))])}
            {sel("Character", characterFilter, setCharacterFilter, [{ value: "all", label: "All Characters" }, ...allCharacters.map((c) => ({ value: c, label: c }))])}
            {sel("Condition", conditionFilter, setConditionFilter, [
              { value: "all", label: "All Conditions" }, { value: "boxed", label: "Boxed" },
              { value: "unboxed", label: "Unboxed" }, { value: "damaged", label: "Damaged" },
            ])}
            {sel("Rarity", rarityFilter, setRarityFilter, [
              { value: "all", label: "All Rarities" }, { value: "common", label: "Common" },
              { value: "rare", label: "Rare" }, { value: "exclusive", label: "Exclusive" },
              { value: "ultra-rare", label: "Ultra Rare" },
            ])}
            {sel("Sort", sortBy, setSortBy, [
              { value: "newest", label: "Newest Added" }, { value: "release", label: "Release Date" },
              { value: "value", label: "Value" }, { value: "rarity", label: "Rarity" },
            ])}

            <Box sx={{ flex: 1 }} />

            {hasActiveFilters && (
              <Button size="small" startIcon={<Close sx={{ fontSize: 14 }} />} onClick={resetFilters}
                sx={{ fontSize: 12, color: C.textMuted }}>Reset</Button>
            )}

            <ToggleButtonGroup size="small" exclusive value={viewMode} onChange={(_, v) => v && setViewMode(v)}
              sx={{ "& .MuiToggleButton-root": { px: 1.5, py: 0.75 } }}>
              <ToggleButton value="grid"><GridView sx={{ fontSize: 18 }} /></ToggleButton>
              <ToggleButton value="series"><ViewList sx={{ fontSize: 18 }} /></ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Toggle Insights">
              <IconButton size="small" onClick={() => setShowInsights(!showInsights)}
                sx={{ border: `1px solid ${showInsights ? `${C.purple}55` : C.border}`,
                  bgcolor: showInsights ? `${C.purple}18` : "transparent", color: showInsights ? C.purple : C.textMuted }}>
                {showInsights ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ maxWidth: 1440, mx: "auto", px: 3, pb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}{hasActiveFilters ? " (filtered)" : ""}
            </Typography>
          </Box>
        </Box>

        {/* ═══════ CONTENT ═══════ */}
        <Box sx={{ maxWidth: 1440, mx: "auto", px: 3, py: 3 }}>
          {isPrivate ? (
            <PrivateState />
          ) : filtered.length === 0 && !hasActiveFilters ? (
            <EmptyCollection />
          ) : filtered.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10 }}>
              <FilterList sx={{ fontSize: 40, color: `${C.textMuted}55`, mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">No items match your filters.</Typography>
              <Button size="small" startIcon={<Close sx={{ fontSize: 14 }} />} onClick={resetFilters} sx={{ mt: 1.5, fontSize: 12 }}>Reset Filters</Button>
            </Box>
          ) : (
            <Stack direction="row" spacing={3}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {viewMode === "grid" ? (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: showInsights ? "repeat(4, 1fr)" : "repeat(5, 1fr)" }, gap: 2 }}>
                    {filtered.map((d) => <DollCard key={d.id} doll={d} />)}
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {seriesGroups.map(([name, items]) => <SeriesBlock key={name} seriesName={name} items={items} />)}
                  </Stack>
                )}
              </Box>

              {showInsights && (
                <Box sx={{ width: 280, flexShrink: 0, display: { xs: "none", lg: "block" } }}>
                  <InsightsSidebar filtered={dollsV5} />
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
