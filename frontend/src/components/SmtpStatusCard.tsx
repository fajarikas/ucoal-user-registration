"use client";

import React from "react";
import { MailCheck, ExternalLink, Server, ShieldCheck } from "lucide-react";

interface SmtpInfo {
  host: string;
  port: string;
  sender: string;
  account: string;
  web_mailbox: string;
}

interface SmtpStatusCardProps {
  smtpInfo: SmtpInfo | null;
}

export default function SmtpStatusCard({ smtpInfo }: SmtpStatusCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
          <MailCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Ethereal Email SMTP Gateway</span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Aktif
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-slate-500" />
              {smtpInfo?.host || "smtp.ethereal.email"}:{smtpInfo?.port || "587"}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-500" />
              User: <span className="font-mono text-slate-300">{smtpInfo?.account || "Loading..."}</span>
            </span>
          </div>
        </div>
      </div>

      <a
        href={smtpInfo?.web_mailbox || "https://ethereal.email/messages"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shrink-0 hover:text-white"
      >
        <span>Buka Kotak Masuk Ethereal</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
