import React from 'react';

// Small metric card used in page-header stat strips across the admin
// panel (Dashboard, Products, Orders, Customers, ...). `bgColor`/`iconColor`
// are raw hex/rgba so callers can reuse the same soft-tint palette the
// Dashboard already established.
export default function StatCard({ icon, label, value, sub, bgColor, iconColor, trend }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-admin-border bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: bgColor, color: iconColor }}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted">{label}</div>
        <div className="font-playfair text-[26px] font-semibold leading-none tracking-[-0.03em] text-admin-text tabular-nums">{value}</div>
        {(sub !== undefined || trend !== undefined) && (
          <div className="mt-1 flex items-center gap-2">
            {sub !== undefined && <span className="text-[11px] text-admin-muted">{sub}</span>}
            {trend !== undefined && (
              <span className={`text-[10px] font-semibold ${trend >= 0 ? 'text-admin-success' : 'text-admin-danger'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}