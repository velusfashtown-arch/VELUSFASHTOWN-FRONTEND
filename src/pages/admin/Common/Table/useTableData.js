import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reusable hook for smooth, race-condition-safe table data loading.
 *
 * - Distinguishes INITIAL load (full skeleton) from REFRESH/search/pagination
 *   (keeps existing rows visible while fetching in the background).
 * - Protects against stale responses overwriting newer ones when the user
 *   types/filters/paginates quickly.
 * - Returns controller helpers bound to the current page/search state.
 *
 * @param {Object} options
 * @param {(params: Object) => Promise<{data: any[], pagination: Object}>} options.fetcher
 * @param {Object} [options.initialPagination]
 * @param {boolean} [options.autoLoad=true]
 */
export default function useTableData({
  fetcher,
  initialPagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  autoLoad = true,
}) {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(true); // true only for initial load
  const [refreshing, setRefreshing] = useState(false); // true for refresh/search/page change
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetcherRef = useRef(fetcher);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const load = useCallback(async (nextPage = 1, nextLimit = initialPagination.limit, searchTerm = '', { isInitial = false } = {}) => {
    const requestId = ++requestIdRef.current;

    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError('');

    try {
      const res = await fetcherRef.current({
        page: nextPage,
        limit: nextLimit,
        ...(searchTerm ? { search: searchTerm } : {}),
      });

      // Ignore stale responses (a newer request was issued meanwhile).
      if (requestId !== requestIdRef.current) return;

      setRows(res.data || []);
      setPagination(res.pagination || { page: nextPage, limit: nextLimit, total: 0, totalPages: 1 });
      hasLoadedRef.current = true;
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || 'Failed to load data');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [initialPagination.limit]);

// Initial load
  useEffect(() => {
    if (!autoLoad) return undefined;
    load(initialPagination.page, initialPagination.limit, '', { isInitial: true });
    // eslint-disable-next-line
  }, []);

  // Bound helpers (always use the latest page/search/limit)
  const refresh = useCallback(() => {
    load(pagination.page, pagination.limit, search);
  }, [load, pagination.page, pagination.limit, search]);

  const goToPage = useCallback((page) => {
    load(page, pagination.limit, search);
  }, [load, pagination.limit, search]);

  const changePageSize = useCallback((limit) => {
    load(1, limit, search);
  }, [load, search]);

  const searchTable = useCallback((searchTerm) => {
    setSearch(searchTerm);
    load(1, pagination.limit, searchTerm);
  }, [load, pagination.limit]);

  return {
    rows,
    setRows,
    pagination,
    loading,
    refreshing,
    error,
    setError,
    search,
    load,
    refresh,
    goToPage,
    changePageSize,
    searchTable,
  };
}
