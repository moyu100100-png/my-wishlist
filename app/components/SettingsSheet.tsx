'use client';
import{useState,useEffect}from'react';
import{store,Theme}from'@/lib/store';
import Sheet from'./Sheet';
import ColorPickerSheet from'./ColorPickerSheet';
interface Props{open:boolean;onClose:()=>void;onUpdate:()=>void;}
export default function SettingsSheet({open,onClose,onUpdate}:Props){
  const[cats,setCats]=useState<string[]>([]);
  const[theme,setTheme]=useState<Theme>('ivory');
  const[newCat,setNewCat]=useState('');
  const[sec,setSec]=useState('');
  const[cpOpen,setCpOpen]=useState(false);
  const[dragIdx,setDragIdx]=useState<number|null>(null);
  useEffect(()=>{if(open){setCats(store.getCats());setTheme(store.getTheme());setSec('');}},[open]);
  function addCat(){const v=newCat.trim();if(!v)return;const n=[...cats,v];setCats(n);store.saveCats(n);setNewCat('');onUpdate();}
  function rmCat(i:number){if(!confirm(`「${cats[i]}」を削除しますか？`))return;const n=cats.filter((_,idx)=>idx!==i);setCats(n);store.saveCats(n);onUpdate();}
  function moveCat(from:number,to:number){const n=[...cats];const[m]=n.splice(from,1);n.splice(to,0,m);setCats(n);store.saveCats(n);}
  function chTheme(t:Theme){setTheme(t);store.saveTheme(t);document.documentElement.setAttribute('data-theme',t);}
  function addColor(hex:string,shimmer:boolean){const n=[...store.getColors(),{hex,shimmer}];store.saveColors(n);onUpdate();}
  const Sec=({k,label,icon}:{k:string,label:string,icon:React.ReactNode})=>(
    <button onClick={()=>setSec(sec===k?'':k)} style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'16px 20px',borderBottom:'1px solid var(--border2)',background:'none',cursor:'pointer',textAlign:'left'}}>
      <span style={{width:36,height:36,borderRadius:10,background:'var(--brown-bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--brown)'}}>{icon}</span>
      <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>{label}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16,transform:sec===k?'rotate(90deg)':'none',transition:'transform .2s'}}><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  );
  const PH=({label,icon}:{label:string,icon:React.ReactNode})=>(
    <button style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'16px 20px',borderBottom:'1px solid var(--border2)',background:'none',cursor:'not-allowed',opacity:.55,textAlign:'left'}}>
      <span style={{width:36,height:36,borderRadius:10,background:'var(--brown-bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--brown)'}}>{icon}</span>
      <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>{label}</span>
      <span style={{fontSize:11,color:'var(--t3)',border:'1px solid var(--border)',borderRadius:10,padding:'2px 8px'}}>近日公開</span>
    </button>
  );
  return(
    <>
    <Sheet open={open} onClose={onClose} title="My Wish List">
      <div style={{paddingBottom:40}}>
        <Sec k="cats" label="カテゴリ" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>}/>
        {sec==='cats'&&<div style={{padding:'10px 20px 16px',background:'var(--ivory2)'}}>
          {cats.map((c,i)=>(
            <div key={c+i} draggable onDragStart={()=>setDragIdx(i)} onDragOver={e=>{e.preventDefault();}} onDrop={()=>{if(dragIdx!==null&&dragIdx!==i){moveCat(dragIdx,i);setDragIdx(null);}}}
              style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--border2)',cursor:'grab'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--greige2)" strokeWidth="1.8" strokeLinecap="round" style={{width:16,height:16,flexShrink:0}}><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
              <span style={{flex:1,fontSize:13}}>{c}</span>
              <button onClick={()=>rmCat(i)} style={{width:24,height:24,borderRadius:'50%',background:'var(--greige)',color:'var(--t2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}}>−</button>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCat()} placeholder="新しいカテゴリ" style={{flex:1,padding:'9px 12px',border:'1px solid var(--border)',borderRadius:20,background:'var(--surface)',fontSize:13}}/>
            <button onClick={addCat} style={{background:'var(--brown)',color:'#fff',borderRadius:20,padding:'9px 16px',fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>追加</button>
          </div>
        </div>}
        <Sec k="theme" label="テーマカラー" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>}/>
        {sec==='theme'&&<div style={{padding:'12px 20px 16px',background:'var(--ivory2)',display:'flex',gap:8}}>
          {(['ivory','greige','pink'] as Theme[]).map(t=>(
            <button key={t} onClick={()=>chTheme(t)} style={{flex:1,padding:'12px 4px',borderRadius:14,border:theme===t?'2px solid var(--brown)':'1px solid var(--border)',background:t==='ivory'?'#F9F7F2':t==='greige'?'#F0EBE0':'#FBF5F2',fontSize:12,color:theme===t?'var(--brown)':'var(--t2)',cursor:'pointer',fontWeight:theme===t?500:300}}>
              {t==='ivory'?'Ivory':t==='greige'?'Greige':'Pink'}
            </button>
          ))}
        </div>}
        <PH label="プレミアム機能" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}/>
        <PH label="コーヒーを差し入れる" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}/>
        <PH label="バックアップ / 復元" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.08-4.43"/></svg>}/>
        <button style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'16px 20px',borderBottom:'1px solid var(--border2)',background:'none',cursor:'pointer',textAlign:'left'}}>
          <span style={{width:36,height:36,borderRadius:10,background:'var(--brown-bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>このアプリについて</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button onClick={()=>{if(!confirm('すべてのデータをリセットしますか？この操作は取り消せません。'))return;localStorage.clear();window.location.reload();}} style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'16px 20px',background:'none',cursor:'pointer',textAlign:'left'}}>
          <span style={{width:36,height:36,borderRadius:10,background:'#FFF0EE',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#C0392B'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'#C0392B'}}>リセット</span>
        </button>
      </div>
    </Sheet>
    <ColorPickerSheet open={cpOpen} onClose={()=>setCpOpen(false)} onAdd={addColor}/>
    </>
  );
}
