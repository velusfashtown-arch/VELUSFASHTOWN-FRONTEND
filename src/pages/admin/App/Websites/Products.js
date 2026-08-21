// Websites/Products.js
// Website product assignment, approval and publishing workflow.
// Admin assigns a central product to this website, then approves and
// publishes it. A product only appears on the storefront when it is
// APPROVED + PUBLISHED.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnPrimary, adminBtnSecondary, adminBtnDanger } from '../../Common/buttonClasses';

const STATUS_BADGE = {
  DRAFT: 'bg-[rgba(47,31,25,0.06)] text-muted',
  PENDING_APPROVAL: 'bg-[#fdf1dc] text-[#8a6116]',
  APPROVED: 'bg-[#e6f4ea] text-[#137333]',
  REJECTED: 'bg-[#fce8e6] text-[#b93b3b]',
  PUBLISHED: 'bg-[#e6f4ea] text-[#137333]',
  UNPUBLISHED: 'bg-[rgba(47,31,25,0.06)] text-muted',
};

const inputClass = 'w-full rounded-lg border border-[rgba(47,31,25,0.14)] bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';

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
      {error ? <div className="rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-3 text-sm text-[#b93b3b]">{error}</div> : null}

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
        <button type="button" onClick={openAssign} className={adminBtnPrimary}>
          <span className="text-base leading-none">+</span> Assign Product
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(47,31,25,0.16)] bg-paper p-10 text-center text-sm text-muted">
          No products assigned to this website yet. Assign a central product to begin.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[rgba(47,31,25,0.1)] bg-paper shadow-[0_12px_32px_rgba(47,31,25,0.06)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[rgba(47,31,25,0.08)] bg-[linear-gradient(115deg,rgba(255,255,255,0.92),rgba(250,245,239,0.92))] text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a._id} className="border-b border-[rgba(47,31,25,0.06)] odd:bg-white even:bg-[rgba(250,245,239,0.45)] transition-colors last:border-0 hover:bg-[rgba(167,78,62,0.055)]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{productName(a)}</p>
                    <p className="text-[11px] text-muted">{a.product?.sku || a.product?.productId || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[a.approvalStatus] || 'bg-[rgba(47,31,25,0.06)] text-muted'}`}>
                      {statusLabel(a.approvalStatus)}
                    </span>
                    {a.published ? <span className="ml-1 rounded-full bg-[#e6f4ea] px-2 py-0.5 text-[10px] font-bold uppercase text-[#137333]">Live</span> : null}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {a.websitePrice ? `₹${a.websitePrice}` : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">{a.featured ? '★' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {a.approvalStatus === 'PENDING_APPROVAL' || a.approvalStatus === 'REJECTED' || a.approvalStatus === 'DRAFT' ? (
                        <button type="button" onClick={() => handleApprove(a.product?._id || a.product)} className="rounded-md border border-[#bfe3c9] px-2 py-1 text-[11px] font-semibold text-[#137333] transition-colors hover:bg-[#e6f4ea]">Approve</button>
                      ) : null}
                      {a.approvalStatus === 'APPROVED' && !a.published ? (
                        <button type="button" onClick={() => handlePublish(a.product?._id || a.product)} className="rounded-md bg-terra px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-wine">Publish</button>
                      ) : null}
                      {a.published ? (
                        <button type="button" onClick={() => handleUnpublish(a.product?._id || a.product)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2 py-1 text-[11px] text-muted transition-colors hover:bg-sand hover:text-ink">Unpublish</button>
                      ) : null}
                      <button type="button" onClick={() => setRejecting(a.product?._id || a.product)} className="rounded-md border border-[#f3d4d4] px-2 py-1 text-[11px] font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Reject</button>
                      <button type="button" onClick={() => openEdit(a)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2 py-1 text-[11px] font-semibold text-terra transition-colors hover:border-terra/30 hover:bg-terra/10">Edit</button>
                      <button type="button" onClick={() => handleUnassign(a.product?._id || a.product)} className="rounded-md border border-[#f3d4d4] px-2 py-1 text-[11px] text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Unassign</button>
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
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-5 shadow-2xl animate-admin-slide-in sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-semibold text-ink">Assign Product</h3>
              <button type="button" onClick={() => setShowAssign(false)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Central Product</label>
                <select className={inputClass} value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  <option value="">Select a product…</option>
                  {availableProducts.map((p) => <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Website Title</label>
                <input className={inputClass} value={assignForm.websiteTitle} onChange={(e) => setAssignForm((prev) => ({ ...prev, websiteTitle: e.target.value }))} placeholder="Optional override" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Website Price</label>
                  <input type="number" className={inputClass} value={assignForm.websitePrice} onChange={(e) => setAssignForm((prev) => ({ ...prev, websitePrice: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Compare Price</label>
                  <input type="number" className={inputClass} value={assignForm.websiteComparePrice} onChange={(e) => setAssignForm((prev) => ({ ...prev, websiteComparePrice: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={assignForm.featured} onChange={(e) => setAssignForm((prev) => ({ ...prev, featured: e.target.checked }))} className="h-4 w-4 accent-terra" />
                Featured on this website
              </label>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAssign(false)} className={adminBtnSecondary}>Cancel</button>
                <button type="button" onClick={handleAssign} disabled={assigning || !selectedProduct} className={adminBtnPrimary}>
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
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-5 shadow-2xl animate-admin-slide-in sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-semibold text-ink">Configure Product</h3>
              <button type="button" onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Website Title</label>
                <input className={inputClass} value={editing.websiteTitle || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteTitle: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Website Description</label>
                <textarea className={inputClass + ' min-h-[80px] resize-y'} value={editing.websiteDescription || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteDescription: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Website Price</label>
                  <input type="number" className={inputClass} value={editing.websitePrice || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websitePrice: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Compare Price</label>
                  <input type="number" className={inputClass} value={editing.websiteComparePrice || ''} onChange={(e) => setEditing((prev) => ({ ...prev, websiteComparePrice: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelClass}>SEO Title</label>
                <input className={inputClass} value={editing.seoTitle || ''} onChange={(e) => setEditing((prev) => ({ ...prev, seoTitle: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea className={inputClass + ' min-h-[60px] resize-y'} value={editing.seoDescription || ''} onChange={(e) => setEditing((prev) => ({ ...prev, seoDescription: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input type="number" className={inputClass} value={editing.displayOrder || 0} onChange={(e) => setEditing((prev) => ({ ...prev, displayOrder: e.target.value }))} />
                </div>
                <label className="flex items-end gap-2 pb-2.5 text-sm text-ink">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing((prev) => ({ ...prev, featured: e.target.checked }))} className="h-4 w-4 accent-terra" />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setEditing(null)} className={adminBtnSecondary}>Cancel</button>
                <button type="button" onClick={handleSaveEdit} disabled={savingEdit} className={adminBtnPrimary}>
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
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-5 shadow-2xl animate-admin-slide-in sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-semibold text-ink">Reject Product</h3>
              <button type="button" onClick={() => setRejecting(null)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Reason (required)</label>
                <textarea className={inputClass + ' min-h-[80px] resize-y'} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Why is this product being rejected?" />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setRejecting(null)} className={adminBtnSecondary}>Cancel</button>
                <button type="button" onClick={handleReject} disabled={!rejectReason.trim()} className={adminBtnDanger}>
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
