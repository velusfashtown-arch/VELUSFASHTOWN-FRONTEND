// Shared Tailwind utility class strings for admin buttons.
// Extracted here so the codebase stays DRY after removing the custom
// `admin-btn-*` classes from styles.css.

export const adminBtnPrimary =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border-none bg-admin-primary px-[18px] py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-white no-underline shadow-sm transition-all duration-200 hover:bg-admin-primary-hover hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none';

export const adminBtnSecondary =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-admin-border bg-transparent px-[18px] py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-admin-muted no-underline transition-all duration-200 hover:border-admin-primary/30 hover:bg-admin-primary-light hover:text-admin-primary active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40';

export const adminBtnBack =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-admin-border bg-admin-bg px-3 py-1.5 text-[11px] font-semibold leading-none tracking-[0.04em] text-admin-muted no-underline transition-all duration-200 hover:border-admin-primary/30 hover:bg-admin-primary-light hover:text-admin-primary active:scale-[0.97]';

export const adminBtnDanger =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border-none bg-admin-danger px-[18px] py-2 text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-white no-underline transition-all duration-200 hover:bg-[#b91c1c] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40';

export const adminBtnGhost =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded border-none bg-transparent px-2.5 py-1.5 text-[10px] font-semibold leading-none tracking-[0.04em] text-admin-muted no-underline transition-colors duration-200 hover:bg-admin-primary-light hover:text-admin-primary';

export const adminToast =
  'fixed left-4 right-4 top-4 z-50 animate-admin-slide-in rounded-lg px-5 py-3 text-[13px] font-medium shadow-modal sm:left-auto sm:w-auto';