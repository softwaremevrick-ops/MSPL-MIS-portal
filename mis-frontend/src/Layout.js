import { useState, useEffect, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { createPageUrl } from "./components/utils/index";
import User from "./components/entities/User";
import { AuthContext } from "./context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  MapPin,
  Users,
  Clock,
  PieChart,
  LogOut,
  Menu,
  Package,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/Sidebar";
import Button from "./components/ui/Button";

const adminNavigationItems = [
  {
    title: "Dashboard",
    url: "dashboard", // Relative path
    icon: LayoutDashboard,
  },
  {
    title: "Location Wise Report",
    url: "locationreport", // Relative path
    icon: MapPin,
  },
  {
    title: "Last Report Update",
    url: "lastreportupdate", // Relative path
    icon: Clock,
  },
  {
    title: "Man Power Update",
    url: "manpowerreport", // Relative path
    icon: Users,
  },
  {
    title: "Daily Process-Wise",
    url: "dailyprocessreport", // Relative path
    icon: BarChart3,
  },
  {
    title: "Customer Acceptance Report",
    url: "customeracceptancereport", // Relative path
    icon: FileText,
  },
  {
    title: "Power BI Report",
    url: "powerbireport", // Relative path
    icon: PieChart,
  },
  {
    title: "Inventory Control",
    url: "inventorycontrol", // Relative path
    icon: Package,
  },
];

const managerNavigationItems = [
  {
    title: "Dashboard",
    url: "manpowerdashboard", // Relative path
    icon: LayoutDashboard,
  },
  {
    title: "Manage Activities",
    url: "activitysubmission", // Relative path
    icon: FileText,
  },
  {
    title: "Inventory Control",
    url: "inventorycontrol", // Relative path
    icon: Settings,
  },
];

const manpowerNavigationItems = [
  {
    title: "Dashboard",
    url: "manpowerdashboard", // Relative path
    icon: LayoutDashboard,
  },
  {
    title: "Daily Activity Submission",
    url: "activitysubmission", // Relative path
    icon: Upload,
  },
  {
    title: "My Submissions",
    url: "mysubmissions", // Relative path
    icon: FileText,
  },
  {
    title: "Help",
    url: "help", // Relative path
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  let navigationItems = [];
  let panelTitle = "MIS Portal";

  if (user) {
    switch (user.role) {
      case 'admin':
        navigationItems = adminNavigationItems;
        panelTitle = 'Admin Panel';
        break;
      case 'userType1': // Manager role
        navigationItems = managerNavigationItems;
        panelTitle = 'Manager Panel';
        break;
      case 'userType2': // Manpower role
        navigationItems = manpowerNavigationItems;
        panelTitle = 'Manpower Panel';
        break;
      default:
        // Handle unexpected role or no role
        navigationItems = [];
        panelTitle = 'Guest Panel';
        break;
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 bg-blue-600 text-white">
          <SidebarHeader className="border-b border-white p-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ed4b427f_MEVRICKLOGO-01.png" 
                alt="Mevrick Solution" 
                className="w-12 h-12 object-contain bg-white rounded-lg p-1"
              />
              <div>
                <h2 className="font-bold text-white text-sm">SBI PROJECT UPDATES</h2>
                <p className="text-xs text-white">{panelTitle}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-0">
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="mx-2">
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:text-white p-3 transition-colors duration-200 rounded-lg h-12 ${
                          location.pathname === item.url 
                            ? 'text-white' 
                            : 'hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 inline m-2" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.full_name ? user.full_name[0] : 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    Welcome, {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-white truncate capitalize">
                    {user?.role || 'Guest'}
                  </p>
                </div>
              </div>
              <Button
                // variant="ghost"
                size="icon"
                onClick={logout}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-blue-700">SBI Project Updates MIS</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-500 font-semibold">Welcome, {user?.full_name || 'User'}</span>
              <Button
                onClick={logout}
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                LOGOUT
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}