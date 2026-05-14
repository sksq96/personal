import React from 'react';

export function Callout({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      style={{ backgroundColor: '#dee2e6' }}
      className="flex items-center gap-3 rounded-lg text-black border border-black/5 shadow-sm px-4 py-3 dark:bg-neutral-900/40! dark:text-inherit dark:backdrop-blur-md dark:border-white/15 dark:shadow-none"
    >
      {icon && <span className="text-xl shrink-0">{icon}</span>}
      <div className="flex-grow">{children}</div>
    </div>
  );
}