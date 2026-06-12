'use client';
import { useState, useEffect, useCallback } from 'react';
import { store, Board, WishItem, CollectionItem, uid } from '@/lib/store';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';

type Layout = 1 | 2 | 4 | 9;

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [allItems, setAllItems] = useState<(WishItem | CollectionItem)[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [bTitle, setBTitle] = useState('');
  const [bLayout, setBLayout] = useState<Layout>(4);
  const [bSel, setBSel] = useState<string[]>([]);

  const reload = useCallback(() => {
    setBoards(store.getBoards());
    setAllItems([...store.getItems(), ...store.getColls()]);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  function openCreate() {
    setBTitle(''); setBLayout(4); setBSel([]);
    setCreateOpen(true);
  }

  function toggleSel(id: string) {
    setBSel(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= bLayout) { alert(`このレイアウトは最大 ${bLayout} 枚です`); return prev; }
      return [...prev, id];
    });
  }

  function submitBoard() {
    const title = bTitle.trim() || 'My Board';
    const next = [{ id: uid(), title, layout: bLayout, itemIds: [...bSel] }, ...boards];
    store.saveBoards(next); setBoards(next); setCreateOpen(false);
  }

  function deleteBoard(id: string) {
    if (!confirm('削除しますか？')) return;
    const next = boards.filter(b => b.id !== id);
    store.saveBoards(next); setBoards(next);
  }

  const previewBoard = previewId ? boards.find(b => b.id === previewId) : null;

  const gStyle = (n: Layout): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: n === 9 ? 'repeat(3,1fr)' : n >= 2 ? 'repeat(2,1fr)' : '1fr',
    gap: 3,
  });

  function CellImg({ id, small }: { id?: string; small?: boolean }) {
    const item = id ? allItems.find(i => i.id === id) : null;
    const size = small ? { width: '100%', aspectRatio: '1' } : { width: '100%', aspectRatio: '1' };
    return (
      <div style={{ ...size, background: 'var(--ivory2)', overflow: 'hidden', borderRadius: small ? 5 : 0 }}>
        {item?.images.length ? (
          <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--t3)' }}>
            {item?.brand.slice(0, 3).toUpperCase() || ''}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--ivory)', borderBottom: '1px solid var(--border2)', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 400, letterSpacing: '.06em' }}>Boards</span>
        <button onClick={openCreate} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--t2)', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 90px' }}>
        {!boards.length ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--t3)' }}>
            <p style={{ fontSize: 13, lineHeight: 2.2 }}>まだ Board がありません。<br />+ ボタンで作成しましょう。</p>
          </div>
        ) : (
          boards.map(b => (
            <div key={b.id} onClick={() => setPreviewId(b.id)}
              style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 14, overflow: 'hidden', marginBottom: 12, cursor: 'pointer' }}>
              <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 400 }}>{b.title}</span>
                <button onClick={e => { e.stopPropagation(); deleteBoard(b.id); }} style={{ color: 'var(--t3)', fontSize: 14, cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ ...gStyle(b.layout), padding: '0 12px 14px' }}>
                {Array.from({ length: b.layout }, (_, i) => (
                  <CellImg key={i} id={b.itemIds[i]} small />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />

      {/* Create Board Sheet */}
      <Sheet open={createOpen} onClose={() => setCreateOpen(false)} title="Board を作成">
        <div className="flex flex-col gap-4 px-5 pb-10 pt-4">
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>タイトル</label>
            <input value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="2026 Wishlist"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>レイアウト</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([1, 2, 4, 9] as Layout[]).map(n => (
                <button key={n} onClick={() => { setBLayout(n); setBSel(prev => prev.slice(0, n)); }}
                  style={{ flex: 1, padding: '9px 4px', borderRadius: 10, border: bLayout === n ? '2px solid var(--black)' : '1px solid var(--border)', background: bLayout === n ? 'var(--ivory2)' : 'none', fontSize: 12, cursor: 'pointer', color: bLayout === n ? 'var(--t1)' : 'var(--t2)', fontWeight: bLayout === n ? 500 : 300 }}>
                  {n === 1 ? '1' : n === 2 ? '1×2' : n === 4 ? '2×2' : '3×3'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>
              アイテムを選択（{bSel.length} / {bLayout}）
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {allItems.map(item => (
                <div key={item.id} onClick={() => toggleSel(item.id)}
                  style={{ border: bSel.includes(item.id) ? '2px solid var(--black)' : '2px solid transparent', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: 'var(--surface)' }}>
                  <div style={{ aspectRatio: '1', background: 'var(--ivory2)', overflow: 'hidden' }}>
                    {item.images.length ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--t3)' }}>{item.brand.slice(0, 3).toUpperCase()}</div>
                    )}
                  </div>
                  <div style={{ padding: '6px 8px 8px' }}>
                    <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--t2)', textTransform: 'uppercase' }}>{item.brand}</div>
                    <div style={{ fontSize: 11, color: 'var(--t1)' }}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={submitBoard}
            style={{ width: '100%', padding: 13, background: 'var(--black)', color: '#fff', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
            作成する
          </button>
        </div>
      </Sheet>

      {/* Board Preview */}
      {previewBoard && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--ivory)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <button onClick={() => setPreviewId(null)} style={{ position: 'absolute', top: 14, left: 14, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--t1)', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300, letterSpacing: '.1em', marginBottom: 24 }}>
            {previewBoard.title}
          </div>
          <div style={{ ...gStyle(previewBoard.layout), width: '100%' }}>
            {Array.from({ length: previewBoard.layout }, (_, i) => {
              const item = allItems.find(x => x.id === previewBoard.itemIds[i]);
              return (
                <div key={i} style={{ aspectRatio: '1', background: 'var(--ivory2)', overflow: 'hidden' }}>
                  {item?.images.length ? <img src={item.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
