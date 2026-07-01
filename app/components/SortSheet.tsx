'use client';
import Sheet from'./Sheet';
export type SortKey='date_new'|'date_old'|'price_hi'|'price_lo'|'priority'|'brand'|'category';
const OPTS:{key:SortKey;label:string;icon:React.ReactNode}[]=[
  {key:'date_new',label:'登録が新しい順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>},
  {key:'date_old',label:'登録が古い順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>},
  {key:'price_hi',label:'価格が高い順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>},
  {key:'price_lo',label:'価格が安い順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>},
  {key:'priority',label:'Priority ★ 順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
  {key:'brand',label:'ブランド順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>},
  {key:'category',label:'カテゴリ順',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{width:16,height:16}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>},
];
interface Props{open:boolean;onClose:()=>void;current:SortKey;onChange:(k:SortKey)=>void;}
export default function SortSheet({open,onClose,current,onChange}:Props){
  return(
    <Sheet open={open} onClose={onClose} title="並び替え">
      <div style={{paddingBottom:32}}>
        {OPTS.map(o=>(
          <button key={o.key} onClick={()=>{onChange(o.key);onClose();}}
            style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 20px',background:current===o.key?'var(--brown-bg)':'none',border:'none',borderBottom:'1px solid var(--border2)',cursor:'pointer',textAlign:'left'}}>
            <span style={{width:32,height:32,borderRadius:8,background:current===o.key?'var(--brown)':'var(--ivory2)',display:'flex',alignItems:'center',justifyContent:'center',color:current===o.key?'#fff':'var(--t3)',flexShrink:0}}>{o.icon}</span>
            <span style={{flex:1,fontSize:14,color:current===o.key?'var(--brown)':'var(--t1)',fontWeight:current===o.key?500:300}}>{o.label}</span>
            {current===o.key&&<span style={{color:'var(--brown)',fontSize:16}}>✓</span>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
