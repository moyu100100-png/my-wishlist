'use client';
import { useState, useEffect, useRef } from 'react';
import { store, WishItem, uid } from '@/lib/store';
import Sheet from './Sheet';
import SwatchGrid from './SwatchGrid';
import StarRating from './StarRating';

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: WishItem | null;
  onSave: () => void;
}

export default function AddItemSheet({ open, onClose, editItem, onSave }: Props) {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [cat, setCat] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [priority, setPriority] = useState(3);
  const [images, setImages] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCats(store.getCats());
      setColors(store.getColors());
      if (editItem) {
        setBrand(editItem.brand);
        setName(editItem.name);
        setCat(editItem.cat);
        setColor(editItem.color);
        setPrice(String(editItem.price || ''));
        setUrl(editItem.url || '');
        setMemo(editItem.memo || '');
        setPriority(editItem.priority || 3);
        setImages(editItem.images || []);
      } else {
        setBrand(''); setName(''); setCat(''); setColor('');
        setPrice(''); setUrl(''); setMemo(''); setPriority(3); setImages([]);
      }
    }
  }, [open, editItem]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setImages(prev => [...prev, ev.target?.result as string]);
      r.readAsDataURL(f);
    });
    e.target.value = '';
  }

  function submit() {
    if (!brand.trim() || !name.trim()) { alert('ブランドと商品名は必須です'); return; }
    const data = {
      brand: brand.trim(), name: name.trim(), cat: cat || cats[0],
      color, price: parseInt(price) || 0, url: url.trim(),
      memo: memo.trim(), priority, images,
    };
    if (editItem) {
      const items = store.getItems();
      const colls = store.getColls();
      const ii = items.findIndex(i => i.id === editItem.id);
      if (ii !== -1) { items[ii] = { ...items[ii], ...data }; store.saveItems(items); }
      else {
        const ci = colls.findIndex(i => i.id === editItem.id);
        if (ci !== -1) { colls[ci] = { ...colls[ci], ...data }; store.saveColls(colls); }
      }
    } else {
      const items = store.getItems();
      items.unshift({ id: uid(), currentPrice: null, priceHistory: [], date: new Date().toISOString().slice(0,10), ...data });
      store.saveItems(items);
    }
    onSave(); onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
    borderRadius: 10, background: 'var(--surface)', fontSize: 14,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em',
    color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6,
  };

  return (
    <Sheet open={open} onClose={onClose} title={editItem ? 'アイテムを編集' : 'アイテムを登録'}>
      <div className="flex flex-col gap-4 px-5 pb-10 pt-4">
        {/* Images */}
        <div>
          <label style={labelStyle}>画像</label>
          <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleFiles} className="hidden" />
          {!images.length ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: '1.5px dashed var(--border)', borderRadius: 14, padding: 20, textAlign: 'center', cursor: 'pointer', background: 'var(--ivory2)', color: 'var(--t3)', fontSize: 12 }}
            >
              タップして画像を追加（複数可）
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(26,24,20,.6)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                style={{ width: 64, height: 64, border: '1.5px dashed var(--border)', borderRadius: 8, color: 'var(--t3)', fontSize: 22, flexShrink: 0 }}>
                +
              </button>
            </div>
          )}
        </div>

        {/* Brand + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>ブランド *</label>
            <input style={inputStyle} value={brand} onChange={e => setBrand(e.target.value)} placeholder="Cartier" />
          </div>
          <div>
            <label style={labelStyle}>カテゴリ</label>
            <select style={inputStyle} value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}>商品名 *</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="LOVE Ring" />
        </div>

        {/* Color */}
        <div>
          <label style={labelStyle}>カラー</label>
          <SwatchGrid colors={colors} selected={color} onSelect={setColor} />
        </div>

        {/* Price */}
        <div>
          <label style={labelStyle}>価格（円）</label>
          <input style={inputStyle} type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="238000" />
        </div>

        {/* Priority */}
        <div>
          <label style={labelStyle}>Priority</label>
          <StarRating value={priority} onChange={setPriority} />
        </div>

        {/* URL */}
        <div>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        </div>

        {/* Memo */}
        <div>
          <label style={labelStyle}>Memo</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical', lineHeight: 1.7 }} value={memo} onChange={e => setMemo(e.target.value)} placeholder="30歳記念、昇進祝い、値上げ前に…" />
        </div>

        <button onClick={submit} style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, letterSpacing: '.07em', cursor: 'pointer' }}>
          {editItem ? '更新する' : '登録する'}
        </button>
        {editItem && (
          <button
            onClick={() => {
              if (!confirm('削除しますか？')) return;
              const items = store.getItems().filter(i => i.id !== editItem.id);
              store.saveItems(items);
              const colls = store.getColls().filter(i => i.id !== editItem.id);
              store.saveColls(colls);
              onSave(); onClose();
            }}
            style={{ width: '100%', padding: 12, background: 'none', color: '#C0392B', border: '1px solid #C0392B', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
          >
            削除する
          </button>
        )}
      </div>
    </Sheet>
  );
}
