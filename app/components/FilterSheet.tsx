'use client';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import Sheet from './Sheet';

export interface FilterState {
  cats: string[];
  colors: string[];
  brands: string[];
  priceMin: string;
  priceMax: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
}

export const defaultFilter: FilterState = {
  cats: [], colors: [], brands: [],
  priceMin: '', priceMax: '',
  dateFrom: '', dateTo: '',
  sort: 'date_new',
};

const SORT_OPTS = [
  { key: 'date_new', label: '登録が新しい順' },
  { key: 'date_old', label: '登録が古い順' },
  { key: 'price_hi', label: '価格が高い順' },
  { key: 'price_lo', label: '価格が安い順' },
  { key: 'priority', label: 'Priority順' },
  { key: 'brand',    label: 'ブランド順' },
  { key: 'category', label: 'カテゴリ順' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  current: FilterState;
  onApply: (f: FilterState) => void;
}

export default function FilterSheet({ open, onClose, current, onApply }: Props) {
  const [f, setF] = useState<FilterState>(current);
  const [cats, setCats] = useState<string[]>([]);
  const [colorDefs, setColorDefs] = useState<{ hex: string; shimmer: boolean }[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setF({ ...current });
      setCats(store.getCats());
      setColorDefs(store.getColors());
      setBrands([...new Set([...store.getItems(), ...store.getColls()].map(i => i.brand))].sort());
    }
  }, [open, current]);

  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  const chipStyle = (on: boolean): React.CSSProperties => ({
    border: on ? 'none' : '1px solid var(--border)',
    borderRadius: 20, padding: '5px 13px', fontSize: 12,
    color: on ? '#fff' : 'var(--t2)',
    background: on ? 'var(--black)' : 'none',
    cursor: 'pointer', whiteSpace: 'nowrap',
  });

  const secTitle: React.CSSProperties = {
    fontSize: 10, fontWeight: 500, letterSpacing: '.14em',
    color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 10,
  };

  const rinput: React.CSSProperties = {
    width: '100%', padding: '9px 10px', border: '1px solid var(--border)',
    borderRadius: 10, background: 'var(--surface)', fontSize: 13,
  };

  return (
    <Sheet
      open={open} onClose={onClose} title="フィルター・並び替え"
      rightAction={
        <button onClick={() => { setF(defaultFilter); onApply(defaultFilter); onClose(); }}
          style={{ fontSize: 12, color: 'var(--t2)', cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}>
          リセット
        </button>
      }
    >
      <div className="pb-8">
        {/* Sort */}
        <div style={{ padding: '14px 18px 0' }}>
          <p style={secTitle}>並び替え</p>
          {SORT_OPTS.map(s => (
            <button key={s.key}
              onClick={() => setF(prev => ({ ...prev, sort: s.key }))}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', fontSize: 14, color: 'var(--t1)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border2)' }}
            >
              {s.label}
              {f.sort === s.key && <span style={{ fontSize: 15 }}>✓</span>}
            </button>
          ))}
        </div>

        {/* Category */}
        <div style={{ padding: '14px 18px 0' }}>
          <p style={secTitle}>カテゴリ</p>
          <div className="flex flex-wrap gap-2">
            <button style={chipStyle(!f.cats.length)} onClick={() => setF(p => ({ ...p, cats: [] }))}>すべて</button>
            {cats.map(c => (
              <button key={c} style={chipStyle(f.cats.includes(c))} onClick={() => setF(p => ({ ...p, cats: toggleArr(p.cats, c) }))}>{c}</button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={{ padding: '14px 18px 0' }}>
          <p style={secTitle}>カラー</p>
          <div className="flex flex-wrap gap-2">
            {colorDefs.map(c => {
              const on = f.colors.includes(c.hex);
              return (
                <button
                  key={c.hex}
                  onClick={() => setF(p => ({ ...p, colors: toggleArr(p.colors, c.hex) }))}
                  title={c.hex}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: c.hex,
                    ...(c.shimmer ? { backgroundImage: 'linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.0) 45%,rgba(255,255,255,.45) 100%)' } : {}),
                    outline: on ? '2px solid var(--black)' : 'none',
                    outlineOffset: 3,
                    cursor: 'pointer', flexShrink: 0,
                    border: ['#FFFFFF','#E8E8E8','#C0C0C0'].includes(c.hex) ? '1px solid var(--border)' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Brand */}
        {brands.length > 0 && (
          <div style={{ padding: '14px 18px 0' }}>
            <p style={secTitle}>ブランド</p>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button key={b} style={chipStyle(f.brands.includes(b))} onClick={() => setF(p => ({ ...p, brands: toggleArr(p.brands, b) }))}>{b}</button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div style={{ padding: '14px 18px 0' }}>
          <p style={secTitle}>価格</p>
          <div className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <input style={rinput} type="number" placeholder="下限" value={f.priceMin} onChange={e => setF(p => ({ ...p, priceMin: e.target.value }))} />
            <span style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center' }}>〜</span>
            <input style={rinput} type="number" placeholder="上限" value={f.priceMax} onChange={e => setF(p => ({ ...p, priceMax: e.target.value }))} />
          </div>
        </div>

        {/* Date */}
        <div style={{ padding: '14px 18px 0' }}>
          <p style={secTitle}>登録日</p>
          <div className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <input style={rinput} type="date" value={f.dateFrom} onChange={e => setF(p => ({ ...p, dateFrom: e.target.value }))} />
            <span style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center' }}>〜</span>
            <input style={rinput} type="date" value={f.dateTo} onChange={e => setF(p => ({ ...p, dateTo: e.target.value }))} />
          </div>
        </div>

        <div style={{ padding: '14px 18px 28px' }}>
          <button onClick={() => { onApply(f); onClose(); }}
            style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, letterSpacing: '.07em', cursor: 'pointer' }}>
            この条件で表示
          </button>
        </div>
      </div>
    </Sheet>
  );
}
