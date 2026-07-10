"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { User, Bell, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Dikosongkan, hanya diisi jika ingin diganti
  });

  // Tarik data profil saat ini
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          password: "",
        });
      } catch (error) {
        toast.error("Gagal memuat profil pengguna.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan...");

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:8000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Kosongkan kolom sandi setelah berhasil disimpan
      setFormData(prev => ({ ...prev, password: "" }));
      toast.success("Profil berhasil diperbarui!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui profil.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">Memuat profil...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base font-bold text-slate-800 uppercase tracking-wide">
          Pengaturan Sistem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi profil, preferensi aplikasi, dan keamanan akun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-slate-800 border-l-2 border-slate-800 text-xs font-bold text-left uppercase tracking-wide">
            <User size={14} /> Profil Akun
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-transparent text-xs font-semibold text-left uppercase tracking-wide transition-colors">
            <Bell size={14} /> Notifikasi
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-transparent text-xs font-semibold text-left uppercase tracking-wide transition-colors">
            <Lock size={14} /> Keamanan
          </button>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-white border border-slate-200 p-5">
            <h2 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wide">
              Informasi Pribadi & Kredensial
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Peran / Jabatan</label>
                  <input
                    type="text"
                    disabled
                    value="Administrator (Super User)"
                    className="border border-slate-200 px-3 py-2 text-xs bg-slate-100 text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ganti Kata Sandi (Opsional)</label>
                  <input
                    type="password"
                    placeholder="Biarkan kosong jika tidak ingin mengganti sandi"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:bg-slate-400"
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