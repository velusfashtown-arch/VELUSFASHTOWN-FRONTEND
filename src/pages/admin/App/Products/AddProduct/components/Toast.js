import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const TOAST_COLORS = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
};

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = TOAST_ICONS[type] || TOAST_ICONS.info;
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed left-4 right-4 top-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg sm:left-auto sm:w-auto ${colors.bg}`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
          <span className={`text-[13px] font-medium ${colors.text}`}>{message}</span>
          <button
            type="button"
            onClick={() => { setIsVisible(false); setTimeout(onClose, 200); }}
            className={`p-0.5 rounded hover:bg-black/5 transition-colors ${colors.text}`}
          >
            <FiX className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

