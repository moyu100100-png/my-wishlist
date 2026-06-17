'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const tabs=[
  {href:'/',label:'WISH',icon:(a:boolean)=><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:21,height:21}} stroke={a?'var(--brown)':'var(--t3)'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={a?'var(--brown)':'none'}/></svg>},
  {href:'/collection',label:'COLLECTION',icon:(a:boolean)=><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:21,height:21}} stroke={a?'var(--brown)':'var(--t3)'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
  {href:'/boards',label:'BOARDS',icon:(a:boolean)=><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:21,height:21}} stroke={a?'var(--brown)':'var(--t3)'}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>},
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
