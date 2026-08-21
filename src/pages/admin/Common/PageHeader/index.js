import React from 'react';

/**
 * Page-level hero header used at the top of every admin screen — a big
 * serif title, a one-line description, and an actions slot on the right
 * (buttons, a page-specific stat strip, etc). Sits above the page's main
 * card/table so titles never duplicate the Table component's own smaller
 * internal header.
 */
export default function PageHeader({ title, description, actions, icon }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3.5">
        {icon && (
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-admin-primary-light text-admin-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="m-0 font-playfair text-[26px] font-semibold leading-tight tracking-[-0.03em] text-admin-text sm:text-[30px]">
            {title}
          </h1>
          {description && (
            <p className="m-0 mt-1.5 max-w-xl text-[13px] leading-relaxed text-admin-muted">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}