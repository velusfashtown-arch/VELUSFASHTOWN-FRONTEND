import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../../lib/auth';
import AdminHeader from '../Header/index';
import AdminSidebar from '../Sidebar/index';

export default function AdminLayout({ children, pageTitle }) {
  const nav = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const onLogout = useCallback(() => {
    clearToken();
    nav('/admin');
  }, [nav]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const closeOnDesktop = () => {
      if (!mediaQuery.matches) setMobileSidebarOpen(false);
    };

    closeOnDesktop();
    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileSidebarOpen]);

  // Sidebar width: 72px when collapsed, 220px when expanded
  const sidebarWidth = sidebarCollapsed ? 72 : 220;

  return (
    <div className="flex min-h-screen bg-[#f5f0eb] font-sans">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Main Content */}
<div
        className="flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-200"
        style={{ marginLeft: sidebarWidth + 'px' }}
      >
        <AdminHeader
          pageTitle={pageTitle}
          onLogout={onLogout}
          onMenuToggle={openMobileSidebar}
        />

        <div className="min-w-0 flex-1 p-3 md:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

