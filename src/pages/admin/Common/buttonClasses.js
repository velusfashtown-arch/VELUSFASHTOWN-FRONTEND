// Shared Tailwind utility class strings for admin buttons.
// Extracted here so the codebase stays DRY after removing the custom
// `admin-btn-*` classes from styles.css.

export const adminBtnPrimary =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border-none bg-terra px-[18px] py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-[#fffaf5] no-underline transition-all duration-200 hover:bg-wine active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50';

export const adminBtnSecondary =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[rgba(47,31,25,0.16)] bg-transparent px-[18px] py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-muted no-underline transition-all duration-200 hover:border-[rgba(47,31,25,0.24)] hover:bg-[rgba(47,31,25,0.06)] hover:text-ink active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40';

export const adminBtnBack =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[rgba(47,31,25,0.1)] bg-[rgba(47,31,25,0.05)] px-3 py-1.5 text-[11px] font-semibold leading-none tracking-[0.04em] text-muted no-underline transition-all duration-200 hover:border-[rgba(167,78,62,0.2)] hover:bg-[rgba(167,78,62,0.06)] hover:text-terra active:scale-[0.97]';

export const adminBtnDanger =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border-none bg-danger px-[18px] py-2 text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-white no-underline transition-all duration-200 hover:bg-[#a53232] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40';

export const adminBtnGhost =
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded border-none bg-transparent px-2.5 py-1.5 text-[10px] font-semibold leading-none tracking-[0.04em] text-muted no-underline transition-colors duration-200 hover:bg-[rgba(167,78,62,0.06)] hover:text-terra';

export const adminToast =
  'fixed left-4 right-4 top-4 z-50 animate-admin-slide-in rounded-lg px-5 py-3 text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] sm:left-auto sm:w-auto';
