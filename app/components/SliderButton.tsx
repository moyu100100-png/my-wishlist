'use client';
import { useRef, useState } from 'react';
interface Props { label:string; onComplete:()=>void; }
export default function SliderButton({label,onComplete}:Props){
  const [pos,setPos]=useState(0);
  const [done,setDone]=useState(false);
  const trackRef=useRef<HTMLDivElement>(null);
  const startX=useRef(0);
  const dragging=useRef(false);
  const THUMB=48;
  function getMax(){return(trackRef.current?.offsetWidth||240)-THUMB-8;}
  function onStart(x:number){dragging.current=true;startX.current=x-pos;}
  function onMove(x:number){
    if(!dragging.current)return;
    const next=Math.max(0,Math.min(x-startX.current,getMax()));
    setPos(next);
    if(next>=getMax()-2){dragging.current=false;setDone(true);setTimeout(()=>{onComplete();setPos(0);setDone(false);},400);}
  }
  function onEnd(){if(!done)setPos(0);dragging.current=false;}
  return(
    <div ref={trackRef}
      onMouseDown={e=>onStart(e.clientX)} onMouseMove={e=>onMove(e.clientX)} onMouseUp={onEnd}
      onTouchStart={e=>onStart(e.touches[0].clientX)} onTouchMove={e=>onMove(e.touches[0].clientX)} onTouchEnd={onEnd}
      style={{position:'relative',height:52,borderRadius:26,background:'var(--brown-bg)',border:'1px solid var(--border)',display:'flex',alignItems:'center',userSelect:'none',cursor:'grab',overflow:'hidden'}}>
      <div style={{position:'absolute',left:4,top:4,bottom:4,width:pos+THUMB,borderRadius:22,background:'rgba(160,135,106,.18)',transition:done?'width .3s ease':'none'}}/>
      <span style={{position:'absolute',left:0,right:0,textAlign:'center',fontSize:13,color:'var(--brown)',letterSpacing:'.08em',pointerEvents:'none'}}>{done?'移動しました':label}</span>
      <div style={{position:'absolute',left:4+pos,top:4,bottom:4,width:THUMB,borderRadius:22,background:'var(--brown)',display:'flex',alignItems:'center',justifyContent:'center',transition:done?'left .3s ease':'none',boxShadow:'0 2px 8px rgba(160,135,106,.35)'}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
  );
}
