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
import { adminBtnPrimary, adminBtnSecondary, adminToast } from '../../Common/buttonClasses';
import PageHeader from '../../Common/PageHeader';

function CollectionsIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
}

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
          <button type="submit" form="collection-form" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Save Collection'}</button>
          <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="collection-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-[12px] text-admin-danger m-0">{error}</p>}

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
      <PageHeader
        icon={<CollectionsIcon />}
        title="Collections"
        description="Group products into curated collections for your storefront."
        actions={<button type="button" onClick={openAdd} className={adminBtnPrimary}><span className="text-base leading-none">+</span> Add Collection</button>}
      />
      {success && <div className={`${adminToast} bg-admin-success-light text-admin-success border border-admin-success/20`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-admin-danger-light text-admin-danger border border-admin-danger/20`}>{(error || localError)}</div>}

      {modalOpen && <CollectionModal collection={editingCollection} onClose={closeModal} onSaved={() => { loadCollections(); showSuccess(editingCollection ? 'Collection updated!' : 'Collection created!'); }} />}
      <ConfirmDeleteModal
        isOpen={Boolean(collectionToDelete)}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={collectionToDelete?.name ? `the collection “${collectionToDelete.name}”` : 'this collection'}
      />

      <Table rows={collections} loading={loading} refreshing={refreshing} searchKeys={['name', 'slug']} onRefresh={loadCollections}
        pagination={pagination} onPageChange={goToPage} onPageSizeChange={changePageSize} onServerSearch={searchTable}
        rowKey="id"
        columns={[
          { key: 'name', header: 'Name', render: (collection) => <div><b className="text-admin-text">{collection.name}</b>{collection.description && <small className="block text-[11px] text-admin-muted truncate max-w-[200px]">{collection.description}</small>}</div> },
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