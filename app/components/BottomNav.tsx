'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const tabs=[
  {href:'/',label:'WISH',icon:(a:boolean)=>(
    <svg viewBox="0 0 24 24" fill={a?'var(--brown)':'none'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}} stroke={a?'var(--brown)':'var(--t3)'}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )},
  {href:'/collection',label:'COLLECTION',icon:(a:boolean)=>(
    <svg viewBox="0 0 24 24" fill={a?'var(--brown)':'none'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}} stroke={a?'var(--brown)':'var(--t3)'}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
  {href:'/boards',label:'BOARDS',icon:(a:boolean)=>(
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}} stroke={a?'var(--brown)':'var(--t3)'}>
      <rect x="3" y="3" width="7" height="7" fill={a?'var(--brown)':'none'}/>
      <rect x="14" y="3" width="7" height="7" fill={a?'var(--brown)':'none'}/>
      <rect x="3" y="14" width="7" height="7" fill={a?'var(--brown)':'none'}/>
      <rect x="14" y="14" width="7" height="7" fill={a?'var(--brown)':'none'}/>
    </svg>
  )},
];
export default function BottomNav(){
  const p=usePathname();
  return(
    <nav style={{background:'var(--ivory)',borderTop:'1px solid var(--border2)',display:'flex',height:60,flexShrink:0}}>
      {tabs.map(t=>{const a=p===t.href;return(
        <Link key={t.href} href={t.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,fontSize:10,letterSpacing:'.08em',color:a?'var(--brown)':'var(--t3)',textDecoration:'none'}}>
          {t.icon(a)}{t.label}
        </Link>
      );})}
    </nav>
  );
}
