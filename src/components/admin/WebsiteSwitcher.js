// WebsiteSwitcher.js
//
// A global admin control to switch between "All Websites" and a specific
// Website. When a website is selected, relevant admin pages become
// website-scoped. The list is loaded from the backend admin API (never
// hard-coded), so new websites appear here automatically.

import React, { useEffect, useRef, useState } from 'react';
import { useAdminWebsite } from '../../context/AdminWebsiteContext';

function ChevronIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function WebsiteSwitcher() {
  const { websites, selectedWebsiteId, selectedWebsite, setSelectedWebsiteId, refreshWebsites, loading } = useAdminWebsite();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

useEffect(() => {
    refreshWebsites();
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const label = selectedWebsiteId ? selectedWebsite?.brandName || selectedWebsite?.name || 'Website' : 'All Websites';

  function select(id) {
    setSelectedWebsiteId(id);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 min-w-[120px] items-center justify-between gap-2 rounded-md border border-line bg-paper px-3 text-[11px] font-semibold tracking-[0.04em] text-ink transition-colors hover:border-terra hover:text-terra"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{loading ? 'Loading…' : label}</span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-lg border border-line bg-paper shadow-xl">
          <div className="border-b border-line bg-[#f7f0e6] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
            Select Website
          </div>
          <button
            type="button"
            onClick={() => select(null)}
            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-medium no-underline transition-colors hover:bg-[rgba(167,78,62,0.08)] ${!selectedWebsiteId ? 'text-terra font-bold' : 'text-ink'}`}
          >
            <StoreGlyph />
            All Websites
          </button>
          {websites.map((w) => {
            const isActive = String(w._id) === String(selectedWebsiteId);
            return (
              <button
                key={w._id}
                type="button"
                onClick={() => select(w._id)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-medium no-underline transition-colors hover:bg-[rgba(167,78,62,0.08)] ${isActive ? 'text-terra font-bold' : 'text-ink'}`}
              >
                <StoreGlyph />
                <span className="truncate">{w.brandName || w.name}</span>
                {w.status !== 'active' ? <span className="ml-auto text-[9px] uppercase text-muted">{w.status}</span> : null}
              </button>
            );
          })}
          {websites.length === 0 && !loading ? (
            <div className="px-3 py-3 text-[11px] text-muted">No websites found.</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StoreGlyph() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" /><path d="M3 9v11h18V9" /><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" /><path d="M9 20v-5h6v5" />
    </svg>
  );
}
