"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const TRIGGERS = ["Stress","Loneliness","Boredom","Social pressure","Anxiety","Celebration","Pain","Anger","Sadness","Exhaustion"];
const card: React.CSSProperties = { background:"#152b52",border:"1px solid #1e3d6e",borderRadius:14,padding:"20px 22px" };
const inp: React.CSSProperties = { width:"100%",background:"#0f2040",border:"1px solid #1e3d6e",borderRadius:10,color:"#e2eaf6",fontFamily:"system-ui,sans-serif",fontSize:"0.9rem",padding:"12px 14px",outline:"none" };

type Entry = { id:string; logged_at:string; intensity_raw:number; trigger_tags:string[]; context_location:string|null; narrative:string|null; };

export default function JournalTab({ userId }: { userId: string }) {
  const [view, setView] = useState<"log"|"history">("log");
  const [where, setWhere] = useState("");
  const [narrative, setNarrative] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);
    const { data } = await supabase
      .from("urge_logs")
      .select("id,logged_at,intensity_raw,trigger_tags,context_location,narrative")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("logged_at", { ascending: false })
      .limit(20);
    setEntries(data || []);
    setLoadingEntries(false);
  }, [userId]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const toggleTag = (t: string) => setTags(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);

  const save = async () => {
    setSaving(true);
    await supabase.from("urge_logs").insert({
      user_id: userId,
      intensity_raw: intensity,
      trigger_tags: tags,
      context_location: where || null,
      narrative: narrative || null,
    });
    setSaving(false); setSaved(true);
    setWhere(""); setNarrative(""); setIntensity(5); setTags([]);
    await loadEntries();
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("urge_logs").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    await loadEntries();
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* View toggle */}
      <div style={{display:"flex",gap:8}}>
        {["log","history"].map(v=>(
          <button key={v} onClick={()=>setView(v as "log"|"history")}
            style={{flex:1,background:view===v?"rgba(45,212,191,0.12)":"transparent",border:`1px solid ${view===v?"#1a8a7a":"#1e3d6e"}`,color:view===v?"#2dd4bf":"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.82rem",fontWeight:600,padding:"10px",borderRadius:10,cursor:"pointer",textTransform:"capitalize"}}>
            {v==="log"?"📝 Log an Urge":"📋 History"}
          </button>
        ))}
      </div>

      {view==="log" && (
        <div style={card}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:"#e2eaf6",marginBottom:4}}>Log an Urge</div>
          <div style={{fontSize:"0.82rem",color:"#7a9bc4",marginBottom:18,lineHeight:1.6}}>Logging builds self-awareness — the foundation of recovery.</div>

          {saved && (
            <div style={{background:"rgba(45,212,191,0.1)",border:"1px solid #1a8a7a",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:"0.85rem",color:"#2dd4bf"}}>
              ✓ Urge logged successfully!
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>Where are you right now?</label>
              <input style={inp} placeholder="e.g. Home alone, at a party…" value={where} onChange={e=>setWhere(e.target.value)} onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")} onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")} />
            </div>

            <div>
              <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>What&apos;s happening? (optional)</label>
              <textarea style={{...inp,minHeight:80,resize:"vertical",lineHeight:1.6}} placeholder="Describe the thoughts or situation…" value={narrative} onChange={e=>setNarrative(e.target.value)} onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")} onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")} />
            </div>

            <div>
              <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>
                Urge intensity: <span style={{color:"#2dd4bf"}}>{intensity}/10</span>
              </label>
              <input type="range" min="1" max="10" value={intensity} onChange={e=>setIntensity(+e.target.value)} style={{width:"100%",accentColor:"#2dd4bf"}} />
            </div>

            <div>
              <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:8}}>Trigger tags</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {TRIGGERS.map(t=>(
                  <button key={t} onClick={()=>toggleTag(t)} style={{background:tags.includes(t)?"rgba(45,212,191,0.12)":"#0f2040",border:`1px solid ${tags.includes(t)?"#1a8a7a":"#1e3d6e"}`,color:tags.includes(t)?"#2dd4bf":"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.78rem",padding:"6px 14px",borderRadius:20,cursor:"pointer"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={save} disabled={saving} style={{width:"100%",background:"linear-gradient(135deg,#1a8a7a,#2dd4bf)",color:"#0a1628",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.9rem",fontWeight:700,padding:13,borderRadius:12,cursor:"pointer",boxShadow:"0 4px 20px rgba(45,212,191,0.25)"}}>
              {saving ? "Saving…" : "Save Entry"}
            </button>
          </div>
        </div>
      )}

      {view==="history" && (
        <div style={card}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:"#e2eaf6",marginBottom:14}}>Past Entries ({entries.length})</div>
          {loadingEntries && <div style={{color:"#7a9bc4",fontSize:"0.85rem",textAlign:"center",padding:20}}>Loading…</div>}
          {!loadingEntries && entries.length===0 && (
            <div style={{color:"#7a9bc4",fontSize:"0.85rem",textAlign:"center",padding:20}}>No entries yet. Log your first urge!</div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {entries.map(e=>(
              <div key={e.id} style={{background:"#0f2040",border:"1px solid #1e3d6e",borderRadius:10,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{fontSize:"0.72rem",color:"#7a9bc4"}}>{formatDate(e.logged_at)}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:"0.72rem",background:"rgba(245,158,11,0.15)",color:"#f59e0b",padding:"2px 8px",borderRadius:10}}>
                      Intensity: {e.intensity_raw}/10
                    </span>
                    <button onClick={()=>deleteEntry(e.id)} style={{background:"transparent",border:"none",color:"#7a9bc4",cursor:"pointer",fontSize:"0.8rem",padding:0}}>✕</button>
                  </div>
                </div>
                {e.trigger_tags?.length>0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {e.trigger_tags.map(t=>(
                      <span key={t} style={{fontSize:"0.72rem",background:"rgba(45,212,191,0.08)",border:"1px solid #1a8a7a",color:"#2dd4bf",padding:"2px 8px",borderRadius:10}}>{t}</span>
                    ))}
                  </div>
                )}
                {e.context_location && <div style={{fontSize:"0.82rem",color:"#e2eaf6",marginBottom:4}}>📍 {e.context_location}</div>}
                {e.narrative && <div style={{fontSize:"0.82rem",color:"#7a9bc4",lineHeight:1.5}}>{e.narrative}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
