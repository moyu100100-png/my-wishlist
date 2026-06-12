'use client';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function Sheet({ open, onClose, title, children, rightAction }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(26,24,20,.42)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="sheet-enter w-full overflow-y-auto rounded-t-[18px] pb-safe"
        style={{ background: 'var(--ivory)', maxHeight: '92vh' }}
      >
        <div className="mx-auto mt-3 h-1 w-9 rounded-full" style={{ background: 'var(--greige)' }} />
        {title && (
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: 'var(--border2)' }}>
            <span className="font-serif text-[18px] font-normal tracking-[.03em]">{title}</span>
            <div className="flex items-center gap-3">
              {rightAction}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] transition-colors"
                style={{ color: 'var(--t2)' }}
              >
                &#x2715;
              </button>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
