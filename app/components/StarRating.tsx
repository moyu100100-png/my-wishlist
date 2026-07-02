'use client';
interface Props{value:number;onChange?:(v:number)=>void;readonly?:boolean;size?:number;}
export default function StarRating({value,onChange,readonly=false,size=22}:Props){
  return(
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} onClick={()=>!readonly&&onChange?.(n)}
          style={{fontSize:size,color:n<=value?'#C9A84C':'var(--border)',background:'none',border:'none',cursor:readonly?'default':'pointer',lineHeight:1,padding:'2px'}}>★</button>
      ))}
    </div>
  );
}
