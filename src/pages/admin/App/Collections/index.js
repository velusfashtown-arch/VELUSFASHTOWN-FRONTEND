import React, { useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import Table from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';

function CollectionModal({ collection, onClose, onSaved }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    isActive: collection?.isActive !== false,
    isFeatured: collection?.isFeatured || false,
  });

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    setLoading(true);
    setError('');
    try {
      if (collection?.id) {
        await api.adminUpdateCollection(token, collection.id, form);
      } else {
        await api.adminCreateCollection(token, form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-paper border border-line rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full max-w-md" style={{ animation: 'admin-modal-in 0.2s ease' }}>
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(47,31,25,0.08)]">
          <h3 className="m-0 text-sm font-semibold text-ink">{collection ? 'Edit Collection' : 'Add Collection'}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-ink hover:bg-[rgba(47,31,25,0.06)] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <p className="text-[12px] text-[#c5221f] m-0">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-[0.05em] text-muted">Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="px-3 py-2 border border-line rounded text-[13px] text-ink bg-paper outline-none focus:border-terra" placeholder="e.g. Summer Collection" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-[0.05em] text-muted">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="px-3 py-2 border border-line rounded text-[13px] text-ink bg-paper outline-none focus:border-terra resize-none"
              rows={3} placeholder="Optional description..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-terra" />
              <span className="text-[13px] text-ink">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-terra" />
              <span className="text-[13px] text-ink">Featured on Homepage</span>
            </label>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="submit" disabled={loading} className="admin-btn-primary">{loading ? 'Saving...' : 'Save Collection'}</button>
            <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCollections() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const {
    rows: collections,
    loading,
    refreshing,
    pagination,
    error,
    refresh: loadCollections,
    goToPage,
    changePageSize,
    searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListCollections(token, params),
  });

  async function handleDelete(id) {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await api.adminDeleteCollection(token, id);
      await loadCollections();
      showSuccess('Collection deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete collection');
    }
  }

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  function showError(msg) {
    setLocalError(msg);
    setTimeout(() => setLocalError(''), 3000);
  }

  function openAdd() { setEditingCollection(null); setModalOpen(true); }
  function openEdit(col) { setEditingCollection(col); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingCollection(null); }

  return (
    <div>
      {success && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)] admin-toast">{success}</div>}
      {(error || localError) && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)] admin-toast">{(error || localError)}</div>}

      {modalOpen && <CollectionModal collection={editingCollection} onClose={closeModal} onSaved={() => { loadCollections(); showSuccess(editingCollection ? 'Collection updated!' : 'Collection created!'); }} />}

      <Table title="Collections" rows={collections} loading={loading} refreshing={refreshing} searchKeys={['name', 'slug']} onAdd={openAdd} addLabel="Add Collection" onRefresh={loadCollections}
        pagination={pagination} onPageChange={goToPage} onPageSizeChange={changePageSize} onServerSearch={searchTable}
        columns={[
          { key: 'name', header: 'Name', render: (collection) => <div><b>{collection.name}</b>{collection.description && <small className="block text-muted">{collection.description}</small>}</div> },
          { key: 'slug', header: 'Slug' },
          { key: 'products', header: 'Products', render: (collection) => collection.products?.length || 0 },
          { key: 'isFeatured', header: 'Featured', render: (collection) => collection.isFeatured ? 'Yes' : '—' },
          { key: 'isActive', header: 'Status', render: (collection) => collection.isActive !== false ? 'Active' : 'Inactive' },
        ]}
        rowActions={[{ label: 'Edit', onClick: openEdit }, { label: 'Delete', danger: true, onClick: (collection) => handleDelete(collection.id) }]}
      />

      <div className="hidden overflow-hidden rounded-xl border border-line bg-paper">
        <div className="flex flex-col gap-3 border-b border-[rgba(47,31,25,0.08)] px-5 py-[18px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="m-0 text-sm font-semibold text-ink">Collections</h2>
            <span className="rounded-full bg-[rgba(47,31,25,0.06)] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-muted">{collections.length} total</span>
          </div>
          <button className="admin-btn-primary w-full justify-center sm:w-auto" onClick={openAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Collection
          </button>
        </div>

        {collections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-[rgba(47,31,25,0.03)] text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3">Name</th>
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3">Slug</th>
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3">Products</th>
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3">Featured</th>
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3">Status</th>
                  <th className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col.id} className="hover:bg-[rgba(167,78,62,0.03)]">
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3">
                      <b className="text-ink">{col.name}</b>
                      {col.description && <small className="block text-[11px] text-muted truncate max-w-[200px]">{col.description}</small>}
                    </td>
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3 text-muted text-[12px] font-mono">{col.slug}</td>
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3 text-ink font-semibold">
                      {col.products?.length || 0}
                    </td>
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3">
                      {col.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#fef7e0] text-[#b47c2e]">
                          <span className="h-[6px] w-[6px] rounded-full bg-current" /> Featured
                        </span>
                      ) : <span className="text-muted text-[12px]">—</span>}
                    </td>
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${col.isActive !== false ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#f0edf5] text-[#6b4fa0]'}`}>
                        <span className="h-[6px] w-[6px] rounded-full bg-current" />
                        {col.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="border-b border-[rgba(47,31,25,0.06)] px-5 py-3 text-right">
                      <button className="admin-btn-ghost" onClick={() => openEdit(col)}>Edit</button>
                      <button className="admin-btn-ghost danger ml-1" onClick={() => handleDelete(col.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted">
            <svg className="mx-auto mb-3 h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="m-0">No collections yet. Click "Add Collection" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
