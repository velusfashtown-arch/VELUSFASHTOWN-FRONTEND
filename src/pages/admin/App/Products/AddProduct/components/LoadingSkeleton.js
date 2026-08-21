import React from 'react';

function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[rgba(47,31,25,0.08)] rounded-lg ${className}`} />
  );
}

export default function LoadingSkeleton({ sections = 5 }) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(47,31,25,0.08)]">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-24 h-8" />
          <SkeletonBlock className="w-px h-4" />
          <SkeletonBlock className="w-40 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-28 h-8" />
          <SkeletonBlock className="w-28 h-8" />
        </div>
      </div>

      {/* Card skeletons */}
      {Array.from({ length: sections }).map((_, i) => (
        <div key={i} className="bg-paper rounded-xl border border-[rgba(47,31,25,0.1)] overflow-hidden">
          <div className="px-5 py-4 bg-[rgba(47,31,25,0.02)]">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-8 h-8 rounded-lg" />
              <SkeletonBlock className="w-32 h-4" />
            </div>
          </div>
          <div className="px-5 py-4 border-t border-[rgba(47,31,25,0.08)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <SkeletonBlock className="w-20 h-3" />
                  <SkeletonBlock className="w-full h-9" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

