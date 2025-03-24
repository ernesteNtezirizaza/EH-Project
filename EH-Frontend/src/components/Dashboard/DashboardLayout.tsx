
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  role: 'student' | 'admin' | 'mentor';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <DashboardHeader role={role} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex flex-1 w-full overflow-hidden">
          <DashboardSidebar role={role} collapsed={collapsed} />
          <main className="flex-1 overflow-auto p-6 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
