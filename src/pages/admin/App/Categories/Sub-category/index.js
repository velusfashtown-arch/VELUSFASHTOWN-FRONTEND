import React, { useEffect, useState } from 'react';
import { api } from '../../../../../lib/api';
import { getToken } from '../../../../../lib/auth';
import AdminModal from '../../../Common/Modal';
import ConfirmDeleteModal from '../../../Common/ConfirmDeleteModal';
import AdminTable from '../../../Common/Table';
import useTableData from '../../../Common/Table/useTableData';
import AdminInput from '../../../Common/Form/Input';
import AdminDropdown from '../../../Common/Form/Dropdown';
import AdminTextarea from '../../../Common/Form/Textarea';

function SubCategoryModal({ subCategory, onClose, onSaved }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: subCategory?.name || '',
    description: subCategory?.description || '',
    parent: subCategory?.parent?.id || subCategory?.parent || '',
  });

  useEffect(() => {
    api.adminListCategories(token, { parent: 'null', isActive: 'true', includeRelations: 'true', limit: 100 })
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, [token]);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.parent) return setError('Parent category is required for sub category');
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        parent: form.parent,
        description: form.description.trim(),
      };
      if (subCategory?.id || subCategory?._id) {
        await api.adminUpdateCategory(token, subCategory.id || subCategory._id, payload);
      } else {
        await api.adminCreateCategory(token, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save sub category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title={subCategory ? 'Edit Sub Category' : 'Add Sub Category'}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="submit" form="sub-category-form" disabled={loading} className="admin-btn-primary">{loading ? 'Saving...' : 'Save Sub Category'}</button>
          <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="sub-category-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="m-0 text-[12px] text-[#c5221f]">{error}</p>}
        <AdminInput
          label="Sub Category Name"
          placeholder="e.g. Banarasi Silk"
          value={form.name}
          onChange={(event) => set('name', event.target.value)}
          required
        />
        <AdminDropdown
          label="Category"
          placeholder="Select category"
          value={form.parent}
          onChange={(value) => set('parent', value)}
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          required
        />
        <AdminTextarea
          label="Description"
          placeholder="Optional description..."
          value={form.description}
          onChange={(event) => set('description', event.target.value)}
        />
      </form>
    </AdminModal>
  );
}

export default function AdminSubCategory() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    rows: subCategory,
    loading,
    refreshing,
    pagination,
    error,
    refresh: loadSubCategory,
    goToPage,
    changePageSize,
    searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListCategories(token, { ...params, type: 'subcategory', includeRelations: 'true' }),
  });

  async function handleDelete() {
    if (!subCategoryToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteCategory(token, subCategoryToDelete.id || subCategoryToDelete._id);
      await loadSubCategory();
      setSubCategoryToDelete(null);
      showSuccess('Sub Category deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete sub category');
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

  function openAdd() { setEditingSubCategory(null); setModalOpen(true); }
  function openEdit(cat) { setEditingSubCategory(cat); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingSubCategory(null); }

  return (
    <div>
      {success && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)] admin-toast">{success}</div>}
      {(error || localError) && <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(47,31,25,0.12)] bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)] admin-toast">{(error || localError)}</div>}

      {modalOpen && (
        <SubCategoryModal subCategory={editingSubCategory} onClose={closeModal} onSaved={() => { loadSubCategory(); showSuccess(editingSubCategory ? 'Sub Category updated!' : 'Sub Category created!'); }} />
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(subCategoryToDelete)}
        onClose={() => setSubCategoryToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={subCategoryToDelete?.name ? `the sub category “${subCategoryToDelete.name}”` : 'this sub category'}
      />

      <AdminTable
          title="Sub Category"
          searchKeys={['name', 'description', 'parent.name']}
          onAdd={openAdd}
          addLabel="Add Sub Category"
          onRefresh={loadSubCategory}
          loading={loading}
          refreshing={refreshing}
          pagination={pagination}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          onServerSearch={searchTable}
          columns={[
            { key: 'name', header: 'Name', render: (cat) => (<div><b className="text-ink">{cat.name}</b>{cat.description && <small className="block text-[11px] text-muted truncate max-w-[200px]">{cat.description}</small>}</div>) },
            { key: 'parent', header: 'Parent Category', render: (cat) => (<span className="inline-flex items-center gap-1 rounded-full bg-[rgba(167,78,62,0.1)] px-2 py-0.5 text-[11px] font-medium text-terra">{cat.parent?.name || '-'}</span>) },
            { key: 'slug', header: 'Slug', className: 'font-mono text-[12px] text-muted' },
          ]}
          rows={subCategory}
          rowActions={[
            { label: 'Edit', onClick: openEdit },
            { label: 'Delete', danger: true, onClick: setSubCategoryToDelete },
          ]}
          emptyMessage="No sub Category yet. Click Add Sub Category to create one."
      />
    </div>
  );
}
