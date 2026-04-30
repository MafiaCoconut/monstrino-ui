import React, { useState, useMemo, useCallback } from "react";

/* ─── TOKENS ─── */
const T = {
  bg: "#08080f",
  bg2: "#0e0e1a",
  bg3: "#141422",
  card: "#12121e",
  cardHover: "#1a1a2e",
  border: "#1e1e35",
  borderLight: "#2a2a48",
  borderActive: "#3a3a58",
  text: "#e8e8f0",
  textDim: "#8888a8",
  textMuted: "#5a5a78",
  pink: "#ff2d78",
  pinkDim: "rgba(255,45,120,.15)",
  pinkGlow: "0 0 20px rgba(255,45,120,.25)",
  purple: "#9945ff",
  purpleDim: "rgba(153,69,255,.12)",
  cyan: "#00d4ff",
  cyanDim: "rgba(0,212,255,.1)",
  green: "#00e676",
  red: "#ff4466",
  yellow: "#ffd600",
  radius: "8px",
  radiusPill: "999px",
  font: "'Inter','Segoe UI',system-ui,sans-serif",
  mono: "'JetBrains Mono','Fira Code','SF Mono',monospace",
  shadow: "0 2px 12px rgba(0,0,0,.4)",
  transition: "all .2s ease",
};

/* ─── GLOBAL STYLE ─── */
const GlobalStyle = () => (
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:${T.bg};color:${T.text};font-family:${T.font};-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-track{background:${T.bg2}}
    ::-webkit-scrollbar-thumb{background:${T.borderLight};border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .fade-up{animation:fadeUp .4s ease both}
    .fade-in{animation:fadeIn .3s ease both}
    input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
    input[type="number"]{-moz-appearance:textfield}
  `}</style>
);

/* ─── MOCK DATA ─── */
const ENTITY_TYPES = ["All","Releases","Dolls","Accessories","Parts","Pets","Bundles"] as const;
type EntityType = typeof ENTITY_TYPES[number];

const CONDITIONS = ["New","Mint","Near Mint","Good","Fair"] as const;
const COMPLETENESS = ["Complete","Partial","Loose","Accessory Only"] as const;
const PLATFORMS = ["eBay","Mercari","Yahoo JP","Vinted","Official Store","Mandarake","AliExpress"] as const;
const SOURCE_TYPES = ["Retail","Marketplace","Auction","Second-hand"] as const;
const REGIONS = ["US","EU","JP","UK","AU","CA"] as const;
const CURRENCIES = ["USD","EUR","JPY","GBP"] as const;
const SALE_FORMATS = ["Buy Now","Auction"] as const;
const CHARACTERS = ["Draculaura","Clawdeen","Frankie","Lagoona","Cleo","Abbey","Ghoulia","Toralei"] as const;
const SERIES = ["G1 Original","G2 Reboot","G3 2022","Reel Drama","Haunt Couture","Collectors Edition","Skulltimate"] as const;
const DATE_RANGES = ["7d","30d","90d","All"] as const;

type RealEntityType = Exclude<EntityType,"All">;

interface Listing {
  id: number;
  title: string;
  entityType: RealEntityType;
  platform: string;
  condition: string;
  completeness: string;
  price: number;
  shipping: number;
  region: string;
  date: string;
  status: "active"|"sold";
  character: string;
  series: string;
  currency: string;
  sourceType: string;
  saleFormat: string;
}

const mockListings: Listing[] = Array.from({length:40},(_,i)=>({
  id:i+1,
  title:[
    "Draculaura Collector Edition","Clawdeen Haunt Couture","Frankie Reel Drama","Lagoona G3 Basic",
    "Cleo Skulltimate","Abbey Collector","Ghoulia G1 Original","Toralei Reboot",
    "Draculaura Pet Bat","Clawdeen Accessory Pack","Frankie Parts Set","Lagoona Bundle Lot",
    "Cleo Jewelry Set","Abbey Ice Accessories","Ghoulia Lab Kit","Toralei Cat Pet",
    "G1 Draculaura NRFB","Clawdeen Wolf Complete","Frankie Stein Loose","Lagoona Swim Set",
  ][i%20],
  entityType:(["Releases","Dolls","Accessories","Parts","Pets","Bundles"] as RealEntityType[])[i%6],
  platform:PLATFORMS[i%7] as string,
  condition:CONDITIONS[i%5] as string,
  completeness:COMPLETENESS[i%4] as string,
  price:+(15+Math.random()*180).toFixed(2),
  shipping:+(2+Math.random()*12).toFixed(2),
  region:REGIONS[i%6] as string,
  date:new Date(2025,0,1+i*3).toISOString().slice(0,10),
  status:i%5===0?"sold":"active" as "active"|"sold",
  character:CHARACTERS[i%8] as string,
  series:SERIES[i%7] as string,
  currency:CURRENCIES[i%4] as string,
  sourceType:SOURCE_TYPES[i%4] as string,
  saleFormat:SALE_FORMATS[i%2] as string,
}));

const INSIGHTS = [
  {icon:"💎",label:"Best Deal",text:"Draculaura Collector Ed. on eBay — $42, 38% below median",color:T.green},
  {icon:"⚠️",label:"Above Median",text:"Clawdeen Haunt Couture listed 22% above 90d median",color:T.yellow},
  {icon:"🔍",label:"Rare Detected",text:"G1 Ghoulia Lab Kit — only 2 active listings found",color:T.cyan},
  {icon:"📦",label:"Bundle Advantage",text:"Frankie Parts Set bundle saves $18 vs separate items",color:T.purple},
  {icon:"📈",label:"Price Spike",text:"Abbey Collector prices up 31% in last 14 days",color:T.red},
];

const WATCHLIST = [
  {name:"Draculaura Collector Ed.",price:"$42.00",alert:"Below $45",active:true},
  {name:"Clawdeen Haunt Couture",price:"$89.00",alert:"Below $80",active:false},
  {name:"G1 Ghoulia Original",price:"$125.00",alert:"Any listing",active:true},
];

type ChartPoint = [number, [number, number, number]];
const chartDataSets:{[k:string]:ChartPoint[]} = {
  "30D": Array.from({length:30},(_,i)=>[i,[45+Math.sin(i/3)*8+Math.random()*5,40+Math.cos(i/4)*6+Math.random()*4,43+Math.sin(i/5)*3]] as ChartPoint),
  "90D": Array.from({length:90},(_,i)=>[i,[50+Math.sin(i/8)*12+Math.random()*6,42+Math.cos(i/10)*10+Math.random()*5,46+Math.sin(i/12)*4]] as ChartPoint),
  "1Y":  Array.from({length:52},(_,i)=>[i,[55+Math.sin(i/6)*18+Math.random()*8,44+Math.cos(i/8)*14+Math.random()*6,50+Math.sin(i/10)*6]] as ChartPoint),
};

/* ─── MINI COMPONENTS ─── */
const Pill:React.FC<{active?:boolean;onClick?:()=>void;children:React.ReactNode;color?:string;small?:boolean;style?:React.CSSProperties}> = ({active,onClick,children,color=T.pink,small,style:extraStyle}) => (
  <button onClick={onClick} style={{
    background:active?color:"transparent",
    color:active?"#fff":T.textDim,
    border:`1px solid ${active?color:T.border}`,
    borderRadius:T.radiusPill,padding:small?"3px 10px":"6px 16px",
    fontSize:small?"10px":"11px",fontFamily:T.mono,textTransform:"uppercase",
    letterSpacing:"0.08em",cursor:"pointer",transition:T.transition,fontWeight:600,
    whiteSpace:"nowrap",...extraStyle,
  }}>{children}</button>
);

const MetricCard:React.FC<{label:string;value:string;sub?:string;color?:string}> = ({label,value,sub,color=T.text}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"16px 20px",flex:"1 1 140px",minWidth:130}}>
    <div style={{fontSize:"10px",fontFamily:T.mono,textTransform:"uppercase",color:T.textMuted,letterSpacing:"0.1em",marginBottom:6}}>{label}</div>
    <div style={{fontSize:"22px",fontWeight:700,fontFamily:T.mono,color,letterSpacing:"-0.02em"}}>{value}</div>
    {sub&&<div style={{fontSize:"11px",color:sub.startsWith("+")?T.green:sub.startsWith("-")?T.red:T.textDim,marginTop:4,fontFamily:T.mono}}>{sub}</div>}
  </div>
);

const Badge:React.FC<{children:React.ReactNode;color?:string}> = ({children,color=T.pink}) => (
  <span style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:T.radiusPill,padding:"2px 10px",fontSize:"10px",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{children}</span>
);

const SectionLabel:React.FC<{children:React.ReactNode}> = ({children}) => (
  <h3 style={{fontFamily:T.mono,textTransform:"uppercase",fontSize:12,letterSpacing:"0.1em",color:T.textDim,marginBottom:12}}>{children}</h3>
);

/* ─── SVG CHART (UPGRADED) ─── */
const PriceChart:React.FC<{range:string;showActive:boolean;showSold:boolean}> = ({range,showActive,showSold}) => {
  const data = chartDataSets[range]||chartDataSets["30D"];
  const W=720,H=240,padL=40,padR=16,padT=20,padB=32;
  const allVals = data.flatMap(d=>d[1]);
  const mn = Math.min(...allVals)-5, mx = Math.max(...allVals)+5;
  const x = (i:number)=> padL + (i/(data.length-1))*(W-padL-padR);
  const y = (v:number)=> padT + ((mx-v)/(mx-mn))*(H-padT-padB);
  const line = (idx:number) => data.map((d,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y(d[1][idx]).toFixed(1)}`).join(" ");
  const area = (idx:number) => line(idx)+` L${x(data.length-1).toFixed(1)},${(H-padB).toFixed(1)} L${padL},${(H-padB).toFixed(1)} Z`;

  const gridLines = 5;
  const timeLabels = range==="30D" ? ["Day 1","Day 10","Day 20","Day 30"] : range==="90D" ? ["Month 1","Month 2","Month 3"] : ["Q1","Q2","Q3","Q4"];
  const timeLabelPositions = timeLabels.map((_,i)=> padL + (i/(timeLabels.length-1))*(W-padL-padR));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.pink} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={T.pink} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="soldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.cyan} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={T.cyan} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {Array.from({length:gridLines+1}).map((_,i)=>{
        const yy=padT+i*((H-padT-padB)/gridLines);
        const val=mx-(i/gridLines)*(mx-mn);
        return <React.Fragment key={i}>
          <line x1={padL} x2={W-padR} y1={yy} y2={yy} stroke={T.border} strokeWidth={0.5}/>
          <text x={padL-6} y={yy+3} textAnchor="end" fill={T.textMuted} fontSize={9} fontFamily={T.mono}>${val.toFixed(0)}</text>
        </React.Fragment>;
      })}
      {/* X axis labels */}
      {timeLabels.map((label,i)=>(
        <text key={i} x={timeLabelPositions[i]} y={H-8} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={T.mono}>{label}</text>
      ))}
      {/* median band */}
      <path d={area(2)} fill="url(#soldGrad)" opacity={0.5}/>
      <path d={line(2)} fill="none" stroke={T.purple} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.7}/>
      {/* active */}
      {showActive && <>
        <path d={area(0)} fill="url(#activeGrad)"/>
        <path d={line(0)} fill="none" stroke={T.pink} strokeWidth={2}/>
        {/* highlight last point */}
        <circle cx={x(data.length-1)} cy={y(data[data.length-1][1][0])} r={4} fill={T.pink} stroke={T.bg} strokeWidth={2}/>
      </>}
      {/* sold */}
      {showSold && <>
        <path d={line(1)} fill="none" stroke={T.cyan} strokeWidth={1.5} strokeDasharray="6 2"/>
        <circle cx={x(data.length-1)} cy={y(data[data.length-1][1][1])} r={3} fill={T.cyan} stroke={T.bg} strokeWidth={2}/>
      </>}
    </svg>
  );
};

/* ─── FILTER SIDEBAR ─── */
const FilterGroup:React.FC<{label:string;options:readonly string[];selected:Set<string>;toggle:(v:string)=>void}> = ({label,options,selected,toggle}) => {
  const [open,setOpen] = useState(true);
  return (
    <div style={{marginBottom:16}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:T.textDim,fontSize:"10px",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer",display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 0"}}>
        <span style={{transform:open?"rotate(90deg)":"rotate(0)",transition:T.transition,fontSize:8,display:"inline-block"}}>▶</span>{label}
        {selected.size>0 && <span style={{background:T.pink,color:"#fff",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,marginLeft:"auto",flexShrink:0}}>{selected.size}</span>}
      </button>
      {open && <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6,paddingLeft:2}}>
        {options.map(o=><Pill key={o} small active={selected.has(o)} onClick={()=>toggle(o)} color={T.purple}>{o}</Pill>)}
      </div>}
    </div>
  );
};

/* ─── PRICE RANGE FILTER ─── */
const PriceRangeFilter:React.FC<{min:string;max:string;onMinChange:(v:string)=>void;onMaxChange:(v:string)=>void}> = ({min,max,onMinChange,onMaxChange}) => {
  const inputStyle:React.CSSProperties = {width:80,padding:"6px 10px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:T.radius,color:T.text,fontSize:11,fontFamily:T.mono,outline:"none"};
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:"10px",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.1em",color:T.textDim,marginBottom:8}}>Price Range</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input type="number" placeholder="Min" value={min} onChange={e=>onMinChange(e.target.value)} style={inputStyle}/>
        <span style={{color:T.textMuted,fontSize:10}}>—</span>
        <input type="number" placeholder="Max" value={max} onChange={e=>onMaxChange(e.target.value)} style={inputStyle}/>
      </div>
    </div>
  );
};

/* ─── ACTIVE FILTERS CHIPS ─── */
const ActiveFiltersBar:React.FC<{filters:{label:string;values:string[];clear:()=>void}[];clearAll:()=>void}> = ({filters,clearAll}) => {
  const active = filters.filter(f=>f.values.length>0);
  if(active.length===0) return null;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16,alignItems:"center"}}>
      {active.map(f=>f.values.map(v=>(
        <span key={f.label+v} style={{background:T.purpleDim,color:T.purple,border:`1px solid ${T.purple}44`,borderRadius:T.radiusPill,padding:"2px 10px",fontSize:9,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.06em",display:"inline-flex",alignItems:"center",gap:4}}>
          {v}
          <span style={{cursor:"pointer",opacity:.7,fontSize:11}} onClick={f.clear}>✕</span>
        </span>
      )))}
      <button onClick={clearAll} style={{background:"none",border:"none",color:T.textMuted,fontSize:9,fontFamily:T.mono,textTransform:"uppercase",cursor:"pointer",textDecoration:"underline",letterSpacing:"0.06em"}}>Clear all</button>
    </div>
  );
};

/* ─── COMPARE DRAWER ─── */
const CompareDrawer:React.FC<{items:Listing[];onClose:()=>void}> = ({items,onClose}) => {
  const bestPrice = Math.min(...items.map(i=>i.price+i.shipping));
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}} className="fade-in"/>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:Math.min(780,items.length*220+80),maxWidth:"90vw",background:T.bg2,borderLeft:`1px solid ${T.border}`,padding:32,overflowY:"auto",animation:"fadeUp .3s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h3 style={{fontFamily:T.mono,textTransform:"uppercase",fontSize:14,letterSpacing:"0.1em"}}>Compare ({items.length})</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textDim,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:8}}>
          {items.map(it=>{
            const total = it.price+it.shipping;
            const isBest = total===bestPrice;
            return (
              <div key={it.id} style={{minWidth:200,background:T.card,border:`1px solid ${isBest?T.green+"66":T.border}`,borderRadius:T.radius,padding:16,flex:"0 0 auto",position:"relative"}}>
                {isBest && <div style={{position:"absolute",top:-8,right:12}}><Badge color={T.green}>Best Price</Badge></div>}
                <div style={{width:"100%",height:100,background:T.bg3,borderRadius:6,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>
                <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>{it.title}</div>
                <Badge color={T.pink}>{it.entityType}</Badge>
                <div style={{marginTop:12,fontSize:10,color:T.textDim,fontFamily:T.mono}}>
                  {([["Price",`$${it.price.toFixed(2)}`],["Shipping",`$${it.shipping.toFixed(2)}`],["Total",`$${total.toFixed(2)}`],["Condition",it.condition],["Completeness",it.completeness],["Platform",it.platform],["Region",it.region]] as [string,string][]).map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>
                      <span>{l}</span><span style={{color:l==="Total"?(isBest?T.green:T.text):T.text,fontWeight:l==="Total"?700:400}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── DETAIL DRAWER ─── */
const DetailDrawer:React.FC<{item:Listing;onClose:()=>void}> = ({item,onClose}) => (
  <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",justifyContent:"flex-end"}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}} className="fade-in"/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:420,maxWidth:"90vw",background:T.bg2,borderLeft:`1px solid ${T.border}`,padding:32,overflowY:"auto",animation:"fadeUp .3s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontFamily:T.mono,textTransform:"uppercase",fontSize:13,letterSpacing:"0.1em"}}>Listing Detail</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.textDim,fontSize:20,cursor:"pointer"}}>✕</button>
      </div>
      <div style={{width:"100%",height:180,background:T.bg3,borderRadius:T.radius,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      </div>
      <h2 style={{fontSize:18,fontWeight:700,marginBottom:8}}>{item.title}</h2>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        <Badge>{item.entityType}</Badge><Badge color={T.cyan}>{item.condition}</Badge><Badge color={T.purple}>{item.completeness}</Badge>
        <Badge color={item.status==="active"?T.green:T.textMuted}>{item.status}</Badge>
      </div>
      {([["Platform",item.platform],["Source Type",item.sourceType],["Character",item.character],["Series",item.series],["Region",item.region],["Currency",item.currency],["Format",item.saleFormat],["Date",item.date],["Status",item.status.toUpperCase()],["Price",`$${item.price.toFixed(2)}`],["Shipping",`$${item.shipping.toFixed(2)}`],["Total",`$${(item.price+item.shipping).toFixed(2)}`]] as [string,string][]).map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:12,fontFamily:T.mono}}>
          <span style={{color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</span>
          <span style={{fontWeight:l==="Total"?700:600,color:l==="Total"?T.green:T.text}}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── EMPTY STATE ─── */
const EmptyState = () => (
  <div style={{padding:"48px 24px",textAlign:"center",color:T.textMuted}}>
    <div style={{fontSize:40,marginBottom:12,opacity:.4}}>🔍</div>
    <div style={{fontFamily:T.mono,textTransform:"uppercase",fontSize:12,letterSpacing:"0.1em",marginBottom:6}}>No results found</div>
    <div style={{fontSize:12,color:T.textMuted}}>Try adjusting your filters or search query</div>
  </div>
);

/* ═════════════════════════════════════════════
   MAIN PAGE — V6
   ═════════════════════════════════════════════ */
export default function MarketPricesV6() {
  const [search,setSearch] = useState("");
  const [entity,setEntity] = useState<EntityType>("All");
  const [chartRange,setChartRange] = useState("30D");
  const [showActive,setShowActive] = useState(true);
  const [showSold,setShowSold] = useState(true);
  const [listingTab,setListingTab] = useState<"active"|"sold">("active");
  const [viewMode,setViewMode] = useState<"table"|"cards">("table");
  const [sortCol,setSortCol] = useState<"price"|"total"|"date">("price");
  const [sortDir,setSortDir] = useState<1|-1>(1);
  const [compareIds,setCompareIds] = useState<Set<number>>(new Set());
  const [showCompare,setShowCompare] = useState(false);
  const [detailItem,setDetailItem] = useState<Listing|null>(null);
  const [selectedItem,setSelectedItem] = useState<Listing|null>(null);
  const [sidebarOpen,setSidebarOpen] = useState(true);

  // Filters
  const [fCondition,setFCondition] = useState<Set<string>>(new Set());
  const [fCompleteness,setFCompleteness] = useState<Set<string>>(new Set());
  const [fPlatform,setFPlatform] = useState<Set<string>>(new Set());
  const [fSource,setFSource] = useState<Set<string>>(new Set());
  const [fRegion,setFRegion] = useState<Set<string>>(new Set());
  const [fCharacter,setFCharacter] = useState<Set<string>>(new Set());
  const [fSeries,setFSeries] = useState<Set<string>>(new Set());
  const [fFormat,setFFormat] = useState<Set<string>>(new Set());
  const [fCurrency,setFCurrency] = useState<Set<string>>(new Set());
  const [fDateRange,setFDateRange] = useState<string>("All");
  const [priceMin,setPriceMin] = useState("");
  const [priceMax,setPriceMax] = useState("");

  const toggleSet = useCallback((setter:React.Dispatch<React.SetStateAction<Set<string>>>) => (val:string) => {
    setter(prev => { const n=new Set(prev); n.has(val)?n.delete(val):n.add(val); return n; });
  },[]);

  const clearAllFilters = useCallback(()=>{
    setFCondition(new Set());setFCompleteness(new Set());setFPlatform(new Set());
    setFSource(new Set());setFRegion(new Set());setFCharacter(new Set());
    setFSeries(new Set());setFFormat(new Set());setFCurrency(new Set());
    setFDateRange("All");setPriceMin("");setPriceMax("");
  },[]);

  const hasActiveFilters = fCondition.size+fCompleteness.size+fPlatform.size+fSource.size+fRegion.size+fCharacter.size+fSeries.size+fFormat.size+fCurrency.size>0 || fDateRange!=="All" || priceMin || priceMax;

  const filteredListings = useMemo(()=>{
    const now = new Date(2025,3,1); // mock "today"
    let r = mockListings.filter(l=>{
      if(entity!=="All" && l.entityType!==entity) return false;
      if(search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.character.toLowerCase().includes(search.toLowerCase())) return false;
      if(fCondition.size && !fCondition.has(l.condition)) return false;
      if(fCompleteness.size && !fCompleteness.has(l.completeness)) return false;
      if(fPlatform.size && !fPlatform.has(l.platform)) return false;
      if(fSource.size && !fSource.has(l.sourceType)) return false;
      if(fRegion.size && !fRegion.has(l.region)) return false;
      if(fCharacter.size && !fCharacter.has(l.character)) return false;
      if(fSeries.size && !fSeries.has(l.series)) return false;
      if(fFormat.size && !fFormat.has(l.saleFormat)) return false;
      if(fCurrency.size && !fCurrency.has(l.currency)) return false;
      if(listingTab==="active" && l.status!=="active") return false;
      if(listingTab==="sold" && l.status!=="sold") return false;
      if(priceMin && l.price < parseFloat(priceMin)) return false;
      if(priceMax && l.price > parseFloat(priceMax)) return false;
      if(fDateRange!=="All"){
        const days = fDateRange==="7d"?7:fDateRange==="30d"?30:90;
        const cutoff = new Date(now.getTime()-days*86400000);
        if(new Date(l.date)<cutoff) return false;
      }
      return true;
    });
    r.sort((a,b)=>{
      if(sortCol==="price") return (a.price-b.price)*sortDir;
      if(sortCol==="total") return ((a.price+a.shipping)-(b.price+b.shipping))*sortDir;
      return (new Date(a.date).getTime()-new Date(b.date).getTime())*sortDir;
    });
    return r;
  },[search,entity,fCondition,fCompleteness,fPlatform,fSource,fRegion,fCharacter,fSeries,fFormat,fCurrency,fDateRange,priceMin,priceMax,listingTab,sortCol,sortDir]);

  const toggleCompare = (id:number)=>{
    setCompareIds(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  };
  const compareItems = mockListings.filter(l=>compareIds.has(l.id));

  // Featured = selectedItem or first filtered
  const featured = selectedItem || filteredListings[0] || mockListings[0];

  const selectAndOpen = useCallback((item:Listing)=>{
    setSelectedItem(item);
    setDetailItem(item);
  },[]);

  const selectItem = useCallback((item:Listing)=>{
    setSelectedItem(item);
  },[]);

  const handleSort = (col:"price"|"total"|"date")=>{
    if(sortCol===col) setSortDir(d=>d===1?-1:1);
    else { setSortCol(col); setSortDir(1); }
  };
  const sortArrow = (col:string) => sortCol===col?(sortDir===1?" ▲":" ▼"):"";

  const activeFiltersList = [
    {label:"Condition",values:[...fCondition],clear:()=>setFCondition(new Set())},
    {label:"Completeness",values:[...fCompleteness],clear:()=>setFCompleteness(new Set())},
    {label:"Platform",values:[...fPlatform],clear:()=>setFPlatform(new Set())},
    {label:"Source",values:[...fSource],clear:()=>setFSource(new Set())},
    {label:"Region",values:[...fRegion],clear:()=>setFRegion(new Set())},
    {label:"Character",values:[...fCharacter],clear:()=>setFCharacter(new Set())},
    {label:"Series",values:[...fSeries],clear:()=>setFSeries(new Set())},
    {label:"Format",values:[...fFormat],clear:()=>setFFormat(new Set())},
    {label:"Currency",values:[...fCurrency],clear:()=>setFCurrency(new Set())},
  ];

  // Unique sources for featured
  const sourcesCount = new Set(filteredListings.map(l=>l.platform)).size;

  /* ─── RENDER ─── */
  return (
    <>
      <GlobalStyle/>
      <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 20% 0%,rgba(153,69,255,.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(255,45,120,.04) 0%,transparent 50%),${T.bg}`}}>

        {/* ═══ HEADER ═══ */}
        <header style={{padding:"40px 32px 0",maxWidth:1440,margin:"0 auto"}} className="fade-up">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
            <div>
              <h1 style={{fontSize:36,fontWeight:800,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1}}>
                Price Explorer
              </h1>
              <p style={{color:T.textDim,fontSize:13,marginTop:8,maxWidth:420}}>
                Unified pricing intelligence across official stores, marketplaces, auctions & second-hand sources
              </p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Pill color={T.pink}>⊕ Track Item</Pill>
              <Pill color={T.purple}>🔔 Add Alert</Pill>
              <Pill color={T.cyan} onClick={()=>compareIds.size>0&&setShowCompare(true)}>⇄ Compare{compareIds.size>0?` (${compareIds.size})`:""}</Pill>
            </div>
          </div>

          {/* Search */}
          <div style={{marginTop:20,position:"relative",maxWidth:560}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items, characters, series…"
              style={{width:"100%",padding:"12px 16px 12px 40px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:T.radiusPill,color:T.text,fontSize:13,fontFamily:T.font,outline:"none"}}/>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.textMuted,fontSize:14}}>🔍</span>
          </div>

          {/* Entity tabs */}
          <div style={{display:"flex",gap:6,marginTop:20,flexWrap:"wrap"}}>
            {ENTITY_TYPES.map(et=><Pill key={et} active={entity===et} onClick={()=>{setEntity(et);setSelectedItem(null);}}>{et}</Pill>)}
          </div>
        </header>

        {/* ═══ BODY ═══ */}
        <div style={{display:"flex",maxWidth:1440,margin:"24px auto 0",padding:"0 32px",gap:24}}>

          {/* ─── SIDEBAR ─── */}
          <aside style={{width:sidebarOpen?230:40,minWidth:sidebarOpen?230:40,transition:T.transition,position:"sticky",top:20,alignSelf:"flex-start",maxHeight:"calc(100vh - 40px)",overflowY:"auto",overflowX:"hidden"}}>
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:T.radius,color:T.textDim,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,fontSize:14}}>
              {sidebarOpen?"◁":"▷"}
            </button>
            {sidebarOpen && <div className="fade-up">
              {hasActiveFilters && (
                <button onClick={clearAllFilters} style={{background:T.pinkDim,border:`1px solid ${T.pink}44`,borderRadius:T.radiusPill,color:T.pink,padding:"4px 14px",fontSize:10,fontFamily:T.mono,textTransform:"uppercase",cursor:"pointer",marginBottom:16,letterSpacing:"0.06em",width:"100%"}}>
                  ✕ Clear All Filters
                </button>
              )}
              <FilterGroup label="Condition" options={CONDITIONS} selected={fCondition} toggle={toggleSet(setFCondition)}/>
              <FilterGroup label="Completeness" options={COMPLETENESS} selected={fCompleteness} toggle={toggleSet(setFCompleteness)}/>
              <FilterGroup label="Platform" options={PLATFORMS} selected={fPlatform} toggle={toggleSet(setFPlatform)}/>
              <FilterGroup label="Source Type" options={SOURCE_TYPES} selected={fSource} toggle={toggleSet(setFSource)}/>
              <FilterGroup label="Region" options={REGIONS} selected={fRegion} toggle={toggleSet(setFRegion)}/>
              <FilterGroup label="Currency" options={CURRENCIES} selected={fCurrency} toggle={toggleSet(setFCurrency)}/>
              <FilterGroup label="Sale Format" options={SALE_FORMATS} selected={fFormat} toggle={toggleSet(setFFormat)}/>
              <FilterGroup label="Character" options={CHARACTERS} selected={fCharacter} toggle={toggleSet(setFCharacter)}/>
              <FilterGroup label="Series" options={SERIES} selected={fSeries} toggle={toggleSet(setFSeries)}/>
              <PriceRangeFilter min={priceMin} max={priceMax} onMinChange={setPriceMin} onMaxChange={setPriceMax}/>
              {/* Date range */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:"10px",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.1em",color:T.textDim,marginBottom:8}}>Date Range</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {DATE_RANGES.map(d=><Pill key={d} small active={fDateRange===d} onClick={()=>setFDateRange(d)} color={T.cyan}>{d}</Pill>)}
                </div>
              </div>
            </div>}
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <main style={{flex:1,minWidth:0}}>

            {/* Active filters chips */}
            <ActiveFiltersBar filters={activeFiltersList} clearAll={clearAllFilters}/>

            {/* ── SELECTED ITEM SUMMARY ── */}
            <section style={{background:T.card,border:`1px solid ${selectedItem?T.pink+"44":T.border}`,borderRadius:T.radius,padding:24,display:"flex",gap:24,marginBottom:24,flexWrap:"wrap",transition:T.transition,boxShadow:selectedItem?`0 0 30px ${T.pink}08`:"none"}} className="fade-up">
              {/* image */}
              <div style={{width:160,height:180,background:T.bg3,borderRadius:T.radius,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              {/* info */}
              <div style={{flex:1,minWidth:200}}>
                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
                  <Badge>{featured.entityType}</Badge>
                  <Badge color={T.cyan}>{featured.condition}</Badge>
                  <Badge color={T.purple}>{featured.completeness}</Badge>
                  <Badge color={T.green}>High Confidence</Badge>
                </div>
                <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>{featured.title}</h2>
                <div style={{color:T.textDim,fontSize:11,fontFamily:T.mono,display:"flex",gap:12,flexWrap:"wrap"}}>
                  <span>{featured.character}</span><span style={{color:T.border}}>·</span>
                  <span>{featured.series}</span><span style={{color:T.border}}>·</span>
                  <span>{featured.region}</span><span style={{color:T.border}}>·</span>
                  <span>Last: {featured.date}</span>
                </div>
                {/* price metrics */}
                <div style={{display:"flex",gap:24,marginTop:16,flexWrap:"wrap"}}>
                  {([["Lowest","$"+featured.price.toFixed(2),T.green],["Median","$"+(featured.price*1.15).toFixed(2),T.cyan],["Highest","$"+(featured.price*1.6).toFixed(2),T.red],["Trend","+8.2%",T.green]] as const).map(([l,v,c])=>(
                    <div key={l}>
                      <div style={{fontSize:9,fontFamily:T.mono,textTransform:"uppercase",color:T.textMuted,letterSpacing:"0.1em"}}>{l}</div>
                      <div style={{fontSize:22,fontWeight:700,fontFamily:T.mono,color:c as string,marginTop:2}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:16,color:T.textDim,fontSize:10,fontFamily:T.mono,marginTop:12,flexWrap:"wrap"}}>
                  <span>{filteredListings.length} listings</span>
                  <span style={{color:T.border}}>·</span>
                  <span>{sourcesCount} sources</span>
                  <span style={{color:T.border}}>·</span>
                  <span>{featured.completeness}</span>
                  <span style={{color:T.border}}>·</span>
                  <span>{featured.currency}</span>
                </div>
              </div>
            </section>

            {/* ── KPI ROW ── */}
            <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}} className="fade-up">
              <MetricCard label="Lowest Active" value={filteredListings.length>0?`$${Math.min(...filteredListings.map(l=>l.price)).toFixed(2)}`:"—"} sub="-4.2% vs 7d" color={T.green}/>
              <MetricCard label="30D Median" value="$52.40" sub="+2.1%"/>
              <MetricCard label="Sold Median" value="$48.90" sub="-1.3%" color={T.cyan}/>
              <MetricCard label="Active Listings" value={String(filteredListings.length)}/>
              <MetricCard label="Sources" value={String(sourcesCount)}/>
              <MetricCard label="Volatility" value="12%" sub="Low" color={T.purple}/>
            </div>

            {/* ── CHART ── */}
            <section style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:24,marginBottom:24}} className="fade-up">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",gap:6}}>
                  {["30D","90D","1Y"].map(r=><Pill key={r} small active={chartRange===r} onClick={()=>setChartRange(r)}>{r}</Pill>)}
                </div>
                <div style={{display:"flex",gap:16,alignItems:"center",fontSize:11,fontFamily:T.mono}}>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",color:showActive?T.pink:T.textMuted}}>
                    <span style={{width:12,height:3,background:showActive?T.pink:T.textMuted,borderRadius:2,display:"inline-block"}}/>
                    <input type="checkbox" checked={showActive} onChange={()=>setShowActive(!showActive)} style={{accentColor:T.pink,width:12,height:12}}/> Active
                  </label>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",color:showSold?T.cyan:T.textMuted}}>
                    <span style={{width:12,height:3,background:showSold?T.cyan:T.textMuted,borderRadius:2,display:"inline-block",borderTop:`1px dashed ${showSold?T.cyan:T.textMuted}`}}/>
                    <input type="checkbox" checked={showSold} onChange={()=>setShowSold(!showSold)} style={{accentColor:T.cyan,width:12,height:12}}/> Sold
                  </label>
                  <span style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:12,height:0,borderTop:`2px dashed ${T.purple}`,display:"inline-block"}}/>
                    <span style={{color:T.purple,fontSize:10}}>Median</span>
                  </span>
                </div>
              </div>
              <PriceChart range={chartRange} showActive={showActive} showSold={showSold}/>
            </section>

            {/* ── LISTINGS ── */}
            <section style={{marginBottom:24}} className="fade-up">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",gap:6}}>
                  <Pill active={listingTab==="active"} onClick={()=>setListingTab("active")} color={T.pink}>Active ({mockListings.filter(l=>l.status==="active").length})</Pill>
                  <Pill active={listingTab==="sold"} onClick={()=>setListingTab("sold")} color={T.cyan}>Sold ({mockListings.filter(l=>l.status==="sold").length})</Pill>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Pill small active={viewMode==="table"} onClick={()=>setViewMode("table")} color={T.purple}>Table</Pill>
                  <Pill small active={viewMode==="cards"} onClick={()=>setViewMode("cards")} color={T.purple}>Cards</Pill>
                </div>
              </div>

              {filteredListings.length===0 ? <EmptyState/> : viewMode==="table" ? (
                <div style={{overflowX:"auto",border:`1px solid ${T.border}`,borderRadius:T.radius}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:T.mono}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${T.border}`}}>
                        <th style={thS}>☐</th>
                        <th style={thS}>Title</th>
                        <th style={thS}>Type</th>
                        <th style={thS}>Platform</th>
                        <th style={thS}>Source</th>
                        <th style={thS}>Condition</th>
                        <th style={thS}>Complete</th>
                        <th style={{...thS,cursor:"pointer"}} onClick={()=>handleSort("price")}>Price{sortArrow("price")}</th>
                        <th style={thS}>Ship</th>
                        <th style={{...thS,cursor:"pointer"}} onClick={()=>handleSort("total")}>Total{sortArrow("total")}</th>
                        <th style={thS}>Region</th>
                        <th style={{...thS,cursor:"pointer"}} onClick={()=>handleSort("date")}>Date{sortArrow("date")}</th>
                        <th style={thS}>Status</th>
                        <th style={thS}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map(l=>{
                        const isSelected = selectedItem?.id===l.id;
                        return (
                          <tr key={l.id}
                            onClick={()=>selectItem(l)}
                            style={{
                              borderBottom:`1px solid ${T.border}`,
                              background:isSelected?T.pinkDim:compareIds.has(l.id)?`${T.purple}11`:"transparent",
                              transition:T.transition,
                              cursor:"pointer",
                              borderLeft:isSelected?`2px solid ${T.pink}`:"2px solid transparent",
                            }}
                            onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background=compareIds.has(l.id)?`${T.purple}11`:T.bg3}}
                            onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background=compareIds.has(l.id)?`${T.purple}11`:"transparent"}}>
                            <td style={tdS}><input type="checkbox" checked={compareIds.has(l.id)} onChange={e=>{e.stopPropagation();toggleCompare(l.id)}} style={{accentColor:T.pink}} onClick={e=>e.stopPropagation()}/></td>
                            <td style={{...tdS,fontWeight:600,color:isSelected?T.text:T.textDim,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</td>
                            <td style={tdS}><span style={{background:`${T.pink}18`,color:T.pink,padding:"1px 6px",borderRadius:T.radiusPill,fontSize:9}}>{l.entityType}</span></td>
                            <td style={tdS}>{l.platform}</td>
                            <td style={tdS}><span style={{color:T.textMuted,fontSize:10}}>{l.sourceType}</span></td>
                            <td style={tdS}>{l.condition}</td>
                            <td style={tdS}>{l.completeness}</td>
                            <td style={{...tdS,color:T.green,fontWeight:600,textAlign:"right"}}>${l.price.toFixed(2)}</td>
                            <td style={{...tdS,textAlign:"right"}}>${l.shipping.toFixed(2)}</td>
                            <td style={{...tdS,fontWeight:700,color:T.text,textAlign:"right",fontSize:13}}>${(l.price+l.shipping).toFixed(2)}</td>
                            <td style={tdS}>{l.region}</td>
                            <td style={tdS}>{l.date}</td>
                            <td style={tdS}>
                              <span style={{
                                color:l.status==="active"?T.green:T.textMuted,
                                background:l.status==="active"?`${T.green}15`:`${T.textMuted}15`,
                                padding:"2px 8px",borderRadius:T.radiusPill,
                                textTransform:"uppercase",fontSize:9,fontWeight:600,
                              }}>{l.status}</span>
                            </td>
                            <td style={tdS}><button onClick={e=>{e.stopPropagation();selectAndOpen(l)}} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:T.radiusPill,color:T.textDim,padding:"2px 8px",fontSize:9,cursor:"pointer",fontFamily:T.mono}}>View</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                  {filteredListings.map(l=>{
                    const isSelected = selectedItem?.id===l.id;
                    return (
                      <div key={l.id} onClick={()=>selectItem(l)}
                        style={{
                          background:isSelected?`linear-gradient(135deg,${T.pinkDim},${T.card})`:compareIds.has(l.id)?`linear-gradient(135deg,${T.purpleDim},${T.card})`:T.card,
                          border:`1px solid ${isSelected?T.pink+"66":compareIds.has(l.id)?T.purple+"44":T.border}`,
                          borderRadius:T.radius,padding:16,cursor:"pointer",transition:T.transition,
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 4px 20px rgba(255,45,120,.1)`}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            <Badge>{l.entityType}</Badge>
                            <span style={{
                              color:l.status==="active"?T.green:T.textMuted,
                              background:l.status==="active"?`${T.green}15`:`${T.textMuted}15`,
                              padding:"2px 8px",borderRadius:T.radiusPill,fontSize:9,fontFamily:T.mono,textTransform:"uppercase",fontWeight:600,
                            }}>{l.status}</span>
                          </div>
                          <input type="checkbox" checked={compareIds.has(l.id)} onChange={e=>{e.stopPropagation();toggleCompare(l.id)}} style={{accentColor:T.pink}} onClick={e=>e.stopPropagation()}/>
                        </div>
                        <div style={{fontSize:13,fontWeight:600,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
                        <div style={{fontSize:10,color:T.textDim,fontFamily:T.mono,marginBottom:4}}>{l.platform} · {l.sourceType} · {l.condition}</div>
                        <div style={{fontSize:10,color:T.textMuted,fontFamily:T.mono,marginBottom:8}}>{l.completeness} · {l.region}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                          <div>
                            <span style={{fontSize:18,fontWeight:700,fontFamily:T.mono,color:T.green}}>${l.price.toFixed(2)}</span>
                            <span style={{fontSize:10,color:T.textMuted,fontFamily:T.mono,marginLeft:6}}>+${l.shipping.toFixed(2)}</span>
                          </div>
                          <span style={{fontSize:14,fontWeight:700,fontFamily:T.mono,color:T.text}}>${(l.price+l.shipping).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── INSIGHTS ── */}
            <section style={{marginBottom:24}} className="fade-up">
              <SectionLabel>Market Insights</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                {INSIGHTS.map((ins,i)=>(
                  <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:18}}>{ins.icon}</span>
                    <div>
                      <div style={{fontSize:10,fontFamily:T.mono,textTransform:"uppercase",color:ins.color,letterSpacing:"0.08em",marginBottom:3}}>{ins.label}</div>
                      <div style={{fontSize:12,color:T.textDim,lineHeight:1.4}}>{ins.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── WATCHLIST ── */}
            <section style={{marginBottom:48}} className="fade-up">
              <SectionLabel>Watchlist & Alerts</SectionLabel>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {WATCHLIST.map((w,i)=>(
                  <div key={i} style={{background:T.card,border:`1px solid ${w.active?T.pink+"44":T.border}`,borderRadius:T.radius,padding:"14px 18px",minWidth:200,flex:"1 1 200px"}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{w.name}</div>
                    <div style={{fontFamily:T.mono,fontSize:16,fontWeight:700,color:T.green,marginBottom:6}}>{w.price}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:T.textMuted,fontFamily:T.mono}}>Alert: {w.alert}</span>
                      <span style={{width:8,height:8,borderRadius:"50%",background:w.active?T.green:T.textMuted}}/>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* ═══ STICKY COMPARE BAR ═══ */}
        {compareIds.size>0 && (
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:`${T.bg2}ee`,borderTop:`1px solid ${T.pink}44`,padding:"12px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:900,backdropFilter:"blur(12px)"}}>
            <span style={{fontFamily:T.mono,fontSize:12,color:T.textDim}}>{compareIds.size} item{compareIds.size>1?"s":""} selected for comparison</span>
            <div style={{display:"flex",gap:8}}>
              <Pill color={T.pink} onClick={()=>setShowCompare(true)}>Open Compare</Pill>
              <Pill color={T.textMuted} onClick={()=>setCompareIds(new Set())}>Clear</Pill>
            </div>
          </div>
        )}

        {/* ═══ DRAWERS ═══ */}
        {showCompare && compareItems.length>0 && <CompareDrawer items={compareItems} onClose={()=>setShowCompare(false)}/>}
        {detailItem && <DetailDrawer item={detailItem} onClose={()=>setDetailItem(null)}/>}
      </div>
    </>
  );
}

/* ─── TABLE CELL STYLES ─── */
const thS:React.CSSProperties = {padding:"10px 12px",textAlign:"left",color:T.textMuted,fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap",background:T.bg3};
const tdS:React.CSSProperties = {padding:"8px 12px",color:T.textDim,whiteSpace:"nowrap"};
