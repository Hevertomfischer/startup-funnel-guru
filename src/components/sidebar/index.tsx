
import React from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-sidebar fixed">
      <SidebarLogo />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
