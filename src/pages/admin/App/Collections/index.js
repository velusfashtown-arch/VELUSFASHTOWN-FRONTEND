import React, { useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import AdminModal from '../../Common/Modal';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import Table from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import AdminInput from '../../Common/Form/Input';
import AdminTextarea from '../../Common/Form/Textarea';
import AdminCheckbox from '../../Common/Form/Checkbox';

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
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title={collection ? 'Edit Collection' : 'Add Collection'}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="submit" form="collection-form" disabled={loading} className="admin-btn-primary">{loading ? 'Saving...' : 'Save Collection'}</button>
          <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="collection-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-[12px] text-[#c5221f] m-0">{error}</p>}

        <AdminInput
          label="Name"
          placeholder="e.g. Summer Collection"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          required
        />

        <AdminTextarea
          label="Description"
          placeholder="Optional description..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <AdminCheckbox label="Active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
          <AdminCheckbox label="Featured on Homepage" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminCollections() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!collectionToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteCollection(token, collectionToDelete.id);
      await loadCollections();
      setCollectionToDelete(null);
      showSuccess('Collection deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete collection');
    } finally {
      setDeleting(false);
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
      {success && <div className="fixed left-4 right-4 top-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)] sm:left-auto sm:w-auto admin-toast">{success}</div>}
      {(error || localError) && <div className="fixed left-4 right-4 top-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)] sm:left-auto sm:w-auto admin-toast">{(error || localError)}</div>}

      {modalOpen && <CollectionModal collection={editingCollection} onClose={closeModal} onSaved={() => { loadCollections(); showSuccess(editingCollection ? 'Collection updated!' : 'Collection created!'); }} />}
      <ConfirmDeleteModal
        isOpen={Boolean(collectionToDelete)}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={collectionToDelete?.name ? `the collection “${collectionToDelete.name}”` : 'this collection'}
      />

      <Table title="Collections" rows={collections} loading={loading} refreshing={refreshing} searchKeys={['name', 'slug']} onAdd={openAdd} addLabel="Add Collection" onRefresh={loadCollections}
        pagination={pagination} onPageChange={goToPage} onPageSizeChange={changePageSize} onServerSearch={searchTable}
        rowKey="id"
        columns={[
          { key: 'name', header: 'Name', render: (collection) => <div><b className="text-ink">{collection.name}</b>{collection.description && <small className="block text-[11px] text-muted truncate max-w-[200px]">{collection.description}</small>}</div> },
          { key: 'slug', header: 'Slug' },
          { key: 'products', header: 'Products', render: (collection) => collection.products?.length || 0 },
          { key: 'isFeatured', header: 'Featured', render: (collection) => collection.isFeatured ? 'Yes' : '—' },
          { key: 'isActive', header: 'Status', render: (collection) => collection.isActive !== false ? 'Active' : 'Inactive' },
        ]}
        emptyMessage="No collections yet. Click Add Collection to create one."
        rowActions={[{ label: 'Edit', onClick: openEdit }, { label: 'Delete', danger: true, onClick: setCollectionToDelete }]}
      />
    </div>
  );
}
