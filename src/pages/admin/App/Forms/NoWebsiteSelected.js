import React from 'react';

export default function NoWebsiteSelected({ what = 'forms' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-paper px-6 py-16 text-center">
      <p className="m-0 text-sm font-semibold text-ink">Pick a website first</p>
      <p className="m-0 max-w-sm text-[13px] text-muted">
        {`Forms belong to a specific website. Use the switcher in the top-right corner to select one, then its ${what} will show here.`}
      </p>
    </div>
  );
}
