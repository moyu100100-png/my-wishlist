'use client';
import { useState } from 'react';
import Sheet from './Sheet';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (hex: string, shimmer: boolean) => void;
}

export default function ColorPickerSheet({ open, onClose, onAdd }: Props) {
  const [hex, setHex] = useState('#C9A84C');
  const [shimmer, setShimmer] = useState(false);

  const previewStyle: React.CSSProperties = {
    width: 56, height: 56, borderRadius: '50%',
    background: hex,
    border: '1px solid var(--border)',
    margin: '0 auto 12px',
    ...(shimmer ? {
      backgroundImage: 'linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.0) 45%,rgba(255,255,255,.45) 100%)',
    } : {}),
  };

  function handleHexInput(v: string) {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      (document.getElementById('cp-native') as HTMLInputElement).value = v;
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="カラーを追加">
      <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
        <div style={previewStyle} />
        <div className="flex gap-2">
          <input
            id="cp-native"
            type="color"
            value={hex}
            onChange={(e) => { setHex(e.target.value); }}
            style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2, background: 'var(--surface)' }}
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            placeholder="#000000"
            style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', fontSize: 13 }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShimmer(!shimmer)}
            style={{
              width: 40, height: 22, borderRadius: 11,
              background: shimmer ? 'var(--black)' : 'var(--greige2)',
              position: 'relative', flexShrink: 0, border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: shimmer ? 19 : 3,
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              transition: 'left .2s',
            }} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--t2)' }}>金属光沢（Gold / Silver 風）</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            style={{ flex: 1, padding: 12, borderRadius: 10, background: 'var(--greige)', fontSize: 13, cursor: 'pointer' }}
          >
            キャンセル
          </button>
          <button
            onClick={() => { onAdd(hex, shimmer); onClose(); }}
            style={{ flex: 1, padding: 12, borderRadius: 10, background: 'var(--black)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
          >
            追加する
          </button>
        </div>
      </div>
    </Sheet>
  );
}
