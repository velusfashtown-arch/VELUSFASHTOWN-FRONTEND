import React from 'react';

function LogoutIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function AdminHeader({ pageTitle, onLogout, onMenuToggle }) {
  return (
    <header className="admin-header sticky top-0 z-40 flex min-w-0 items-center justify-between gap-3 border-b border-line bg-paper px-3 py-2.5 sm:px-4 sm:py-3 lg:px-7">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {/* Hamburger menu button - visible on mobile only */}
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-muted transition-colors hover:bg-[rgba(47,31,25,0.06)] hover:text-ink md:hidden"
          aria-label="Toggle sidebar menu"
        >
          <MenuIcon />
        </button>
        <h1 className="m-0 truncate font-playfair text-[17px] font-semibold tracking-[-0.03em] text-ink sm:text-[19px] lg:text-[22px]">
          {pageTitle || 'Dashboard'}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="hidden md:inline text-[11px] font-semibold text-muted tracking-[0.05em]">Admin</span>
        <button
          onClick={onLogout}
          className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-line bg-transparent px-2.5 text-[11px] font-semibold tracking-[0.05em] text-muted transition-colors hover:border-terra hover:text-terra sm:px-3 lg:px-4"
        >
          <LogoutIcon /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

