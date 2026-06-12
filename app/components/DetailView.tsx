'use client';
import { useState, useEffect } from 'react';
import { store, WishItem, CollectionItem, fmt } from '@/lib/store';
import { swatchStyle } from './SwatchGrid';
import StarRating from './StarRating';
import PriceChart from './PriceChart';
import Sheet from './Sheet';

interface Props {
  itemId: string | null;
  onClose: () => void;
  onEdit: (item: WishItem) => void;
  onUpdate: () => void;
}

export default function DetailView({ itemId, onClose, onEdit, onUpdate }: Props) {
  const [item, setItem] = useState<WishItem | CollectionItem | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [puOpen, setPuOpen] = useState(false);
  const [puPrice, setPuPrice] = useState('');
  const [collectOpen, setCollectOpen] = useState(false);
  const [cPrice, setCPrice] = useState('');
  const [cDate, setCDate] = useState('');

  useEffect(() => {
    if (!itemId) { setItem(null); return; }
    const found = store.getItems().find(i => i.id === itemId) || store.getColls().find(i => i.id === itemId);
    setItem(found || null);
    setImgIdx(0);
  }, [itemId]);

  if (!item) return null;

  const isColl = !!store.getColls().find(i => i.id === item.id);
  const collItem = isColl ? (item as CollectionItem) : null;
  const colorDef = store.getColors().find(c => c.hex === item.color) || { hex: item.color, shimmer: false };
  const priceUp = item.currentPrice && item.currentPrice !== item.price;

  // Collection stats
  let days = 0, diff = 0, perDay = 0;
  if (collItem) {
    const purDate = new Date(collItem.purchaseDate);
    days = Math.max(1, Math.round((Date.now() - purDate.getTime()) / 86400000));
    diff = collItem.price - collItem.purchasePrice;
    perDay = Math.round(collItem.purchasePrice / days);
  }

  function confirmPU() {
    const p = parseInt(puPrice) || 0;
    const today = new Date().toISOString().slice(0, 10);
    const arr = store.getItems().find(i => i.id === item!.id) ? store.getItems() : store.getColls();
    const idx = arr.findIndex(i => i.id === item!.id);
    if (idx === -1) return;
    const it = arr[idx];
    if (!it.priceHistory.length) it.priceHistory = [{ price: it.price, date: it.date }];
    it.priceHistory.push({ price: p, date: today });
    it.currentPrice = p;
    if (store.getItems().find(i => i.id === it.id)) store.saveItems(store.getItems());
    else store.saveColls(store.getColls());
    setItem({ ...it });
    setPuOpen(false);
    onUpdate();
  }

  function confirmCollect() {
    if (!cDate) { alert('購入日を入力してください'); return; }
    const items = store.getItems();
    const idx = items.findIndex(i => i.id === item!.id);
    if (idx === -1) return;
    const newColl: CollectionItem = { ...items[idx], purchasePrice: parseInt(cPrice) || 0, purchaseDate: cDate };
    const colls = store.getColls();
    colls.unshift(newColl);
    items.splice(idx, 1);
    store.saveItems(items);
    store.saveColls(colls);
    setCollectOpen(false);
    onUpdate();
    onClose();
  }

  const td1: React.CSSProperties = { color: 'var(--t2)', fontSize: 13, width: 90, paddingTop: 10, verticalAlign: 'top' };
  const td2: React.CSSProperties = { fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 };

  return (
    <>
      <div className="fixed inset-0 z-[100] overflow-y-auto flex flex-col" style={{ background: 'var(--ivory)' }}>
        {/* Image */}
        <div style={{ position: 'relative', background: 'var(--ivory2)', flexShrink: 0 }}>
          {item.images.length ? (
            <img src={item.images[imgIdx]} alt={item.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 13, letterSpacing: '.18em', color: 'var(--t3)' }}>
              NO IMAGE
            </div>
          )}
          {/* top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(to bottom,rgba(249,247,242,.88),transparent)' }}>
            <button onClick={onClose} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(249,247,242,.88)', color: 'var(--t1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button onClick={() => onEdit(item)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(249,247,242,.88)', color: 'var(--t1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
          {/* image dots */}
          {item.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
              {item.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: 5, height: 5, borderRadius: '50%', background: i === imgIdx ? 'var(--black)' : 'rgba(26,24,20,.22)', border: 'none', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px 18px 48px', flex: 1 }}>
          {isColl ? (
            // Collection detail — matches design image
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 400, lineHeight: 1.2 }}>{item.brand}</div>
                  <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 2 }}>{item.name}</div>
                </div>
                <span style={{ fontSize: 20, color: 'var(--t3)' }}>♡</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                <tbody>
                  <tr><td style={td1}>購入日</td><td style={td2}>{collItem!.purchaseDate}</td></tr>
                  <tr><td style={td1}>購入価格</td><td style={td2}>{fmt(collItem!.purchasePrice)}</td></tr>
                  <tr><td style={td1}>登録価格</td><td style={td2}>{fmt(item.price)}</td></tr>
                </tbody>
              </table>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border2)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                {[
                  { label: '差額', val: fmt(diff), cls: diff >= 0 ? '#2D6B42' : '#8B3A3A' },
                  { label: '保有日数', val: `${days}日`, cls: 'var(--t1)' },
                  { label: '1日あたりのコスト', val: fmt(perDay), cls: 'var(--t1)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--ivory2)', padding: '12px 8px', textAlign: 'left' }}>
                    <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: '.06em', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: s.cls }}>{s.val}</div>
                  </div>
                ))}
              </div>
              {item.memo && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 6 }}>Memo</div>
                  <div style={{ fontSize: 13, lineHeight: 1.8 }}>{item.memo}</div>
                </div>
              )}
              <PriceChart history={item.priceHistory} />
              <div style={{ borderTop: '1px solid var(--border2)', margin: '16px 0' }} />
              <button onClick={() => { setPuPrice(String(item.currentPrice || item.price)); setPuOpen(true); }}
                style={{ width: '100%', padding: 12, background: 'var(--ivory2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, cursor: 'pointer', marginBottom: 10 }}>
                現在価格を更新
              </button>
              <button onClick={() => { if (!confirm('削除しますか？')) return; const c = store.getColls().filter(i => i.id !== item.id); store.saveColls(c); onUpdate(); onClose(); }}
                style={{ width: '100%', padding: 12, background: 'none', color: '#C0392B', border: '1px solid #C0392B', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
                削除する
              </button>
            </>
          ) : (
            // Wish detail
            <>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, letterSpacing: '.02em', marginBottom: 4 }}>{item.brand}</div>
              <div style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 12 }}>{item.name}</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 300 }}>{fmt(item.currentPrice || item.price)}</div>
                {priceUp && <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>登録時 {fmt(item.price)} <span style={{ color: '#8B3A3A' }}>+{fmt(item.currentPrice! - item.price)}</span></div>}
              </div>
              <StarRating value={item.priority} readonly size={18} />
              <div style={{ borderTop: '1px solid var(--border2)', margin: '16px 0' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td style={td1}>カテゴリ</td><td style={td2}>{item.cat || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td style={td1}>カラー</td>
                    <td style={td2}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 13, height: 13, borderRadius: '50%', ...swatchStyle(colorDef), display: 'inline-block', flexShrink: 0 }} />
                        {item.color}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td style={td1}>登録価格</td><td style={td2}>{fmt(item.price)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td style={td1}>現在価格</td>
                    <td style={td2}>
                      {item.currentPrice ? fmt(item.currentPrice) : '—'}
                      <button onClick={() => { setPuPrice(String(item.currentPrice || item.price)); setPuOpen(true); }}
                        style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 6, textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer', background: 'none', border: 'none' }}>
                        更新
                      </button>
                    </td>
                  </tr>
                  {item.url && (
                    <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                      <td style={td1}>URL</td>
                      <td style={td2}><a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--t2)', textDecoration: 'underline', textUnderlineOffset: 2 }}>リンクを開く</a></td>
                    </tr>
                  )}
                  <tr>
                    <td style={td1}>登録日</td><td style={td2}>{item.date}</td>
                  </tr>
                </tbody>
              </table>
              <PriceChart history={item.priceHistory} />
              <div style={{ borderTop: '1px solid var(--border2)', margin: '16px 0' }} />
              <button onClick={() => { setCPrice(''); setCDate(new Date().toISOString().slice(0,10)); setCollectOpen(true); }}
                style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, letterSpacing: '.07em', cursor: 'pointer', marginBottom: 10 }}>
                Collection に移動する
              </button>
              {item.memo && (
                <div style={{ padding: 14, background: 'var(--ivory2)', borderRadius: 10, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
                  {item.memo}
                </div>
              )}
              <button onClick={() => { if (!confirm('削除しますか？')) return; store.saveItems(store.getItems().filter(i => i.id !== item.id)); onUpdate(); onClose(); }}
                style={{ width: '100%', padding: 12, background: 'none', color: '#C0392B', border: '1px solid #C0392B', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
                削除する
              </button>
            </>
          )}
        </div>
      </div>

      {/* Price Update Sheet */}
      <Sheet open={puOpen} onClose={() => setPuOpen(false)} title="現在価格を更新">
        <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
          <input type="number" value={puPrice} onChange={e => setPuPrice(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 14 }} />
          <button onClick={confirmPU} style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>更新する</button>
        </div>
      </Sheet>

      {/* Collect Sheet */}
      <Sheet open={collectOpen} onClose={() => setCollectOpen(false)} title="Collection へ移動">
        <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>購入日</label>
            <input type="date" value={cDate} onChange={e => setCDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>購入価格（円）</label>
            <input type="number" value={cPrice} onChange={e => setCPrice(e.target.value)} placeholder="210000"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 14 }} />
          </div>
          <button onClick={confirmCollect} style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>移動する</button>
        </div>
      </Sheet>
    </>
  );
}
