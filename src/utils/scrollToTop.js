/**
 * Resets window scroll position to the top. Use at in-page transitions
 * that don't change the URL (view swaps, tab switches, table pagination,
 * modal opens) — router-driven navigation is already handled by
 * `components/shared/ScrollToTop.js`.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
