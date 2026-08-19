import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavItem({ to, icon: Icon, label, isCollapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center w-full rounded-lg text-[13px] font-medium no-underline transition-all duration-150 ${isActive
          ? 'bg-gradient-to-r from-terra/25 to-terra/5 text-white'
          : 'text-[rgba(255,249,241,0.6)] hover:bg-white/[0.06] hover:text-white'
        } ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'}`
      }
      title={isCollapsed ? label : undefined}
      onClick={onNavigate}
    >
      {({ isActive }) => (
        <>
          <span className={`absolute left-0 top-1/2 h-[16px] w-[3px] -translate-y-1/2 rounded-full bg-terra transition-all duration-150 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          <Icon active={isActive} />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

function iconClass(active) {
  return `w-[18px] h-[18px] shrink-0 transition-colors ${active ? 'text-terra opacity-100' : 'opacity-70 group-hover:opacity-90'}`;
}

function DashboardIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ProductsIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" /><path d="M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7" /><path d="M9 5V3h6v2" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function OrdersIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CustomersIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function CollectionsIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="w-[16px] h-[16px] shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function FormsIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6M9 9h1" />
    </svg>
  );
}

function WebsitesIcon({ active }) {
  return (
    <svg className={iconClass(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 010 18 15 15 0 010-18z" />
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

function ChevronIcon({ open }) {
  return (
    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SectionLabel({ children, isCollapsed }) {
  if (isCollapsed) return <div className="my-2 h-px bg-white/10" />;
  return (
    <div className="mb-1 mt-4 px-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(255,249,241,0.32)] first:mt-1">
      {children}
    </div>
  );
}

function SubNavLink({ to, end, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center w-full gap-2.5 px-3 py-2 rounded-md text-[12.5px] font-medium no-underline transition-all ${isActive
          ? 'bg-white/[0.08] text-white'
          : 'text-[rgba(255,249,241,0.5)] hover:bg-white/[0.06] hover:text-white'
        }`
      }
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
      {children}
    </NavLink>
  );
}

function DropdownNav({ icon: Icon, label, isOpen, setIsOpen, isCollapsed, onExpandSidebar, children }) {
  if (isCollapsed) {
    return (
      <button
        onClick={() => { onExpandSidebar(); setTimeout(() => setIsOpen(true), 200); }}
        className="flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-[13px] font-medium text-[rgba(255,249,241,0.6)] no-underline transition-all hover:bg-white/[0.06] hover:text-white border-none bg-transparent cursor-pointer"
        title={label}
      >
        <Icon />
      </button>
    );
  }
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium no-underline transition-all text-[rgba(255,249,241,0.6)] hover:bg-white/[0.06] hover:text-white border-none bg-transparent cursor-pointer"
      >
        <Icon active={isOpen} />
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronIcon open={isOpen} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="flex flex-col ml-[19px] gap-0.5 border-l border-white/10 pl-2.5 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) {
  const [productsOpen, setProductsOpen] = useState(false);
  const [formsOpen, setFormsOpen] = useState(false);
  const sidebarIsCollapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-45 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onMobileClose}
      />

      <aside
        className={`bg-gradient-to-b from-[#241b18] to-[#1a1310] text-[#fff9f1] flex flex-col fixed top-0 left-0 bottom-0 z-50 overflow-x-hidden whitespace-nowrap transition-[width,transform] duration-200 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.18)] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        style={{
          width: isMobileOpen ? 'min(84vw,300px)' : sidebarIsCollapsed ? '76px' : '232px',
        }}
      >
        {/* Logo */}
        <div className={`relative flex min-h-[64px] items-center border-b border-white/10 ${sidebarIsCollapsed ? 'justify-center px-0' : 'px-4 md:px-6'}`}>
          <img
            src="/images/Logo/LOGO.png"
            alt="Velu's Fashtown"
            className="h-auto mx-auto brightness-[10] transition-all duration-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={sidebarIsCollapsed ? { width: '42px' } : { width: '96px' }}
          />
          <button type="button" onClick={onMobileClose} className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-md text-[rgba(255,249,241,0.7)] transition-colors hover:bg-white/10 hover:text-white md:hidden" aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
          <SectionLabel isCollapsed={sidebarIsCollapsed}>Overview</SectionLabel>
          <NavItem to="/admin/dashboard" icon={DashboardIcon} label="Dashboard" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          <NavItem to="/admin/orders" icon={OrdersIcon} label="Orders" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
          <NavItem to="/admin/customers" icon={CustomersIcon} label="Customers" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />

          <SectionLabel isCollapsed={sidebarIsCollapsed}>Catalog</SectionLabel>
          <DropdownNav icon={ProductsIcon} label="Products" isOpen={productsOpen} setIsOpen={setProductsOpen} isCollapsed={sidebarIsCollapsed} onExpandSidebar={onToggle}>
            <SubNavLink to="/admin/Category" onClick={onMobileClose}>Category</SubNavLink>
            <SubNavLink to="/admin/sub-Category" onClick={onMobileClose}>Sub Category</SubNavLink>
            <SubNavLink to="/admin/masters" onClick={onMobileClose}>Masters</SubNavLink>
            <SubNavLink to="/admin/products" onClick={onMobileClose}>Products</SubNavLink>
          </DropdownNav>
          <NavItem to="/admin/collections" icon={CollectionsIcon} label="Collections" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />

          <SectionLabel isCollapsed={sidebarIsCollapsed}>Storefront</SectionLabel>
          <DropdownNav icon={FormsIcon} label="Forms" isOpen={formsOpen} setIsOpen={setFormsOpen} isCollapsed={sidebarIsCollapsed} onExpandSidebar={onToggle}>
            <SubNavLink to="/admin/forms" end onClick={onMobileClose}>Form Builder</SubNavLink>
            <SubNavLink to="/admin/forms/submissions" onClick={onMobileClose}>Form Submissions</SubNavLink>
            <SubNavLink to="/admin/forms/integrations" onClick={onMobileClose}>Integrations</SubNavLink>
          </DropdownNav>
          <NavItem to="/admin/websites" icon={WebsitesIcon} label="Websites" isCollapsed={sidebarIsCollapsed} onNavigate={onMobileClose} />
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-white/10 flex flex-col gap-1">
          {/* View Store link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center rounded-lg text-[12px] font-medium text-[rgba(255,249,241,0.5)] no-underline hover:bg-white/[0.06] hover:text-white transition-colors ${sidebarIsCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3.5 py-2.5'
              }`}
            title={sidebarIsCollapsed ? 'View Store' : undefined}
          >
            <StoreIcon />
            {!sidebarIsCollapsed && <span>View Store</span>}
          </a>

          {/* Collapse toggle button */}
          <button
            onClick={onToggle}
            className={`hidden md:flex items-center rounded-lg text-[12px] font-medium text-[rgba(255,249,241,0.5)] no-underline hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer w-full border-none bg-transparent ${sidebarIsCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3.5 py-2.5'
              }`}
            title={sidebarIsCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon isCollapsed={sidebarIsCollapsed} />
            {!sidebarIsCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
