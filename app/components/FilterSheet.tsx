'use client';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import Sheet from './Sheet';
export interface FilterState { cats:string[];colors:string[];brands:string[];priceMin:string;priceMax:string;dateFrom:string;dateTo:string;sort:string; }
export const defaultFilter:FilterState={cats:[],colors:[],brands:[],priceMin:'',priceMax:'',dateFrom:'',dateTo:'',sort:'date_new'};
const SORTS=[{key:'date_new',label:'登録が新しい順'},{key:'date_old',label:'登録が古い順'},{key:'price_hi',label:'価格が高い順'},{key:'price_lo',label:'価格が安い順'},{key:'priority',label:'Priority順'},{key:'brand',label:'ブランド順'},{key:'category',label:'カテゴリ順'}];
interface Props { open:boolean;onClose:()=>void;current:FilterState;onApply:(f:FilterState)=>void; }
export default function FilterSheet({open,onClose,current,onApply}:Props){
  const [f,setF]=useState<FilterState>(current);
  const [cats,setCats]=useState<string[]>([]);
  const [colorDefs,setColorDefs]=useState<{hex:string;shimmer:boolean}[]>([]);
  const [brands,setBrands]=useState<string[]>([]);
  useEffect(()=>{if(open){setF({...current});setCats(store.getCats());setColorDefs(store.getColors());setBrands([...new Set([...store.getItems(),...store.getColls()].map(i=>i.brand))].sort());}},[open,current]);
  function tog<T>(a:T[],v:T):T[]{return a.includes(v)?a.filter(x=>x!==v):[...a,v];}
  const chip=(on:boolean):React.CSSProperties=>({border:on?'none':'1px solid var(--border)',borderRadius:20,padding:'6px 14px',fontSize:12,color:on?'#fff':'var(--t2)',background:on?'var(--brown)':'none',cursor:'pointer',whiteSpace:'nowrap'});
  const ST:React.CSSProperties={fontSize:10,fontWeight:500,letterSpacing:'.14em',color:'var(--t3)',textTransform:'uppercase',marginBottom:12};
  const RI:React.CSSProperties={width:'100%',padding:'9px 10px',border:'1px solid var(--border)',borderRadius:10,background:'var(--surface)',fontSize:13};
  return(
    <Sheet open={open} onClose={onClose} title="フィルター・並び替え" rightAction={<button onClick={()=>{setF(defaultFilter);onApply(defaultFilter);onClose();}} style={{fontSize:12,color:'var(--brown)',cursor:'pointer',background:'none',border:'none',padding:4}}>リセット</button>}>
      <div style={{paddingBottom:32}}>
        <div style={{padding:'14px 20px 0'}}>
          <p style={ST}>並び替え</p>
          {SORTS.map(s=><button key={s.key} onClick={()=>setF(p=>({...p,sort:s.key}))} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',fontSize:14,color:'var(--t1)',background:'none',border:'none',cursor:'pointer',borderBottom:'1px solid var(--border2)'}}>{s.label}{f.sort===s.key&&<span style={{color:'var(--brown)',fontSize:15}}>✓</span>}</button>)}
        </div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>カテゴリ</p><div style={{display:'flex',flexWrap:'wrap',gap:8}}><button style={chip(!f.cats.length)} onClick={()=>setF(p=>({...p,cats:[]}))}>すべて</button>{cats.map(c=><button key={c} style={chip(f.cats.includes(c))} onClick={()=>setF(p=>({...p,cats:tog(p.cats,c)}))}>{c}</button>)}</div></div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>カラー</p><div style={{display:'flex',flexWrap:'wrap',gap:10}}>{colorDefs.map(c=><button key={c.hex} onClick={()=>setF(p=>({...p,colors:tog(p.colors,c.hex)}))} title={c.hex} style={{width:34,height:34,borderRadius:'50%',background:c.hex,cursor:'pointer',flexShrink:0,outline:f.colors.includes(c.hex)?'2.5px solid var(--brown)':'none',outlineOffset:3,border:['#FFFFFF','#E8E8E8','#C0C0C0'].includes(c.hex)?'1px solid var(--border)':'none',...(c.shimmer?{backgroundImage:'linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.0) 45%,rgba(255,255,255,.45) 100%)'}:{})}}/>)}</div></div>
        {brands.length>0&&<div style={{padding:'16px 20px 0'}}><p style={ST}>ブランド</p><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{brands.map(b=><button key={b} style={chip(f.brands.includes(b))} onClick={()=>setF(p=>({...p,brands:tog(p.brands,b)}))}>{b}</button>)}</div></div>}
        <div style={{padding:'16px 20px 0'}}><p style={ST}>価格</p><div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center'}}><input style={RI} type="number" placeholder="下限" value={f.priceMin} onChange={e=>setF(p=>({...p,priceMin:e.target.value}))}/><span style={{fontSize:12,color:'var(--t3)',textAlign:'center'}}>〜</span><input style={RI} type="number" placeholder="上限" value={f.priceMax} onChange={e=>setF(p=>({...p,priceMax:e.target.value}))}/></div></div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>登録日</p><div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center'}}><input style={RI} type="date" value={f.dateFrom} onChange={e=>setF(p=>({...p,dateFrom:e.target.value}))}/><span style={{fontSize:12,color:'var(--t3)',textAlign:'center'}}>〜</span><input style={RI} type="date" value={f.dateTo} onChange={e=>setF(p=>({...p,dateTo:e.target.value}))}/></div></div>
        <div style={{padding:'16px 20px 0'}}><button onClick={()=>{onApply(f);onClose();}} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,letterSpacing:'.07em',cursor:'pointer',border:'none'}}>この条件で表示</button></div>
      </div>
    </Sheet>
  );
}
