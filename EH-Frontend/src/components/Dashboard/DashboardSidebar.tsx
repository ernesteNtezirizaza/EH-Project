
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutDashboard,
  User,
  Users,
  FileText,
  Bell,
  Settings,
  BookOpen,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

interface DashboardSidebarProps {
  role: 'student' | 'admin' | 'mentor';
  collapsed: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role, collapsed }) => {
  // Define navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { 
        name: 'Dashboard', 
        path: `/dashboard/${role}`, 
        icon: <LayoutDashboard className="w-5 h-5" /> 
      },
      { 
        name: 'Profile', 
        path: `/dashboard/${role}/profile`, 
        icon: <User className="w-5 h-5" /> 
      }
    ];
    
    switch (role) {
      case 'student':
        return [
          ...commonItems,
          {
            name: 'Available Quizzes',
            path: '/dashboard/student/quizzes',
            icon: <BookOpen className="w-5 h-5" />
          },
          {
            name: 'My Progress',
            path: '/dashboard/student/progress',
            icon: <CheckCircle className="w-5 h-5" />
          }
        ];
      case 'admin':
        return [
          ...commonItems,
          {
            name: 'User Management',
            path: '/dashboard/admin/users',
            icon: <Users className="w-5 h-5" />
          },
          {
            name: 'Quiz Management',
            path: '/dashboard/admin/quizzes',
            icon: <FileText className="w-5 h-5" />
          },
          {
            name: 'User Progress',
            path: '/dashboard/admin/progress',
            icon: <CheckCircle className="w-5 h-5" />
          }
        ];
      case 'mentor':
        return [
          ...commonItems,
          {
            name: 'Student Progress',
            path: '/dashboard/mentor/progress',
            icon: <CheckCircle className="w-5 h-5" />
          },
          {
            name: 'Pending Submissions',
            path: '/dashboard/mentor/submissions',
            icon: <FileText className="w-5 h-5" />
          },
          {
            name: 'Student Support',
            path: '/dashboard/mentor/support',
            icon: <MessageSquare className="w-5 h-5" />
          }
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div
      className={cn(
        "sidebar bg-white dark:bg-gray-900 border-r h-full transition-all duration-300 ease-in-out overflow-y-auto",
        collapsed ? "w-[70px]" : "w-60"
      )}
    >
      <div className="p-4">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Home className="w-5 h-5 text-primary" />
          {!collapsed && <span>Empower Her</span>}
        </NavLink>
      </div>
      
      <div className="flex flex-col gap-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/dashboard/${role}`}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-secondary",
              isActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
