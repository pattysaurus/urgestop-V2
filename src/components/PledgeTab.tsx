"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const MORNING = [
  { id:"m1", text:"I will reach out before I pick up.", sub:"Connection is the opposite of addiction" },
  { id:"m2", text:"I will identify one trigger today and prepare a response.", sub:"Awareness is my first defence" },
  { id:"m3", text:"I will practice one grounding technique if an urge arises.", sub:"5-4-3-2-1 or box breathing" },
  { id:"m4", text:"I treat myself with the compassion I'd give a friend.", sub:"Recovery is not linear, and that's okay" },
];
const EVENING = [
  { id:"e1", text:"I handled today's challenges without using.", sub:"Even imperfectly — it still counts" },
  { id:"e2", text:"I recognise what supported my recovery today.", sub:"Gratitude reinforces neural pathways" },
  { id:"e3", text:"Tomorrow I will keep going.", sub:"One intention is enough" },
  { id:"e4", text:"I release today without judgement.", sub:"Sleep is recovery too" },
];
const card: React.CSSProperties = { background:"#152b52",border:"1px solid #1e3d6e",borderRadius:14,padding:"20px 22px" };

export default function PledgeTab({ userId }: { userId: string }) {
  const [period, setPeriod] = useState<"morning"|"evening">("morning");
  const [checked, setChecked] = useState<Record<string,boolean>>({});
  const [mood, setMood] = useState<number|null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayRecord, setTodayRecord] = useState<{pledge_ids:string[];mood_score:number|null}|null>(null);

  const today = new Date().toISOString().split("T")[0];
  const pledges = period === "morning" ? MORNING : EVENING;

  const loadToday = useCallback(async () => {
    const { data } = await supabase
      .from("pledge_completions")
      .select("pledge_ids,mood_score")
      .eq("user_id", userId)
      .eq("completed_date", today)
      .eq("period", period)
      .single();
    if (data) {
      setTodayRecord(data);
      const c: Record<string,boolean> = {};
      data.pledge_ids.forEach((id: string) => { c[id] = true; });
      setChecked(c);
      setMood(data.mood_score);
    } else {
      setTodayRecord(null);
      setChecked({});
      setMood(null);
    }
  }, [userId, today, period]);

  useEffect(() => { loadToday(); }, [loadToday]);

  const toggle = (id: string) => {
    if (todayRecord) return; // already saved
    setChecked(p => ({ ...p, [id]: !p[id] }));
  };

  const save = async () => {
    setSaving(true);
    const checkedIds = Object.entries(checked).filter(([,v])=>v).map(([k])=>k);
    await supabase.from("pledge_completions").upsert({
      user_id: userId,
      completed_date: today,
      period,
      pledge_ids: checkedIds,
      mood_score: mood,
    });
    setSaved(true); setSaving(false);
    await loadToday();
    setTimeout(() => setSaved(false), 3000);
  };

  const done = pledges.filter(p => checked[p.id]).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={card}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:14}}>
          {period==="morning"?"☀️ Morning Check-In":"🌙 Evening Reflection"}
        </div>

        {/* Period toggle */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {(["morning","evening"] as const).map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{flex:1,background:period===p?"rgba(45,212,191,0.1)":"transparent",border:`1px solid ${period===p?"#1a8a7a":"#1e3d6e"}`,color:period===p?"#2dd4bf":"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.82rem",fontWeight:600,padding:"10px",borderRadius:10,cursor:"pointer",textTransform:"capitalize"}}>
              {p==="morning"?"☀️ Morning":"🌙 Evening"}
            </button>
          ))}
        </div>

        {/* Mood */}
        <div style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:10}}>How are you feeling?</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:18}}>
          {["😔","😟","😐","🙂","😊"].map((m,i)=>(
            <button key={i} onClick={()=>!todayRecord && setMood(i+1)} style={{fontSize:"1.5rem",background:mood===i+1?"rgba(45,212,191,0.12)":"#0f2040",border:`2px solid ${mood===i+1?"#2dd4bf":"#1e3d6e"}`,borderRadius:"50%",width:50,height:50,display:"flex",alignItems:"center",justifyContent:"center",cursor:todayRecord?"default":"pointer",transition:"all 0.2s",transform:mood===i+1?"scale(1.15)":"scale(1)"}}>
              {m}
            </button>
          ))}
        </div>

        {/* Pledges */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pledges.map(p=>(
            <div key={p.id} onClick={()=>toggle(p.id)} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",background:"#0f2040",border:`1px solid ${checked[p.id]?"#1a8a7a":"#1e3d6e"}`,borderRadius:10,cursor:todayRecord?"default":"pointer",transition:"all 0.2s"}}>
              <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked[p.id]?"#2dd4bf":"#1e3d6e"}`,background:checked[p.id]?"#2dd4bf":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,transition:"all 0.2s"}}>
                {checked[p.id] && <span style={{color:"#0a1628",fontSize:"0.85rem",fontWeight:700}}>✓</span>}
              </div>
              <div>
                <div style={{fontSize:"0.88rem",color:"#e2eaf6",lineHeight:1.4}}>{p.text}</div>
                <div style={{fontSize:"0.76rem",color:"#7a9bc4",marginTop:3}}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Save or already saved indicator */}
        {todayRecord ? (
          <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(45,212,191,0.08)",border:"1px solid #1a8a7a",borderRadius:10,padding:"14px 16px",marginTop:14}}>
            <span style={{fontSize:"1.2rem"}}>✅</span>
            <div style={{fontSize:"0.85rem",color:"#2dd4bf"}}>
              <strong>{period==="morning"?"Morning":"Evening"} check-in complete</strong> for today!
            </div>
          </div>
        ) : (
          <>
            {saved && (
              <div style={{background:"rgba(45,212,191,0.1)",border:"1px solid #1a8a7a",borderRadius:10,padding:"12px 14px",marginTop:14,fontSize:"0.85rem",color:"#2dd4bf"}}>
                ✓ Saved!
              </div>
            )}
            {done>0 && !saved && (
              <button onClick={save} disabled={saving} style={{width:"100%",background:"linear-gradient(135deg,#1a8a7a,#2dd4bf)",color:"#0a1628",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.9rem",fontWeight:700,padding:13,borderRadius:12,cursor:"pointer",marginTop:14,boxShadow:"0 4px 20px rgba(45,212,191,0.25)"}}>
                {saving ? "Saving…" : `Save Check-In (${done}/${pledges.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
