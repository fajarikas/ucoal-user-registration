"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import { RegisterResponse } from "@/types/user";

interface RegistrationCardProps {
  smtpMailboxUrl: string;
}

export default function RegistrationCard({ smtpMailboxUrl }: RegistrationCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegisterResponse | null>(null);

  const registerMutation = useRegisterUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setValidationError("Masukkan alamat email yang valid.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password minimal harus 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Konfirmasi password tidak cocok dengan password.");
      return;
    }

    registerMutation.mutate(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: (data) => {
          setSuccessData(data);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  const activeError = validationError || (registerMutation.error ? registerMutation.error.message : null);

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

      {activeError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 leading-relaxed">{activeError}</div>
        </div>
      )}

      {successData && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-300">Pendaftaran Berhasil!</h4>
              <p className="text-sm text-emerald-200/90 mt-1">
                User <span className="font-semibold">{successData.user.name}</span> ({successData.user.email}) telah tersimpan di database.
              </p>
              <div className="mt-2.5 text-xs bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300">
                <span className="font-medium text-emerald-400">Status Email:</span> {successData.email_status}
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password di atas"
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? (
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
