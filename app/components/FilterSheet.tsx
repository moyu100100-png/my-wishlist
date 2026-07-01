'use client';
import{useState,useEffect}from'react';
import{store}from'@/lib/store';
import Sheet from'./Sheet';
export interface FilterState{cats:string[];colors:string[];brands:string[];priceMin:string;priceMax:string;dateFrom:string;dateTo:string;}
export const defaultFilter:FilterState={cats:[],colors:[],brands:[],priceMin:'',priceMax:'',dateFrom:'',dateTo:''};
interface Props{open:boolean;onClose:()=>void;current:FilterState;onApply:(f:FilterState)=>void;}
export default function FilterSheet({open,onClose,current,onApply}:Props){
  const[f,setF]=useState<FilterState>(defaultFilter);
  const[allCats,setAllCats]=useState<string[]>([]);
  const[allColors,setAllColors]=useState<{hex:string;shimmer:boolean}[]>([]);
  const[allBrands,setAllBrands]=useState<string[]>([]);

  useEffect(()=>{
    if(!open)return;
    const safe={...defaultFilter,...current};
    setF(safe);
    const items=store.getItems();
    setAllCats(store.getCats().filter(c=>items.some(i=>i.cat===c)));
    const usedColors=[...new Set(items.map(i=>i.color))];
    setAllColors(store.getColors().filter(c=>usedColors.includes(c.hex)));
    setAllBrands(store.getBrands().filter(b=>items.some(i=>i.brand===b)));
  },[open,current]);

  const safeCats=f?.cats??[];
  const safeColors=f?.colors??[];
  const safeBrands=f?.brands??[];
  const filteredItems=store.getItems().filter(i=>safeCats.length?safeCats.includes(i.cat):true);
  const availColors=[...new Set(filteredItems.map(i=>i.color))];
  const availBrands=[...new Set(filteredItems.map(i=>i.brand))];

  function tog<T>(a:T[],v:T):T[]{return a.includes(v)?a.filter(x=>x!==v):[...a,v];}
  const chip=(on:boolean,disabled=false):React.CSSProperties=>({border:on?'none':'1px solid var(--border)',borderRadius:20,padding:'6px 14px',fontSize:12,color:on?'#fff':disabled?'var(--t3)':'var(--t2)',background:on?'var(--brown)':disabled?'var(--ivory2)':'none',cursor:disabled?'not-allowed':'pointer',whiteSpace:'nowrap',opacity:disabled?.5:1});
  const ST:React.CSSProperties={fontSize:10,fontWeight:500,letterSpacing:'.14em',color:'var(--t3)',textTransform:'uppercase',marginBottom:12};
  const RI:React.CSSProperties={width:'100%',padding:'9px 10px',border:'1px solid var(--border)',borderRadius:10,background:'var(--surface)',fontSize:13};

  return(
    <Sheet open={open} onClose={onClose} title="フィルター"
      rightAction={<button onClick={()=>{const d=defaultFilter;setF(d);onApply(d);onClose();}} style={{fontSize:12,color:'var(--brown)',cursor:'pointer',background:'none',border:'none',padding:4}}>リセット</button>}>
      <div style={{paddingBottom:32}}>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>カテゴリ</p><div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          <button style={chip(!safeCats.length)} onClick={()=>setF(p=>({...p,cats:[],colors:[],brands:[]}))}>すべて</button>
          {allCats.map(c=><button key={c} style={chip(safeCats.includes(c))} onClick={()=>setF(p=>({...p,cats:tog(p.cats,c)}))}>{c}</button>)}
        </div></div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>カラー</p><div style={{display:'flex',flexWrap:'wrap',gap:10}}>
          {allColors.map(c=>{const dis=safeCats.length>0&&!availColors.includes(c.hex);return(
            <button key={c.hex} onClick={()=>!dis&&setF(p=>({...p,colors:tog(p.colors,c.hex)}))} title={c.hex}
              style={{width:34,height:34,borderRadius:'50%',background:c.hex,cursor:dis?'not-allowed':'pointer',flexShrink:0,outline:safeColors.includes(c.hex)?'2.5px solid var(--brown)':'none',outlineOffset:3,opacity:dis?.3:1,border:['#FFFFFF','#E8E8E8','#C0C0C0'].includes(c.hex)?'1px solid var(--border)':'none',...(c.shimmer?{backgroundImage:'linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.0) 45%,rgba(255,255,255,.45) 100%)'}:{})}}/>
          );})}
        </div></div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>ブランド</p><div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {allBrands.map(b=>{const dis=safeCats.length>0&&!availBrands.includes(b);return(
            <button key={b} style={chip(safeBrands.includes(b),dis)} onClick={()=>!dis&&setF(p=>({...p,brands:tog(p.brands,b)}))}>{b}</button>
          );})}
        </div></div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>価格</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center'}}>
            <input style={RI} type="number" placeholder="下限" value={f?.priceMin??''} onChange={e=>setF(p=>({...p,priceMin:e.target.value}))}/>
            <span style={{fontSize:12,color:'var(--t3)',textAlign:'center'}}>〜</span>
            <input style={RI} type="number" placeholder="上限" value={f?.priceMax??''} onChange={e=>setF(p=>({...p,priceMax:e.target.value}))}/>
          </div>
        </div>
        <div style={{padding:'16px 20px 0'}}><p style={ST}>登録日</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center'}}>
            <input style={RI} type="date" value={f?.dateFrom??''} onChange={e=>setF(p=>({...p,dateFrom:e.target.value}))}/>
            <span style={{fontSize:12,color:'var(--t3)',textAlign:'center'}}>〜</span>
            <input style={RI} type="date" value={f?.dateTo??''} onChange={e=>setF(p=>({...p,dateTo:e.target.value}))}/>
          </div>
        </div>
        <div style={{padding:'16px 20px 0'}}>
          <button onClick={()=>{onApply(f);onClose();}} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,letterSpacing:'.07em',cursor:'pointer',border:'none'}}>この条件で表示</button>
        </div>
      </div>
    </Sheet>
  );
}
