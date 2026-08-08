import React, { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const statusColors = {
  Placed: 'bg-[#f0edf5] text-[#6b4fa0]',
  Confirmed: 'bg-[#e8f0fe] text-[#1a73e8]',
  Packed: 'bg-[#fef7e0] text-[#b47c2e]',
  Shipped: 'bg-[#e6f4ea] text-[#1e8e3e]',
  Delivered: 'bg-[#e6f4ea] text-[#137333]',
  Cancelled: 'bg-[#fce8e6] text-[#c5221f]',
  RTO: 'bg-[#fce8e6] text-[#c5221f]'
};

const CHART_COLORS = ['#6b4fa0', '#1a73e8', '#b47c2e', '#1e8e3e', '#137333', '#c5221f', '#a74e3e'];

function StatCard({ icon, label, value, sub, bgColor, iconColor, trend }) {
  return (
    <div className="bg-paper border border-line rounded-xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bgColor, color: iconColor }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted mb-1">{label}</div>
        <div className="font-playfair text-[26px] font-semibold tracking-[-0.03em] text-ink leading-none">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted">{sub}</span>
          {trend !== undefined && (
            <span className={`text-[10px] font-semibold ${trend >= 0 ? 'text-[#137333]' : 'text-[#c5221f]'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className="bg-paper border border-line rounded-lg px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[12px]">
        <p className="font-semibold text-ink mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="text-muted">{entry.name}: <b>{entry.value}</b></p>
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
      const data = await api.adminGetDashboard(token);
      setDashData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2.5 text-muted text-sm">
        <div className="w-5 h-5 border-2 border-[rgba(47,31,25,0.12)] border-t-terra rounded-full admin-spinner" />
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-muted text-sm">
        <p className="m-0">Failed to load dashboard. Please try refreshing.</p>
      </div>
    );
  }

  const { visits = {}, orders = {}, revenue = {}, topProducts = [], rto = {} } = dashData || {};

  // Prepare pie chart data for order status
  const statusPieData = Object.entries(orders.statusBreakdown || {}).map(([name, value]) => ({ name, value }));

  // Format trend data for chart
  const orderTrendData = (orders.trend || []).slice(-14); // Last 14 days

  // Visit trend data
  const visitTrendData = (visits.trend || []).slice(-14);

  // Top products for display
  const topProductsList = topProducts.slice(0, 5);

  return (
    <div>
      {/* ─── Top Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[18px] mb-8">
        <StatCard
          icon={<EyeIcon />}
          label="Today's Visits"
          value={visits.today || 0}
          sub={`${visits.todayUnique || 0} unique visitors`}
          bgColor="#fef7e0"
          iconColor="#b47c2e"
        />
        <StatCard
          icon={<CartIcon />}
          label="Total Orders"
          value={orders.total || 0}
          sub={`${orders.today || 0} today · ${orders.thisMonth || 0} this month`}
          bgColor="#e8f0fe"
          iconColor="#1a73e8"
        />
        <StatCard
          icon={<DollarIcon />}
          label="Revenue"
          value={`₹${(revenue.total || 0).toLocaleString('en-IN')}`}
          sub={`₹${(revenue.thisMonth || 0).toLocaleString('en-IN')} this month`}
          bgColor="#e6f4ea"
          iconColor="#1e8e3e"
        />
        <StatCard
          icon={<BoxIcon />}
          label="Total Products"
          value={topProducts.length > 0 ? topProducts[0]?.name || '—' : '—'}
          sub={`${topProductsList.length} top selling`}
          bgColor="#f0edf5"
          iconColor="#6b4fa0"
        />
        <StatCard
          icon={<RTODashIcon />}
          label="RTO Orders"
          value={rto.count || 0}
          sub={`₹${(rto.revenue || 0).toLocaleString('en-IN')} affected`}
          bgColor="#fce8e6"
          iconColor="#c5221f"
        />
        <StatCard
          icon={<UserIcon />}
          label="Total Visits (All Time)"
          value={(visits.total || 0).toLocaleString()}
          sub={`${(visits.totalUnique || 0).toLocaleString()} unique IPs`}
          bgColor="#e6f4ea"
          iconColor="#137333"
        />
      </div>

      {/* ─── Charts Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Order Trend Chart */}
        <div className="bg-paper border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-ink">Order Trend (Last 14 Days)</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-muted bg-[rgba(47,31,25,0.06)] px-2.5 py-0.5 rounded-full">
              {orderTrendData.length} days
            </span>
          </div>
          {orderTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={orderTrendData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a74e3e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a74e3e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,31,25,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#756b65' }} tickFormatter={val => val?.slice(5) || ''} />
                <YAxis tick={{ fontSize: 10, fill: '#756b65' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="#a74e3e" fill="url(#orderGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1e8e3e" fill="none" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted text-xs">No order data yet</div>
          )}
        </div>

        {/* Visit Trend Chart */}
        <div className="bg-paper border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-ink">Visit Trend (Last 14 Days)</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-muted bg-[rgba(47,31,25,0.06)] px-2.5 py-0.5 rounded-full">
              {visitTrendData.length} days
            </span>
          </div>
          {visitTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visitTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,31,25,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#756b65' }} tickFormatter={val => val?.slice(5) || ''} />
                <YAxis tick={{ fontSize: 10, fill: '#756b65' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Visits" fill="#b47c2e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unique" name="Unique" fill="#6b4fa0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted text-xs">No visit data yet</div>
          )}
        </div>

      </div>

      {/* ─── Bottom Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Order Status Breakdown */}
        <div className="bg-paper border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-ink">Order Status</h3>
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
                    <span className="text-muted">{entry.name}</span>
                    <b className="text-ink ml-auto">{entry.value}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-muted text-xs">No orders yet</div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-paper border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-ink">Top Selling Products</h3>
            <span className="text-[10px] font-semibold tracking-[0.05em] text-muted bg-[rgba(47,31,25,0.06)] px-2.5 py-0.5 rounded-full">
              By quantity
            </span>
          </div>
          {topProductsList.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topProductsList.map((product, idx) => (
                <div key={product.name} className="flex items-center justify-between py-1.5 border-b border-[rgba(47,31,25,0.06)] last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold text-muted w-4">{idx + 1}.</span>
                    <span className="text-[12px] text-ink truncate">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-semibold text-muted">{product.quantity} sold</span>
                    <span className="text-[10px] text-muted">₹{product.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-muted text-xs">No product sales yet</div>
          )}
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="bg-paper border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-sm font-semibold text-ink">Quick Summary</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">Total Orders</span>
              <b className="text-[13px] text-ink">{orders.total || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">Orders Today</span>
              <b className="text-[13px] text-ink">{orders.today || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">This Month Revenue</span>
              <b className="text-[13px] text-ink">₹{(revenue.thisMonth || 0).toLocaleString('en-IN')}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">Total Revenue</span>
              <b className="text-[13px] text-ink">₹{(revenue.total || 0).toLocaleString('en-IN')}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">Total Visits</span>
              <b className="text-[13px] text-ink">{(visits.total || 0).toLocaleString()}</b>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(47,31,25,0.06)]">
              <span className="text-[11px] text-muted">RTO Orders</span>
              <b className="text-[13px] text-[#c5221f]">{rto.count || 0}</b>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[11px] text-muted">Avg. Order Value</span>
              <b className="text-[13px] text-ink">₹{orders.total > 0 ? Math.round((revenue.total || 0) / orders.total).toLocaleString('en-IN') : 0}</b>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

