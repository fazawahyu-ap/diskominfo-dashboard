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

interface DashboardData {
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
}

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/dashboard-summary", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  const chartData = summaryData
    ? [
        { name: "Reach", value: summaryData.total_reach, fill: "#64748b" },
        { name: "Impressions", value: summaryData.total_impressions, fill: "#475569" },
        { name: "Engagement", value: summaryData.total_engagement, fill: "#334155" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <Activity className="animate-spin mb-4" size={24} />
        <p className="text-xs uppercase tracking-widest">Memuat data...</p>
      </div>
    );
  }

  if (isError || !summaryData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600">
        <p className="text-sm font-bold uppercase tracking-wide">Gagal memuat data</p>
        <p className="text-xs mt-1">Pastikan server API berjalan dan Anda memiliki akses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base font-bold text-slate-800 uppercase tracking-wide">
          Ringkasan Kampanye Publik
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pantauan performa metrik seluruh saluran komunikasi Diskominfo.
        </p>
      </div>

      {/* Tampilan Kartu Ringkasan (Stat Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Reach</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {summaryData.total_reach.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Impressions</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {summaryData.total_impressions.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600">
              <MousePointerClick size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Engagement</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {summaryData.total_engagement.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Area Grafik Batang */}
      <div className="bg-white p-6 border border-slate-200 h-96 flex flex-col">
        <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 mb-6">
          Perbandingan Metrik Utama
        </h2>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '0px', // Menghapus sudut melengkung pada tooltip
                  border: '1px solid #e2e8f0', 
                  boxShadow: 'none',
                  fontSize: '12px'
                }}
              />
              {/* Radius diatur ke 0 agar grafik batang berbentuk kotak kaku */}
              <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}