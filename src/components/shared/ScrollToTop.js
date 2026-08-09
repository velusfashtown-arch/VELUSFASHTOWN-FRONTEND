import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Scrolls the window back to the top (both X and Y) whenever the route
 * pathname or query string changes. This covers navigation via buttons/
 * links, a full page reload on the current route, and query-string-only
 * navigation (e.g. Shop filter chips that update ?category=...).
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
