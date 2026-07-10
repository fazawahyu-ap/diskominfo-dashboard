"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Eye, MousePointerClick, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mendefinisikan struktur tipe data dari API Laravel
interface DashboardData {
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
}

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fungsi untuk menarik data dari API Laravel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mengarahkan Axios ke server lokal Laravel kamu
        const response = await axios.get("http://127.0.0.1:8000/api/dashboard-summary");
        setSummaryData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Menyiapkan format data untuk grafik Recharts
  const chartData = summaryData
    ? [
        { name: "Reach", value: summaryData.total_reach, fill: "#64748b" }, // slate-500
        { name: "Impressions", value: summaryData.total_impressions, fill: "#475569" }, // slate-600
        { name: "Engagement", value: summaryData.total_engagement, fill: "#334155" }, // slate-700
      ]
    : [];

  // Tampilan saat data sedang dimuat
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <Activity className="animate-spin mb-4" size={32} />
        <p>Memuat data analitik...</p>
      </div>
    );
  }

  // Tampilan saat API gagal dihubungi (misal server Laravel mati)
  if (isError || !summaryData) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-lg text-red-600">
        <p className="font-semibold">Gagal memuat data dari server.</p>
        <p className="text-sm mt-1">Pastikan server Laravel berjalan di http://127.0.0.1:8000</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Kampanye Publik</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pantauan performa metrik seluruh saluran komunikasi Diskominfo
        </p>
      </div>

      {/* Tampilan Kartu Ringkasan (Stat Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Reach</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {summaryData.total_reach.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Impressions</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {summaryData.total_impressions.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
              <MousePointerClick size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Engagement</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {summaryData.total_engagement.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Area Grafik Batang */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Perbandingan Metrik Utama</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}