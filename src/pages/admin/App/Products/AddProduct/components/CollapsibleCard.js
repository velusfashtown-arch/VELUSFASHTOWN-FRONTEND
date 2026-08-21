import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function CollapsibleCard({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-paper rounded-xl border border-[rgba(47,31,25,0.1)] shadow-[0_12px_32px_rgba(47,31,25,0.06)] transition-shadow duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 bg-[rgba(47,31,25,0.02)] hover:bg-[rgba(47,31,25,0.04)] transition-colors duration-150 rounded-xl min-h-[52px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-8 h-8 shrink-0 rounded-lg bg-terra/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-terra" />
            </div>
          )}
          <div className="text-left min-w-0">
            <h3 className="truncate font-playfair text-sm font-semibold text-ink">{title}</h3>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge != null && (
            <span className="text-[10px] font-bold tracking-[0.05em] text-muted bg-[rgba(47,31,25,0.06)] px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          <div className="w-6 h-6 rounded-full bg-paper border border-[rgba(47,31,25,0.1)] flex items-center justify-center">
            {isOpen ? (
              <FiChevronUp className="w-3.5 h-3.5 text-muted" />
            ) : (
              <FiChevronDown className="w-3.5 h-3.5 text-muted" />
            )}
          </div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className=""
          >
            <div className="px-4 py-4 sm:px-5 border-t border-[rgba(47,31,25,0.08)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

