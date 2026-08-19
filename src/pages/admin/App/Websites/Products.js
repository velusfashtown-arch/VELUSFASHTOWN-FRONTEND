// Websites/Products.js
// Website product assignment, approval and publishing workflow.
// Admin assigns a central product to this website, then approves and
// publishes it. A product only appears on the storefront when it is
// APPROVED + PUBLISHED.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

const STATUS_BADGE = {
  DRAFT: 'bg-gray-100 text-muted',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  UNPUBLISHED: 'bg-gray-100 text-muted',
};

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

export default function WebsiteProducts() {
  const { id } = useParams();
  const token = getToken();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Assign modal state
  const [showAssign, setShowAssign] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [assignForm, setAssignForm] = useState({ websiteTitle: '', websitePrice: '', websiteComparePrice: '', featured: false });
  const [assigning, setAssigning] = useState(false);

  // Edit modal state
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Reject modal
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const statusLabel = (s) => (s || 'UNKNOWN').replace(/_/g, ' ');

  const load = useCallback(() => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    api.adminListWebsiteProducts(token, id, params)
      .then((res) => {
        const data = res?.data || [];
        setAssignments(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [token, id, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function openAssign() {
    setShowAssign(true);
    setSelectedProduct('');
    setAssignForm({ websiteTitle: '', websitePrice: '', websiteComparePrice: '', featured: false });
    api.adminListProducts(token, { limit: 100 })
      .then((res) => {
        const data = res?.data || res?.products || [];
        setAvailableProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setAvailableProducts([]));
  }

  async function handleAssign() {
    if (!selectedProduct) return;
    setAssigning(true);
    setError(null);
    try {
      await api.adminAssignWebsiteProduct(token, id, {
        productId: selectedProduct,
        websiteTitle: assignForm.websiteTitle,
        websitePrice: Number(assignForm.websitePrice) || 0,
        websiteComparePrice: Number(assignForm.websiteComparePrice) || 0,
        featured: assignForm.featured,
      });
      setShowAssign(false);
      load();
    } catch (err) {
      setError(err.message || 'Failed to assign product');
    } finally {
      setAssigning(false);
    }
  }

  async function handleApprove(productId) {
    try {
      await api.adminApproveWebsiteProduct(token, id, productId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to approve product');
    }
  }

  async function handlePublish(productId) {
    try {
      await api.adminPublishWebsiteProduct(token, id, productId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to publish product');
    }
  }

  async function handleUnpublish(productId) {
    try {
      await api.adminUnpublishWebsiteProduct(token, id, productId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to unpublish product');
    }
  }

  async function handleReject() {
    if (!rejecting) return;
    try {
      await api.adminRejectWebsiteProduct(token, id, rejecting, rejectReason);
      setRejecting(null);
      setRejectReason('');
      load();
    } catch (err) {
      setError(err.message || 'Failed to reject product');
    }
  }

  async function handleUnassign(productId) {
    if (!window.confirm('Unassign this product from this website?')) return;
    try {
      await api.adminUnassignWebsiteProduct(token, id, productId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to unassign product');
    }
  }

  function openEdit(assignment) {
    setEditing({
      ...assignment,
      websiteTitle: assignment.websiteTitle || (assignment.product && assignment.product.name) || '',
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSavingEdit(true);
    setError(null);
    try {
      await api.adminUpdateWebsiteProduct(token, id, editing.product?._id || editing.product, {
        websiteTitle: editing.websiteTitle,
        websiteDescription: editing.websiteDescription,
        websitePrice: Number(editing.websitePrice) || 0,
        websiteComparePrice: Number(editing.websiteComparePrice) || 0,
        featured: editing.featured,
        displayOrder: Number(editing.displayOrder) || 0,
        seoTitle: editing.seoTitle,
        seoDescription: editing.seoDescription,
      });
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSavingEdit(false);
    }
  }

  const productName = (a) => {
    if (a.websiteTitle) return a.websiteTitle;
    if (a.product && a.product.name) return a.product.name;
    return 'Product';
  };

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading products…</div>;

  return (
    <div className="space-y-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select className={inputClass + ' w-auto'} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNPUBLISHED">Unpublished</option>
          </select>
        </div>
        <button type="button" onClick={openAssign} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_2px_8px_rgba(167,78,62,0.28)] transition-all duration-200 hover:bg-wine hover:shadow-[0_4px_14px_rgba(167,78,62,0.36)]">
          + Assign Product
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-muted">
          No products assigned to this website yet. Assign a central product to begin.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a._id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{productName(a)}</p>
                    <p className="text-[11px] text-muted">{a.product?.sku || a.product?.productId || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[a.approvalStatus] || 'bg-gray-100 text-muted'}`}>
                      {statusLabel(a.approvalStatus)}
                    </span>
                    {a.published ? <span className="ml-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Live</span> : null}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {a.websitePrice ? `₹${a.websitePrice}` : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">{a.featured ? '★' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {a.approvalStatus === 'PENDING_APPROVAL' || a.approvalStatus === 'REJECTED' || a.approvalStatus === 'DRAFT' ? (
                        <button type="button" onClick={() => handleApprove(a.product?._id || a.product)} className="rounded border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Approve</button>
                      ) : null}
                      {a.approvalStatus === 'APPROVED' && !a.published ? (
                        <button type="button" onClick={() => handlePublish(a.product?._id || a.product)} className="rounded bg-terra px-2 py-1 text-xs font-semibold text-white hover:bg-wine">Publish</button>
                      ) : null}
                      {a.published ? (
                        <button type="button" onClick={() => handleUnpublish(a.product?._id || a.product)} className="rounded border border-line px-2 py-1 text-xs text-muted hover:bg-cream">Unpublish</button>
                      ) : null}
                      <button type="button" onClick={() => setRejecting(a.product?._id || a.product)} className="rounded border border-[#f3d4d4] px-2 py-1 text-xs font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Reject</button>
                      <button type="button" onClick={() => openEdit(a)} className="rounded border border-line px-2 py-1 text-xs font-semibold text-terra hover:bg-cream">Edit</button>
                      <button type="button" onClick={() => handleUnassign(a.product?._id || a.product)} className="rounded border border-[#f3d4d4] px-2 py-1 text-xs text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Unassign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign modal */}
      {showAssign ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowAssign(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Assign Product</h3>
              <button type="button" onClick={() => setShowAssign(false)} className="text-muted hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Central Product</label>
                <select className={inputClass} value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  <option value="">Select a product…</option>
                  {availableProducts.map((p) => <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Website Title</label>
                <input className={inputClass} value={assignForm.websiteTitle} onChange={(e) => setAssignForm((prev) => ({ ...prev, websiteTitle: e.target.value }))} placeholder="Optional override" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Website Price</label>
                  <input type="number" className={inputClass} value={assignForm.websitePrice} onChange={(e) => setAssignForm((prev) => ({ ...prev, websitePrice: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Compare Price</label>
                  <input type="number" className={inputClass} value={assignForm.websiteComparePrice} onChange={(e) => setAssignForm((prev) => ({ ...prev, websiteComparePrice: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={assignForm.featured} onChange={(e) => setAssignForm((prev) => ({ ...prev, featured: e.target.checked }))} />
                Featured on this website
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAssign(false)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleAssign} disabled={assigning || !selectedProduct} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(167,78,62,0.28)] transition-all duration-200 hover:bg-wine hover:shadow-[0_4px_14px_rgba(167,78,62,0.36)] disabled:opacity-60">
                  {assigning ? 'Assigning…' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Configure Product</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Website Title</label>
                <input className={inputClass} value={editing.websiteTitle || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteTitle: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Website Description</label>
                <textarea className={inputClass + ' min-h-[80px]'} value={editing.websiteDescription || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteDescription: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Website Price</label>
                  <input type="number" className={inputClass} value={editing.websitePrice || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websitePrice: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Compare Price</label>
                  <input type="number" className={inputClass} value={editing.websiteComparePrice || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteComparePrice: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">SEO Title</label>
                <input className={inputClass} value={editing.seoTitle || ''} onChange={(e) => setEditing((prev) => ({ ...prev, seoTitle: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">SEO Description</label>
                <textarea className={inputClass + ' min-h-[60px]'} value={editing.seoDescription || ''} onChange={(e) => setEditing((prev) => ({ ...prev, seoDescription: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Display Order</label>
                  <input type="number" className={inputClass} value={editing.displayOrder || 0} onChange={(e) => setEditing((prev) => ({ ...prev, displayOrder: e.target.value }))} />
                </div>
                <label className="flex items-end gap-2 pb-2.5 text-sm text-ink">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing((prev) => ({ ...prev, featured: e.target.checked }))} />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleSaveEdit} disabled={savingEdit} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(167,78,62,0.28)] transition-all duration-200 hover:bg-wine hover:shadow-[0_4px_14px_rgba(167,78,62,0.36)] disabled:opacity-60">
                  {savingEdit ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reject modal */}
      {rejecting ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setRejecting(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Reject Product</h3>
              <button type="button" onClick={() => setRejecting(null)} className="text-muted hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Reason (required)</label>
                <textarea className={inputClass + ' min-h-[80px]'} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Why is this product being rejected?" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRejecting(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleReject} disabled={!rejectReason.trim()} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-60">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
