"use client";

import { useState, useEffect } from "react";
import { Home, Calendar, Settings, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import "./globals.css"; // <--- INI ADALAH BARIS KRUSIAL YANG MEMUAT DESAIN

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  // Sistem Penjaga Gerbang (Route Protection)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !isLoginPage) {
      router.push("/login");
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [isLoginPage, router]);

  // Fungsi Logout
  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Jadwal Kampanye", icon: Calendar, href: "/campaigns" },
    { name: "Pengaturan", icon: Settings, href: "/settings" },
  ];

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        
        {/* Komponen Toaster Global dengan desain kaku (sharp edges) */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '0px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />

        {isLoginPage ? (
          <main className="min-h-screen flex items-center justify-center">
            {children}
          </main>
        ) : (
          <div className="flex h-screen overflow-hidden">
            
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-800 tracking-tight uppercase">
                  SIMAKI Portal
                </span>
                <button
                  className="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="p-4 space-y-1.5 flex-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-colors duration-200 ${
                        isActive
                          ? "bg-slate-100 text-slate-900 font-bold border-l-2 border-slate-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium border-l-2 border-transparent"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs uppercase tracking-wider">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 hover:bg-red-50 hover:text-red-700 font-medium transition-colors duration-200 border-l-2 border-transparent"
                >
                  <LogOut size={18} />
                  <span className="text-xs uppercase tracking-wider">Keluar</span>
                </button>
              </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <header className="md:hidden flex items-center h-16 px-4 bg-white border-b border-slate-200">
                <button
                  className="text-slate-500 hover:text-slate-800 focus:outline-none"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <span className="ml-4 text-sm font-bold text-slate-800 uppercase tracking-widest">
                  Menu Utama
                </span>
              </header>

              <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {children}
              </main>
            </div>
            
          </div>
        )}
      </body>
    </html>
  );
}