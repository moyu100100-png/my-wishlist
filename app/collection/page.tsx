'use client';
import{useState,useEffect,useCallback}from'react';
import{store,CollectionItem,WishItem,fmt}from'@/lib/store';
import BottomNav from'../components/BottomNav';
import DetailView from'../components/DetailView';
import AddItemSheet from'../components/AddItemSheet';
import SettingsSheet from'../components/SettingsSheet';
import FilterSheet,{FilterState,defaultFilter}from'../components/FilterSheet';
import SortSheet,{SortKey}from'../components/SortSheet';

type ViewMode='grid'|'list';

const SortIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:20,height:20}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>;
const FilterIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:20,height:20}}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="var(--brown)" stroke="none"/><circle cx="16" cy="12" r="2" fill="var(--brown)" stroke="none"/><circle cx="10" cy="18" r="2" fill="var(--brown)" stroke="none"/></svg>;
const SettingsIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const GridIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const ListIcon=()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="4" width="5" height="5" rx="1"/><line x1="11" y1="6" x2="21" y2="6"/><rect x="3" y="11" width="5" height="5" rx="1"/><line x1="11" y1="13" x2="21" y2="13"/><rect x="3" y="18" width="5" height="5" rx="1"/><line x1="11" y1="20" x2="21" y2="20"/></svg>;

const IB={width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--brown)',background:'none',border:'none',cursor:'pointer'} as React.CSSProperties;

export default function CollectionPage(){
  const[colls,setColls]=useState<CollectionItem[]>([]);
  const[detailId,setDetailId]=useState<string|null>(null);
  const[editItem,setEditItem]=useState<WishItem|null>(null);
  const[addOpen,setAddOpen]=useState(false);
  const[settingsOpen,setSettingsOpen]=useState(false);
  const[filterOpen,setFilterOpen]=useState(false);
  const[sortOpen,setSortOpen]=useState(false);
  const[view,setView]=useState<ViewMode>('grid');
  const[cat,setCat]=useState('ALL');
  const[filter,setFilter]=useState<FilterState>(defaultFilter);
  const[sort,setSort]=useState<SortKey>('date_new');
  const reload=useCallback(()=>setColls(store.getColls()),[]);
  useEffect(()=>{reload();},[reload]);

  const usedCats=['ALL',...[...new Set(colls.map(i=>i.cat))].filter(Boolean)];
  const displayed=colls.filter(i=>cat==='ALL'||i.cat===cat);

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
        <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:400,letterSpacing:'.06em'}}>Collection</span>
        <button style={IB} onClick={()=>setSettingsOpen(true)}><SettingsIcon/></button>
      </header>
      {/* Row 2 */}
      <div style={{background:'var(--ivory)',borderBottom:'1px solid var(--border2)',padding:'0 12px',height:44,display:'flex',alignItems:'center',flexShrink:0}}>
        <div style={{display:'flex',flex:1,height:'100%',overflowX:'auto',WebkitOverflowScrolling:'touch' as any,scrollbarWidth:'none' as any}}>
          {usedCats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={chipStyle(cat===c)}>{c}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:2,flexShrink:0}}>
          <button style={IB} onClick={()=>setSortOpen(true)}><SortIcon/></button>
          <button style={IB} onClick={()=>setFilterOpen(true)}><FilterIcon/></button>
          <button style={IB} onClick={()=>setView(v=>v==='grid'?'list':'grid')}>
            {view==='grid'?<GridIcon/>:<ListIcon/>}
          </button>
        </div>
      </div>

      <div style={{fontSize:11,color:'var(--t3)',padding:'5px 16px 2px',flexShrink:0}}>{displayed.length} items</div>

      <div style={{flex:1,overflowY:'auto'}}>
        {!displayed.length?(
          <div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)'}}><p style={{fontSize:13,lineHeight:2.2}}>まだ Collection がありません。</p></div>
        ):view==='grid'?(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,padding:'4px 16px 80px'}}>
            {displayed.map(item=>{
              const days=Math.max(1,Math.round((Date.now()-new Date(item.purchaseDate).getTime())/86400000));
              const perDay=Math.round(item.purchasePrice/days);
              return(
                <div key={item.id} onClick={()=>setDetailId(item.id)} style={{background:'var(--surface)',borderRadius:16,border:'1px solid var(--border2)',overflow:'hidden',cursor:'pointer'}}>
                  <div style={{aspectRatio:'1',background:'var(--ivory2)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:11,letterSpacing:'.18em',color:'var(--t3)'}}>
                    {item.images.length?<img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:item.brand.slice(0,3).toUpperCase()}
                  </div>
                  <div style={{padding:'10px 12px 14px'}}>
                    <div style={{fontSize:10,fontWeight:500,letterSpacing:'.14em',color:'var(--t2)',textTransform:'uppercase',marginBottom:3}}>{item.brand}</div>
                    <div style={{fontSize:12,lineHeight:1.5,color:'var(--t1)',marginBottom:6}}>{item.name}</div>
                    <div style={{fontSize:11,color:'var(--t3)'}}><strong style={{color:'var(--t1)',fontWeight:400}}>{days}d</strong> · <strong style={{color:'var(--t1)',fontWeight:400}}>{fmt(perDay)}</strong>/day</div>
                  </div>
                </div>
              );
            })}
          </div>
        ):(
          <div style={{padding:'4px 16px 80px'}}>
            {displayed.map(item=>{
              const days=Math.max(1,Math.round((Date.now()-new Date(item.purchaseDate).getTime())/86400000));
              const perDay=Math.round(item.purchasePrice/days);
              return(
                <div key={item.id} onClick={()=>setDetailId(item.id)} style={{background:'var(--surface)',borderRadius:14,border:'1px solid var(--border2)',display:'flex',gap:12,padding:12,marginBottom:10,cursor:'pointer'}}>
                  <div style={{width:64,height:64,borderRadius:10,overflow:'hidden',flexShrink:0,background:'var(--ivory2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--t3)'}}>
                    {item.images.length?<img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:item.brand.slice(0,3).toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:500,letterSpacing:'.13em',color:'var(--t2)',textTransform:'uppercase',marginBottom:2}}>{item.brand}</div>
                    <div style={{fontSize:13,marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</div>
                    <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:15,marginBottom:3}}>{fmt(item.purchasePrice)}</div>
                    <div style={{fontSize:11,color:'var(--t3)'}}><strong style={{color:'var(--t1)',fontWeight:400}}>{days}d</strong> · <strong style={{color:'var(--t1)',fontWeight:400}}>{fmt(perDay)}</strong>/day</div>
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
      <DetailView itemId={detailId} onClose={()=>{setDetailId(null);reload();}} onEdit={item=>{setDetailId(null);setEditItem(item);setAddOpen(true);}} onUpdate={reload}/>
      <AddItemSheet open={addOpen} onClose={()=>setAddOpen(false)} editItem={editItem} onSave={reload}/>
      <SettingsSheet open={settingsOpen} onClose={()=>setSettingsOpen(false)} onUpdate={reload}/>
    </div>
  );
}
