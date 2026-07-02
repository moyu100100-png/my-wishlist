'use client';
import React from 'react';
interface Props{onClick?:()=>void;children:React.ReactNode;active?:boolean;label?:string;size?:number;}
export default function IconBtn({onClick,children,active=false,label,size=36}:Props){
  return(
    <button onClick={onClick} title={label} style={{width:size,height:size,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,borderRadius:10,cursor:'pointer',background:active?'var(--brown-bg)':'var(--surface)',border:'1px solid var(--border2)',boxShadow:'0 1px 4px rgba(160,135,106,.15)',color:active?'var(--brown)':'var(--t2)',fontSize:9,letterSpacing:'.05em',transition:'all .15s',flexShrink:0}}>
      {children}
      {label&&<span style={{fontSize:9,color:'inherit',letterSpacing:'.04em'}}>{label}</span>}
    </button>
  );
}
