import React, { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Rupee from '../../../../components/shared/Rupee';
import StatCard from '../../../../components/shared/StatCard';
import PageHeader from '../../Common/PageHeader';

const statusColors = {
  Placed: 'bg-[#f0edf5] text-[#6b4fa0]',
  Confirmed: 'bg-[#e8f0fe] text-[#1a73e8]',
  Packed: 'bg-[#fef7e0] text-[#b47c2e]',
  Shipped: 'bg-[#e6f4ea] text-[#1e8e3e]',
  Delivered: 'bg-[#e6f4ea] text-[#137333]',
  Cancelled: 'bg-[#fce8e6] text-[#c5221f]',
  RTO: 'bg-[#fce8e6] text-[#c5221f]'
};

const CHART_COLORS = ['#4f46e5', '#2563eb', '#d97706', '#059669', '#137333', '#dc2626', '#a74e3e'];

function DollarIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
}
function BoxIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"/><path d="M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7"/><path d="M9 5V3h6v2"/><path d="M9 12l2 2 4-4"/></svg>;
}
function CartIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}
function UserIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
}
function EyeIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function RTODashIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v4"/><path d="M17 15v5"/><path d="M14 15h6"/></svg>;
}

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-admin-border rounded-lg px-3 py-2 shadow-modal text-[12px]">
        <p className="font-semibold text-admin-text mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="text-admin-muted">{entry.name}: <b>{entry.value}</b></p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const token = getToken();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const res = await api.adminGetDashboard(token);
      setDashData(res?.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2.5 text-admin-muted text-sm">
        <div className="w-5 h-5 border-2 border-admin-border border-t-admin-primary rounded-full animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-admin-muted text-sm">
        <p className="m-0">Failed to load dashboard. Please try refreshing.</p>
      </div>
    );
  }

  const {
    products = {}, orders = {}, revenue = {}, revenueTrend = [],
    topSellingProducts = [], customers = {}, lowStockProducts = [],
  } = dashData || {};

  // Order status breakdown, derived from the counts the API already gives us.
  const statusPieData = [
    { name: 'Pending', value: orders.pending || 0 },
    { name: 'Shipped', value: orders.shipped || 0 },
    { name: 'Delivered', value: orders.delivered || 0 },
    { name: 'Cancelled', value: orders.cancelled || 0 },
  ].filter((s) => s.value > 0);

  // Order/revenue trend for the last 14 days.
  const orderTrendData = revenueTrend
    .slice(-14)
    .map((d) => ({ date: d._id, orders: d.orders, revenue: d.revenue }));

  // Top products for display
  const topProductsList = topSellingProducts.slice(0, 5).map((p) => ({
    name: p.name,
    quantity: p.totalQuantity,
    revenue: p.totalRevenue,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live snapshot of orders, revenue and catalog health across Velu's Fashtown."
      />
      {/* ─── Top Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[18px] mb-8">
        <StatCard
          icon={<CartIcon />}
          label="Total Orders"
          value={orders.total || 0}
          sub={`${orders.pending || 0} pending · ${orders.delivered || 0} delivered`}
          bgColor="#eef2ff"
          iconColor="#4f46e5"
        />
        <StatCard
          icon={<DollarIcon />}
          label="Revenue"
          value={<Rupee amount={revenue.total} />}
          sub={<><Rupee amount={revenue.thisMonth} /> this month</>}
          bgColor="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          icon={<BoxIcon />}
          label="Total Products"
          value={products.total || 0}
          sub={`${products.active || 0} active · ${products.outOfStock || 0} out of stock`}
          bgColor="#f0edf5"
          iconColor="#6b4fa0"
        />
        <StatCard
          icon={<UserIcon />}
          label="Total Customers"
          value={customers.totalCustomers || 0}
          sub={`${customers.verifiedCustomers || 0} verified`}
          bgColor="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          icon={<RTODashIcon />}
          label="RTO Orders"
          value={orders.rto || 0}
          sub="Return to origin"
          bgColor="#fef2f2"
          iconColor="#dc2626"
        />
        <StatCard
          icon={<EyeIcon />}
          label="Avg. Order Value"
          value={<Rupee amount={revenue.avgOrderValue} />}
          sub={`${orders.total || 0} orders total`}
          bgColor="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      {/* ─── Charts Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Order Trend Chart */}
        <div className="bg-white border border-admin-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-admin-text">Order Trend (Last 14 Days)</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-admin-muted bg-admin-bg px-2.5 py-0.5 rounded-full">
              {orderTrendData.length} days
            </span>
          </div>
          {orderTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={orderTrendData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={val => val?.slice(5) || ''} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="#4f46e5" fill="url(#orderGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#059669" fill="none" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-admin-muted text-xs">No order data yet</div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white border border-admin-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-admin-text">Low Stock Products</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-admin-muted bg-admin-bg px-2.5 py-0.5 rounded-full">
              {lowStockProducts.length} item{lowStockProducts.length === 1 ? '' : 's'}
            </span>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
              {lowStockProducts.map((product) => (
                <div key={product._id || product.name} className="flex items-center justify-between py-1.5 border-b border-admin-border/50 last:border-0">
                  <span className="text-[12px] text-admin-text truncate">{product.name}</span>
                  <span className="text-[10px] font-semibold text-admin-danger shrink-0">{product.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-admin-muted text-xs">No low stock products</div>
          )}
        </div>

      </div>

      {/* ─── Bottom Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Order Status Breakdown */}
        <div className="bg-white border border-admin-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-admin-text">Order Status</h3>
          </div>
          {statusPieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer className="w-full sm:w-1/2" width="100%" height={160}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={2}>
                    {statusPieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 text-[11px]">
                {statusPieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                    <span className="text-admin-muted">{entry.name}</span>
                    <b className="text-admin-text ml-auto">{entry.value}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-admin-muted text-xs">No orders yet</div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-admin-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-admin-text">Top Selling Products</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-admin-muted bg-admin-bg px-2.5 py-0.5 rounded-full">
              By quantity
            </span>
          </div>
          {topProductsList.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topProductsList.map((product, idx) => (
                <div key={product.name} className="flex items-center justify-between py-1.5 border-b border-admin-border/50 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold text-admin-muted w-4">{idx + 1}.</span>
                    <span className="text-[12px] text-admin-text truncate">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-semibold text-admin-muted">{product.quantity} sold</span>
                    <span className="text-[10px] text-admin-muted">₹{product.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-admin-muted text-xs">No product sales yet</div>
          )}
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="bg-white border border-admin-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-admin-text">Quick Summary</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">Total Orders</span>
              <b className="text-[13px] text-admin-text">{orders.total || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">Pending Orders</span>
              <b className="text-[13px] text-admin-text">{orders.pending || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">This Month Revenue</span>
              <b className="text-[13px] text-admin-text">₹{(revenue.thisMonth || 0).toLocaleString('en-IN')}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">Total Revenue</span>
              <b className="text-[13px] text-admin-text">₹{(revenue.total || 0).toLocaleString('en-IN')}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">Total Customers</span>
              <b className="text-[13px] text-admin-text">{customers.totalCustomers || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-admin-border/50">
              <span className="text-[11px] text-admin-muted">RTO Orders</span>
              <b className="text-[13px] text-admin-danger">{orders.rto || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[11px] text-admin-muted">Avg. Order Value</span>
              <b className="text-[13px] text-admin-text">₹{Math.round(revenue.avgOrderValue || 0).toLocaleString('en-IN')}</b>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}