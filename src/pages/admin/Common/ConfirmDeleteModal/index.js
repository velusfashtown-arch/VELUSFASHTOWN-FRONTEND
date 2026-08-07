import React from 'react';
import AdminModal from '../Modal';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  itemName = 'this record',
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      size="md"
      title={null}
      closeOnOverlay={!loading}
    >
      <div className="relative px-1 py-4 text-center sm:px-4 sm:py-8">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close delete confirmation"
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <h2 className="m-0 pr-8 text-3xl font-bold tracking-tight text-red-600 sm:pr-0 sm:text-4xl">Are you sure?</h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-6 text-slate-700 sm:mt-4 sm:text-lg sm:leading-7">
          Are you sure you want to delete {itemName}? Once deleted, it cannot be restored.
        </p>

        <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:mt-10 sm:flex-row">
          <button type="button" className="admin-btn-secondary w-full justify-center sm:w-auto sm:min-w-[137px]" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="admin-btn-danger w-full justify-center sm:w-auto sm:min-w-[137px]" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
