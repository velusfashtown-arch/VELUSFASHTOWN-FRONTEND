import React from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import Table from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import Rupee from '../../../../components/shared/Rupee';
import StatCard from '../../../../components/shared/StatCard';
import PageHeader from '../../Common/PageHeader';

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function CustomersIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
}
function RepeatIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>;
}
function RevenueIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}
function AvgIcon() {
  return <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
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
      <PageHeader
        icon={<CustomersIcon />}
        title="Customers"
        description="Everyone who has signed up or ordered from Velu's Fashtown."
      />
      {error && <div className="fixed left-4 right-4 top-4 z-50 animate-admin-slide-in rounded-lg border border-admin-danger/20 bg-admin-danger-light px-5 py-3 text-[13px] font-medium text-admin-danger shadow-modal sm:left-auto sm:w-auto">{error}</div>}

      <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[18px]">
        <StatCard icon={<CustomersIcon />} label="Total Customers" value={pagination.total} bgColor="#ecfdf5" iconColor="#059669" />
        <StatCard icon={<RepeatIcon />} label="Repeat On This Page" value={repeatCustomers} bgColor="#f0edf5" iconColor="#6b4fa0" />
        <StatCard icon={<RevenueIcon />} label="Page Revenue" value={<Rupee amount={listedRevenue} />} bgColor="#eef2ff" iconColor="#4f46e5" />
        <StatCard icon={<AvgIcon />} label="Page Average" value={<Rupee amount={customers.length ? listedRevenue / customers.length : 0} />} bgColor="#fffbeb" iconColor="#d97706" />
      </div>

      <Table
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
          { key: 'name', header: 'Customer', render: (customer) => <div><b>{customer.name}</b><small className="block text-admin-muted normal-case">{customer.email}</small></div> },
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