import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import AdminInput from '../Form/Input';
import Listbox from '../../../../components/shared/form/Listbox';

function getValue(value, row, index) {
  return typeof value === 'function' ? value(row, index) : value;
}

/* ─── Smooth-loading helpers ──────────────────────────────────────────── */
// Skeleton placeholder row shown while data is loading (no blank flicker).
function SkeletonRow({ colCount }) {
  const cells = Array.from({ length: colCount });
  return (
    <tr>
      {cells.map((_, i) => (
        <td key={i} className="border-b border-[rgba(47,31,25,0.04)] px-4 py-3">
          <div className="h-4 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" style={{ width: i === 0 ? '62%' : `${Math.max(30, 70 - i * 9)}%` }} />
        </td>
      ))}
    </tr>
  );
}

// Keeps a stable reference to the previous rows so the table doesn't flash
// to empty while a refresh/search is in flight.
function usePreviousRows(rows, loading) {
  const prevRef = useRef(rows);
  if (!loading && rows.length > 0) {
    prevRef.current = rows;
  }
  return loading && rows.length === 0 ? prevRef.current : rows;
}

/* Map common action labels to their icon (with a fallback) */
const ACTION_ICONS = {
  edit: PencilIcon,
  view: EyeIcon,
  delete: TrashIcon,
};

function getActionIcon(action, row, index) {
  if (action.icon) return action.icon;
  const label = String(getValue(action.label, row, index) || '').toLowerCase();
  return ACTION_ICONS[label] || Cog6ToothIcon;
}

/* Skeleton row — shown only on initial load so the first paint feels calm */
function SkeletonRows({ columns, rowCount = 5, rowActions }) {
  return (
    <>
{Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`}>
          {columns.map((column, columnIndex) => {
            const alignment = columnIndex === 0 ? 'text-left' : rowActions.length === 0 && columnIndex === columns.length - 1 ? 'text-right' : 'text-center';
            const isFirst = columnIndex === 0;
            return (
              <td key={column.key} className={`border-b border-[rgba(47,31,25,0.06)] px-4 py-2.5 ${alignment}`}>
                <span className={`inline-block h-3 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat ${isFirst ? 'w-32' : 'w-16'}`} />
                {isFirst && <span className="mt-1.5 block h-2 w-40 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" />}
              </td>
            );
          })}
          {rowActions.length > 0 && (
            <td className="border-b border-[rgba(47,31,25,0.06)] px-4 py-2.5 text-right">
              <span className="inline-block h-3 w-12 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" />
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

function TableActionButtons({ row, index, rowActions, isBusy }) {
  return rowActions.map((action) => {
    if (getValue(action.hidden, row, index)) return null;
    const label = getValue(action.label, row, index);
    const Icon = getActionIcon(action, row, index);
    return (
      <button
        key={label}
        type="button"
        title={label}
        aria-label={label}
        disabled={getValue(action.disabled, row, index) || isBusy}
        className={`ml-1 inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-[rgba(47,31,25,0.08)] bg-transparent align-middle text-muted opacity-70 transition-all duration-150 hover:scale-[1.06] hover:border-terra/25 hover:bg-terra/10 hover:text-terra hover:opacity-100 hover:shadow-[0_2px_8px_rgba(167,78,62,0.18)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 ${action.danger ? 'hover:border-[#f3d4d4] hover:bg-[#fce8e6] hover:text-danger' : ''}`}
        onClick={() => action.onClick(row, index)}
      >
        <Icon className="size-4" />
      </button>
    );
  });
}

export default function Table({
  title,
  columns = [],
  rows = [],
  rowKey = 'id',
  rowActions = [],
  emptyMessage = 'No records found.',
  searchPlaceholder = 'Search records...',
  searchable = true,
  searchKeys = [],
  onServerSearch,
  searchDelay = 600,
  loading = false,
  refreshing = false,
  onAdd,
  addLabel = 'Add New',
  onRefresh,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  skeletonRows = 5,
}) {
  const [query, setQuery] = useState('');
  const serverSearchRef = useRef(onServerSearch);
  const hasMountedSearch = useRef(false);

  useEffect(() => {
    serverSearchRef.current = onServerSearch;
  }, [onServerSearch]);

  useEffect(() => {
    if (!serverSearchRef.current) return undefined;
    if (!hasMountedSearch.current) {
      hasMountedSearch.current = true;
      return undefined;
    }
    const timeoutId = setTimeout(() => serverSearchRef.current(query.trim()), searchDelay);
    return () => clearTimeout(timeoutId);
  }, [query, searchDelay]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (onServerSearch || !normalizedQuery) return rows;

    return rows.filter((row) => searchKeys.some((key) => {
      const value = key.split('.').reduce((current, part) => current?.[part], row);
      return String(value ?? '').toLowerCase().includes(normalizedQuery);
    }));
  }, [onServerSearch, query, rows, searchKeys]);

  const currentPage = pagination?.page || 1;
  const currentLimit = pagination?.limit || rows.length || 10;
  const totalRecords = onServerSearch ? (pagination?.total ?? rows.length) : (query ? filteredRows.length : (pagination?.total ?? rows.length));
  const totalPages = Math.max(pagination?.totalPages || Math.ceil(totalRecords / currentLimit) || 1, 1);
  const startRecord = totalRecords === 0 ? 0 : ((currentPage - 1) * currentLimit) + 1;
  const endRecord = totalRecords === 0 ? 0 : Math.min(startRecord + filteredRows.length - 1, totalRecords);
  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  const showSkeleton = loading && !refreshing;
  const isBusy = loading || refreshing;

  return (
    <section className="overflow-hidden rounded-2xl border border-[rgba(47,31,25,0.1)] bg-paper shadow-[0_12px_32px_rgba(47,31,25,0.06)]">
      {/* Thin progress bar shown during background refresh/search/page change */}
{(refreshing) && (
        <div className="relative h-[3px] overflow-hidden bg-[rgba(167,78,62,0.08)]" aria-hidden="true">
          <span className="absolute left-0 top-0 h-full w-[40%] rounded-full animate-admin-progress-slide bg-[linear-gradient(90deg,transparent,#a74e3e,transparent)]" />
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-[rgba(47,31,25,0.08)] bg-[linear-gradient(115deg,rgba(255,255,255,0.92),rgba(250,245,239,0.92))] px-4 py-4 md:flex-row md:items-center md:justify-between sm:px-5 sm:py-[18px]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(167,78,62,0.1)] text-terra">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h9" strokeLinecap="round" /></svg>
          </div>
          <div className="min-w-0">
            {title && <h2 className="m-0 flex items-end justify-between truncate text-[19px] font-semibold text-ink"><span className='font-playfair'>{title}</span><span className="rounded-full ml-3 border border-[rgba(167,78,62,0.12)] bg-[rgba(167,78,62,0.08)] px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-terra">{totalRecords} total</span></h2>}
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Manage your records</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {searchable &&
            <AdminInput
              icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />}
{onAdd && <button type="button" className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md border-none bg-terra px-4 py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-[#fffaf5] no-underline transition-all duration-200 hover:bg-wine active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50" onClick={onAdd}><span className="text-base leading-none">+</span> {addLabel}</button>}
          {onRefresh && <button type="button" className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-1.5 rounded-md border border-[rgba(47,31,25,0.16)] bg-transparent px-2.5 py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-muted no-underline transition-all duration-200 hover:border-[rgba(47,31,25,0.24)] hover:bg-[rgba(47,31,25,0.06)] hover:text-ink active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40" onClick={onRefresh} disabled={isBusy} aria-label="Refresh table" title="Refresh table"><ArrowPathIcon className={`size-5 ${isBusy ? 'animate-spin' : ''}`} /></button>}
        </div>
      </div>
      <div className="space-y-3 p-3 md:hidden">
{showSkeleton && Array.from({ length: skeletonRows }).map((_, index) => (
          <div key={`mobile-skeleton-${index}`} className="rounded-xl border border-[rgba(47,31,25,0.08)] p-4">
            <span className="block h-4 w-1/2 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" />
            <span className="mt-4 block h-3 w-full animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" />
            <span className="mt-2 block h-3 w-3/4 animate-admin-shimmer rounded-md bg-[linear-gradient(90deg,rgba(47,31,25,0.06)_25%,rgba(167,78,62,0.10)_37%,rgba(47,31,25,0.06)_63%)] bg-[length:800px_100%] bg-no-repeat" />
          </div>
        ))}
        {!showSkeleton && !isBusy && filteredRows.map((row, index) => (
          <article key={typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey]} className="rounded-xl border border-[rgba(47,31,25,0.08)] bg-white p-4 shadow-[0_4px_14px_rgba(47,31,25,0.04)]">
            {columns.length > 0 && (() => {
              const primaryColumn = columns[0];
              const primaryValue = primaryColumn.render ? primaryColumn.render(row, index) : row[primaryColumn.key];
              return <div className="min-w-0 text-[15px] text-ink">{primaryValue ?? 'â€”'}</div>;
            })()}
            {columns.length > 1 && <dl className="m-0 mt-4 space-y-3 border-t border-[rgba(47,31,25,0.08)] pt-3">
              {columns.slice(1).map((column) => {
                const value = column.render ? column.render(row, index) : row[column.key];
                return (
                  <div key={column.key} className="flex items-center justify-between gap-4 text-[12px]">
                    <dt className="font-bold uppercase tracking-[0.07em] text-muted">{column.header}</dt>
                    <dd className="m-0 min-w-0 break-words text-right text-ink">{value ?? 'â€”'}</dd>
                  </div>
                );
              })}
            </dl>}
            {rowActions.length > 0 && <div className="mt-4 flex justify-end border-t border-[rgba(47,31,25,0.08)] pt-3"><TableActionButtons row={row} index={index} rowActions={rowActions} isBusy={isBusy} /></div>}
          </article>
        ))}
        {!showSkeleton && !isBusy && filteredRows.length === 0 && <p className="m-0 py-8 text-center text-sm text-muted">{emptyMessage}</p>}
      </div>
<div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-[linear-gradient(115deg,rgba(255,255,255,0.95),rgba(250,245,239,0.95))] text-left text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
              {columns.map((column, columnIndex) => {
                const alignment = columnIndex === 0 ? 'text-left' : rowActions.length === 0 && columnIndex === columns.length - 1 ? 'text-right' : 'text-center';
                return <th key={column.key} className={`border-b-2 border-[rgba(47,31,25,0.09)] px-4 py-3.5  ${alignment} ${column.headerClassName || ''}`}>{column.header}</th>;
              })}
              {rowActions.length > 0 && <th className="sticky right-0 z-20 border-b-2 border-[rgba(47,31,25,0.09)] bg-[#f8f3ee] px-4 py-3.5 text-right shadow-[-8px_0_14px_rgba(47,31,25,0.04)]">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? <SkeletonRows columns={columns} rowCount={skeletonRows} rowActions={rowActions} /> : null}
{!showSkeleton && !isBusy && filteredRows.map((row, index) => (
              <tr key={typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey]} className="group animate-admin-row-fade bg-white transition-all duration-150 hover:bg-[rgba(167,78,62,0.04)] hover:shadow-[inset_3px_0_0_#a74e3e]">
                {columns.map((column, columnIndex) => {
                  const value = column.render ? column.render(row, index) : row[column.key];
                  const alignment = columnIndex === 0 ? 'text-left' : rowActions.length === 0 && columnIndex === columns.length - 1 ? 'text-right' : 'text-center';
                  return <td key={column.key} className={`border-b border-[rgba(47,31,25,0.07)] px-4 py-3.5 capitalize text-ink ${alignment} ${column.cellClassName || ''}`}>{value ?? '—'}</td>;
                })}
                {rowActions.length > 0 && <td className="sticky right-0 z-10 border-b border-[rgba(47,31,25,0.07)] bg-white px-4 py-3.5 text-right transition-colors group-hover:bg-[#fdf9f4]"><TableActionButtons row={row} index={index} rowActions={rowActions} isBusy={isBusy} /></td>}
              </tr>
            ))}
            {!showSkeleton && !isBusy && filteredRows.length === 0 && <tr><td colSpan={columns.length + (rowActions.length ? 1 : 0)} className="px-4 py-16 text-center text-muted"><span className="mx-auto flex max-w-xs flex-col items-center gap-2"><svg className="h-9 w-9 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16" /></svg><span className="text-[13px]">{emptyMessage}</span></span></td></tr>}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex flex-col gap-3 border-t border-[rgba(47,31,25,0.08)] bg-[rgba(250,245,239,0.55)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="m-0 text-[12px] text-muted">Showing <span className="font-semibold text-ink">{startRecord}-{endRecord}</span> of <span className="font-semibold text-ink">{totalRecords}</span> records</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-[12px] text-muted">
              Rows
<Listbox
                value={{ value: currentLimit, label: String(currentLimit) }}
                onChange={(option) => onPageSizeChange?.(Number(option?.value))}
                data={pageSizeOptions.map((size) => ({ value: size, label: String(size) }))}
                size="sm"
                disabled={isBusy}
                classNames={{ root: 'min-w-[70px]' }}
              />
            </label>
<button type="button" onClick={() => onPageChange?.(currentPage - 1)} disabled={isBusy || currentPage <= 1} className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-md border border-[rgba(47,31,25,0.16)] bg-transparent px-2.5 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-muted no-underline transition-all duration-200 hover:border-[rgba(47,31,25,0.24)] hover:bg-[rgba(47,31,25,0.06)] hover:text-ink active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45">Previous</button>
            <span className="text-[12px] font-medium text-muted sm:hidden">{currentPage} / {totalPages}</span>
            <div className="hidden items-center gap-1 sm:flex">
              {pageNumbers.map((pageNumber) => <button key={pageNumber} type="button" onClick={() => onPageChange?.(pageNumber)} disabled={isBusy} className={`min-h-[32px] min-w-[32px] rounded-md px-2 text-[12px] font-semibold transition-colors ${pageNumber === currentPage ? 'bg-terra text-white shadow-[0_3px_8px_rgba(167,78,62,0.25)]' : 'border border-[rgba(47,31,25,0.12)] bg-white text-ink hover:border-terra hover:text-terra'} disabled:cursor-not-allowed disabled:opacity-45`}>{pageNumber}</button>)}
            </div>
<button type="button" onClick={() => onPageChange?.(currentPage + 1)} disabled={isBusy || currentPage >= totalPages} className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-md border border-[rgba(47,31,25,0.16)] bg-transparent px-2.5 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-muted no-underline transition-all duration-200 hover:border-[rgba(47,31,25,0.24)] hover:bg-[rgba(47,31,25,0.06)] hover:text-ink active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45">Next</button>
          </div>
        </div>
      )}
    </section>
  );
}
