"use client";

import { useState } from "react";
import { Home, Calendar, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Konfigurasi Menu Navigasi
  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Jadwal Kampanye", icon: Calendar, href: "/campaigns" },
    { name: "Pengaturan", icon: Settings, href: "/settings" },
  ];

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          
          {/* Overlay Transparan untuk Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar Area */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                SIMAKI Dashboard
              </span>
              <button
                className="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="p-4 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)} // Tutup sidebar di mobile setelah klik
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Header Khusus Mobile (Menampilkan tombol hamburger) */}
            <header className="md:hidden flex items-center h-16 px-4 bg-white border-b border-slate-200">
              <button
                className="text-slate-500 hover:text-slate-800 focus:outline-none"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <span className="ml-4 text-sm font-semibold text-slate-800">
                Menu Utama
              </span>
            </header>

            {/* Area Render Halaman Dinamis */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {children}
            </main>
          </div>
          
        </div>
      </body>
    </html>
  );
}