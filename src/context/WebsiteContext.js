// WebsiteContext.js
//
// Resolves the current Website from the URL and loads its configuration:
//   - branding (name, brandName, logo, favicon)
//   - theme (colors, fonts, button style, border radius)
//   - contact + social links
//   - homepage sections + banners
//   - navigation
//
// The active theme is applied to the document root as CSS variables so
// every component can consume website-specific colors/fonts without any
// website being hard-coded. When no explicit website slug is present
// (e.g. the bare / route), we fall back to the backend default website.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { storefrontApi } from '../lib/storefrontApi';

const WebsiteContext = createContext(null);

// Map a Website theme object into CSS custom properties used by Tailwind
// arbitrary-value utilities (e.g. text-[var(--vf-primary)]).
const PREVIEW_TOKENS = {
  primaryColor: '--vf-primary',
  secondaryColor: '--vf-secondary',
  accentColor: '--vf-accent',
  backgroundColor: '--vf-background',
  textColor: '--vf-text',
  borderColor: '--vf-border',
  headingFont: '--vf-heading-font',
  bodyFont: '--vf-body-font',
  buttonStyle: '--vf-button-style',
  borderRadius: '--vf-radius',
  containerWidth: '--vf-container-width',
};

const DEFAULT_THEME = {
  primaryColor: '#a74e3e',
  secondaryColor: '#241b18',
  accentColor: '#f3c997',
  backgroundColor: '#fff9f1',
  textColor: '#241b18',
  borderColor: '#e8ddd2',
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  buttonStyle: 'rounded-full',
  borderRadius: '16px',
  containerWidth: '1280px',
};

function applyTheme(theme) {
  const merged = { ...DEFAULT_THEME, ...(theme || {}) };
  const root = document.documentElement;
  Object.entries(PREVIEW_TOKENS).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, String(merged[key] ?? ''));
  });
  // Expose a heading/branding font family token used with font-[var(...)].
  root.style.setProperty('--vf-heading-font-family', merged.headingFont);
  root.style.setProperty('--vf-body-font-family', merged.bodyFont);
  return merged;
}

// Build a navigation tree (root items with nested children) from the flat
// items list returned by the storefront navigation endpoint.
function buildNavTree(items = []) {
  const byId = {};
  const roots = [];
  items.forEach((item) => {
    byId[String(item._id)] = { ...item, children: [] };
  });
  Object.values(byId).forEach((item) => {
    const parentId = item.parent ? String(item.parent) : null;
    if (parentId && byId[parentId] && parentId !== item.id) {
      byId[parentId].children.push(item);
    } else {
      roots.push(item);
    }
  });
  const sort = (list) => list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const sortDeep = (list) => {
    sort(list);
    list.forEach((n) => sortDeep(n.children));
    return list;
  };
  return sortDeep(roots);
}

export function WebsiteProvider({ children }) {
  const { websiteSlug } = useParams();
  const location = useLocation();

  const [website, setWebsite] = useState(null);
  const [sections, setSections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve the effective website slug. Priorities:
  //   1. /store/:websiteSlug route param
  //   2. /store/:slug prefix in a non-param path (defensive)
  //   3. fall back to the backend default website (omit slug → resolves default)
  const slugFromPath = location.pathname.match(/^\/store\/([^/]+)/);
  const effectiveSlug = websiteSlug || (slugFromPath ? slugFromPath[1] : undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If we have an explicit slug, fetch that website's home config.
      // If not, the backend resolveWebsite falls back to the default website.
      const slug = effectiveSlug || 'default';
      const res = await storefrontApi.home(slug);
      const payload = res.data;
      setWebsite(payload?.website || null);
      setSections(payload?.sections || []);
      setBanners(payload?.banners || []);

      let nav = [];
      try {
        const navRes = await storefrontApi.navigation(slug);
        const navInfo = navRes.data || {};
        const headerNav = Array.isArray(navInfo.navigations)
          ? navInfo.navigations.find((n) => n.location === 'header') || navInfo.navigations[0]
          : null;
        if (headerNav) {
          const relevantItems = (navInfo.items || []).filter(
            (item) => item.navigation && String(item.navigation) === String(headerNav._id)
          );
          nav = buildNavTree(relevantItems);
        }
      } catch {
        nav = [];
      }
      setNavigation(nav);
    } catch (err) {
      setError(err.message || 'Failed to load website');
    } finally {
      setLoading(false);
    }
  }, [effectiveSlug]);

  useEffect(() => {
    load();
  }, [load, effectiveSlug]);

  // Apply theme whenever the website changes.
  const theme = useMemo(() => {
    const applied = website?.theme ? applyTheme(website.theme) : applyTheme(DEFAULT_THEME);
    return applied;
  }, [website]);

  // Document title + favicon from website config.
  useEffect(() => {
    if (website) {
      const brand = website.brandName || website.name || 'Store';
      document.title = website.seo?.title || `${brand} — Saree Store`;
      const favicon = website.favicon;
      if (favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = favicon;
      }
    }
  }, [website]);

  const value = useMemo(
    () => ({
      website,
      theme,
      sections,
      banners,
      navigation,
      websiteSlug: effectiveSlug || (website?.slug),
      brandName: website?.brandName || website?.name || 'VELU\u2019S FASHTOWN',
      loading,
      error,
      reload: load,
    }),
    [website, theme, sections, banners, navigation, effectiveSlug, loading, error, load]
  );

  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>;
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (!context) throw new Error('useWebsite must be used inside WebsiteProvider');
  return context;
}
