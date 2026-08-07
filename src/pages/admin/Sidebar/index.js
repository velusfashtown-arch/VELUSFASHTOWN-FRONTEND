import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavItem({ to, icon: Icon, label, isCollapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item-link flex items-center w-full  px-3.5 py-2.5 rounded-lg text-sm font-medium no-underline transition-all ${
          isActive
            ? 'bg-[rgba(167,78,62,0.2)] text-white'
            : 'text-[rgba(255,249,241,0.65)] hover:bg-[rgba(255,249,241,0.08)] hover:text-white'
        } ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`
      }
      title={isCollapsed ? label : undefined}
      onClick={onNavigate}
    >
      <Icon />
      {!isCollapsed && <span className="sidebar-label">{label}</span>}
    </NavLink>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" /><path d="M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7" /><path d="M9 5V3h6v2" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

function CollectionsIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CollapseIcon({ isCollapsed }) {
  return (
    <svg
      className="w-[16px] h-[16px] shrink-0 transition-transform duration-200"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default function AdminSidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) {
  const [CategoryOpen, setCategoryOpen] = useState(false);
  const sidebarIsCollapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`admin-sidebar-backdrop ${isMobileOpen ? 'is-visible' : ''}`}
        onClick={onMobileClose}
      />

      <aside
        className={`
          admin-sidebar bg-[#241b18] text-[#fff9f1] flex flex-col fixed top-0 left-0 bottom-0 z-50
          ${sidebarIsCollapsed ? 'collapsed' : 'expanded'}
          ${isMobileOpen ? 'is-open' : ''}
        `}
      >
        {/* Logo */}
        <div className="sidebar-logo-wrap relative flex min-h-[60px] items-center justify-center border-b border-[rgba(255,249,241,0.1)] px-3 md:px-7">
          <img
            src="/images/Logo/LOGO.png"
            alt="Velu's Fashtown"
            className="h-auto w-[83px] brightness-[10] transition-all duration-200"
            style={sidebarIsCollapsed ? { width: '40px' } : {}}
          />
          <button type="button" onClick={onMobileClose} className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-md text-[rgba(255,249,241,0.7)] transition-colors hover:bg-[rgba(255,249,241,0.1)] hover:text-white lg:hidden" aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <NavItem to="/admin/dashboard" icon={DashboardIcon} label="Dashboard" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          <NavItem to="/admin/products" icon={ProductsIcon} label="Products" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          <NavItem to="/admin/orders" icon={OrdersIcon} label="Orders" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          <NavItem to="/admin/customers" icon={CustomersIcon} label="Customers" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          
          {/* Category Dropdown */}
          {sidebarIsCollapsed ? (
            <button
              onClick={() => { onToggle(); setTimeout(() => setCategoryOpen(true), 200); }}
              className="nav-item-link flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium text-[rgba(255,249,241,0.65)] no-underline transition-all hover:bg-[rgba(255,249,241,0.08)] hover:text-white"
              title="Category"
            >
              <CategoryIcon />
            </button>
          ) : (
            <div className="flex flex-col">
              <button
                onClick={() => setCategoryOpen(!CategoryOpen)}
                className={`nav-item-link flex items-center w-full px-3.5 py-2.5 rounded-lg text-sm font-medium no-underline transition-all text-[rgba(255,249,241,0.65)] hover:bg-[rgba(255,249,241,0.08)] hover:text-white gap-3`}
              >
                <CategoryIcon />
                <span className="sidebar-label flex-1 text-left">Category</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${CategoryOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {CategoryOpen && (
                <div className="flex flex-col ml-2 mt-0.5 gap-0.5 border-l border-[rgba(255,249,241,0.1)] pl-2">
                  <NavLink
                    to="/admin/Category"
                    onClick={onMobileClose}
                    className={({ isActive }) =>
                      `nav-item-link flex items-center w-full px-3 py-2 rounded-lg text-xs font-medium no-underline transition-all ${
                        isActive
                          ? 'bg-[rgba(167,78,62,0.2)] text-white'
                          : 'text-[rgba(255,249,241,0.55)] hover:bg-[rgba(255,249,241,0.08)] hover:text-white'
                      } gap-2`
                    }
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    Category
                  </NavLink>
                  <NavLink
                    to="/admin/sub-Category"
                    onClick={onMobileClose}
                    className={({ isActive }) =>
                      `nav-item-link flex items-center w-full px-3 py-2 rounded-lg text-xs font-medium no-underline transition-all ${
                        isActive
                          ? 'bg-[rgba(167,78,62,0.2)] text-white'
                          : 'text-[rgba(255,249,241,0.55)] hover:bg-[rgba(255,249,241,0.08)] hover:text-white'
                      } gap-2`
                    }
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    Sub Category
                  </NavLink>
                </div>
              )}
            </div>
          )}
          
          <NavItem to="/admin/collections" icon={CollectionsIcon} label="Collections" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-[rgba(255,249,241,0.1)] flex flex-col gap-2">
          {/* View Store link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`nav-item-link flex items-center rounded-lg text-[12px] font-medium text-[rgba(255,249,241,0.5)] no-underline hover:bg-[rgba(255,249,241,0.08)] hover:text-white transition-colors ${
              sidebarIsCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3.5 py-2.5'
            }`}
            title={sidebarIsCollapsed ? 'View Store' : undefined}
          >
            <StoreIcon />
            {!sidebarIsCollapsed && <span className="sidebar-label">View Store</span>}
          </a>

          {/* Collapse toggle button */}
          <button
            onClick={onToggle}
            className={`nav-item-link flex items-center rounded-lg text-[12px] font-medium text-[rgba(255,249,241,0.5)] no-underline hover:bg-[rgba(255,249,241,0.08)] hover:text-white transition-colors cursor-pointer w-full border-none bg-transparent ${
              sidebarIsCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3.5 py-2.5'
            }`}
            title={sidebarIsCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon isCollapsed={sidebarIsCollapsed} />
            {!sidebarIsCollapsed && <span className="sidebar-label">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

