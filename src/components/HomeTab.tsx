"use client";
import type { Profile } from "@/lib/supabase";

const CBT_TIPS = [
  "Urges are temporary — they peak at about 20 minutes then fade, like a wave.",
  "This feeling is uncomfortable but not dangerous. You've survived every urge so far.",
  "What would you tell a close friend in this exact moment?",
  "Name the urge out loud. Naming it reduces its power over you.",
  "You are not your urge. It is a signal, not a command.",
  "One moment at a time. You don't have to think about forever — just right now.",
  "Your brain is healing. Every sober hour builds new neural pathways.",
];

const MILESTONES = [
  {days:1,icon:"🌱",label:"First 24 hours"},
  {days:7,icon:"⭐",label:"One week"},
  {days:14,icon:"🔥",label:"Two weeks"},
  {days:30,icon:"🏆",label:"30 days"},
  {days:90,icon:"💎",label:"90 days"},
  {days:180,icon:"🦋",label:"6 months"},
  {days:365,icon:"🌟",label:"One year"},
];

const card: React.CSSProperties = {
  background:"#152b52",border:"1px solid #1e3d6e",borderRadius:14,padding:"20px 22px",position:"relative",overflow:"hidden",
};

export default function HomeTab({ days, profile, onUrge, onCrisis }: {
  days: number; profile: Profile;
  onUrge: () => void; onCrisis: () => void;
}) {
  const tip = CBT_TIPS[new Date().getDay() % CBT_TIPS.length];
  const nextMilestone = MILESTONES.find(m => m.days > days);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Urge button */}
      <div style={{...card,display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 24px",gap:16}}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4"}}>Urge Protocol · CBT / DBT</div>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:180,height:180}}>
          {[0,1].map(i=>(
            <div key={i} style={{position:"absolute",borderRadius:"50%",border:"2px solid rgba(45,212,191,0.3)",animation:`pulse-ring 2.4s ease-out ${i*1.2}s infinite`,width:80,height:80,pointerEvents:"none"}}/>
          ))}
          <button onClick={onUrge} style={{position:"relative",width:140,height:140,borderRadius:"50%",background:"linear-gradient(135deg,#1e6e63,#2dd4bf)",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,boxShadow:"0 0 30px rgba(45,212,191,0.25),0 8px 32px rgba(0,0,0,0.4)",zIndex:1,transition:"transform 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.05)")} onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
            <span style={{fontSize:"2rem"}}>🌊</span>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#0a1628"}}>I have an urge</span>
          </button>
        </div>
        <div style={{fontSize:"0.82rem",color:"#7a9bc4",textAlign:"center",maxWidth:280}}>Tap to start a grounding session and surf the urge.</div>
      </div>

      {/* Streak banner */}
      <div style={{...card,display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:"2rem"}}>🏅</div>
        <div>
          <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:2}}>Current Streak</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:"#f59e0b"}}>{days} day{days!==1?"s":""} sober</div>
          {nextMilestone && <div style={{fontSize:"0.78rem",color:"#7a9bc4",marginTop:2}}>Next: {nextMilestone.icon} {nextMilestone.label} ({nextMilestone.days - days} day{nextMilestone.days-days!==1?"s":""} away)</div>}
        </div>
      </div>

      {/* Substance tag */}
      {profile.substance_focus && profile.substance_focus !== "unspecified" && (
        <div style={{...card,padding:"14px 18px"}}>
          <span style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a9bc4"}}>Recovering from: </span>
          <span style={{fontSize:"0.85rem",color:"#2dd4bf",fontWeight:600}}>{profile.substance_focus}</span>
        </div>
      )}

      {/* Daily CBT tip */}
      <div style={card}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:8}}>Today&apos;s Thought</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.05rem",color:"#e2eaf6",lineHeight:1.6,fontStyle:"italic"}}>
          &ldquo;{tip}&rdquo;
        </div>
      </div>

      {/* DBT skill */}
      <div style={card}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>DBT Skill: TIPP</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:"#e2eaf6",marginBottom:10}}>Distress Tolerance</div>
        <div style={{fontSize:"0.85rem",color:"#7a9bc4",lineHeight:1.6}}>
          <strong style={{color:"#2dd4bf"}}>T</strong>emperature · <strong style={{color:"#2dd4bf"}}>I</strong>ntense exercise · <strong style={{color:"#2dd4bf"}}>P</strong>aced breathing · <strong style={{color:"#2dd4bf"}}>P</strong>aired muscle relaxation
        </div>
      </div>

      <button onClick={onCrisis} style={{width:"100%",background:"transparent",border:"1.5px solid #fb7185",color:"#fb7185",fontFamily:"system-ui,sans-serif",fontSize:"0.82rem",fontWeight:600,padding:"13px",borderRadius:12,cursor:"pointer"}}>
        🆘 I need immediate help — crisis resources
      </button>

      <style>{`
        @keyframes pulse-ring {
          0% { width:80px;height:80px;opacity:0.6; }
          100% { width:200px;height:200px;opacity:0; }
        }
      `}</style>
    </div>
  );
}
