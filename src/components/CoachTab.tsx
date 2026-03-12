"use client";
import { useState, useEffect, useRef } from "react";

type Msg = { from:"coach"|"user"; text:string };

const card: React.CSSProperties = { background:"#152b52",border:"1px solid #1e3d6e",borderRadius:14,padding:"20px 22px" };

export default function CoachTab() {
  const [messages, setMessages] = useState<Msg[]>([
    { from:"coach", text:"Hi — I'm your Recovery Coach. I'm here to offer evidence-based support anytime. I'm not a therapist or doctor, but I care about your recovery. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setLoading(true);
    setMessages(m => [...m, { from:"user", text:userText }]);

    try {
      const history = messages.map(m => ({ role: m.from==="user"?"user":"assistant", content: m.text }));
      const res = await fetch("/api/coach", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages:[...history,{ role:"user", content:userText }] }),
      });
      const data = await res.json();
      if (data.crisisDetected) setCrisis(true);
      setMessages(m => [...m, { from:"coach", text:data.reply }]);
    } catch {
      setMessages(m => [...m, { from:"coach", text:"I'm having trouble connecting right now. If you're in crisis, please call iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 (24/7)." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {crisis && (
        <div style={{background:"rgba(251,113,133,0.1)",border:"1px solid #fb7185",borderRadius:12,padding:"14px 16px"}}>
          <div style={{color:"#fb7185",fontWeight:600,marginBottom:4,fontSize:"0.88rem"}}>🆘 Crisis Resources</div>
          <div style={{fontSize:"0.82rem",color:"#7a9bc4"}}>iCall: 9152987821 · Vandrevala: 1860-2662-345 · AASRA: 9820466627 · Call 112 in immediate danger</div>
        </div>
      )}

      <div style={card}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:14}}>✦ AI Recovery Coach · CBT + DBT</div>

        {/* Messages */}
        <div style={{display:"flex",flexDirection:"column",gap:12,maxHeight:380,overflowY:"auto",paddingRight:4,marginBottom:14}}>
          {messages.map((m,i)=>(
            <div key={i} style={{maxWidth:"82%",padding:"12px 16px",borderRadius:14,fontSize:"0.88rem",lineHeight:1.6,alignSelf:m.from==="user"?"flex-end":"flex-start",background:m.from==="user"?"rgba(45,212,191,0.12)":"#0f2040",border:`1px solid ${m.from==="user"?"#1a8a7a":"#1e3d6e"}`,borderBottomRightRadius:m.from==="user"?4:14,borderBottomLeftRadius:m.from==="coach"?4:14,color:"#e2eaf6"}}>
              <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:5}}>
                {m.from==="coach"?"✦ Recovery Coach":"You"}
              </div>
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{maxWidth:"82%",padding:"12px 16px",borderRadius:14,background:"#0f2040",border:"1px solid #1e3d6e",alignSelf:"flex-start",borderBottomLeftRadius:4}}>
              <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:5}}>✦ Recovery Coach</div>
              <div style={{display:"flex",gap:4,alignItems:"center",height:20}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#7a9bc4",animation:`bounce 1.2s infinite ${i*0.2}s`}}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{display:"flex",gap:10}}>
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Share what's on your mind…"
            style={{flex:1,background:"#0f2040",border:"1px solid #1e3d6e",borderRadius:24,color:"#e2eaf6",fontFamily:"system-ui,sans-serif",fontSize:"0.88rem",padding:"12px 18px",outline:"none",transition:"border-color 0.2s"}}
            onFocus={e=>(e.currentTarget.style.borderColor="#2dd4bf")}
            onBlur={e=>(e.currentTarget.style.borderColor="#1e3d6e")}
          />
          <button onClick={send} disabled={loading||!input.trim()} style={{background:"#2dd4bf",border:"none",borderRadius:"50%",width:44,height:44,flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",fontWeight:700,color:"#0a1628",transition:"all 0.2s",opacity:!input.trim()?0.5:1}}>
            ↑
          </button>
        </div>
      </div>

      <div style={{...card,padding:"14px 18px"}}>
        <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a9bc4",marginBottom:6}}>Privacy</div>
        <div style={{fontSize:"0.8rem",color:"#7a9bc4",lineHeight:1.6}}>Conversations are processed securely. Your API key is server-side only and never exposed to the browser.</div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
}
