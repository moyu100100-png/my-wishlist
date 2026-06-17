'use client';
import { useState, useEffect, useCallback } from 'react';
import { store, WishItem, fmt } from '@/lib/store';
import BottomNav from './components/BottomNav';
import FilterSheet, { FilterState, defaultFilter } from './components/FilterSheet';
import AddItemSheet from './components/AddItemSheet';
import DetailView from './components/DetailView';
import Drawer from './components/Drawer';
function applyFilter(items:WishItem[],f:FilterState):WishItem[]{
  let list=[...items];
  if(f.cats.length)list=list.filter(i=>f.cats.includes(i.cat));
  if(f.colors.length)list=list.filter(i=>f.colors.includes(i.color));
  if(f.brands.length)list=list.filter(i=>f.brands.includes(i.brand));
  if(f.priceMin!=='')list=list.filter(i=>i.price>=Number(f.priceMin));
  if(f.priceMax!=='')list=list.filter(i=>i.price<=Number(f.priceMax));
  if(f.dateFrom)list=list.filter(i=>i.date>=f.dateFrom);
  if(f.dateTo)list=list.filter(i=>i.date<=f.dateTo);
  switch(f.sort){
    case 'date_new':list.sort((a,b)=>b.date.localeCompare(a.date));break;
    case 'date_old':list.sort((a,b)=>a.date.localeCompare(b.date));break;
    case 'price_hi':list.sort((a,b)=>b.price-a.price);break;
    case 'price_lo':list.sort((a,b)=>a.price-b.price);break;
    case 'priority':list.sort((a,b)=>b.priority-a.priority);break;
    case 'brand':list.sort((a,b)=>a.brand.localeCompare(b.brand,'ja'));break;
    case 'category':list.sort((a,b)=>a.cat.localeCompare(b.cat,'ja'));break;
  }
  return list;
}
export default function WishPage(){
  const [items,setItems]=useState<WishItem[]>([]);
  const [filter,setFilter]=useState<FilterState>(defaultFilter);
  const [filterOpen,setFilterOpen]=useState(false);
  const [addOpen,setAddOpen]=useState(false);
  const [editItem,setEditItem]=useState<WishItem|null>(null);
  const [detailId,setDetailId]=useState<string|null>(null);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const reload=useCallback(()=>setItems(store.getItems()),[]);
  useEffect(()=>{reload();},[reload]);
  const hasFilter=JSON.stringify(filter)!==JSON.stringify(defaultFilter);
  const displayed=applyFilter(items,filter);
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100dvh',background:'var(--bg)'}}>
      <header style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,position:'sticky',top:0,zIndex:50}}>
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:400,letterSpacing:'.06em'}}>Wish List</span>
        <div style={{display:'flex',gap:4}}>
          <button onClick={()=>setFilterOpen(true)} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
          </button>
          <button onClick={()=>setDrawerOpen(true)} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',cursor:'pointer',color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </header>
      <div style={{padding:'10px 20px 6px',flexShrink:0}}>
        <button onClick={()=>setFilterOpen(true)} style={{display:'flex',alignItems:'center',gap:5,border:hasFilter?'1px solid var(--brown)':'1px solid var(--border)',borderRadius:20,padding:'6px 14px',fontSize:12,color:hasFilter?'var(--brown)':'var(--t2)',background:'none',cursor:'pointer'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          {hasFilter?'フィルター適用中':'フィルター・並び替え'}
        </button>
      </div>
      <div style={{fontSize:11,color:'var(--t3)',padding:'0 20px 8px',flexShrink:0}}>{displayed.length} items</div>
      <div style={{flex:1,overflowY:'auto'}}>
        {displayed.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)'}}><p style={{fontSize:13,lineHeight:2.2}}>アイテムがありません。<br/>+ ボタンで追加しましょう。</p></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,padding:'4px 16px 100px'}}>
            {displayed.map(item=>{
              const cp=item.currentPrice||item.price;
              const up=item.currentPrice&&item.currentPrice!==item.price;
              return(
                <div key={item.id} onClick={()=>setDetailId(item.id)} style={{background:'var(--surface)',borderRadius:16,border:'1px solid var(--border2)',overflow:'hidden',cursor:'pointer'}}>
                  <div style={{position:'relative',aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden'}}>
                    {item.images.length?<img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                    :<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:11,letterSpacing:'.18em',color:'var(--t3)'}}>{item.brand.slice(0,3).toUpperCase()}</div>}
                    {item.images.length>1&&<span style={{position:'absolute',bottom:7,right:7,background:'rgba(160,135,106,.55)',color:'#fff',fontSize:10,borderRadius:10,padding:'2px 7px'}}>1 / {item.images.length}</span>}
                  </div>
                  <div style={{padding:'10px 12px 14px'}}>
                    <div style={{fontSize:10,fontWeight:500,letterSpacing:'.14em',color:'var(--t2)',textTransform:'uppercase',marginBottom:3}}>{item.brand}</div>
                    <div style={{fontSize:12,lineHeight:1.5,color:'var(--t1)',marginBottom:7}}>{item.name}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:5}}>
                      <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:15}}>{fmt(cp)}</span>
                      {up&&<span style={{fontSize:10,color:'#A05050'}}>+{fmt(item.currentPrice!-item.price)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav/>
      <button onClick={()=>{setEditItem(null);setAddOpen(true);}} style={{position:'fixed',bottom:76,right:20,width:52,height:52,borderRadius:'50%',background:'var(--brown)',color:'#fff',fontSize:26,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 14px rgba(160,135,106,.4)',zIndex:40,border:'none'}}>+</button>
      <FilterSheet open={filterOpen} onClose={()=>setFilterOpen(false)} current={filter} onApply={f=>{setFilter(f);}}/>
      <AddItemSheet open={addOpen} onClose={()=>setAddOpen(false)} editItem={editItem} onSave={reload}/>
      <DetailView itemId={detailId} onClose={()=>{setDetailId(null);reload();}} onEdit={item=>{setDetailId(null);setEditItem(item);setAddOpen(true);}} onUpdate={reload} allItems={displayed}/>
      <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} onUpdate={reload}/>
    </div>
  );
}
