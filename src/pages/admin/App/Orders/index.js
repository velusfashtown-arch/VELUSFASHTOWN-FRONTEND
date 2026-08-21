import React, { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import Listbox from '../../../../components/shared/form/Listbox';
import AdminModal from '../../Common/Modal';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import AdminInput from '../../Common/Form/Input';
import AdminTextarea from '../../Common/Form/Textarea';
import { adminBtnPrimary, adminBtnSecondary, adminBtnDanger, adminBtnGhost, adminToast } from '../../Common/buttonClasses';
import Rupee from '../../../../components/shared/Rupee';
import StatCard from '../../../../components/shared/StatCard';
import PageHeader from '../../Common/PageHeader';

function OrdersIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></svg>;
}
function ActiveIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /></svg>;
}
function DeliveredIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
}
function RTOStatIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v4" /><path d="M17 15v5" /><path d="M14 15h6" /></svg>;
}
function RevenueIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}

const statusOptions = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'RTO'];
const paymentOptions = ['Pending', 'Paid'];
const rtoStatusOptions = ['None', 'Requested', 'In Transit', 'Received', 'Completed'];

const statusColors = {
  Placed: 'bg-[#f0edf5] text-[#6b4fa0]', Confirmed: 'bg-[#e8f0fe] text-[#1a73e8]',
  Packed: 'bg-[#fef7e0] text-[#b47c2e]', Shipped: 'bg-[#e6f4ea] text-[#1e8e3e]',
  Delivered: 'bg-[#e6f4ea] text-[#137333]', Cancelled: 'bg-[#fce8e6] text-[#c5221f]',
  RTO: 'bg-[#fce8e6] text-[#c5221f]'
};
const paidColors = { Paid: 'bg-[#e6f4ea] text-[#1e8e3e]', Pending: 'bg-[#fef7e0] text-[#b47c2e]' };

/* ─── Courier / RTO Modal ──────────────────────────────────────────────── */
function CourierModal({ order, onClose, onUpdate }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [couriers, setCouriers] = useState([]);
  const [shiprocket, setShiprocket] = useState(order?.shiprocket || null);
  const [shiprocketLoading, setShiprocketLoading] = useState(false);
  const [shiprocketError, setShiprocketError] = useState('');
  const [notesMessage, setNotesMessage] = useState('');
  const [confirmingCancelRto, setConfirmingCancelRto] = useState(false);
  const [form, setForm] = useState({
    courierName: order?.courierName || '',
    trackingNumber: order?.trackingNumber || '',
    awbNumber: order?.awbNumber || '',
    notes: order?.notes || ''
  });

  async function handleShiprocketPush() {
    setShiprocketLoading(true); setShiprocketError('');
    try {
      const res = await api.adminShiprocketPush(token, order.id);
      setShiprocket(res.data.shiprocket);
      onUpdate();
    } catch (err) {
      setShiprocketError(err.message || 'Failed to push order to Shiprocket');
    } finally {
      setShiprocketLoading(false);
    }
  }

  async function handleShiprocketTrack() {
    setShiprocketLoading(true); setShiprocketError('');
    try {
      await api.adminShiprocketTrack(token, order.id);
      const res = await api.adminGetOrder(token, order.id);
      setShiprocket(res.data?.shiprocket || null);
      onUpdate();
    } catch (err) {
      setShiprocketError(err.message || 'Failed to refresh tracking');
    } finally {
      setShiprocketLoading(false);
    }
  }

  const [rtoForm, setRtoForm] = useState({
    rtoStatus: order?.rtoStatus || 'None',
    rtoReason: order?.rtoReason || '',
    rtoTrackingNumber: order?.rtoTrackingNumber || '',
    rtoCourierName: order?.rtoCourierName || ''
  });

  useEffect(() => {
    api.adminListCouriers(token).then(res => setCouriers(res.data?.couriers || [])).catch(() => {});
  }, [token]);

  async function handleAssignCourier(e) {
    e.preventDefault();
    if (!form.courierName || !form.trackingNumber) return;
    setLoading(true);
    setFormError('');
    try {
      await api.adminAssignCourier(token, order.id, form);
      onUpdate();
      onClose();
    } catch (err) {
      setFormError('Failed to assign courier: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRTO(e) {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      await api.adminManageRTO(token, order.id, rtoForm);
      onUpdate();
      onClose();
    } catch (err) {
      setFormError('Failed to update RTO: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelRTO() {
    if (!confirmingCancelRto) {
      setConfirmingCancelRto(true);
      return;
    }
    setLoading(true);
    setFormError('');
    try {
      await api.adminCancelRTO(token, order.id);
      onUpdate();
      onClose();
    } catch (err) {
      setFormError('Failed to cancel RTO: ' + err.message);
    } finally {
      setLoading(false);
      setConfirmingCancelRto(false);
    }
  }

  async function handleSaveNotes() {
    setNotesMessage('');
    try {
      await api.adminUpdateOrder(token, order.id, { notes: form.notes });
      setNotesMessage('Notes saved!');
    } catch (err) {
      setNotesMessage('Failed to save notes');
    } finally {
      setTimeout(() => setNotesMessage(''), 3000);
    }
  }

  return (
    <AdminModal isOpen onClose={onClose} title={`Shipping / Courier — ${order?.orderNumber}`} size="lg">
      <div className="space-y-6">
        {formError && <p className="text-[12px] text-admin-danger m-0 -mt-2">{formError}</p>}

        {/* ─── Shiprocket ─────────────────────────────────────────── */}
        <div>
          <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-3">Shiprocket</h4>
          {shiprocketError && <p className="text-[12px] text-admin-danger mb-2">{shiprocketError}</p>}
          {shiprocket?.shipmentId ? (
            <div className="bg-admin-bg rounded-lg p-3 text-[12px] space-y-1">
              <div><span className="text-admin-muted">Status:</span> <b className="text-admin-text">{shiprocket.status || 'Pushed'}</b></div>
              {shiprocket.courierName && <div><span className="text-admin-muted">Courier:</span> <b className="text-admin-text">{shiprocket.courierName}</b></div>}
              {shiprocket.awbCode && <div><span className="text-admin-muted">AWB:</span> <b className="text-admin-text">{shiprocket.awbCode}</b></div>}
              <button type="button" className={`${adminBtnSecondary} rounded px-2.5 py-1 text-[10px] font-semibold normal-case tracking-[0.04em] mt-2`} onClick={handleShiprocketTrack} disabled={shiprocketLoading}>
                {shiprocketLoading ? 'Refreshing...' : 'Refresh Tracking'}
              </button>
            </div>
          ) : (
            <button type="button" className={adminBtnPrimary} onClick={handleShiprocketPush} disabled={shiprocketLoading}>
              {shiprocketLoading ? 'Pushing to Shiprocket...' : 'Ship via Shiprocket'}
            </button>
          )}
        </div>

        {/* ─── Assign Courier (manual fallback) ──────────────────────── */}
        <div className="border-t border-admin-border pt-5">
          <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-3">Assign Courier Manually</h4>
          <form onSubmit={handleAssignCourier} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 md:col-span-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.05em] text-admin-muted">Courier</label>
              <Listbox
                value={{ value: form.courierName, label: form.courierName || 'Select courier...' }}
                onChange={(option) => setForm(f => ({ ...f, courierName: option.value }))}
                data={couriers.map(c => ({ value: c.name, label: c.name })).concat([{ value: 'Others', label: 'Others' }])}
                size="sm"
              />
            </div>
            <AdminInput
              label="Tracking Number"
              required
              value={form.trackingNumber}
              onChange={e => setForm(f => ({ ...f, trackingNumber: e.target.value }))}
              placeholder="e.g. DHL123456"
            />
            <AdminInput
              label="AWB Number"
              value={form.awbNumber}
              onChange={e => setForm(f => ({ ...f, awbNumber: e.target.value }))}
              placeholder="Optional"
            />
            <div className="sm:col-span-2 flex items-center gap-2 mt-1">
              <button type="submit" disabled={loading || !form.courierName || !form.trackingNumber} className={adminBtnPrimary}>
                {loading ? 'Assigning...' : 'Assign Courier'}
              </button>
              <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>

        {/* ─── RTO Management ────────────────────────────────────────── */}
        <div className="border-t border-admin-border pt-5">
          <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-3">
            RTO Management {order?.isRTO ? <span className="text-admin-danger ml-2">(Active RTO)</span> : ''}
          </h4>
          <form onSubmit={handleUpdateRTO} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.05em] text-admin-muted">RTO Status</label>
              <Listbox
                value={{ value: rtoForm.rtoStatus, label: rtoForm.rtoStatus }}
                onChange={(option) => setRtoForm(f => ({ ...f, rtoStatus: option.value }))}
                data={rtoStatusOptions.map(opt => ({ value: opt, label: opt }))}
                size="sm"
              />
            </div>
            <AdminInput
              label="RTO Reason"
              value={rtoForm.rtoReason}
              onChange={e => setRtoForm(f => ({ ...f, rtoReason: e.target.value }))}
              placeholder="e.g. Customer refused, Wrong address"
            />
            <AdminInput
              label="RTO Tracking Number"
              value={rtoForm.rtoTrackingNumber}
              onChange={e => setRtoForm(f => ({ ...f, rtoTrackingNumber: e.target.value }))}
              placeholder="Optional"
            />
            <AdminInput
              label="RTO Courier"
              value={rtoForm.rtoCourierName}
              onChange={e => setRtoForm(f => ({ ...f, rtoCourierName: e.target.value }))}
              placeholder="e.g. Delhivery"
            />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2 mt-1">
              <button type="submit" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Update RTO'}</button>
              {order?.isRTO && (
                <>
                  <button type="button" className={`${adminBtnDanger} rounded px-2.5 py-1 text-[10px] font-semibold normal-case tracking-[0.04em]`} onClick={handleCancelRTO} disabled={loading}>
                    {confirmingCancelRto ? 'Confirm cancel?' : 'Cancel RTO'}
                  </button>
                  {confirmingCancelRto && (
                    <button type="button" className={`${adminBtnSecondary} rounded px-2.5 py-1 text-[10px] font-semibold normal-case tracking-[0.04em]`} onClick={() => setConfirmingCancelRto(false)} disabled={loading}>
                      Never mind
                    </button>
                  )}
                </>
              )}
            </div>
          </form>
        </div>

        {/* ─── Notes ──────────────────────────────────────────────────── */}
        <div className="border-t border-admin-border pt-5">
          <AdminTextarea
            label="Order Notes"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Add internal notes about this order..."
          />
          <div className="mt-2 flex items-center gap-3">
            <button type="button" className={`${adminBtnSecondary} rounded px-2.5 py-1 text-[10px] font-semibold normal-case tracking-[0.04em]`} onClick={handleSaveNotes}>
              Save Notes
            </button>
            {notesMessage && <span className="text-[11px] text-admin-muted">{notesMessage}</span>}
          </div>
        </div>

        {/* ─── Print Label ────────────────────────────────────────────── */}
        <div className="border-t border-admin-border pt-5">
          <button type="button" className={adminBtnPrimary}
            onClick={() => {
              const labelUrl = `${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/shipping/${order.id}/label?token=${token}`;
              window.open(labelUrl, '_blank');
            }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            Generate Shipping Label & Print
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

/* ─── Order Detail Modal ────────────────────────────────────────────────── */
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <AdminModal isOpen onClose={onClose} title={`Order Details — ${order.orderNumber}`} size="xl">
      <div className="space-y-5 text-[13px]">
        {/* Customer Info */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-2">Customer Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-admin-bg rounded-lg p-4">
            <div><span className="text-admin-muted text-[11px]">Name</span><br /><b className="text-admin-text">{order.customer?.name}</b></div>
            <div><span className="text-admin-muted text-[11px]">Phone</span><br /><b className="text-admin-text">{order.customer?.phone}</b></div>
            <div className="sm:col-span-2"><span className="text-admin-muted text-[11px]">Address</span><br /><b className="text-admin-text">{order.customer?.address}{order.customer?.landmark ? `, ${order.customer.landmark}` : ''}</b></div>
            <div><span className="text-admin-muted text-[11px]">City/State</span><br /><b className="text-admin-text">{order.customer?.city}, {order.customer?.state}</b></div>
            <div><span className="text-admin-muted text-[11px]">Pincode</span><br /><b className="text-admin-text">{order.customer?.pincode}</b></div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-2">Order Items ({order.items?.length || 0})</h4>
          <div className="divide-y divide-admin-border/50">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2">
                {item.image && <img src={item.image} alt="" className="w-10 h-12 rounded object-cover bg-sand" />}
                <div className="flex-1 min-w-0">
                  <span className="block text-admin-text truncate">{item.name}</span>
                  <span className="text-[11px] text-admin-muted">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
                </div>
                <b className="text-admin-text shrink-0">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</b>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-admin-bg rounded-lg p-4">
          <div><span className="text-admin-muted text-[11px]">Subtotal</span><br /><b className="text-admin-text">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</b></div>
          <div><span className="text-admin-muted text-[11px]">Shipping</span><br /><b className="text-admin-text">₹{Number(order.shipping || 0).toLocaleString('en-IN')}</b></div>
          <div><span className="text-admin-muted text-[11px]">Discount</span><br /><b className="text-admin-success">-₹{Number(order.discount || 0).toLocaleString('en-IN')}</b></div>
          <div><span className="text-admin-muted text-[11px]">Total</span><br /><b className="text-lg text-admin-text">₹{Number(order.total || 0).toLocaleString('en-IN')}</b></div>
        </div>

        {/* Status & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><span className="text-admin-muted text-[11px]">Status</span><br />
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status] || statusColors.Placed}`}>
              <span className="w-[6px] h-[6px] rounded-full bg-current" /> {order.status}
            </span>
          </div>
          <div><span className="text-admin-muted text-[11px]">Payment</span><br />
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${paidColors[order.paymentStatus] || paidColors.Pending}`}>
              <span className="w-[6px] h-[6px] rounded-full bg-current" /> {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Courier / RTO Info */}
        {(order.courierName || order.isRTO) && (
          <div className="border-t border-admin-border pt-3">
            <h4 className="text-[10px] font-bold tracking-[0.08em] uppercase text-admin-muted mb-2">Shipping Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
              {order.courierName && <div><span className="text-admin-muted">Courier:</span> <b className="text-admin-text">{order.courierName}</b></div>}
              {order.trackingNumber && <div><span className="text-admin-muted">Tracking:</span> <b className="text-admin-text">{order.trackingNumber}</b></div>}
              {order.awbNumber && <div><span className="text-admin-muted">AWB:</span> <b className="text-admin-text">{order.awbNumber}</b></div>}
              {order.isRTO && (
                <>
                  <div className="text-admin-danger"><span className="text-admin-muted">RTO Status:</span> <b className="text-admin-danger">{order.rtoStatus}</b></div>
                  {order.rtoReason && <div className="sm:col-span-2"><span className="text-admin-muted">RTO Reason:</span> <b className="text-admin-text">{order.rtoReason}</b></div>}
                </>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="border-t border-admin-border pt-3">
            <span className="text-admin-muted text-[11px]">Notes:</span>
            <p className="m-0 mt-1 text-admin-text text-[12px]">{order.notes}</p>
          </div>
        )}

        {/* Dates */}
        <div className="text-[11px] text-admin-muted border-t border-admin-border pt-3">
          <span>Placed: {new Date(order.createdAt).toLocaleString('en-IN')}</span>
          {order.shippedDate && <span className="ml-4">Shipped: {new Date(order.shippedDate).toLocaleString('en-IN')}</span>}
          {order.deliveredDate && <span className="ml-4">Delivered: {new Date(order.deliveredDate).toLocaleString('en-IN')}</span>}
        </div>
      </div>
    </AdminModal>
  );
}

/* ─── Main AdminOrders Component ────────────────────────────────────────── */
export default function AdminOrders() {
  const token = getToken();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState(null);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setError('');
    try { const result = await api.adminListOrders(token); setOrders(result.data || []); }
    catch (err) { setError(err.message || 'Failed to load orders'); }
  }

  async function updateOrder(order, update) {
    setLoading(true); setError('');
    try {
      const res = await api.adminUpdateOrder(token, order.id, update);
      setOrders(items => items.map(item => item.id === order.id ? res.data : item));
      setSuccess('Order updated successfully!');
    } catch (err) { setError(err.message || 'Unable to update order'); }
    finally { setLoading(false); setTimeout(() => setSuccess(''), 3000); }
  }

  async function viewOrderDetail(order) {
    try {
      const res = await api.adminGetOrder(token, order.id);
      setDetailedOrder(res.data);
    } catch (err) {
      setError(err.message || 'Unable to load order details');
    }
  }

  async function handleDeleteOrder() {
    if (!orderToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteOrder(token, orderToDelete.id);
      setOrders(items => items.filter(item => item.id !== orderToDelete.id));
      setOrderToDelete(null);
      setSuccess('Order deleted!');
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  }

  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === 'Placed' || o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    rto: orders.filter(o => o.isRTO).length,
    revenue: orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (o.total || 0), 0)
  };

  return (
    <div>
      <PageHeader
        icon={<OrdersIcon />}
        title="Orders"
        description="Track, ship and manage every order placed across your stores."
      />
      {success && <div className={`${adminToast} bg-admin-success-light text-admin-success border border-admin-success/20`}>{success}</div>}
      {error && <div className={`${adminToast} bg-admin-danger-light text-admin-danger border border-admin-danger/20`}>{error}</div>}

      {/* Modals */}
      {detailedOrder && <OrderDetailModal order={detailedOrder} onClose={() => setDetailedOrder(null)} />}
      {shippingOrder && <CourierModal order={shippingOrder} onClose={() => setShippingOrder(null)} onUpdate={loadOrders} />}
      <ConfirmDeleteModal
        isOpen={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        loading={deleting}
        itemName={orderToDelete?.orderNumber ? `order ${orderToDelete.orderNumber}` : 'this order'}
      />

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[18px] mb-6">
        <StatCard icon={<OrdersIcon />} label="Total Orders" value={stats.total} bgColor="#eef2ff" iconColor="#4f46e5" />
        <StatCard icon={<ActiveIcon />} label="Active" value={stats.active} bgColor="#f0edf5" iconColor="#6b4fa0" />
        <StatCard icon={<DeliveredIcon />} label="Delivered" value={stats.delivered} bgColor="#ecfdf5" iconColor="#059669" />
        <StatCard icon={<RTOStatIcon />} label="RTO" value={stats.rto} bgColor="#fef2f2" iconColor="#dc2626" />
        <StatCard icon={<RevenueIcon />} label="Revenue (Paid)" value={<Rupee amount={stats.revenue} />} bgColor="#fffbeb" iconColor="#d97706" />
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-3">
        {orders.length > 0 ? orders.map(order => (
          <div key={order.id} className="bg-white border border-admin-border rounded-xl p-4 md:p-5 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 items-start shadow-card hover:shadow-card-hover transition-shadow">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status] || statusColors.Placed}`}>
                <span className="w-[6px] h-[6px] rounded-full bg-current" />
                {order.status}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-admin-text">{order.orderNumber}</span>
                {order.isRTO && <span className="px-2 py-0.5 bg-admin-danger-light text-admin-danger rounded text-[9px] font-bold">RTO</span>}
              </div>
              <span className="block text-[11px] text-admin-muted mb-1.5">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="mb-2">
                <b className="block text-[13px] text-admin-text">{order.customer?.name}</b>
                <small className="text-[11px] text-admin-muted">{order.customer?.phone} · {order.customer?.city}, {order.customer?.state}</small>
                <br /><small className="text-[11px] text-admin-muted">{order.customer?.address}{order.customer?.landmark ? `, ${order.customer.landmark}` : ''} — {order.customer?.pincode}</small>
              </div>
              <div className="flex flex-wrap gap-1">
                {order.items?.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-admin-bg rounded text-[11px] text-admin-muted">{item.quantity}× {item.name}</span>
                ))}
              </div>

              {/* Courier / Tracking Info */}
              {order.trackingNumber && (
                <div className="mt-2 flex items-center gap-3 text-[11px]">
                  <span className="text-admin-muted">📦 {order.courierName}</span>
                  <b className="text-admin-text">#{order.trackingNumber}</b>
                  {order.awbNumber && <span className="text-admin-muted">AWB: {order.awbNumber}</span>}
                </div>
              )}
              {order.shiprocket?.awbCode && (
                <div className="mt-2 flex items-center gap-3 text-[11px]">
                  <span className="text-admin-muted">📦 Shiprocket · {order.shiprocket.courierName}</span>
                  <b className="text-admin-text">AWB: {order.shiprocket.awbCode}</b>
                  <span className="text-admin-muted">{order.shiprocket.status}</span>
                </div>
              )}
            </div>

            <div className="text-right flex flex-col items-end gap-2 shrink-0">
              <div className="font-playfair text-lg font-semibold text-admin-text"><Rupee amount={order.total} /></div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-admin-muted block mb-1">Payment</span>
                <Listbox
                  value={{ value: order.paymentStatus, label: order.paymentStatus }}
                  onChange={(option) => updateOrder(order, { paymentStatus: option.value })}
                  data={paymentOptions.map(opt => ({ value: opt, label: opt }))}
                  size="sm"
                  disabled={loading}
                />
                <small className="text-[10px] text-admin-muted">{order.paymentMethod}</small>
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-admin-muted block mb-1">Status</span>
                <Listbox
                  value={{ value: order.status, label: order.status }}
                  onChange={(option) => updateOrder(order, { status: option.value })}
                  data={statusOptions.map(opt => ({ value: opt, label: opt }))}
                  size="sm"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <button className={adminBtnGhost} onClick={() => viewOrderDetail(order)} title="View details">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                <button className={adminBtnGhost} onClick={() => setShippingOrder(order)} title="Shipping / Courier">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </button>
                <button className={`${adminBtnGhost} danger`} onClick={() => setOrderToDelete(order)} title="Delete order">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white border border-admin-border rounded-xl p-5 text-center shadow-card">
            <svg className="w-10 h-10 opacity-40 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            <p className="m-0 text-sm text-admin-muted">No orders yet. Orders will appear here once customers start purchasing.</p>
          </div>
        )}
      </div>
    </div>
  );
}