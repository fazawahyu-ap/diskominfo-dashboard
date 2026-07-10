"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mengirim kredensial ke API Laravel
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      // Menyimpan "tiket masuk" ke browser
      localStorage.setItem("token", response.data.access_token);
      
      // Menendang pengguna masuk ke halaman utama Dashboard
      router.push("/");
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Akses ditolak! Cek kembali email dan kata sandi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-slate-900 text-white mb-4">
          <Lock size={24} />
        </div>
        <h1 className="text-lg font-bold text-slate-900 tracking-widest uppercase">
          SIMAKI Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
          Otorisasi Administrator
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Alamat Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-800 bg-slate-50"
            placeholder="admin@diskominfo.go.id"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Kata Sandi
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-800 bg-slate-50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors mt-2 disabled:bg-slate-400"
        >
          {isLoading ? "Memverifikasi..." : "Masuk Sistem"}
        </button>
      </form>
    </div>
  );
}