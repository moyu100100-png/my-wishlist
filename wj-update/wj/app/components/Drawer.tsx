'use client';
import { useState, useEffect } from 'react';
import { store, ColorDef, Theme } from '@/lib/store';
import { swatchStyle } from './SwatchGrid';
import ColorPickerSheet from './ColorPickerSheet';
interface Props { open:boolean; onClose:()=>void; onUpdate:()=>void; }
export default function Drawer({open,onClose,onUpdate}:Props){
  const [cats,setCats]=useState<string[]>([]);
  const [colors,setColors]=useState<ColorDef[]>([]);
  const [theme,setTheme]=useState<Theme>('ivory');
  const [newCat,setNewCat]=useState('');
  const [sec,setSec]=useState<Record<string,boolean>>({});
  const [cpOpen,setCpOpen]=useState(false);
  useEffect(()=>{if(open){setCats(store.getCats());setColors(store.getColors());setTheme(store.getTheme());}},[open]);
  const tog=(k:string)=>setSec(p=>({...p,[k]:!p[k]}));
  function addCat(){const v=newCat.trim();if(!v)return;const n=[...cats,v];setCats(n);store.saveCats(n);setNewCat('');onUpdate();}
  function rmCat(c:string){if(!confirm(`「${c}」を削除しますか？`))return;const n=cats.filter(x=>x!==c);setCats(n);store.saveCats(n);onUpdate();}
  function addColor(hex:string,shimmer:boolean){const n=[...colors,{hex,shimmer}];setColors(n);store.saveColors(n);onUpdate();}
  function rmColor(i:number){if(!confirm('削除しますか？'))return;const n=colors.filter((_,idx)=>idx!==i);setColors(n);store.saveColors(n);onUpdate();}
  function chTheme(t:Theme){setTheme(t);store.saveTheme(t);document.documentElement.setAttribute('data-theme',t);}
  const brands=[...new Set([...store.getItems(),...store.getColls()].map(i=>i.brand))].sort();
  const Chev=({k}:{k:string})=><svg viewBox="0 0 24 24" fill="none" stroke="var(--brown-light)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15,transform:sec[k]?'rotate(90deg)':'none',transition:'transform .2s'}}><polyline points="9 18 15 12 9 6"/></svg>;
  const SH=(k:string,label:string)=>(
    <div onClick={()=>tog(k)} style={{padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',borderBottom:'1px solid var(--border2)'}}>
      <span style={{fontSize:13,color:'var(--t1)'}}>{label}</span><Chev k={k}/>
    </div>
  );
  return(
    <>
      {open&&<div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(26,24,20,.35)'}} onClick={onClose}/>}
      <div style={{position:'fixed',top:0,right:0,bottom:0,width:'82vw',maxWidth:360,background:'var(--ivory)',zIndex:301,transform:open?'translateX(0)':'translateX(100%)',transition:'transform .28s cubic-bezier(.4,0,.2,1)',overflowY:'auto',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'52px 20px 16px',borderBottom:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:400,letterSpacing:'.04em'}}>管理</span>
          <button onClick={onClose} style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--t2)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Categories */}
        <div style={{borderBottom:'1px solid var(--border2)'}}>
          {SH('cats','カテゴリ')}
          {sec['cats']&&<div style={{padding:'8px 20px 16px'}}>
            {cats.map(c=><div key={c} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border2)'}}>
              <span style={{fontSize:13}}>{c}</span>
              <button onClick={()=>rmCat(c)} style={{fontSize:11,color:'var(--brown)',border:'1px solid var(--brown)',borderRadius:20,padding:'3px 12px',cursor:'pointer'}}>削除</button>
            </div>)}
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCat()} placeholder="新しいカテゴリ" style={{flex:1,padding:'9px 12px',border:'1px solid var(--border)',borderRadius:20,background:'var(--surface)',fontSize:13}}/>
              <button onClick={addCat} style={{background:'var(--brown)',color:'#fff',borderRadius:20,padding:'9px 16px',fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>追加</button>
            </div>
          </div>}
        </div>
        {/* Colors */}
        <div style={{borderBottom:'1px solid var(--border2)'}}>
          {SH('colors','カラー')}
          {sec['colors']&&<div style={{padding:'12px 20px 16px'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:8}}>
              {colors.map((c,i)=><button key={c.hex+i} onClick={()=>rmColor(i)} title="タップで削除" style={{...swatchStyle(c),width:'100%',aspectRatio:'1',borderRadius:'50%',cursor:'pointer'}}/>)}
              <button onClick={()=>setCpOpen(true)} style={{width:'100%',aspectRatio:'1',borderRadius:'50%',border:'1.5px dashed var(--brown-light)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--brown)',fontSize:22,background:'none'}}>⊕</button>
            </div>
            <p style={{fontSize:10,color:'var(--t3)',letterSpacing:'.04em'}}>タップで削除</p>
          </div>}
        </div>
        {/* Brands */}
        <div style={{borderBottom:'1px solid var(--border2)'}}>
          {SH('brands','ブランド')}
          {sec['brands']&&<div style={{padding:'8px 20px 16px'}}>
            {brands.length?brands.map(b=><div key={b} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--border2)'}}><span style={{width:6,height:6,borderRadius:'50%',background:'var(--brown-light)',flexShrink:0}}/><span style={{fontSize:13}}>{b}</span></div>):<p style={{fontSize:13,color:'var(--t3)',padding:'8px 0'}}>商品登録時に自動追加されます</p>}
          </div>}
        </div>
        {/* Theme */}
        <div style={{borderBottom:'1px solid var(--border2)'}}>
          {SH('theme','テーマカラー')}
          {sec['theme']&&<div style={{padding:'12px 20px 16px',display:'flex',gap:8}}>
            {(['ivory','greige','pink'] as Theme[]).map(t=><button key={t} onClick={()=>chTheme(t)} style={{flex:1,padding:'10px 4px',borderRadius:20,border:theme===t?'2px solid var(--brown)':'1px solid var(--border)',background:t==='ivory'?'#F9F7F2':t==='greige'?'#F0EBE0':'#FBF5F2',fontSize:11,color:theme===t?'var(--brown)':'var(--t2)',cursor:'pointer',fontWeight:theme===t?500:300}}>{t==='ivory'?'Ivory':t==='greige'?'Greige':'Pink'}</button>)}
          </div>}
        </div>
      </div>
      <ColorPickerSheet open={cpOpen} onClose={()=>setCpOpen(false)} onAdd={addColor}/>
    </>
  );
}
