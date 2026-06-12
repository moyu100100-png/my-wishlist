export interface ColorDef {
  hex: string;
  shimmer: boolean;
}

export interface PriceHistory {
  price: number;
  date: string;
}

export interface WishItem {
  id: string;
  brand: string;
  name: string;
  cat: string;
  color: string; // hex
  price: number;
  currentPrice: number | null;
  priceHistory: PriceHistory[];
  priority: number; // 1-5
  memo: string;
  url: string;
  images: string[]; // base64
  date: string;
}

export interface CollectionItem extends WishItem {
  purchasePrice: number;
  purchaseDate: string;
}

export interface Board {
  id: string;
  title: string;
  layout: 1 | 2 | 4 | 9;
  itemIds: string[];
}

export type Theme = 'ivory' | 'greige' | 'pink';

const KEYS = {
  items: 'wj_items',
  colls: 'wj_colls',
  boards: 'wj_boards',
  cats: 'wj_cats',
  colors: 'wj_colors',
  theme: 'wj_theme',
};

function load<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

function save<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function fmt(n: number): string {
  return '¥' + Number(n).toLocaleString('ja-JP');
}

const DEFAULT_CATS = ['Ring','Necklace','Bracelet','Earrings','Watch','Bag','Shoes','Fashion','Other'];
const DEFAULT_COLORS: ColorDef[] = [
  { hex: '#C9A84C', shimmer: true },
  { hex: '#C0C0C0', shimmer: true },
  { hex: '#E8B4B8', shimmer: true },
  { hex: '#C8956A', shimmer: true },
  { hex: '#2A2A2A', shimmer: false },
  { hex: '#8B6347', shimmer: false },
  { hex: '#C8B89A', shimmer: false },
  { hex: '#A8A8A8', shimmer: false },
];

const SEED_ITEMS: WishItem[] = [
  { id: 'a1', brand: 'Cartier', name: 'LOVE Ring', cat: 'Ring', color: '#C9A84C', price: 238000, currentPrice: null, priceHistory: [], priority: 5, memo: '30歳の誕生日に', url: '', images: [], date: '2024-01-10' },
  { id: 'a2', brand: 'Van Cleef & Arpels', name: 'Alhambra Necklace', cat: 'Necklace', color: '#C9A84C', price: 632500, currentPrice: null, priceHistory: [], priority: 3, memo: 'お守りとして', url: '', images: [], date: '2024-02-14' },
  { id: 'a3', brand: 'HERMES', name: 'Birkin 25', cat: 'Bag', color: '#C8B89A', price: 2200000, currentPrice: 2450000, priceHistory: [{ price: 2200000, date: '2023-12-01' }, { price: 2450000, date: '2024-03-15' }], priority: 4, memo: '一生に一度は', url: '', images: [], date: '2023-12-01' },
  { id: 'a4', brand: 'CHANEL', name: 'Classic Flap', cat: 'Bag', color: '#2A2A2A', price: 1485000, currentPrice: null, priceHistory: [], priority: 4, memo: '値上げ前に', url: '', images: [], date: '2024-03-10' },
];

const SEED_COLLS: CollectionItem[] = [
  { id: 'c1', brand: 'Cartier', name: 'LOVE Bracelet', cat: 'Bracelet', color: '#C9A84C', price: 1001000, currentPrice: null, priceHistory: [], priority: 5, memo: '記念日に購入。これからも大切に使いたい。', url: '', images: [], date: '2023-06-01', purchasePrice: 950000, purchaseDate: '2024-05-20' },
];

// ── Store class ──
class Store {
  getItems(): WishItem[] {
    const v = load<WishItem[] | null>(KEYS.items, null);
    if (v) return v;
    save(KEYS.items, SEED_ITEMS);
    return SEED_ITEMS;
  }
  saveItems(items: WishItem[]) { save(KEYS.items, items); }

  getColls(): CollectionItem[] {
    const v = load<CollectionItem[] | null>(KEYS.colls, null);
    if (v) return v;
    save(KEYS.colls, SEED_COLLS);
    return SEED_COLLS;
  }
  saveColls(colls: CollectionItem[]) { save(KEYS.colls, colls); }

  getBoards(): Board[] { return load(KEYS.boards, []); }
  saveBoards(boards: Board[]) { save(KEYS.boards, boards); }

  getCats(): string[] { return load(KEYS.cats, DEFAULT_CATS); }
  saveCats(cats: string[]) { save(KEYS.cats, cats); }

  getColors(): ColorDef[] { return load(KEYS.colors, DEFAULT_COLORS); }
  saveColors(colors: ColorDef[]) { save(KEYS.colors, colors); }

  getTheme(): Theme { return load(KEYS.theme, 'ivory'); }
  saveTheme(theme: Theme) { save(KEYS.theme, theme); }
}

export const store = new Store();
