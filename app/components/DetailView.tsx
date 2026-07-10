'use client';
import{useState,useEffect,useRef}from'react';
import{store,WishItem,CollectionItem,fmt,DisplaySettings}from'@/lib/store';
import{swatchStyle}from'./SwatchGrid';
import StarRating from'./StarRating';
import PriceChart from'./PriceChart';
import Sheet from'./Sheet';
import SliderButton from'./SliderButton';

interface Props{itemId:string|null;onClose:()=>void;onEdit:(item:WishItem)=>void;onUpdate:()=>void;allItems?:WishItem[];}

export default function DetailView({itemId,onClose,onEdit,onUpdate,allItems=[]}:Props){
  const[item,setItem]=useState<WishItem|CollectionItem|null>(null);
  const[imgIdx,setImgIdx]=useState(0);
  const[puOpen,setPuOpen]=useState(false);const[puPrice,setPuPrice]=useState('');
  const[colOpen,setColOpen]=useState(false);const[cPrice,setCPrice]=useState('');const[cDate,setCDate]=useState('');
  const[menuOpen,setMenuOpen]=useState(false);const[curIdx,setCurIdx]=useState(0);
  const[ds,setDs]=useState<DisplaySettings>(store.getDisplay());
  const tx=useRef(0);

  useEffect(()=>{
    if(!itemId){setItem(null);return;}
    const idx=allItems.findIndex(i=>i.id===itemId);setCurIdx(idx>=0?idx:0);
    const found=store.getItems().find(i=>i.id===itemId)||store.getColls().find(i=>i.id===itemId);
    setItem(found||null);setImgIdx(0);
    setDs(store.getDisplay());
  },[itemId]);

  function navItem(dir:'prev'|'next'){
    const ni=dir==='next'?curIdx+1:curIdx-1;
    if(ni<0||ni>=allItems.length)return;
    setCurIdx(ni);
    const it=store.getItems().find(i=>i.id===allItems[ni].id)||store.getColls().find(i=>i.id===allItems[ni].id);
    if(it){setItem(it);setImgIdx(0);}
  }
  if(!item)return null;

  const isColl=!!store.getColls().find(i=>i.id===item.id);
  const coll=isColl?(item as CollectionItem):null;
  const priceUp=item.currentPrice&&item.currentPrice!==item.price;
  let days=0,diff=0,perDay=0;
  if(coll){days=Math.max(1,Math.round((Date.now()-new Date(coll.purchaseDate).getTime())/86400000));diff=coll.price-coll.purchasePrice;perDay=Math.round(coll.purchasePrice/days);}

  function confirmPU(){
    const p=parseInt(puPrice)||0;const today=new Date().toISOString().slice(0,10);
    const arr=store.getItems().find(i=>i.id===item!.id)?store.getItems():store.getColls();
    const idx=arr.findIndex(i=>i.id===item!.id);if(idx===-1)return;
    const it=arr[idx];if(!it.priceHistory.length)it.priceHistory=[{price:it.price,date:it.date}];
    it.priceHistory.push({price:p,date:today});it.currentPrice=p;
    if(store.getItems().find(i=>i.id===it.id))store.saveItems(store.getItems());else store.saveColls(store.getColls());
    setItem({...it});setPuOpen(false);onUpdate();
  }
  function confirmCol(){
    if(!cDate){alert('購入日を入力してください');return;}
    const items=store.getItems();const idx=items.findIndex(i=>i.id===item!.id);if(idx===-1)return;
    const nc:CollectionItem={...items[idx],purchasePrice:parseInt(cPrice)||0,purchaseDate:cDate};
    const colls=store.getColls();colls.unshift(nc);items.splice(idx,1);
    store.saveItems(items);store.saveColls(colls);setColOpen(false);onUpdate();onClose();
  }
  function updatePriority(v:number){
    const arr=store.getItems().find(i=>i.id===item!.id)?store.getItems():store.getColls();
    const idx=arr.findIndex(i=>i.id===item!.id);if(idx===-1)return;
    arr[idx].priority=v;
    if(store.getItems().find(i=>i.id===arr[idx].id))store.saveItems(store.getItems());else store.saveColls(store.getColls());
    setItem({...item!,priority:v});onUpdate();
  }

  const TR:React.CSSProperties={borderBottom:'1px solid var(--border2)'};
  const td1:React.CSSProperties={color:'var(--t2)',fontSize:13,width:90,paddingTop:10,verticalAlign:'top'};
  const td2:React.CSSProperties={fontSize:13,color:'var(--t1)',lineHeight:1.6,paddingTop:10,paddingBottom:10};
  const LBL:React.CSSProperties={display:'block',fontSize:10,fontWeight:500,letterSpacing:'.13em',color:'var(--t2)',textTransform:'uppercase',marginBottom:6};
  const INP:React.CSSProperties={width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:10,background:'var(--surface)',fontSize:14};

  const w=ds.wish;
  const c=ds.collection;

  return(
    <>
    <div style={{position:'fixed',inset:0,zIndex:100,overflowY:'auto',display:'flex',flexDirection:'column',background:'var(--ivory)'}}
      onTouchStart={e=>{tx.current=e.touches[0].clientX;}}
      onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-tx.current;if(Math.abs(dx)>60)navItem(dx<0?'next':'prev');}}>
      {/* Image */}
      <div style={{position:'relative',background:'var(--ivory2)',flexShrink:0}}>
        {item.images.length?<img src={item.images[imgIdx]} alt={item.name} style={{width:'100%',aspectRatio:'1',objectFit:'cover',display:'block'}}/>
        :<div style={{width:'100%',aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:13,letterSpacing:'.18em',color:'var(--t3)'}}>NO IMAGE</div>}
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'12px 14px',display:'flex',justifyContent:'space-between',background:'linear-gradient(to bottom,rgba(249,247,242,.88),transparent)'}}>
          <button onClick={onClose} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:10,background:'rgba(249,247,242,.88)',border:'1px solid var(--border2)',cursor:'pointer',color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:18,height:18}}><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{position:'relative',display:'flex',gap:8}}>
            <button onClick={()=>onEdit(item)} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:10,background:'rgba(249,247,242,.88)',border:'1px solid var(--border2)',cursor:'pointer',color:'var(--brown)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={()=>setMenuOpen(p=>!p)} style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:10,background:'rgba(249,247,242,.88)',border:'1px solid var(--border2)',cursor:'pointer',color:'var(--t2)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:17,height:17}}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            {menuOpen&&<div style={{position:'absolute',top:42,right:0,background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:12,boxShadow:'0 4px 16px rgba(0,0,0,.12)',minWidth:130,zIndex:10}}>
              <button onClick={()=>{setMenuOpen(false);onEdit(item);}} style={{width:'100%',padding:'12px 16px',fontSize:13,textAlign:'left',color:'var(--t1)',cursor:'pointer',borderBottom:'1px solid var(--border2)',background:'none'}}>編集</button>
              <button onClick={()=>{setMenuOpen(false);if(!confirm('削除しますか？'))return;if(isColl)store.saveColls(store.getColls().filter(i=>i.id!==item.id));else store.saveItems(store.getItems().filter(i=>i.id!==item.id));onUpdate();onClose();}} style={{width:'100%',padding:'12px 16px',fontSize:13,textAlign:'left',color:'#C0392B',cursor:'pointer',background:'none'}}>削除</button>
            </div>}
          </div>
        </div>
        {item.images.length>1&&<div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
          {item.images.map((_,i)=><button key={i} onClick={()=>setImgIdx(i)} style={{width:5,height:5,borderRadius:'50%',background:i===imgIdx?'var(--brown)':'rgba(160,135,106,.3)',border:'none',cursor:'pointer',padding:0}}/>)}
        </div>}
        {allItems.length>1&&<>
          {curIdx>0&&<button onClick={()=>navItem('prev')} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:32,height:32,borderRadius:'50%',background:'rgba(249,247,242,.88)',border:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><polyline points="15 18 9 12 15 6"/></svg>
          </button>}
          {curIdx<allItems.length-1&&<button onClick={()=>navItem('next')} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',width:32,height:32,borderRadius:'50%',background:'rgba(249,247,242,.88)',border:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--brown)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><polyline points="9 18 15 12 9 6"/></svg>
          </button>}
        </>}
      </div>

      {/* Body */}
      <div style={{padding:'22px 20px 48px',flex:1}}>
        {isColl?(
          <>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:400,lineHeight:1.2,marginBottom:4}}>{item.brand}</div>
            <div style={{fontSize:13,color:'var(--t2)',marginBottom:18}}>{item.name}</div>
            <table style={{width:'100%',borderCollapse:'collapse',marginBottom:18}}><tbody>
              {c.purchaseDate&&<tr style={TR}><td style={td1}>購入日</td><td style={td2}>{coll!.purchaseDate}</td></tr>}
              {c.purchasePrice&&<tr style={TR}><td style={td1}>購入価格</td><td style={td2}>{fmt(coll!.purchasePrice)}</td></tr>}
              {c.price&&<tr style={TR}><td style={td1}>登録価格</td><td style={td2}>{fmt(item.price)}</td></tr>}
            </tbody></table>
            {(c.diff||c.days||c.perDay)&&<div style={{display:'grid',gridTemplateColumns:`repeat(${[c.diff,c.days,c.perDay].filter(Boolean).length},1fr)`,gap:1,background:'var(--border2)',borderRadius:12,overflow:'hidden',marginBottom:22}}>
              {c.diff&&<div style={{background:'var(--ivory2)',padding:'13px 10px'}}><div style={{fontSize:9,color:'var(--t3)',letterSpacing:'.06em',marginBottom:6,textTransform:'uppercase'}}>差額</div><div style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,color:diff>=0?'#5C8C6A':'#A05050'}}>{fmt(diff)}</div></div>}
              {c.days&&<div style={{background:'var(--ivory2)',padding:'13px 10px'}}><div style={{fontSize:9,color:'var(--t3)',letterSpacing:'.06em',marginBottom:6,textTransform:'uppercase'}}>保有日数</div><div style={{fontFamily:'Cormorant Garamond,serif',fontSize:18}}>{days}日</div></div>}
              {c.perDay&&<div style={{background:'var(--ivory2)',padding:'13px 10px'}}><div style={{fontSize:9,color:'var(--t3)',letterSpacing:'.06em',marginBottom:6,textTransform:'uppercase'}}>1日あたりのコスト</div><div style={{fontFamily:'Cormorant Garamond,serif',fontSize:18}}>{fmt(perDay)}</div></div>}
            </div>}
            {c.memo&&item.memo&&<div style={{marginBottom:18}}><div style={{fontSize:12,color:'var(--t3)',marginBottom:5,letterSpacing:'.06em',textTransform:'uppercase'}}>Memo</div><div style={{fontSize:13,lineHeight:1.8}}>{item.memo}</div></div>}
            <PriceChart history={item.priceHistory}/>
            <div style={{borderTop:'1px solid var(--border2)',margin:'18px 0'}}/>
            <button onClick={()=>{setPuPrice(String(item.currentPrice||item.price));setPuOpen(true);}} style={{width:'100%',padding:12,background:'none',border:'1px solid var(--brown)',borderRadius:24,fontSize:13,color:'var(--brown)',cursor:'pointer'}}>現在価格を更新</button>
          </>
        ):(
          <>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,fontWeight:400,letterSpacing:'.02em',marginBottom:4}}>{item.brand}</div>
            <div style={{fontSize:14,color:'var(--t2)',marginBottom:14}}>{item.name}</div>
            <div style={{marginBottom:14}}>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:300,letterSpacing:'.02em'}}>{fmt(item.currentPrice||item.price)}</div>
              {w.currentPrice&&priceUp&&<div style={{fontSize:11,color:'var(--t3)',marginTop:2}}>登録時 {fmt(item.price)} <span style={{color:'#A05050'}}>+{fmt(item.currentPrice!-item.price)}</span></div>}
            </div>
            {w.priority&&<div style={{marginBottom:18}}><StarRating value={item.priority} onChange={updatePriority} size={26}/></div>}
            <div style={{borderTop:'1px solid var(--border2)',marginBottom:16}}/>
            <table style={{width:'100%',borderCollapse:'collapse',marginBottom:18}}><tbody>
              <tr style={TR}><td style={td1}>カテゴリ</td><td style={td2}>{item.cat||'—'}</td></tr>
              {w.price&&<tr style={TR}><td style={td1}>登録価格</td><td style={td2}>{fmt(item.price)}</td></tr>}
              {w.currentPrice&&<tr style={TR}><td style={td1}>現在価格</td><td style={td2}>{item.currentPrice?fmt(item.currentPrice):'—'}<button onClick={()=>{setPuPrice(String(item.currentPrice||item.price));setPuOpen(true);}} style={{fontSize:11,color:'var(--brown)',marginLeft:6,textDecoration:'underline',cursor:'pointer'}}>更新</button></td></tr>}
              {w.url&&item.url&&<tr style={TR}><td style={td1}>URL</td><td style={td2}><a href={item.url} target="_blank" rel="noreferrer" style={{color:'var(--brown)',textDecoration:'underline'}}>リンクを開く</a></td></tr>}
              {w.date&&<tr><td style={td1}>登録日</td><td style={td2}>{item.date}</td></tr>}
            </tbody></table>
            <PriceChart history={item.priceHistory}/>
            <div style={{borderTop:'1px solid var(--border2)',margin:'18px 0'}}/>
            <SliderButton label="→  Collection へ移動" onComplete={()=>{setCPrice('');setCDate(new Date().toISOString().slice(0,10));setColOpen(true);}}/>
            {w.memo&&item.memo&&<div style={{padding:'14px 16px',background:'var(--ivory2)',borderRadius:12,fontSize:13,lineHeight:1.8,marginTop:12}}>{item.memo}</div>}
          </>
        )}
      </div>
    </div>

    <Sheet open={puOpen} onClose={()=>setPuOpen(false)} title="現在価格を更新">
      <div style={{display:'flex',flexDirection:'column',gap:14,padding:'16px 20px 36px'}}>
        <input type="number" value={puPrice} onChange={e=>setPuPrice(e.target.value)} style={INP}/>
        <button onClick={confirmPU} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,cursor:'pointer',border:'none'}}>更新する</button>
      </div>
    </Sheet>
    <Sheet open={colOpen} onClose={()=>setColOpen(false)} title="Collection へ移動">
      <div style={{display:'flex',flexDirection:'column',gap:14,padding:'16px 20px 36px'}}>
        <div><label style={LBL}>購入日</label><input type="date" value={cDate} onChange={e=>setCDate(e.target.value)} style={INP}/></div>
        <div><label style={LBL}>購入価格（円）</label><input type="number" value={cPrice} onChange={e=>setCPrice(e.target.value)} placeholder="210000" style={INP}/></div>
        <button onClick={confirmCol} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,cursor:'pointer',border:'none'}}>移動する</button>
      </div>
    </Sheet>
    </>
  );
}
