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
import AdminCheckbox from '../../../Common/Form/Checkbox';
import { adminBtnPrimary, adminBtnSecondary, adminToast } from '../../../Common/buttonClasses';

function SubCategoryModal({ subCategory, onClose, onSaved }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: subCategory?.name || '',
    description: subCategory?.description || '',
    category: subCategory?.category?.id || subCategory?.category || '',
    isActive: subCategory?.isActive ?? true,
  });

  useEffect(() => {
    api.adminListCategories(token, { isActive: 'true', limit: 100 })
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, [token]);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.category) return setError('Parent category is required for sub category');
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        isActive: form.isActive,
      };
      if (subCategory?.id || subCategory?._id) {
        await api.adminUpdateSubCategory(token, subCategory.id || subCategory._id, payload);
      } else {
        await api.adminCreateSubCategory(token, payload);
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
<button type="submit" form="sub-category-form" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Save Sub Category'}</button>
          <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
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
          value={form.category}
          onChange={(value) => set('category', value)}
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          required
        />
        <AdminTextarea
          label="Description"
          placeholder="Optional description..."
          value={form.description}
          onChange={(event) => set('description', event.target.value)}
        />
        <AdminCheckbox
          label="Active"
          helper="Only active subcategories are available when adding a product."
          checked={form.isActive}
          onChange={(event) => set('isActive', event.target.checked)}
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
    fetcher: (params) => api.adminListSubCategories(token, params),
  });

  async function handleDelete() {
    if (!subCategoryToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteSubCategory(token, subCategoryToDelete.id || subCategoryToDelete._id);
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

  async function handleToggleActive(cat) {
    if (!cat?.id) return;
    try {
      await api.adminToggleSubCategoryActive(token, cat.id, !cat.isActive);
      await loadSubCategory();
      showSuccess(cat.isActive ? 'Sub Category deactivated!' : 'Sub Category activated!');
    } catch (err) {
      showError(err.message || 'Failed to toggle sub category status');
    }
  }

  return (
    <div>
{success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{(error || localError)}</div>}

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
          searchKeys={['name', 'description', 'category.name']}
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
            { key: 'category', header: 'Parent Category', render: (cat) => (<span className="inline-flex items-center gap-1 rounded-full bg-[rgba(167,78,62,0.1)] px-2 py-0.5 text-[11px] font-medium text-terra">{cat.category?.name || '-'}</span>) },
            { key: 'isActive', header: 'Status', render: (cat) => <span className={`text-[11px] font-semibold ${cat.isActive ? 'text-[#137333]' : 'text-muted'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span> },
          ]}
          rows={subCategory}
          rowActions={[
            { label: 'Edit', onClick: openEdit },
            { label: (cat) => (cat.isActive ? 'Deactivate' : 'Activate'), onClick: handleToggleActive },
            { label: 'Delete', danger: true, onClick: setSubCategoryToDelete },
          ]}
          emptyMessage="No sub Category yet. Click Add Sub Category to create one."
      />
    </div>
  );
}
