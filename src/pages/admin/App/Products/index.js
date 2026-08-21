import React, { useState } from 'react';
import { getToken } from '../../../../lib/auth';
import { api } from '../../../../lib/api';
import Table from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import AddProduct from './AddProduct';
import ProductView from './ProductView';
import { scrollToTop } from '../../../../utils/scrollToTop';
import { adminBtnPrimary, adminToast } from '../../Common/buttonClasses';
import PageHeader from '../../Common/PageHeader';

function CatalogIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" /><path d="M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7" /><path d="M9 5V3h6v2" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function ProductStatus({ isActive }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${isActive ? 'bg-admin-success-light text-admin-success' : 'bg-[#f0edf5] text-[#6b4fa0]'}`}>
      <span className={`h-[6px] w-[6px] rounded-full ${isActive ? 'bg-admin-success' : 'bg-[#6b4fa0]'}`} />
      {isActive ? 'Live' : 'Hidden'}
    </span>
  );
}

function ProductImage({ product }) {
  if (product.images?.[0]) {
    const image = product.images[0];
    return <img className="h-[54px] w-[42px] rounded object-cover border border-admin-border bg-admin-bg" src={typeof image === 'string' ? image : image.url} alt={product.name} />;
  }

  return (
    <div className="flex h-[54px] w-[42px] items-center justify-center rounded border border-admin-border bg-admin-bg text-[9px] text-admin-muted">
      No img
    </div>
  );
}

function ProductTable({ products, onView, onEdit, onDelete, loading, deleting, refreshing, pagination, onPageChange, onPageSizeChange, onServerSearch }) {
  return <Table
    rows={products}
    loading={loading}
    refreshing={refreshing}
    pagination={pagination}
    onPageChange={onPageChange}
    onPageSizeChange={onPageSizeChange}
    onServerSearch={onServerSearch}
    searchKeys={['name', 'sku', 'category.name']}
    emptyMessage="No products yet. Click Add New Product to create your first product."
    columns={[
      {
        key: 'name',
        header: 'Product',
        headerClassName: 'pl-4',
        cellClassName: 'pl-4 text-left',
        render: (product) => (
          <div className="flex items-center gap-3">
            <ProductImage product={product} />
            <div className="min-w-0">
              <b className="block max-w-[220px] truncate text-[13px] text-admin-text">{product.name}</b>
              <small className="block text-[10px] text-admin-muted">{product.productId || product.sku || 'No ID'}</small>
            </div>
          </div>
        ),
      },
      { key: 'mrp', header: 'MRP', render: (product) => <span className="text-admin-muted">{formatPrice(product.mrp)}</span> },
      { key: 'sellingPrice', header: 'Price', render: (product) => <b className="text-admin-text">{formatPrice(product.sellingPrice)}</b> },
      { key: 'discount', header: 'Discount', render: (product) => product.discount ? <span className="text-[11px] font-semibold text-admin-success">{product.discount}% off</span> : '—' },
      { key: 'category', header: 'Category', render: (product) => <span className="text-[12px] text-admin-muted">{product.category?.name || 'Uncategorized'}</span> },
      { key: 'stock', header: 'Stock', render: (product) => <span className={`text-[12px] font-semibold ${product.stock > 0 ? 'text-admin-text' : 'text-admin-danger'}`}>{product.stock > 0 ? product.stock : 'Out of stock'}</span> },
      { key: 'isActive', header: 'Status', render: (product) => <ProductStatus isActive={product.isActive} /> },
    ]}
    rowActions={[
      { label: 'View', onClick: onView },
      { label: 'Edit', onClick: onEdit },
      { label: 'Delete', danger: true, disabled: deleting, onClick: (product) => onDelete(product) },
    ]}
  />;
}

export default function AdminProducts() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'form' | 'detail'
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    rows: products,
    loading,
    refreshing,
    error,
    pagination,
    refresh: loadProducts,
    goToPage,
    changePageSize,
    searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListProducts(token, params),
  });

  function goToList() {
    setView('list');
    setEditingProduct(null);
    setViewingProduct(null);
    scrollToTop();
  }

  function openAddForm() {
    setView('form');
    setEditingProduct(null);
    setViewingProduct(null);
    scrollToTop();
  }

  function openEditForm(product, fromDetail = false) {
    setView('form');
    setEditingProduct(product);
    if (fromDetail) setViewingProduct(product);
    scrollToTop();
  }

  function openView(product) {
    setView('detail');
    setViewingProduct(product);
    setEditingProduct(null);
    scrollToTop();
  }

  function confirmDelete(product, returnToList = true) {
    setProductToDelete({ id: product.productId || product.id, name: product.name, returnToList });
  }

  async function onDelete() {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteProduct(token, productToDelete.id);
      if (productToDelete.returnToList) goToList();
      await loadProducts();
      setProductToDelete(null);
      setSuccess('Product deleted successfully!');
    } catch (requestError) {
      setLocalError(requestError.message || 'Unable to delete product');
    } finally {
      setDeleting(false);
      setTimeout(() => { setSuccess(''); setLocalError(''); }, 3000);
    }
  }

  return (
    <div className="min-w-0">
      {success && (
        <div className={`${adminToast} rounded-lg border border-admin-success/20 bg-admin-success-light px-5 py-3 text-[13px] font-medium text-admin-success`}>
          {success}
        </div>
      )}
      {(error || localError) && (
        <div className={`${adminToast} rounded-lg border border-admin-danger/20 bg-admin-danger-light px-5 py-3 text-[13px] font-medium text-admin-danger`}>
          {(error || localError)}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={onDelete}
        loading={deleting}
        itemName={productToDelete?.name ? `the product “${productToDelete.name}”` : 'this product'}
      />

      {view === 'list' && (
        <div className="overflow-hidden">
          <PageHeader
            icon={<CatalogIcon />}
            title="Products"
            description={pagination?.total ? `${pagination.total} products in your catalog.` : 'Manage every saree, lehenga and accessory in your store.'}
            actions={<button type="button" onClick={openAddForm} className={adminBtnPrimary}><span className="text-base leading-none">+</span> Add New Product</button>}
          />
          <ProductTable
            products={products}
            onView={openView}
            onEdit={(product) => openEditForm(product)}
            onDelete={(product) => confirmDelete(product, true)}
            loading={loading}
            deleting={deleting}
            refreshing={refreshing}
            pagination={pagination}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
            onServerSearch={searchTable}
          />
        </div>
      )}

      {view === 'form' && (
        <AddProduct onBack={goToList} onProductSaved={loadProducts} editProduct={editingProduct} />
      )}

      {view === 'detail' && (
        <ProductView
          product={viewingProduct}
          onBack={goToList}
          onEdit={(p) => openEditForm(p, true)}
          onDelete={(product) => confirmDelete(product, false)}
          deleting={deleting}
        />
      )}
    </div>
  );
}