import React, { useEffect, useRef } from 'react';

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  footer,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && closeOnOverlay) onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnOverlay]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  function handleOverlayClick(e) {
    if (closeOnOverlay && e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-2 sm:p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className={`flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-xl border border-admin-border bg-white shadow-modal sm:max-h-[88vh] sm:rounded-2xl ${sizeClasses[size] || sizeClasses.md} animate-admin-modal-in`}
      >
        {/* Header */}
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-admin-border px-4 py-4 sm:px-5 sm:py-[18px]">
            <h3 className="m-0 min-w-0 font-playfair text-base font-semibold tracking-[-0.02em] text-admin-text sm:text-lg">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-admin-border text-admin-muted transition-colors hover:border-admin-primary/30 hover:bg-admin-primary-light hover:text-admin-primary"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body — scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {children}
        </div>

        {/* Footer — fixed at bottom */}
        {footer !== undefined ? (
          <div className="shrink-0 border-t border-admin-border bg-admin-bg/50 px-4 py-3 sm:rounded-b-2xl sm:px-5 sm:py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}