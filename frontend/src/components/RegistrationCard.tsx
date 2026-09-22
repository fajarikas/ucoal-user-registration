"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

interface RegistrationCardProps {
  onSuccess: () => void;
  smtpMailboxUrl: string;
}

export default function RegistrationCard({ onSuccess, smtpMailboxUrl }: RegistrationCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    name: string;
    email: string;
    emailStatus: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Masukkan alamat email yang valid.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password minimal harus 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok dengan password.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan registrasi");
      }

      setSuccessData({
        name: data.user.name,
        email: data.user.email,
        emailStatus: data.email_status,
      });

      // Clear form inputs
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Trigger user list refresh
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat memproses pendaftaran.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Form Pendaftaran User</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Lengkapi data di bawah ini untuk mendaftar akun baru. Notifikasi akan otomatis dikirimkan ke email Anda.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 leading-relaxed">{errorMsg}</div>
        </div>
      )}

      {successData && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-300">Pendaftaran Berhasil!</h4>
              <p className="text-sm text-emerald-200/90 mt-1">
                User <span className="font-semibold">{successData.name}</span> ({successData.email}) telah tersimpan di database.
              </p>
              <div className="mt-2.5 text-xs bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300">
                <span className="font-medium text-emerald-400">Status Email:</span> {successData.emailStatus}
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                <a
                  href={smtpMailboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                >
                  Buka Ethereal Mailbox <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nama Lengkap <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Alamat Email <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl text-white placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Konfirmasi Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password di atas"
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses & Mengirim Email...</span>
            </>
          ) : (
            <span>Daftar Sekarang</span>
          )}
        </button>
      </form>
    </div>
  );
}
