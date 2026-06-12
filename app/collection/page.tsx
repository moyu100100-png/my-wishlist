'use client';
import { useState, useEffect, useCallback } from 'react';
import { store, CollectionItem, fmt } from '@/lib/store';
import BottomNav from '../components/BottomNav';
import DetailView from '../components/DetailView';
import AddItemSheet from '../components/AddItemSheet';
import { WishItem } from '@/lib/store';

export default function CollectionPage() {
  const [colls, setColls] = useState<CollectionItem[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<WishItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const reload = useCallback(() => setColls(store.getColls()), []);
  useEffect(() => { reload(); }, [reload]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--ivory)', borderBottom: '1px solid var(--border2)', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 400, letterSpacing: '.06em' }}>Collection</span>
      </header>
      <div style={{ fontSize: 11, color: 'var(--t3)', padding: '8px 16px 4px', flexShrink: 0 }}>{colls.length} items</div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 90px' }}>
        {!colls.length ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--t3)' }}>
            <p style={{ fontSize: 13, lineHeight: 2.2 }}>まだ Collection がありません。<br />Wish から移動しましょう。</p>
          </div>
        ) : (
          colls.map(item => {
            const today = new Date();
            const days = Math.max(1, Math.round((today.getTime() - new Date(item.purchaseDate).getTime()) / 86400000));
            const perDay = Math.round(item.purchasePrice / days);
            const thumb = item.images.length ? item.images[0] : null;
            return (
              <div key={item.id} onClick={() => setDetailId(item.id)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 14, display: 'flex', gap: 12, padding: 12, marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--ivory2)' }}>
                  {thumb ? <img src={thumb} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, letterSpacing: '.12em', color: 'var(--t3)' }}>
                      {item.brand.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.13em', color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 2 }}>{item.brand}</div>
                  <div style={{ fontSize: 13, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                    Owned <strong style={{ color: 'var(--t1)', fontWeight: 400 }}>{days}d</strong>
                    &nbsp;&nbsp;
                    <strong style={{ color: 'var(--t1)', fontWeight: 400 }}>{fmt(perDay)}</strong> / day
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />

      <DetailView
        itemId={detailId}
        onClose={() => { setDetailId(null); reload(); }}
        onEdit={(item) => { setDetailId(null); setEditItem(item); setAddOpen(true); }}
        onUpdate={reload}
      />
      <AddItemSheet open={addOpen} onClose={() => setAddOpen(false)} editItem={editItem} onSave={reload} />
    </div>
  );
}
