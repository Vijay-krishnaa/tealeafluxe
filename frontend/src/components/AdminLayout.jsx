import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Image as ImageIcon,
  LayoutDashboard,
  Leaf,
  LogOut,
  Megaphone,
  Menu,
  Shield,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const navLinks = [
    { name: "Products", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Hero Slides", path: "/admin/hero-slides", icon: ImageIcon },
    { name: "Banner Offers", path: "/admin/banner-offers", icon: Megaphone },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Admins", path: "/admin/admins", icon: Shield },
    { name: "Stats / Analytics", path: "/admin/stats", icon: BarChart3 },
    { name: "Activity Logs", path: "#", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Leaf size={18} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground leading-none">
                Swadistchai
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            className="ml-auto lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 lg:hidden bg-card border-b border-border flex items-center px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 text-foreground/70 hover:bg-muted rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="font-display font-semibold">Admin Dashboard</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
