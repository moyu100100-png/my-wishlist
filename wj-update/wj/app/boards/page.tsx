'use client';
import { useState, useEffect, useCallback } from 'react';
import { store, Board, WishItem, CollectionItem, uid } from '@/lib/store';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';
type Layout=1|2|4|9;
export default function BoardsPage(){
  const [boards,setBoards]=useState<Board[]>([]);
  const [all,setAll]=useState<(WishItem|CollectionItem)[]>([]);
  const [createOpen,setCreateOpen]=useState(false);
  const [previewId,setPreviewId]=useState<string|null>(null);
  const [bTitle,setBTitle]=useState('');const [bLayout,setBLayout]=useState<Layout>(4);const [bSel,setBSel]=useState<string[]>([]);
  const reload=useCallback(()=>{setBoards(store.getBoards());setAll([...store.getItems(),...store.getColls()]);},[]);
  useEffect(()=>{reload();},[reload]);
  function togSel(id:string){setBSel(p=>{if(p.includes(id))return p.filter(x=>x!==id);if(p.length>=bLayout){alert(`最大 ${bLayout} 枚です`);return p;}return[...p,id];});}
  function submit(){const t=bTitle.trim()||'My Board';const n=[{id:uid(),title:t,layout:bLayout,itemIds:[...bSel]},...boards];store.saveBoards(n);setBoards(n);setCreateOpen(false);}
  function delBoard(id:string){if(!confirm('削除しますか？'))return;const n=boards.filter(b=>b.id!==id);store.saveBoards(n);setBoards(n);}
  const gS=(n:Layout):React.CSSProperties=>({display:'grid',gridTemplateColumns:n===9?'repeat(3,1fr)':n>=2?'repeat(2,1fr)':'1fr',gap:3});
  const prev=previewId?boards.find(b=>b.id===previewId):null;
  const L:React.CSSProperties={display:'block',fontSize:10,fontWeight:500,letterSpacing:'.13em',color:'var(--t2)',textTransform:'uppercase',marginBottom:6};
  const I:React.CSSProperties={width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:10,background:'var(--surface)',fontSize:14};
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100dvh',background:'var(--bg)'}}>
      <header style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:400,letterSpacing:'.06em'}}>Boards</span>
        <button onClick={()=>{setBTitle('');setBLayout(4);setBSel([]);setCreateOpen(true);}} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--brown)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </header>
      <div style={{flex:1,overflowY:'auto',padding:'8px 16px 100px'}}>
        {!boards.length?<div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)'}}><p style={{fontSize:13,lineHeight:2.2}}>まだ Board がありません。</p></div>
        :boards.map(b=>{
          const sel=b.itemIds.map(id=>all.find(i=>i.id===id)).filter(Boolean);
          return(
            <div key={b.id} onClick={()=>setPreviewId(b.id)} style={{background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:16,overflow:'hidden',marginBottom:12,cursor:'pointer'}}>
              <div style={{padding:'14px 16px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,fontWeight:400}}>{b.title}</span>
                <button onClick={e=>{e.stopPropagation();delBoard(b.id);}} style={{color:'var(--t3)',fontSize:14,cursor:'pointer'}}>✕</button>
              </div>
              <div style={{...gS(b.layout),padding:'0 12px 14px'}}>
                {Array.from({length:b.layout},(_,i)=>{const it=sel[i];return(
                  <div key={i} style={{aspectRatio:'1',background:'var(--ivory2)',borderRadius:5,overflow:'hidden'}}>
                    {it?.images.length?<img src={it.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--t3)'}}>{it?.brand.slice(0,3).toUpperCase()||''}</div>}
                  </div>
                );})}
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav/>
      <Sheet open={createOpen} onClose={()=>setCreateOpen(false)} title="Board を作成">
        <div style={{display:'flex',flexDirection:'column',gap:16,padding:'16px 20px 40px'}}>
          <div><label style={L}>タイトル</label><input value={bTitle} onChange={e=>setBTitle(e.target.value)} placeholder="2026 Wishlist" style={I}/></div>
          <div><label style={L}>レイアウト</label>
            <div style={{display:'flex',gap:8}}>
              {([1,2,4,9] as Layout[]).map(n=><button key={n} onClick={()=>{setBLayout(n);setBSel(p=>p.slice(0,n));}} style={{flex:1,padding:'9px 4px',borderRadius:24,border:bLayout===n?'2px solid var(--brown)':'1px solid var(--border)',background:bLayout===n?'var(--brown-bg)':'none',fontSize:12,cursor:'pointer',color:bLayout===n?'var(--brown)':'var(--t2)',fontWeight:bLayout===n?500:300}}>{n===1?'1':n===2?'1×2':n===4?'2×2':'3×3'}</button>)}
            </div>
          </div>
          <div><label style={L}>アイテムを選択（{bSel.length} / {bLayout}）</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {all.map(item=><div key={item.id} onClick={()=>togSel(item.id)} style={{border:bSel.includes(item.id)?'2px solid var(--brown)':'2px solid transparent',borderRadius:10,overflow:'hidden',cursor:'pointer',background:'var(--surface)'}}>
                <div style={{aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden'}}>{item.images.length?<img src={item.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'var(--t3)'}}>{item.brand.slice(0,3).toUpperCase()}</div>}</div>
                <div style={{padding:'6px 8px 8px'}}><div style={{fontSize:9,letterSpacing:'.12em',color:'var(--t2)',textTransform:'uppercase'}}>{item.brand}</div><div style={{fontSize:11}}>{item.name}</div></div>
              </div>)}
            </div>
          </div>
          <button onClick={submit} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,cursor:'pointer',border:'none'}}>作成する</button>
        </div>
      </Sheet>
      {prev&&<div style={{position:'fixed',inset:0,background:'var(--ivory)',zIndex:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 24px'}}>
        <button onClick={()=>setPreviewId(null)} style={{position:'absolute',top:14,left:14,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--brown)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:300,letterSpacing:'.1em',marginBottom:24}}>{prev.title}</div>
        <div style={{...gS(prev.layout),width:'100%'}}>
          {Array.from({length:prev.layout},(_,i)=>{const it=all.find(x=>x.id===prev.itemIds[i]);return(
            <div key={i} style={{aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden'}}>{it?.images.length?<img src={it.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:null}</div>
          );})}
        </div>
      </div>}
    </div>
  );
}
