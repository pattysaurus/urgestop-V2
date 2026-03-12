"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

const MILESTONES = [
  {days:1,icon:"🌱",label:"First 24 hours"},
  {days:3,icon:"💧",label:"3-day detox"},
  {days:7,icon:"⭐",label:"One week"},
  {days:14,icon:"🔥",label:"Two weeks"},
  {days:30,icon:"🏆",label:"30-day milestone"},
  {days:90,icon:"💎",label:"90 days — new life"},
  {days:180,icon:"🦋",label:"6 months of freedom"},
  {days:365,icon:"🌟",label:"One full year"},
];

const card: React.CSSProperties = { background:"#152b52",border:"1px solid #1e3d6e",borderRadius:14,padding:"20px 22px" };

export default function TrackerTab({ days, profile, userId, onProfileUpdate }: {
  days: number; profile: Profile; userId: string; onProfileUpdate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState(profile.sobriety_start_date || "");
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const moneySaved = (days * (profile.estimated_daily_spend_usd || 0)).toFixed(2);

  const saveDate = async () => {
    if (!newDate) return;
    setSaving(true);
    await supabase.from("profiles").update({ sobriety_start_date: newDate }).eq("id", userId);
    await onProfileUpdate();
    setSaving(false);
    setEditing(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Main streak */}
      <div style={{...card,textAlign:"center",padding:"28px 24px"}}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:8}}>Time Clean</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:"4rem",color:"#2dd4bf",lineHeight:1}}>{days}</div>
        <div style={{fontSize:"0.8rem",color:"#7a9bc4",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4}}>Days Sober</div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
          <span style={{fontSize:"0.75rem",padding:"4px 12px",borderRadius:20,background:"rgba(45,212,191,0.08)",border:"1px solid #1a8a7a",color:"#2dd4bf"}}>
            🕐 {(days*24).toLocaleString()} hours
          </span>
          <span style={{fontSize:"0.75rem",padding:"4px 12px",borderRadius:20,background:"rgba(45,212,191,0.08)",border:"1px solid #1a8a7a",color:"#2dd4bf"}}>
            ⏱ {(days*24*60).toLocaleString()} minutes
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{...card,textAlign:"center",padding:16}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#f59e0b"}}>${moneySaved}</div>
          <div style={{fontSize:"0.72rem",color:"#7a9bc4",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4}}>Estimated saved</div>
        </div>
        <div style={{...card,textAlign:"center",padding:16}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#f59e0b"}}>{(days*1.2).toFixed(1)}h</div>
          <div style={{fontSize:"0.72rem",color:"#7a9bc4",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4}}>Better sleep</div>
        </div>
      </div>

      {/* Edit sobriety date */}
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:editing?12:0}}>
          <div>
            <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:2}}>Sobriety Start Date</div>
            <div style={{fontSize:"0.9rem",color:"#e2eaf6"}}>{profile.sobriety_start_date || "Not set"}</div>
          </div>
          <button onClick={()=>setEditing(!editing)} style={{background:"transparent",border:"1px solid #1e3d6e",color:"#7a9bc4",fontFamily:"system-ui,sans-serif",fontSize:"0.75rem",padding:"6px 14px",borderRadius:20,cursor:"pointer"}}>
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        {editing && (
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <input type="date" value={newDate} max={today} onChange={e=>setNewDate(e.target.value)}
              style={{flex:1,background:"#0f2040",border:"1px solid #2dd4bf",borderRadius:10,color:"#e2eaf6",fontFamily:"system-ui,sans-serif",fontSize:"0.9rem",padding:"10px 14px",outline:"none"}} />
            <button onClick={saveDate} disabled={saving} style={{background:"#2dd4bf",color:"#0a1628",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.85rem",fontWeight:700,padding:"10px 20px",borderRadius:10,cursor:"pointer"}}>
              {saving ? "…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div style={card}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:"#e2eaf6",marginBottom:14}}>Milestones</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {MILESTONES.map(m=>(
            <div key={m.days} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#0f2040",border:`1px solid ${days>=m.days?"#1a8a7a":"#1e3d6e"}`,borderRadius:10,opacity:days>=m.days?1:0.45}}>
              <div style={{fontSize:"1.2rem"}}>{days>=m.days?m.icon:"○"}</div>
              <div style={{flex:1,fontSize:"0.85rem",color:"#e2eaf6"}}>{m.label}</div>
              <div style={{fontSize:"0.75rem",color:"#7a9bc4"}}>{m.days}d</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
