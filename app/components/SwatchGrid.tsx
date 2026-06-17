'use client';
import { ColorDef } from '@/lib/store';
interface Props { colors:ColorDef[]; selected?:string; onSelect?:(hex:string)=>void; size?:number; }
export function swatchStyle(c:ColorDef):React.CSSProperties{
  const light=['#FFFFFF','#F5F0E8','#E8E8E8','#E8B4B8','#C0C0C0'].includes(c.hex);
  return {background:c.hex,...(c.shimmer?{backgroundImage:'linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.0) 45%,rgba(255,255,255,.45) 100%)'}:{}),border:light?'1px solid var(--border)':'2px solid transparent'};
}
export default function SwatchGrid({colors,selected,onSelect,size=28}:Props){
  return(
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {colors.map(c=>(
        <button key={c.hex} onClick={()=>onSelect?.(c.hex)} title={c.hex}
          style={{...swatchStyle(c),width:size,height:size,borderRadius:'50%',flexShrink:0,position:'relative',outline:selected===c.hex?'2.5px solid var(--brown)':'none',outlineOffset:3,cursor:'pointer'}}/>
      ))}
    </div>
  );
}
