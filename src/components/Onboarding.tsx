"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Onboarding({ user, onComplete }: { user: User; onComplete: () => void }) {
  const [startDate, setStartDate] = useState("");
  const [substance, setSubstance] = useState("");
  const [dailySpend, setDailySpend] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const inp: React.CSSProperties = {
    width:"100%",background:"#0f2040",border:"1px solid #1e3d6e",borderRadius:10,
    color:"#e2eaf6",fontFamily:"system-ui,sans-serif",fontSize:"0.95rem",
    padding:"12px 16px",outline:"none",display:"block",
  };

  const save = async () => {
    if (!startDate) { setError("Please enter your sobriety start date."); return; }
    setLoading(true); setError("");
    const { error: e } = await supabase.from("profiles").upsert({
      id: user.id,
      sobriety_start_date: startDate,
      substance_focus: substance || "unspecified",
      estimated_daily_spend_usd: parseFloat(dailySpend) || 0,
    });
    if (e) { setError(e.message); setLoading(false); return; }
    onComplete();
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a1628,#0f2040)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:460,background:"#152b52",border:"1px solid #1e3d6e",borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{background:"linear-gradient(135deg,#0f2040,#1a3a5c)",padding:"32px",textAlign:"center"}}>
          <div style={{fontSize:"2.5rem",marginBottom:12}}>🌱</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#e2eaf6",marginBottom:8}}>Welcome to UrgeStop</div>
          <div style={{fontSize:"0.88rem",color:"#7a9bc4",lineHeight:1.6}}>Let&apos;s set up your recovery profile. This takes less than a minute.</div>
        </div>
        <div style={{padding:"28px 32px 32px",display:"flex",flexDirection:"column",gap:20}}>
          {error && <div style={{background:"rgba(251,113,133,0.1)",border:"1px solid #fb7185",borderRadius:10,padding:"12px 14px",fontSize:"0.83rem",color:"#fb7185"}}>⚠️ {error}</div>}

          <div>
            <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>When did your sobriety start? *</label>
            <input style={inp} type="date" value={startDate} max={today} onChange={e=>setStartDate(e.target.value)} onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")} onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")} />
            <div style={{fontSize:"0.75rem",color:"#7a9bc4",marginTop:6}}>If today is day 1, choose today&apos;s date.</div>
          </div>

          <div>
            <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>What are you recovering from? (optional)</label>
            <input style={inp} type="text" placeholder="e.g. alcohol, opioids, cannabis…" value={substance} onChange={e=>setSubstance(e.target.value)} onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")} onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")} />
          </div>

          <div>
            <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>Estimated daily spend before recovery (optional)</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#7a9bc4"}}>$</span>
              <input style={{...inp,paddingLeft:28}} type="number" placeholder="0.00" min="0" step="0.01" value={dailySpend} onChange={e=>setDailySpend(e.target.value)} onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")} onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")} />
            </div>
            <div style={{fontSize:"0.75rem",color:"#7a9bc4",marginTop:6}}>Used to show money saved in your tracker.</div>
          </div>

          <button onClick={save} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,#1a8a7a,#2dd4bf)",color:"#0a1628",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.95rem",fontWeight:700,padding:14,borderRadius:12,cursor:"pointer",boxShadow:"0 4px 20px rgba(45,212,191,0.3)"}}>
            {loading ? "Saving…" : "Start My Recovery Journey →"}
          </button>
        </div>
      </div>
    </div>
  );
}
