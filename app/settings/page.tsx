"use client";

import { useState } from "react";
import { User, Bell, Lock, Save } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulasi proses simpan ke API
    setTimeout(() => {
      setIsSaving(false);
      alert("Pengaturan berhasil disimpan.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base font-bold text-slate-800 uppercase tracking-wide">
          Pengaturan Sistem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi profil, preferensi aplikasi, dan keamanan akun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menu Navigasi Samping (Khusus Pengaturan) */}
        <div className="col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-slate-800 border-l-2 border-slate-800 text-xs font-semibold text-left uppercase tracking-wide">
            <User size={14} /> Profil Akun
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-transparent text-xs font-medium text-left uppercase tracking-wide transition-colors">
            <Bell size={14} /> Notifikasi
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-transparent text-xs font-medium text-left uppercase tracking-wide transition-colors">
            <Lock size={14} /> Keamanan
          </button>
        </div>

        {/* Area Form Pengaturan */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white border border-slate-200 p-5">
            <h2 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase">
              Informasi Pribadi
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue="Faza Wahyu Adi Putra"
                    className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-500 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Alamat Email</label>
                  <input
                    type="email"
                    defaultValue="faza.admin@diskominfo.go.id"
                    className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-500 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-medium text-slate-600">Peran / Jabatan</label>
                  <input
                    type="text"
                    disabled
                    defaultValue="Staf Kehumasan (Administrator)"
                    className="border border-slate-200 px-3 py-2 text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Hubungi Superadmin untuk mengubah peran kerja Anda.</p>
                </div>
              </div>

              <h2 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-8 uppercase">
                Preferensi Tampilan
              </h2>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-slate-800 cursor-pointer" />
                  <span className="text-xs text-slate-700">Tampilkan angka analitik pada Dashboard Utama</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-slate-800 cursor-pointer" />
                  <span className="text-xs text-slate-700">Terima ringkasan jadwal via email mingguan</span>
                </label>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2 text-xs font-medium hover:bg-slate-700 transition-colors disabled:bg-slate-400"
                >
                  <Save size={14} />
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}