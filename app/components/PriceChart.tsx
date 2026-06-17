'use client';
import { PriceHistory, fmt } from '@/lib/store';
interface Props { history:PriceHistory[]; }
export default function PriceChart({history}:Props){
  if(history.length<2)return null;
  const max=Math.max(...history.map(h=>h.price));
  const min=Math.min(...history.map(h=>h.price));
  const range=max-min||1;
  return(
    <div style={{marginTop:16}}>
      <p style={{fontSize:10,letterSpacing:'.13em',textTransform:'uppercase',color:'var(--t3)',marginBottom:10}}>Price History</p>
      <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80}}>
        {history.map((h,i)=>{
          const pct=20+((h.price-min)/range)*70;
          const prev=history[i-1];
          const diff=prev?h.price-prev.price:0;
          const color=diff>0?'#A05050':diff<0?'#5C8C6A':'var(--greige2)';
          return(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              {diff!==0&&i>0&&<span style={{fontSize:9,color,whiteSpace:'nowrap'}}>{diff>0?'+':''}{fmt(diff)}</span>}
              <div style={{width:'100%',background:color,borderRadius:'4px 4px 0 0',height:`${pct}%`,transition:'height .4s ease'}}/>
              <span style={{fontSize:9,color:'var(--t3)',whiteSpace:'nowrap'}}>{h.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
        <span style={{fontSize:11,color:'var(--t3)'}}>{fmt(history[0].price)}</span>
        <span style={{fontSize:11,color:history[history.length-1].price>history[0].price?'#A05050':'#5C8C6A'}}>{fmt(history[history.length-1].price)}</span>
      </div>
    </div>
  );
}
