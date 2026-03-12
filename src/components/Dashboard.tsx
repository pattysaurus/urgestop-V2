"use client";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import HomeTab from "./HomeTab";
import TrackerTab from "./TrackerTab";
import JournalTab from "./JournalTab";
import PledgeTab from "./PledgeTab";
import CoachTab from "./CoachTab";
import GroundingExercise from "./GroundingExercise";

const CRISIS_HOTLINES = [
  { name:"iCall (TISS)", num:"9152987821", desc:"Psychological counselling helpline, Mon–Sat 8am–10pm" },
  { name:"Vandrevala Foundation", num:"1860-2662-345", desc:"24/7 free mental health & crisis support" },
  { name:"AASRA", num:"9820466627", desc:"24/7 suicide prevention & emotional support" },
  { name:"NIMHANS Drug Helpline", num:"1800-11-0031", desc:"Free addiction helpline (toll-free)" },
  { name:"Fortis Mental Health", num:"8376804102", desc:"24/7 stress and mental health helpline" },
];

const TABS = [
  { id:"home", label:"Home" },
  { id:"tracker", label:"Tracker" },
  { id:"journal", label:"Journal" },
  { id:"pledge", label:"Pledges" },
  { id:"coach", label:"Coach" },
];

const css = `
  .tab-btn { flex:1; background:transparent; border:none; color:#7a9bc4; font-family:system-ui,sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:10px 4px; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; }
  .tab-btn.active { color:#2dd4bf; border-bottom-color:#2dd4bf; }
  .tab-btn:hover:not(.active) { color:#e2eaf6; }
`;

export default function Dashboard({ user, profile, onProfileUpdate }: { user: User; profile: Profile; onProfileUpdate: () => void }) {
  const [tab, setTab] = useState("home");
  const [showGrounding, setShowGrounding] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  const handleSignOut = async () => { await supabase.auth.signOut(); };

  const days = profile.sobriety_start_date
    ? Math.floor((Date.now() - new Date(profile.sobriety_start_date).getTime()) / 86400000)
    : 0;

  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 10%,#0f2a4a,#0a1628 60%)",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:80,fontFamily:"system-ui,sans-serif"}}>
        {/* Header */}
        <div style={{width:"100%",maxWidth:520,padding:"20px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:"#2dd4bf"}}>🌊 UrgeStop</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowCrisis(true)} style={{background:"transparent",border:"1.5px solid #fb7185",color:"#fb7185",fontFamily:"system-ui,sans-serif",fontSize:"0.7rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 12px",borderRadius:20,cursor:"pointer"}}>
              🆘 Crisis
            </button>
            <button onClick={handleSignOut} style={{background:"transparent",border:"1px solid #1e3d6e",color:"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.72rem",padding:"6px 12px",borderRadius:20,cursor:"pointer"}}>
              Sign out
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{width:"100%",maxWidth:520,display:"flex",padding:"16px 24px 0",gap:4,borderBottom:"1px solid #1e3d6e"}}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{width:"100%",maxWidth:520,padding:"20px 24px",display:"flex",flexDirection:"column",gap:16}}>
          {tab==="home"    && <HomeTab days={days} profile={profile} onUrge={()=>setShowGrounding(true)} onCrisis={()=>setShowCrisis(true)} />}
          {tab==="tracker" && <TrackerTab days={days} profile={profile} userId={user.id} onProfileUpdate={onProfileUpdate} />}
          {tab==="journal" && <JournalTab userId={user.id} />}
          {tab==="pledge"  && <PledgeTab userId={user.id} />}
          {tab==="coach"   && <CoachTab />}
        </div>

        {/* Grounding overlay */}
        {showGrounding && (
          <div style={{position:"fixed",inset:0,zIndex:100,overflowY:"auto"}}>
            <GroundingExercise onClose={()=>setShowGrounding(false)} />
          </div>
        )}

        {/* Crisis overlay */}
        {showCrisis && (
          <div style={{position:"fixed",inset:0,background:"rgba(10,22,40,0.98)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"40px 24px",overflowY:"auto"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#fb7185",textAlign:"center"}}>You are not alone.</div>
            <div style={{fontSize:"0.88rem",color:"#7a9bc4",textAlign:"center",maxWidth:340,lineHeight:1.7}}>If you&apos;re in immediate danger, call 911. These lines are free and confidential, 24/7.</div>
            {CRISIS_HOTLINES.map(h=>(
              <div key={h.num} style={{background:"#152b52",border:"1px solid #1e3d6e",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:400,gap:12}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"0.9rem",color:"#e2eaf6"}}>{h.name}</div>
                  <div style={{fontSize:"0.75rem",color:"#7a9bc4",marginTop:2}}>{h.desc}</div>
                </div>
                <div style={{fontFamily:"Georgia,serif",fontSize:"0.9rem",color:"#2dd4bf",fontWeight:600,textAlign:"right",flexShrink:0,maxWidth:160}}>{h.num}</div>
              </div>
            ))}
            <button onClick={()=>setShowCrisis(false)} style={{background:"transparent",border:"1px solid #1e3d6e",color:"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.85rem",padding:"12px 28px",borderRadius:30,cursor:"pointer",marginTop:8}}>
              Return to app
            </button>
          </div>
        )}
      </div>
    </>
  );
}
