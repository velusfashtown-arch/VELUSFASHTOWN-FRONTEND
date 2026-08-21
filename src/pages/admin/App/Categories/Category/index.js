import React, { useState } from 'react';
import { api } from '../../../../../lib/api';
import { getToken } from '../../../../../lib/auth';
import AdminModal from '../../../Common/Modal';
import ConfirmDeleteModal from '../../../Common/ConfirmDeleteModal';
import AdminTable from '../../../Common/Table';
import useTableData from '../../../Common/Table/useTableData';
import AdminInput from '../../../Common/Form/Input';
import AdminTextarea from '../../../Common/Form/Textarea';
import AdminCheckbox from '../../../Common/Form/Checkbox';
import { adminBtnPrimary, adminBtnSecondary, adminToast } from '../../../Common/buttonClasses';
import PageHeader from '../../../Common/PageHeader';

function CategoryPageIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
}

function CategoryModal({ category, onClose, onSaved }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive ?? true,
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
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        isActive: form.isActive,
      };
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
<button type="submit" form="category-form" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Save Category'}</button>
          <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
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
        <AdminCheckbox
          label="Active"
          helper="Only active categories are available when adding a product."
          checked={form.isActive}
          onChange={e => set('isActive', e.target.checked)}
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
    fetcher: (params) => api.adminListCategories(token, params),
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

  async function handleToggleActive(cat) {
    if (!cat?.id) return;
    try {
      await api.adminToggleCategoryActive(token, cat.id, !cat.isActive);
      await loadCategory();
      showSuccess(cat.isActive ? 'Category deactivated!' : 'Category activated!');
    } catch (err) {
      showError(err.message || 'Failed to toggle category status');
    }
  }

  return (
    <div>
      <PageHeader
        icon={<CategoryPageIcon />}
        title="Category"
        description="Top-level product categories that organize your entire catalog."
        actions={<button type="button" onClick={openAdd} className={adminBtnPrimary}><span className="text-base leading-none">+</span> Add Category</button>}
      />
{success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{(error || localError)}</div>}

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
        searchKeys={['name', 'description']}
        onRefresh={loadCategory}
        loading={loading}
        refreshing={refreshing}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onServerSearch={searchTable}
        columns={[
          { key: 'name', header: 'Name', render: (cat) => (<div><b className="text-ink">{cat.name}</b>{cat.description && <small className="block text-[11px] text-muted truncate max-w-[200px]">{cat.description}</small>}</div>) },
          { key: 'isActive', header: 'Status', render: (cat) => <span className={`text-[11px] font-semibold ${cat.isActive ? 'text-[#137333]' : 'text-muted'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span> },
        ]}
        rows={Category}
        rowKey="id"
        rowActions={[
          { label: 'Edit', onClick: openEdit },
          { label: (cat) => (cat.isActive ? 'Deactivate' : 'Activate'), onClick: handleToggleActive },
          { label: 'Delete', danger: true, onClick: setCategoryToDelete },
        ]}
        emptyMessage="No Category yet. Click Add Category to create one."
      />
    </div>
  );
}
