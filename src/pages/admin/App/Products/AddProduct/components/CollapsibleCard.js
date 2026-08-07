import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function CollapsibleCard({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/80 hover:bg-gray-50 transition-colors duration-150 rounded-xl "
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-terra/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-terra" />
            </div>
          )}
          <div className="text-left">
            <h3 className="text-sm font-semibold text-ink">{title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge != null && (
            <span className="text-[10px] font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
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
            <div className="px-5 py-4 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

