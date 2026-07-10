'use client';
import{useState,useEffect,useCallback}from'react';
import{store,WishItem,fmt}from'@/lib/store';
import BottomNav from'./components/BottomNav';
import FilterSheet,{FilterState,defaultFilter}from'./components/FilterSheet';
import SortSheet,{SortKey}from'./components/SortSheet';
import AddItemSheet from'./components/AddItemSheet';
import DetailView from'./components/DetailView';
import SettingsSheet from'./components/SettingsSheet';

function applyFilter(items:WishItem[],f:FilterState,sort:SortKey,cat:string):WishItem[]{
  if(!f)return items;
  let list=[...items];
  if(cat&&cat!=='ALL')list=list.filter(i=>i.cat===cat);
  if(f.cats?.length)list=list.filter(i=>f.cats.includes(i.cat));
  if(f.colors?.length)list=list.filter(i=>f.colors.includes(i.color));
  if(f.brands?.length)list=list.filter(i=>f.brands.includes(i.brand));
  if(f.priceMin!=='')list=list.filter(i=>i.price>=Number(f.priceMin));
  if(f.priceMax!=='')list=list.filter(i=>i.price<=Number(f.priceMax));
  if(f.dateFrom)list=list.filter(i=>i.date>=f.dateFrom);
  if(f.dateTo)list=list.filter(i=>i.date<=f.dateTo);
  switch(sort){
    case'date_new':list.sort((a,b)=>b.date.localeCompare(a.date));break;
    case'date_old':list.sort((a,b)=>a.date.localeCompare(b.date));break;
    case'price_hi':list.sort((a,b)=>b.price-a.price);break;
    case'price_lo':list.sort((a,b)=>a.price-b.price);break;
    case'priority':list.sort((a,b)=>b.priority-a.priority);break;
    case'brand':list.sort((a,b)=>a.brand.localeCompare(b.brand,'ja'));break;
    case'category':list.sort((a,b)=>a.cat.localeCompare(b.cat,'ja'));break;
  }
  return list;
}

const SortIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:20,height:20}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>;
const FilterIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:20,height:20}}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="var(--brown)" stroke="none"/><circle cx="16" cy="12" r="2" fill="var(--brown)" stroke="none"/><circle cx="10" cy="18" r="2" fill="var(--brown)" stroke="none"/></svg>;
const SettingsIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

const IB={width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--brown)',background:'none',border:'none',cursor:'pointer'} as React.CSSProperties;

export default function WishPage(){
  const[items,setItems]=useState<WishItem[]>([]);
  const[filter,setFilter]=useState<FilterState>(defaultFilter);
  const[sort,setSort]=useState<SortKey>('date_new');
  const[cat,setCat]=useState('ALL');
  const[filterOpen,setFilterOpen]=useState(false);
  const[sortOpen,setSortOpen]=useState(false);
  const[addOpen,setAddOpen]=useState(false);
  const[editItem,setEditItem]=useState<WishItem|null>(null);
  const[detailId,setDetailId]=useState<string|null>(null);
  const[settingsOpen,setSettingsOpen]=useState(false);
  const reload=useCallback(()=>setItems(store.getItems()),[]);
  useEffect(()=>{reload();},[reload]);

  // カテゴリチップ：実際にアイテムが存在するカテゴリのみ
  const usedCats=['ALL',...[...new Set(items.map(i=>i.cat))].filter(Boolean)];
  const displayed=applyFilter(items,filter,sort,cat);

  const chipStyle=(active:boolean):React.CSSProperties=>({
    padding:'0 14px',height:'100%',display:'flex',alignItems:'center',
    fontSize:12,color:active?'var(--brown)':'var(--t3)',
    whiteSpace:'nowrap',flexShrink:0,background:'none',border:'none',cursor:'pointer',
    borderBottom:active?'2px solid var(--brown)':'2px solid transparent',
  });

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100dvh',background:'var(--bg)'}}>
      {/* Row 1 */}
      <header style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 16px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:400,letterSpacing:'.06em'}}>Wish List</span>
        <button style={IB} onClick={()=>{setEditItem(null);setAddOpen(true);}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:22,height:22}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </header>
      {/* Row 2 */}
      <div style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 12px',height:44,display:'flex',alignItems:'center',gap:0,flexShrink:0}}>
        <div style={{display:'flex',flex:1,height:'100%',overflowX:'auto',WebkitOverflowScrolling:'touch' as any,msOverflowStyle:'none',scrollbarWidth:'none' as any}}>
          {usedCats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={chipStyle(cat===c)}>{c}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:2,flexShrink:0}}>
          <button style={IB} onClick={()=>setSortOpen(true)}><SortIcon/></button>
          <button style={IB} onClick={()=>setFilterOpen(true)}><FilterIcon/></button>
        </div>
      </div>

      <div style={{fontSize:11,color:'var(--t3)',padding:'5px 16px 2px',flexShrink:0}}>{displayed.length} items</div>

      <div style={{flex:1,overflowY:'auto'}}>
        {displayed.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)'}}><p style={{fontSize:13,lineHeight:2.2}}>アイテムがありません。<br/>+ ボタンで追加しましょう。</p></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,padding:'4px 16px 80px'}}>
            {displayed.map(item=>{
              const cp=item.currentPrice||item.price;
              const up=item.currentPrice&&item.currentPrice!==item.price;
              return(
                <div key={item.id} onClick={()=>setDetailId(item.id)} style={{background:'var(--surface)',borderRadius:16,border:'1px solid var(--border2)',overflow:'hidden',cursor:'pointer'}}>
                  <div style={{aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:11,letterSpacing:'.18em',color:'var(--t3)'}}>
                    {item.images.length?<img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:item.brand.slice(0,3).toUpperCase()}
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
      <FilterSheet open={filterOpen} onClose={()=>setFilterOpen(false)} current={filter} onApply={f=>{setFilter(f??defaultFilter);}}/>
      <SortSheet open={sortOpen} onClose={()=>setSortOpen(false)} current={sort} onChange={k=>setSort(k)}/>
      <AddItemSheet open={addOpen} onClose={()=>setAddOpen(false)} editItem={editItem} onSave={reload}/>
      <DetailView itemId={detailId} onClose={()=>{setDetailId(null);reload();}} onEdit={item=>{setDetailId(null);setEditItem(item);setAddOpen(true);}} onUpdate={reload} allItems={displayed}/>
      <SettingsSheet open={settingsOpen} onClose={()=>setSettingsOpen(false)} onUpdate={reload}/>
    </div>
  );
}
