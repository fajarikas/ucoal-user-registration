"use client";

import React from "react";
import { Users, RefreshCw, Calendar, CheckCircle } from "lucide-react";
import { User } from "@/types/user";

interface UserListCardProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}

export default function UserListCard({ users, loading, onRefresh }: UserListCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Data User Terdaftar</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {users.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Tersimpan di SQLite Database</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
          className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-3">
        {users.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Belum ada user yang terdaftar.</p>
            <p className="text-xs text-slate-600 mt-1">Daftarkan user pertama Anda lewat form di samping.</p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-bold text-white text-xs shadow">
                  {getInitials(u.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                    <span>{u.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-400 truncate">{u.email}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  #{u.id}
                </span>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  <span>{formatDate(u.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
