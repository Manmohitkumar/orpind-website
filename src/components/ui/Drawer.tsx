'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export default function Drawer({ open, onClose, title, children, side = 'right', className = '' }: DrawerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  const slideClass = side === 'right' ? 'right-0 animate-drawer-in' : 'left-0';
  const slideOutClass = side === 'right' ? 'translate-x-full' : '-translate-x-full';

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className={`absolute top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-soft-xl overflow-y-auto ${slideClass} ${className}`}>
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-beige-100">
                <h2 className="text-xl font-display font-bold text-green-700">{title}</h2>
                <button onClick={onClose} className="p-2 text-green-700 hover:bg-beige-100 rounded-sm transition-colors" aria-label="Close drawer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
