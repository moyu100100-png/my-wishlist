'use client';
import { useState, useEffect } from 'react';
import { store, ColorDef, Theme } from '@/lib/store';
import { swatchStyle } from './SwatchGrid';
import ColorPickerSheet from './ColorPickerSheet';

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function Drawer({ open, onClose, onUpdate }: Props) {
  const [cats, setCats] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorDef[]>([]);
  const [theme, setTheme] = useState<Theme>('ivory');
  const [newCat, setNewCat] = useState('');
  const [openSec, setOpenSec] = useState<Record<string, boolean>>({});
  const [cpOpen, setCpOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setCats(store.getCats());
      setColors(store.getColors());
      setTheme(store.getTheme());
    }
  }, [open]);

  function toggleSec(k: string) { setOpenSec(p => ({ ...p, [k]: !p[k] })); }

  function addCat() {
    const v = newCat.trim();
    if (!v) return;
    const next = [...cats, v];
    setCats(next); store.saveCats(next); setNewCat(''); onUpdate();
  }

  function rmCat(c: string) {
    if (!confirm(`「${c}」を削除しますか？`)) return;
    const next = cats.filter(x => x !== c);
    setCats(next); store.saveCats(next); onUpdate();
  }

  function addColor(hex: string, shimmer: boolean) {
    const next = [...colors, { hex, shimmer }];
    setColors(next); store.saveColors(next); onUpdate();
  }

  function rmColor(i: number) {
    if (!confirm('このカラーを削除しますか？')) return;
    const next = colors.filter((_, idx) => idx !== i);
    setColors(next); store.saveColors(next); onUpdate();
  }

  function changeTheme(t: Theme) {
    setTheme(t);
    store.saveTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }

  const brands = [...new Set([...store.getItems(), ...store.getColls()].map(i => i.brand))].sort();

  const secStyle = (k: string) => ({
    borderBottom: '1px solid var(--border2)',
  });

  const chevron = (k: string) => (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 16, height: 16, transform: openSec[k] ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <>
      {open && <div className="fixed inset-0 z-[300]" style={{ background: 'rgba(26,24,20,.35)' }} onClick={onClose} />}
      <div
        className="drawer-enter fixed right-0 top-0 bottom-0 z-[301] flex flex-col overflow-y-auto"
        style={{
          width: '82vw', maxWidth: 360,
          background: 'var(--ivory)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: open ? undefined : 'transform .28s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 pb-4 pt-14" style={{ borderColor: 'var(--border2)' }}>
          <span className="font-serif text-[20px] font-normal tracking-[.04em]">管理</span>
          <button onClick={onClose} style={{ color: 'var(--t2)', fontSize: 18 }}>&#x2715;</button>
        </div>

        {/* Categories */}
        <div style={secStyle('cats')}>
          <div className="flex cursor-pointer items-center justify-between px-5 py-3" onClick={() => toggleSec('cats')}>
            <span style={{ fontSize: 13 }}>カテゴリ</span>
            {chevron('cats')}
          </div>
          {openSec['cats'] && (
            <div className="px-5 pb-4">
              {cats.map(c => (
                <div key={c} className="flex items-center justify-between border-b py-2" style={{ borderColor: 'var(--border2)' }}>
                  <span style={{ fontSize: 13 }}>{c}</span>
                  <button onClick={() => rmCat(c)} style={{ fontSize: 11, color: '#C0392B', border: '1px solid #C0392B', borderRadius: 6, padding: '3px 9px' }}>削除</button>
                </div>
              ))}
              <div className="mt-3 flex gap-2">
                <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="新しいカテゴリ"
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 13 }} />
                <button onClick={addCat} style={{ background: 'var(--black)', color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 12 }}>追加</button>
              </div>
            </div>
          )}
        </div>

        {/* Colors */}
        <div style={secStyle('colors')}>
          <div className="flex cursor-pointer items-center justify-between px-5 py-3" onClick={() => toggleSec('colors')}>
            <span style={{ fontSize: 13 }}>カラー</span>
            {chevron('colors')}
          </div>
          {openSec['colors'] && (
            <div className="px-5 pb-4">
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                {colors.map((c, i) => (
                  <button
                    key={c.hex + i}
                    onClick={() => rmColor(i)}
                    title="タップで削除"
                    style={{
                      ...swatchStyle(c),
                      width: '100%', aspectRatio: '1', borderRadius: '50%',
                      cursor: 'pointer', position: 'relative',
                    }}
                  />
                ))}
                <button
                  onClick={() => setCpOpen(true)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: '50%',
                    border: '1.5px dashed var(--greige2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--t3)', fontSize: 20, cursor: 'pointer',
                  }}
                >
                  ⊕
                </button>
              </div>
              <p style={{ fontSize: 10, color: 'var(--t3)', marginTop: 8 }}>タップで削除</p>
            </div>
          )}
        </div>

        {/* Brands */}
        <div style={secStyle('brands')}>
          <div className="flex cursor-pointer items-center justify-between px-5 py-3" onClick={() => toggleSec('brands')}>
            <span style={{ fontSize: 13 }}>ブランド</span>
            {chevron('brands')}
          </div>
          {openSec['brands'] && (
            <div className="px-5 pb-4">
              {brands.length ? brands.map(b => (
                <div key={b} className="flex items-center gap-2 border-b py-2" style={{ borderColor: 'var(--border2)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--greige2)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13 }}>{b}</span>
                </div>
              )) : <p style={{ fontSize: 13, color: 'var(--t3)', padding: '6px 0' }}>商品登録時に自動追加されます</p>}
            </div>
          )}
        </div>

        {/* Theme */}
        <div style={secStyle('theme')}>
          <div className="flex cursor-pointer items-center justify-between px-5 py-3" onClick={() => toggleSec('theme')}>
            <span style={{ fontSize: 13 }}>テーマカラー</span>
            {chevron('theme')}
          </div>
          {openSec['theme'] && (
            <div className="flex gap-3 px-5 pb-4">
              {(['ivory','greige','pink'] as Theme[]).map(t => (
                <button
                  key={t}
                  onClick={() => changeTheme(t)}
                  style={{
                    flex: 1, padding: '10px 4px', borderRadius: 10,
                    border: theme === t ? '2px solid var(--black)' : '1px solid var(--border)',
                    background: t === 'ivory' ? '#F9F7F2' : t === 'greige' ? '#F0EBE0' : '#FBF5F2',
                    fontSize: 11, color: 'var(--t1)', cursor: 'pointer',
                  }}
                >
                  {t === 'ivory' ? 'Ivory' : t === 'greige' ? 'Greige' : 'Pink'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ColorPickerSheet open={cpOpen} onClose={() => setCpOpen(false)} onAdd={addColor} />
    </>
  );
}
