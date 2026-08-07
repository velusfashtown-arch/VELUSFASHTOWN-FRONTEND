import React, { useState } from 'react';
import { api } from '../../../../../lib/api';
import { getToken } from '../../../../../lib/auth';
import AdminModal from '../../../Common/Modal';
import ConfirmDeleteModal from '../../../Common/ConfirmDeleteModal';
import AdminTable from '../../../Common/Table';
import useTableData from '../../../Common/Table/useTableData';
import AdminInput from '../../../Common/Form/Input';
import AdminTextarea from '../../../Common/Form/Textarea';

function CategoryModal({ category, onClose, onSaved }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
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
      const payload = { name: form.name.trim(), description: form.description.trim() };
      if (category?.id) {
        await api.adminUpdateCategory(token, category.id, payload);
      } else {
        await api.adminCreateCategory(token, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="submit" form="category-form" disabled={loading} className="admin-btn-primary">{loading ? 'Saving...' : 'Save Category'}</button>
          <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

        <AdminInput
          label="Category Name"
          placeholder="e.g. Sarees"
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
      </form>
    </AdminModal>
  );
}

export default function AdminCategory() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    rows: Category,
    loading,
    refreshing,
    pagination,
    error,
    refresh: loadCategory,
    goToPage,
    changePageSize,
    searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListCategories(token, { ...params, parent: 'null' }),
  });

  async function handleDelete() {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteCategory(token, categoryToDelete.id || categoryToDelete._id);
      await loadCategory();
      setCategoryToDelete(null);
      showSuccess('Category deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete category');
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

  function openAdd() { setEditingCategory(null); setModalOpen(true); }
  function openEdit(cat) { setEditingCategory(cat); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingCategory(null); }

  return (
    <div>
      {success && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)] admin-toast">{success}</div>}
      {(error || localError) && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)] admin-toast">{(error || localError)}</div>}

      {modalOpen && (
        <CategoryModal category={editingCategory} onClose={closeModal} onSaved={() => { loadCategory(); showSuccess(editingCategory ? 'Category updated!' : 'Category created!'); }} />
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={categoryToDelete?.name ? `the category “${categoryToDelete.name}”` : 'this category'}
      />

      <AdminTable
        title="Category"
        searchKeys={['name', 'description']}
        onAdd={openAdd}
        addLabel="Add Category"
        onRefresh={loadCategory}
        loading={loading}
        refreshing={refreshing}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onServerSearch={searchTable}
        columns={[
          { key: 'name', header: 'Name', render: (cat) => (<div><b className="text-ink">{cat.name}</b>{cat.description && <small className="block text-[11px] text-muted truncate max-w-[200px]">{cat.description}</small>}</div>) },
        ]}
        rows={Category}
        rowKey="id"
        rowActions={[
          { label: 'Edit', onClick: openEdit },
          { label: 'Delete', danger: true, onClick: setCategoryToDelete },
        ]}
        emptyMessage="No Category yet. Click Add Category to create one."
      />
    </div>
  );
}
