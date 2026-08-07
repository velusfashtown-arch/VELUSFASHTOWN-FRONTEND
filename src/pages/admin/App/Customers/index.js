import React from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import Table from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export default function AdminCustomers() {
  const token = getToken();

  const {
    rows: customers,
    loading,
    refreshing,
    error,
    pagination,
    refresh: loadCustomers,
    goToPage,
    changePageSize,
    searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListCustomers(token, params),
  });

  const listedRevenue = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
  const repeatCustomers = customers.filter((customer) => customer.totalOrders > 1).length;

  return (
    <div>
      {error && <div className="fixed top-4 right-4 z-50 rounded-lg border border-[rgba(197,34,31,0.15)] bg-[#fce8e6] px-5 py-3 text-[13px] font-medium text-[#c5221f] shadow-[0_4px_16px_rgba(47,31,25,0.12)] admin-toast">{error}</div>}

      <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        <div className="rounded-lg border border-line bg-paper px-4 py-3.5"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Total Customers</span><b className="font-playfair text-[22px] font-semibold text-ink">{pagination.total}</b></div>
        <div className="rounded-lg border border-line bg-paper px-4 py-3.5"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Repeat On This Page</span><b className="font-playfair text-[22px] font-semibold text-ink">{repeatCustomers}</b></div>
        <div className="rounded-lg border border-line bg-paper px-4 py-3.5"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Page Revenue</span><b className="font-playfair text-[22px] font-semibold text-ink">{formatCurrency(listedRevenue)}</b></div>
        <div className="rounded-lg border border-line bg-paper px-4 py-3.5"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Page Average</span><b className="font-playfair text-[22px] font-semibold text-ink">{formatCurrency(customers.length ? listedRevenue / customers.length : 0)}</b></div>
      </div>

      <Table
        title="All Customers"
        rows={customers}
        loading={loading}
        refreshing={refreshing}
        searchKeys={['name', 'email', 'phone']}
        onRefresh={loadCustomers}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onServerSearch={searchTable}
        emptyMessage="No customers yet. Customer data will appear once accounts are created."
        columns={[
          { key: 'name', header: 'Customer', render: (customer) => <div><b>{customer.name}</b><small className="block text-muted normal-case">{customer.email}</small></div> },
          { key: 'phone', header: 'Contact', render: (customer) => customer.phone || '—' },
          { key: 'totalOrders', header: 'Orders', render: (customer) => customer.totalOrders || 0 },
          { key: 'totalSpent', header: 'Total Spent', render: (customer) => formatCurrency(customer.totalSpent) },
          { key: 'isVerified', header: 'Verified', render: (customer) => customer.isVerified ? 'Yes' : 'No' },
          { key: 'createdAt', header: 'Joined', render: (customer) => new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
        ]}
      />
    </div>
  );
}
