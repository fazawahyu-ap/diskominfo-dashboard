"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, RefreshCw, Edit, Trash2, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Campaign {
  id: number;
  title: string;
  platform: string;
  status: string;
  scheduled_date: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // State untuk Fitur Pencarian & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    platform: "Instagram",
    status: "draft",
    scheduled_date: "",
  });

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/campaigns", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(response.data.data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
      toast.error("Gagal memuat data kampanye.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/campaigns/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/campaigns", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      resetForm();
      fetchCampaigns();
      toast.success(editId ? "Perubahan berhasil disimpan!" : "Jadwal baru berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      toast.error("Gagal menyimpan data. Periksa koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kampanye ini?")) return;
    const toastId = toast.loading("Menghapus data...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCampaigns();
      toast.success("Data berhasil dihapus!", { id: toastId });
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      toast.error("Gagal menghapus data.", { id: toastId });
    }
  };

  const handleEditClick = (camp: Campaign) => {
    const dateObj = new Date(camp.scheduled_date);
    const localDateTime = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setFormData({
      title: camp.title,
      platform: camp.platform,
      status: camp.status,
      scheduled_date: localDateTime,
    });
    setEditId(camp.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ title: "", platform: "Instagram", status: "draft", scheduled_date: "" });
    setEditId(null);
    setIsFormOpen(false);
  };

  // LOGIKA PENCARIAN & FILTER
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || camp.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-800 uppercase tracking-wide">
            Jadwal Kampanye & Sosialisasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen publikasi konten pada berbagai saluran komunikasi.
          </p>
        </div>
        <button
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
        >
          {isFormOpen ? <X size={14} /> : <Plus size={14} />}
          {isFormOpen ? "Tutup Form" : "Tambah Data"}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wide border-b border-slate-100 pb-2">
            {editId ? "Edit Jadwal Kampanye" : "Form Jadwal Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Judul Kampanye</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800" placeholder="Cth: Sosialisasi Literasi Digital" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platform Publikasi</label>
              <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800">
                <option value="Instagram">Instagram</option>
                <option value="Website">Website Instansi</option>
                <option value="Spanduk">Spanduk / Baliho</option>
                <option value="WhatsApp">WhatsApp Blast</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Pelaksanaan</label>
              <input type="datetime-local" required value={formData.scheduled_date} onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })} className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-800 bg-slate-50 text-slate-800">
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled (Terjadwal)</option>
                <option value="published">Published (Selesai)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
              {editId && (
                <button type="button" onClick={resetForm} className="bg-white border border-slate-300 text-slate-600 px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">Batal</button>
              )}
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:bg-slate-400">
                {isSubmitting ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Simpan Jadwal")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER AREA BARU */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-100 p-3 border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="CARI JUDUL KAMPANYE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:outline-none focus:border-slate-800 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={14} className="text-slate-500 hidden md:block" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:border-slate-800 bg-white font-semibold text-slate-600 uppercase tracking-wider"
          >
            <option value="all">SEMUA STATUS</option>
            <option value="draft">DRAFT</option>
            <option value="scheduled">TERJADWAL</option>
            <option value="published">SELESAI</option>
          </select>
        </div>
      </div>

      <div className="border border-slate-200 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Daftar Kampanye</h2>
          <button onClick={fetchCampaigns} className="text-slate-500 hover:text-slate-800 transition-colors" title="Refresh Data">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                <th className="px-5 py-3">Judul</th>
                <th className="px-5 py-3">Platform</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400 uppercase tracking-widest text-[11px] font-bold">Memuat data...</td></tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400 uppercase tracking-widest text-[11px] font-bold">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800">{camp.title}</td>
                    <td className="px-5 py-3">{camp.platform}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        camp.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        camp.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {new Date(camp.scheduled_date).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(camp)} className="p-1.5 text-slate-400 hover:text-slate-800 border border-transparent hover:border-slate-300 hover:bg-white transition-all"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(camp.id)} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}