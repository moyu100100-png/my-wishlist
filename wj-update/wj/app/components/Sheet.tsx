'use client';
import { useEffect } from 'react';
interface Props { open:boolean; onClose:()=>void; title?:string; children:React.ReactNode; rightAction?:React.ReactNode; }
export default function Sheet({open,onClose,title,children,rightAction}:Props){
  useEffect(()=>{if(open)document.body.style.overflow='hidden';else document.body.style.overflow='';return()=>{document.body.style.overflow='';};},[open]);
  if(!open)return null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'flex-end',background:'rgba(26,24,20,.42)'}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="sheet-enter" style={{background:'var(--ivory)',borderRadius:'18px 18px 0 0',width:'100%',maxHeight:'92vh',overflowY:'auto'}}>
        <div style={{width:36,height:4,background:'var(--greige)',borderRadius:2,margin:'13px auto 0'}}/>
        {title&&<div style={{padding:'14px 20px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border2)'}}>
          <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,fontWeight:400,letterSpacing:'.03em'}}>{title}</span>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {rightAction}
            <button onClick={onClose} style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--t2)',fontSize:17}}>✕</button>
          </div>
        </div>}
        {children}
      </div>
    </div>
  );
}
