'use client';
import{useState,useEffect}from'react';
import{store,Theme,DisplaySettings}from'@/lib/store';
import Sheet from'./Sheet';

interface Props{open:boolean;onClose:()=>void;onUpdate:()=>void;}

export default function SettingsSheet({open,onClose,onUpdate}:Props){
  const[cats,setCats]=useState<string[]>([]);
  const[theme,setTheme]=useState<Theme>('ivory');
  const[display,setDisplay]=useState<DisplaySettings>(store.getDisplay());
  const[newCat,setNewCat]=useState('');
  const[sec,setSec]=useState('');
  const[subSec,setSubSec]=useState('');
  const[dragIdx,setDragIdx]=useState<number|null>(null);

  useEffect(()=>{
    if(open){
      setCats(store.getCats());
      setTheme(store.getTheme());
      setDisplay(store.getDisplay());
      setSec('');setSubSec('');
    }
  },[open]);

  function addCat(){const v=newCat.trim();if(!v)return;const n=[...cats,v];setCats(n);store.saveCats(n);setNewCat('');onUpdate();}
  function rmCat(i:number){const n=cats.filter((_,idx)=>idx!==i);setCats(n);store.saveCats(n);onUpdate();}
  function moveCat(from:number,to:number){const n=[...cats];const[m]=n.splice(from,1);n.splice(to,0,m);setCats(n);store.saveCats(n);}
  function chTheme(t:Theme){setTheme(t);store.saveTheme(t);document.documentElement.setAttribute('data-theme',t);}

  function toggleWish(key:keyof DisplaySettings['wish']){
    const next={...display,wish:{...display.wish,[key]:!display.wish[key]}};
    setDisplay(next);store.saveDisplay(next);onUpdate();
  }
  function toggleColl(key:keyof DisplaySettings['collection']){
    const next={...display,collection:{...display.collection,[key]:!display.collection[key]}};
    setDisplay(next);store.saveDisplay(next);onUpdate();
  }

  const tog=(k:string)=>setSec(sec===k?'':k);
  const togSub=(k:string)=>setSubSec(subSec===k?'':k);

  const Chev=({open}:{open:boolean})=>(
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.6" strokeLinecap="round"
      style={{width:15,height:15,transform:open?'rotate(90deg)':'none',transition:'transform .2s',flexShrink:0}}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  const Toggle=({on,onClick}:{on:boolean;onClick:()=>void})=>(
    <button onClick={onClick} style={{width:40,height:22,borderRadius:11,background:on?'var(--brown)':'var(--greige2)',position:'relative',border:'none',cursor:'pointer',flexShrink:0,transition:'background .2s'}}>
      <span style={{position:'absolute',top:3,left:on?21:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left .2s',display:'block'}}/>
    </button>
  );

  const DRAG=<svg viewBox="0 0 24 24" fill="none" stroke="var(--greige2)" strokeWidth="1.8" strokeLinecap="round" style={{width:16,height:16,flexShrink:0}}><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>;

  const MI={width:'100%',display:'flex',alignItems:'center',gap:14,padding:'15px 20px',borderBottom:'1px solid var(--border2)',background:'none',cursor:'pointer',textAlign:'left'} as React.CSSProperties;
  const SMI={width:'100%',display:'flex',alignItems:'center',gap:12,padding:'12px 20px 12px 24px',borderBottom:'1px solid var(--border2)',background:'none',cursor:'pointer',textAlign:'left'} as React.CSSProperties;
  const TR={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 20px',borderBottom:'1px solid var(--border2)'} as React.CSSProperties;

  const wishFields:[keyof DisplaySettings['wish'],string][]=[['price','登録価格'],['currentPrice','現在価格'],['priority','Priority'],['url','URL'],['date','登録日'],['memo','Memo']];
  const collFields:[keyof DisplaySettings['collection'],string][]=[['purchaseDate','購入日'],['purchasePrice','購入価格'],['price','登録価格'],['diff','差額'],['days','保有日数'],['perDay','一日あたりのコスト'],['memo','Memo']];

  return(
    <Sheet open={open} onClose={onClose} title="My Wish List">
      <div style={{paddingBottom:40}}>

        {/* 1. 表示設定 */}
        <button style={MI} onClick={()=>tog('display')}>
          <span style={{color:'var(--brown)',flexShrink:0,display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>表示設定</span>
          <Chev open={sec==='display'}/>
        </button>
        {sec==='display'&&<div style={{background:'var(--ivory2)'}}>
          {/* カテゴリ */}
          <button style={SMI} onClick={()=>togSub('cat')}>
            <span style={{flex:1,fontSize:13,color:'var(--t2)'}}>カテゴリ</span>
            <Chev open={subSec==='cat'}/>
          </button>
          {subSec==='cat'&&<div style={{background:'var(--surface)'}}>
            {cats.map((c,i)=>(
              <div key={c+i} draggable onDragStart={()=>setDragIdx(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragIdx!==null&&dragIdx!==i){moveCat(dragIdx,i);setDragIdx(null);}}}
                style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',borderBottom:'1px solid var(--border2)',cursor:'grab'}}>
                <button onClick={()=>rmCat(i)} style={{width:22,height:22,borderRadius:'50%',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t3)',fontSize:16,lineHeight:1,flexShrink:0}}>−</button>
                <span style={{flex:1,fontSize:13}}>{c}</span>
                {DRAG}
              </div>
            ))}
            <div style={{display:'flex',gap:8,padding:'10px 20px 12px'}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCat()} placeholder="新しいカテゴリ" style={{flex:1,padding:'8px 12px',border:'1px solid var(--border)',borderRadius:20,background:'var(--ivory)',fontSize:13,fontFamily:'inherit',outline:'none'}}/>
              <button onClick={addCat} style={{background:'var(--brown)',color:'#fff',borderRadius:20,padding:'8px 14px',fontSize:12,cursor:'pointer'}}>追加</button>
            </div>
          </div>}

          {/* Wish */}
          <button style={SMI} onClick={()=>togSub('wish')}>
            <span style={{flex:1,fontSize:13,color:'var(--t2)'}}>Wish</span>
            <Chev open={subSec==='wish'}/>
          </button>
          {subSec==='wish'&&<div style={{background:'var(--surface)',paddingBottom:4}}>
            {wishFields.map(([key,label])=>(
              <div key={key} style={TR}>
                <span style={{fontSize:13,color:'var(--t1)'}}>{label}</span>
                <Toggle on={display.wish[key]} onClick={()=>toggleWish(key)}/>
              </div>
            ))}
          </div>}

          {/* Collection */}
          <button style={{...SMI,borderBottom:'none'}} onClick={()=>togSub('coll')}>
            <span style={{flex:1,fontSize:13,color:'var(--t2)'}}>Collection</span>
            <Chev open={subSec==='coll'}/>
          </button>
          {subSec==='coll'&&<div style={{background:'var(--surface)',paddingBottom:4}}>
            {collFields.map(([key,label])=>(
              <div key={key} style={TR}>
                <span style={{fontSize:13,color:'var(--t1)'}}>{label}</span>
                <Toggle on={display.collection[key]} onClick={()=>toggleColl(key)}/>
              </div>
            ))}
          </div>}
        </div>}

        {/* 2. カラーテーマ */}
        <button style={MI} onClick={()=>tog('theme')}>
          <span style={{color:'var(--brown)',flexShrink:0,display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
              <circle cx="6.5" cy="11.5" r="1" fill="var(--brown)" stroke="none"/>
              <circle cx="9.5" cy="7.5" r="1" fill="var(--brown)" stroke="none"/>
              <circle cx="14.5" cy="7.5" r="1" fill="var(--brown)" stroke="none"/>
              <circle cx="17.5" cy="11.5" r="1" fill="var(--brown)" stroke="none"/>
            </svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>カラーテーマ</span>
          <Chev open={sec==='theme'}/>
        </button>
        {sec==='theme'&&<div style={{background:'var(--ivory2)',padding:'12px 20px 14px',display:'flex',gap:10}}>
          {(['ivory','greige','pink'] as Theme[]).map(t=>(
            <button key={t} onClick={()=>chTheme(t)} style={{flex:1,padding:'11px 4px',borderRadius:10,border:theme===t?'2px solid var(--brown)':'1px solid var(--border)',background:t==='ivory'?'#F9F7F2':t==='greige'?'#F0EBE0':'#FBF5F2',fontSize:12,color:theme===t?'var(--brown)':'var(--t2)',cursor:'pointer',fontWeight:theme===t?500:300}}>
              {t==='ivory'?'Ivory':t==='greige'?'Greige':'Pink'}
            </button>
          ))}
        </div>}

        {/* 3. コーヒー */}
        <button style={{...MI,opacity:.6,cursor:'not-allowed'}}>
          <span style={{color:'var(--brown)',flexShrink:0,display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>コーヒーを差し入れる</span>
          <span style={{fontSize:11,color:'var(--t3)',border:'1px solid var(--border)',borderRadius:10,padding:'2px 8px',whiteSpace:'nowrap'}}>近日公開</span>
        </button>

        {/* 4. このアプリについて */}
        <button style={MI} onClick={()=>tog('about')}>
          <span style={{color:'var(--brown)',flexShrink:0,display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span style={{flex:1,fontSize:14,color:'var(--t1)'}}>このアプリについて</span>
          <Chev open={sec==='about'}/>
        </button>
        {sec==='about'&&<div style={{background:'var(--ivory2)'}}>
          <button style={SMI}>
            <span style={{flex:1,fontSize:13,color:'var(--t2)'}}>利用規約</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.6" strokeLinecap="round" style={{width:13,height:13}}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button style={{...SMI,borderBottom:'none'}}>
            <span style={{flex:1,fontSize:13,color:'var(--t2)'}}>プライバシーポリシー</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.6" strokeLinecap="round" style={{width:13,height:13}}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>}

        {/* 5. リセット */}
        <button onClick={()=>{if(!confirm('すべてのデータをリセットしますか？この操作は取り消せません。'))return;localStorage.clear();window.location.reload();}}
          style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'15px 20px',background:'none',cursor:'pointer',textAlign:'left' as const}}>
          <span style={{color:'#C0392B',flexShrink:0,display:'flex'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </span>
          <span style={{fontSize:14,color:'#C0392B'}}>リセット</span>
        </button>
      </div>
    </Sheet>
  );
}
