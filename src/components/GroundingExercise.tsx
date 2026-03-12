"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const STEPS = [
  { n:5, sense:"SEE", verb:"see", icon:"👁", color:"#5a7a5e", bg:"#e8f0e8",
    prompt:"Name 5 things you can see right now.",
    science:"Visual grounding anchors your nervous system to the present moment." },
  { n:4, sense:"TOUCH", verb:"physically feel", icon:"✋", color:"#7a6545", bg:"#f0e8d8",
    prompt:"Name 4 things you can physically feel.",
    science:"Somatic awareness activates body-based processing pathways." },
  { n:3, sense:"HEAR", verb:"hear", icon:"👂", color:"#4a6578", bg:"#dce8f0",
    prompt:"What are 3 sounds around you?",
    science:"Auditory attention expands your Window of Tolerance." },
  { n:2, sense:"SMELL", verb:"smell", icon:"👃", color:"#6a5878", bg:"#e8dcea",
    prompt:"Notice 2 scents — even faint ones.",
    science:"Olfactory processing has the most direct path to the limbic system." },
  { n:1, sense:"TASTE", verb:"taste", icon:"👅", color:"#785a4a", bg:"#f0e4dc",
    prompt:"What's 1 taste you notice right now?",
    science:"This final anchor signals your prefrontal cortex that you are safe." },
];

export default function GroundingExercise({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<"intro"|"grounding"|"complete">("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(Array(5).fill(null).map(()=>[]));
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const step = STEPS[stepIdx];

  useEffect(() => { if (mode==="grounding") setTimeout(()=>inputRef.current?.focus(),300); }, [mode, stepIdx]);

  const addAnswer = () => {
    const val = inputVal.trim();
    if (!val || answers[stepIdx].length >= step.n) return;
    setAnswers(prev => { const n=[...prev.map(a=>[...a])]; n[stepIdx]=[...n[stepIdx],val]; return n; });
    setInputVal("");
    inputRef.current?.focus();
  };

  const goNext = useCallback(() => {
    if (stepIdx < STEPS.length-1) { setStepIdx(s=>s+1); setInputVal(""); }
    else setMode("complete");
  }, [stepIdx]);

  const card: React.CSSProperties = { maxWidth:440,width:"100%",background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 48px rgba(14,26,20,0.12)" };
  const wrap = (children: React.ReactNode) => (
    <div style={{minHeight:"100vh",background:"#f0ede6",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui,sans-serif"}}>
      {children}
    </div>
  );

  if (mode==="intro") return wrap(
    <div style={card}>
      <div style={{background:"linear-gradient(135deg,#e8f0e8,#d4e4d4)",padding:"32px",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:12}}>🌿</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#0e1a14",fontWeight:300,lineHeight:1.3}}>You&apos;re safe.<br/>Let&apos;s come back right here.</div>
      </div>
      <div style={{padding:"24px 28px 28px",display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontSize:"0.88rem",color:"#8fa890",lineHeight:1.75,textAlign:"center"}}>The 5-4-3-2-1 technique re-engages all five senses to interrupt urge cycles.</p>
        {STEPS.map(s=>(
          <div key={s.n} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:s.bg,fontSize:"0.85rem",color:"#0e1a14"}}>
            <span style={{fontSize:"1.2rem"}}>{s.icon}</span>
            <span><strong>{s.n}</strong> things you can {s.verb}</span>
          </div>
        ))}
        <button onClick={()=>setMode("grounding")} style={{width:"100%",background:"#3d5c42",color:"#fff",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.9rem",fontWeight:600,padding:13,borderRadius:24,cursor:"pointer",boxShadow:"0 4px 20px rgba(61,92,66,0.3)",marginTop:4}}>
          Start 5-4-3-2-1 →
        </button>
        {onClose && <button onClick={onClose} style={{background:"none",border:"none",color:"#8fa890",fontSize:"0.82rem",cursor:"pointer",textAlign:"center"}}>← Back to app</button>}
      </div>
    </div>
  );

  if (mode==="grounding") {
    const stepAnswers = answers[stepIdx];
    const isComplete = stepAnswers.length >= step.n;
    return wrap(
      <div style={card}>
        <div style={{height:4,background:"#ede9e2"}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${step.color},#3d5c42)`,width:`${(stepAnswers.length/step.n)*(1/5)*100+stepIdx*20}%`,transition:"width 0.5s"}}/>
        </div>
        <div style={{padding:"22px 24px 16px",background:step.bg}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",gap:6}}>
              {STEPS.map((_,i)=><div key={i} style={{width:i===stepIdx?22:8,height:8,borderRadius:4,background:i<stepIdx?"#5a7a5e":i===stepIdx?"#3d5c42":"#ccc",transition:"all 0.3s"}}/>)}
            </div>
            <span style={{fontSize:"0.7rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:step.color}}>Step {stepIdx+1}/5</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:`${step.color}22`,border:`2px solid ${step.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0}}>
              {step.icon}
            </div>
            <div>
              <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:step.color,marginBottom:3}}>{step.sense}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:"#0e1a14",fontWeight:300,lineHeight:1.2}}>Name <em style={{color:step.color}}>{step.n}</em> things you can {step.verb}</div>
            </div>
          </div>
        </div>
        <div style={{padding:"18px 22px 22px",display:"flex",flexDirection:"column",gap:12}}>
          {stepAnswers.length>0 && (
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {stepAnswers.map((a,i)=>(
                <div key={i} style={{display:"inline-flex",alignItems:"center",gap:6,background:`${step.color}12`,border:`1.5px solid ${step.color}55`,borderRadius:20,padding:"5px 12px",fontSize:"0.83rem",color:"#0e1a14"}}>
                  <span style={{width:16,height:16,borderRadius:"50%",background:step.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",color:"#fff",flexShrink:0}}>✓</span>
                  {a}
                  <button onClick={()=>setAnswers(prev=>{const n=[...prev.map(x=>[...x])];n[stepIdx]=n[stepIdx].filter((_,j)=>j!==i);return n;})} style={{background:"none",border:"none",cursor:"pointer",color:`${step.color}88`,fontSize:"0.85rem",padding:0}}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:"0.75rem",color:"#8fa890",borderLeft:`3px solid ${step.color}55`,paddingLeft:10,lineHeight:1.6}}>
            <strong style={{color:"#0e1a14"}}>Why this works: </strong>{step.science}
          </div>
          {!isComplete && (
            <div style={{display:"flex",gap:8}}>
              <input ref={inputRef} value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAnswer()} placeholder={step.prompt}
                style={{flex:1,background:"#f7f5f2",border:`1.5px solid ${inputVal?step.color+"88":"#ddd8d0"}`,borderRadius:10,color:"#0e1a14",fontFamily:"system-ui,sans-serif",fontSize:"0.88rem",padding:"10px 14px",outline:"none"}}/>
              <button onClick={addAnswer} disabled={!inputVal.trim()} style={{background:inputVal.trim()?step.color:"#ddd8d0",color:"#fff",border:"none",borderRadius:10,width:42,flexShrink:0,cursor:inputVal.trim()?"pointer":"default",fontSize:"1.1rem",fontWeight:700}}>+</button>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.76rem",color:"#8fa890"}}>
            <span>{stepAnswers.length}/{step.n} answered</span>
            <div style={{display:"flex",gap:4}}>
              {Array.from({length:step.n}).map((_,i)=>(
                <div key={i} style={{width:18,height:18,borderRadius:"50%",background:i<stepAnswers.length?step.color:"#ece8e1",border:`2px solid ${i<stepAnswers.length?step.color:"#d4cfc8"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",color:"#fff"}}>
                  {i<stepAnswers.length?"✓":""}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {stepIdx>0 && <button onClick={()=>{setStepIdx(s=>s-1);setInputVal("");}} style={{background:"transparent",border:"1.5px solid #ddd8d0",color:"#8fa890",fontFamily:"system-ui,sans-serif",fontSize:"0.85rem",padding:"11px 16px",borderRadius:24,cursor:"pointer"}}>← Back</button>}
            <button onClick={goNext} disabled={stepAnswers.length===0} style={{flex:1,background:isComplete?`linear-gradient(135deg,${step.color},#3d5c42)`:stepAnswers.length>0?step.color:"#ddd8d0",color:"#fff",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.88rem",fontWeight:600,padding:"12px",borderRadius:24,cursor:stepAnswers.length>0?"pointer":"default",transition:"all 0.3s"}}>
              {isComplete?(stepIdx<4?"✓ Next sense →":"✓ Complete"):`Continue (${stepAnswers.length}/${step.n})`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return wrap(
    <div style={card}>
      <div style={{background:"linear-gradient(135deg,#e8f0e8,#d4e4d4)",padding:"28px",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:10}}>🌱</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.6rem",color:"#0e1a14",fontWeight:300}}>You surfed the entire wave.</div>
        <p style={{fontSize:"0.83rem",color:"#8fa890",marginTop:8,lineHeight:1.7}}>Your parasympathetic nervous system is now activated. The urge peak has passed.</p>
      </div>
      <div style={{padding:"22px 24px 28px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{fontSize:"0.9rem",color:"#0e1a14",fontFamily:"Georgia,serif"}}>Your grounding anchors:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {STEPS.map((s,si)=>answers[si].map((a,ai)=>(
            <div key={`${si}-${ai}`} style={{display:"inline-flex",alignItems:"center",gap:6,background:`${s.color}12`,border:`1px solid ${s.color}44`,borderRadius:16,padding:"5px 12px",fontSize:"0.8rem",color:"#0e1a14"}}>
              <span>{s.icon}</span>{a}
            </div>
          )))}
        </div>
        <div style={{background:"#f7f5f2",borderRadius:12,padding:"12px 14px",borderLeft:"3px solid #5a7a5e",fontSize:"0.8rem",color:"#8fa890",lineHeight:1.7}}>
          <strong style={{color:"#0e1a14"}}>Remember: </strong>You named real things in your real world. This moment is survivable. The urge was a wave — and you&apos;re still here.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{setMode("intro");setStepIdx(0);setAnswers(Array(5).fill(null).map(()=>[]));setInputVal("");}}
            style={{flex:1,background:"transparent",border:"1.5px solid #5a7a5e",color:"#5a7a5e",fontFamily:"system-ui,sans-serif",fontSize:"0.85rem",fontWeight:600,padding:12,borderRadius:24,cursor:"pointer"}}>
            Start over
          </button>
          {onClose && (
            <button onClick={onClose} style={{flex:2,background:"#3d5c42",color:"#fff",border:"none",fontFamily:"system-ui,sans-serif",fontSize:"0.88rem",fontWeight:600,padding:12,borderRadius:24,cursor:"pointer",boxShadow:"0 4px 20px rgba(61,92,66,0.3)"}}>
              Back to dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
