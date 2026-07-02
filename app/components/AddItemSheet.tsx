'use client';
import{useState,useEffect,useRef}from'react';
import{store,WishItem,uid,ColorDef}from'@/lib/store';
import Sheet from'./Sheet';
import StarRating from'./StarRating';
import ColorPickerSheet from'./ColorPickerSheet';
import{swatchStyle}from'./SwatchGrid';
interface Props{open:boolean;onClose:()=>void;editItem?:WishItem|null;onSave:()=>void;}
export default function AddItemSheet({open,onClose,editItem,onSave}:Props){
  const[brand,setBrand]=useState('');const[name,setName]=useState('');const[cat,setCat]=useState('');
  const[color,setColor]=useState('');const[price,setPrice]=useState('');const[url,setUrl]=useState('');
  const[memo,setMemo]=useState('');const[priority,setPriority]=useState(3);const[images,setImages]=useState<string[]>([]);
  const[cats,setCats]=useState<string[]>([]);const[colors,setColors]=useState<ColorDef[]>([]);
  const[brandSugg,setBrandSugg]=useState<string[]>([]);const[showSugg,setShowSugg]=useState(false);
  const[cpOpen,setCpOpen]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(open){
      setCats(store.getCats());setColors(store.getColors());
      if(editItem){setBrand(editItem.brand);setName(editItem.name);setCat(editItem.cat);setColor(editItem.color);setPrice(String(editItem.price||''));setUrl(editItem.url||'');setMemo(editItem.memo||'');setPriority(editItem.priority||3);setImages(editItem.images||[]);}
      else{setBrand('');setName('');setCat(store.getCats()[0]||'');setColor('');setPrice('');setUrl('');setMemo('');setPriority(3);setImages([]);}
    }
  },[open,editItem]);
  function handleBrand(v:string){
    setBrand(v);
    const brands=store.getBrands();
    if(v.trim()){const s=brands.filter(b=>b.toLowerCase().startsWith(v.toLowerCase())&&b!==v);setBrandSugg(s);setShowSugg(s.length>0);}
    else setShowSugg(false);
  }
  function addColor(hex:string,shimmer:boolean){const n=[...colors,{hex,shimmer}];setColors(n);store.saveColors(n);}
  function handleFiles(e:React.ChangeEvent<HTMLInputElement>){Array.from(e.target.files||[]).forEach(f=>{const r=new FileReader();r.onload=ev=>setImages(p=>[...p,ev.target?.result as string]);r.readAsDataURL(f);});e.target.value='';}
  function submit(){
    if(!brand.trim()||!name.trim()){alert('ブランドと商品名は必須です');return;}
    const data={brand:brand.trim(),name:name.trim(),cat:cat||cats[0],color,price:parseInt(price)||0,url:url.trim(),memo:memo.trim(),priority,images};
    if(editItem){
      const items=store.getItems();const colls=store.getColls();
      const ii=items.findIndex(i=>i.id===editItem.id);
      if(ii!==-1){items[ii]={...items[ii],...data};store.saveItems(items);}
      else{const ci=colls.findIndex(i=>i.id===editItem.id);if(ci!==-1){colls[ci]={...colls[ci],...data};store.saveColls(colls);}}
    }else{
      const items=store.getItems();items.unshift({id:uid(),currentPrice:null,priceHistory:[],date:new Date().toISOString().slice(0,10),...data});store.saveItems(items);
    }
    onSave();onClose();
  }
  const L:React.CSSProperties={display:'block',fontSize:10,fontWeight:500,letterSpacing:'.13em',color:'var(--t2)',textTransform:'uppercase',marginBottom:6};
  const I:React.CSSProperties={width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:10,background:'var(--surface)',fontSize:14};
  return(
    <>
    <Sheet open={open} onClose={onClose} title={editItem?'アイテムを編集':'アイテムを登録'}>
      <div style={{display:'flex',flexDirection:'column',gap:16,padding:'16px 20px 40px'}}>
        <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleFiles} style={{display:'none'}}/>
        <div>
          <label style={L}>画像</label>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[0,1,2].map(i=>(
              <div key={i} onClick={()=>fileRef.current?.click()} style={{aspectRatio:'1',borderRadius:12,overflow:'hidden',background:'var(--ivory2)',border:'1.5px dashed var(--border)',cursor:'pointer',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {images[i]?(<><img src={images[i]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/><button onClick={e=>{e.stopPropagation();setImages(p=>p.filter((_,idx)=>idx!==i));}} style={{position:'absolute',top:4,right:4,background:'rgba(160,135,106,.8)',color:'#fff',borderRadius:'50%',width:20,height:20,fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer'}}>✕</button></>)
                :(<svg viewBox="0 0 24 24" fill="none" stroke="var(--greige2)" strokeWidth="1.5" strokeLinecap="round" style={{width:28,height:28}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>)}
              </div>
            ))}
          </div>
        </div>
        <div><label style={L}>価格（円）</label><input style={I} type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="238000"/></div>
        <div style={{position:'relative'}}>
          <label style={L}>ブランド *</label>
          <input style={I} value={brand} onChange={e=>handleBrand(e.target.value)} onBlur={()=>setTimeout(()=>setShowSugg(false),150)} placeholder="Cartier"/>
          {showSugg&&<div style={{position:'absolute',top:'100%',left:0,right:0,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,zIndex:10,boxShadow:'0 4px 12px rgba(0,0,0,.1)',overflow:'hidden'}}>
            {brandSugg.map(b=><button key={b} onMouseDown={()=>{setBrand(b);setShowSugg(false);}} style={{width:'100%',padding:'10px 12px',textAlign:'left',fontSize:13,cursor:'pointer',borderBottom:'1px solid var(--border2)',background:'none'}}>{b}</button>)}
          </div>}
        </div>
        <div><label style={L}>商品名 *</label><input style={I} value={name} onChange={e=>setName(e.target.value)} placeholder="LOVE Ring"/></div>
        <div>
          <label style={L}>カテゴリ</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{border:cat===c?'none':'1px solid var(--border)',borderRadius:20,padding:'6px 14px',fontSize:12,color:cat===c?'#fff':'var(--t2)',background:cat===c?'var(--brown)':'none',cursor:'pointer',whiteSpace:'nowrap'}}>{c}</button>)}
          </div>
        </div>
        <div>
          <label style={L}>カラー</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}>
            {colors.map(c=>(
              <button key={c.hex} onClick={()=>setColor(c.hex)} style={{...swatchStyle(c),width:32,height:32,borderRadius:'50%',flexShrink:0,outline:color===c.hex?'2.5px solid var(--brown)':'none',outlineOffset:3,cursor:'pointer'}}/>
            ))}
            <button onClick={()=>setCpOpen(true)} style={{width:32,height:32,borderRadius:'50%',border:'1.5px dashed var(--brown-light)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--brown)',fontSize:20,background:'none',flexShrink:0}}>⊕</button>
          </div>
        </div>
        <div><label style={L}>Priority</label><StarRating value={priority} onChange={setPriority}/></div>
        <div><label style={L}>URL</label><input style={I} type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/></div>
        <div><label style={L}>Memo</label><textarea style={{...I,minHeight:72,resize:'vertical',lineHeight:1.7}} value={memo} onChange={e=>setMemo(e.target.value)} placeholder="30歳記念、昇進祝い…"/></div>
        <button onClick={submit} style={{width:'100%',padding:13,background:'var(--brown)',color:'#fff',borderRadius:24,fontSize:13,letterSpacing:'.07em',cursor:'pointer',border:'none'}}>{editItem?'更新する':'登録する'}</button>
        {editItem&&<button onClick={()=>{if(!confirm('削除しますか？'))return;store.saveItems(store.getItems().filter(i=>i.id!==editItem.id));store.saveColls(store.getColls().filter(i=>i.id!==editItem.id));onSave();onClose();}} style={{width:'100%',padding:12,background:'none',color:'#C0392B',border:'1px solid #C0392B',borderRadius:24,fontSize:13,cursor:'pointer'}}>削除する</button>}
      </div>
    </Sheet>
    <ColorPickerSheet open={cpOpen} onClose={()=>setCpOpen(false)} onAdd={addColor}/>
    </>
  );
}
