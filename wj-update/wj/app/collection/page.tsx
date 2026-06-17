'use client';
import { useState, useEffect, useCallback } from 'react';
import { store, CollectionItem, WishItem, fmt } from '@/lib/store';
import BottomNav from '../components/BottomNav';
import DetailView from '../components/DetailView';
import AddItemSheet from '../components/AddItemSheet';
export default function CollectionPage(){
  const [colls,setColls]=useState<CollectionItem[]>([]);
  const [detailId,setDetailId]=useState<string|null>(null);
  const [editItem,setEditItem]=useState<WishItem|null>(null);
  const [addOpen,setAddOpen]=useState(false);
  const reload=useCallback(()=>setColls(store.getColls()),[]);
  useEffect(()=>{reload();},[reload]);
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100dvh',background:'var(--bg)'}}>
      <header style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 20px',height:56,display:'flex',alignItems:'center',flexShrink:0}}>
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:400,letterSpacing:'.06em'}}>Collection</span>
      </header>
      <div style={{fontSize:11,color:'var(--t3)',padding:'10px 20px 6px',flexShrink:0}}>{colls.length} items</div>
      <div style={{flex:1,overflowY:'auto'}}>
        {!colls.length?<div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)'}}><p style={{fontSize:13,lineHeight:2.2}}>まだ Collection がありません。<br/>Wish から移動しましょう。</p></div>
        :<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,padding:'4px 16px 100px'}}>
          {colls.map(item=>{
            const days=Math.max(1,Math.round((Date.now()-new Date(item.purchaseDate).getTime())/86400000));
            const perDay=Math.round(item.purchasePrice/days);
            return(
              <div key={item.id} onClick={()=>setDetailId(item.id)} style={{background:'var(--surface)',borderRadius:16,border:'1px solid var(--border2)',overflow:'hidden',cursor:'pointer'}}>
                <div style={{position:'relative',aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden'}}>
                  {item.images.length?<img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                  :<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:11,letterSpacing:'.18em',color:'var(--t3)'}}>{item.brand.slice(0,3).toUpperCase()}</div>}
                </div>
                <div style={{padding:'10px 12px 14px'}}>
                  <div style={{fontSize:10,fontWeight:500,letterSpacing:'.14em',color:'var(--t2)',textTransform:'uppercase',marginBottom:3}}>{item.brand}</div>
                  <div style={{fontSize:12,lineHeight:1.5,color:'var(--t1)',marginBottom:7}}>{item.name}</div>
                  <div style={{fontSize:11,color:'var(--t3)'}}><strong style={{color:'var(--t1)',fontWeight:400}}>{days}d</strong> · <strong style={{color:'var(--t1)',fontWeight:400}}>{fmt(perDay)}</strong>/day</div>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
      <BottomNav/>
      <DetailView itemId={detailId} onClose={()=>{setDetailId(null);reload();}} onEdit={item=>{setDetailId(null);setEditItem(item);setAddOpen(true);}} onUpdate={reload}/>
      <AddItemSheet open={addOpen} onClose={()=>setAddOpen(false)} editItem={editItem} onSave={reload}/>
    </div>
  );
}
