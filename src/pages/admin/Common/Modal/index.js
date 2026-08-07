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
        className={`flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-[0_8px_32px_rgba(0,0,0,0.12)] sm:max-h-[88vh] sm:rounded-xl ${sizeClasses[size] || sizeClasses.md} animate-modal-in`}
        style={{ animation: 'admin-modal-in 0.2s ease' }}
      >
        {/* Header */}
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[rgba(47,31,25,0.08)] px-4 py-4 sm:px-5 sm:py-[18px]">
            <h3 className="m-0 min-w-0 text-base font-semibold text-ink sm:text-lg">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(47,31,25,0.08)] text-muted transition-colors hover:bg-[rgba(47,31,25,0.06)] hover:text-ink"
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
          <div className="shrink-0 border-t border-[rgba(47,31,25,0.08)] bg-[rgba(250,245,239,0.55)] px-4 py-3 sm:rounded-b-xl sm:px-5 sm:py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

