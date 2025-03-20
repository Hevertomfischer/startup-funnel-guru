
import React from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex-col border-r bg-sidebar">
      <SidebarLogo />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
