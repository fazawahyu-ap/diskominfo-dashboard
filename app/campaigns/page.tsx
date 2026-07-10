"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, RefreshCw } from "lucide-react";

// Struktur Tipe Data
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

  // State untuk Form Input
  const [formData, setFormData] = useState({
    title: "",
    platform: "Instagram",
    status: "draft",
    scheduled_date: "",
  });

  // Fungsi Tarik Data API
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/campaigns");
      setCampaigns(response.data.data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fungsi Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/campaigns", formData);
      // Reset form dan tutup
      setFormData({ title: "", platform: "Instagram", status: "draft", scheduled_date: "" });
      setIsFormOpen(false);
      // Refresh tabel
      fetchCampaigns();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
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
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition-colors"
        >
          {isFormOpen ? <X size={14} /> : <Plus size={14} />}
          {isFormOpen ? "Tutup Form" : "Tambah Data"}
        </button>
      </div>

      {/* Area Form Input (Muncul jika isFormOpen true) */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200 p-4">
          <h2 className="text-xs font-semibold text-slate-700 mb-3 uppercase">Form Jadwal Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Judul Kampanye</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500 bg-white"
                placeholder="Cth: Sosialisasi Literasi Digital"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Platform Publikasi</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500 bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="Website">Website Instansi</option>
                <option value="Spanduk">Spanduk / Baliho</option>
                <option value="WhatsApp">WhatsApp Blast</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Tanggal Pelaksanaan</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500 bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled (Terjadwal)</option>
                <option value="published">Published (Selesai)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-800 text-white px-4 py-1.5 text-xs font-medium hover:bg-slate-700 transition-colors disabled:bg-slate-400"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Area Tabel Data */}
      <div className="border border-slate-200 bg-white">
        <div className="flex items-center justify-between p-3 border-b border-slate-200">
          <h2 className="text-xs font-semibold text-slate-700 uppercase">Daftar Kampanye</h2>
          <button onClick={fetchCampaigns} className="text-slate-500 hover:text-slate-800" title="Refresh Data">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data kampanye.
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{camp.title}</td>
                    <td className="px-4 py-3">{camp.platform}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        camp.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                        camp.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(camp.scheduled_date).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
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