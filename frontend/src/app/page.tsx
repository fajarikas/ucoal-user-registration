"use client";

import React from "react";
import RegistrationCard from "@/components/RegistrationCard";
import UserListCard from "@/components/UserListCard";
import SmtpStatusCard from "@/components/SmtpStatusCard";
import { useUsers } from "@/hooks/useUsers";
import { useSmtpInfo } from "@/hooks/useSmtpInfo";
import { UserCheck, Activity, Layers, Database, Send, Terminal } from "lucide-react";

export default function Home() {
  const {
    data: usersData,
    isLoading: loadingUsers,
    isError: usersError,
    refetch: refetchUsers,
  } = useUsers();

  const {
    data: smtpInfo,
    isLoading: loadingSmtp,
    isError: smtpError,
  } = useSmtpInfo();

  const apiConnected = !usersError && !smtpError;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>UCoal Identity</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Fullstack Test
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-slate-900 border border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  loadingUsers || loadingSmtp
                    ? "bg-amber-400 animate-pulse"
                    : apiConnected
                    ? "bg-emerald-400"
                    : "bg-rose-500"
                }`}
              />
              <span className="text-slate-300 font-medium">
                {loadingUsers || loadingSmtp
                  ? "Menghubungkan..."
                  : apiConnected
                  ? "Fiber API Online"
                  : "Fiber API Terputus"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Pendaftaran User & Notifikasi Email Otomatis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Sistem Pendaftaran Pengguna
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Daftarkan user baru dengan penyimpanan ke database SQLite dan pengiriman email notifikasi teks via SMTP Ethereal.
          </p>
        </div>

        {/* SMTP Status banner */}
        <SmtpStatusCard smtpInfo={smtpInfo} loading={loadingSmtp} />

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Registration Form (7 cols) */}
          <div className="lg:col-span-7">
            <RegistrationCard
              smtpMailboxUrl={smtpInfo?.web_mailbox || "https://ethereal.email/messages"}
            />
          </div>

          {/* User List (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <UserListCard
              users={usersData?.users || []}
              loading={loadingUsers}
              onRefresh={() => refetchUsers()}
            />
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="pt-6 border-t border-slate-800/80">
          <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider text-center mb-4">
            Teknologi yang Digunakan
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Next.js 16 (React Query + Axios)</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Golang (Fiber v2)</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <Database className="w-4 h-4 text-amber-400" />
              <span>SQLite + GORM</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>SMTP (Ethereal Email)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>Ucoal Technical Test &copy; {new Date().getFullYear()} - Fajar Ika Saputra</p>
      </footer>
    </div>
  );
}
