export interface ColorDef { hex: string; shimmer: boolean; }
export interface PriceHistory { price: number; date: string; }
export interface WishItem {
  id: string; brand: string; name: string; cat: string; color: string;
  price: number; currentPrice: number | null; priceHistory: PriceHistory[];
  priority: number; memo: string; url: string; images: string[]; date: string;
}
export interface CollectionItem extends WishItem { purchasePrice: number; purchaseDate: string; }
export interface Board { id: string; title: string; layout: 1|2|4|9; itemIds: string[]; }
export type Theme = 'ivory'|'greige'|'pink';

export interface DisplaySettings {
  wish: { price: boolean; currentPrice: boolean; priority: boolean; url: boolean; date: boolean; memo: boolean; };
  collection: { purchaseDate: boolean; purchasePrice: boolean; price: boolean; diff: boolean; days: boolean; perDay: boolean; memo: boolean; };
}

const DEF_DISPLAY: DisplaySettings = {
  wish: { price: true, currentPrice: true, priority: true, url: true, date: true, memo: true },
  collection: { purchaseDate: true, purchasePrice: true, price: true, diff: true, days: true, perDay: true, memo: true },
};

function ld<T>(k:string,d:T):T { if(typeof window==='undefined')return d; try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} }
function sv<T>(k:string,v:T):void { if(typeof window==='undefined')return; try{localStorage.setItem(k,JSON.stringify(v));}catch{} }
export function uid():string { return Date.now().toString(36)+Math.random().toString(36).slice(2,5); }
export function fmt(n:number):string { return '¥'+Number(n).toLocaleString('ja-JP'); }

const DEF_CATS=['Ring','Necklace','Bracelet','Earrings','Watch','Bag','Shoes','Fashion','Other'];
const DEF_COLORS:ColorDef[]=[
  {hex:'#C9A84C',shimmer:true},{hex:'#C0C0C0',shimmer:true},{hex:'#E8B4B8',shimmer:true},
  {hex:'#C8956A',shimmer:true},{hex:'#2A2A2A',shimmer:false},{hex:'#8B6347',shimmer:false},
  {hex:'#C8B89A',shimmer:false},{hex:'#A8A8A8',shimmer:false},
];
const SEED_ITEMS:WishItem[]=[
  {id:'a1',brand:'Cartier',name:'LOVE Ring',cat:'Ring',color:'#C9A84C',price:238000,currentPrice:null,priceHistory:[],priority:5,memo:'30歳の誕生日に',url:'',images:[],date:'2024-01-10'},
  {id:'a2',brand:'Van Cleef & Arpels',name:'Alhambra Necklace',cat:'Necklace',color:'#C9A84C',price:632500,currentPrice:null,priceHistory:[],priority:3,memo:'お守りとして',url:'',images:[],date:'2024-02-14'},
  {id:'a3',brand:'HERMES',name:'Birkin 25',cat:'Bag',color:'#C8B89A',price:2200000,currentPrice:2450000,priceHistory:[{price:2200000,date:'2023-12-01'},{price:2450000,date:'2024-03-15'}],priority:4,memo:'一生に一度は',url:'',images:[],date:'2023-12-01'},
  {id:'a4',brand:'CHANEL',name:'Classic Flap',cat:'Bag',color:'#2A2A2A',price:1485000,currentPrice:null,priceHistory:[],priority:4,memo:'値上げ前に',url:'',images:[],date:'2024-03-10'},
];
const SEED_COLLS:CollectionItem[]=[
  {id:'c1',brand:'Cartier',name:'LOVE Bracelet',cat:'Bracelet',color:'#C9A84C',price:1001000,currentPrice:null,priceHistory:[],priority:5,memo:'記念日に購入。これからも大切に使いたい。',url:'',images:[],date:'2023-06-01',purchasePrice:950000,purchaseDate:'2024-05-20'},
];

class Store {
  getItems():WishItem[]{ const v=ld<WishItem[]|null>('wj_items',null); if(v)return v; sv('wj_items',SEED_ITEMS); return SEED_ITEMS; }
  saveItems(i:WishItem[]){ sv('wj_items',i); }
  getColls():CollectionItem[]{ const v=ld<CollectionItem[]|null>('wj_colls',null); if(v)return v; sv('wj_colls',SEED_COLLS); return SEED_COLLS; }
  saveColls(c:CollectionItem[]){ sv('wj_colls',c); }
  getBoards():Board[]{ return ld('wj_boards',[]); }
  saveBoards(b:Board[]){ sv('wj_boards',b); }
  getCats():string[]{ return ld('wj_cats',DEF_CATS); }
  saveCats(c:string[]){ sv('wj_cats',c); }
  getColors():ColorDef[]{ return ld('wj_colors',DEF_COLORS); }
  saveColors(c:ColorDef[]){ sv('wj_colors',c); }
  getTheme():Theme{ return ld('wj_theme','ivory'); }
  saveTheme(t:Theme){ sv('wj_theme',t); }
  getDisplay():DisplaySettings{ return ld('wj_display',DEF_DISPLAY); }
  saveDisplay(d:DisplaySettings){ sv('wj_display',d); }
  getBrands():string[]{
    const all=[...this.getItems(),...this.getColls()];
    return [...new Set(all.map(i=>i.brand))].filter(Boolean).sort();
  }
}
export const store = new Store();
