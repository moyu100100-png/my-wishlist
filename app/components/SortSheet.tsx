'use client';
import Sheet from'./Sheet';
export type SortKey='date_new'|'date_old'|'price_hi'|'price_lo'|'priority'|'brand'|'category';
const OPTS:{key:SortKey;label:string}[]=[
  {key:'date_new',label:'登録が新しい順'},
  {key:'date_old',label:'登録が古い順'},
  {key:'price_hi',label:'価格が高い順'},
  {key:'price_lo',label:'価格が安い順'},
  {key:'priority',label:'Priority ★ 順'},
  {key:'brand',label:'ブランド順'},
  {key:'category',label:'カテゴリ順'},
];
interface Props{open:boolean;onClose:()=>void;current:SortKey;onChange:(k:SortKey)=>void;}
export default function SortSheet({open,onClose,current,onChange}:Props){
  return(
    <Sheet open={open} onClose={onClose} title="並び替え">
      <div style={{paddingBottom:32}}>
        {OPTS.map(o=>(
          <button key={o.key} onClick={()=>{onChange(o.key);onClose();}}
            style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 20px',background:current===o.key?'var(--brown-bg)':'none',border:'none',borderBottom:'1px solid var(--border2)',cursor:'pointer',textAlign:'left'}}>
            <span style={{flex:1,fontSize:14,color:current===o.key?'var(--brown)':'var(--t1)',fontWeight:current===o.key?500:300}}>{o.label}</span>
            {current===o.key&&<span style={{color:'var(--brown)',fontSize:16}}>✓</span>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
