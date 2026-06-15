import { useState, useEffect } from "react";


const FONT = "'Sarabun', 'Inter', sans-serif";

// ── Master Data ───────────────────────────────────────────────────────────────
const INIT_HOSPITALS = [
  // รพ. ที่ทำ Sleep Test + CPAP
  { id:"h1", name:"รพ. บางปะกอก 8",              short:"BPK 8",       city:"กรุงเทพฯ",    type:"private_ins",   cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h2", name:"รพ. บางปะกอก 3",              short:"BPK 3",       city:"กรุงเทพฯ",    type:"private_ins",   cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h3", name:"รพ. บางปะกอก สมุทรปราการ",    short:"BPK สมปก.",   city:"สมุทรปราการ", type:"private_ins",   cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h4", name:"รพ. ราษฎร์บูรณะ",             short:"ราษฎร์บูรณะ", city:"กรุงเทพฯ",    type:"private_ins",   cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h5", name:"รพ. สมิติเวช ศรีนครินทร์",    short:"สมิติเวช",    city:"กรุงเทพฯ",    type:"private_noins", cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h6", name:"รพ. โอเวอร์บรูค เชียงราย",    short:"โอเวอร์บรุ๊ค", city:"เชียงราย",   type:"private_noins", cap:1, psgPrice:5800, cpapOnly:false },
  { id:"h7", name:"รพ. ราชพิพัฒน์",              short:"ราชพิพัฒน์",  city:"กรุงเทพฯ",    type:"government",    cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h8", name:"รพ. กรุงเทพ เชียงราย",         short:"กรุงเทพ ชร.", city:"เชียงราย",    type:"private_ins",   cap:2, psgPrice:5800, cpapOnly:false },
  { id:"h9", name:"รพ. ดีบุก ภูเก็ต",             short:"ดีบุก",       city:"ภูเก็ต",      type:"private_noins", cap:1, psgPrice:5800, cpapOnly:false },
  // รพ. ที่ขาย CPAP อย่างเดียว (ไม่ทำ Sleep Test)
  { id:"hc1", name:"รพ. จุฬาลงกรณ์",              short:"จุฬาฯ",       city:"กรุงเทพฯ",    type:"government",    cap:0, psgPrice:0,    cpapOnly:true  },
  { id:"hc2", name:"รพ. วิภาราม",                 short:"วิภาราม",     city:"กรุงเทพฯ",    type:"private_ins",   cap:0, psgPrice:0,    cpapOnly:true  },
  { id:"hc3", name:"รพ. พญาไท ศรีราชา",           short:"พญาไท ศรช.",  city:"ชลบุรี",      type:"private_ins",   cap:0, psgPrice:0,    cpapOnly:true  },
  { id:"hc4", name:"รพ. กรุงเทพ BHQ",             short:"BHQ",         city:"กรุงเทพฯ",    type:"private_ins",   cap:0, psgPrice:0,    cpapOnly:true  },
];

const INIT_TECHS = [
  { id:"st1", name:"ฐิติชญาน์ วุฒิศรัณย์พร", nick:"ฟิล์ม"   },
  { id:"st2", name:"ธิติพันธ์ หนองสระ",       nick:"ตั้ม"    },
  { id:"st3", name:"ชนภา สังข์ช่วย",          nick:"แอน"    },
  { id:"st4", name:"เบญจพร จิตต์พุทธคุณ",    nick:"ข้าวฟ่าง"},
  { id:"st5", name:"มนัสนันท์ กอมาตย์",       nick:"เอิร์น 1"},
  { id:"st6", name:"พจณิชา มูลทอง",           nick:"เอิร์น 2"},
];

const INIT_USERS = [
  { id:"admin",  name:"3N Admin",              role:"admin",    hospId:null  },
  { id:"tech",   name:"Sleep Tech 3N",          role:"tech",     hospId:null  },
  { id:"sales",  name:"Sales 3N",               role:"sales",    hospId:null  },
  // รพ. Sleep Test + CPAP
  { id:"h1",     name:"รพ. บางปะกอก 8",         role:"hospital", hospId:"h1"  },
  { id:"h4",     name:"รพ. ราษฎร์บูรณะ",        role:"hospital", hospId:"h4"  },
  { id:"h7",     name:"รพ. ราชพิพัฒน์",         role:"hospital", hospId:"h7"  },
  // รพ. CPAP-only (ไม่ทำ Sleep Test)
  { id:"hc1",    name:"รพ. จุฬาลงกรณ์",         role:"hospital", hospId:"hc1" },
  { id:"hc2",    name:"รพ. วิภาราม",             role:"hospital", hospId:"hc2" },
  { id:"hc3",    name:"รพ. พญาไท ศรีราชา",       role:"hospital", hospId:"hc3" },
  { id:"hc4",    name:"รพ. กรุงเทพ BHQ",         role:"hospital", hospId:"hc4" },
];


// ข้อมูล assign Tech เดือนมิถุนายน (ทดสอบ)
const SAMPLE_ASSIGNMENTS = {
  "2026-06-03":  ["st1","st2"],
  "2026-06-05":  ["st2","st3"],
  "2026-06-10":  ["st1","st4"],
  "2026-06-12":  ["st3","st5"],
  "2026-06-17":  ["st1","st6"],
  "2026-06-19":  ["st2","st4"],
  "2026-06-24":  ["st5","st6"],
};
const SAMPLE_CHECKINS = {
  "2026-06-03":  ["st1","st2"],
  "2026-06-05":  ["st2"],
  "2026-06-10":  ["st1","st4"],
  "2026-06-12":  ["st3"],
  "2026-06-17":  ["st1"],
};

const HOSP_TYPE_LABEL = { private_ins:"Private (มีประกัน)", private_noins:"Private (ไม่มีประกัน)", government:"รัฐบาล" };
const CPOOL = [
  { bg:"#dbeafe",text:"#1e40af",dot:"#3b82f6",soft:"#eff6ff" },
  { bg:"#dcfce7",text:"#166534",dot:"#22c55e",soft:"#f0fdf4" },
  { bg:"#fef9c3",text:"#854d0e",dot:"#eab308",soft:"#fefce8" },
  { bg:"#fce7f3",text:"#9d174d",dot:"#ec4899",soft:"#fdf2f8" },
  { bg:"#ede9fe",text:"#5b21b6",dot:"#8b5cf6",soft:"#f5f3ff" },
  { bg:"#ffedd5",text:"#7c2d12",dot:"#f97316",soft:"#fff7ed" },
  { bg:"#cffafe",text:"#155e75",dot:"#06b6d4",soft:"#ecfeff" },
  { bg:"#fef2f2",text:"#991b1b",dot:"#ef4444",soft:"#fef2f2" },
  { bg:"#f0fdf4",text:"#14532d",dot:"#16a34a",soft:"#f0fdf4" },
];
const TPOOL = [
  { bg:"#ede9fe",text:"#5b21b6",dot:"#7c3aed" },
  { bg:"#fce7f3",text:"#9d174d",dot:"#db2777" },
  { bg:"#dbeafe",text:"#1e40af",dot:"#2563eb" },
  { bg:"#dcfce7",text:"#166534",dot:"#16a34a" },
  { bg:"#fef9c3",text:"#854d0e",dot:"#ca8a04" },
  { bg:"#ffedd5",text:"#7c2d12",dot:"#ea580c" },
];

const hc  = (id,arr) => CPOOL[arr.findIndex(h=>h.id===id) % CPOOL.length] || CPOOL[0];
const tc  = (id,arr) => TPOOL[arr.findIndex(t=>t.id===id) % TPOOL.length] || TPOOL[0];
const TM  = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const TMF = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const DAYS= ["อา","จ","อ","พ","พฤ","ศ","ส"];

const fmtDate  = s => { const d=new Date(s); return `${d.getDate()} ${TM[d.getMonth()]} ${d.getFullYear()+543}`; };
const initials = n => n.replace(/^(น\.ส\.|นาย|นาง|ด\.ญ\.|ด\.ช\.)/,"").trim().split(" ").slice(0,2).map(p=>p[0]||"").join("");
const tinit    = n => n.trim().split(" ").map(p=>p[0]||"").join("").slice(0,2);
const mkds     = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const T = {
  blue:"#1d4ed8", blueM:"#2563eb", blueL:"#eff6ff", blueMid:"#bfdbfe",
  navy:"#0c1445", ink:"#1e293b", ink2:"#334155",
  muted:"#64748b", faint:"#94a3b8", ghost:"#cbd5e1",
  line:"rgba(15,23,42,0.08)", lineStrong:"rgba(15,23,42,0.14)",
  card:"var(--color-background-primary)",
  surf:"var(--color-background-secondary)",
  bg:"#f0f4fa",
  red:"#dc2626", redL:"#fee2e2",
  green:"#059669", greenL:"#d1fae5",
  amber:"#d97706", amberL:"#fef9c3",
  purple:"#7c3aed", purpleL:"#ede9fe",
};
const R  = { display:"flex",alignItems:"center" };
const FL = { display:"flex",flexDirection:"column" };

// ── Shared UI ──────────────────────────────────────────────────────────────────
function Avatar({ name, hospId, size=34, hospitals }) {
  const c = hc(hospId,hospitals);
  return <div style={{ width:size,height:size,borderRadius:"50%",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.3,fontWeight:700,color:c.text,flexShrink:0 }}>{initials(name)}</div>;
}
function TAvatar({ tech, techs, size=26 }) {
  if(!tech) return null;
  const c = tc(tech.id,techs);
  return <div style={{ width:size,height:size,borderRadius:"50%",background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,color:c.text,flexShrink:0 }}>{tinit(tech.name)}</div>;
}
function Btn({ children,onClick,disabled,variant="outline",full,small,style:s={} }) {
  const pad=small?"5px 12px":"10px 20px",fs=small?11:13;
  const base={ display:"flex",alignItems:"center",justifyContent:"center",gap:5,cursor:disabled?"not-allowed":"pointer",borderRadius:9,fontWeight:600,fontFamily:"inherit",width:full?"100%":"auto",border:"none",transition:"all .13s",...s };
  const v={
    primary:{ ...base,padding:pad,fontSize:fs,background:disabled?"#cbd5e1":T.blue,color:"#fff",opacity:disabled?.6:1 },
    outline:{ ...base,padding:pad,fontSize:fs,background:T.card,color:T.ink,border:`0.5px solid ${T.line}` },
    green:  { ...base,padding:pad,fontSize:fs,background:T.green,color:"#fff" },
    purple: { ...base,padding:pad,fontSize:fs,background:"#7c3aed",color:"#fff" },
    ghost:  { ...base,padding:pad,fontSize:fs,background:"transparent",color:T.muted },
    danger: { ...base,padding:pad,fontSize:fs,background:T.redL,color:T.red,border:`0.5px solid #fecaca` },
  };
  return <button onClick={onClick} disabled={disabled} style={v[variant]}>{children}</button>;
}

// ── Illustrations ─────────────────────────────────────────────────────────────
const IllustrationSleep = () => (
  <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%",maxWidth:360 }}>
    {/* Moon */}
    <circle cx="320" cy="60" r="36" fill="#1d4ed8" opacity=".15"/>
    <circle cx="334" cy="50" r="28" fill="#f0f4fa"/>
    {/* Stars */}
    {[[60,40],[100,28],[160,52],[200,30],[260,44],[80,80],[140,20]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%3===0?2.5:1.5} fill="#1d4ed8" opacity={.3+i*.05}/>
    ))}
    {/* Bed base */}
    <rect x="40" y="220" width="320" height="60" rx="12" fill="#1d4ed8" opacity=".12"/>
    <rect x="40" y="210" width="320" height="24" rx="8" fill="#1d4ed8" opacity=".18"/>
    {/* Pillows */}
    <rect x="80" y="175" width="90" height="46" rx="14" fill="white" opacity=".95"/>
    <rect x="84" y="179" width="82" height="38" rx="11" fill="#e0e7ff"/>
    <rect x="230" y="175" width="90" height="46" rx="14" fill="white" opacity=".95"/>
    <rect x="234" y="179" width="82" height="38" rx="11" fill="#e0e7ff"/>
    {/* Blanket */}
    <path d="M55 220 Q200 200 345 220 L345 265 Q200 250 55 265 Z" fill="#2563eb" opacity=".22"/>
    <path d="M55 220 Q200 205 345 220" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 4" opacity=".4"/>
    {/* Person sleeping */}
    <ellipse cx="200" cy="200" rx="55" ry="22" fill="#1e3a8a" opacity=".08"/>
    <circle cx="200" cy="178" r="22" fill="#fde68a"/>
    <ellipse cx="200" cy="198" rx="32" ry="16" fill="#1d4ed8" opacity=".7"/>
    {/* Zzz */}
    <text x="240" y="155" fontFamily="Inter,sans-serif" fontSize="18" fontWeight="800" fill="#1d4ed8" opacity=".5">z</text>
    <text x="258" y="138" fontFamily="Inter,sans-serif" fontSize="14" fontWeight="800" fill="#1d4ed8" opacity=".35">z</text>
    <text x="272" y="125" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="800" fill="#1d4ed8" opacity=".25">z</text>
    {/* EKG line */}
    <path d="M30 290 L80 290 L95 265 L110 310 L125 275 L140 290 L370 290" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".25" fill="none"/>
    {/* Decorative circles */}
    <circle cx="360" cy="200" r="50" fill="#1d4ed8" opacity=".04"/>
    <circle cx="40" cy="250" r="35" fill="#2563eb" opacity=".06"/>
  </svg>
);

const IllustrationCalendar = () => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:120,height:100 }}>
    <rect x="8" y="16" width="104" height="76" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
    <rect x="8" y="16" width="104" height="22" rx="10" fill="#2563eb"/>
    <rect x="8" y="27" width="104" height="11" fill="#2563eb"/>
    <circle cx="32" cy="12" r="5" fill="#93c5fd"/>
    <circle cx="88" cy="12" r="5" fill="#93c5fd"/>
    {[0,1,2,3,4,5,6].map(i=><text key={i} x={18+i*14} y={48} fontFamily="Inter" fontSize="7" fill="#64748b" fontWeight="500">{["อา","จ","อ","พ","พฤ","ศ","ส"][i]}</text>)}
    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=>{
      const col=i%7, row=Math.floor(i/7);
      const x=18+col*14, y=60+row*12;
      const isSpecial=[12,13,17,18,22].includes(d);
      return (
        <g key={d}>
          {isSpecial && <circle cx={x+3} cy={y-3} r="6" fill={d===13?"#2563eb":"#bfdbfe"}/>}
          <text x={x} y={y} fontFamily="Inter" fontSize="7" fill={d===13?"white":isSpecial?"#1d4ed8":"#334155"} fontWeight={d===13?"700":"400"}>{d}</text>
        </g>
      );
    })}
  </svg>
);

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel,setSel] = useState(null);
  const desc = r => r==="admin"?"ดู / เพิ่ม / แก้ไข ทุก รพ.":r==="tech"?"ดูทุก รพ. + ยืนยันเวร":"ดู / เพิ่ม เฉพาะ รพ. ตัวเอง";
  const icon = r => r==="admin"?"ti-shield-check":r==="tech"?"ti-stethoscope":"ti-building-hospital";

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:FONT, background:T.bg }}>

      {/* Left hero panel — premium dark gradient, no image */}
      <div style={{ width:"52%", position:"relative", overflow:"hidden", flexShrink:0, background:"linear-gradient(135deg,#060e2e 0%,#0d1f5c 40%,#0f3182 70%,#1a4fcf 100%)" }}>

        {/* Animated glow blobs */}
        <div style={{ position:"absolute", top:-120, right:-80, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.22) 0%,transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-80, left:-60, width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"45%", left:"35%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(96,165,250,.12) 0%,transparent 70%)", pointerEvents:"none" }}/>

        {/* Grid dot pattern */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>

        {/* Content */}
        <div style={{ position:"relative", zIndex:2, padding:"44px 48px", display:"flex", flexDirection:"column", height:"100%" }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:13, background:"rgba(255,255,255,.12)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="28" height="28" viewBox="0 0 200 200"><text x="4" y="135" fontFamily="Arial Black" fontWeight="900" fontSize="110" fill="white">3N</text></svg>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:"white", letterSpacing:"-0.02em" }}>3N Co., Ltd.</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:1 }}>Sleep Healthcare & Respiratory Care</div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", paddingTop:16 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:20, background:"rgba(59,130,246,.25)", border:"1px solid rgba(99,179,247,.35)", marginBottom:24, width:"fit-content" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#60a5fa" }}/>
              <span style={{ fontSize:11, fontWeight:700, color:"#93c5fd", letterSpacing:".07em", textTransform:"uppercase" }}>Smart Sleep Care System</span>
            </div>
            <div style={{ fontSize:40, fontWeight:900, color:"white", lineHeight:1.15, letterSpacing:"-0.035em", marginBottom:12 }}>
              Better Sleep.<br/><span style={{ color:"#60a5fa" }}>Better Life.</span>
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.55)", lineHeight:1.75, fontWeight:300, marginBottom:36 }}>
              ระบบจัดการผู้ป่วย Sleep Test & CPAP<br/>ครบวงจร ตั้งแต่นัดหมาย → ผลออก → ทดลองเครื่อง
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:32, marginBottom:36 }}>
              {[["9+","โรงพยาบาล"],["6","Sleep Tech"],["100%","Digital"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontSize:28, fontWeight:900, color:"white", lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginTop:4, fontWeight:400 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Feature pills */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["PSG Sleep Test","Home Sleep Test","CPAP / BiPAP","After-Sales Care","ResMed Partner"].map(f=>(
                <span key={f} style={{ fontSize:11, padding:"5px 12px", borderRadius:20, background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.7)", fontWeight:500, border:"0.5px solid rgba(255,255,255,.15)" }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Bottom — waveform decoration */}
          <div style={{ marginTop:32 }}>
            <svg viewBox="0 0 400 48" style={{ width:"100%", opacity:.3 }}>
              <path d="M0 24 Q20 8 40 24 Q60 40 80 24 Q100 8 120 24 Q140 40 160 24 Q180 8 200 24 Q220 40 240 24 Q260 8 280 24 Q300 40 320 24 Q340 8 360 24 Q380 40 400 24" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M0 24 Q30 4 60 24 Q90 44 120 24 Q150 4 180 24 Q210 44 240 24 Q270 4 300 24 Q330 44 360 24 Q390 4 400 24" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 8"/>
            </svg>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.2)", textAlign:"center", marginTop:10 }}>www.3nthailand.com</div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 44px", overflowY:"auto", background:"#f8fafc" }}>
        <div style={{ width:"100%", maxWidth:400 }}>

          {/* Header */}
          <div style={{ marginBottom:32 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 12px", borderRadius:20, background:"#eff6ff", border:"1px solid #bfdbfe", marginBottom:16 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:T.blue }}/>
              <span style={{ fontSize:11, fontWeight:700, color:T.blue, letterSpacing:".06em", textTransform:"uppercase" }}>Appointment Management System</span>
            </div>
            <div style={{ fontSize:30, fontWeight:800, color:T.navy, letterSpacing:"-0.03em", marginBottom:8, lineHeight:1.15 }}>ยินดีต้อนรับ</div>
            <div style={{ fontSize:14, color:T.muted }}>เลือกบทบาทเพื่อเข้าใช้งานระบบ</div>
          </div>

          {/* Role cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {INIT_USERS.map(u => {
              const on=sel===u.id;
              return (
                <div key={u.id} onClick={()=>setSel(u.id)} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", border: on?`2px solid ${T.blue}`:`1.5px solid #e2e8f0`, background: on?"#eff6ff":"white", display:"flex", alignItems:"center", gap:14, transition:"all .15s", boxShadow: on?"0 0 0 4px rgba(37,99,235,.08)":"0 1px 3px rgba(0,0,0,.06)" }}>
                  <div style={{ width:44, height:44, borderRadius:13, background:on?T.blue:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                    <i className={`ti ${icon(u.role)}`} style={{ fontSize:20, color:on?"#fff":T.muted }}></i>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:on?T.blue:T.navy, marginBottom:2 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:T.faint }}>{desc(u.role)}</div>
                  </div>
                  <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${on?T.blue:"#cbd5e1"}`, background:on?T.blue:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                    {on && <i className="ti ti-check" style={{ fontSize:11, color:"#fff" }}></i>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login button */}
          <button
            onClick={()=>{ if(sel) onLogin(INIT_USERS.find(u=>u.id===sel)); }}
            disabled={!sel}
            style={{ marginTop:20, width:"100%", padding:"16px", fontSize:16, fontWeight:700, borderRadius:14, background:sel?T.blue:"#e2e8f0", color:sel?"white":"#94a3b8", border:"none", cursor:sel?"pointer":"not-allowed", fontFamily:FONT, transition:"all .15s", display:"flex", alignItems:"center", justifyContent:"center", gap:8, letterSpacing:"0.01em", boxShadow: sel?"0 4px 20px rgba(29,78,216,.35)":"none" }}>
            <i className="ti ti-login" style={{ fontSize:18 }}></i>
            เข้าสู่ระบบ
          </button>

          {/* Trust badges */}
          <div style={{ marginTop:24, display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
            {[["ti-shield-check","100% ปลอดภัย"],["ti-lock","ข้อมูลเป็นความลับ"],["ti-building-hospital","9 โรงพยาบาล"]].map(([ic,lb])=>(
              <div key={lb} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.faint }}>
                <i className={`ti ${ic}`} style={{ fontSize:13, color:"#059669" }}></i>{lb}
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#cbd5e1" }}>
            3N Co., Ltd. · www.3nthailand.com
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Monthly Summary View — MAIN VIEW ─────────────────────────────────────────
const BLOCK_PRESETS = [
  "วันหยุดนักขัตฤกษ์",
  "รพ. ขอปิดห้อง",
  "อุปกรณ์ชำรุด / ซ่อมบำรุง",
  "เจ้าหน้าที่ไม่พร้อม",
  "งดให้บริการชั่วคราว",
  "อื่นๆ",
];

function BlockDayBtn({ dateKey, onBlock }) {
  const [open, setOpen]   = useState(false);
  const [sel,  setSel]    = useState("");
  const [custom, setCustom] = useState("");

  if(!open) return (
    <button onClick={e=>{e.stopPropagation();setOpen(true);}} style={{ flexShrink:0,width:26,height:26,border:"0.5px solid #ddd6fe",borderRadius:7,background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }} title="งดให้บริการวันนี้">
      <i className="ti ti-ban"></i>
    </button>
  );

  const confirm = () => {
    const r = sel==="อื่นๆ" ? custom : sel;
    if(!r.trim()) return;
    onBlock(r.trim()); setOpen(false); setSel(""); setCustom("");
  };

  return (
    <div onClick={e=>e.stopPropagation()} style={{ position:"relative",flexShrink:0 }}>
      <button onClick={()=>setOpen(false)} style={{ width:26,height:26,border:"0.5px solid #a78bfa",borderRadius:7,background:"#ede9fe",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>
        <i className="ti ti-ban"></i>
      </button>
      <div style={{ position:"absolute",right:0,top:30,zIndex:50,width:260,background:"#fff",border:"0.5px solid #ddd6fe",borderRadius:14,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",padding:14,display:"flex",flexDirection:"column",gap:9 }}>
        <div style={{ fontSize:12,fontWeight:700,color:"#5b21b6",...R,gap:6 }}><i className="ti ti-ban" style={{ fontSize:14 }}></i>งดให้บริการวันนี้</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
          {BLOCK_PRESETS.map(p=>(
            <div key={p} onClick={()=>setSel(p)} style={{ padding:"4px 10px",fontSize:11,borderRadius:20,cursor:"pointer",border:sel===p?"1.5px solid #7c3aed":"0.5px solid #ddd6fe",background:sel===p?"#ede9fe":"#f5f3ff",color:sel===p?"#5b21b6":"#7c3aed",fontWeight:sel===p?600:400 }}>{p}</div>
          ))}
        </div>
        {sel==="อื่นๆ" && <input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="ระบุเหตุผล..." style={{ padding:"7px 11px",fontSize:12,border:"0.5px solid #ddd6fe",borderRadius:9,outline:"none",color:"#1e293b" }} />}
        <div style={{ ...R,gap:7 }}>
          <button onClick={confirm} disabled={!sel||(sel==="อื่นๆ"&&!custom.trim())} style={{ padding:"6px 14px",fontSize:12,borderRadius:8,background:sel&&(sel!=="อื่นๆ"||custom.trim())?"#7c3aed":"#e5e7eb",color:sel&&(sel!=="อื่นๆ"||custom.trim())?"#fff":"#9ca3af",border:"none",cursor:"pointer",fontWeight:600,...R,gap:5 }}>
            <i className="ti ti-check" style={{ fontSize:12 }}></i> ยืนยัน
          </button>
          <button onClick={()=>setOpen(false)} style={{ padding:"6px 12px",fontSize:12,borderRadius:8,background:"transparent",border:"0.5px solid #ddd6fe",color:"#7c3aed",cursor:"pointer" }}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
}

function MonthlySummary({ user, appointments, setAppointments, hospitals, techs, assignments, setAssignments, checkins, setCheckins, dayBlocks, setDayBlocks, salesList=[] }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [movingAppt, setMovingAppt] = useState(null); // appt being moved
  const [filterHosp, setFilterHosp] = useState("all");

  const prev = () => month===0 ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1);
  const next = () => month===11? (setMonth(0), setYear(y=>y+1)) : setMonth(m=>m+1);

  // CPAP-only รพ. ไม่แสดงใน Sleep Test schedule
  const cpapOnlyIds = new Set(hospitals.filter(h=>h.cpapOnly).map(h=>h.id));
  const visible = appointments.filter(a =>
    !cpapOnlyIds.has(a.hospId) &&   // ไม่แสดง CPAP-only
    (user.role==="hospital" ? a.hospId===user.hospId : true)
  );
  const daysInMon = new Date(year, month+1, 0).getDate();

  // build day array
  const days = Array.from({ length:daysInMon }, (_,i) => {
    const d   = i+1;
    const key = mkds(year,month,d);
    const appts = visible.filter(a => a.date===key && (filterHosp==="all" || a.hospId===filterHosp));
    const allAppts = visible.filter(a => a.date===key); // for capacity check
    const assigned = assignments[key] || [];
    const checked  = checkins[key]    || [];
    const dow = new Date(year,month,d).getDay();
    const isSun = dow===0;
    const isToday = d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
    const isPast = new Date(year,month,d) < new Date(new Date().toDateString());
    // capacity = max of all hospital caps for appointments that day
    const activeAppts = allAppts.filter(a=>a.status!=="cancelled");
    const cap = activeAppts.length>0 ? activeAppts.reduce((mx,a) => { const h=hospitals.find(x=>x.id===a.hospId); return Math.max(mx, h?.cap||2); }, 0) : (allAppts[0] ? (hospitals.find(x=>x.id===allAppts[0].hospId)?.cap||2) : 2);
    const full = activeAppts.length >= cap;
    const block = dayBlocks[key] || null;
    return { d, key, appts, allAppts, activeAppts, assigned, checked, isSun, isToday, isPast, full, cap, block };
  });

  const moveAppt = (apptId, newDate) => {
    setAppointments(prev => prev.map(a => a.id===apptId ? { ...a, date:newDate } : a));
    setMovingAppt(null);
  };

  const toggleAssign = (key,techId) => {
    setAssignments(prev => { const cur=prev[key]||[]; return { ...prev,[key]:cur.includes(techId)?cur.filter(x=>x!==techId):[...cur,techId] }; });
  };
  const toggleCheckin = (key,techId) => {
    setCheckins(prev => { const cur=prev[key]||[]; return { ...prev,[key]:cur.includes(techId)?cur.filter(x=>x!==techId):[...cur,techId] }; });
  };

  // monthly stats
  const monthAppts  = visible.filter(a=>a.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`) && a.status!=="cancelled");
  const monthCancelled = visible.filter(a=>a.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`) && a.status==="cancelled").length;
  const totalShifts = Object.entries(assignments).filter(([k])=>k.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).reduce((s,[,v])=>s+v.length,0);
  const totalOk     = Object.entries(checkins).filter(([k])=>k.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).reduce((s,[,v])=>s+v.length,0);

  return (
    <div style={{ display:"flex",height:"100%",overflow:"hidden" }}>

      {/* LEFT: day list */}
      <div style={{ flex:1,...FL,overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ padding:"16px 22px",borderBottom:`1px solid ${T.line}`,background:T.card,...R,justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ ...R,gap:14 }}>
            <div style={{ fontSize:22,fontWeight:800,color:T.navy,letterSpacing:"-0.02em" }}>
              {TMF[month]} <span style={{ color:T.faint,fontWeight:400,fontSize:18 }}>{year+543}</span>
            </div>
            <div style={{ ...R,gap:3 }}>
              <button onClick={prev} style={{ width:34,height:34,border:`1px solid ${T.line}`,borderRadius:9,background:T.surf,color:T.muted,cursor:"pointer",fontSize:17,...R,justifyContent:"center" }}>‹</button>
              <button onClick={next} style={{ width:34,height:34,border:`1px solid ${T.line}`,borderRadius:9,background:T.surf,color:T.muted,cursor:"pointer",fontSize:17,...R,justifyContent:"center" }}>›</button>
            </div>
          </div>

          {/* Hospital filter */}
          <div style={{ ...R,gap:5,flexWrap:"wrap" }}>
            {(user.role!=="hospital"
              ? [{id:"all",short:"ทั้งหมด"},...hospitals.filter(h=>!h.cpapOnly)]  // ไม่แสดง CPAP-only
              : hospitals.filter(h=>h.id===user.hospId)
            ).map(h=>{
              const on = filterHosp===h.id;
              const c  = h.id!=="all" ? hc(h.id,hospitals) : null;
              return <div key={h.id} onClick={()=>setFilterHosp(h.id)} style={{ padding:"4px 11px",fontSize:11,borderRadius:20,cursor:"pointer",fontWeight:on?600:400,border:on?`1.5px solid ${c?c.dot:T.blue}`:`0.5px solid ${T.line}`,background:on?(c?c.bg:T.blueL):T.card,color:on?(c?c.text:T.blue):T.muted,transition:"all .1s" }}>{h.short}</div>;
            })}
          </div>
        </div>

        {/* Moving banner */}
        {movingAppt && (
          <div style={{ padding:"10px 18px",background:"#fefce8",borderBottom:`1px solid #fde047`,...R,gap:10,flexShrink:0 }}>
            <i className="ti ti-arrows-move" style={{ fontSize:16,color:"#854d0e" }}></i>
            <div style={{ flex:1,fontSize:12,color:"#854d0e",fontWeight:500 }}>
              กำลังย้าย: <strong>{movingAppt.name}</strong> — กดวันที่ต้องการด้านล่าง
            </div>
            <button onClick={()=>setMovingAppt(null)} style={{ fontSize:11,padding:"4px 10px",borderRadius:8,border:"0.5px solid #fde047",background:"#fff",color:"#854d0e",cursor:"pointer" }}>ยกเลิก</button>
          </div>
        )}

        {/* Day list */}
        <div style={{ flex:1,overflowY:"auto",padding:"12px 16px",...FL,gap:6 }}>
          {days.map(({ d,key,appts,allAppts,activeAppts,assigned,checked,isSun,isToday,isPast,full,cap,block }) => {
            const dow = new Date(year,month,d).getDay();
            const dayLabel = DAYS[dow];
            const isClickable = movingAppt && !isPast;

            return (
              <div key={key}
                onClick={isClickable ? ()=>moveAppt(movingAppt.id, key) : undefined}
                style={{ background: block?"#f5f3ff": isClickable?(full?"#fef2f2":T.blueL):T.card, border: block?`1.5px solid #a78bfa`: isToday?`1.5px solid ${T.blue}`: isClickable?`1.5px dashed ${full?"#ef4444":T.blue}`:`0.5px solid ${T.line}`, borderRadius:14, padding:"12px 14px", cursor:isClickable?"pointer":"default", opacity:isPast&&!isToday?.6:1, transition:"all .1s" }}>

                {/* Row header */}
                <div style={{ ...R,gap:12,marginBottom: (appts.length>0||block)?10:0 }}>
                  <div style={{ width:52,flexShrink:0,textAlign:"center" }}>
                    <div style={{ fontSize:26,fontWeight:800,color:block?"#7c3aed":isToday?T.blue:isSun?"#ef4444":T.navy,lineHeight:1 }}>{d}</div>
                    <div style={{ fontSize:11,color:block?"#7c3aed":isToday?T.blue:isSun?"#ef4444":T.faint,textTransform:"uppercase",fontWeight:600,letterSpacing:".04em",marginTop:2 }}>{dayLabel}</div>
                  </div>

                  {block ? (
                    <div style={{ flex:1,...R,gap:8 }}>
                      <span style={{ fontSize:10,padding:"3px 10px",borderRadius:20,background:"#ede9fe",color:"#5b21b6",fontWeight:600,...R,gap:5 }}>
                        <i className="ti ti-ban" style={{ fontSize:11 }}></i> งดให้บริการ
                      </span>
                      <span style={{ fontSize:11,color:"#7c3aed",flex:1 }}>{block.reason}</span>
                      {user.role==="admin" && <button onClick={e=>{e.stopPropagation();setDayBlocks(p=>{const n={...p};delete n[key];return n;});}} style={{ fontSize:10,padding:"2px 9px",borderRadius:7,border:"0.5px solid #ddd6fe",background:"#fff",color:"#7c3aed",cursor:"pointer" }}>ยกเลิก</button>}
                    </div>
                  ) : (
                    <>
                      <div style={{ flex:1 }}>
                        <div style={{ ...R,justifyContent:"space-between",marginBottom:4 }}>
                          <span style={{ fontSize:12,color:T.muted,fontWeight:500 }}>
                            {activeAppts.length} / {cap} คน
                            {allAppts.length > activeAppts.length && <span style={{ color:"#ef4444",marginLeft:6,fontSize:11 }}>({allAppts.length-activeAppts.length} ยกเลิก)</span>}
                          </span>
                          {full && <span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,background:"#fef2f2",color:"#991b1b",fontWeight:500 }}>เต็ม</span>}
                          {!full && activeAppts.length===0 && !isPast && <span style={{ fontSize:10,color:T.faint }}>ว่าง</span>}
                        </div>
                        <div style={{ height:5,borderRadius:10,background:"#e2e8f0",overflow:"hidden" }}>
                          <div style={{ width:`${Math.min(activeAppts.length/cap*100,100)}%`,height:"100%",borderRadius:10,background:full?"#ef4444":activeAppts.length>0?T.blue:"transparent",transition:"width .3s" }}></div>
                        </div>
                      </div>
                      {assigned.length>0 && (
                        <div style={{ ...R,gap:3,flexShrink:0 }}>
                          {assigned.slice(0,4).map(id=>{ const t=techs.find(x=>x.id===id); if(!t) return null; const ok=checked.includes(id); const ci=techs.findIndex(x=>x.id===id); const c=TPOOL[ci%TPOOL.length]; return (
                            <div key={id} style={{ width:22,height:22,borderRadius:"50%",background:ok?"#dcfce7":c.bg,border:`1.5px solid ${ok?"#86efac":c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:ok?"#166534":c.text }} title={t.name}>{tinit(t.name)}</div>
                          );})}
                        </div>
                      )}
                      {/* Block day button — Admin only, future days */}
                      {user.role==="admin" && !isPast && !movingAppt && (
                        <BlockDayBtn dateKey={key} onBlock={reason=>setDayBlocks(p=>({...p,[key]:{reason}}))} />
                      )}
                    </>
                  )}
                </div>

                {/* Appointment rows — hide if blocked */}
                {!block && appts.map((a, idx) => {
                  const c = hc(a.hospId, hospitals);
                  const h = hospitals.find(x=>x.id===a.hospId);
                  const canEdit = user.role==="admin" || (user.role==="hospital" && a.hospId===user.hospId);
                  const isCancelled = a.status==="cancelled";
                  // ตรวจว่า HN เดิมนัดซ้ำในวันเดียวกัน
                  const isDuplicate = !isCancelled && appts.some((b,bi)=>bi!==idx && b.hn===a.hn && b.status!=="cancelled");
                  // ตรวจว่ามี cpap_trial อยู่แล้วสำหรับ HN นี้ (ทั้งวันอื่นด้วย)
                  const hasCpapBooked = appointments.some(x=>x.hn===a.hn&&x.apptType==="cpap_trial"&&x.status!=="cancelled");
                  return (
                    <ApptCard
                      key={a.id}
                      appt={a}
                      hosp={h}
                      color={c}
                      hospitals={hospitals}
                      canEdit={canEdit}
                      isAdmin={user.role==="admin"}
                      movingAppt={movingAppt}
                      isCancelled={isCancelled}
                      isDuplicate={isDuplicate}
                      hasCpapBooked={hasCpapBooked}
                      onStartMove={()=>setMovingAppt(a)}
                      onUpdate={updated=>setAppointments(prev=>prev.map(x=>x.id===a.id?{...x,...updated}:x))}
                      onDelete={()=>setAppointments(prev=>prev.filter(x=>x.id!==a.id))}
                      onBookCpap={src=>{
                        // ป้องกัน duplicate
                        const exists=appointments.some(x=>x.hn===src.hn&&x.apptType==="cpap_trial"&&x.status!=="cancelled");
                        if(exists){ alert(`ผู้ป่วย ${src.name} มีนัดทดลอง CPAP อยู่แล้วในระบบ`); return; }
                        // เพิ่ม cpap_trial พร้อม 2 trial slots เริ่มต้น
                        setAppointments(prev=>[...prev,{
                          id:"cpap"+Date.now(), hn:src.hn, name:src.name, phone:src.phone,
                          hospId:src.hospId, date:src.date, note:"[ต่อเนื่องจาก Sleep Test]",
                          status:"active", apptType:"cpap_trial", journeyStatus:"scheduled",
                          cpapDecision:"trial",
                          cpapTrials:[
                            {id:"tr1"+Date.now(),model:"",trialDate:src.date,returnDate:"",serialNo:"",dn:"",maskModel:"",maskOther:"",maskSize:"",note:""},
                            {id:"tr2"+Date.now(),model:"",trialDate:src.date,returnDate:"",serialNo:"",dn:"",maskModel:"",maskOther:"",maskSize:"",note:""},
                          ],
                          cancelReason:"", cancelledAt:null
                        }]);
                      }}
                      salesList={salesList}
                    />
                  );
                })}

                {/* Add appointment inline — admin + hospital, not blocked, not past */}
                {!block && !movingAppt && (user.role==="admin" || user.role==="hospital") && (
                  <AddApptInline
                    dateKey={key}
                    hospitals={hospitals}
                    defaultHospId={user.hospId || hospitals[0]?.id}
                    isAdmin={user.role==="admin"}
                    isFull={full}
                    onAdd={appt=>setAppointments(prev=>[...prev, appt])}
                  />
                )}

                {/* Assign tech row — hide if blocked */}
                {!block && (user.role!=="hospital") && (assigned.length>0||appts.length>0) && (
                  <AssignRow key={key} dateKey={key} techs={techs} assigned={assigned} checked={checked} canEdit={user.role==="admin"} canCheckin={user.role==="admin"} onToggleAssign={id=>toggleAssign(key,id)} onToggleCheckin={id=>toggleCheckin(key,id)} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: stats panel */}
      <div style={{ width:272,...FL,flexShrink:0,borderLeft:`1px solid ${T.line}`,background:T.card,overflowY:"auto" }}>

        {/* ── Deadline Alerts (Admin only) ── */}
        {user.role==="admin" && (() => {
          const alerts = appointments
            .map(a=>({ ...a, dl:calcDeadline(a) }))
            .filter(a=>a.dl && (a.dl.isUrgent||a.dl.isOverdue))
            .sort((a,b)=>a.dl.remaining-b.dl.remaining);
          if(!alerts.length) return null;
          return (
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.line}`, background:"#fff7ed" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#c2410c",display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
                <i className="ti ti-bell-ringing" style={{ fontSize:14 }}></i>
                ใกล้ครบกำหนดออกผล ({alerts.length} ราย)
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {alerts.slice(0,5).map(a=>{
                  const h=hospitals.find(x=>x.id===a.hospId);
                  const col=a.dl.isOverdue?"#dc2626":"#c2410c";
                  const bg=a.dl.isOverdue?"#fee2e2":"#fef9c3";
                  return (
                    <div key={a.id} style={{ padding:"8px 10px",background:bg,borderRadius:9,border:`1px solid ${col}30` }}>
                      <div style={{ fontSize:12,fontWeight:700,color:col }}>{a.name}</div>
                      <div style={{ fontSize:10,color:col,opacity:.8,marginTop:2 }}>HN {a.hn} · {h?.short}</div>
                      <div style={{ fontSize:10,fontWeight:700,color:col,marginTop:3,display:"flex",alignItems:"center",gap:4 }}>
                        <i className="ti ti-clock" style={{ fontSize:11 }}></i>
                        {a.dl.isOverdue
                          ? `เกินกำหนด ${Math.abs(a.dl.remaining)} วัน!`
                          : `เหลือ ${a.dl.remaining} วัน (${a.dl.days} วัน)`
                        }
                      </div>
                    </div>
                  );
                })}
                {alerts.length>5 && <div style={{ fontSize:10,color:"#c2410c",textAlign:"center" }}>และอีก {alerts.length-5} ราย...</div>}
              </div>
            </div>
          );
        })()}

        {/* Month stats */}
        <div style={{ padding:"20px 18px 16px",borderBottom:`1px solid ${T.line}` }}>
          <div style={{ fontSize:12,color:T.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:14 }}>สรุป {TMF[month]} {year+543}</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
            {[
              ["ti-users","นัดหมาย",monthAppts.length,T.blue,"#dbeafe"],
              ["ti-clock","เวรรวม",totalShifts,T.purple,T.purpleL],
              ["ti-check-circle","ยืนยันแล้ว",totalOk,T.green,T.greenL],
              ["ti-x","ยกเลิก",monthCancelled,T.red,T.redL],
            ].map(([ic,lb,val,col,bg])=>(
              <div key={lb} style={{ padding:"14px 13px",background:bg,borderRadius:14,border:`0.5px solid ${T.line}` }}>
                <i className={`ti ${ic}`} style={{ fontSize:18,color:col }}></i>
                <div style={{ fontSize:26,fontWeight:800,color:col,marginTop:6,lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:11,color:col,opacity:.75,marginTop:3,fontWeight:500 }}>{lb}</div>
              </div>
            ))}
          </div>

          {/* EKG mini illustration */}
          <svg viewBox="0 0 236 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%",marginBottom:14 }}>
            <path d="M0 20 L40 20 L52 8 L64 32 L76 14 L88 20 L128 20 L140 8 L152 32 L164 14 L176 20 L236 20" stroke={T.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".3" fill="none"/>
            <circle cx="64" cy="32" r="3" fill={T.blue} opacity=".4"/>
            <circle cx="152" cy="32" r="3" fill={T.blue} opacity=".4"/>
          </svg>

          {/* Per-hospital breakdown */}
          <div style={{ fontSize:12,color:T.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10 }}>แยกตาม รพ.</div>
          {hospitals.map(h=>{
            if(user.role==="hospital"&&h.id!==user.hospId) return null;
            const cnt=monthAppts.filter(a=>a.hospId===h.id).length;
            if(!cnt) return null;
            const c=hc(h.id,hospitals);
            return (
              <div key={h.id} style={{ ...R,justifyContent:"space-between",marginBottom:9 }}>
                <div style={{ ...R,gap:8 }}>
                  <span style={{ width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0 }}></span>
                  <div>
                    <div style={{ fontSize:13,color:T.ink,fontWeight:600 }}>{h.short}</div>
                    {h.cap===1&&<div style={{ fontSize:10,color:T.faint }}>cap 1/วัน</div>}
                  </div>
                </div>
                <span style={{ fontSize:14,fontWeight:800,color:T.ink }}>{cnt}</span>
              </div>
            );
          })}
        </div>

        {/* Per-tech shift summary */}
        {user.role!=="hospital" && (
          <div style={{ padding:"18px 18px" }}>
            <div style={{ fontSize:12,color:T.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:14 }}>Sleep Tech เดือนนี้</div>
            {techs.map((t,i)=>{
              const c=TPOOL[i%TPOOL.length];
              const pfx=`${year}-${String(month+1).padStart(2,"0")}`;
              const myA=Object.entries(assignments).filter(([k,v])=>k.startsWith(pfx)&&v.includes(t.id)).length;
              const myC=Object.entries(checkins).filter(([k,v])=>k.startsWith(pfx)&&v.includes(t.id)).length;
              const pct=myA>0?Math.round(myC/myA*100):0;
              const myDays=Object.entries(assignments).filter(([k,v])=>k.startsWith(pfx)&&v.includes(t.id)).map(([k])=>k).sort();
              return (
                <div key={t.id} style={{ marginBottom:12,padding:"12px 14px",background:T.surf,borderRadius:12,border:`0.5px solid ${T.line}` }}>
                  <div style={{ ...R,gap:10,marginBottom:6 }}>
                    <TAvatar tech={t} techs={techs} size={36} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:T.ink }}>{t.name}</div>
                      <div style={{ fontSize:11,color:T.faint,marginTop:1 }}>{myC}/{myA} เวร ยืนยันแล้ว</div>
                    </div>
                    <span style={{ fontSize:13,fontWeight:800,color:pct===100&&myA>0?T.green:pct>0?T.amber:T.faint }}>{myA>0?`${pct}%`:"—"}</span>
                  </div>
                  {myA>0&&<div style={{ height:4,borderRadius:10,background:"#e2e8f0",overflow:"hidden",marginBottom:8 }}><div style={{ width:`${pct}%`,height:"100%",background:pct===100?T.green:T.purple,borderRadius:10,transition:"width .3s" }}></div></div>}
                  {/* วันทำงาน + รพ. */}
                  {myDays.length>0&&(
                    <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                      {myDays.map(k=>{
                        const day=new Date(k).getDate();
                        const dayAppts=appointments.filter(a=>a.date===k&&a.status!=="cancelled");
                        const hospShorts=[...new Set(dayAppts.map(a=>hospitals.find(h=>h.id===a.hospId)?.short||"").filter(Boolean))];
                        const ok=(checkins[k]||[]).includes(t.id);
                        return (
                          <div key={k} title={hospShorts.join(", ")} style={{ fontSize:10,padding:"3px 8px",borderRadius:8,background:ok?"#dcfce7":c.bg,color:ok?"#166534":c.text,border:`0.5px solid ${ok?"#86efac":c.dot}`,display:"flex",alignItems:"center",gap:4 }}>
                            <span style={{ fontWeight:700 }}>{day}</span>
                            {hospShorts.length>0&&<span style={{ opacity:.8 }}>{hospShorts[0]}{hospShorts.length>1&&` +${hospShorts.length-1}`}</span>}
                            {ok&&<i className="ti ti-check" style={{ fontSize:9 }}></i>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Appointment Inline ────────────────────────────────────────────────────
function AddApptInline({ dateKey, hospitals, defaultHospId, isAdmin, isFull, onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:"", hn:"", phone:"", hospId:defaultHospId||"", note:"", apptType:"sleep_test", sleepTestType:"full_night", paymentType:"" });
  const [err,  setErr]  = useState("");

  const save = () => {
    if(!form.name.trim()) { setErr("กรุณากรอกชื่อผู้ป่วย"); return; }
    if(!form.hn.trim())   { setErr("กรุณากรอก HN"); return; }
    if(!form.hospId)      { setErr("กรุณาเลือก รพ."); return; }
    if(isFull && !isAdmin) { setErr("ห้องเต็มแล้ว ไม่สามารถเพิ่มนัดได้ (เกิน capacity)"); return; }
    onAdd({ id:"m"+Date.now(), ...form, name:form.name.trim(), hn:form.hn.trim(), phone:form.phone.trim(), date:dateKey, status:"active", apptType:form.apptType||"sleep_test", sleepTestType:form.apptType==="sleep_test"?(form.sleepTestType||"full_night"):"", paymentType:form.paymentType||"", journeyStatus:"scheduled", cancelReason:"", cancelledAt:null });
    setForm({ name:"", hn:"", phone:"", hospId:defaultHospId||"", note:"", apptType:"sleep_test", sleepTestType:"full_night", paymentType:"" });
    setErr(""); setOpen(false);
  };

  if(!open) return (
    <>
      {(!isFull || isAdmin) && (
        <button
          onClick={e=>{ e.stopPropagation(); setOpen(true); setForm(f=>({...f,hospId:defaultHospId||hospitals[0]?.id||""})); }}
          style={{ width:"100%", marginTop:6, padding:"9px 14px", borderRadius:10, border:`1.5px dashed ${isFull?"#fca5a5":T.blueMid}`, background:isFull?"#fff5f5":"transparent", color:isFull?T.red:T.blue, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <i className={`ti ${isFull?"ti-alert-triangle":"ti-user-plus"}`} style={{ fontSize:14 }}></i>
          {isFull ? "⚠ Admin: เพิ่มนัดเกิน capacity (ห้องเต็มแล้ว)" : "+ เพิ่มนัดหมาย"}
        </button>
      )}
    </>
  );

  return (
    <div onClick={e=>e.stopPropagation()} style={{ marginTop:8, borderRadius:14, border:`1.5px solid ${T.blue}`, background:"#f8faff", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"12px 16px 10px", background:T.blue, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <i className="ti ti-user-plus" style={{ fontSize:16, color:"white" }}></i>
          <span style={{ fontSize:14, fontWeight:700, color:"white", fontFamily:FONT }}>เพิ่มนัดหมาย — {fmtDate(dateKey)}</span>
        </div>
        <button onClick={()=>{ setOpen(false); setErr(""); }} style={{ width:26, height:26, border:"none", background:"rgba(255,255,255,.2)", borderRadius:7, color:"white", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>

      {/* Form */}
      <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {/* Name — full width */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:".04em" }}>ชื่อ-นามสกุล *</label>
            <input
              value={form.name}
              onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="เช่น น.ส.ดวงดี ดวงใจ"
              autoFocus
              style={{ width:"100%", padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=T.blue}
              onBlur={e=>e.target.style.borderColor=T.line}
            />
          </div>
          {/* HN */}
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:".04em" }}>HN *</label>
            <input
              value={form.hn}
              onChange={e=>setForm(f=>({...f,hn:e.target.value}))}
              placeholder="เช่น 12345678"
              style={{ width:"100%", padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=T.blue}
              onBlur={e=>e.target.style.borderColor=T.line}
            />
          </div>
          {/* Phone */}
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:".04em" }}>เบอร์โทร</label>
            <input
              value={form.phone}
              onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
              placeholder="เช่น 081-234-5678"
              style={{ width:"100%", padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=T.blue}
              onBlur={e=>e.target.style.borderColor=T.line}
            />
          </div>
          {/* Hospital */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:".04em" }}>โรงพยาบาล *</label>
            {isAdmin ? (
              <select
                value={form.hospId}
                onChange={e=>setForm(f=>({...f,hospId:e.target.value}))}
                style={{ width:"100%", padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box" }}>
                <option value="">— เลือก รพ. —</option>
                {hospitals.map(h=><option key={h.id} value={h.id}>{h.name} (cap {h.cap}/วัน)</option>)}
              </select>
            ) : (
              <div style={{ padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.blueMid}`, borderRadius:10, background:"#eff6ff", color:T.blue, fontWeight:600 }}>
                {hospitals.find(h=>h.id===form.hospId)?.name || "—"}
              </div>
            )}
          </div>
          {/* Appt type */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>ประเภทนัดหมาย *</label>
            <div style={{ display:"flex", gap:8 }}>
              {[["sleep_test","Sleep Test","ti-activity","#1e40af","#dbeafe"],["cpap_trial","ทดลอง CPAP","ti-device-heart-monitor","#5b21b6","#ede9fe"]].map(([val,lb,ic,col,bg])=>(
                <div key={val} onClick={()=>setForm(f=>({...f,apptType:val}))}
                  style={{ flex:1, padding:"10px 12px", borderRadius:11, cursor:"pointer", border: form.apptType===val?`2px solid ${col}`:`1px solid ${T.line}`, background:form.apptType===val?bg:"white", display:"flex", alignItems:"center", gap:8, transition:"all .15s" }}>
                  <i className={`ti ${ic}`} style={{ fontSize:18, color:col }}></i>
                  <span style={{ fontSize:13, fontWeight:form.apptType===val?700:400, color:form.apptType===val?col:T.muted }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Sleep Test Type — แสดงเฉพาะ Sleep Test */}
          {form.apptType==="sleep_test" && (
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>ประเภทการตรวจ</label>
              <div style={{ display:"flex", gap:8 }}>
                {[["full_night","Full Night","ti-moon","#1e40af","#dbeafe"],["split_night","Split Night","ti-moon-half","#7c3aed","#ede9fe"]].map(([val,lb,ic,col,bg])=>(
                  <div key={val} onClick={()=>setForm(f=>({...f,sleepTestType:val}))}
                    style={{ flex:1, padding:"9px 12px", borderRadius:10, cursor:"pointer", border: form.sleepTestType===val?`2px solid ${col}`:`1px solid ${T.line}`, background:form.sleepTestType===val?bg:"white", display:"flex", alignItems:"center", gap:8, transition:"all .15s" }}>
                    <i className={`ti ${ic}`} style={{ fontSize:16, color:col }}></i>
                    <div>
                      <div style={{ fontSize:12, fontWeight:form.sleepTestType===val?700:400, color:form.sleepTestType===val?col:T.muted }}>{lb}</div>
                      <div style={{ fontSize:10, color:col, opacity:.7 }}>{val==="full_night"?"ทั้งคืน (≥6 ชม.)":"ครึ่งคืน (Dx+Tx)"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Payment type / สิทธิ์ */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>สิทธิ์การรักษา</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
              {PAYMENT_TYPES.map(pt=>{
                const on = form.paymentType===pt.key;
                return (
                  <div key={pt.key} onClick={()=>setForm(f=>({...f,paymentType:on?"":pt.key}))}
                    style={{ padding:"7px 10px", borderRadius:9, cursor:"pointer", border:on?`1.5px solid ${pt.color}`:`0.5px solid ${T.line}`, background:on?pt.bg:"white", display:"flex", alignItems:"center", gap:6, transition:"all .12s" }}>
                    {pt.fastResult && <i className="ti ti-bolt" style={{ fontSize:11, color:pt.color, flexShrink:0 }}></i>}
                    <span style={{ fontSize:11, fontWeight:on?700:400, color:on?pt.color:T.muted, lineHeight:1.3 }}>{pt.label}</span>
                  </div>
                );
              })}
            </div>
            {form.paymentType && PAYMENT_TYPES.find(p=>p.key===form.paymentType)?.fastResult && (
              <div style={{ marginTop:6, padding:"6px 11px", background:"#fef9c3", borderRadius:8, fontSize:11, color:"#92400e", display:"flex", alignItems:"center", gap:6 }}>
                <i className="ti ti-bolt" style={{ fontSize:12 }}></i>
                สิทธิ์นี้ผลออกภายใน 14 วัน
              </div>
            )}
          </div>
          {/* Note */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:".04em" }}>หมายเหตุ</label>
            <input
              value={form.note}
              onChange={e=>setForm(f=>({...f,note:e.target.value}))}
              placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
              style={{ width:"100%", padding:"10px 13px", fontSize:14, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=T.blue}
              onBlur={e=>e.target.style.borderColor=T.line}
            />
          </div>
        </div>

        {err && (
          <div style={{ padding:"9px 13px", background:T.redL, border:`0.5px solid #fecaca`, borderRadius:9, fontSize:13, color:T.red, display:"flex", alignItems:"center", gap:7 }}>
            <i className="ti ti-alert-circle" style={{ fontSize:15 }}></i>{err}
          </div>
        )}

        <div style={{ display:"flex", gap:9, marginTop:2 }}>
          <button onClick={save} style={{ flex:1, padding:"12px", fontSize:14, fontWeight:700, borderRadius:11, background:T.blue, color:"white", border:"none", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <i className="ti ti-calendar-plus" style={{ fontSize:16 }}></i> บันทึกนัดหมาย
          </button>
          <button onClick={()=>{ setOpen(false); setErr(""); }} style={{ padding:"12px 18px", fontSize:13, fontWeight:600, borderRadius:11, background:"transparent", color:T.muted, border:`1.5px solid ${T.line}`, cursor:"pointer", fontFamily:FONT }}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Excel Export ──────────────────────────────────────────────────────────────
// ── Tech Pay Rates ─────────────────────────────────────────────────────────────
const DEFAULT_RATE = { rate1:675, rate2:607.5, scoreRate:350 };
// rate1 = ค่าติด 1 case/วัน, rate2 = ค่าติด 2+ case/วัน, scoreRate = ค่า score/อ่านผล

const INIT_SALES = [
  "สิทธินนท์ บุญแทน",
  "กรรณิกา ศรีลาพัฒน์",
  "ชญานิศ พอจิต",
  "ปานิดา จันติบุตร",
  "พรรณพัชร ถิ่นถา",
  "ปภพ ปัญญาศรีวินิจ",
  "ฐิตาภัสร์ วุฒิศรัณย์พร",
];

const CPAP_MODELS = [
  "ResMed AirSense 10 AutoSet",
  "ResMed AirSense 11 AutoSet",
  "ResMed AirMini",
  "ResMed AirCurve 10 VAuto (BiPAP)",
  "ResMed AirCurve 10 S (BiPAP)",
  "Hindmed Auto CPAP",
  "Hindmed BiPAP",
  "VentMed Auto CPAP",
  "อื่นๆ",
];

const MASK_MODELS = [
  "ResMed AirFit F20 (Full Face)",
  "ResMed AirFit F30i (Full Face)",
  "ResMed AirFit N20 (Nasal)",
  "ResMed AirFit N30i (Nasal)",
  "ResMed AirFit P10 (Nasal Pillow)",
  "ResMed AirTouch F20 (Full Face Memory Foam)",
  "Hingmed Nasal Mask Size M",
  "Hingmed Nasal Mask Size L",
  "Hingmed Full Face Mask Size M",
  "Hingmed Full Face Mask Size L",
  "อื่นๆ (พิมพ์เอง)",
];

const MASK_SIZES = ["XS","S","M","L","XL","SW (Small-Wide)","MW (Medium-Wide)"];

// ── สิทธิ์การรักษา ────────────────────────────────────────────────────────────
const PAYMENT_TYPES = [
  { key:"social_security",  label:"สิทธิ์ประกันสังคม",    short:"ปสส.",       color:"#1e40af", bg:"#dbeafe",  fastResult:false },
  { key:"health_insurance", label:"สิทธิ์ประกันสุขภาพ",   short:"ประกัน",     color:"#065f46", bg:"#d1fae5",  fastResult:false },
  { key:"direct_billing",   label:"สิทธิ์เบิกจ่ายตรง",    short:"เบิกตรง",   color:"#7c3aed", bg:"#ede9fe",  fastResult:false },
  { key:"civil_servant",    label:"สิทธิ์เบิก-กรมบัญชีกลาง", short:"กรมบัญชี", color:"#0e7490", bg:"#cffafe",  fastResult:false },
  { key:"vip",              label:"VIP",                   short:"VIP",        color:"#b45309", bg:"#fef9c3",  fastResult:true  },
  { key:"self_pay",         label:"เงินสด (Self Pay)",     short:"เงินสด",    color:"#059669", bg:"#d1fae5",  fastResult:true  },
  { key:"state_enterprise", label:"รัฐวิสาหกิจ",            short:"รัฐวิสา",   color:"#0369a1", bg:"#e0f2fe",  fastResult:false },
];
// VIP + Self Pay → ผลออกภายใน 14 วัน

// ── ระยะเวลาผลออก & การแจ้งเตือน ────────────────────────────────────────────
const RESULT_DAYS = (paymentType) => {
  const pt = PAYMENT_TYPES.find(p=>p.key===paymentType);
  return pt?.fastResult ? 14 : 30;
};

function calcDeadline(appt) {
  // ใช้วันนัด + จำนวนวันตาม paymentType
  if(!appt.date || appt.status==="cancelled") return null;
  // เฉพาะ sleep_test ที่ยังไม่ออกผล
  if(appt.apptType!=="sleep_test") return null;
  if(["result_ready","consulted"].includes(appt.journeyStatus)) return null;
  const testDate  = new Date(appt.date);
  const days      = RESULT_DAYS(appt.paymentType);
  const deadline  = new Date(testDate.getTime() + days*864e5);
  const today     = new Date();
  const remaining = Math.ceil((deadline - today)/864e5);
  return { deadline, days, remaining, isUrgent: remaining<=5, isOverdue: remaining<0 };
}

// ── สถานะใบแจ้งหนี้ CPAP ─────────────────────────────────────────────────────
const BILLING_STATUS = [
  { key:"pending", label:"ยังไม่วางบิล", color:T.amber, bg:"#fef9c3" },
  { key:"billed",  label:"วางบิลแล้ว",   color:"#1e40af", bg:"#dbeafe" },
  { key:"paid",    label:"รับเงินแล้ว",   color:"#059669", bg:"#d1fae5" },
];

// ── Comprehensive Excel Export ─────────────────────────────────────────────────
function exportToExcel(appts, hospitals, techs, assignments, checkins, techRates) {
  const JOURNEY_LABEL = {
    scheduled:"รอตรวจ", tested:"ตรวจแล้ว", waiting_result:"รอแพทย์อ่านผล",
    result_ready:"ผลออกแล้ว", consulted:"ฟังผลแล้ว",
    trialed:"ทดลองแล้ว", received_device:"รับเครื่องแล้ว",
  };
  const AHI_LABEL = {
    normal:"Normal (AHI < 5)", mild:"Mild (AHI 5–14)",
    mild_comorbid:"Mild with HTN/CAD/Stroke", moderate:"Moderate (AHI 15–29)", severe:"Severe (AHI ≥ 30)",
  };

  const header = [
    // ข้อมูลผู้ป่วย
    "HN","ชื่อ-นามสกุล","เบอร์โทร","วันนัดหมาย","เดือน","ปี",
    "โรงพยาบาล","จังหวัด","ประเภทนัด","Journey Status","สถานะนัด","เหตุผลยกเลิก",
    // Sleep Test
    "AHI รวม","AHI Level","SpO2 Min (%)","SpO2 Mean (%)","Time < 90% (นาที)",
    "Total Sleep Time (นาที)","Sleep Efficiency (%)","Diagnosis","คำแนะนำ",
    // CPAP Trial
    "รุ่นทดลองที่ 1","วันทดลองที่ 1",
    "รุ่นทดลองที่ 2","วันทดลองที่ 2",
    "รุ่นทดลองที่ 3","วันทดลองที่ 3",
    "ตัดสินใจ",
    // ซื้อ
    "รุ่นที่ซื้อ","วันที่ซื้อ","ซื้อโดยไม่ทดลอง",
    // Tech & Pay
    "Sleep Tech","ค่าติด (บาท)","ค่า Score (บาท)","รวม (บาท)",
    "หมายเหตุ",
  ];

  const rows = appts.map(a=>{
    const h    = hospitals.find(x=>x.id===a.hospId);
    const d    = new Date(a.date);
    const rep  = a.sleepReport || {};
    const trials = a.cpapTrials || [];

    // หา tech ที่ assigned วันนั้น
    const dayTechs = (assignments[a.date]||[]).map(tid=>techs.find(t=>t.id===tid)).filter(Boolean);
    const techNames = dayTechs.map(t=>t.name).join(", ");

    // คำนวณค่าตอบแทน tech
    const dayApptCount = appts.filter(x=>x.date===a.date && x.hospId===a.hospId && x.status!=="cancelled").length;
    let pay = 0;
    if(dayTechs.length>0){
      const r = (techRates||{})[dayTechs[0]?.id] || DEFAULT_RATE;
      pay = dayApptCount>=2 ? r.rate2 : r.rate1;
    }
    const scorePay = rep.ahi ? (((techRates||{})[dayTechs[0]?.id] || DEFAULT_RATE).scoreRate) : 0;

    // CPAP decision label
    const decisionLabel = {
      not_decided:"ยังไม่ตัดสินใจ", trial:"ทดลองเครื่อง",
      purchased_after_trial:"ซื้อหลังทดลอง", purchase_direct:"ซื้อโดยไม่ทดลอง",
    }[a.cpapDecision||"not_decided"]||"";

    return [
      a.hn, a.name, a.phone||"",
      a.date, d.getMonth()+1, d.getFullYear()+543,
      h?.name||"", h?.city||"",
      a.apptType==="cpap_trial"?"ทดลอง CPAP":"Sleep Test",
      JOURNEY_LABEL[a.journeyStatus||"scheduled"]||"",
      a.status==="cancelled"?"ยกเลิก":"ปกติ",
      a.cancelReason||"",
      // Sleep Test
      rep.ahi||"", AHI_LABEL[rep.ahiLevel]||"",
      rep.spo2Min||"", rep.spo2Mean||"", rep.timeBelow90||"",
      rep.totalSleepTime||"", rep.sleepEfficiency||"",
      rep.diagnosis||"", (rep.recommendation||[]).join("; "),
      // Trials
      trials[0]?.model||"", trials[0]?.trialDate||"",
      trials[1]?.model||"", trials[1]?.trialDate||"",
      trials[2]?.model||"", trials[2]?.trialDate||"",
      decisionLabel,
      // Purchase
      a.cpapPurchase?.model||"", a.cpapPurchase?.purchaseDate||"",
      a.cpapDecision==="purchase_direct"?"ใช่":"",
      // Tech & Pay
      techNames,
      dayApptCount>0 ? pay : "",
      rep.ahi ? scorePay : "",
      dayApptCount>0 ? (pay + (rep.ahi?scorePay:0)) : "",
      a.note||"",
    ];
  });

  const lines = [header,...rows];
  exportToXLS(lines[0], lines.slice(1), `3n-data-${new Date().toISOString().slice(0,10)}`);
}

// ── Sleep Report Modal ────────────────────────────────────────────────────────
const AHI_LEVELS = [
  { key:"normal",        label:"Normal",                        desc:"Less than 5 events per hour",                    color:"#059669", bg:"#d1fae5", range:"AHI < 5"   },
  { key:"mild",          label:"Mild Sleep Apnea",              desc:"5 to 14 events per hour",                        color:"#d97706", bg:"#fef9c3", range:"AHI 5–14"  },
  { key:"mild_comorbid", label:"Mild Sleep Apnea with HTN, CAD, Stroke", desc:"5 to 14 events per hour with comorbidities", color:"#ea580c", bg:"#ffedd5", range:"AHI 5–14"  },
  { key:"moderate",      label:"Moderate Sleep Apnea",          desc:"15 to 29 events per hour",                       color:"#dc2626", bg:"#fee2e2", range:"AHI 15–29" },
  { key:"severe",        label:"Severe Sleep Apnea",            desc:"30 or more events per hour",                     color:"#7c3aed", bg:"#ede9fe", range:"AHI ≥ 30"  },
];
const POSITIONS = ["Supine","Non-supine","ทุกท่า"];
const RECOMMENDATIONS = [
  "แนะนำ CPAP Therapy","แนะนำ BiPAP Therapy","แนะนำปรับพฤติกรรม",
  "แนะนำลดน้ำหนัก","แนะนำผ่าตัด","ไม่จำเป็นต้องรักษา","ติดตามอาการ",
];

// ── รายชื่อแพทย์อ่านผล ───────────────────────────────────────────────────────
const DOCTORS = [
  { name:"Sippanont Samchai, M.D.",       license:"ว. 27147" },
  { name:"Vipada Tirachaimongkol, M.D.",  license:"ว. 55648" },
  { name:"Sasikarn Poomkonsarn, M.D.",    license:"ว. 39115" },
  { name:"Phurin Sujirakul, M.D.",        license:"ว. 37354" },
];

const BLANK_REPORT = {
  ahiLevel:"", ahi:"", doctorName:"", notes:"",
  pdfFileName:"", pdfDataUrl:"", sharedWithHosps:[],
};

// ── Sleep Report Modal — Admin fills AHI + PDF, Hospital sees AHI + opens PDF ─
function SleepReportModal({ appt, hosp, hospitals=[], onClose, onSave }) {
  const saved = appt.sleepReport || {};
  const [ahiLevel,        setAhiLevel]        = useState(saved.ahiLevel        || "");
  const [ahi,             setAhi]              = useState(saved.ahi             || "");
  const [doctorName,      setDoctorName]       = useState(saved.doctorName      || "");
  const [notes,           setNotes]            = useState(saved.notes           || "");
  const [pdfFileName,     setPdfFileName]      = useState(saved.pdfFileName     || "");
  const [pdfDataUrl,      setPdfDataUrl]       = useState(saved.pdfDataUrl      || "");
  const [sharedWithHosps, setSharedWithHosps]  = useState(saved.sharedWithHosps|| []);
  const [pdfLoading,      setPdfLoading]       = useState(false);
  const [pdfError,        setPdfError]         = useState("");

  const toggleHosp = id => setSharedWithHosps(p =>
    p.includes(id) ? p.filter(x=>x!==id) : [...p, id]
  );

  const handlePdfUpload = e => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(file.type !== "application/pdf") { setPdfError("กรุณาเลือกไฟล์ .pdf เท่านั้น"); return; }
    setPdfLoading(true); setPdfError("");
    const reader = new FileReader();
    reader.onload = ev => { setPdfDataUrl(ev.target.result); setPdfFileName(file.name); setPdfLoading(false); };
    reader.onerror = () => { setPdfError("อ่านไฟล์ไม่สำเร็จ"); setPdfLoading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const openPdf = () => {
    if(!pdfDataUrl) return;
    const w = window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>${pdfFileName}</title><style>body{margin:0;background:#333}</style></head><body><iframe src="${pdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`);
    w.document.close();
  };

  const saveAndClose = () => {
    onSave({ ahiLevel, ahi, doctorName, notes, pdfFileName, pdfDataUrl, sharedWithHosps });
    onClose();
  };

  const lvl = AHI_LEVELS.find(l=>l.key===ahiLevel);
  const IS2 = { width:"100%", padding:"10px 13px", fontSize:13, border:"1.5px solid #e2e8f0", borderRadius:10, outline:"none", background:"#ffffff", color:"#111827", fontFamily:FONT, boxSizing:"border-box" };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:9999,
        background:"#000000cc",
        backdropFilter:"blur(4px)",
        WebkitBackdropFilter:"blur(4px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:12, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:560, maxHeight:"92vh", background:"#ffffff", borderRadius:20, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 40px 100px rgba(0,0,0,.6)" }}>

        {/* Header */}
        <div style={{ padding:"16px 20px", background:"linear-gradient(135deg,#0c1445,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"white" }}>Sleep Test Report</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", marginTop:2 }}>{appt.name} · HN {appt.hn} · {hosp?.name}</div>
          </div>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.15)",border:"none",color:"white",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:18, background:"#ffffff" }}>

          {/* AHI Level selector */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#111827", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-activity" style={{ fontSize:14, color:T.blue }}></i>
              AHI Level — ระดับความรุนแรง
              {lvl && <span style={{ marginLeft:"auto", fontSize:11, padding:"2px 10px", borderRadius:10, background:lvl.color, color:"white", fontWeight:600 }}>เลือกแล้ว: {lvl.label}</span>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {AHI_LEVELS.map(lv=>{
                const on = ahiLevel===lv.key;
                return (
                  <div key={lv.key} onClick={()=>setAhiLevel(lv.key)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:11, cursor:"pointer",
                      border: on ? `2px solid ${lv.color}` : "1.5px solid #e5e7eb",
                      background: on ? lv.bg : "#ffffff", transition:"all .1s" }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:on?lv.color:"#d1d5db", flexShrink:0, border:`2px solid ${on?lv.color:"#e5e7eb"}`, transition:"all .1s" }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:on?700:500, color:on?lv.color:"#111827" }}>{lv.label}</div>
                      <div style={{ fontSize:11, color:on?lv.color:"#6b7280", marginTop:1 }}>{lv.desc}</div>
                    </div>
                    <span style={{ fontSize:11, padding:"2px 9px", borderRadius:8, background:on?lv.color:"#f3f4f6", color:on?"white":"#6b7280", fontWeight:600, flexShrink:0 }}>{lv.range}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AHI value + Doctor */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:".05em" }}>ค่า AHI (events/hr)</div>
              <input type="number" value={ahi} onChange={e=>setAhi(e.target.value)} placeholder="เช่น 38.8"
                style={{ ...IS2, fontSize:20, fontWeight:800, color:"#111827", maxWidth:200 }}
                onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>แพทย์ผู้อ่านผล</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {DOCTORS.map(d=>{
                  const on = doctorName===`${d.name} ${d.license}`;
                  return (
                    <div key={d.name} onClick={()=>setDoctorName(on?"":`${d.name} ${d.license}`)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, cursor:"pointer", border:on?`2px solid ${T.blue}`:"1.5px solid #e2e8f0", background:on?"#eff6ff":"#f9fafb", transition:"all .1s" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:on?T.blue:"#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .1s" }}>
                        <i className="ti ti-stethoscope" style={{ fontSize:15, color:on?"white":"#9ca3af" }}></i>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:on?700:500, color:on?T.blue:"#111827" }}>{d.name}</div>
                        <div style={{ fontSize:11, color:on?"#2563eb":"#6b7280", marginTop:1 }}>{d.license}</div>
                      </div>
                      {on && <i className="ti ti-check-circle" style={{ fontSize:18, color:T.blue, flexShrink:0 }}></i>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:".05em" }}>หมายเหตุสำหรับ รพ.</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2}
              placeholder="เช่น CPAP 9 cmH₂O, แนะนำลดน้ำหนัก..."
              style={{ ...IS2, resize:"vertical" }}
              onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
          </div>

          {/* PDF Upload */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#0f172a", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-file-type-pdf" style={{ fontSize:16, color:"#dc2626" }}></i>
              แนบไฟล์ PDF รายงาน
              <span style={{ fontSize:10, color:"#94a3b8", fontWeight:400 }}>(รพ. จะเปิดและปริ้นท์จากไฟล์นี้)</span>
            </div>
            {pdfDataUrl ? (
              <div style={{ padding:"14px 16px", background:"#f0fdf4", borderRadius:12, border:"1.5px solid #86efac", display:"flex", alignItems:"center", gap:12 }}>
                <i className="ti ti-file-check" style={{ fontSize:28, color:"#059669", flexShrink:0 }}></i>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#166534", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pdfFileName}</div>
                  <div style={{ fontSize:11, color:"#059669", marginTop:2 }}>แนบไฟล์แล้ว ✓  รพ. สามารถเปิดและปริ้นท์ได้</div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={openPdf} style={{ padding:"7px 13px", fontSize:11, fontWeight:700, borderRadius:8, background:"#059669", color:"white", border:"none", cursor:"pointer" }}>
                    <i className="ti ti-external-link" style={{ marginRight:4, fontSize:11 }}></i>เปิดดู
                  </button>
                  <button onClick={()=>{ setPdfDataUrl(""); setPdfFileName(""); }} style={{ padding:"7px 11px", fontSize:11, borderRadius:8, border:"1px solid #86efac", background:"white", color:"#dc2626", cursor:"pointer" }}>ลบ</button>
                </div>
              </div>
            ) : (
              <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"24px", borderRadius:12,
                border: pdfLoading ? "2px dashed #93c5fd" : "2px dashed #cbd5e1",
                background: pdfLoading ? "#eff6ff" : "#f8fafc", cursor:"pointer", transition:"all .15s" }}>
                {pdfLoading
                  ? <><i className="ti ti-loader-2" style={{ fontSize:32, color:T.blue }}></i><div style={{ fontSize:13, color:T.blue, fontWeight:600 }}>กำลังอ่านไฟล์...</div></>
                  : <><i className="ti ti-upload" style={{ fontSize:32, color:"#94a3b8" }}></i>
                     <div style={{ fontSize:13, fontWeight:600, color:"#475569" }}>คลิกเพื่อเลือกไฟล์ PDF</div>
                     <div style={{ fontSize:11, color:"#94a3b8" }}>รองรับ .pdf เท่านั้น (ไฟล์จะเก็บในระบบ)</div></>
                }
                <input type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} style={{ display:"none" }}/>
              </label>
            )}
            {pdfError && <div style={{ marginTop:6, fontSize:12, color:"#dc2626", display:"flex", alignItems:"center", gap:5 }}><i className="ti ti-alert-circle" style={{ fontSize:13 }}></i>{pdfError}</div>}
          </div>

          {/* Hospital visibility */}
          {hospitals.length>0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#0f172a", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                <i className="ti ti-building-hospital" style={{ fontSize:14, color:T.blue }}></i>
                เลือก รพ. ที่เห็นรายงานนี้ได้
                <button onClick={()=>setSharedWithHosps(hospitals.map(h=>h.id))} style={{ marginLeft:"auto", fontSize:10, padding:"2px 9px", borderRadius:7, border:`0.5px solid ${T.line}`, background:T.card, color:T.blue, cursor:"pointer" }}>ทั้งหมด</button>
                <button onClick={()=>setSharedWithHosps([])} style={{ fontSize:10, padding:"2px 9px", borderRadius:7, border:`0.5px solid ${T.line}`, background:T.card, color:T.muted, cursor:"pointer" }}>ยกเลิก</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {hospitals.map(h=>{
                  const on = sharedWithHosps.includes(h.id);
                  const c = hc(h.id, hospitals);
                  return (
                    <div key={h.id} onClick={()=>toggleHosp(h.id)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:9, cursor:"pointer",
                        border: on ? `1.5px solid ${c.dot}` : "0.5px solid #e2e8f0",
                        background: on ? c.bg : "#f8fafc", transition:"all .1s" }}>
                      <div style={{ width:18,height:18,borderRadius:5,border:on?`2px solid ${c.dot}`:"1.5px solid #cbd5e1",background:on?c.dot:"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        {on && <i className="ti ti-check" style={{ fontSize:10, color:"white" }}></i>}
                      </div>
                      <span style={{ fontSize:12, fontWeight:on?700:400, color:on?c.text:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 20px", borderTop:"1px solid #e2e8f0", display:"flex", gap:8, background:"#f8fafc", flexShrink:0 }}>
          <button onClick={saveAndClose} disabled={!ahiLevel}
            style={{ flex:1, padding:"11px", fontSize:13, fontWeight:700, borderRadius:10, background:ahiLevel?T.blue:"#e2e8f0", color:ahiLevel?"white":"#94a3b8", border:"none", cursor:ahiLevel?"pointer":"not-allowed", fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <i className="ti ti-device-floppy" style={{ fontSize:15 }}></i> บันทึก Report
          </button>
          {pdfDataUrl && (
            <button onClick={openPdf}
              style={{ padding:"11px 16px", fontSize:13, fontWeight:700, borderRadius:10, background:"#dc2626", color:"white", border:"none", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-printer" style={{ fontSize:14 }}></i> Print PDF
            </button>
          )}
          <button onClick={onClose} style={{ padding:"11px 14px", fontSize:12, borderRadius:10, background:"transparent", color:T.muted, border:"1px solid #e2e8f0", cursor:"pointer", fontFamily:FONT }}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

// sub-components (ยังใช้อยู่บางส่วน)
const IS = { width:"100%", padding:"9px 12px", fontSize:13, border:"1.5px solid #e2e8f0", borderRadius:10, outline:"none", background:"white", color:"#0f172a", fontFamily:"inherit", boxSizing:"border-box" };
function Section({ title, icon, children }) {
  return (
    <div style={{ background:"#f8fafc", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
      <div style={{ padding:"11px 16px", background:"#f1f5f9", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:8 }}>
        <i className={`ti ${icon}`} style={{ fontSize:15, color:T.blue }}></i>
        <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{title}</span>
      </div>
      <div style={{ padding:"14px 16px" }}>{children}</div>
    </div>
  );
}
function Grid2({ children }) { return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>{children}</div>; }
function Grid3({ children }) { return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>{children}</div>; }
function Field({ label, children, full }) { return <div style={{ gridColumn:full?"1/-1":"auto" }}><label style={{ fontSize:11, fontWeight:600, color:T.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".04em" }}>{label}</label>{children}</div>; }
function NumInput({ value, onChange, unit }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} style={{ ...IS, flex:1 }}/>
      {unit && <span style={{ fontSize:11, color:T.faint, whiteSpace:"nowrap" }}>{unit}</span>}
    </div>
  );
}

// ── Patient Journey ───────────────────────────────────────────────────────────
// apptType: "sleep_test" | "cpap_trial"
// journeyStatus (for sleep_test): "scheduled" → "tested" → "waiting_result" → "result_ready" → "consulted"
// journeyStatus (for cpap_trial): "scheduled" → "trialed" → "received_device"

const JOURNEY_SLEEP = [
  { key:"scheduled",      label:"รอตรวจ",            icon:"ti-calendar-event", color:"#2563eb", bg:"#dbeafe" },
  { key:"tested",         label:"ตรวจแล้ว",           icon:"ti-activity",       color:"#7c3aed", bg:"#ede9fe" },
  { key:"waiting_result", label:"รอแพทย์อ่านผล",     icon:"ti-clock",          color:"#d97706", bg:"#fef9c3" },
  { key:"result_ready",   label:"ผลออกแล้ว",          icon:"ti-file-check",     color:"#059669", bg:"#d1fae5" },
  { key:"consulted",      label:"ฟังผลแล้ว",           icon:"ti-check-circle",   color:"#166534", bg:"#dcfce7" },
];

const JOURNEY_CPAP = [
  { key:"scheduled",      label:"รอทดลอง",            icon:"ti-calendar-event", color:"#2563eb", bg:"#dbeafe" },
  { key:"trialed",        label:"ทดลองแล้ว",           icon:"ti-device-heart-monitor", color:"#7c3aed", bg:"#ede9fe" },
  { key:"received_device",label:"รับเครื่องแล้ว",     icon:"ti-check-circle",   color:"#059669", bg:"#d1fae5" },
];

const APPT_TYPE_LABEL = { sleep_test:"Sleep Test", cpap_trial:"ทดลอง CPAP" };
const APPT_TYPE_COLOR = {
  sleep_test:  { color:"#1e40af", bg:"#dbeafe", dot:"#3b82f6" },
  cpap_trial:  { color:"#5b21b6", bg:"#ede9fe", dot:"#8b5cf6" },
};

function journeySteps(apptType) {
  return apptType==="cpap_trial" ? JOURNEY_CPAP : JOURNEY_SLEEP;
}
function currentStep(apptType, journeyStatus) {
  const steps = journeySteps(apptType);
  return steps.find(s=>s.key===journeyStatus) || steps[0];
}

function JourneyBadge({ apptType, journeyStatus, sleepTestType, paymentType }) {
  const step = currentStep(apptType||"sleep_test", journeyStatus||"scheduled");
  const tc2  = APPT_TYPE_COLOR[apptType||"sleep_test"];
  const pt   = PAYMENT_TYPES.find(p=>p.key===paymentType);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:tc2.bg, color:tc2.color, fontWeight:700, flexShrink:0 }}>
        {APPT_TYPE_LABEL[apptType||"sleep_test"]}
      </span>
      {apptType==="sleep_test" && sleepTestType && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:sleepTestType==="split_night"?"#ede9fe":"#dbeafe", color:sleepTestType==="split_night"?"#5b21b6":"#1e40af", fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:3 }}>
          <i className={`ti ${sleepTestType==="split_night"?"ti-moon-stars":"ti-moon"}`} style={{ fontSize:10 }}></i>
          {sleepTestType==="split_night"?"Split Night":"Full Night"}
        </span>
      )}
      {pt && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:pt.bg, color:pt.color, fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:3 }}>
          {pt.fastResult && <i className="ti ti-bolt" style={{ fontSize:10 }}></i>}
          {pt.short}
        </span>
      )}
      {pt?.fastResult && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:"#fef9c3", color:"#92400e", fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:3 }}>
          <i className="ti ti-clock" style={{ fontSize:10 }}></i>
          ผลออก 14 วัน
        </span>
      )}
      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:8, background:step.bg, color:step.color, fontWeight:600, flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
        <i className={`ti ${step.icon}`} style={{ fontSize:11 }}></i>{step.label}
      </span>
    </div>
  );
}

// ── CPAP Trial Read-Only View (สำหรับ รพ. — ดูได้ แก้ไขไม่ได้) ──────────────
function CpapTrialReadOnly({ appt }) {
  const [open, setOpen] = useState(false);
  const trials   = (appt.cpapTrials || []).filter(t => t.model);
  const decision = appt.cpapDecision || "";
  const purchase = appt.cpapPurchase || {};
  const hasData  = trials.length > 0 || !!purchase.model;

  const fmtDate = s => {
    if(!s) return "—";
    const d = new Date(s);
    const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()+543}`;
  };

  const DEC_LABELS = {
    trial:                 { label:"กำลังทดลอง",            color:"#d97706", bg:"#fef9c3", icon:"ti-device-heart-monitor" },
    purchased_after_trial: { label:"ซื้อแล้ว (หลังทดลอง)", color:"#059669", bg:"#d1fae5", icon:"ti-check-circle" },
    purchase_direct:       { label:"ซื้อแล้ว (ไม่ทดลอง)",  color:"#059669", bg:"#d1fae5", icon:"ti-check-circle" },
  };
  const dec = DEC_LABELS[decision];

  return (
    <div style={{ borderTop:`0.5px solid ${T.line}`, background:"#fafaff" }}>
      {/* Toggle button */}
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:"100%", padding:"9px 14px", display:"flex", alignItems:"center", gap:8, background:"transparent", border:"none", cursor:"pointer", textAlign:"left", fontFamily:FONT }}>
        <i className="ti ti-device-heart-monitor" style={{ fontSize:14, color:"#a78bfa", flexShrink:0 }}></i>
        <span style={{ fontSize:11, fontWeight:700, color:"#5b21b6" }}>ข้อมูลการทดลอง CPAP</span>
        {dec && (
          <span style={{ fontSize:10, padding:"2px 9px", borderRadius:10, background:dec.bg, color:dec.color, fontWeight:600, display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
            <i className={`ti ${dec.icon}`} style={{ fontSize:10 }}></i>{dec.label}
          </span>
        )}
        {!hasData && <span style={{ fontSize:10, color:T.faint }}>รอข้อมูลจาก Sales</span>}
        <i className={`ti ti-chevron-${open?"up":"down"}`} style={{ fontSize:12, color:T.muted, marginLeft:"auto", flexShrink:0 }}></i>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ padding:"0 14px 12px" }}>
          {!hasData ? (
            <div style={{ padding:"11px 13px", background:"#f1f5f9", borderRadius:10, fontSize:12, color:T.faint, display:"flex", alignItems:"center", gap:7 }}>
              <i className="ti ti-clock" style={{ fontSize:14 }}></i>
              Sales ยังไม่ได้บันทึกข้อมูลเครื่องทดลอง
            </div>
          ) : (
            <>
              {trials.map((tr,i)=>(
                <div key={tr.id||i} style={{ padding:"10px 13px", background:"white", borderRadius:10, border:"0.5px solid #ddd6fe", marginBottom:8 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", marginBottom:5 }}>รุ่นที่ {i+1}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:7 }}>{tr.model}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 14px", fontSize:12 }}>
                    {tr.serialNo   && <><span style={{color:T.faint}}>S/N</span><span style={{fontFamily:"monospace",fontWeight:600,color:"#334155"}}>{tr.serialNo}</span></>}
                    {tr.dn         && <><span style={{color:T.faint}}>DN</span><span style={{fontFamily:"monospace",fontWeight:600,color:"#334155"}}>{tr.dn}</span></>}
                    {tr.maskModel  && <><span style={{color:T.faint}}>Mask</span>
                      <span style={{color:"#334155"}}>
                        {tr.maskModel==="อื่นๆ (พิมพ์เอง)"?(tr.maskOther||"—"):tr.maskModel}
                        {tr.maskSize&&<span style={{marginLeft:5,padding:"1px 6px",background:"#ede9fe",color:"#7c3aed",borderRadius:6,fontSize:10}}>{tr.maskSize}</span>}
                      </span>
                    </>}
                    {tr.trialDate  && <><span style={{color:T.faint}}>เริ่ม</span><span style={{color:"#059669",fontWeight:600}}>{fmtDate(tr.trialDate)}</span></>}
                    {tr.returnDate && <><span style={{color:T.faint}}>คืน</span><span style={{color:"#dc2626",fontWeight:600}}>{fmtDate(tr.returnDate)}</span></>}
                    {tr.note       && <><span style={{color:T.faint}}>หมาย</span><span style={{color:"#334155"}}>{tr.note}</span></>}
                  </div>
                  {/* PDF ผลทดลอง — Print button for hospital */}
                  {tr.pdfDataUrl && (
                    <div style={{marginTop:8,padding:"7px 10px",background:"#fff5f5",borderRadius:8,border:"1px solid #fca5a5",display:"flex",alignItems:"center",gap:8}}>
                      <i className="ti ti-file-check" style={{fontSize:16,color:"#dc2626",flexShrink:0}}></i>
                      <span style={{fontSize:11,color:"#991b1b",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>ผลทดลองรุ่นที่ {i+1}: {tr.pdfFileName||"ผลทดลอง.pdf"}</span>
                      <button onClick={()=>{ const w=window.open("","_blank"); w.document.write(`<html><body style="margin:0;background:#333"><iframe src="${tr.pdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`); w.document.close(); }}
                        style={{padding:"5px 12px",fontSize:11,fontWeight:700,borderRadius:8,background:"#dc2626",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                        <i className="ti ti-printer" style={{fontSize:12}}></i>Print PDF
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {purchase.model && (
                <div style={{ padding:"10px 13px", background:"#f0fdf4", borderRadius:10, border:"1px solid #86efac" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#059669", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}>
                    <i className="ti ti-shopping-cart" style={{fontSize:12}}></i>เครื่องที่ซื้อ
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 14px", fontSize:12 }}>
                    <span style={{color:T.faint}}>รุ่น</span><span style={{fontWeight:700,color:"#166534"}}>{purchase.model}</span>
                    {purchase.serialNo    && <><span style={{color:T.faint}}>S/N</span><span style={{fontFamily:"monospace",color:"#166534",fontWeight:600}}>{purchase.serialNo}</span></>}
                    {purchase.maskModel   && <><span style={{color:T.faint}}>Mask</span><span style={{color:"#166534"}}>{purchase.maskModel==="อื่นๆ (พิมพ์เอง)"?(purchase.maskOther||"—"):purchase.maskModel}</span></>}
                    {purchase.purchaseDate&& <><span style={{color:T.faint}}>วันซื้อ</span><span style={{color:"#166534",fontWeight:600}}>{fmtDate(purchase.purchaseDate)}</span></>}
                    {purchase.price>0     && <><span style={{color:T.faint}}>ราคา</span><span style={{fontSize:15,fontWeight:800,color:"#059669"}}>{(purchase.price).toLocaleString()} ฿</span></>}
                  </div>
                  {/* Print trial result PDF */}
                  {purchase.trialPdfDataUrl && (
                    <div style={{ marginTop:10, padding:"8px 11px", background:"white", borderRadius:9, border:"0.5px solid #86efac", display:"flex", alignItems:"center", gap:9 }}>
                      <i className="ti ti-file-check" style={{fontSize:18,color:"#059669",flexShrink:0}}></i>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#166534",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{purchase.trialPdfFileName||"ผลการทดลอง.pdf"}</div>
                        <div style={{fontSize:10,color:"#059669"}}>ไฟล์ผลทดลอง — กด Print เพื่อให้หมออ่าน</div>
                      </div>
                      <button onClick={()=>{
                        const w=window.open("","_blank");
                        w.document.write(`<html><body style="margin:0;background:#333"><iframe src="${purchase.trialPdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`);
                        w.document.close();
                      }}
                        style={{padding:"7px 14px",fontSize:12,fontWeight:700,borderRadius:9,background:"#dc2626",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                        <i className="ti ti-printer" style={{fontSize:13}}></i>Print PDF
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


// ── CPAP Trial Tracker ────────────────────────────────────────────────────────
function CpapTrialTracker({ appt, onUpdate, isAdmin=false, salesList=[] }) {
  const trials   = appt.cpapTrials   || [];
  const decision = appt.cpapDecision || "not_decided";
  const purchase = appt.cpapPurchase || {};

  const addTrial = () => {
    if(trials.length>=3) return;
    const newTrials = [...trials, { id:"tr"+Date.now(), model:"", trialDate:appt.date, returnDate:"", serialNo:"", dn:"", maskModel:"", maskSize:"", note:"" }];
    onUpdate({ cpapTrials:newTrials });
  };
  const updateTrial = (idx, field, val) => {
    const newTrials = trials.map((t,i)=>i===idx?{...t,[field]:val}:t);
    onUpdate({ cpapTrials:newTrials });
  };
  const removeTrial = (idx) => onUpdate({ cpapTrials:trials.filter((_,i)=>i!==idx) });

  const DECISIONS = [
    { key:"not_decided",          label:"ยังไม่ตัดสินใจ",   color:T.muted,   bg:T.surf    },
    { key:"trial",                label:"ทดลองเครื่องต่อ",  color:"#d97706", bg:"#fef9c3" },
    { key:"purchased_after_trial",label:"ซื้อหลังทดลอง",    color:"#059669", bg:"#d1fae5" },
    { key:"purchase_direct",      label:"ซื้อโดยไม่ทดลอง",  color:"#7c3aed", bg:"#ede9fe" },
  ];

  const IS3 = { width:"100%", padding:"6px 9px", fontSize:12, border:"0.5px solid #ddd6fe", borderRadius:8, outline:"none", background:"white", color:T.ink, boxSizing:"border-box" };

  return (
    <div style={{ borderTop:`0.5px solid ${T.line}`, padding:"12px 14px 14px", background:"#fafaff" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#5b21b6", marginBottom:10, ...R, gap:6 }}>
        <i className="ti ti-device-heart-monitor" style={{ fontSize:14 }}></i>
        บันทึกการทดลอง CPAP
      </div>

      {/* Trial entries */}
      {trials.map((tr,i)=>(
        <div key={tr.id} style={{ padding:"10px 12px", background:"white", borderRadius:11, border:"0.5px solid #ddd6fe", marginBottom:8 }}>
          {/* Row 1: รุ่น + ลบ */}
          <div style={{ ...R, gap:6, marginBottom:8 }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#7c3aed", minWidth:52 }}>รุ่นที่ {i+1}</span>
            <select value={tr.model} onChange={e=>updateTrial(i,"model",e.target.value)} style={{ flex:1, ...IS3 }}>
              <option value="">— เลือกรุ่น CPAP/BiPAP —</option>
              {CPAP_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={()=>removeTrial(i)} style={{ width:26,height:26,border:"0.5px solid #fecaca",borderRadius:7,background:"#fef2f2",color:T.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0 }}>
              <i className="ti ti-x"></i>
            </button>
          </div>
          {/* Row 2: S/N + DN */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <div>
              <div style={{ fontSize:10,color:"#7c3aed",marginBottom:3,fontWeight:600 }}>Serial No.</div>
              <input value={tr.serialNo||""} onChange={e=>updateTrial(i,"serialNo",e.target.value)} placeholder="SN-XXXXXXXX"
                style={{ ...IS3, fontFamily:"monospace" }}/>
            </div>
            <div>
              <div style={{ fontSize:10,color:"#7c3aed",marginBottom:3,fontWeight:600 }}>DN (Delivery Note)</div>
              <input value={tr.dn||""} onChange={e=>updateTrial(i,"dn",e.target.value)} placeholder="DN-XXXX"
                style={{ ...IS3, fontFamily:"monospace" }}/>
            </div>
          </div>
          {/* Row 3: หน้ากาก + ขนาด */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8, marginBottom:8 }}>
            <div>
              <div style={{ fontSize:10,color:"#7c3aed",marginBottom:3,fontWeight:600 }}>รุ่นหน้ากาก (Mask)</div>
              <select value={tr.maskModel||""} onChange={e=>updateTrial(i,"maskModel",e.target.value)} style={{ ...IS3 }}>
                <option value="">— เลือกรุ่น Mask —</option>
                {MASK_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:10,color:"#7c3aed",marginBottom:3,fontWeight:600 }}>ขนาด</div>
              <select value={tr.maskSize||""} onChange={e=>updateTrial(i,"maskSize",e.target.value)} style={{ ...IS3, minWidth:80 }}>
                <option value="">—</option>
                {MASK_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* Row 4: วันที่เริ่ม + วันคืนเครื่อง + หมายเหตุ */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            <div>
              <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>📅 วันที่เริ่มทดลอง</div>
              <input type="date" value={tr.trialDate} onChange={e=>updateTrial(i,"trialDate",e.target.value)} style={IS3}/>
            </div>
            <div>
              <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>📅 วันคืนเครื่อง</div>
              <input type="date" value={tr.returnDate||""} onChange={e=>updateTrial(i,"returnDate",e.target.value)} style={IS3}/>
            </div>
            <div>
              <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>หมายเหตุ / Pressure</div>
              <input value={tr.note} onChange={e=>updateTrial(i,"note",e.target.value)} placeholder="เช่น APAP 6-12 cmH₂O" style={IS3}/>
            </div>
          </div>
        </div>
      ))}

      {/* Add trial button */}
      {trials.length<3 && (
        <button onClick={addTrial} style={{ width:"100%", padding:"8px", fontSize:12, fontWeight:600, borderRadius:9, border:"1.5px dashed #a78bfa", background:"transparent", color:"#7c3aed", cursor:"pointer", marginBottom:12, fontFamily:FONT }}>
          <i className="ti ti-plus" style={{ marginRight:5 }}></i>
          เพิ่มรุ่นทดลอง {trials.length>0?`(${trials.length}/3)`:""}
        </button>
      )}

      {/* Decision */}
      <div style={{ fontSize:11, fontWeight:700, color:T.ink, marginBottom:8 }}>ผลการตัดสินใจ</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:12 }}>
        {DECISIONS.map(d=>{
          const on=decision===d.key;
          return (
            <div key={d.key} onClick={()=>onUpdate({ cpapDecision:d.key })}
              style={{ padding:"9px 12px", borderRadius:10, cursor:"pointer", border:on?`2px solid ${d.color}`:`0.5px solid ${T.line}`, background:on?d.bg:T.card, transition:"all .12s",...R,gap:8 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:on?d.color:"#cbd5e1",flexShrink:0 }}/>
              <span style={{ fontSize:12, fontWeight:on?700:400, color:on?d.color:T.muted }}>{d.label}</span>
            </div>
          );
        })}
      </div>

      {/* Purchase detail */}
      {(decision==="purchased_after_trial"||decision==="purchase_direct") && (
        <div style={{ padding:"12px 13px", background:"#f0fdf4", borderRadius:11, border:"1px solid #86efac", ...FL, gap:9 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#059669", ...R, gap:6 }}>
            <i className="ti ti-shopping-cart" style={{ fontSize:14 }}></i>ข้อมูลการซื้อเครื่อง
          </div>
          {/* Model */}
          <select value={purchase.model||""} onChange={e=>onUpdate({ cpapPurchase:{...purchase, model:e.target.value} })}
            style={{ padding:"8px 11px", fontSize:12, border:"1px solid #86efac", borderRadius:9, background:"white", color:T.ink }}>
            <option value="">— เลือกรุ่นที่ซื้อ —</option>
            {CPAP_MODELS.filter(m=>m!=="อื่นๆ").map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          {/* Price + Commission */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>ราคาเครื่อง (บาท)</div>
              <input type="number" value={purchase.price||""} onChange={e=>onUpdate({ cpapPurchase:{...purchase, price:Number(e.target.value)} })}
                placeholder="เช่น 45000"
                style={{ width:"100%",padding:"7px 10px",fontSize:13,fontWeight:700,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:"#059669",boxSizing:"border-box" }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>ค่าคอม % (Default 2%)</div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input type="number" value={purchase.commissionRate??2} onChange={e=>onUpdate({ cpapPurchase:{...purchase, commissionRate:Number(e.target.value)} })}
                  style={{ width:60,padding:"7px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:T.ink }} />
                <span style={{ fontSize:12, color:"#059669", fontWeight:700 }}>
                  = {((purchase.price||0)*(purchase.commissionRate??2)/100).toLocaleString()} บาท
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>วันที่ขาย</div>
              <input type="date" value={purchase.purchaseDate||""} onChange={e=>onUpdate({ cpapPurchase:{...purchase, purchaseDate:e.target.value} })}
                style={{ width:"100%",padding:"7px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:T.ink,boxSizing:"border-box" }} />
            </div>
            {/* ค่าคอม + Sales — Admin only */}
            {isAdmin && <>
            <div>
              <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>ค่าคอม % (Admin)</div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input type="number" value={purchase.commissionRate??2} onChange={e=>onUpdate({ cpapPurchase:{...purchase, commissionRate:Number(e.target.value)} })}
                  style={{ width:60,padding:"7px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:T.ink }} />
                <span style={{ fontSize:12, color:"#059669", fontWeight:700 }}>
                  = {((purchase.price||0)*(purchase.commissionRate??2)/100).toLocaleString()} บาท
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>ชื่อ Sales (Admin)</div>
              <select value={purchase.salesPerson||""} onChange={e=>onUpdate({ cpapPurchase:{...purchase, salesPerson:e.target.value} })}
                style={{ width:"100%",padding:"7px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,background:"white",color:T.ink,boxSizing:"border-box" }}>
                <option value="">— เลือกชื่อ Sales —</option>
                {(salesList.length>0?salesList:INIT_SALES).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            </>}
          </div>
          <div>
            <div style={{ fontSize:10, color:"#059669", marginBottom:3 }}>หมายเหตุ</div>
            <input value={purchase.note||""} onChange={e=>onUpdate({ cpapPurchase:{...purchase, note:e.target.value} })} placeholder="Serial No., ประกัน, หมายเหตุ..."
              style={{ width:"100%",padding:"7px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:T.ink,boxSizing:"border-box" }} />
          </div>
          {/* Summary — ราคา+คอม (Admin) หรือแค่ราคา (รพ.) */}
          {purchase.price>0 && (
            <div style={{ padding:"9px 12px", background:"#dcfce7", borderRadius:9, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, color:"#166534" }}>ราคา {(purchase.price||0).toLocaleString()} บาท</span>
              {isAdmin && (
                <span style={{ fontSize:12, fontWeight:700, color:"#166534" }}>
                  ค่าคอม {((purchase.price||0)*(purchase.commissionRate??2)/100).toLocaleString()} บาท
                </span>
              )}
            </div>
          )}
          {/* Billing status */}
          <div>
            <div style={{ fontSize:10,color:"#059669",marginBottom:5,fontWeight:600 }}>สถานะใบแจ้งหนี้</div>
            <div style={{ display:"flex",gap:6 }}>
              {BILLING_STATUS.map(bs=>{
                const on=(purchase.billingStatus||"pending")===bs.key;
                return (
                  <div key={bs.key} onClick={()=>onUpdate({ cpapPurchase:{...purchase,billingStatus:bs.key} })}
                    style={{ flex:1,padding:"7px 10px",borderRadius:9,cursor:"pointer",border:on?`2px solid ${bs.color}`:`0.5px solid #86efac`,background:on?bs.bg:"white",textAlign:"center",transition:"all .12s" }}>
                    <span style={{ fontSize:11,fontWeight:on?700:400,color:on?bs.color:"#64748b" }}>{bs.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Journey Progress Panel ────────────────────────────────────────────────────
function JourneyPanel({ appt, canEdit, onUpdate, isAdmin=false, salesList=[], hasCpapBooked=false }) {
  const [open, setOpen] = useState(false);
  const steps = journeySteps(appt.apptType||"sleep_test");
  const curIdx = steps.findIndex(s=>s.key===(appt.journeyStatus||"scheduled"));

  // Compute CPAP trial stage from data
  const today  = new Date().toISOString().split("T")[0];
  const cpapStatus = (() => {
    if(appt.apptType!=="cpap_trial") return null;
    const dec = appt.cpapDecision||"";
    if(["purchased_after_trial","purchase_direct"].includes(dec)) return "purchased";
    if(dec==="finished_trial") return "waiting_buy";
    const allTrials       = appt.cpapTrials||[];
    const trialsWithModel = allTrials.filter(t=>t.model&&t.model!=="(รอกรอกรุ่น)");
    if(dec==="trial" || allTrials.length>0) {
      const allReturned = trialsWithModel.length>0 && trialsWithModel.every(t=>t.returnDate&&t.returnDate<=today);
      return allReturned ? "waiting_buy" : "trialing";
    }
    return "waiting";
  })();

  const CPAP_STAGES = [
    { key:"waiting",     label:"รอทดลอง",        color:"#d97706", bg:"#fef9c3", icon:"ti-clock"                  },
    { key:"trialing",    label:"กำลังทดลอง",      color:"#7c3aed", bg:"#ede9fe", icon:"ti-device-heart-monitor"   },
    { key:"waiting_buy", label:"รอซื้อเครื่อง",   color:"#1e40af", bg:"#dbeafe", icon:"ti-shopping-cart"          },
    { key:"purchased",   label:"ซื้อแล้ว",         color:"#059669", bg:"#d1fae5", icon:"ti-check-circle"          },
  ];
  const cpapStageIdx = cpapStatus ? CPAP_STAGES.findIndex(s=>s.key===cpapStatus) : 0;

  const canBookCpap = (appt.apptType||"sleep_test")==="sleep_test" && appt.journeyStatus==="consulted";

  return (
    <div style={{ padding:"6px 11px 10px" }}>
      {/* ── Sleep Test progress bar ── */}
      {(appt.apptType||"sleep_test")==="sleep_test" && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:8 }}>
            {steps.map((s,i)=>{
              const done = i<=curIdx;
              const isActive = i===curIdx;
              return (
                <div key={s.key} style={{ display:"flex", alignItems:"center", flex: i<steps.length-1?1:"auto" }}>
                  <div
                    onClick={canEdit?()=>{ onUpdate({ journeyStatus:s.key }); }:undefined}
                    title={s.label}
                    style={{ width:28,height:28,borderRadius:"50%",background:done?s.color:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",cursor:canEdit?"pointer":"default",flexShrink:0,border:isActive?`3px solid ${s.color}`:"2px solid transparent",boxSizing:"border-box",transition:"all .2s" }}>
                    <i className={`ti ${s.icon}`} style={{ fontSize:12, color:done?"white":"#94a3b8" }}></i>
                  </div>
                  {i<steps.length-1 && (
                    <div style={{ flex:1,height:3,background:i<curIdx?steps[i+1].color:"#e2e8f0",borderRadius:2,margin:"0 3px",transition:"background .3s" }}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:steps[curIdx]?.color||T.muted, fontWeight:600 }}>
              {steps[curIdx]?.label || "—"}
            </span>
            {canEdit && (
              <button onClick={()=>setOpen(o=>!o)} style={{ fontSize:10,padding:"2px 9px",borderRadius:8,border:`0.5px solid ${T.line}`,background:open?T.blueL:T.card,color:open?T.blue:T.muted,cursor:"pointer" }}>
                {open?"ปิด":"อัปเดต"}
              </button>
            )}
          </div>
          {open && canEdit && (
            <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5 }}>
              {steps.map((s,i)=>{
                const done = i<=curIdx;
                return (
                  <div key={s.key} onClick={()=>{ onUpdate({ journeyStatus:s.key }); setOpen(false); }}
                    style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:10,cursor:"pointer",background:s.key===appt.journeyStatus?s.bg:T.card,border:`0.5px solid ${s.key===appt.journeyStatus?s.color:T.line}`,transition:"all .1s" }}>
                    <div style={{ width:24,height:24,borderRadius:"50%",background:done?s.color:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <i className={`ti ${s.icon}`} style={{ fontSize:11, color:done?"white":"#94a3b8" }}></i>
                    </div>
                    <span style={{ fontSize:12,fontWeight:s.key===appt.journeyStatus?700:400,color:s.key===appt.journeyStatus?s.color:T.ink }}>{s.label}</span>
                    {s.key===appt.journeyStatus && <i className="ti ti-check" style={{ fontSize:12,color:s.color,marginLeft:"auto" }}></i>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── CPAP Trial progress bar ── */}
      {appt.apptType==="cpap_trial" && cpapStatus && (
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:6 }}>
            {CPAP_STAGES.map((s,i)=>{
              const done = i<=cpapStageIdx;
              const isActive = i===cpapStageIdx;
              return (
                <div key={s.key} style={{ display:"flex", alignItems:"center", flex: i<CPAP_STAGES.length-1?1:"auto" }}>
                  <div title={s.label}
                    style={{ width:28,height:28,borderRadius:"50%",background:done?s.color:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:isActive?`3px solid ${s.color}`:"2px solid transparent",boxSizing:"border-box",transition:"all .2s" }}>
                    <i className={`ti ${s.icon}`} style={{ fontSize:12, color:done?"white":"#94a3b8" }}></i>
                  </div>
                  {i<CPAP_STAGES.length-1 && (
                    <div style={{ flex:1,height:3,background:i<cpapStageIdx?CPAP_STAGES[i+1].color:"#e2e8f0",borderRadius:2,margin:"0 3px",transition:"background .3s" }}></div>
                  )}
                </div>
              );
            })}
          </div>
          <span style={{ fontSize:11, color:CPAP_STAGES[cpapStageIdx]?.color, fontWeight:600 }}>
            {CPAP_STAGES[cpapStageIdx]?.label}
          </span>
        </div>
      )}

      {/* Sleep Report section */}
      {(appt.apptType||"sleep_test")==="sleep_test" && (appt.journeyStatus==="result_ready"||appt.journeyStatus==="consulted"||appt.journeyStatus==="tested"||appt.journeyStatus==="waiting_result") && (
        <div style={{ marginTop:8 }}>
          {isAdmin && (
            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
              <button onClick={()=>onUpdate({ _openReport:true })}
                style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",fontSize:12,fontWeight:700,borderRadius:10,background:appt.sleepReport?.ahiLevel?"#059669":"#1d4ed8",color:"white",border:"none",cursor:"pointer",fontFamily:FONT }}>
                <i className={`ti ${appt.sleepReport?.ahiLevel?"ti-edit":"ti-file-plus"}`} style={{ fontSize:14 }}></i>
                {appt.sleepReport?.ahiLevel ? "แก้ไข Sleep Report" : "กรอก Sleep Report"}
              </button>
              {appt.sleepReport?.ahiLevel && (
                <span style={{ fontSize:11,color:"#059669",fontWeight:500,display:"flex",alignItems:"center",gap:4 }}>
                  <i className="ti ti-check-circle" style={{ fontSize:13 }}></i>บันทึกแล้ว
                </span>
              )}
            </div>
          )}
          {!isAdmin && appt.sleepReport?.ahiLevel && (() => {
            const lv = AHI_LEVELS.find(l=>l.key===appt.sleepReport.ahiLevel);
            const rep = appt.sleepReport;
            const openPdf = () => {
              if(!rep.pdfDataUrl) return;
              const w=window.open("","_blank");
              w.document.write(`<!DOCTYPE html><html><head><title>${rep.pdfFileName}</title><style>body{margin:0;background:#333}</style></head><body><iframe src="${rep.pdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`);
              w.document.close();
            };
            return (
              <div style={{ padding:"12px 14px",background:lv?lv.bg:"#f1f5f9",borderRadius:12,border:`1.5px solid ${lv?lv.color:"#e2e8f0"}` }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:rep.notes||rep.pdfDataUrl?10:0 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:lv?lv.color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <i className="ti ti-activity" style={{ fontSize:18,color:"white" }}></i>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:800,color:lv?lv.color:"#334155" }}>
                      {lv?.label||"ผลออกแล้ว"}
                    </div>
                    <div style={{ fontSize:11,color:lv?lv.color:"#64748b",marginTop:1 }}>
                      {rep.ahi ? `AHI = ${rep.ahi} events/hr` : lv?.desc||""}
                      {rep.doctorName ? ` · ${rep.doctorName}` : ""}
                    </div>
                  </div>
                  {rep.pdfDataUrl ? (
                    <button onClick={openPdf}
                      style={{ padding:"8px 14px",fontSize:12,fontWeight:700,borderRadius:9,background:"#dc2626",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                      <i className="ti ti-printer" style={{ fontSize:14 }}></i> Print PDF
                    </button>
                  ) : (
                    <span style={{ fontSize:10,color:"#94a3b8",padding:"6px 10px",borderRadius:8,border:"0.5px solid #e2e8f0",background:"white" }}>รอ PDF</span>
                  )}
                </div>
                {rep.notes && (
                  <div style={{ fontSize:12,color:lv?lv.color:"#475569",padding:"8px 10px",background:"rgba(255,255,255,.6)",borderRadius:8 }}>
                    <i className="ti ti-notes" style={{ marginRight:5,fontSize:11 }}></i>{rep.notes}
                  </div>
                )}
              </div>
            );
          })()}
          {!isAdmin && !appt.sleepReport?.ahiLevel && (
            <div style={{ padding:"9px 12px",background:"#f1f5f9",borderRadius:10,border:"0.5px solid #e2e8f0",display:"flex",alignItems:"center",gap:7 }}>
              <i className="ti ti-clock" style={{ fontSize:14,color:T.muted }}></i>
              <span style={{ fontSize:12,color:T.muted }}>รอผลการตรวจ — Admin กำลังดำเนินการ</span>
            </div>
          )}
        </div>
      )}

      {/* Book CPAP trial prompt */}
      {canBookCpap && (
        hasCpapBooked ? (
          <div style={{ marginTop:10,padding:"10px 12px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:11,display:"flex",alignItems:"center",gap:10 }}>
            <i className="ti ti-check-circle" style={{ fontSize:18,color:"#059669",flexShrink:0 }}></i>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:"#059669" }}>ส่งรายชื่อแล้ว</div>
              <div style={{ fontSize:11,color:"#059669",marginTop:1 }}>รอ Sales ติดต่อนัดทดลองเครื่อง</div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop:10,padding:"10px 12px",background:"#f5f3ff",border:"1px solid #a78bfa",borderRadius:11,display:"flex",alignItems:"center",gap:10 }}>
            <i className="ti ti-device-heart-monitor" style={{ fontSize:20,color:"#7c3aed",flexShrink:0 }}></i>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#5b21b6" }}>ฟังผลแล้ว — นัดทดลอง CPAP?</div>
              <div style={{ fontSize:11,color:"#7c3aed",marginTop:1 }}>สร้างนัดทดลองเครื่องให้ผู้ป่วยรายนี้</div>
            </div>
            <button onClick={()=>onUpdate({ _bookCpapTrial:true })}
              style={{ padding:"7px 13px",fontSize:11,fontWeight:700,borderRadius:9,background:"#7c3aed",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,flexShrink:0 }}>
              + นัดทดลอง
            </button>
          </div>
        )
      )}

      {/* CPAP Trial data section */}
      {appt.apptType==="cpap_trial" && (
        canEdit && isAdmin
          ? <CpapTrialTracker appt={appt} onUpdate={onUpdate} isAdmin={isAdmin} salesList={salesList} />
          : <CpapTrialReadOnly appt={appt} />
      )}
    </div>
  );
}


// ── Appointment Card (edit + reschedule + cancel) ─────────────────────────────
const CANCEL_REASONS = ["ผู้ป่วยติดธุระ","ผู้ป่วยไม่สบาย","ผู้ป่วยขอเลื่อน","รพ. ขอเลื่อน","อุปกรณ์ไม่พร้อม","อื่นๆ"];

function ApptCard({ appt:a, hosp:h, color:c, hospitals, canEdit, isAdmin, movingAppt, isCancelled, onStartMove, onUpdate, onDelete, onBookCpap, salesList=[], isDuplicate=false, hasCpapBooked=false }) {
  const [mode, setMode]               = useState(null);
  const [showReport, setShowReport]   = useState(false);
  const [form, setForm]               = useState({ name:a.name, phone:a.phone, hn:a.hn, hospId:a.hospId, note:a.note||"", paymentType:a.paymentType||"" });
  const [actionTab, setActionTab]     = useState("reschedule");
  const [reschedDate, setReschedDate] = useState("");
  const [reschedNote, setReschedNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const openAction = (e) => { e.stopPropagation(); setMode(mode==="action"?null:"action"); setActionTab("reschedule"); setReschedDate(""); setReschedNote(""); setCancelReason(""); setCustomReason(""); };
  const saveEdit = () => { onUpdate({ ...form }); setMode(null); };
  const confirmReschedule = () => {
    if(!reschedDate) return;
    onUpdate({ date:reschedDate, note: reschedNote ? `[เลื่อนนัด] ${reschedNote}` : a.note||"", status:"active", cancelReason:"" });
    setMode(null);
  };
  const confirmCancel = () => {
    const reason = cancelReason==="อื่นๆ" ? customReason : cancelReason;
    if(!reason.trim()) return;
    onUpdate({ status:"cancelled", cancelReason:reason, cancelledAt:new Date().toISOString() });
    setMode(null);
  };
  const restoreAppt = () => onUpdate({ status:"active", cancelReason:"", cancelledAt:null });

  const handleJourneyUpdate = (upd) => {
    if(upd._bookCpapTrial) { onBookCpap && onBookCpap(a); return; }
    if(upd._openReport)    { setShowReport(true); return; }
    onUpdate(upd);
  };

  const isRescheduled = a.status==="rescheduled";
  const apptType = a.apptType || "sleep_test";

  return (
    <>
    {showReport && (
      <SleepReportModal
        appt={a} hosp={h} hospitals={hospitals}
        onClose={()=>setShowReport(false)}
        onSave={report=>onUpdate({ sleepReport:report })}
      />
    )}
    <div style={{ marginBottom:8, borderRadius:14, overflow:"hidden", border: isCancelled?`1px solid #fecaca`:isRescheduled?`1px solid #fde047`:`1px solid ${T.line}`, background: isCancelled?"#fef9f9":isRescheduled?"#fefce8":T.card, opacity:isCancelled?.7:1 }}>

      {/* Main row */}
      <div style={{ ...R, gap:11, padding:"12px 14px 10px" }}>
        <Avatar name={a.name} hospId={a.hospId} size={38} hospitals={hospitals} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ ...R, gap:6, marginBottom:4 }}>
            <div style={{ fontSize:14, fontWeight:700, color:isCancelled?T.faint:T.navy, textDecoration:isCancelled?"line-through":"none", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.name}</div>
            {isCancelled && <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:"#fef2f2",color:"#991b1b",fontWeight:700,flexShrink:0 }}>ยกเลิก</span>}
            {isDuplicate && !isCancelled && (
              <span style={{ fontSize:10,padding:"2px 8px",borderRadius:8,background:"#fef9c3",color:"#92400e",fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",gap:3 }}>
                <i className="ti ti-alert-triangle" style={{ fontSize:10 }}></i>ซ้ำ
              </span>
            )}
          </div>
          <div style={{ fontSize:12, color:T.faint, marginBottom:5 }}>HN {a.hn} · {a.phone}</div>
          {/* Journey badge */}
          {!isCancelled && <JourneyBadge apptType={apptType} journeyStatus={a.journeyStatus||"scheduled"} sleepTestType={a.sleepTestType} paymentType={a.paymentType} />}
          {/* Deadline warning */}
          {!isCancelled && (() => {
            const dl = calcDeadline(a);
            if(!dl) return null;
            const col = dl.isOverdue?"#dc2626":dl.isUrgent?"#c2410c":null;
            if(!col) return null;
            return (
              <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:3 }}>
                <span style={{ fontSize:10,padding:"2px 8px",borderRadius:8,background:dl.isOverdue?"#fee2e2":"#fef9c3",color:col,fontWeight:700,display:"flex",alignItems:"center",gap:3 }}>
                  <i className="ti ti-bell" style={{ fontSize:10 }}></i>
                  {dl.isOverdue?`เกินกำหนด ${Math.abs(dl.remaining)} วัน!`:`ผลออกใน ${dl.remaining} วัน`}
                </span>
              </div>
            );
          })()}
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
          <span style={{ fontSize:11,padding:"3px 10px",borderRadius:10,background:c.bg,color:c.text,fontWeight:600,whiteSpace:"nowrap" }}>{h?.short}</span>
          {!movingAppt && (
            <div style={{ ...R, gap:4 }}>
              {!isCancelled && (
                <>
                  {isAdmin && <button onClick={e=>{e.stopPropagation();onStartMove();}} style={{ width:26,height:26,border:`0.5px solid ${T.line}`,borderRadius:7,background:T.card,color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }} title="ย้ายวัน"><i className="ti ti-arrows-move"></i></button>}
                  {canEdit && <button onClick={e=>{e.stopPropagation();setMode(mode==="edit"?null:"edit");setForm({name:a.name,phone:a.phone,hn:a.hn,hospId:a.hospId,note:a.note||"",paymentType:a.paymentType||""});}} style={{ width:26,height:26,border:`0.5px solid ${T.line}`,borderRadius:7,background:mode==="edit"?T.blueL:T.card,color:mode==="edit"?T.blue:T.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }} title="แก้ไข"><i className="ti ti-edit"></i></button>}
                </>
              )}
              {/* ปุ่มยกเลิก/ลบ — แสดงเสมอ ทุก status */}
              {canEdit && (
                isCancelled
                  ? (
                    <div style={{ display:"flex", gap:4 }}>
                      {isAdmin && <button onClick={restoreAppt} style={{ fontSize:10,padding:"3px 9px",borderRadius:7,border:`0.5px solid ${T.line}`,background:T.card,color:T.green,cursor:"pointer",fontWeight:500 }}>คืนสถานะ</button>}
                      <button onClick={()=>{ if(window.confirm(`ลบ "${a.name}" ออกจากระบบ?`)) onDelete(); }}
                        style={{ padding:"3px 9px",fontSize:10,fontWeight:600,borderRadius:7,border:"0.5px solid #fecaca",background:"#fef2f2",color:T.red,cursor:"pointer" }}>
                        <i className="ti ti-trash" style={{ fontSize:10, marginRight:3 }}></i>ลบ
                      </button>
                    </div>
                  )
                  : (
                    <button onClick={e=>{e.stopPropagation();
                      if(isAdmin){
                        openAction(e);
                      } else {
                        if(window.confirm(`ยกเลิกนัด "${a.name}"?`)){
                          onUpdate({ status:"cancelled", cancelReason:"ยกเลิกโดย รพ.", cancelledAt:new Date().toISOString() });
                        }
                      }
                    }}
                      style={{ width:26,height:26,border:`0.5px solid #fecaca`,borderRadius:7,background:mode==="action"?T.redL:T.card,color:T.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }} title="ยกเลิกนัด">
                      <i className="ti ti-calendar-x"></i>
                    </button>
                  )
              )}
            </div>
          )}
          {movingAppt?.id===a.id && <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:"#fef9c3",color:"#854d0e",fontWeight:600 }}>กำลังย้าย</span>}
        </div>
      </div>

      {/* Journey progress — only if not cancelled */}
      {!isCancelled && (
        <div style={{ borderTop:`0.5px solid ${T.line}` }}>
          <JourneyPanel appt={a} canEdit={canEdit} onUpdate={handleJourneyUpdate} isAdmin={isAdmin} salesList={salesList} hasCpapBooked={hasCpapBooked} />
        </div>
      )}

      {/* Cancel reason + note */}
      {isCancelled && a.cancelReason && (
        <div style={{ padding:"4px 14px 10px", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ti ti-message-circle" style={{ fontSize:12,color:"#ef4444",flexShrink:0 }}></i>
          <span style={{ fontSize:11,color:"#991b1b" }}>เหตุผลยกเลิก: {a.cancelReason}</span>
        </div>
      )}
      {a.note && !isCancelled && mode!=="edit" && (
        <div style={{ padding:"2px 14px 10px" }}>
          <div style={{ fontSize:11,color:T.muted,padding:"5px 9px",background:"rgba(0,0,0,0.03)",borderRadius:7,borderLeft:`2px solid ${c.dot}` }}>{a.note}</div>
        </div>
      )}

      {/* ── Edit panel ── */}
      {mode==="edit" && (
        <div style={{ padding:"10px 12px 12px",borderTop:`0.5px solid ${T.line}`,background:T.blueL,...FL,gap:8 }}>
          <div style={{ fontSize:11,fontWeight:700,color:T.blue,marginBottom:2 }}>แก้ไขข้อมูลนัดหมาย</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            {[["ชื่อ-นามสกุล","name"],["เบอร์โทร","phone"],["HN","hn"]].map(([lb,k])=>(
              <div key={k} style={{ ...(k==="name"?{gridColumn:"1/-1"}:{}) }}>
                <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>{lb}</div>
                <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{ width:"100%",padding:"6px 10px",fontSize:12,border:`0.5px solid ${T.line}`,borderRadius:8,outline:"none",background:T.card,color:T.ink,boxSizing:"border-box" }} />
              </div>
            ))}
            {isAdmin && (
              <div style={{ gridColumn:"1/-1" }}>
                <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>โรงพยาบาล</div>
                <select value={form.hospId} onChange={e=>setForm(f=>({...f,hospId:e.target.value}))} style={{ width:"100%",padding:"6px 10px",fontSize:12,border:`0.5px solid ${T.line}`,borderRadius:8,background:T.card,color:T.ink }}>
                  {hospitals.map(hx=><option key={hx.id} value={hx.id}>{hx.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:10,color:T.muted,marginBottom:5 }}>สิทธิ์การรักษา</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5 }}>
                {PAYMENT_TYPES.map(pt=>{
                  const on=form.paymentType===pt.key;
                  return (
                    <div key={pt.key} onClick={()=>setForm(f=>({...f,paymentType:on?"":pt.key}))}
                      style={{ padding:"5px 8px",borderRadius:7,cursor:"pointer",border:on?`1.5px solid ${pt.color}`:`0.5px solid ${T.line}`,background:on?pt.bg:T.card,display:"flex",alignItems:"center",gap:4 }}>
                      {pt.fastResult && <i className="ti ti-bolt" style={{ fontSize:10,color:pt.color }}></i>}
                      <span style={{ fontSize:10,fontWeight:on?700:400,color:on?pt.color:T.muted }}>{pt.short}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:10,color:T.muted,marginBottom:3 }}>หมายเหตุ</div>
              <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="หมายเหตุเพิ่มเติม..." style={{ width:"100%",padding:"6px 10px",fontSize:12,border:`0.5px solid ${T.line}`,borderRadius:8,outline:"none",background:T.card,color:T.ink,boxSizing:"border-box" }} />
            </div>
          </div>
          <div style={{ ...R,gap:7,marginTop:2 }}>
            <Btn variant="primary" small onClick={saveEdit}><i className="ti ti-check" style={{ fontSize:12 }}></i> บันทึก</Btn>
            <Btn variant="outline" small onClick={()=>setMode(null)}>ยกเลิก</Btn>
            {isAdmin && <Btn variant="danger" small style={{ marginLeft:"auto" }} onClick={()=>{ if(window.confirm("ลบนัดหมายนี้?")) onDelete(); }}><i className="ti ti-trash" style={{ fontSize:12 }}></i> ลบ</Btn>}
          </div>
        </div>
      )}

      {/* ── Action panel (reschedule / cancel tabs) ── */}
      {mode==="action" && (
        <div style={{ borderTop:`0.5px solid #fecaca`, background:"#fff8f8" }}>
          {/* Tab switcher */}
          <div style={{ ...R, borderBottom:`0.5px solid #fecaca` }}>
            {[["reschedule","ti-calendar-time","เลื่อนนัด","#854d0e","#fefce8","#fde68a"],
              ["cancel",     "ti-calendar-x",  "ยกเลิกนัด", T.red,     T.redL,  "#fecaca"]].map(([id,ic,lb,col,bg,br])=>(
              <div key={id} onClick={()=>setActionTab(id)} style={{ flex:1,padding:"9px 0",textAlign:"center",cursor:"pointer",background:actionTab===id?bg:"transparent",borderBottom:actionTab===id?`2px solid ${col}`:"2px solid transparent",transition:"all .15s" }}>
                <i className={`ti ${ic}`} style={{ fontSize:13,color:col,marginRight:5 }}></i>
                <span style={{ fontSize:12,fontWeight:actionTab===id?700:400,color:col }}>{lb}</span>
              </div>
            ))}
          </div>

          {/* Reschedule sub-panel */}
          {actionTab==="reschedule" && (
            <div style={{ padding:"12px 13px 13px",...FL,gap:10 }}>
              <div style={{ fontSize:11,fontWeight:600,color:"#92400e" }}>
                <i className="ti ti-calendar-time" style={{ marginRight:5 }}></i>เลื่อนนัดหมายไปวันที่
              </div>
              <div style={{ ...R,gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,color:T.muted,marginBottom:4 }}>วันที่ใหม่</div>
                  <input type="date" value={reschedDate} onChange={e=>setReschedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ width:"100%",padding:"7px 11px",fontSize:12,border:`0.5px solid #fde68a`,borderRadius:9,outline:"none",background:"#fff",color:T.ink,boxSizing:"border-box" }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize:10,color:T.muted,marginBottom:4 }}>เหตุผลการเลื่อน (ไม่บังคับ)</div>
                <input value={reschedNote} onChange={e=>setReschedNote(e.target.value)} placeholder="เช่น ผู้ป่วยติดธุระ / รพ.ขอเลื่อน..." style={{ width:"100%",padding:"7px 11px",fontSize:12,border:`0.5px solid #fde68a`,borderRadius:9,outline:"none",background:"#fff",color:T.ink,boxSizing:"border-box" }} />
              </div>
              <div style={{ ...R,gap:7 }}>
                <button onClick={confirmReschedule} disabled={!reschedDate} style={{ padding:"7px 16px",fontSize:12,borderRadius:9,background:reschedDate?"#d97706":"#e5e7eb",color:reschedDate?"#fff":"#9ca3af",border:"none",cursor:reschedDate?"pointer":"not-allowed",fontWeight:600,...R,gap:5 }}>
                  <i className="ti ti-calendar-check" style={{ fontSize:13 }}></i> ยืนยันเลื่อนนัด
                </button>
                <Btn variant="ghost" small onClick={()=>setMode(null)}>ยกเลิก</Btn>
              </div>
            </div>
          )}

          {/* Cancel sub-panel */}
          {actionTab==="cancel" && (
            <div style={{ padding:"12px 13px 13px",...FL,gap:10 }}>
              <div style={{ fontSize:11,fontWeight:600,color:T.red }}>
                <i className="ti ti-calendar-x" style={{ marginRight:5 }}></i>ยกเลิกนัดหมาย — ระบุเหตุผล
              </div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {CANCEL_REASONS.map(r=>(
                  <div key={r} onClick={()=>setCancelReason(r)} style={{ padding:"5px 12px",fontSize:11,borderRadius:20,cursor:"pointer",border:cancelReason===r?`1.5px solid ${T.red}`:`0.5px solid #fecaca`,background:cancelReason===r?T.redL:"#fff",color:cancelReason===r?T.red:T.muted,fontWeight:cancelReason===r?600:400,transition:"all .1s" }}>{r}</div>
                ))}
              </div>
              {cancelReason==="อื่นๆ" && (
                <input value={customReason} onChange={e=>setCustomReason(e.target.value)} placeholder="ระบุเหตุผลอื่นๆ..." style={{ padding:"7px 11px",fontSize:12,border:`0.5px solid #fecaca`,borderRadius:9,outline:"none",background:"#fff",color:T.ink }} />
              )}
              <div style={{ ...R,gap:7 }}>
                <Btn variant="danger" small disabled={!cancelReason||(cancelReason==="อื่นๆ"&&!customReason.trim())} onClick={confirmCancel}>
                  <i className="ti ti-x" style={{ fontSize:12 }}></i> ยืนยันยกเลิก
                </Btn>
                <Btn variant="ghost" small onClick={()=>setMode(null)}>ไม่ยกเลิก</Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}

// ── Assign Row (inside each day) ──────────────────────────────────────────────
function AssignRow({ dateKey,techs,assigned,checked,canEdit,canCheckin,onToggleAssign,onToggleCheckin }) {
  const [open,setOpen] = useState(false);
  return (
    <div style={{ borderTop:`0.5px solid ${T.line}`,marginTop:6,paddingTop:8 }}>
      <div style={{ ...R,gap:6,flexWrap:"wrap" }}>
        <span style={{ fontSize:10,color:T.faint,...R,gap:4 }}><i className="ti ti-stethoscope" style={{ fontSize:11 }}></i>Tech:</span>
        {assigned.length===0 && <span style={{ fontSize:10,color:T.faint }}>ยังไม่ assign</span>}
        {assigned.map(id=>{ const t=techs.find(x=>x.id===id); if(!t) return null; const ok=checked.includes(id); const ci=techs.findIndex(x=>x.id===id); const c=TPOOL[ci%TPOOL.length]; return (
          <span key={id} onClick={canCheckin?()=>onToggleCheckin(id):undefined} style={{ fontSize:11,padding:"3px 10px",borderRadius:20,background:ok?"#dcfce7":c.bg,color:ok?"#166534":c.text,fontWeight:500,...R,gap:4,cursor:canCheckin?"pointer":"default",border:`0.5px solid ${ok?"#86efac":c.dot}`,transition:"all .12s" }}>
            {ok&&<i className="ti ti-check" style={{ fontSize:10 }}></i>}{t.name}
          </span>
        );})}
        {canEdit && <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}} style={{ marginLeft:"auto",fontSize:11,padding:"3px 10px",borderRadius:8,border:`0.5px solid ${T.line}`,background:T.card,color:T.muted,cursor:"pointer" }}>{open?"เสร็จ":"+ Assign"}</button>}
      </div>
      {open && canEdit && (
        <div style={{ marginTop:8,padding:"12px 14px",background:"#f5f3ff",border:"0.5px solid #ddd6fe",borderRadius:10,display:"flex",flexDirection:"column",gap:6 }}>
          {techs.map((t,i)=>{ const c=TPOOL[i%TPOOL.length]; const on=assigned.includes(t.id); return (
            <div key={t.id} onClick={()=>onToggleAssign(t.id)} style={{ ...R,gap:10,padding:"9px 12px",borderRadius:10,cursor:"pointer",background:on?c.bg:T.card,border:`0.5px solid ${on?c.dot:T.line}`,transition:"all .1s" }}>
              <TAvatar tech={t} techs={techs} size={28} />
              <span style={{ fontSize:13,color:on?c.text:T.ink,fontWeight:on?700:400,flex:1 }}>{t.name}</span>
              {on&&<i className="ti ti-check" style={{ fontSize:14,color:c.dot }}></i>}
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

// ── Line Message Parser (Regex — ไม่ต้องใช้ AI API) ──────────────────────────
function parseLineText(text, defaultHospId) {
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);

  // isBlockStart: bare HN digits เท่านั้น (ไม่ใช่ "HN: xxx")
  const isBlockStart = l => /^\d{6,12}$/.test(l) || /^\d[-\/]\d{2,3}[-\/]\d+/.test(l);
  // isHNField: ทุก format สำหรับ extract
  const isHNField = l => isBlockStart(l) || /^(hn|HN)\s*[:\-\s]\s*[\d\-]+/i.test(l);
  // isNameStart: ชื่อนำ
  const isNameStart = l => /^(น\.ส\.|นางสาว|นาย[\s$]|นาง[\s$]|ด\.ญ\.|เด็กหญิง|ด\.ช\.|เด็กชาย)/i.test(l);

  const blocks = [];
  let cur = [], curHasName = false;
  lines.forEach(l => {
    // ตัด block ใหม่เมื่อ: พบ bare HN (เสมอ) หรือ พบชื่อใหม่หลังจากมีชื่อแล้ว
    const brk = (isBlockStart(l) && cur.length>0) || (isNameStart(l) && curHasName && cur.length>0);
    if(brk) { blocks.push([...cur]); cur=[]; curHasName=false; }
    if(isNameStart(l)) curHasName=true;
    cur.push(l);
  });
  if(cur.length) blocks.push(cur);

  const today = new Date().toISOString().split("T")[0];
  const results = [];

  blocks.forEach((blines, bi) => {
    let hn="", name="", phone="", date="", diagnosis="";
    blines.forEach(l => {
      if(!hn && isHNField(l)) {
        hn = l.replace(/^(hn|HN)\s*[:\-\s]\s*/i,"").replace(/\//g,"-").trim(); return;
      }
      if(!diagnosis && /(?:โรค|โรคประจำตัว|underlying|dx|diagnosis|ประวัติ)/i.test(l)) {
        diagnosis = l.replace(/^(?:โรค|โรคประจำตัว|underlying|dx|diagnosis|ประวัติ)[:\s]*/i,"").trim()||"—"; return;
      }
      if(!phone) {
        const kw = l.match(/(?:โทร|tel|phone|เบอร์|mobile)\s*[:\s]?\s*([\d\-\+\s]{8,15})/i);
        if(kw) { phone=kw[1].replace(/[-\s]/g,"").trim(); return; }
        const bare = l.replace(/[-\s]/g,"");
        if(/^0\d{8,9}$/.test(bare)) { phone=bare; return; }
      }
      if(!date && /(?:จอง|วันที่|นัด|date|วัน|คิว)/i.test(l)) {
        const dm = l.match(/(\d{1,2})[-\/.](\d{1,2})(?:[-\/.](\d{2,4}))?/);
        if(dm) {
          const d=parseInt(dm[1]), mo=parseInt(dm[2]);
          let yr=dm[3]?parseInt(dm[3]):new Date().getFullYear()+543;
          if(yr<100) yr+=2500; if(yr>2400) yr-=543;
          if(yr<2000||yr>2100) yr=new Date().getFullYear();
          date=`${yr}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        }
        return;
      }
      if(!name && isNameStart(l)) { name=l.trim(); return; }
      if(!name && !/^\d/.test(l) && l.length>=4 && l.length<=80 &&
        !/^(ชื่อ|รพ|hospital|HN|โทร|เบอร์|tel|phone|date|วัน|จอง|นัด|โรค|dx|hn)/i.test(l)) {
        name=l; return;
      }
    });

    if(!hn&&!name) return;
    // Validate phone — ต้อง 10 หลัก
    const phoneDigits = phone.replace(/\D/g,"");
    const phoneValid  = phoneDigits.length===10;

    results.push({
      id: `p${Date.now()}_${bi}`,
      hn:         hn||"—",
      name:       name||"ไม่ระบุชื่อ",
      phone:      phoneValid ? phoneDigits : phone,
      phoneError: !phoneValid && phone ? `เบอร์ไม่ครบ 10 หลัก (${phoneDigits.length} หลัก)` : phone?"":  "ไม่มีเบอร์โทร",
      date:       date||today,
      note:       diagnosis ? `โรคประจำตัว: ${diagnosis}` : "",
      diagnosis,
      hospId:     defaultHospId||"",
      status:"active", apptType:"sleep_test", sleepTestType:"full_night",
      journeyStatus:"scheduled", cancelReason:"", cancelledAt:null,
    });
  });
  return results;
}

// ── Paste View ────────────────────────────────────────────────────────────────
function PasteView({ user, hospitals, setAppointments }) {
  const [text,    setText]   = useState("");
  const [parsed,  setParsed] = useState([]);
  const [loading, setLoading]= useState(false);
  const [saved,   setSaved]  = useState(false);
  const [error,   setError]  = useState("");

  const parse = () => {
    if(!text.trim()) return;
    setError(""); setParsed([]); setLoading(true);
    try {
      const results = parseLineText(text.trim(), user.hospId||hospitals[0]?.id);
      if(!results||results.length===0) {
        setError("ไม่พบข้อมูล — ตรวจสอบว่าข้อความมีรหัส HN (เลข) ชื่อ และโทรศัพท์");
      } else {
        setParsed(results);
      }
    } catch(e) {
      setError("เกิดข้อผิดพลาด: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    setAppointments(p=>[...p,...parsed]);
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setParsed([]); setText(""); }, 2000);
  };

  const updateParsed = (id, upd) => setParsed(p=>p.map(x=>x.id===id?{...x,...upd}:x));

  const safeFmt = s => {
    if(!s) return "—";
    try { const d=new Date(s); if(isNaN(d.getTime()))return s; return `${d.getDate()} ${TM[d.getMonth()]} ${d.getFullYear()+543}`; } catch(e){return s;}
  };

  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:16, height:"100%", overflowY:"auto" }}>
      <div style={{ background:T.card, border:`0.5px solid ${T.line}`, borderRadius:16, padding:18 }}>

        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"#f0f9ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ti ti-brand-line" style={{ fontSize:16, color:"#0284c7" }}></i>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>วางข้อความจาก Line</div>
            <div style={{ fontSize:11, color:T.faint }}>รองรับหลายรายการในครั้งเดียว</div>
          </div>
        </div>

        {/* Format guide */}
        <div style={{ marginBottom:12, padding:"10px 14px", background:"#f0f9ff", borderRadius:10, border:"1px solid #bae6fd" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#0369a1", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
            <i className="ti ti-info-circle" style={{ fontSize:13 }}></i> รูปแบบข้อความที่รองรับ
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:"#0369a1", marginBottom:5 }}>ตัวอย่าง 1 รายการ</div>
              <div style={{ padding:"8px 10px", background:"white", borderRadius:8, border:"0.5px solid #bae6fd", fontFamily:"monospace", fontSize:11, color:"#1e293b", lineHeight:1.9 }}>
                12349999<br/>
                น.ส.มีนา มืนม<br/>
                โทร0812345000<br/>
                จองวันที่1/7/69<br/>
                <span style={{ color:"#059669" }}>โรค DM, HT</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:"#0369a1", marginBottom:5 }}>หลายรายการ (เว้นบรรทัด)</div>
              <div style={{ padding:"8px 10px", background:"white", borderRadius:8, border:"0.5px solid #bae6fd", fontFamily:"monospace", fontSize:11, color:"#1e293b", lineHeight:1.9 }}>
                12349999<br/>
                น.ส.มีนา มืนม<br/>
                โทร0812345000<br/>
                จองวันที่1/7/69<br/>
                โรค DM<br/>
                <span style={{ color:"#94a3b8" }}>(เว้นบรรทัด)</span><br/>
                87654321<br/>
                นายสมชาย มีสุข<br/>
                ...
              </div>
            </div>
          </div>
          <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:5 }}>
            {[
              ["HN","12345678","#e0f2fe","#0369a1"],
              ["ชื่อ","น.ส./นาย/นาง","#e0f2fe","#0369a1"],
              ["โทร ★","10 หลัก บังคับ","#fef9c3","#92400e"],
              ["วันที่","จองวันที่1/10/69","#e0f2fe","#0369a1"],
              ["โรค ★","โรค DM, HT บังคับ","#dcfce7","#166534"],
            ].map(([k,v,bg,col])=>(
              <div key={k} style={{ fontSize:10, padding:"3px 9px", borderRadius:20, background:bg, color:col, display:"flex", gap:5 }}>
                <strong>{k}:</strong> {v}
              </div>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder={"วางข้อความจาก Line ที่นี่...\n\nตัวอย่าง:\n12349999\nน.ส.มีนา มืนม\nโทร0812345000\nจองวันที่1/7/69\nโรค DM, HT"}
          style={{ width:"100%", height:140, padding:"11px 13px", fontSize:12, fontFamily:"monospace", border:`1px solid ${T.line}`, borderRadius:10, background:"white", color:T.ink, resize:"vertical", outline:"none", lineHeight:1.9, boxSizing:"border-box" }}
        />

        <div style={{ marginTop:11 }}>
          <Btn variant="primary" onClick={parse} disabled={!text.trim()||loading}>
            <i className={`ti ${loading?"ti-loader ti-spin":"ti-file-search"}`} style={{ fontSize:14 }}></i>
            {loading?"กำลังแปลง...":"แปลงข้อความ"}
          </Btn>
        </div>

        {error && (
          <div style={{ marginTop:10, padding:"9px 13px", background:T.redL, border:"0.5px solid #fecaca", borderRadius:10, fontSize:12, color:"#991b1b", display:"flex", alignItems:"center", gap:8 }}>
            <i className="ti ti-alert-circle" style={{ fontSize:14 }}></i>{error}
          </div>
        )}
      </div>

      {/* Results */}
      {parsed.length>0 && (
        <div style={{ background:T.card, border:`0.5px solid ${T.line}`, borderRadius:16, overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"13px 16px", borderBottom:`0.5px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <i className="ti ti-check-circle" style={{ fontSize:16, color:T.green }}></i>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>พบ {parsed.length} รายการ</span>
              {parsed.some(a=>a.phoneError||!a.diagnosis) && (
                <span style={{ fontSize:11, padding:"2px 9px", borderRadius:10, background:"#fef9c3", color:"#92400e", fontWeight:600 }}>
                  ⚠ บางรายการไม่สมบูรณ์
                </span>
              )}
            </div>
            <Btn variant="green" small onClick={save}>
              <i className={`ti ${saved?"ti-check":"ti-calendar-plus"}`} style={{ fontSize:13 }}></i>
              {saved?"บันทึกแล้ว!":"บันทึกทั้งหมด"}
            </Btn>
          </div>

          {/* Each result */}
          {parsed.map((a,idx)=>{
            const c = hc(a.hospId,hospitals);
            const hasErr = !!(a.phoneError || !a.diagnosis);
            return (
              <div key={a.id} style={{ padding:"12px 16px", borderBottom:idx<parsed.length-1?`0.5px solid ${T.line}`:"none", background:hasErr?"#fffbeb":"white" }}>
                {/* Main row */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:hasErr?8:0 }}>
                  <Avatar name={a.name} hospId={a.hospId} size={38} hospitals={hospitals}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{a.name}</div>
                    <div style={{ fontSize:11, color:T.faint, marginTop:1 }}>HN {a.hn} · {a.phone||"—"}</div>
                    {a.diagnosis && (
                      <div style={{ fontSize:11, color:"#059669", marginTop:2 }}>โรค: {a.diagnosis}</div>
                    )}
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:c.text, background:c.bg, padding:"4px 9px", borderRadius:8, whiteSpace:"nowrap" }}>
                    {safeFmt(a.date)}
                  </div>
                  {user.role==="admin" && (
                    <select value={a.hospId} onChange={e=>updateParsed(a.id,{hospId:e.target.value})}
                      style={{ padding:"5px 8px", fontSize:11, border:`0.5px solid ${T.line}`, borderRadius:8, background:T.surf, color:T.ink }}>
                      {hospitals.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                  )}
                </div>

                {/* Warnings + quick-fix */}
                {hasErr && (
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {a.phoneError && (
                      <div style={{ fontSize:11, padding:"5px 10px", borderRadius:8, background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", display:"flex", alignItems:"center", gap:6 }}>
                        <i className="ti ti-alert-circle" style={{ fontSize:11 }}></i>
                        เบอร์โทร: {a.phoneError} →
                        <input
                          value={a.phone}
                          onChange={e=>{
                            const digits=e.target.value.replace(/\D/g,"").slice(0,10);
                            updateParsed(a.id,{
                              phone:digits,
                              phoneError:digits.length===10?"":digits.length>0?`ไม่ครบ 10 หลัก (${digits.length} หลัก)`:"ไม่มีเบอร์โทร"
                            });
                          }}
                          placeholder="0XXXXXXXXX" maxLength={10}
                          style={{ padding:"2px 8px", fontSize:11, border:"1px solid #fecaca", borderRadius:6, width:110, outline:"none", fontFamily:"monospace" }}
                        />
                      </div>
                    )}
                    {!a.diagnosis && (
                      <div style={{ fontSize:11, padding:"5px 10px", borderRadius:8, background:"#f0fdf4", border:"1px solid #86efac", color:"#059669", display:"flex", alignItems:"center", gap:6 }}>
                        <i className="ti ti-heart-plus" style={{ fontSize:11 }}></i>
                        โรคประจำตัว:
                        <input
                          value={a.diagnosis||""}
                          onChange={e=>{
                            const dx=e.target.value;
                            updateParsed(a.id,{ diagnosis:dx, note:dx?`โรคประจำตัว: ${dx}`:"" });
                          }}
                          placeholder="DM, HT, ..."
                          style={{ padding:"2px 8px", fontSize:11, border:"1px solid #86efac", borderRadius:6, width:130, outline:"none" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ── Manage Hospitals ──────────────────────────────────────────────────────────
function ManageHospitals({ hospitals,setHospitals }) {
  const [adding,setAdding] = useState(false);
  const [editPriceId, setEditPriceId] = useState(null);
  const [priceVal, setPriceVal] = useState(5800);
  const [form,setForm] = useState({ name:"",short:"",city:"",type:"private_ins",cap:2,psgPrice:5800,cpapOnly:false });
  const setF = upd => setForm(f=>({...f,...upd}));

  const add = () => {
    if(!form.name.trim()) return;
    const isCpapOnly = form.cpapOnly;
    setHospitals(p=>[...p,{
      id:"h"+Date.now(),
      name:form.name.trim(),
      short:form.short.trim()||form.name.split(" ").slice(-1)[0],
      city:form.city.trim(),
      type:form.type,
      cap:isCpapOnly?0:Number(form.cap)||2,
      psgPrice:isCpapOnly?0:Number(form.psgPrice)||5800,
      cpapOnly:isCpapOnly,
    }]);
    setForm({ name:"",short:"",city:"",type:"private_ins",cap:2,psgPrice:5800,cpapOnly:false });
    setAdding(false);
  };
  const savePrice = (id) => {
    setHospitals(p=>p.map(h=>h.id===id?{...h,psgPrice:Number(priceVal)||5800}:h));
    setEditPriceId(null);
  };
  const toggleCpapOnly = (id) => {
    setHospitals(p=>p.map(h=>{
      if(h.id!==id) return h;
      const now = !h.cpapOnly;
      return {...h,cpapOnly:now,cap:now?0:h.cap||2,psgPrice:now?0:h.psgPrice||5800};
    }));
  };

  const sleepHosps = hospitals.filter(h=>!h.cpapOnly);
  const cpapHosps  = hospitals.filter(h=>h.cpapOnly);

  return (
    <div style={{ padding:20,...FL,gap:14,height:"100%",overflowY:"auto" }}>
      <div style={{ ...R,justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:15,fontWeight:700,color:T.navy }}>โรงพยาบาลในระบบ ({hospitals.length})</div>
          <div style={{ fontSize:11,color:T.faint,marginTop:2 }}>แบ่งเป็น Sleep Test และ CPAP-only</div>
        </div>
        <Btn variant="primary" small onClick={()=>setAdding(a=>!a)}><i className="ti ti-plus" style={{ fontSize:13 }}></i> เพิ่ม รพ.</Btn>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background:T.card,border:`0.5px solid ${T.line}`,borderRadius:14,padding:16,...FL,gap:10 }}>
          <div style={{ fontSize:12,fontWeight:700,color:T.ink }}>เพิ่มโรงพยาบาลใหม่</div>

          {/* CPAP-only toggle — ตัวเลือกสำคัญ */}
          <div style={{ padding:"11px 14px",borderRadius:11,border:`2px solid ${form.cpapOnly?"#7c3aed":"#e2e8f0"}`,background:form.cpapOnly?"#f5f3ff":"#f8fafc",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}
            onClick={()=>setF({cpapOnly:!form.cpapOnly})}>
            <div style={{ width:44,height:24,borderRadius:12,background:form.cpapOnly?"#7c3aed":"#e2e8f0",position:"relative",transition:"background .15s",flexShrink:0 }}>
              <div style={{ width:20,height:20,borderRadius:"50%",background:"white",position:"absolute",top:2,left:form.cpapOnly?22:2,transition:"left .15s",boxShadow:"0 1px 3px rgba(0,0,0,.2)" }}/>
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:700,color:form.cpapOnly?"#7c3aed":T.ink }}>
                {form.cpapOnly?"🏥 CPAP-only — ไม่ทำ Sleep Test":"🛌 Sleep Test + CPAP (ปกติ)"}
              </div>
              <div style={{ fontSize:11,color:form.cpapOnly?"#7c3aed":T.faint,marginTop:2 }}>
                {form.cpapOnly?"ขายและทดลองเครื่อง CPAP เท่านั้น — ไม่มี PSG / capacity":"รพ. ทำ Sleep Test ปกติ มี capacity และราคา PSG"}
              </div>
            </div>
          </div>

          {/* Basic info */}
          {[["name","ชื่อเต็ม เช่น รพ. จุฬาลงกรณ์"],["short","ชื่อย่อ"],["city","จังหวัด"]].map(([k,ph])=>(
            <input key={k} value={form[k]} onChange={e=>setF({[k]:e.target.value})} placeholder={ph}
              style={{ padding:"9px 12px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,outline:"none",background:T.surf,color:T.ink }}/>
          ))}
          <select value={form.type} onChange={e=>setF({type:e.target.value})}
            style={{ padding:"9px 12px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,background:T.surf,color:T.ink }}>
            {Object.entries(HOSP_TYPE_LABEL).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>

          {/* Capacity + PSG price — hide for cpapOnly */}
          {!form.cpapOnly && (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              <div>
                <div style={{ fontSize:11,color:T.muted,marginBottom:4 }}>Capacity/วัน</div>
                <select value={form.cap} onChange={e=>setF({cap:Number(e.target.value)})}
                  style={{ width:"100%",padding:"8px 10px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,background:T.surf,color:T.ink }}>
                  <option value={1}>1 คน/วัน</option><option value={2}>2 คน/วัน</option><option value={3}>3 คน/วัน</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize:11,color:T.muted,marginBottom:4 }}>ราคาตรวจ PSG (บาท)</div>
                <input type="number" value={form.psgPrice} onChange={e=>setF({psgPrice:e.target.value})}
                  style={{ width:"100%",padding:"8px 12px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,outline:"none",background:T.surf,color:T.ink,boxSizing:"border-box" }}/>
              </div>
            </div>
          )}

          <div style={{ ...R,gap:8 }}>
            <Btn variant="primary" small onClick={add} disabled={!form.name.trim()}>
              <i className="ti ti-check" style={{ fontSize:12 }}></i> บันทึก
            </Btn>
            <Btn variant="outline" small onClick={()=>setAdding(false)}>ยกเลิก</Btn>
          </div>
        </div>
      )}

      {/* ── Sleep Test hospitals ── */}
      {sleepHosps.length>0 && (
        <div>
          <div style={{ fontSize:12,fontWeight:700,color:T.muted,marginBottom:8,display:"flex",alignItems:"center",gap:6 }}>
            <i className="ti ti-moon" style={{ fontSize:13 }}></i>Sleep Test + CPAP ({sleepHosps.length} แห่ง)
          </div>
          <div style={{ ...FL,gap:7 }}>
            {sleepHosps.map(h=>{ const c=hc(h.id,hospitals); const isEdit=editPriceId===h.id; return (
              <div key={h.id} style={{ background:T.card,border:`0.5px solid ${T.line}`,borderRadius:12 }}>
                <div style={{ ...R,gap:12,padding:"11px 14px" }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <i className="ti ti-building-hospital" style={{ fontSize:16,color:c.text }}></i>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{h.name}</div>
                    <div style={{ fontSize:11,color:T.faint }}>{h.city&&`${h.city} · `}{HOSP_TYPE_LABEL[h.type]} · cap {h.cap}/วัน</div>
                  </div>
                  <div style={{ textAlign:"center",padding:"5px 11px",background:"#fef9c3",borderRadius:9,border:"0.5px solid #fde68a" }}>
                    <div style={{ fontSize:13,fontWeight:800,color:"#92400e" }}>{(h.psgPrice||5800).toLocaleString()}</div>
                    <div style={{ fontSize:9,color:"#92400e",opacity:.7 }}>บาท/case</div>
                  </div>
                  <button onClick={()=>{ setEditPriceId(isEdit?null:h.id); setPriceVal(h.psgPrice||5800); }}
                    style={{ padding:"5px 11px",fontSize:11,fontWeight:600,border:`1px solid ${isEdit?"#1d4ed8":"#e2e8f0"}`,borderRadius:8,background:isEdit?T.blueL:"white",color:isEdit?T.blue:"#475569",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-currency-baht" style={{fontSize:12}}></i>แก้ราคา PSG
                  </button>
                  <button onClick={()=>{ if(window.confirm(`ลบ "${h.name}" ออกจากระบบ?`)) setHospitals(p=>p.filter(x=>x.id!==h.id)); }}
                    style={{ padding:"5px 11px",fontSize:11,fontWeight:600,border:"1px solid #fecaca",borderRadius:8,background:"#fef2f2",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-trash" style={{fontSize:12}}></i>ลบ
                  </button>
                </div>
                {isEdit && (
                  <div style={{ padding:"11px 14px",borderTop:"0.5px solid #fde68a",background:"#fffbeb",...R,gap:10,alignItems:"flex-end" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11,fontWeight:600,color:"#92400e",marginBottom:5 }}>ราคาตรวจ PSG ต่อ case (บาท)</div>
                      <input type="number" value={priceVal} onChange={e=>setPriceVal(e.target.value)}
                        style={{ width:"100%",padding:"9px 12px",fontSize:16,fontWeight:700,border:"1.5px solid #f59e0b",borderRadius:9,outline:"none",background:"white",color:"#92400e",fontFamily:FONT,boxSizing:"border-box" }}/>
                    </div>
                    <Btn variant="primary" small onClick={()=>savePrice(h.id)}><i className="ti ti-check" style={{ fontSize:12 }}></i> บันทึก</Btn>
                    <Btn variant="outline" small onClick={()=>setEditPriceId(null)}>ยกเลิก</Btn>
                  </div>
                )}
              </div>
            );})}
          </div>
        </div>
      )}

      {/* ── CPAP-only hospitals ── */}
      {cpapHosps.length>0 && (
        <div>
          <div style={{ fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:8,display:"flex",alignItems:"center",gap:6 }}>
            <i className="ti ti-device-heart-monitor" style={{ fontSize:13 }}></i>CPAP-only — ไม่ทำ Sleep Test ({cpapHosps.length} แห่ง)
          </div>
          <div style={{ ...FL,gap:7 }}>
            {cpapHosps.map(h=>{ const c=hc(h.id,hospitals); return (
              <div key={h.id} style={{ background:"#fafaff",border:"1.5px solid #ddd6fe",borderRadius:12,...R,gap:12,padding:"11px 14px" }}>
                <div style={{ width:34,height:34,borderRadius:9,background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <i className="ti ti-device-heart-monitor" style={{ fontSize:16,color:"#7c3aed" }}></i>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{h.name}</div>
                  <div style={{ fontSize:11,color:"#7c3aed" }}>{h.city&&`${h.city} · `}{HOSP_TYPE_LABEL[h.type]}</div>
                </div>
                {/* CPAP Only badge */}
                <div style={{ padding:"4px 11px",borderRadius:20,background:"#ede9fe",border:"1px solid #a78bfa" }}>
                  <span style={{ fontSize:11,fontWeight:700,color:"#7c3aed" }}>CPAP Sales เท่านั้น</span>
                </div>
                {/* Toggle back to full */}
                <button onClick={()=>toggleCpapOnly(h.id)} title="เปลี่ยนเป็น Sleep Test + CPAP"
                  style={{ padding:"5px 11px",fontSize:11,fontWeight:600,border:"1px solid #e2e8f0",borderRadius:8,background:"white",color:"#475569",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                  <i className="ti ti-transfer" style={{fontSize:12}}></i>เปลี่ยนเป็น Sleep Test
                </button>
                <button onClick={()=>{ if(window.confirm(`ลบ "${h.name}" ออกจากระบบ?`)) setHospitals(p=>p.filter(x=>x.id!==h.id)); }}
                  style={{ padding:"5px 11px",fontSize:11,fontWeight:600,border:"1px solid #fecaca",borderRadius:8,background:"#fef2f2",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                  <i className="ti ti-trash" style={{fontSize:12}}></i>ลบ
                </button>
              </div>
            );})}
          </div>
        </div>
      )}

      <div style={{ padding:"11px 14px",background:"#fef9c3",borderRadius:11,border:"0.5px solid #fde68a",...R,gap:8 }}>
        <i className="ti ti-info-circle" style={{ fontSize:14,color:"#92400e",flexShrink:0 }}></i>
        <div style={{ fontSize:12,color:"#92400e" }}>
          CPAP-only คือ รพ. ที่มีเฉพาะ CPAP Sales — จะไม่ปรากฎในตารางนัดหมาย Sleep Test
          · Sleep Test+CPAP ตั้งราคา PSG ได้โดยกดไอคอน 💰
        </div>
      </div>
    </div>
  );
}

  const add = () => {
    if(!form.name.trim()) return;
    setHospitals(p=>[...p,{ id:"h"+Date.now(),...form,name:form.name.trim(),short:form.short.trim()||form.name.trim(),city:form.city.trim(),cap:Number(form.cap)||2,psgPrice:Number(form.psgPrice)||5800 }]);
    setForm({ name:"",short:"",city:"",type:"private_ins",cap:2,psgPrice:5800 });
    setAdding(false);
  };
  const savePrice = (id) => {
    setHospitals(p=>p.map(h=>h.id===id?{...h,psgPrice:Number(priceVal)||5800}:h));
    setEditPriceId(null);
  };


// ── Manage Sales ─────────────────────────────────────────────────────────────
function ManageSales({ salesList=[], setSalesList }) {
  const [newName, setNewName] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const add = () => {
    const n = newName.trim();
    if(!n || salesList.includes(n)) return;
    setSalesList(p=>[...p, n]);
    setNewName("");
  };
  const remove = (idx) => { if(window.confirm(`ลบ "${salesList[idx]}" ออกจากรายชื่อ Sales?`)) setSalesList(p=>p.filter((_,i)=>i!==idx)); };
  const saveEdit = (idx) => {
    const n = editVal.trim();
    if(!n) return;
    setSalesList(p=>p.map((s,i)=>i===idx?n:s));
    setEditIdx(null); setEditVal("");
  };

  return (
    <div style={{ marginTop:8, padding:"18px 0 0" }}>
      {/* Divider */}
      <div style={{ borderTop:`1px solid ${T.line}`, paddingTop:18, marginBottom:14 }}>
        <div style={{ ...R, justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.navy }}>รายชื่อ Sales ({salesList.length} คน)</div>
            <div style={{ fontSize:11, color:T.faint, marginTop:2 }}>ชื่อเหล่านี้จะแสดงใน Sale Report 3N และ Dropdown เลือก Sales</div>
          </div>
        </div>

        {/* Add new */}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <input
            value={newName}
            onChange={e=>setNewName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add()}
            placeholder="ชื่อ-นามสกุล Sales คนใหม่"
            style={{ flex:1, padding:"9px 13px", fontSize:13, border:`1.5px solid ${T.line}`, borderRadius:10, outline:"none", background:T.card, color:T.ink, fontFamily:FONT }}
            onFocus={e=>e.target.style.borderColor="#059669"}
            onBlur={e=>e.target.style.borderColor=T.line}
          />
          <button onClick={add} disabled={!newName.trim()}
            style={{ padding:"9px 18px", fontSize:13, fontWeight:700, borderRadius:10, background:newName.trim()?"#059669":"#e2e8f0", color:newName.trim()?"white":"#94a3b8", border:"none", cursor:newName.trim()?"pointer":"not-allowed", fontFamily:FONT, display:"flex", alignItems:"center", gap:6 }}>
            <i className="ti ti-plus" style={{ fontSize:14 }}></i> เพิ่ม
          </button>
        </div>

        {/* Sales list */}
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {salesList.map((name,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:T.card, border:`0.5px solid ${T.line}`, borderRadius:11 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13, fontWeight:700, color:"#059669" }}>
                {name.trim().split(" ").map(w=>w[0]||"").join("").slice(0,2)}
              </div>
              {editIdx===i ? (
                <>
                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEdit(i)}
                    style={{ flex:1, padding:"6px 10px", fontSize:13, border:`1.5px solid #059669`, borderRadius:8, outline:"none", background:"white", color:T.ink, fontFamily:FONT }} autoFocus />
                  <button onClick={()=>saveEdit(i)} style={{ padding:"5px 12px", fontSize:12, fontWeight:700, borderRadius:8, background:"#059669", color:"white", border:"none", cursor:"pointer" }}>บันทึก</button>
                  <button onClick={()=>setEditIdx(null)} style={{ padding:"5px 10px", fontSize:12, borderRadius:8, border:`0.5px solid ${T.line}`, background:T.card, color:T.muted, cursor:"pointer" }}>ยกเลิก</button>
                </>
              ) : (
                <>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color:T.ink }}>{name}</span>
                  <button onClick={()=>{ setEditIdx(i); setEditVal(name); }}
                    style={{ padding:"5px 12px",fontSize:11,fontWeight:600,border:`1px solid #e2e8f0`,borderRadius:8,background:"white",color:"#475569",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-edit" style={{fontSize:12}}></i>แก้ชื่อ
                  </button>
                  <button onClick={()=>remove(i)}
                    style={{ padding:"5px 12px",fontSize:11,fontWeight:600,border:"1px solid #fecaca",borderRadius:8,background:"#fef2f2",color:T.red,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-trash" style={{fontSize:12}}></i>ลบ
                  </button>
                </>
              )}
            </div>
          ))}
          {salesList.length===0 && (
            <div style={{ padding:"20px", textAlign:"center", color:T.faint, fontSize:13, background:T.surf, borderRadius:11, border:`0.5px solid ${T.line}` }}>
              ยังไม่มีรายชื่อ Sales — กรอกชื่อแล้วกด "เพิ่ม" ด้านบนค่ะ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Manage Techs ─────────────────────────────────────────────────────────────
function ManageTechs({ techs, setTechs, techRates, setTechRates, salesList=[], setSalesList }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({ name:"", nick:"" });
  const [editRateId, setEditRateId] = useState(null);
  const [rateForm, setRateForm]     = useState({ rate1:675, rate2:607.5, scoreRate:350 });

  const add = () => {
    if(!form.name.trim()) return;
    const id = "st"+Date.now();
    setTechs(p=>[...p,{ id, name:form.name.trim(), nick:form.nick.trim()||form.name.split(" ")[0] }]);
    setTechRates(p=>({...p,[id]:{ ...DEFAULT_RATE }}));
    setForm({ name:"",nick:"" }); setAdding(false);
  };
  const saveRate = (id) => {
    setTechRates(p=>({...p,[id]:{ rate1:Number(rateForm.rate1)||675, rate2:Number(rateForm.rate2)||607.5, scoreRate:Number(rateForm.scoreRate)||350 }}));
    setEditRateId(null);
  };
  const openRate = (t) => {
    const r=(techRates||{})[t.id]||DEFAULT_RATE;
    setRateForm({ rate1:r.rate1, rate2:r.rate2, scoreRate:r.scoreRate });
    setEditRateId(t.id);
  };

  return (
    <div style={{ padding:20,...FL,gap:14,height:"100%",overflowY:"auto" }}>
      <div style={{ ...R,justifyContent:"space-between" }}>
        <div style={{ fontSize:15,fontWeight:700,color:T.navy }}>Sleep Technician ({techs.length} คน)</div>
        <Btn variant="purple" small onClick={()=>setAdding(a=>!a)}><i className="ti ti-plus" style={{ fontSize:13 }}></i> เพิ่ม Tech</Btn>
      </div>

      {adding&&(
        <div style={{ background:T.card,border:`0.5px solid ${T.line}`,borderRadius:14,padding:16,...FL,gap:9 }}>
          <div style={{ fontSize:12,fontWeight:700,color:T.ink }}>เพิ่ม Sleep Technician</div>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="ชื่อ-นามสกุล" style={{ padding:"8px 12px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,outline:"none",background:T.surf,color:T.ink }} />
          <input value={form.nick} onChange={e=>setForm(f=>({...f,nick:e.target.value}))} placeholder="ชื่อเล่น (ไม่บังคับ)" style={{ padding:"8px 12px",fontSize:13,border:`0.5px solid ${T.line}`,borderRadius:9,outline:"none",background:T.surf,color:T.ink }} />
          <div style={{ ...R,gap:8 }}><Btn variant="purple" small onClick={add}><i className="ti ti-check" style={{ fontSize:12 }}></i> บันทึก</Btn><Btn variant="outline" small onClick={()=>setAdding(false)}>ยกเลิก</Btn></div>
        </div>
      )}

      {/* Rate table header */}
      <div style={{ padding:"8px 14px",background:"#f5f3ff",borderRadius:10,border:"0.5px solid #ddd6fe",...R,gap:0 }}>
        <div style={{ flex:1,fontSize:11,fontWeight:700,color:"#5b21b6" }}>ชื่อ Tech</div>
        <div style={{ width:80,fontSize:10,color:"#7c3aed",textAlign:"center" }}>ติด 1 case</div>
        <div style={{ width:90,fontSize:10,color:"#7c3aed",textAlign:"center" }}>ติด 2+ case</div>
        <div style={{ width:80,fontSize:10,color:"#7c3aed",textAlign:"center" }}>Score/อ่านผล</div>
        <div style={{ width:36 }}></div>
      </div>

      <div style={{ ...FL,gap:8 }}>
        {techs.map((t,i)=>{
          const c = TPOOL[i%TPOOL.length];
          const r = (techRates||{})[t.id] || DEFAULT_RATE;
          const isEdit = editRateId===t.id;
          return (
            <div key={t.id} style={{ background:T.card,border:`0.5px solid ${T.line}`,borderRadius:12,overflow:"hidden" }}>
              {/* Main row */}
              <div style={{ ...R,gap:12,padding:"12px 14px" }}>
                <div style={{ width:42,height:42,borderRadius:"50%",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:c.text,flexShrink:0,border:`1.5px solid ${c.dot}` }}>{tinit(t.name)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.ink }}>{t.name}</div>
                  <div style={{ fontSize:11,color:T.faint,marginTop:1 }}>ชื่อเล่น: {t.nick}</div>
                </div>
                {/* Rate pills */}
                <div style={{ ...R,gap:6 }}>
                  {[["1 case",r.rate1],["2+",r.rate2],["Score",r.scoreRate]].map(([lb,val])=>(
                    <div key={lb} style={{ textAlign:"center",padding:"5px 9px",background:"#f5f3ff",borderRadius:9,border:"0.5px solid #ddd6fe" }}>
                      <div style={{ fontSize:10,color:"#7c3aed",fontWeight:500 }}>{lb}</div>
                      <div style={{ fontSize:12,fontWeight:700,color:"#5b21b6" }}>{Number(val).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...R,gap:6 }}>
                  <button onClick={()=>isEdit?setEditRateId(null):openRate(t)}
                    style={{ padding:"5px 12px",fontSize:11,fontWeight:600,border:`1px solid ${isEdit?"#a78bfa":"#e2e8f0"}`,borderRadius:8,background:isEdit?"#ede9fe":"white",color:isEdit?"#7c3aed":"#475569",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-currency-baht" style={{fontSize:12}}></i>{isEdit?"ปิด":"แก้ค่าตรวจ"}
                  </button>
                  <button onClick={()=>{ if(window.confirm(`ลบ "${t.name}" ออกจากรายชื่อ?`)) setTechs(p=>p.filter(x=>x.id!==t.id)); }}
                    style={{ padding:"5px 12px",fontSize:11,fontWeight:600,border:"1px solid #fecaca",borderRadius:8,background:"#fef2f2",color:T.red,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <i className="ti ti-trash" style={{fontSize:12}}></i>ลบ
                  </button>
                </div>
              </div>

              {/* Rate editor */}
              {isEdit && (
                <div style={{ padding:"12px 14px",borderTop:"0.5px solid #ddd6fe",background:"#faf5ff",...FL,gap:10 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:"#5b21b6",marginBottom:2 }}>
                    <i className="ti ti-currency-baht" style={{ marginRight:5 }}></i>
                    ตั้งค่าค่าตอบแทน — {t.name}
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                    {[
                      ["rate1","ค่าติด 1 case/วัน (บาท)","675"],
                      ["rate2","ค่าติด 2+ case/วัน/case (บาท)","607.5"],
                      ["scoreRate","ค่า Score/อ่านผล (บาท)","350"],
                    ].map(([k,label,ph])=>(
                      <div key={k}>
                        <div style={{ fontSize:10,color:"#7c3aed",fontWeight:600,marginBottom:4 }}>{label}</div>
                        <input type="number" value={rateForm[k]} onChange={e=>setRateForm(f=>({...f,[k]:e.target.value}))}
                          placeholder={ph} style={{ width:"100%",padding:"8px 11px",fontSize:14,fontWeight:700,border:"1.5px solid #ddd6fe",borderRadius:9,outline:"none",background:"white",color:"#5b21b6",boxSizing:"border-box",textAlign:"center" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ ...R,gap:8,marginTop:2 }}>
                    <Btn variant="purple" small onClick={()=>saveRate(t.id)}><i className="ti ti-check" style={{ fontSize:12 }}></i> บันทึก</Btn>
                    <Btn variant="outline" small onClick={()=>setEditRateId(null)}>ยกเลิก</Btn>
                    <button onClick={()=>{ setRateForm({ rate1:DEFAULT_RATE.rate1, rate2:DEFAULT_RATE.rate2, scoreRate:DEFAULT_RATE.scoreRate }); }}
                      style={{ fontSize:11,padding:"4px 10px",borderRadius:7,border:"0.5px solid #ddd6fe",background:"white",color:"#7c3aed",cursor:"pointer",marginLeft:"auto" }}>ค่า Default</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary note */}
      <div style={{ padding:"12px 14px",background:"#eff6ff",borderRadius:12,border:"0.5px solid #bfdbfe",...R,gap:10 }}>
        <i className="ti ti-info-circle" style={{ fontSize:16,color:T.blue,flexShrink:0 }}></i>
        <div style={{ fontSize:12,color:"#1e40af" }}>
          ค่าตอบแทนจะคำนวณตาม case ต่อวันต่อ รพ. — Export Excel จะแสดงค่าตอบแทนรายผู้ป่วยอัตโนมัติ
        </div>
      </div>

      {/* ── จัดการ Sales ── */}
      <ManageSales salesList={salesList} setSalesList={setSalesList} />
    </div>
  );
}

// ── Data Manager (Export / Import / Auto-save) ────────────────────────────────
const STORAGE_KEY = "3n_sleep_care_data_v1";

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function DataManager({ appts, hospitals, techs, assignments, checkins, dayBlocks, techRates, onImport }) {
  const [open, setOpen]       = useState(false);
  const [importErr, setImportErr] = useState("");
  const [imported, setImported]   = useState(false);

  // ── Export ──
  const doExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      appts, hospitals, techs, assignments, checkins, dayBlocks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `3n-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import ──
  const doImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.appts || !data.hospitals) throw new Error("ไฟล์ไม่ถูกต้อง");
        onImport(data);
        setImported(true);
        setImportErr("");
        setTimeout(() => { setImported(false); setOpen(false); }, 1800);
      } catch (err) {
        setImportErr("ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ที่ export จากระบบนี้เท่านั้น");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:10, border:`1px solid ${T.line}`, background:open?T.blueL:T.card, color:open?T.blue:T.muted, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:FONT, transition:"all .15s" }}>
        <i className="ti ti-database" style={{ fontSize:16 }}></i>
        ข้อมูล
        <i className={`ti ti-chevron-${open?"up":"down"}`} style={{ fontSize:12 }}></i>
      </button>

      {open && (
        <div style={{ position:"absolute", right:0, top:44, zIndex:100, width:300, background:T.card, border:`1px solid ${T.line}`, borderRadius:16, boxShadow:"0 12px 40px rgba(12,20,69,.15)", padding:20, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.navy }}>จัดการข้อมูล</div>
            <button onClick={() => setOpen(false)} style={{ width:26, height:26, border:"none", background:T.surf, borderRadius:7, color:T.muted, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>

          {/* Summary */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              ["ti-calendar","นัดหมาย", appts.length, T.blue, T.blueL],
              ["ti-building-hospital","รพ.", hospitals.length, T.green, T.greenL],
              ["ti-stethoscope","Tech", techs.length, T.purple, T.purpleL],
            ].map(([ic, lb, val, col, bg]) => (
              <div key={lb} style={{ padding:"10px 10px", background:bg, borderRadius:11, textAlign:"center" }}>
                <i className={`ti ${ic}`} style={{ fontSize:16, color:col }}></i>
                <div style={{ fontSize:20, fontWeight:800, color:col, marginTop:3, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:10, color:col, opacity:.75, marginTop:2 }}>{lb}</div>
              </div>
            ))}
          </div>

          {/* Export Excel */}
          <div style={{ background:"#f0fdf4", borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.green, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-table-export" style={{ fontSize:14 }}></i> Export Excel
            </div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>
              ดึงนัดหมายทั้งหมดออกเป็น <strong>.csv</strong><br/>
              เปิดได้ใน Excel / Google Sheets ทันที
            </div>
            <button
              onClick={()=>{ exportToExcel(appts, hospitals, techs, assignments, checkins, techRates); }}
              style={{ padding:"10px 16px", fontSize:13, fontWeight:700, borderRadius:10, background:T.green, color:"white", border:"none", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <i className="ti ti-file-spreadsheet" style={{ fontSize:15 }}></i> Download .csv (Excel)
            </button>
          </div>

          {/* Export JSON */}
          <div style={{ background:T.blueL, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.blue, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-download" style={{ fontSize:14 }}></i> Backup ข้อมูล (JSON)</div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>
              บันทึกข้อมูลทั้งหมดเป็นไฟล์ <strong>.json</strong><br/>
              นัดหมาย · รพ. · Sleep Tech · เวร · การตั้งค่าทั้งหมด
            </div>
            <button
              onClick={doExport}
              style={{ padding:"10px 16px", fontSize:13, fontWeight:700, borderRadius:10, background:T.blue, color:"white", border:"none", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <i className="ti ti-download" style={{ fontSize:15 }}></i> Download .json (Backup)
            </button>
          </div>

          {/* Import */}
          <div style={{ background:T.greenL, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.green, display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-upload" style={{ fontSize:14 }}></i> Import ข้อมูล
            </div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>
              โหลดไฟล์ .json ที่ export ไว้<br/>
              ข้อมูลปัจจุบันจะถูก<strong>แทนที่ทั้งหมด</strong>
            </div>
            {imported && (
              <div style={{ padding:"8px 12px", background:"#d1fae5", borderRadius:9, fontSize:12, color:"#065f46", display:"flex", alignItems:"center", gap:7, fontWeight:600 }}>
                <i className="ti ti-check-circle" style={{ fontSize:14 }}></i> Import สำเร็จ!
              </div>
            )}
            {importErr && (
              <div style={{ padding:"8px 12px", background:T.redL, borderRadius:9, fontSize:12, color:T.red, display:"flex", alignItems:"center", gap:7 }}>
                <i className="ti ti-alert-circle" style={{ fontSize:14 }}></i> {importErr}
              </div>
            )}
            <label style={{ padding:"10px 16px", fontSize:13, fontWeight:700, borderRadius:10, background:T.green, color:"white", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center", gap:7, textAlign:"center" }}>
              <i className="ti ti-upload" style={{ fontSize:15 }}></i> เลือกไฟล์ .json
              <input type="file" accept=".json" onChange={doImport} style={{ display:"none" }} />
            </label>
          </div>

          {/* Auto-save note */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 12px", background:T.surf, borderRadius:10, border:`0.5px solid ${T.line}` }}>
            <i className="ti ti-info-circle" style={{ fontSize:16, color:T.muted, flexShrink:0, marginTop:1 }}></i>
            <div style={{ fontSize:11, color:T.muted, lineHeight:1.7 }}>
              ระบบ<strong>บันทึกอัตโนมัติ</strong>ลงในเบราว์เซอร์นี้ทุกครั้งที่มีการเปลี่ยนแปลง ข้อมูลจะยังอยู่หลัง refresh แต่จะหายถ้าล้าง cache — แนะนำให้ Export ไว้เป็นประจำค่ะ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tech Schedule View ────────────────────────────────────────────────────────
function TechScheduleView({ user, techs, appointments, hospitals, assignments, checkins, setCheckins }) {
  const today  = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [mode,  setMode]  = useState("team");
  const myTech = techs.find(t=>t.id===user.id);
  const [selId, setSelId] = useState(myTech?.id||techs[0]?.id||"");

  const pfx  = `${year}-${String(month+1).padStart(2,"0")}`;
  const prev = ()=>month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1);
  const next = ()=>month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1);

  const isTechRole = user.role==="tech";
  const isAdmin    = user.role==="admin";
  const DOW = ["อา","จ","อ","พ","พฤ","ศ","ส"];
  const TMF = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  // วันทั้งหมดที่มีเวรในเดือนนี้
  const allDays = [...new Set(
    Object.entries(assignments)
      .filter(([k,v])=>k.startsWith(pfx)&&v.length>0)
      .map(([k])=>k)
  )].sort();

  const totalShifts = Object.entries(assignments)
    .filter(([k,v])=>k.startsWith(pfx))
    .reduce((s,[,v])=>s+v.length,0);

  const toggleCheckin = (dateKey, techId) => {
    setCheckins(prev=>{
      const cur=prev[dateKey]||[];
      const nxt=cur.includes(techId)?cur.filter(x=>x!==techId):[...cur,techId];
      return {...prev,[dateKey]:nxt};
    });
  };

  // ─── Team View: ดูทุกคนพร้อมกัน ─────────────────────────────────────────────
  const TeamView = () => (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
      {allDays.length===0 && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14,color:T.faint }}>
          <div style={{ width:64,height:64,borderRadius:18,background:T.surf,display:"flex",alignItems:"center",justifyContent:"center",border:`0.5px solid ${T.line}` }}>
            <i className="ti ti-calendar-off" style={{ fontSize:30 }}></i>
          </div>
          <div style={{ fontSize:15,fontWeight:600,color:T.muted }}>ยังไม่มีเวรเดือนนี้</div>
          <div style={{ fontSize:12,color:T.faint }}>Admin assign เวรใน Tab รายเดือน</div>
        </div>
      )}
      {allDays.map(dateKey=>{
        const d       = new Date(dateKey);
        const dow     = DOW[d.getDay()];
        const isSun   = d.getDay()===0;
        const isTod   = dateKey===todayStr;
        const isPast  = d < new Date(today.toDateString());
        const dayTechs= (assignments[dateKey]||[]).map(id=>techs.find(t=>t.id===id)).filter(Boolean);
        const dayAppts= appointments.filter(a=>a.date===dateKey&&a.status!=="cancelled");
        const allOk   = dayTechs.every(t=>(checkins[dateKey]||[]).includes(t.id));

        // จัดกลุ่มตาม รพ.
        const byHosp = {};
        dayAppts.forEach(a=>{ if(!byHosp[a.hospId]) byHosp[a.hospId]=[]; byHosp[a.hospId].push(a); });

        return (
          <div key={dateKey} style={{ background:T.card, border:isTod?`1.5px solid ${T.blue}`:allOk&&dayTechs.length>0?`1px solid #86efac`:`0.5px solid ${T.line}`, borderRadius:14, overflow:"hidden" }}>
            {/* Date strip + techs */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:isTod?T.blueL:allOk&&dayTechs.length>0?"#f0fdf4":T.surf, borderBottom:`0.5px solid ${T.line}` }}>
              {/* Date badge */}
              <div style={{ width:48, textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:24, fontWeight:800, color:isTod?T.blue:isSun?"#dc2626":T.navy, lineHeight:1 }}>{d.getDate()}</div>
                <div style={{ fontSize:10, fontWeight:700, color:isTod?T.blue:isSun?"#dc2626":T.muted }}>{dow}</div>
              </div>

              {/* Techs */}
              <div style={{ flex:1, display:"flex", gap:6, flexWrap:"wrap" }}>
                {dayTechs.length===0 && <span style={{ fontSize:11,color:T.faint }}>ไม่มี Tech</span>}
                {dayTechs.map(t=>{
                  const ci=techs.findIndex(x=>x.id===t.id);
                  const c=TPOOL[ci%TPOOL.length];
                  const ok=(checkins[dateKey]||[]).includes(t.id);
                  return (
                    <div key={t.id}
                      onClick={isAdmin?()=>toggleCheckin(dateKey,t.id):undefined}
                      style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 11px 5px 6px",borderRadius:20,background:ok?"#dcfce7":c.bg,border:`1px solid ${ok?"#86efac":c.dot}`,cursor:isAdmin?"pointer":"default",transition:"all .12s" }}>
                      <div style={{ width:26,height:26,borderRadius:"50%",background:c.dot,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"white",flexShrink:0 }}>
                        {tinit(t.name)}
                      </div>
                      <span style={{ fontSize:12,fontWeight:ok?700:500,color:ok?"#166534":c.text,whiteSpace:"nowrap" }}>{t.name}</span>
                      {ok
                        ? <i className="ti ti-check-circle" style={{ fontSize:13,color:"#16a34a",flexShrink:0 }}></i>
                        : isAdmin && <i className="ti ti-clock" style={{ fontSize:12,color:c.dot,opacity:.5,flexShrink:0 }}></i>
                      }
                    </div>
                  );
                })}
              </div>

              {/* Case count */}
              <div style={{ flexShrink:0, textAlign:"right" }}>
                <div style={{ fontSize:18,fontWeight:800,color:isTod?T.blue:T.ink,lineHeight:1 }}>{dayAppts.length}</div>
                <div style={{ fontSize:9,color:T.faint }}>case</div>
              </div>
            </div>

            {/* Hospital breakdown */}
            <div style={{ padding:"6px 16px 8px 76px", display:"flex", flexWrap:"wrap", gap:7 }}>
              {Object.entries(byHosp).map(([hospId,happts])=>{
                const h=hospitals.find(x=>x.id===hospId);
                const c=hc(hospId,hospitals);
                return (
                  <div key={hospId} style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:9,background:c.bg,border:`0.5px solid ${c.dot}30` }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c.dot,flexShrink:0 }}></span>
                    <span style={{ fontSize:11,fontWeight:600,color:c.text }}>{h?.name||hospId}</span>
                    <span style={{ fontSize:11,fontWeight:800,color:c.text }}>{happts.length} ราย</span>
                  </div>
                );
              })}
              {dayAppts.length===0 && <span style={{ fontSize:11,color:T.faint,padding:"4px 0" }}>ยังไม่มีนัดหมาย</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ─── Person View: โฟกัสทีละคน ────────────────────────────────────────────────
  const selTech = techs.find(t=>t.id===selId);
  const myDays  = Object.entries(assignments).filter(([k,v])=>k.startsWith(pfx)&&v.includes(selId)).map(([k])=>k).sort();
  const confirmedShifts = myDays.filter(d=>(checkins[d]||[]).includes(selId)).length;
  const totalCases = myDays.reduce((s,d)=>s+appointments.filter(a=>a.date===d&&a.status!=="cancelled").length,0);
  const selCi = techs.findIndex(t=>t.id===selId);
  const selC  = TPOOL[selCi%TPOOL.length];

  const PersonView = () => (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      {/* Left: tech picker */}
      <div style={{ width:190, borderRight:`1px solid ${T.line}`, overflowY:"auto", flexShrink:0, background:T.surf, padding:"10px 8px", display:"flex", flexDirection:"column", gap:5 }}>
        {techs.map((t,i)=>{
          const c=TPOOL[i%TPOOL.length];
          const on=selId===t.id;
          const mA=Object.entries(assignments).filter(([k,v])=>k.startsWith(pfx)&&v.includes(t.id)).length;
          const mC=Object.entries(checkins).filter(([k,v])=>k.startsWith(pfx)&&v.includes(t.id)).length;
          return (
            <div key={t.id} onClick={()=>setSelId(t.id)}
              style={{ padding:"10px",borderRadius:11,cursor:"pointer",border:on?`2px solid ${c.dot}`:`0.5px solid ${T.line}`,background:on?c.bg:"white",transition:"all .1s" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:on?c.dot:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:on?"white":"#64748b",flexShrink:0 }}>{tinit(t.name)}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:12,fontWeight:on?700:500,color:on?c.text:T.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.nick||t.name.split(" ")[0]}</div>
                  <div style={{ fontSize:10,color:on?c.text:T.faint }}>
                    {mC}/{mA} เวร {mA>0?`· ${Math.round(mC/mA*100)}%`:""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: schedule detail */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
        {/* Tech header */}
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:selC.bg,borderRadius:13,border:`1px solid ${selC.dot}30`,marginBottom:14 }}>
          <div style={{ width:46,height:46,borderRadius:"50%",background:selC.dot,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"white",flexShrink:0 }}>{tinit(selTech?.name||"")}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,fontWeight:800,color:selC.text }}>{selTech?.name}</div>
            <div style={{ fontSize:11,color:selC.text,opacity:.7,marginTop:1 }}>Sleep Technician</div>
          </div>
          <div style={{ display:"flex",gap:8,flexShrink:0 }}>
            {[[myDays.length,"เวร","#1d4ed8","#dbeafe"],[confirmedShifts,"ยืนยัน","#059669","#d1fae5"],[totalCases,"case","#7c3aed","#ede9fe"]].map(([v,lb,col,bg])=>(
              <div key={lb} style={{ textAlign:"center",padding:"7px 11px",background:bg,borderRadius:10 }}>
                <div style={{ fontSize:18,fontWeight:800,color:col,lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:9,color:col,opacity:.7,marginTop:2 }}>{lb}</div>
              </div>
            ))}
          </div>
        </div>

        {myDays.length===0 && (
          <div style={{ textAlign:"center",padding:"32px 20px",color:T.faint }}>
            <i className="ti ti-calendar-off" style={{ fontSize:30 }}></i>
            <div style={{ fontSize:14,marginTop:10,fontWeight:600,color:T.muted }}>ยังไม่มีเวรเดือนนี้</div>
          </div>
        )}

        {myDays.map(dateKey=>{
          const d=new Date(dateKey);
          const ok=(checkins[dateKey]||[]).includes(selId);
          const dayAppts=appointments.filter(a=>a.date===dateKey&&a.status!=="cancelled");
          const hospsToday=[...new Map(dayAppts.map(a=>[a.hospId,hospitals.find(h=>h.id===a.hospId)])).entries()].map(([,h])=>h).filter(Boolean);
          return (
            <div key={dateKey} style={{ background:T.card,border:ok?`1.5px solid #86efac`:`0.5px solid ${T.line}`,borderRadius:13,marginBottom:9,overflow:"hidden" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:ok?"#f0fdf4":T.surf,borderBottom:`0.5px solid ${T.line}` }}>
                <div style={{ width:42,height:42,borderRadius:10,background:ok?"#d1fae5":selC.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <div style={{ fontSize:18,fontWeight:800,color:ok?"#166534":selC.text,lineHeight:1 }}>{d.getDate()}</div>
                  <div style={{ fontSize:10,color:ok?"#16a34a":selC.text }}>{DOW[d.getDay()]}</div>
                </div>
                <div style={{ flex:1 }}>
                  {hospsToday.map(h=>{
                    const c=hc(h.id,hospitals);
                    const cnt=dayAppts.filter(a=>a.hospId===h.id).length;
                    return (
                      <div key={h.id} style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
                        <span style={{ width:8,height:8,borderRadius:"50%",background:c.dot,flexShrink:0 }}></span>
                        <span style={{ fontSize:12,fontWeight:600,color:T.ink }}>{h.name}</span>
                        <span style={{ fontSize:11,fontWeight:700,color:c.text,marginLeft:"auto" }}>{cnt} case</span>
                      </div>
                    );
                  })}
                  {hospsToday.length===0&&<span style={{ fontSize:11,color:T.faint }}>ยังไม่มีนัด</span>}
                </div>
                {isAdmin&&(ok
                  ? <div style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:"#dcfce7",borderRadius:9,border:"1px solid #86efac",flexShrink:0 }}>
                      <i className="ti ti-check-circle" style={{ fontSize:14,color:"#166534" }}></i>
                      <span style={{ fontSize:11,fontWeight:700,color:"#166534" }}>ยืนยันแล้ว</span>
                      <button onClick={()=>toggleCheckin(dateKey,selId)} style={{ marginLeft:4,fontSize:10,padding:"1px 7px",borderRadius:6,border:"1px solid #86efac",background:"white",color:"#dc2626",cursor:"pointer" }}>ยก</button>
                    </div>
                  : <button onClick={()=>toggleCheckin(dateKey,selId)}
                      style={{ padding:"7px 13px",fontSize:11,fontWeight:700,borderRadius:9,background:T.blueL,color:T.blue,border:`1.5px solid ${T.blueMid}`,cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:5,flexShrink:0 }}>
                      <i className="ti ti-check" style={{ fontSize:13 }}></i>ยืนยัน
                    </button>
                )}
                {!isAdmin&&ok&&<i className="ti ti-check-circle" style={{ fontSize:22,color:"#059669",flexShrink:0 }}></i>}
              </div>
              {dayAppts.length>0&&(
                <details>
                  <summary style={{ padding:"7px 14px",fontSize:11,color:T.muted,cursor:"pointer",listStyle:"none",display:"flex",alignItems:"center",gap:5,userSelect:"none" }}>
                    <i className="ti ti-users" style={{ fontSize:12 }}></i>รายชื่อผู้ป่วย ({dayAppts.length} ราย)
                    <i className="ti ti-chevron-down" style={{ fontSize:10,marginLeft:"auto" }}></i>
                  </summary>
                  <div style={{ padding:"4px 14px 10px",display:"flex",flexDirection:"column",gap:5 }}>
                    {dayAppts.map((a,i)=>{
                      const c=hc(a.hospId,hospitals); const h=hospitals.find(x=>x.id===a.hospId);
                      return (
                        <div key={a.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.surf,borderRadius:9,border:`0.5px solid ${T.line}` }}>
                          <div style={{ width:18,height:18,borderRadius:"50%",background:c.bg,border:`0.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:c.text,flexShrink:0 }}>{i+1}</div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ fontSize:12,fontWeight:600,color:T.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</div>
                            <div style={{ fontSize:10,color:T.faint }}>HN {a.hn}</div>
                          </div>
                          <span style={{ fontSize:9,padding:"2px 7px",borderRadius:7,background:c.bg,color:c.text,flexShrink:0 }}>{h?.short}</span>
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Show team view for admin, always personal for tech
  const showTeam = isAdmin && mode==="team";

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:FONT }}>
      {/* Header */}
      <div style={{ padding:"12px 18px", background:T.card, borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"center", gap:10, flexShrink:0, flexWrap:"wrap" }}>
        {/* Mode toggle (Admin only) */}
        {isAdmin && (
          <div style={{ display:"flex", borderRadius:10, overflow:"hidden", border:`1px solid ${T.line}`, flexShrink:0 }}>
            {[["team","ti-users","ภาพรวมทีม"],["person","ti-user","รายบุคคล"]].map(([m,ic,lb])=>(
              <button key={m} onClick={()=>setMode(m)}
                style={{ padding:"8px 14px",fontSize:12,fontWeight:mode===m?700:400,background:mode===m?T.blue:"white",color:mode===m?"white":T.muted,border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:5,transition:"all .1s" }}>
                <i className={`ti ${ic}`} style={{ fontSize:13 }}></i>{lb}
              </button>
            ))}
          </div>
        )}
        {/* Tech name for tech role */}
        {isTechRole && myTech && (
          <div style={{ display:"flex",alignItems:"center",gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:selC.dot,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white" }}>{tinit(myTech.name)}</div>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy }}>{myTech.name}</div>
          </div>
        )}
        {/* Month nav */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginLeft:"auto" }}>
          <button onClick={prev} style={{ width:30,height:30,border:`0.5px solid ${T.line}`,borderRadius:8,background:T.surf,color:T.muted,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
          <span style={{ fontSize:14,fontWeight:700,color:T.navy,minWidth:130,textAlign:"center" }}>{TMF[month]} {year+543}</span>
          <button onClick={next} style={{ width:30,height:30,border:`0.5px solid ${T.line}`,borderRadius:8,background:T.surf,color:T.muted,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
        </div>
        {/* Summary chips */}
        <div style={{ display:"flex",gap:6 }}>
          <div style={{ padding:"4px 11px",borderRadius:9,background:"#dbeafe",display:"flex",alignItems:"center",gap:4 }}>
            <span style={{ fontSize:15,fontWeight:800,color:"#1d4ed8" }}>{allDays.length}</span>
            <span style={{ fontSize:10,color:"#1d4ed8",opacity:.75 }}>วันทำงาน</span>
          </div>
          <div style={{ padding:"4px 11px",borderRadius:9,background:"#ede9fe",display:"flex",alignItems:"center",gap:4 }}>
            <span style={{ fontSize:15,fontWeight:800,color:"#7c3aed" }}>{totalShifts}</span>
            <span style={{ fontSize:10,color:"#7c3aed",opacity:.75 }}>เวรรวม</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {showTeam ? <TeamView/> : <PersonView/>}
    </div>
  );
}


// ── Sales View ────────────────────────────────────────────────────────────────
function exportSalesExcel(sales, hospitals, mode, year, month, selHosp, salesName) {
  const TM = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const header = ["ชื่อผู้ป่วย","HN","โรงพยาบาล","วันที่ซื้อ","รุ่น CPAP","ราคา (บาท)","ค่าคอม %","ค่าคอม (บาท)","สถานะบิล","Sales"];
  const rows = sales.map(a=>{
    const h=hospitals.find(x=>x.id===a.hospId);
    const p=a.cpapPurchase;
    const com=Math.round((p?.price||0)*(p?.commissionRate??2)/100);
    const billLabel=BILLING_STATUS.find(b=>b.key===(p?.billingStatus||"pending"))?.label||"ยังไม่วางบิล";
    return [a.name, a.hn, h?.name||"", p?.purchaseDate||a.date, p?.model||"", p?.price||0, p?.commissionRate??2, com, billLabel, p?.salesPerson||""];
  });
  const lines=[header,...rows].map(r=>r.map(c=>{ const s=String(c??""); return s.includes(",")? `"${s}"`:s; }).join(","));
  const periodLabel = mode==="month"?`${TM[month]}_${year+543}`:`ปี${year+543}`;
  const hospLabel   = selHosp==="all"?"ทุก_รพ":hospitals.find(h=>h.id===selHosp)?.short||selHosp;
  const blob=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`Sales_${salesName}_${periodLabel}_${hospLabel}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function SalesView({ user, appointments, hospitals, salesList=[], setAppointments }) {
  const now   = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [mode,  setMode]  = useState("month");
  const [selHosp, setSelHosp] = useState("all");
  const [selSales, setSelSales] = useState("all"); // filter by sales person

  const TMF=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const TMS=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

  const pfx = mode==="month"?`${year}-${String(month+1).padStart(2,"0")}`:`${year}`;

  // Filter
  const allSales = appointments.filter(a =>
    a.cpapPurchase?.price>0 &&
    a.status!=="cancelled" &&
    a.date.startsWith(pfx) &&
    (selHosp==="all"||a.hospId===selHosp) &&
    (selSales==="all"||a.cpapPurchase?.salesPerson===selSales)
  );

  // Stats
  const totalRevenue    = allSales.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0);
  const totalCommission = allSales.reduce((s,a)=>s+(a.cpapPurchase?.price||0)*(a.cpapPurchase?.commissionRate??2)/100,0);
  const billed   = allSales.filter(a=>a.cpapPurchase?.billingStatus==="billed");
  const paid     = allSales.filter(a=>a.cpapPurchase?.billingStatus==="paid");
  const pending  = allSales.filter(a=>!a.cpapPurchase?.billingStatus||a.cpapPurchase?.billingStatus==="pending");

  // Monthly trend
  const monthlyData = Array.from({length:12},(_,mi)=>{
    const mp=`${year}-${String(mi+1).padStart(2,"0")}`;
    const ms=appointments.filter(a=>a.cpapPurchase?.price>0&&a.status!=="cancelled"&&a.date.startsWith(mp)&&(selHosp==="all"||a.hospId===selHosp)&&(selSales==="all"||a.cpapPurchase?.salesPerson===selSales));
    return { label:TMS[mi], count:ms.length, revenue:ms.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0), commission:ms.reduce((s,a)=>s+(a.cpapPurchase?.price||0)*(a.cpapPurchase?.commissionRate??2)/100,0) };
  });
  const maxRev = Math.max(...monthlyData.map(m=>m.revenue),1);

  const prevP = ()=>mode==="month"?(month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1)):setYear(y=>y-1);
  const nextP = ()=>mode==="month"?(month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1)):setYear(y=>y+1);

  return (
    <div style={{ height:"100%",overflowY:"auto",fontFamily:FONT }}>
      <div style={{ maxWidth:900,margin:"0 auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18 }}>

        {/* Controls */}
        <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
          {/* Mode */}
          <div style={{ display:"flex",borderRadius:10,overflow:"hidden",border:`1px solid ${T.line}` }}>
            {["month","year"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{ padding:"8px 16px",fontSize:12,fontWeight:mode===m?700:400,background:mode===m?"#059669":"white",color:mode===m?"white":T.muted,border:"none",cursor:"pointer",fontFamily:FONT }}>
                {m==="month"?"รายเดือน":"รายปี"}
              </button>
            ))}
          </div>
          {/* Period */}
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <button onClick={prevP} style={{ width:30,height:30,border:`1px solid ${T.line}`,borderRadius:8,background:T.card,color:T.muted,cursor:"pointer",fontSize:15,...R,justifyContent:"center" }}>‹</button>
            <span style={{ fontSize:15,fontWeight:700,color:T.navy,minWidth:150,textAlign:"center" }}>{mode==="month"?`${TMF[month]} ${year+543}`:`ปี ${year+543}`}</span>
            <button onClick={nextP} style={{ width:30,height:30,border:`1px solid ${T.line}`,borderRadius:8,background:T.card,color:T.muted,cursor:"pointer",fontSize:15,...R,justifyContent:"center" }}>›</button>
          </div>
          {/* Hospital filter */}
          <select value={selHosp} onChange={e=>setSelHosp(e.target.value)}
            style={{ padding:"8px 12px",fontSize:12,border:`1px solid ${T.line}`,borderRadius:9,background:T.card,color:T.ink,fontFamily:FONT,flex:1,minWidth:150 }}>
            <option value="all">ทุก รพ.</option>
            {hospitals.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          {/* Sales filter */}
          <select value={selSales} onChange={e=>setSelSales(e.target.value)}
            style={{ padding:"8px 12px",fontSize:12,border:`1px solid ${T.line}`,borderRadius:9,background:T.card,color:T.ink,fontFamily:FONT,flex:1,minWidth:150 }}>
            <option value="all">ทุก Sales</option>
            {salesList.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {/* Export */}
          <button onClick={()=>exportSalesExcel(allSales,hospitals,mode,year,month,selHosp,selSales==="all"?"ทุก_Sales":selSales)}
            style={{ padding:"8px 14px",fontSize:12,fontWeight:700,borderRadius:9,background:"#059669",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:6 }}>
            <i className="ti ti-file-spreadsheet" style={{ fontSize:14 }}></i>Export Excel
          </button>
        </div>

        {/* Selected Sales banner */}
        {selSales!=="all" && (
          <div style={{ padding:"12px 16px",background:"#d1fae5",borderRadius:12,display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:40,height:40,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <i className="ti ti-user-check" style={{ fontSize:20,color:"white" }}></i>
            </div>
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:"#065f46" }}>{selSales}</div>
              <div style={{ fontSize:11,color:"#059669" }}>กรองเฉพาะยอดขายของ Sales คนนี้</div>
            </div>
            <button onClick={()=>setSelSales("all")} style={{ marginLeft:"auto",padding:"5px 12px",fontSize:11,borderRadius:8,border:"1px solid #86efac",background:"white",color:"#059669",cursor:"pointer" }}>ดูทั้งหมด</button>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 }}>
          {[
            ["ti-shopping-cart","ขายทั้งหมด",allSales.length,"เครื่อง","#059669","#d1fae5"],
            ["ti-currency-baht","ยอดขายรวม",(totalRevenue/1000).toFixed(0)+"k","บาท","#1e40af","#dbeafe"],
            ["ti-percentage","ค่าคอมรวม",Math.round(totalCommission).toLocaleString(),"บาท","#7c3aed","#ede9fe"],
            ["ti-check","รับเงินแล้ว",paid.length,"เครื่อง","#059669","#d1fae5"],
          ].map(([ic,lb,val,unit,col,bg])=>(
            <div key={lb} style={{ padding:"14px 16px",background:bg,borderRadius:14,border:`0.5px solid ${col}20` }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                <i className={`ti ${ic}`} style={{ fontSize:18,color:col }}></i>
                <span style={{ fontSize:11,color:col,fontWeight:500 }}>{lb}</span>
              </div>
              <div style={{ fontSize:26,fontWeight:800,color:col,lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:10,color:col,opacity:.7,marginTop:3 }}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Billing status summary */}
        <div style={{ background:T.card,borderRadius:14,border:`0.5px solid ${T.line}`,padding:"16px 18px" }}>
          <div style={{ fontSize:13,fontWeight:700,color:T.navy,marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
            <i className="ti ti-file-invoice" style={{ fontSize:15,color:"#1e40af" }}></i>
            สถานะใบแจ้งหนี้
          </div>
          <div style={{ display:"flex",gap:10 }}>
            {[[pending,"ยังไม่วางบิล","#f59e0b","#fef9c3"],[billed,"วางบิลแล้ว","#1e40af","#dbeafe"],[paid,"รับเงินแล้ว","#059669","#d1fae5"]].map(([arr,lb,col,bg])=>(
              <div key={lb} style={{ flex:1,padding:"12px 14px",background:bg,borderRadius:11 }}>
                <div style={{ fontSize:22,fontWeight:800,color:col }}>{arr.length}</div>
                <div style={{ fontSize:11,color:col,opacity:.8,marginTop:2 }}>{lb}</div>
                <div style={{ fontSize:12,fontWeight:600,color:col,marginTop:3 }}>
                  {arr.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0).toLocaleString()} ฿
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year bar chart */}
        {mode==="year" && (
          <div style={{ background:T.card,borderRadius:14,border:`0.5px solid ${T.line}`,padding:"16px 18px" }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.navy,marginBottom:14 }}>ยอดขายรายเดือน ปี {year+543}</div>
            <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:120,paddingBottom:20,position:"relative" }}>
              {monthlyData.map((m,i)=>{
                const h=Math.round((m.revenue/maxRev)*90);
                const isNow=i===now.getMonth()&&year===now.getFullYear();
                return (
                  <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
                    {m.count>0&&<div style={{ fontSize:9,color:T.muted,marginBottom:2 }}>{m.count}ชิ้น</div>}
                    <div title={`${m.revenue.toLocaleString()} บาท`}
                      style={{ width:"100%",height:`${Math.max(h,2)}px`,background:isNow?"#059669":"#6ee7b7",borderRadius:"3px 3px 0 0",minHeight:3 }}/>
                    <div style={{ fontSize:9,color:isNow?"#059669":T.faint,marginTop:3,fontWeight:isNow?700:400 }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sale list */}
        <div style={{ background:T.card,borderRadius:14,border:`0.5px solid ${T.line}`,overflow:"hidden" }}>
          <div style={{ padding:"14px 18px",borderBottom:`0.5px solid ${T.line}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.navy }}>รายการขาย ({allSales.length} รายการ)</div>
          </div>
          {allSales.length===0 && (
            <div style={{ padding:"32px",textAlign:"center",color:T.faint,fontSize:13 }}>ไม่มีรายการขายในช่วงเวลานี้</div>
          )}
          {allSales.map(a=>{
            const h=hospitals.find(x=>x.id===a.hospId);
            const p=a.cpapPurchase||{};
            const com=Math.round((p.price||0)*(p.commissionRate??2)/100);
            const bs=BILLING_STATUS.find(b=>b.key===(p.billingStatus||"pending"))||BILLING_STATUS[0];
            return (
              <div key={a.id} style={{ padding:"13px 18px",borderBottom:`0.5px solid ${T.line}`,display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.navy }}>{a.name}</div>
                  <div style={{ fontSize:11,color:T.faint,marginTop:2 }}>HN {a.hn} · {h?.name||"—"} · {p.purchaseDate||a.date}</div>
                  <div style={{ fontSize:11,color:"#7c3aed",marginTop:2 }}>{p.model||"—"}</div>
                  <div style={{ fontSize:10,color:T.faint,marginTop:2 }}>Sales: {p.salesPerson||"—"}</div>
                </div>
                {/* Billing status badge */}
                <div style={{ padding:"5px 11px",borderRadius:20,background:bs.bg,border:`1px solid ${bs.color}40`,flexShrink:0 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:bs.color }}>{bs.label}</span>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontSize:15,fontWeight:800,color:"#059669" }}>{(p.price||0).toLocaleString()} ฿</div>
                  <div style={{ fontSize:11,color:"#7c3aed",marginTop:2 }}>คอม {com.toLocaleString()} ฿</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Per-hospital breakdown */}
        {selHosp==="all" && allSales.length>0 && (
          <div style={{ background:T.card,borderRadius:14,border:`0.5px solid ${T.line}`,padding:"16px 18px" }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.navy,marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-building-hospital" style={{ fontSize:15,color:T.blue }}></i>
              แยกตาม รพ.
            </div>
            {hospitals.map(h=>{
              const hs=allSales.filter(a=>a.hospId===h.id);
              if(!hs.length) return null;
              const rev=hs.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0);
              const com=hs.reduce((s,a)=>s+Math.round((a.cpapPurchase?.price||0)*(a.cpapPurchase?.commissionRate??2)/100),0);
              const c=hc(h.id,hospitals);
              return (
                <div key={h.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:T.surf,borderRadius:11,marginBottom:6,border:`0.5px solid ${T.line}` }}>
                  <span style={{ width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{h.name}</div>
                    <div style={{ fontSize:10,color:T.faint }}>{hs.length} เครื่อง</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:14,fontWeight:800,color:"#059669" }}>{rev.toLocaleString()} ฿</div>
                    <div style={{ fontSize:11,color:"#7c3aed" }}>คอม {com.toLocaleString()} ฿</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Sales Patient View ────────────────────────────────────────────────────────
// ── CPAP Excel export helper ──────────────────────────────────────────────────
// ── Local-state sub-cards (prevent re-render on each keystroke) ───────────────

// TrialCard — local state, commit on blur
function TrialCard({ a, idx, tr, onUpdate, onRemove }) {
  const [form, setForm] = useState({
    model:     tr.model||"",
    serialNo:  tr.serialNo||"",
    dn:        tr.dn||"",
    maskModel: tr.maskModel||"",
    maskOther: tr.maskOther||"",
    maskSize:  tr.maskSize||"",
    trialDate: tr.trialDate||"",
    returnDate:tr.returnDate||"",
    note:      tr.note||"",
  });
  // keep in sync if parent changes
  const setF = (k,v) => { const next={...form,[k]:v}; setForm(next); onUpdate(idx,k,v); };
  const IS={width:"100%",padding:"7px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",boxSizing:"border-box",fontFamily:"inherit"};
  const today=new Date().toISOString().split("T")[0];
  return (
    <div style={{padding:"12px",background:"white",borderRadius:11,border:"1px solid #ede9fe",marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
        <span style={{fontSize:11,fontWeight:700,color:"#7c3aed",minWidth:54}}>รุ่นที่ {idx+1}</span>
        <select value={form.model} onChange={e=>setF("model",e.target.value)}
          style={{flex:1,...IS,border:"1.5px solid #a78bfa",fontWeight:600}}>
          <option value="">— เลือกรุ่น CPAP/BiPAP —</option>
          {CPAP_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        {onRemove && <button onClick={onRemove} style={{width:26,height:26,border:"0.5px solid #fecaca",borderRadius:7,background:"#fef2f2",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}><i className="ti ti-x"></i></button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div>
          <div style={{fontSize:10,color:"#7c3aed",fontWeight:600,marginBottom:3}}>Serial No. (S/N)</div>
          <input value={form.serialNo} onChange={e=>setForm(f=>({...f,serialNo:e.target.value}))} onBlur={e=>onUpdate(idx,"serialNo",e.target.value)} placeholder="SN-XXXXXXXX" style={{...IS,fontFamily:"monospace"}}/>
        </div>
        <div>
          <div style={{fontSize:10,color:"#7c3aed",fontWeight:600,marginBottom:3}}>DN (Delivery Note)</div>
          <input value={form.dn} onChange={e=>setForm(f=>({...f,dn:e.target.value}))} onBlur={e=>onUpdate(idx,"dn",e.target.value)} placeholder="DN-XXXX" style={{...IS,fontFamily:"monospace"}}/>
        </div>
      </div>
      <div style={{marginBottom:8}}>
        <div style={{fontSize:10,color:"#7c3aed",fontWeight:600,marginBottom:3}}>รุ่น Mask</div>
        <div style={{display:"flex",gap:7}}>
          <select value={form.maskModel} onChange={e=>setF("maskModel",e.target.value)} style={{flex:1,...IS}}>
            <option value="">— เลือก Mask —</option>
            {MASK_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          {form.maskModel!=="อื่นๆ (พิมพ์เอง)" && (
            <select value={form.maskSize} onChange={e=>setF("maskSize",e.target.value)} style={{...IS,minWidth:80,flex:"none"}}>
              <option value="">ขนาด</option>
              {MASK_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
        {form.maskModel==="อื่นๆ (พิมพ์เอง)" && (
          <input value={form.maskOther} onChange={e=>setForm(f=>({...f,maskOther:e.target.value}))} onBlur={e=>onUpdate(idx,"maskOther",e.target.value)} placeholder="ระบุรุ่น Mask..." style={{...IS,marginTop:6}}/>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div>
          <div style={{fontSize:10,color:"#059669",fontWeight:600,marginBottom:3}}>📅 วันเริ่มทดลอง</div>
          <input type="date" value={form.trialDate} onChange={e=>setF("trialDate",e.target.value)} style={{...IS,border:"1px solid #86efac"}}/>
        </div>
        <div>
          <div style={{fontSize:10,color:"#dc2626",fontWeight:600,marginBottom:3}}>📅 วันกำหนดคืนเครื่อง</div>
          <input type="date" value={form.returnDate} onChange={e=>setF("returnDate",e.target.value)} style={{...IS,border:"1px solid #fca5a5"}}/>
        </div>
      </div>
      {form.returnDate && form.returnDate<=today && (
        <div style={{marginTop:7,padding:"5px 10px",background:"#dbeafe",borderRadius:8,fontSize:11,color:"#1e40af",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
          <i className="ti ti-check" style={{fontSize:11}}></i>คืนเครื่องแล้ว {form.returnDate} — รอซื้อเครื่อง
        </div>
      )}
    </div>
  );
}

// PurchaseCard — local state for waiting_buy form
function PurchaseCard({ a, hospitals, isAdmin, salesList=[], onDecision, onPurchaseChange }) {
  const [form, setForm] = useState(a.cpapPurchase||{});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const commit = (k,v) => { const next={...form,[k]:v}; setForm(next); onPurchaseChange(a.id,next); };
  const h=hospitals.find(x=>x.id===a.hospId);
  const c=hc(a.hospId,hospitals);
  const trials=(a.cpapTrials||[]).filter(t=>t.model);
  const com=Math.round((form.price||0)*(form.commissionRate??2)/100);
  const IS={width:"100%",padding:"8px 11px",fontSize:13,border:"1px solid #86efac",borderRadius:9,outline:"none",background:"white",color:"#111827",boxSizing:"border-box",fontFamily:"inherit"};
  return (
    <div style={{background:"white",border:"1.5px solid #bfdbfe",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#eff6ff",borderBottom:"1px solid #e2e8f0"}}>
        <div style={{width:40,height:40,borderRadius:11,background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:c.text,flexShrink:0}}>
          {(a.name||"?")[0]}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{a.name}</div>
          <div style={{fontSize:11,color:"#64748b"}}>HN {a.hn} · {h?.name}</div>
          {a.phone&&<div style={{fontSize:11,color:"#059669",fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:1}}><i className="ti ti-phone" style={{fontSize:10}}></i>{a.phone}</div>}
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",maxWidth:180}}>
          {trials.map((tr,i)=>(
            <span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:"#ede9fe",color:"#7c3aed",fontWeight:600}}>
              {(tr.model||"").split(" ").slice(0,3).join(" ")}
            </span>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{fontSize:11,fontWeight:700,color:"#1e40af",display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-shopping-cart" style={{fontSize:13}}></i>บันทึกการซื้อ
        </div>
        <div style={{display:"flex",gap:7}}>
          {[["purchased_after_trial","ซื้อหลังทดลอง","#059669","#d1fae5"],["purchase_direct","ซื้อโดยไม่ทดลอง","#7c3aed","#ede9fe"]].map(([key,lb,col,bg])=>(
            <button key={key} onClick={()=>onDecision(a.id,key)}
              style={{flex:1,padding:"9px",fontSize:12,fontWeight:700,borderRadius:9,border:`2px solid ${a.cpapDecision===key?col:"#e2e8f0"}`,background:a.cpapDecision===key?bg:"white",color:a.cpapDecision===key?col:"#64748b",cursor:"pointer",fontFamily:"inherit"}}>
              {lb}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>รุ่นที่ซื้อ</div>
            <select value={form.model||""} onChange={e=>commit("model",e.target.value)} style={IS}>
              <option value="">— เลือกรุ่น —</option>
              {CPAP_MODELS.filter(m=>m!=="อื่นๆ").map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>S/N เครื่องที่ขาย</div>
            <input value={form.serialNo||""} onChange={e=>set("serialNo",e.target.value)} onBlur={e=>commit("serialNo",e.target.value)} placeholder="SN-XXXXXXXX"
              style={{...IS,fontFamily:"monospace"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>DN ขาย</div>
            <input value={form.dn||""} onChange={e=>set("dn",e.target.value)} onBlur={e=>commit("dn",e.target.value)} placeholder="DN-XXXX"
              style={{...IS,fontFamily:"monospace"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>ราคาขาย (บาท)</div>
            <input type="number" value={form.price||""} onChange={e=>set("price",e.target.value)} onBlur={e=>commit("price",Number(e.target.value))} placeholder="45000"
              style={{...IS,fontSize:16,fontWeight:700,color:"#059669"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>รุ่น Mask ที่ซื้อ</div>
            <select value={form.maskModel||""} onChange={e=>commit("maskModel",e.target.value)} style={IS}>
              <option value="">—</option>
              {MASK_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>วันที่ขาย</div>
            <input type="date" value={form.purchaseDate||""} onChange={e=>commit("purchaseDate",e.target.value)} style={IS}/>
          </div>
          {form.maskModel==="อื่นๆ (พิมพ์เอง)" && (
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>ระบุรุ่น Mask</div>
              <input value={form.maskOther||""} onChange={e=>set("maskOther",e.target.value)} onBlur={e=>commit("maskOther",e.target.value)} placeholder="พิมพ์ชื่อ Mask..." style={IS}/>
            </div>
          )}
          {isAdmin && (
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>ค่าคอม %</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={form.commissionRate??2} onChange={e=>set("commissionRate",e.target.value)} onBlur={e=>commit("commissionRate",Number(e.target.value))}
                  style={{...IS,width:60}}/>
                <span style={{fontSize:12,color:"#7c3aed",fontWeight:700}}>{com.toLocaleString()} ฿</span>
              </div>
            </div>
          )}
          {/* Sales person selector — always visible */}
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>Sales ที่รับผิดชอบ</div>
            <select value={form.salesPerson||""} onChange={e=>commit("salesPerson",e.target.value)} style={{...IS,border:"1px solid #86efac"}}>
              <option value="">— เลือกชื่อ Sales —</option>
              {salesList.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {(form.price>0) && (
          <div style={{padding:"9px 13px",background:"#dcfce7",borderRadius:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:"#166534",fontWeight:600}}>ราคา: {Number(form.price||0).toLocaleString()} ฿</span>
            {isAdmin&&<span style={{fontSize:12,fontWeight:700,color:"#7c3aed"}}>คอม: {com.toLocaleString()} ฿</span>}
          </div>
        )}
        {/* ── Trial Result PDF — Sales แนบ, รพ. Print ── */}
        <div style={{marginTop:4}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
            <i className="ti ti-file-type-pdf" style={{fontSize:14,color:"#dc2626"}}></i>
            แนบผลการทดลอง PDF (รพ. จะ Print ให้หมอได้)
          </div>
          {form.trialPdfDataUrl ? (
            <div style={{padding:"9px 12px",background:"#f0fdf4",borderRadius:10,border:"1px solid #86efac",display:"flex",alignItems:"center",gap:9}}>
              <i className="ti ti-file-check" style={{fontSize:20,color:"#059669",flexShrink:0}}></i>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,color:"#166534",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{form.trialPdfFileName}</div>
                <div style={{fontSize:10,color:"#059669",marginTop:1}}>แนบแล้ว ✓</div>
              </div>
              <button onClick={()=>{ const w=window.open("","_blank"); w.document.write(`<html><body style="margin:0;background:#333"><iframe src="${form.trialPdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`); w.document.close(); }}
                style={{padding:"5px 11px",fontSize:11,fontWeight:700,borderRadius:8,background:"#059669",color:"white",border:"none",cursor:"pointer",flexShrink:0}}>
                <i className="ti ti-printer" style={{marginRight:4}}></i>Print
              </button>
              <button onClick={()=>commit("trialPdfDataUrl","")}
                style={{padding:"5px 9px",fontSize:11,borderRadius:8,border:"1px solid #fecaca",background:"white",color:"#dc2626",cursor:"pointer",flexShrink:0}}>ลบ</button>
            </div>
          ) : (
            <label style={{display:"flex",alignItems:"center",gap:9,padding:"11px 14px",borderRadius:10,border:"1.5px dashed #cbd5e1",background:"#f8fafc",cursor:"pointer"}}>
              <i className="ti ti-upload" style={{fontSize:18,color:"#94a3b8"}}></i>
              <span style={{fontSize:11,color:"#64748b"}}>คลิกเพื่อแนบไฟล์ PDF ผลทดลอง</span>
              <input type="file" accept=".pdf,application/pdf" style={{display:"none"}} onChange={e=>{
                const file=e.target.files?.[0]; if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>{ const next={...form,trialPdfDataUrl:ev.target.result,trialPdfFileName:file.name}; setForm(next); onPurchaseChange(a.id,next); };
                reader.readAsDataURL(file); e.target.value="";
              }}/>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
// ── Excel export using HTML table (opens correctly in Thai Excel) ─────────────
function exportToXLS(header, rows, filename) {
  const escape = s => String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const thCells = header.map(h=>`<th style="background:#1d4ed8;color:white;font-weight:bold;padding:6px 10px;border:1px solid #ddd">${escape(h)}</th>`).join("");
  const rowsHTML = rows.map((r,i)=>
    `<tr style="background:${i%2===0?"#f8fafc":"white"}">${r.map(c=>`<td style="padding:5px 10px;border:1px solid #e2e8f0">${escape(c)}</td>`).join("")}</tr>`
  ).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${escape(filename)}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${"<tr>"+thCells+"</tr>"}${rowsHTML}</table></body></html>`;
  const blob = new Blob(["\uFEFF"+html], {type:"application/vnd.ms-excel;charset=utf-8"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`${filename}.xls`; a.click();
  URL.revokeObjectURL(url);
}

function exportCpapExcel(rows, filename) {
  if(!rows||rows.length<2) return;
  exportToXLS(rows[0], rows.slice(1), filename);
}

// ── PurchasedCard — collapsed by default, click to expand ─────────────────────
function PurchasedCard({ a, h, c, purch, billing, com, isAdmin, salesList=[], onDecision, onPurchaseChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:"white",border:"1.5px solid #86efac",borderRadius:14,overflow:"hidden",transition:"box-shadow .15s"}}>
      {/* Clickable summary header */}
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:"#f0fdf4",cursor:"pointer",userSelect:"none"}}>
        <div style={{width:42,height:42,borderRadius:12,background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:c.text,flexShrink:0}}>
          {(a.name||"?")[0]}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{a.name}</div>
          <div style={{fontSize:11,color:"#64748b",marginTop:2}}>HN {a.hn} · {h?.name}</div>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            {purch.model && <span style={{fontSize:11,fontWeight:600,color:"#059669"}}>{purch.model}</span>}
            {purch.serialNo && <span style={{fontSize:10,padding:"1px 7px",borderRadius:7,background:"#f1f5f9",color:"#475569",fontFamily:"monospace"}}>{purch.serialNo}</span>}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:800,color:"#059669",lineHeight:1}}>{(purch.price||0).toLocaleString()} ฿</div>
          {isAdmin&&<div style={{fontSize:10,color:"#7c3aed",marginTop:2}}>คอม {com.toLocaleString()} ฿</div>}
          <div style={{fontSize:10,padding:"2px 9px",borderRadius:8,background:billing.bg,color:billing.color,fontWeight:600,marginTop:4,display:"inline-block"}}>{billing.label}</div>
        </div>
        <i className={`ti ti-chevron-${open?"up":"down"}`} style={{fontSize:14,color:"#64748b",flexShrink:0,marginLeft:4}}></i>
      </div>
      {/* Expandable edit form */}
      {open && (
        <PurchaseCard
          a={a}
          hospitals={[h].filter(Boolean)}
          isAdmin={isAdmin}
          salesList={salesList}
          onDecision={onDecision}
          onPurchaseChange={onPurchaseChange}
        />
      )}
    </div>
  );
}

// ── Hospital CPAP-Only View — Status + Print PDF only ─────────────────────────
function HospCpapView({ user, appointments, hospitals }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all|waiting|trialing|waiting_buy|purchased

  const today = new Date().toISOString().split("T")[0];
  const fmtDate = s => {
    if(!s) return "—";
    const d=new Date(s); const M=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()+543}`;
  };

  const getStage = a => {
    const dec = a.cpapDecision||"";
    if(["purchased_after_trial","purchase_direct"].includes(dec)) return "purchased";
    if(dec==="finished_trial") return "waiting_buy";
    const trials=a.cpapTrials||[];
    const withModel=trials.filter(t=>t.model&&t.model!=="(รอกรอกรุ่น)");
    if(dec==="trial"||trials.length>0){
      const allRet=withModel.length>0&&withModel.every(t=>t.returnDate&&t.returnDate<=today);
      return allRet?"waiting_buy":"trialing";
    }
    return "waiting";
  };

  const STAGES = {
    waiting:    {label:"รอทดลอง",       color:"#d97706",bg:"#fef9c3",icon:"ti-clock"},
    trialing:   {label:"กำลังทดลอง",    color:"#7c3aed",bg:"#ede9fe",icon:"ti-device-heart-monitor"},
    waiting_buy:{label:"รอซื้อเครื่อง", color:"#1e40af",bg:"#dbeafe",icon:"ti-shopping-cart"},
    purchased:  {label:"ซื้อแล้ว",      color:"#059669",bg:"#d1fae5",icon:"ti-check-circle"},
  };

  const pool = appointments.filter(a=>
    a.status!=="cancelled" && a.hospId===user.hospId &&
    (a.apptType==="cpap_trial"||(a.apptType==="sleep_test"&&a.journeyStatus==="consulted"))
  );
  const trimQ = q.trim().toLowerCase();
  const list = pool
    .filter(a=>filter==="all"||getStage(a)===filter)
    .filter(a=>!trimQ||a.name?.toLowerCase().includes(trimQ)||a.hn?.toLowerCase().includes(trimQ))
    .sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const counts = { waiting:0,trialing:0,waiting_buy:0,purchased:0 };
  pool.forEach(a=>{ const s=getStage(a); counts[s]=(counts[s]||0)+1; });

  const openPdf = url => {
    const w=window.open("","_blank");
    w.document.write(`<html><body style="margin:0;background:#333"><iframe src="${url}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`);
    w.document.close();
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",fontFamily:FONT}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.line}`,background:T.card,flexShrink:0}}>
        <div style={{fontSize:13,fontWeight:800,color:"#5b21b6",marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          <i className="ti ti-device-heart-monitor" style={{fontSize:15}}></i>
          สถานะ CPAP ผู้ป่วย
          <span style={{fontSize:11,fontWeight:400,color:T.muted,marginLeft:2}}>{pool.length} ราย</span>
        </div>
        {/* Filter chips */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          {[["all","ทั้งหมด",pool.length,"#64748b","#f1f5f9"],
            ["waiting","รอทดลอง",counts.waiting,"#d97706","#fef9c3"],
            ["trialing","กำลังทดลอง",counts.trialing,"#7c3aed","#ede9fe"],
            ["waiting_buy","รอซื้อเครื่อง",counts.waiting_buy,"#1e40af","#dbeafe"],
            ["purchased","ซื้อแล้ว",counts.purchased,"#059669","#d1fae5"],
          ].map(([key,lb,cnt,col,bg])=>(
            <button key={key} onClick={()=>setFilter(key)}
              style={{padding:"5px 12px",fontSize:11,fontWeight:filter===key?700:400,borderRadius:16,border:`1.5px solid ${filter===key?col:"#e2e8f0"}`,background:filter===key?bg:"white",color:filter===key?col:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}>
              {lb}<span style={{fontSize:10,background:filter===key?col:"#e2e8f0",color:filter===key?"white":"#64748b",borderRadius:8,padding:"0 6px",fontWeight:700}}>{cnt}</span>
            </button>
          ))}
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ค้นหาชื่อ / HN..."
          style={{width:"100%",padding:"8px 12px",fontSize:12,border:`1px solid ${T.line}`,borderRadius:9,outline:"none",background:T.surf,color:T.ink,boxSizing:"border-box"}}/>
      </div>

      {/* Patient list */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {list.length===0 && (
          <div style={{textAlign:"center",padding:"50px 20px",color:T.faint}}>
            <i className="ti ti-device-heart-monitor" style={{fontSize:36,color:"#ddd6fe"}}></i>
            <div style={{marginTop:10,fontSize:13,fontWeight:600,color:T.muted}}>ไม่พบผู้ป่วย</div>
          </div>
        )}
        {list.map(a=>{
          const stage = getStage(a);
          const sc    = STAGES[stage]||STAGES.waiting;
          const trials = (a.cpapTrials||[]).filter(t=>t.model&&t.model!=="(รอกรอกรุ่น)");
          const purch  = a.cpapPurchase||{};
          const c      = hc(a.hospId, hospitals);

          return (
            <div key={a.id} style={{background:"white",borderRadius:14,border:`1.5px solid ${sc.color}30`,overflow:"hidden"}}>
              {/* Patient row */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:sc.bg+"60",borderBottom:`0.5px solid ${sc.color}20`}}>
                <div style={{width:38,height:38,borderRadius:10,background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:c.text,flexShrink:0}}>
                  {(a.name||"?")[0]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{a.name}</div>
                  <div style={{fontSize:11,color:T.faint}}>HN {a.hn}
                    {a.phone&&<> · <a href={`tel:${a.phone}`} style={{color:"#059669",textDecoration:"none"}}>{a.phone}</a></>}
                  </div>
                </div>
                {/* Stage badge */}
                <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:20,background:sc.bg,border:`1px solid ${sc.color}50`,flexShrink:0}}>
                  <i className={`ti ${sc.icon}`} style={{fontSize:11,color:sc.color}}></i>
                  <span style={{fontSize:11,fontWeight:700,color:sc.color}}>{sc.label}</span>
                </div>
              </div>

              {/* Trial details — compact */}
              {(trials.length>0||purch.model) && (
                <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:8}}>
                  {trials.map((tr,i)=>(
                    <div key={i} style={{padding:"9px 12px",background:"#fafaff",borderRadius:10,border:"0.5px solid #ddd6fe"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div>
                          <div style={{fontSize:11,color:"#7c3aed",fontWeight:700,marginBottom:2}}>รุ่นที่ {i+1}: {tr.model}</div>
                          <div style={{fontSize:10,color:T.faint,display:"flex",gap:10}}>
                            {tr.trialDate&&<span>เริ่ม {fmtDate(tr.trialDate)}</span>}
                            {tr.returnDate&&<span>คืน {fmtDate(tr.returnDate)}</span>}
                            {tr.note&&<span>• {tr.note}</span>}
                          </div>
                          {tr.maskModel&&<div style={{fontSize:10,color:T.faint,marginTop:1}}>Mask: {tr.maskModel==="อื่นๆ (พิมพ์เอง)"?(tr.maskOther||"—"):tr.maskModel}{tr.maskSize?` (${tr.maskSize})`:""}</div>}
                        </div>
                        {/* Print PDF per trial */}
                        {tr.pdfDataUrl && (
                          <button onClick={()=>openPdf(tr.pdfDataUrl)}
                            style={{padding:"6px 13px",fontSize:11,fontWeight:700,borderRadius:8,background:"#dc2626",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                            <i className="ti ti-printer" style={{fontSize:12}}></i>Print
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Purchased info */}
                  {purch.model && (
                    <div style={{padding:"9px 12px",background:"#f0fdf4",borderRadius:10,border:"1px solid #86efac",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                      <div>
                        <div style={{fontSize:11,fontWeight:700,color:"#059669"}}>✓ ซื้อแล้ว: {purch.model}</div>
                        <div style={{fontSize:10,color:"#166534",marginTop:2}}>
                          {purch.serialNo&&<span>S/N {purch.serialNo}</span>}
                          {purch.purchaseDate&&<span> · {fmtDate(purch.purchaseDate)}</span>}
                          {purch.price>0&&<span> · {purch.price.toLocaleString()} ฿</span>}
                        </div>
                      </div>
                      {purch.trialPdfDataUrl && (
                        <button onClick={()=>openPdf(purch.trialPdfDataUrl)}
                          style={{padding:"6px 13px",fontSize:11,fontWeight:700,borderRadius:8,background:"#dc2626",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                          <i className="ti ti-printer" style={{fontSize:12}}></i>Print PDF
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* No data yet */}
              {trials.length===0 && !purch.model && (
                <div style={{padding:"9px 14px",fontSize:11,color:T.faint,display:"flex",alignItems:"center",gap:6}}>
                  <i className="ti ti-clock" style={{fontSize:13}}></i>รอ Sales บันทึกข้อมูลการทดลอง
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SalesPatientView({ user, appointments, hospitals, setAppointments, salesList=[], isCpapOnlyHosp=false }) {
  // ── Hooks MUST come first (before any conditional returns) ──
  const isAdmin   = user.role==="admin";
  const canEdit   = isAdmin || user.role==="sales";
  const [tab, setTab]         = useState("summary");
  const [selHosp, setSelHosp] = useState(isCpapOnlyHosp?user.hospId:"all");
  const [q, setQ]             = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name:"", hn:"", phone:"", hospId:isCpapOnlyHosp?user.hospId:"", paymentType:"" });

  const cpapOnlyHosps = hospitals.filter(h=>h.cpapOnly);

  // CPAP-only hospital → dedicated read-only view (after all hooks)
  if(isCpapOnlyHosp) return <HospCpapView user={user} appointments={appointments} hospitals={hospitals}/>;

  const addPatient = () => {
    if(!addForm.name.trim()||!addForm.hospId) return;
    setAppointments(p=>[...p,{
      id:"csale"+Date.now(), hn:addForm.hn.trim(), name:addForm.name.trim(),
      phone:addForm.phone.trim(), hospId:addForm.hospId,
      date:new Date().toISOString().split("T")[0],
      note:"", status:"active", apptType:"cpap_trial", journeyStatus:"scheduled",
      paymentType:addForm.paymentType||"", cancelReason:"", cancelledAt:null,
    }]);
    setAddForm({ name:"", hn:"", phone:"", hospId:"", paymentType:"" });
    setShowAdd(false);
    setTab("waiting");
  };

  const today = new Date().toISOString().split("T")[0];
  const fmtDate = s => {
    if(!s) return "—";
    const d=new Date(s);
    const M=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()+543}`;
  };

  const getStatus = a => {
    if(["purchased_after_trial","purchase_direct"].includes(a.cpapDecision)) return "purchased";
    const allTrials       = a.cpapTrials||[];
    const trialsWithModel = allTrials.filter(t=>t.model&&t.model!=="(รอกรอกรุ่น)");
    // finished_trial = คืนเครื่องแล้ว → รอซื้อ
    if(a.cpapDecision==="finished_trial") return "waiting_buy";
    // cpapDecision="trial" OR มี trial record = กำลังทดลอง
    if(a.cpapDecision==="trial" || allTrials.length>0) {
      const allReturned = trialsWithModel.length>0 && trialsWithModel.every(t=>t.returnDate&&t.returnDate<=today);
      return allReturned ? "waiting_buy" : "trialing";
    }
    return "waiting";
  };

  // CPAP-only รพ. เห็นเฉพาะผู้ป่วยของ รพ. ตัวเอง
  const pool = appointments.filter(a=>
    a.status!=="cancelled" &&
    (a.apptType==="cpap_trial"||(a.apptType==="sleep_test"&&a.journeyStatus==="consulted")) &&
    (selHosp==="all"||a.hospId===selHosp)
  );
  const trimQ = q.trim().toLowerCase();
  const byStatus = st => pool.filter(a=>getStatus(a)===st).filter(a=>!trimQ||a.name?.toLowerCase().includes(trimQ)||a.hn?.toLowerCase().includes(trimQ));

  // Update helpers — disabled for hospital role (read-only)
  const upd      = (id,obj)     => canEdit&&setAppointments(p=>p.map(a=>a.id===id?{...a,...obj}:a));
  const updTr    = (id,ti,f,v)  => canEdit&&setAppointments(p=>p.map(a=>{if(a.id!==id)return a;const t=(a.cpapTrials||[]).map((x,i)=>i===ti?{...x,[f]:v}:x);return{...a,cpapTrials:t};}));
  // อัปเดตหลาย field พร้อมกัน (ป้องกัน race condition)
  const updTrObj = (id,ti,obj)  => setAppointments(p=>p.map(a=>{if(a.id!==id)return a;const t=(a.cpapTrials||[]).map((x,i)=>i===ti?{...x,...obj}:x);return{...a,cpapTrials:t};}));
  // เพิ่ม trial slot ใหม่ (ใช้ functional update ป้องกัน stale state)
  const addTrialSlot = id => setAppointments(p=>p.map(a=>{ if(a.id!==id)return a; const t=[...(a.cpapTrials||[]),{id:"tr"+Date.now(),model:"",trialDate:today,returnDate:"",serialNo:"",dn:"",maskModel:"",maskOther:"",maskSize:"",note:"",pdfDataUrl:"",pdfFileName:""}]; return {...a,cpapTrials:t}; }));
  const updPu = (id,f,v)  => setAppointments(p=>p.map(a=>a.id===id?{...a,cpapPurchase:{...(a.cpapPurchase||{}),[f]:v}}:a));

  // Status actions
  const startTrial = id => {
    setAppointments(p=>p.map(a=>{
      if(a.id!==id) return a;
      const existing = a.cpapTrials||[];
      // เพิ่มจนครบ 2 slots
      const slots = [...existing];
      while(slots.length < 2) {
        slots.push({id:"tr"+Date.now()+"_"+slots.length,model:"",trialDate:today,returnDate:"",serialNo:"",dn:"",maskModel:"",maskOther:"",maskSize:"",note:"",pdfDataUrl:"",pdfFileName:""});
      }
      return {...a,cpapTrials:slots,cpapDecision:"trial"};
    }));
    setTab("trialing");
  };
  const finishTrial = id => {
    setAppointments(p=>p.map(a=>{
      if(a.id!==id) return a;
      // ถ้ายังไม่มีรุ่น ให้ใส่ returnDate วันนี้ไว้ก่อน แล้ว Sales ค่อยกลับมากรอก model
      const t=(a.cpapTrials||[]).map((x,i)=>
        i===(a.cpapTrials.length-1)?{...x,returnDate:x.returnDate||today,model:x.model||"(รอกรอกรุ่น)"}:x
      );
      return {...a,cpapTrials:t,cpapDecision:"finished_trial"};
    }));
    setTab("waiting_buy");
  };

  const STATUS_CFG = {
    waiting:    {label:"รอทดลอง",       color:"#d97706",bg:"#fef9c3",icon:"ti-clock"},
    trialing:   {label:"กำลังทดลอง",    color:"#7c3aed",bg:"#ede9fe",icon:"ti-device-heart-monitor"},
    waiting_buy:{label:"รอซื้อเครื่อง", color:"#1e40af",bg:"#dbeafe",icon:"ti-shopping-cart"},
    purchased:  {label:"ซื้อแล้ว",      color:"#059669",bg:"#d1fae5",icon:"ti-check-circle"},
  };
  const BILLING=[
    {key:"pending",label:"ยังไม่วางบิล",color:"#d97706",bg:"#fef9c3"},
    {key:"billed", label:"วางบิลแล้ว",  color:"#1e40af",bg:"#dbeafe"},
    {key:"paid",   label:"รับเงินแล้ว", color:"#059669",bg:"#d1fae5"},
  ];
  const IS={width:"100%",padding:"7px 10px",fontSize:12,border:"1px solid #e2e8f0",borderRadius:8,outline:"none",background:"white",color:"#111827",boxSizing:"border-box",fontFamily:"inherit"};

  // Mask input helper — "อื่นๆ" shows text input
  const MaskInput = ({value,customVal,onModel,onCustom,onSize,sizeVal,small}) => {
    const isOther = value==="อื่นๆ (พิมพ์เอง)";
    return (
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <div style={{flex:2,minWidth:140}}>
          <select value={value||""} onChange={e=>onModel(e.target.value)} style={{...IS,border:"1px solid #ddd6fe"}}>
            <option value="">— เลือก Mask —</option>
            {MASK_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {isOther && (
          <input value={customVal||""} onChange={e=>onCustom(e.target.value)} placeholder="ระบุรุ่น Mask..."
            style={{...IS,flex:2,minWidth:100,border:"1px solid #ddd6fe"}}/>
        )}
        {onSize && (
          <select value={sizeVal||""} onChange={e=>onSize(e.target.value)} style={{...IS,minWidth:70,flex:1,border:"1px solid #ddd6fe"}}>
            <option value="">ขนาด</option>
            {MASK_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
    );
  };

  // Export functions
  const doExport = () => {
    if(tab==="summary") {
      const rows=[["สถานะ","จำนวน"],["รอทดลอง",byStatus("waiting").length],["กำลังทดลอง",byStatus("trialing").length],["รอซื้อเครื่อง",byStatus("waiting_buy").length],["ซื้อแล้ว",byStatus("purchased").length]];
      exportCpapExcel(rows,"CPAP_Summary");
    } else if(tab==="waiting") {
      const hdr=["ชื่อ","HN","เบอร์โทร","โรงพยาบาล","วันนัด"];
      const rows=byStatus("waiting").map(a=>{const h=hospitals.find(x=>x.id===a.hospId);return[a.name,a.hn,a.phone||"—",h?.name||"",fmtDate(a.date)];});
      exportCpapExcel([hdr,...rows],"CPAP_รอทดลอง");
    } else if(tab==="trialing") {
      const hdr=["ชื่อ","HN","เบอร์โทร","รพ.","รุ่นที่ทดลอง","S/N","DN","Mask","ขนาด","วันเริ่ม","วันคืน"];
      const rows=byStatus("trialing").flatMap(a=>{
        const h=hospitals.find(x=>x.id===a.hospId);
        const t=(a.cpapTrials||[]);
        if(!t.length)return[[a.name,a.hn,a.phone||"—",h?.name||"","","","","","","",""]];
        return t.map((tr,i)=>[i===0?a.name:"",i===0?a.hn:"",i===0?(a.phone||"—"):"",i===0?(h?.name||""):"",tr.model||"",tr.serialNo||"",tr.dn||"",tr.maskModel==="อื่นๆ (พิมพ์เอง)"?(tr.maskOther||""):tr.maskModel||"",tr.maskSize||"",fmtDate(tr.trialDate),fmtDate(tr.returnDate)]);
      });
      exportCpapExcel([hdr,...rows],"CPAP_กำลังทดลอง");
    } else if(tab==="waiting_buy") {
      const hdr=["ชื่อ","HN","เบอร์โทร","รพ.","รุ่นที่ทดลอง","S/N (trial)","Mask ทดลอง","วันคืน"];
      const rows=byStatus("waiting_buy").flatMap(a=>{
        const h=hospitals.find(x=>x.id===a.hospId);
        const t=(a.cpapTrials||[]).filter(x=>x.model);
        return t.map((tr,i)=>[i===0?a.name:"",i===0?a.hn:"",i===0?(a.phone||"—"):"",i===0?(h?.name||""):"",tr.model||"",tr.serialNo||"",tr.maskModel||"",fmtDate(tr.returnDate)]);
      });
      exportCpapExcel([hdr,...rows],"CPAP_รอซื้อ");
    } else if(tab==="purchased") {
      const hdr=["ชื่อ","HN","เบอร์โทร","รพ.","รุ่นที่ซื้อ","S/N ขาย","ราคา","Mask ซื้อ","วันซื้อ","สถานะบิล"];
      const rows=byStatus("purchased").map(a=>{const h=hospitals.find(x=>x.id===a.hospId);const p=a.cpapPurchase||{};const b=BILLING.find(x=>x.key===(p.billingStatus||"pending"));return[a.name,a.hn,a.phone||"—",h?.name||"",p.model||"",p.serialNo||"",p.price||0,p.maskModel||"",fmtDate(p.purchaseDate),b?.label||""];});
      exportCpapExcel([hdr,...rows],"CPAP_ซื้อแล้ว");
    }
  };

  const TabBtn = ({id,label,cnt,col,bg}) => (
    <button onClick={()=>setTab(id)}
      style={{padding:"7px 14px",fontSize:12,fontWeight:tab===id?700:400,borderRadius:20,border:`1.5px solid ${tab===id?col:"#e2e8f0"}`,background:tab===id?bg:"white",color:tab===id?col:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
      {label}
      {cnt!==undefined&&<span style={{fontSize:11,background:tab===id?col:"#e2e8f0",color:tab===id?"white":"#64748b",borderRadius:10,padding:"1px 7px",fontWeight:700}}>{cnt}</span>}
    </button>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",fontFamily:FONT}}>
      {/* Header */}
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.line}`,background:T.card,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <i className="ti ti-device-heart-monitor" style={{fontSize:17,color:"#7c3aed"}}></i>
          <span style={{fontSize:14,fontWeight:800,color:T.navy}}>CPAP Sales</span>
          <span style={{fontSize:12,color:T.muted}}>{pool.length} รายการ</span>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            {/* Add patient — Sales, Admin, CPAP-only hospital can add */}
            {(isAdmin || user.role==="sales" || isCpapOnlyHosp) && (
              <button onClick={()=>setShowAdd(s=>!s)}
                style={{padding:"7px 13px",fontSize:12,fontWeight:700,borderRadius:9,background:showAdd?"#7c3aed":T.surf,color:showAdd?"white":"#7c3aed",border:`1.5px solid ${showAdd?"#7c3aed":"#a78bfa"}`,cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:5}}>
                <i className="ti ti-user-plus" style={{fontSize:13}}></i>เพิ่มผู้ป่วย
              </button>
            )}
            <select value={selHosp} onChange={e=>setSelHosp(e.target.value)}
              style={{...IS,width:"auto",minWidth:130,border:`1px solid ${T.line}`}}>
              <option value="all">ทุก รพ.</option>
              {hospitals.map(h=><option key={h.id} value={h.id}>{h.cpapOnly?"[CPAP] ":""}{h.name}</option>)}
            </select>
            <button onClick={doExport}
              style={{padding:"7px 13px",fontSize:12,fontWeight:700,borderRadius:9,background:"#059669",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:5}}>
              <i className="ti ti-file-spreadsheet" style={{fontSize:13}}></i>Export Excel
            </button>
          </div>
        </div>
        {/* Add patient form */}
        {showAdd && (
          <div style={{padding:"12px 16px",background:"#fafaff",borderRadius:12,border:"1px solid #ddd6fe",marginBottom:4}}>
            <div style={{fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:10}}>เพิ่มรายชื่อผู้ป่วย CPAP</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              <div>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>ชื่อ-นามสกุล *</div>
                <input value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))} placeholder="น.ส.ดวงดี ดวงใจ" style={{...IS,border:"1px solid #ddd6fe"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>HN</div>
                <input value={addForm.hn} onChange={e=>setAddForm(f=>({...f,hn:e.target.value}))} placeholder="12345678" style={{...IS,border:"1px solid #ddd6fe"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>เบอร์โทร</div>
                <input value={addForm.phone} onChange={e=>setAddForm(f=>({...f,phone:e.target.value}))} placeholder="081XXXXXXX" style={{...IS,border:"1px solid #ddd6fe"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>โรงพยาบาล *</div>
                <select value={addForm.hospId} onChange={e=>setAddForm(f=>({...f,hospId:e.target.value}))} style={{...IS,border:"1px solid #ddd6fe"}}>
                  <option value="">— เลือก รพ. —</option>
                  {hospitals.map(h=><option key={h.id} value={h.id}>{h.cpapOnly?"[CPAP] ":""}{h.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>สิทธิ์การรักษา</div>
                <select value={addForm.paymentType} onChange={e=>setAddForm(f=>({...f,paymentType:e.target.value}))} style={{...IS,border:"1px solid #ddd6fe"}}>
                  <option value="">— เลือกสิทธิ์ —</option>
                  {PAYMENT_TYPES.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addPatient} disabled={!addForm.name.trim()||!addForm.hospId}
                style={{padding:"9px 18px",fontSize:12,fontWeight:700,borderRadius:9,background:addForm.name.trim()&&addForm.hospId?"#7c3aed":"#e2e8f0",color:addForm.name.trim()&&addForm.hospId?"white":"#94a3b8",border:"none",cursor:addForm.name.trim()&&addForm.hospId?"pointer":"not-allowed",fontFamily:FONT}}>
                <i className="ti ti-plus" style={{marginRight:5,fontSize:13}}></i>เพิ่มผู้ป่วย
              </button>
              <button onClick={()=>setShowAdd(false)} style={{padding:"9px 14px",fontSize:12,borderRadius:9,border:`1px solid ${T.line}`,background:"white",color:T.muted,cursor:"pointer",fontFamily:FONT}}>ยกเลิก</button>
            </div>
          </div>
        )}
        {/* Tabs */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <TabBtn id="summary"    label="สรุปภาพรวม"    col="#64748b" bg="#f1f5f9"/>
          <TabBtn id="waiting"    label="รอทดลอง"       cnt={byStatus("waiting").length}    col="#d97706" bg="#fef9c3"/>
          <TabBtn id="trialing"   label="กำลังทดลอง"   cnt={byStatus("trialing").length}   col="#7c3aed" bg="#ede9fe"/>
          <TabBtn id="waiting_buy"label="รอซื้อเครื่อง" cnt={byStatus("waiting_buy").length} col="#1e40af" bg="#dbeafe"/>
          <TabBtn id="purchased"  label="ซื้อแล้ว"      cnt={byStatus("purchased").length}  col="#059669" bg="#d1fae5"/>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>

        {/* ── SUMMARY TAB ── */}
        {tab==="summary" && (
          <>
          {/* Stat cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:4}}>
            {[
              ["waiting","รอทดลอง",byStatus("waiting").length,"#d97706","#fef9c3","ti-clock"],
              ["trialing","กำลังทดลอง",byStatus("trialing").length,"#7c3aed","#ede9fe","ti-device-heart-monitor"],
              ["waiting_buy","รอซื้อเครื่อง",byStatus("waiting_buy").length,"#1e40af","#dbeafe","ti-shopping-cart"],
              ["purchased","ซื้อแล้ว",byStatus("purchased").length,"#059669","#d1fae5","ti-check-circle"],
            ].map(([key,lb,cnt,col,bg,ic])=>(
              <div key={key} onClick={()=>setTab(key)} style={{padding:"18px 16px",background:bg,borderRadius:16,border:`1.5px solid ${col}30`,cursor:"pointer",transition:"transform .12s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <i className={`ti ${ic}`} style={{fontSize:18,color:col}}></i>
                  <span style={{fontSize:12,color:col,fontWeight:500}}>{lb}</span>
                </div>
                <div style={{fontSize:36,fontWeight:800,color:col,lineHeight:1}}>{cnt}</div>
                <div style={{fontSize:11,color:col,opacity:.7,marginTop:5}}>ราย → กดดูรายชื่อ</div>
              </div>
            ))}
          </div>
          {/* Total not purchased */}
          <div style={{padding:"14px 18px",background:"#fff7ed",borderRadius:14,border:"1.5px solid #fed7aa",display:"flex",alignItems:"center",gap:12}}>
            <i className="ti ti-alert-circle" style={{fontSize:22,color:"#c2410c",flexShrink:0}}></i>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:"#c2410c"}}>
                {byStatus("waiting").length+byStatus("trialing").length+byStatus("waiting_buy").length} ราย ยังไม่ซื้อเครื่อง
              </div>
              <div style={{fontSize:12,color:"#92400e",marginTop:3}}>
                รอทดลอง {byStatus("waiting").length} · กำลังทดลอง {byStatus("trialing").length} · รอซื้อ {byStatus("waiting_buy").length}
              </div>
            </div>
          </div>
          </>
        )}

        {/* ── SEARCH BAR (non-summary) ── */}
        {tab!=="summary" && (
          <div style={{position:"relative"}}>
            <i className="ti ti-search" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94a3b8"}}></i>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ค้นหาชื่อ / HN..."
              style={{...IS,paddingLeft:33,border:`1px solid ${T.line}`}}/>
          </div>
        )}

        {/* ── WAITING TAB — รอทดลอง ── */}
        {tab==="waiting" && byStatus("waiting").map(a=>{
          const h=hospitals.find(x=>x.id===a.hospId);
          const c=hc(a.hospId,hospitals);
          return (
            <div key={a.id} style={{background:T.card,border:"1px solid #e2e8f0",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:c.text,flexShrink:0}}>
                {(a.name||"?")[0]}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.navy}}>{a.name}</div>
                <div style={{fontSize:11,color:T.faint,marginTop:2}}>HN {a.hn} · {h?.name}</div>
                {a.phone && (
                  <div style={{fontSize:12,color:"#059669",fontWeight:600,marginTop:3,display:"flex",alignItems:"center",gap:5}}>
                    <i className="ti ti-phone" style={{fontSize:12}}></i>
                    <a href={`tel:${a.phone}`} style={{color:"inherit",textDecoration:"none"}}>{a.phone}</a>
                  </div>
                )}
                {a.note && <div style={{fontSize:11,color:T.faint,marginTop:2}}>{a.note}</div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,color:T.faint,marginBottom:7}}>{fmtDate(a.date)}</div>
                <button onClick={()=>startTrial(a.id)}
                  style={{padding:"8px 16px",fontSize:12,fontWeight:700,borderRadius:10,background:"#7c3aed",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:6}}>
                  <i className="ti ti-device-heart-monitor" style={{fontSize:13}}></i>เริ่มทดลอง
                </button>
              </div>
            </div>
          );
        })}
        {tab==="waiting" && byStatus("waiting").length===0 && (
          <div style={{textAlign:"center",padding:"40px",color:T.faint}}>
            <i className="ti ti-check-circle" style={{fontSize:36,color:"#10b981"}}></i>
            <div style={{marginTop:10,fontSize:14,fontWeight:600,color:"#059669"}}>ไม่มีผู้ป่วยรอทดลอง</div>
          </div>
        )}

        {/* ── TRIALING TAB — กำลังทดลอง ── */}
        {tab==="trialing" && byStatus("trialing").map(a=>{
          const h=hospitals.find(x=>x.id===a.hospId);
          const c=hc(a.hospId,hospitals);
          const trials=a.cpapTrials||[];
          return (
            <div key={a.id} style={{background:T.card,border:"1.5px solid #ddd6fe",borderRadius:14}}>
              {/* Patient header */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fafaff",borderRadius:"14px 14px 0 0",borderBottom:"1px solid #e2e8f0"}}>
                <div style={{width:40,height:40,borderRadius:11,background:c.bg,border:`1.5px solid ${c.dot}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:c.text,flexShrink:0}}>
                  {(a.name||"?")[0]}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.navy}}>{a.name}</div>
                  <div style={{fontSize:11,color:T.faint}}>HN {a.hn} · {h?.name}</div>
                  {a.phone&&<div style={{fontSize:11,color:"#059669",fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:1}}><i className="ti ti-phone" style={{fontSize:10}}></i>{a.phone}</div>}
                </div>
                <button onClick={()=>finishTrial(a.id)}
                  style={{padding:"8px 14px",fontSize:12,fontWeight:700,borderRadius:10,background:"#1e40af",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  <i className="ti ti-check" style={{fontSize:12}}></i>ทดลองเสร็จแล้ว
                </button>
              </div>

              {/* Trial cards */}
              <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                {trials.length===0 && (
                  <div style={{padding:"10px 13px",background:"#f5f3ff",borderRadius:10,border:"1px solid #a78bfa",fontSize:12,color:"#7c3aed"}}>
                    <i className="ti ti-edit" style={{marginRight:6}}></i>
                    กรุณากรอกรายละเอียดเครื่องทดลองด้านล่าง
                  </div>
                )}
                {trials.map((tr,i)=>(
                  <div key={tr.id||i} style={{background:"white",borderRadius:12,border:"1.5px solid #a78bfa",padding:"14px"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
                      <span style={{width:24,height:24,borderRadius:"50%",background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
                      รุ่นที่ {i+1} — กรอกรายละเอียด
                    </div>

                    {/* Row 1: Model */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginBottom:4}}>รุ่นเครื่อง CPAP/BiPAP</div>
                      <select value={["(รอกรอกรุ่น)"].includes(tr.model)?"":tr.model||""}
                        onChange={e=>updTr(a.id,i,"model",e.target.value)}
                        style={{width:"100%",padding:"9px 12px",fontSize:13,fontWeight:600,border:"1.5px solid #a78bfa",borderRadius:9,outline:"none",background:"white",color:"#111827",boxSizing:"border-box"}}>
                        <option value="">— เลือกรุ่น CPAP/BiPAP —</option>
                        {CPAP_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    {/* Row 2: S/N + DN */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div>
                        <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginBottom:4}}>Serial No. (S/N)</div>
                        <input value={tr.serialNo||""} onChange={e=>updTr(a.id,i,"serialNo",e.target.value)}
                          placeholder="SN-XXXXXXXX"
                          style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",fontFamily:"monospace",boxSizing:"border-box"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginBottom:4}}>DN (Delivery Note)</div>
                        <input value={tr.dn||""} onChange={e=>updTr(a.id,i,"dn",e.target.value)}
                          placeholder="DN-XXXX"
                          style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",fontFamily:"monospace",boxSizing:"border-box"}}/>
                      </div>
                    </div>

                    {/* Row 3: Mask model + Size */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginBottom:4}}>รุ่น Mask + ขนาด</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
                        <select value={tr.maskModel||""} onChange={e=>updTr(a.id,i,"maskModel",e.target.value)}
                          style={{padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",width:"100%"}}>
                          <option value="">— เลือก Mask —</option>
                          {MASK_MODELS.map(m=><option key={m} value={m}>{m}</option>)}
                        </select>
                        {tr.maskModel && tr.maskModel!=="อื่นๆ (พิมพ์เอง)" && (
                          <select value={tr.maskSize||""} onChange={e=>updTr(a.id,i,"maskSize",e.target.value)}
                            style={{padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",minWidth:90}}>
                            <option value="">ขนาด</option>
                            {MASK_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </div>
                      {tr.maskModel==="อื่นๆ (พิมพ์เอง)" && (
                        <input value={tr.maskOther||""} onChange={e=>updTr(a.id,i,"maskOther",e.target.value)}
                          placeholder="ระบุรุ่น Mask..."
                          style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",marginTop:7,boxSizing:"border-box"}}/>
                      )}
                    </div>

                    {/* Row 4: Dates */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div>
                        <div style={{fontSize:10,color:"#059669",fontWeight:700,marginBottom:4}}>📅 วันเริ่มทดลอง</div>
                        <input type="date" value={tr.trialDate||""} onChange={e=>updTr(a.id,i,"trialDate",e.target.value)}
                          style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #86efac",borderRadius:8,outline:"none",background:"white",color:"#111827",boxSizing:"border-box"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#dc2626",fontWeight:700,marginBottom:4}}>📅 วันคืนเครื่อง</div>
                        <input type="date" value={tr.returnDate||""} onChange={e=>updTr(a.id,i,"returnDate",e.target.value)}
                          style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #fca5a5",borderRadius:8,outline:"none",background:"white",color:"#111827",boxSizing:"border-box"}}/>
                      </div>
                    </div>

                    {/* Row 5: Pressure note */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginBottom:4}}>แรงดัน / Pressure / หมายเหตุ</div>
                      <input value={tr.note||""} onChange={e=>updTr(a.id,i,"note",e.target.value)}
                        placeholder="เช่น APAP 6-12 cmH₂O, ปรับ Auto, ใช้ได้ดี..."
                        style={{width:"100%",padding:"8px 10px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:8,outline:"none",background:"white",color:"#111827",boxSizing:"border-box"}}/>
                    </div>

                    {/* Row 6: PDF attachment */}
                    <div>
                      <div style={{fontSize:10,color:"#dc2626",fontWeight:700,marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                        <i className="ti ti-file-type-pdf" style={{fontSize:12}}></i>แนบผลการทดลองรุ่นที่ {i+1} (PDF)
                      </div>
                      {tr.pdfDataUrl ? (
                        <div style={{padding:"8px 12px",background:"#f0fdf4",borderRadius:9,border:"1px solid #86efac",display:"flex",alignItems:"center",gap:9}}>
                          <i className="ti ti-file-check" style={{fontSize:18,color:"#059669",flexShrink:0}}></i>
                          <span style={{fontSize:11,fontWeight:600,color:"#166534",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tr.pdfFileName||"ผลทดลอง.pdf"}</span>
                          <button onClick={()=>{ const w=window.open("","_blank"); w.document.write(`<html><body style="margin:0;background:#333"><iframe src="${tr.pdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`); w.document.close(); }}
                            style={{padding:"5px 11px",fontSize:11,fontWeight:700,borderRadius:8,background:"#059669",color:"white",border:"none",cursor:"pointer",flexShrink:0}}>
                            <i className="ti ti-printer" style={{marginRight:3,fontSize:10}}></i>Print
                          </button>
                          <button onClick={()=>updTrObj(a.id,i,{pdfDataUrl:"",pdfFileName:""})}
                            style={{padding:"5px 9px",fontSize:11,borderRadius:8,border:"1px solid #fecaca",background:"white",color:"#dc2626",cursor:"pointer",flexShrink:0}}>ลบ</button>
                        </div>
                      ) : (
                        <label style={{display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderRadius:9,border:"1.5px dashed #fca5a5",background:"#fff5f5",cursor:"pointer"}}>
                          <i className="ti ti-upload" style={{fontSize:16,color:"#dc2626",flexShrink:0}}></i>
                          <span style={{fontSize:12,color:"#dc2626",fontWeight:500}}>คลิกเพื่อแนบ PDF ผลทดลองรุ่นนี้</span>
                          <input type="file" accept=".pdf,application/pdf" style={{display:"none"}} onChange={e=>{
                            const file=e.target.files?.[0]; if(!file) return;
                            const reader=new FileReader();
                            reader.onload=ev=>updTrObj(a.id,i,{pdfDataUrl:ev.target.result,pdfFileName:file.name});
                            reader.readAsDataURL(file); e.target.value="";
                          }}/>
                        </label>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add trial button */}
                {trials.length<3 && (
                  <button onClick={()=>addTrialSlot(a.id)}
                    style={{padding:"10px",fontSize:12,fontWeight:700,borderRadius:10,border:"1.5px dashed #a78bfa",background:"transparent",color:"#7c3aed",cursor:"pointer",fontFamily:FONT,width:"100%",marginTop:4}}>
                    <i className="ti ti-plus" style={{marginRight:6}}></i>
                    เพิ่มรุ่นที่ {trials.length+1} ({trials.length}/3)
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {tab==="trialing" && byStatus("trialing").length===0 && (
          <div style={{textAlign:"center",padding:"40px",color:T.faint}}>
            <i className="ti ti-device-heart-monitor" style={{fontSize:36,color:"#a78bfa"}}></i>
            <div style={{marginTop:10,fontSize:14,fontWeight:600,color:"#7c3aed"}}>ไม่มีผู้ป่วยกำลังทดลอง</div>
          </div>
        )}

        {/* ── WAITING BUY TAB — รอซื้อเครื่อง ── */}
        {tab==="waiting_buy" && byStatus("waiting_buy").map(a=>(
          <PurchaseCard key={a.id} a={a} hospitals={hospitals} isAdmin={isAdmin} salesList={salesList}
            onDecision={(id,dec)=>upd(id,{cpapDecision:dec})}
            onPurchaseChange={(id,newPurch)=>setAppointments(p=>p.map(x=>x.id===id?{...x,cpapPurchase:newPurch}:x))}
          />
        ))}
        {tab==="waiting_buy" && byStatus("waiting_buy").length===0 && (
          <div style={{textAlign:"center",padding:"40px",color:T.faint}}>
            <i className="ti ti-shopping-cart" style={{fontSize:36,color:"#93c5fd"}}></i>
            <div style={{marginTop:10,fontSize:14,fontWeight:600,color:"#1e40af"}}>ไม่มีผู้ป่วยรอซื้อเครื่อง</div>
          </div>
        )}

        {/* ── PURCHASED TAB — ซื้อแล้ว ── */}
        {tab==="purchased" && byStatus("purchased").map(a=>{
          const h=hospitals.find(x=>x.id===a.hospId);
          const c=hc(a.hospId,hospitals);
          const purch=a.cpapPurchase||{};
          const billing=BILLING.find(b=>b.key===(purch.billingStatus||"pending"))||BILLING[0];
          const com=Math.round((purch.price||0)*(purch.commissionRate??2)/100);
          return <PurchasedCard key={a.id} a={a} h={h} c={c} purch={purch} billing={billing} com={com} isAdmin={isAdmin} salesList={salesList}
            onDecision={(id,dec)=>upd(id,{cpapDecision:dec})}
            onPurchaseChange={(id,newPurch)=>setAppointments(p=>p.map(x=>x.id===id?{...x,cpapPurchase:newPurch}:x))}/>;
        })}
        {tab==="purchased" && byStatus("purchased").length===0 && (
          <div style={{textAlign:"center",padding:"40px",color:T.faint}}>
            <i className="ti ti-check-circle" style={{fontSize:36,color:"#6ee7b7"}}></i>
            <div style={{marginTop:10,fontSize:14,fontWeight:600,color:"#059669"}}>ยังไม่มีการซื้อ</div>
          </div>
        )}

      </div>
    </div>
  );
}


// ── Search View ───────────────────────────────────────────────────────────────
function SearchView({ user, appointments, hospitals }) {
  const [q, setQ] = useState("");
  const inputRef = useEffect ? null : null;
  const ref = { current:null };

  const isHosp = user.role==="hospital";

  // Filter base appointments for this user
  const pool = appointments.filter(a =>
    a.status!=="cancelled" &&
    (isHosp ? a.hospId===user.hospId : true)
  );

  // Search
  const trimQ = q.trim().toLowerCase();
  const results = trimQ.length<1 ? [] : pool.filter(a =>
    a.name?.toLowerCase().includes(trimQ) ||
    a.hn?.toLowerCase().includes(trimQ) ||
    a.phone?.toLowerCase().includes(trimQ)
  ).sort((a,b)=>b.date.localeCompare(a.date)); // newest first

  const fmtDateTH = s => {
    if(!s) return "—";
    const d=new Date(s);
    const months=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()+543}`;
  };

  const JOURNEY_LABEL = {
    scheduled:"รอตรวจ", tested:"ตรวจแล้ว", waiting_result:"รอแพทย์อ่านผล",
    result_ready:"ผลออกแล้ว", consulted:"ฟังผลแล้ว",
    trialed:"ทดลอง CPAP", received_device:"รับเครื่องแล้ว",
  };
  const JOURNEY_COLOR = {
    scheduled:["#dbeafe","#1e40af"], tested:["#ede9fe","#5b21b6"],
    waiting_result:["#fef9c3","#92400e"], result_ready:["#d1fae5","#065f46"],
    consulted:["#d1fae5","#059669"], trialed:["#ede9fe","#7c3aed"],
    received_device:["#dcfce7","#166534"],
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:FONT }}>

      {/* Search bar — sticky */}
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.line}`, background:T.card, flexShrink:0 }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.navy, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <i className="ti ti-search" style={{ fontSize:18, color:T.blue }}></i>
          ค้นหาผู้ป่วย
        </div>
        {/* Search input */}
        <div style={{ position:"relative" }}>
          <i className="ti ti-search" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:18, color:q?T.blue:"#94a3b8", pointerEvents:"none" }}></i>
          <input
            autoFocus
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="พิมพ์ชื่อผู้ป่วย, HN, หรือเบอร์โทร..."
            style={{ width:"100%", padding:"13px 44px 13px 42px", fontSize:15, border:`2px solid ${q?T.blue:T.line}`, borderRadius:14, outline:"none", background:"white", color:T.navy, fontFamily:FONT, boxSizing:"border-box", transition:"border-color .15s" }}
          />
          {q && (
            <button onClick={()=>setQ("")}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:26,height:26,borderRadius:"50%",border:"none",background:"#e2e8f0",color:"#64748b",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>
              ×
            </button>
          )}
        </div>

        {/* Stats */}
        {trimQ && (
          <div style={{ marginTop:10, fontSize:12, color:T.muted }}>
            {results.length>0
              ? <><span style={{ fontWeight:700, color:T.navy }}>{results.length}</span> รายการที่ค้นพบสำหรับ <span style={{ color:T.blue, fontWeight:600 }}>"{q}"</span></>
              : <span style={{ color:T.red }}>ไม่พบผู้ป่วยที่ค้นหา "{q}"</span>
            }
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 20px", display:"flex", flexDirection:"column", gap:8 }}>

        {/* Empty state */}
        {!trimQ && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60%", gap:14, color:T.faint }}>
            <div style={{ width:72,height:72,borderRadius:20,background:T.surf,border:`1px solid ${T.line}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <i className="ti ti-search" style={{ fontSize:34,color:"#94a3b8" }}></i>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:700, color:T.muted }}>ค้นหาผู้ป่วย</div>
              <div style={{ fontSize:13, color:T.faint, marginTop:6 }}>พิมพ์ชื่อ, HN หรือเบอร์โทรด้านบน</div>
              <div style={{ fontSize:12, color:T.faint, marginTop:4 }}>ค้นหาข้ามทุกเดือน ทุกปีได้เลย</div>
            </div>
            {/* Tip */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:4 }}>
              {["ค้นจาก HN","ค้นจากชื่อ","ค้นจากเบอร์"].map(t=>(
                <span key={t} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:T.blueL, color:T.blue, fontWeight:500 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {trimQ && results.length===0 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"50%", gap:10 }}>
            <i className="ti ti-mood-empty" style={{ fontSize:40, color:"#94a3b8" }}></i>
            <div style={{ fontSize:15, fontWeight:600, color:T.muted }}>ไม่พบ "{q}"</div>
            <div style={{ fontSize:12, color:T.faint }}>ลองค้นด้วยชื่อเต็ม, HN, หรือเบอร์โทรอีกครั้ง</div>
          </div>
        )}

        {/* Result cards */}
        {results.map(a => {
          const h  = hospitals.find(x=>x.id===a.hospId);
          const c  = hc(a.hospId, hospitals);
          const jl = JOURNEY_LABEL[a.journeyStatus] || a.journeyStatus;
          const jc = JOURNEY_COLOR[a.journeyStatus] || ["#f1f5f9","#64748b"];
          const lv = AHI_LEVELS.find(l=>l.key===a.sleepReport?.ahiLevel);
          const pt = PAYMENT_TYPES.find(p=>p.key===a.paymentType);

          return (
            <div key={a.id} style={{ background:T.card, border:`1px solid ${T.line}`, borderRadius:14, overflow:"hidden", transition:"box-shadow .15s" }}>
              {/* Top row */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px" }}>
                {/* Avatar */}
                <div style={{ width:44, height:44, borderRadius:13, background:c.bg, border:`1.5px solid ${c.dot}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:c.text, flexShrink:0 }}>
                  {(a.name||"?").trim()[0]}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:T.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {/* Highlight match */}
                    {a.name}
                  </div>
                  <div style={{ fontSize:12, color:T.faint, marginTop:2, display:"flex", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"monospace", background:T.surf, padding:"1px 7px", borderRadius:6, fontSize:11, color:T.ink, fontWeight:600 }}>HN {a.hn}</span>
                    {a.phone && <span>{a.phone}</span>}
                  </div>
                </div>

                {/* Date */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{fmtDateTH(a.date)}</div>
                  <div style={{ fontSize:11, color:c.text, marginTop:2 }}>{h?.short||"—"}</div>
                </div>
              </div>

              {/* Badges row */}
              <div style={{ padding:"0 16px 12px", display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                {/* Type */}
                <span style={{ fontSize:10, padding:"3px 9px", borderRadius:8, background:a.apptType==="cpap_trial"?"#ede9fe":"#dbeafe", color:a.apptType==="cpap_trial"?"#5b21b6":"#1e40af", fontWeight:700 }}>
                  {a.apptType==="cpap_trial"?"ทดลอง CPAP":"Sleep Test"}
                </span>
                {/* Sleep test type */}
                {a.sleepTestType && (
                  <span style={{ fontSize:10, padding:"3px 9px", borderRadius:8, background:a.sleepTestType==="split_night"?"#ede9fe":"#eff6ff", color:a.sleepTestType==="split_night"?"#5b21b6":"#1e40af", fontWeight:600 }}>
                    {a.sleepTestType==="split_night"?"Split Night":"Full Night"}
                  </span>
                )}
                {/* Journey */}
                <span style={{ fontSize:10, padding:"3px 9px", borderRadius:8, background:jc[0], color:jc[1], fontWeight:600 }}>
                  {jl}
                </span>
                {/* Payment type */}
                {pt && (
                  <span style={{ fontSize:10, padding:"3px 9px", borderRadius:8, background:pt.bg, color:pt.color, fontWeight:600, display:"flex", alignItems:"center", gap:3 }}>
                    {pt.fastResult && <i className="ti ti-bolt" style={{ fontSize:9 }}></i>}
                    {pt.short}
                  </span>
                )}
                {/* AHI result badge */}
                {lv && (
                  <span style={{ fontSize:10, padding:"3px 10px", borderRadius:8, background:lv.bg, color:lv.color, fontWeight:700, marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                    <i className="ti ti-activity" style={{ fontSize:10 }}></i>
                    {lv.label}
                    {a.sleepReport?.ahi && ` (${a.sleepReport.ahi})`}
                  </span>
                )}
              </div>

              {/* PDF print button for hospital */}
              {isHosp && a.sleepReport?.pdfDataUrl && (
                <div style={{ borderTop:`0.5px solid ${T.line}`, padding:"8px 16px", background:"#f0fdf4" }}>
                  <button onClick={()=>{
                    const w=window.open("","_blank");
                    w.document.write(`<!DOCTYPE html><html><head><title>${a.sleepReport.pdfFileName}</title><style>body{margin:0;background:#333}</style></head><body><iframe src="${a.sleepReport.pdfDataUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`);
                    w.document.close();
                  }}
                    style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", fontSize:12, fontWeight:700, borderRadius:9, background:"#dc2626", color:"white", border:"none", cursor:"pointer", fontFamily:FONT }}>
                    <i className="ti ti-printer" style={{ fontSize:13 }}></i>
                    Print PDF รายงาน — {a.sleepReport.pdfFileName}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Report View ───────────────────────────────────────────────────────────────
function exportDoctorExcel(doctorStats, period) {
  const header = ["แพทย์","ใบอนุญาต","จำนวน case","ประเภทนัด","รายชื่อผู้ป่วย"];
  const rows = [];
  doctorStats.forEach(ds=>{
    if(ds.cases.length===0) return;
    ds.cases.forEach((a,i)=>{
      rows.push([
        i===0?ds.doctor:"",
        i===0?ds.license:"",
        i===0?ds.cases.length:"",
        a.apptType==="cpap_trial"?"ทดลอง CPAP":"Sleep Test",
        a.name,
      ]);
    });
  });
  const lines=[header,...rows].map(r=>r.map(c=>{ const s=String(c??""); return s.includes(",")?`"${s}"`:s; }).join(","));
  const blob=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`Doctor_Report_${period}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function exportPsgRevenueExcel(revenueRows, period) {
  const header = ["โรงพยาบาล","จำนวน case","ราคาต่อ case (บาท)","รายได้รวม (บาท)"];
  const lines=[header,...revenueRows].map(r=>r.map(c=>String(c??"")).join(","));
  const blob=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`PSG_Revenue_${period}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function ReportView({ user, appointments, hospitals, techs }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [mode,  setMode]  = useState("month"); // "month" | "year"
  const [selHosp, setSelHosp] = useState(user.role==="hospital" ? user.hospId : "all");

  const TMF = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const TMS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

  const pfx = mode==="month"
    ? `${year}-${String(month+1).padStart(2,"0")}`
    : `${year}`;

  // Filter appointments
  const base = appointments.filter(a => {
    const inPeriod = a.date.startsWith(pfx);
    const inHosp   = selHosp==="all" || a.hospId===selHosp;
    return inPeriod && inHosp;
  });

  // Stats
  const sleepTests  = base.filter(a=>a.apptType==="sleep_test");
  const cpapTrials  = base.filter(a=>a.apptType==="cpap_trial");
  const cancelled   = base.filter(a=>a.status==="cancelled");
  const fullNight   = sleepTests.filter(a=>a.sleepTestType==="full_night");
  const splitNight  = sleepTests.filter(a=>a.sleepTestType==="split_night");
  const byJourney   = (key) => sleepTests.filter(a=>a.journeyStatus===key && a.status!=="cancelled");

  // PSG Revenue (Sleep Test only, not cancelled)
  const psgCases = base.filter(a=>a.apptType==="sleep_test"&&a.status!=="cancelled");
  const psgRevenue = psgCases.reduce((s,a)=>{
    const h=hospitals.find(x=>x.id===a.hospId);
    return s+(h?.psgPrice||5800);
  },0);

  // Doctor stats — groupby doctorName in sleepReport
  const doctorMap = {};
  base.filter(a=>a.sleepReport?.doctorName&&a.status!=="cancelled").forEach(a=>{
    const raw = a.sleepReport.doctorName;
    // parse "Name, M.D. ว. XXXXX"
    const parts = raw.split(" ว. ");
    const name = parts[0].trim();
    const lic  = parts[1]?.trim()||"";
    const key  = name;
    if(!doctorMap[key]) doctorMap[key]={ doctor:name, license:lic, cases:[] };
    doctorMap[key].cases.push(a);
  });
  const doctorStats = Object.values(doctorMap).sort((a,b)=>b.cases.length-a.cases.length);

  // PSG Revenue by hospital (for export)
  const psgRevenueRows = hospitals.map(h=>{
    const cnt=psgCases.filter(a=>a.hospId===h.id).length;
    const price=h.psgPrice||5800;
    return [h.name, cnt, price, cnt*price];
  }).filter(r=>r[1]>0);

  const periodLabel = mode==="month"
    ? `${["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][month]}_${year+543}`
    : `ปี${year+543}`;

  // CPAP sales
  const sales = base.filter(a=>a.cpapPurchase?.price>0 && a.status!=="cancelled");
  const totalRevenue   = sales.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0);
  const totalCommission= sales.reduce((s,a)=>s+(a.cpapPurchase?.price||0)*(a.cpapPurchase?.commissionRate??2)/100,0);

  // Per-hospital breakdown
  const hospList = user.role==="hospital"
    ? hospitals.filter(h=>h.id===user.hospId)
    : hospitals;

  // Monthly trend (for year mode)
  const monthlyData = Array.from({length:12},(_,mi)=>{
    const mp = `${year}-${String(mi+1).padStart(2,"0")}`;
    const mBase = appointments.filter(a=>a.date.startsWith(mp)&&(selHosp==="all"||a.hospId===selHosp));
    return {
      label: TMS[mi],
      total: mBase.filter(a=>a.status!=="cancelled").length,
      cancel: mBase.filter(a=>a.status==="cancelled").length,
      cpap: mBase.filter(a=>a.apptType==="cpap_trial"&&a.status!=="cancelled").length,
      revenue: mBase.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0),
    };
  });
  const maxTotal = Math.max(...monthlyData.map(m=>m.total),1);

  const prevPeriod = () => mode==="month" ? (month===0?( setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1)) : setYear(y=>y-1);
  const nextPeriod = () => mode==="month" ? (month===11?(setMonth(0), setYear(y=>y+1)):setMonth(m=>m+1)) : setYear(y=>y+1);

  const StatCard = ({icon,label,value,sub,col,bg}) => (
    <div style={{ padding:"16px 18px",background:bg||T.surf,borderRadius:14,border:`0.5px solid ${T.line}`,display:"flex",flexDirection:"column",gap:5 }}>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:34,height:34,borderRadius:10,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <i className={`ti ${icon}`} style={{ fontSize:18,color:col }}></i>
        </div>
        <span style={{ fontSize:12,color:T.muted,fontWeight:500 }}>{label}</span>
      </div>
      <div style={{ fontSize:30,fontWeight:800,color:col,lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11,color:T.faint }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ height:"100%",overflowY:"auto",fontFamily:FONT }}>
      <div style={{ maxWidth:960,margin:"0 auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:20 }}>

        {/* ── Controls ── */}
        <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
          {/* Mode toggle */}
          <div style={{ display:"flex",borderRadius:10,overflow:"hidden",border:`1px solid ${T.line}` }}>
            {["month","year"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{ padding:"8px 18px",fontSize:13,fontWeight:mode===m?700:400,background:mode===m?T.blue:"white",color:mode===m?"white":T.muted,border:"none",cursor:"pointer",fontFamily:FONT }}>
                {m==="month"?"รายเดือน":"รายปี"}
              </button>
            ))}
          </div>
          {/* Period nav */}
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <button onClick={prevPeriod} style={{ width:32,height:32,border:`1px solid ${T.line}`,borderRadius:8,background:T.card,color:T.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
            <span style={{ fontSize:16,fontWeight:700,color:T.navy,minWidth:160,textAlign:"center" }}>
              {mode==="month" ? `${TMF[month]} ${year+543}` : `ปี ${year+543}`}
            </span>
            <button onClick={nextPeriod} style={{ width:32,height:32,border:`1px solid ${T.line}`,borderRadius:8,background:T.card,color:T.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
          </div>
          {/* Hospital filter — admin only */}
          {user.role==="admin" && (
            <select value={selHosp} onChange={e=>setSelHosp(e.target.value)}
              style={{ padding:"8px 13px",fontSize:13,border:`1px solid ${T.line}`,borderRadius:10,background:T.card,color:T.ink,fontFamily:FONT,flex:1,minWidth:180 }}>
              <option value="all">ทุก รพ.</option>
              {hospitals.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          )}
        </div>

        {/* ── Summary cards ── */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 }}>
          <StatCard icon="ti-calendar" label="นัดทั้งหมด" value={base.length} sub={`${cancelled.length} ยกเลิก`} col={T.blue}/>
          <StatCard icon="ti-activity" label="Sleep Test" value={sleepTests.filter(a=>a.status!=="cancelled").length} sub={`FN ${fullNight.length} / SN ${splitNight.length}`} col="#7c3aed"/>
          <StatCard icon="ti-device-heart-monitor" label="ทดลอง CPAP" value={cpapTrials.filter(a=>a.status!=="cancelled").length} sub="" col="#059669"/>
          {user.role==="admin" && <StatCard icon="ti-currency-baht" label="รายได้ PSG" value={(psgRevenue/1000).toFixed(0)+"k"} sub={`${psgCases.length} case · ${(psgRevenue).toLocaleString()} ฿`} col="#b45309"/>}
          <StatCard icon="ti-x" label="ยกเลิก" value={cancelled.length} sub="" col={T.red}/>
        </div>

        {/* ── Sleep Test Journey breakdown ── */}
        <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
          <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
            <i className="ti ti-activity" style={{ fontSize:16,color:"#7c3aed" }}></i>
            สถานะ Sleep Test
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
            {[
              ["scheduled","รอตรวจ","#2563eb","#dbeafe","ti-calendar-event"],
              ["tested","ตรวจแล้ว","#7c3aed","#ede9fe","ti-activity"],
              ["waiting_result","รอแพทย์อ่านผล","#d97706","#fef9c3","ti-clock"],
              ["result_ready","ผลออกแล้ว","#059669","#d1fae5","ti-file-check"],
              ["consulted","ฟังผลแล้ว","#166534","#dcfce7","ti-check-circle"],
            ].map(([key,lb,col,bg,ic])=>{
              const cnt = byJourney(key).length;
              return (
                <div key={key} style={{ flex:"1 1 130px",padding:"13px 15px",background:bg,borderRadius:12,border:`0.5px solid ${col}30` }}>
                  <i className={`ti ${ic}`} style={{ fontSize:18,color:col }}></i>
                  <div style={{ fontSize:26,fontWeight:800,color:col,marginTop:5,lineHeight:1 }}>{cnt}</div>
                  <div style={{ fontSize:11,color:col,opacity:.8,marginTop:3 }}>{lb}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Full Night vs Split Night ── */}
        {sleepTests.filter(a=>a.status!=="cancelled").length>0 && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-moon" style={{ fontSize:16,color:"#1e40af" }}></i>
              Full Night vs Split Night
            </div>
            <div style={{ display:"flex",gap:12 }}>
              {[["full_night","Full Night","#1e40af","#dbeafe","ti-moon"],["split_night","Split Night","#5b21b6","#ede9fe","ti-moon-stars"]].map(([key,lb,col,bg,ic])=>{
                const cnt = sleepTests.filter(a=>a.sleepTestType===key&&a.status!=="cancelled").length;
                const total = sleepTests.filter(a=>a.status!=="cancelled").length;
                const pct = total>0?Math.round(cnt/total*100):0;
                return (
                  <div key={key} style={{ flex:1,padding:"16px",background:bg,borderRadius:12,border:`0.5px solid ${col}30` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <i className={`ti ${ic}`} style={{ fontSize:20,color:col }}></i>
                      <span style={{ fontSize:13,fontWeight:700,color:col }}>{lb}</span>
                    </div>
                    <div style={{ fontSize:36,fontWeight:800,color:col,lineHeight:1 }}>{cnt}</div>
                    <div style={{ fontSize:12,color:col,opacity:.7,marginTop:4 }}>{pct}% ของ Sleep Test ทั้งหมด</div>
                    <div style={{ height:6,borderRadius:10,background:`${col}20`,overflow:"hidden",marginTop:10 }}>
                      <div style={{ width:`${pct}%`,height:"100%",background:col,borderRadius:10,transition:"width .5s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CPAP Sales ── */}
        {sales.length>0 && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-shopping-cart" style={{ fontSize:16,color:"#059669" }}></i>
              สรุปการขาย CPAP
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:16 }}>
              <div style={{ padding:"14px",background:"#d1fae5",borderRadius:12 }}>
                <div style={{ fontSize:11,color:"#059669",fontWeight:600 }}>ยอดขายรวม</div>
                <div style={{ fontSize:24,fontWeight:800,color:"#059669",marginTop:4 }}>{totalRevenue.toLocaleString()} ฿</div>
                <div style={{ fontSize:10,color:"#059669",opacity:.7 }}>{sales.length} เครื่อง</div>
              </div>
              {/* ค่าคอม — Admin เท่านั้น */}
              {user.role==="admin" && (
                <div style={{ padding:"14px",background:"#ede9fe",borderRadius:12 }}>
                  <div style={{ fontSize:11,color:"#7c3aed",fontWeight:600 }}>ค่าคอมรวม (Admin)</div>
                  <div style={{ fontSize:24,fontWeight:800,color:"#7c3aed",marginTop:4 }}>{Math.round(totalCommission).toLocaleString()} ฿</div>
                  <div style={{ fontSize:10,color:"#7c3aed",opacity:.7 }}>เฉลี่ย {sales.length>0?(totalRevenue/sales.length/1000).toFixed(0)+"k":0} ต่อเครื่อง</div>
                </div>
              )}
            </div>
            {/* Sale list */}
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {sales.map(a=>{
                const h=hospitals.find(x=>x.id===a.hospId);
                const p=a.cpapPurchase;
                const com=Math.round((p?.price||0)*(p?.commissionRate??2)/100);
                return (
                  <div key={a.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:T.surf,borderRadius:11,border:`0.5px solid ${T.line}` }}>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:T.navy }}>{a.name}</div>
                      <div style={{ fontSize:11,color:T.faint }}>HN {a.hn} · {h?.short} · {p?.purchaseDate||a.date}</div>
                      <div style={{ fontSize:11,color:"#7c3aed",marginTop:2 }}>{p?.model}</div>
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <div style={{ fontSize:15,fontWeight:800,color:"#059669" }}>{(p?.price||0).toLocaleString()} ฿</div>
                      {/* ค่าคอม + ชื่อ Sales — Admin เท่านั้น */}
                      {user.role==="admin" && <>
                        <div style={{ fontSize:11,color:"#7c3aed" }}>คอม {com.toLocaleString()} ฿</div>
                        {p?.salesPerson && <div style={{ fontSize:10,color:T.faint }}>Sales: {p.salesPerson}</div>}
                      </>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Yearly bar chart ── */}
        {mode==="year" && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:16 }}>แนวโน้มรายเดือน ปี {year+543}</div>
            <div style={{ display:"flex",alignItems:"flex-end",gap:6,height:130,paddingBottom:24,position:"relative" }}>
              {monthlyData.map((m,i)=>{
                const h = Math.round((m.total/maxTotal)*100);
                const isNow = i===now.getMonth()&&year===now.getFullYear();
                return (
                  <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                    {m.total>0&&<div style={{ fontSize:10,color:T.muted,fontWeight:600 }}>{m.total}</div>}
                    <div style={{ width:"100%",height:`${Math.max(h,2)}%`,background:isNow?T.blue:"#bfdbfe",borderRadius:"4px 4px 0 0",minHeight:3,transition:"height .3s",position:"relative" }}>
                      {m.cancel>0&&<div style={{ position:"absolute",bottom:0,left:0,right:0,height:`${Math.round(m.cancel/(m.total||1)*100)}%`,background:"#fca5a5",borderRadius:"0 0 4px 4px" }}/>}
                    </div>
                    <div style={{ fontSize:9,color:isNow?T.blue:T.faint,fontWeight:isNow?700:400,position:"absolute",bottom:0 }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex",gap:14,marginTop:8 }}>
              {[["#bfdbfe","นัดหมาย"],["#fca5a5","ยกเลิก"]].map(([col,lb])=>(
                <div key={lb} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.muted }}>
                  <div style={{ width:12,height:8,borderRadius:3,background:col }}/>
                  {lb}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Per-hospital table ── */}
        {user.role==="admin" && selHosp==="all" && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-building-hospital" style={{ fontSize:16,color:T.blue }}></i>
              แยกตาม รพ.
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {hospitals.map(h=>{
                const ha = base.filter(a=>a.hospId===h.id);
                const hST = ha.filter(a=>a.apptType==="sleep_test"&&a.status!=="cancelled").length;
                const hCX = ha.filter(a=>a.status==="cancelled").length;
                const hCP = ha.filter(a=>a.apptType==="cpap_trial"&&a.status!=="cancelled").length;
                const hRev= ha.reduce((s,a)=>s+(a.cpapPurchase?.price||0),0);
                if(ha.length===0) return null;
                const c = hc(h.id,hospitals);
                return (
                  <div key={h.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:T.surf,borderRadius:11,border:`0.5px solid ${T.line}` }}>
                    <div style={{ width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0 }}/>
                    <div style={{ flex:1,fontSize:13,fontWeight:600,color:T.ink }}>{h.name}</div>
                    <div style={{ display:"flex",gap:16 }}>
                      {[["Sleep Test",hST,"#7c3aed"],["ยกเลิก",hCX,T.red],["CPAP",hCP,"#059669"],["ยอดขาย",hRev>0?hRev.toLocaleString()+"฿":"—","#059669"]].map(([lb,val,col])=>(
                        <div key={lb} style={{ textAlign:"center",minWidth:50 }}>
                          <div style={{ fontSize:14,fontWeight:700,color:col }}>{val}</div>
                          <div style={{ fontSize:10,color:T.faint }}>{lb}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PSG Revenue breakdown ── (Admin only) */}
        {user.role==="admin" && psgCases.length>0 && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-currency-baht" style={{ fontSize:16,color:"#b45309" }}></i>
              รายได้ค่าตรวจ PSG
              <button onClick={()=>exportPsgRevenueExcel(psgRevenueRows, periodLabel)}
                style={{ marginLeft:"auto",padding:"6px 13px",fontSize:12,fontWeight:700,borderRadius:9,background:"#059669",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:6 }}>
                <i className="ti ti-file-spreadsheet" style={{ fontSize:13 }}></i>Export Excel
              </button>
            </div>
            {/* Revenue summary */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
              <div style={{ padding:"14px",background:"#fef9c3",borderRadius:12,border:"0.5px solid #fde68a" }}>
                <div style={{ fontSize:11,color:"#92400e",fontWeight:600 }}>รายได้ PSG รวม</div>
                <div style={{ fontSize:28,fontWeight:800,color:"#92400e",marginTop:4,lineHeight:1 }}>{psgRevenue.toLocaleString()}</div>
                <div style={{ fontSize:11,color:"#92400e",opacity:.7,marginTop:3 }}>บาท ({psgCases.length} case)</div>
              </div>
              <div style={{ padding:"14px",background:"#eff6ff",borderRadius:12,border:"0.5px solid #bfdbfe" }}>
                <div style={{ fontSize:11,color:"#1e40af",fontWeight:600 }}>เฉลี่ยต่อ case</div>
                <div style={{ fontSize:28,fontWeight:800,color:"#1e40af",marginTop:4,lineHeight:1 }}>
                  {psgCases.length>0?(psgRevenue/psgCases.length).toLocaleString(undefined,{maximumFractionDigits:0}):"—"}
                </div>
                <div style={{ fontSize:11,color:"#1e40af",opacity:.7,marginTop:3 }}>บาท/case</div>
              </div>
            </div>
            {/* Per hospital */}
            <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
              {hospitals.map(h=>{
                const cnt=psgCases.filter(a=>a.hospId===h.id).length;
                if(!cnt) return null;
                const price=h.psgPrice||5800;
                const rev=cnt*price;
                const c=hc(h.id,hospitals);
                const pct=Math.round(rev/psgRevenue*100);
                return (
                  <div key={h.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:T.surf,borderRadius:11,border:`0.5px solid ${T.line}` }}>
                    <span style={{ width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0 }}/>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{h.name}</div>
                      <div style={{ fontSize:10,color:T.faint }}>{cnt} case × {price.toLocaleString()} บาท</div>
                      <div style={{ marginTop:5,height:5,borderRadius:10,background:"#e2e8f0",overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`,height:"100%",background:"#b45309",borderRadius:10,transition:"width .4s" }}/>
                      </div>
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <div style={{ fontSize:15,fontWeight:800,color:"#92400e" }}>{rev.toLocaleString()} ฿</div>
                      <div style={{ fontSize:10,color:T.faint }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Doctor stats ── (Admin only) */}
        {user.role==="admin" && (
          <div style={{ background:T.card,borderRadius:16,border:`0.5px solid ${T.line}`,padding:"18px 20px" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.navy,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
              <i className="ti ti-stethoscope" style={{ fontSize:16,color:"#7c3aed" }}></i>
              สถิติแพทย์อ่านผล
              {doctorStats.length>0 && (
                <button onClick={()=>exportDoctorExcel(doctorStats, periodLabel)}
                  style={{ marginLeft:"auto",padding:"6px 13px",fontSize:12,fontWeight:700,borderRadius:9,background:"#7c3aed",color:"white",border:"none",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:6 }}>
                  <i className="ti ti-file-spreadsheet" style={{ fontSize:13 }}></i>Export Excel
                </button>
              )}
            </div>
            {doctorStats.length===0 ? (
              <div style={{ textAlign:"center",padding:"20px",color:T.faint,fontSize:13 }}>
                ยังไม่มีข้อมูลแพทย์อ่านผลในช่วงนี้ — กรอก Sleep Report และเลือกชื่อแพทย์
              </div>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {doctorStats.map(ds=>(
                  <div key={ds.doctor} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:T.surf,borderRadius:12,border:`0.5px solid ${T.line}` }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <i className="ti ti-stethoscope" style={{ fontSize:20,color:"#7c3aed" }}></i>
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:T.navy }}>{ds.doctor}</div>
                      <div style={{ fontSize:11,color:T.faint,marginTop:1 }}>ว. {ds.license}</div>
                    </div>
                    <div style={{ textAlign:"center",padding:"8px 16px",background:"#ede9fe",borderRadius:11 }}>
                      <div style={{ fontSize:26,fontWeight:800,color:"#7c3aed",lineHeight:1 }}>{ds.cases.length}</div>
                      <div style={{ fontSize:10,color:"#7c3aed",opacity:.75,marginTop:2 }}>case</div>
                    </div>
                  </div>
                ))}
                {/* Grand total */}
                <div style={{ display:"flex",justifyContent:"space-between",padding:"10px 16px",background:"#f5f3ff",borderRadius:11,border:"0.5px solid #ddd6fe" }}>
                  <span style={{ fontSize:13,fontWeight:700,color:"#5b21b6" }}>รวมทั้งหมด</span>
                  <span style={{ fontSize:14,fontWeight:800,color:"#5b21b6" }}>{doctorStats.reduce((s,d)=>s+d.cases.length,0)} case</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Load Google Fonts safely after mount ──
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e) {} };
  }, []);

  // ── Load from localStorage on first render ──
  const saved = loadSavedData();

  const [user,setUser]           = useState(null);
  const [tab,setTab]             = useState("summary");
  const [appts,setAppts]         = useState(saved?.appts      || []);
  const [hospitals,setHospitals] = useState(saved?.hospitals  || INIT_HOSPITALS);
  const [techs,setTechs]         = useState(saved?.techs      || INIT_TECHS);
  const [assignments,setAssign]  = useState(saved?.assignments|| SAMPLE_ASSIGNMENTS);
  const [checkins,setCheckins]   = useState(saved?.checkins   || SAMPLE_CHECKINS);
  const [dayBlocks,setDayBlocks] = useState(saved?.dayBlocks  || {});
  const [techRates,setTechRates] = useState(saved?.techRates  || {});
  const [salesList,setSalesList] = useState(saved?.salesList  || INIT_SALES);
  const [lastSaved, setLastSaved]= useState(saved ? new Date().toISOString() : null);

  // ── Auto-save to localStorage on every state change ──
  const saveToLocal = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, exportedAt: new Date().toISOString(), version:1 }));
      setLastSaved(new Date().toISOString());
    } catch(e) { console.warn("localStorage full:", e); }
  };

  // wrap setters to also persist
  const setApptsSave   = (fn) => { setAppts(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts:next, hospitals, techs, assignments, checkins, dayBlocks, techRates }); return next; }); };
  const setHospsSave   = (fn) => { setHospitals(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals:next, techs, assignments, checkins, dayBlocks, techRates }); return next; }); };
  const setTechsSave   = (fn) => { setTechs(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs:next, assignments, checkins, dayBlocks, techRates }); return next; }); };
  const setAssignSave  = (fn) => { setAssign(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs, assignments:next, checkins, dayBlocks, techRates }); return next; }); };
  const setCheckinSave = (fn) => { setCheckins(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs, assignments, checkins:next, dayBlocks, techRates }); return next; }); };
  const setBlocksSave  = (fn) => { setDayBlocks(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs, assignments, checkins, dayBlocks:next, techRates }); return next; }); };
  const setRatesSave   = (fn) => { setTechRates(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs, assignments, checkins, dayBlocks, techRates:next, salesList }); return next; }); };
  const setSalesSave   = (fn) => { setSalesList(prev => { const next = typeof fn==="function"?fn(prev):fn; saveToLocal({ appts, hospitals, techs, assignments, checkins, dayBlocks, techRates, salesList:next }); return next; }); };

  // ── Import handler ──
  const handleImport = (data) => {
    setAppts(data.appts || []);
    setHospitals(data.hospitals || INIT_HOSPITALS);
    setTechs(data.techs || INIT_TECHS);
    setAssign(data.assignments || {});
    setCheckins(data.checkins || {});
    setDayBlocks(data.dayBlocks || {});
    setTechRates(data.techRates || {});
    setSalesList(data.salesList || INIT_SALES);
    saveToLocal(data);
  };

  const isAdmin   = user?.role==="admin";
  const isTech    = user?.role==="tech";
  const isSales   = user?.role==="sales";
  const isHospital= user?.role==="hospital";
  // ตรวจว่า รพ. นี้เป็น CPAP-only หรือไม่
  const myHosp    = isHospital ? hospitals.find(h=>h.id===user.hospId) : null;
  const isCpapOnly= myHosp?.cpapOnly===true;

  const tabs = [
    // Paste — Sleep Test รพ. เท่านั้น (ไม่ใช่ CPAP-only)
    ...((isAdmin || (isHospital && !isCpapOnly)) ? [{ id:"paste",    label:"วางจาก Line",    icon:"ti-brand-line"        }] : []),
    // รายเดือน — Sleep Test รพ. เท่านั้น
    ...((isAdmin || isTech || (isHospital && !isCpapOnly)) ? [{ id:"summary", label:"รายเดือน", icon:"ti-layout-list" }] : []),
    // ค้นหา — ทุก role
    { id:"search",    label:"ค้นหา",           icon:"ti-search"            },
    // CPAP Sales — Admin, Sales, CPAP-only รพ.
    ...(isSales||isAdmin||(isHospital&&isCpapOnly) ? [{ id:"cpapsales", label:"CPAP Sales", icon:"ti-device-heart-monitor"}] : []),
    // รายงาน — ไม่ใช่ CPAP-only รพ. (CPAP-only ไม่มี PSG report)
    ...(!isCpapOnly ? [{ id:"report", label:"รายงาน", icon:"ti-chart-bar" }] : []),
    // Sale Report — Admin เท่านั้น
    ...(isAdmin ? [{ id:"sales",   label:"Sale Report 3N",  icon:"ti-shopping-cart"     }] : []),
    ...(isAdmin||isTech ? [{ id:"schedule", label:"ตารางเวร",   icon:"ti-calendar-stats" }] : []),
    ...(isAdmin ? [
      { id:"hospitals", label:"โรงพยาบาล",    icon:"ti-building-hospital" },
      { id:"techs",     label:"Sleep Tech",    icon:"ti-stethoscope"       },
    ] : []),
  ];

  if(!user) return <LoginScreen onLogin={u=>{ setUser(u); const h=INIT_HOSPITALS.find(x=>x.id===u.hospId); setTab(u.role==="admin"?"paste":u.role==="tech"?"schedule":u.role==="sales"?"cpapsales":(h?.cpapOnly?"cpapsales":"summary")); }} />;

  const totalVisible = appts.filter(a=>user.role==="hospital"?a.hospId===user.hospId:true && a.status!=="cancelled").length;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const todayAppts = appts.filter(a=>a.date===todayStr && (user.role==="hospital"?a.hospId===user.hospId:true) && a.status!=="cancelled").length;

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:FONT, background:T.bg }}>

      {/* ── Sidebar ── */}
      <div style={{ width:240, background:T.navy, display:"flex", flexDirection:"column", flexShrink:0, boxShadow:"2px 0 20px rgba(12,20,69,.15)" }}>

        {/* Logo */}
        <div style={{ padding:"18px 20px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Logo slot — swap the SVG below with <img src="..."/> when ready */}
            <div style={{ width:44, height:44, borderRadius:12, overflow:"hidden", flexShrink:0, border:"1.5px solid rgba(255,255,255,.15)", position:"relative" }}>
              <svg width="44" height="44" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="rgba(255,255,255,0.10)"/>
                <text x="12" y="128" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="100" fill="white">3N</text>
                <path d="M118 148 L131 110 L143 130 L155 96 L170 148" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {/* Placeholder label — remove once real logo is set */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,.45)", fontSize:7, color:"rgba(255,255,255,.7)", textAlign:"center", padding:"2px 0", fontFamily:"inherit", letterSpacing:".02em" }}>LOGO</div>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:"white", letterSpacing:"-0.02em" }}>3N Sleep Care</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginTop:2 }}>Sleep Healthcare & Respiratory Care</div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ padding:"0 14px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <div style={{ padding:"12px 13px", background:"rgba(255,255,255,.08)", borderRadius:12, border:"0.5px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.45)", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>ทั้งหมด</div>
            <div style={{ fontSize:26, fontWeight:800, color:"white", lineHeight:1.1, marginTop:4 }}>{totalVisible}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)" }}>นัดหมาย</div>
          </div>
          <div style={{ padding:"12px 13px", background:"rgba(251,191,36,.15)", borderRadius:12, border:"0.5px solid rgba(251,191,36,.25)" }}>
            <div style={{ fontSize:9, color:"#fbbf24", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>วันนี้</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#fbbf24", lineHeight:1.1, marginTop:4 }}>{todayAppts}</div>
            <div style={{ fontSize:10, color:"rgba(251,191,36,.7)" }}>ราย</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", padding:"0 20px 8px" }}>เมนู</div>
        <nav style={{ padding:"0 10px", flex:1, overflowY:"auto" }}>
          {tabs.map(t=>{ const on=tab===t.id; return (
            <div key={t.id} onClick={()=>setTab(t.id)} style={{ display:"flex", alignItems:"center", gap:11, padding:"12px 14px", borderRadius:12, fontSize:14, color: on?"white":"rgba(255,255,255,.55)", background: on?"rgba(255,255,255,.12)":"transparent", cursor:"pointer", marginBottom:3, fontWeight: on?700:400, transition:"all .15s", letterSpacing:"0.01em" }}>
              <div style={{ width:34, height:34, borderRadius:9, background: on?"rgba(255,255,255,.15)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                <i className={`ti ${t.icon}`} style={{ fontSize:18 }}></i>
              </div>
              {t.label}
            </div>
          );})}
        </nav>

        {/* Auto-save indicator */}
        {lastSaved && (
          <div style={{ padding:"0 14px 6px", display:"flex", alignItems:"center", gap:6 }}>
            <i className="ti ti-device-floppy" style={{ fontSize:12, color:"rgba(255,255,255,.3)" }}></i>
            <span style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>
              บันทึกแล้ว {new Date(lastSaved).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"})}
            </span>
          </div>
        )}

        {/* User card */}
        <div style={{ padding:"6px 14px 18px" }}>
          <div style={{ padding:"14px 15px", background:"rgba(255,255,255,.07)", borderRadius:14, border:"0.5px solid rgba(255,255,255,.1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className="ti ti-user" style={{ fontSize:17, color:"rgba(255,255,255,.8)" }}></i>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"white", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:1 }}>{user.role==="admin"?"Admin 3N":user.role==="tech"?"Sleep Tech":"โรงพยาบาล"}</div>
              </div>
            </div>
            <button onClick={()=>setUser(null)} style={{ width:"100%", padding:"8px", fontSize:12, borderRadius:9, border:"0.5px solid rgba(255,255,255,.15)", background:"transparent", color:"rgba(255,255,255,.5)", cursor:"pointer", fontFamily:FONT, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <i className="ti ti-logout" style={{ fontSize:14 }}></i> ออกจากระบบ
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:12, fontSize:10, color:"rgba(255,255,255,.2)" }}>www.3nthailand.com</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {/* Top bar */}
        <div style={{ padding:"14px 24px", background:T.card, borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:T.navy, letterSpacing:"-0.02em" }}>
              {tab==="paste"?"วางนัดหมายจาก Line":tab==="summary"?"ตารางนัดหมายรายเดือน":tab==="search"?"ค้นหาผู้ป่วย":tab==="cpapsales"?(isCpapOnly?"สถานะ CPAP ผู้ป่วย":"CPAP Sales — รายชื่อผู้ป่วย"):tab==="report"?"รายงานสรุป":tab==="sales"?"Sale Report 3N":tab==="schedule"?"ตารางเวร Sleep Tech":tab==="hospitals"?"จัดการโรงพยาบาล":"จัดการ Sleep Technician"}
            </div>
            <div style={{ fontSize:13, color:T.muted, marginTop:2 }}>
              {user.role==="admin"?"3N Admin — เข้าถึงทุก รพ.":user.role==="tech"?"Sleep Tech — ดูตารางและยืนยันเวร":`${hospitals.find(h=>h.id===user.hospId)?.name||""}`}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isAdmin && (
              <DataManager
                appts={appts} hospitals={hospitals} techs={techs}
                assignments={assignments} checkins={checkins} dayBlocks={dayBlocks}
                techRates={techRates}
                onImport={handleImport}
              />
            )}
            <IllustrationCalendar />
          </div>
        </div>
        <div style={{ flex:1, overflow:"hidden" }}>
          {tab==="paste"     && <PasteView         user={user} hospitals={hospitals} setAppointments={setApptsSave} />}
          {tab==="summary"   && <MonthlySummary    user={user} appointments={appts} setAppointments={setApptsSave} hospitals={hospitals} techs={techs} assignments={assignments} setAssignments={setAssignSave} checkins={checkins} setCheckins={setCheckinSave} dayBlocks={dayBlocks} setDayBlocks={setBlocksSave} salesList={salesList} />}
          {tab==="search"    && <SearchView        user={user} appointments={appts} hospitals={hospitals} />}
          {tab==="cpapsales" && <SalesPatientView  user={user} appointments={appts} hospitals={hospitals} setAppointments={setApptsSave} salesList={salesList} isCpapOnlyHosp={isCpapOnly} />}
          {tab==="report"    && <ReportView        user={user} appointments={appts} hospitals={hospitals} techs={techs} />}
          {tab==="sales"     && <SalesView         user={user} appointments={appts} hospitals={hospitals} salesList={salesList} setAppointments={setApptsSave} />}
          {tab==="schedule"  && <TechScheduleView  user={user} techs={techs} appointments={appts} hospitals={hospitals} assignments={assignments} checkins={checkins} setCheckins={setCheckinSave} />}
          {tab==="hospitals" && <ManageHospitals   hospitals={hospitals} setHospitals={setHospsSave} />}
          {tab==="techs"     && <ManageTechs       techs={techs} setTechs={setTechsSave} techRates={techRates} setTechRates={setRatesSave} salesList={salesList} setSalesList={setSalesSave} />}
        </div>
      </div>
    </div>
  );
}
