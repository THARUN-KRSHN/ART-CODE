"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { Search, Filter, Mail, Phone, Building, User, Download } from "lucide-react";

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/participants")
      .then((res) => res.json())
      .then((data) => setParticipants(data.participants || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.institution || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      teamFilter === "all" ||
      (teamFilter === "in_team" && p.teamId) ||
      (teamFilter === "no_team" && !p.teamId);

    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const headers = ["Name,Email,Phone,Institution,Department,Role,Team,RegistrationDate"];
    const rows = filtered.map(
      (p) =>
        `"${p.name}","${p.email}","${p.phone || ""}","${p.institution}","${p.department || ""}","${p.role}","${p.teamName || "None"}","${p.createdAt}"`
    );
    const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ARTCODE_2026_Participants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink-muted">Loading participant registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Registered Participants</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Total {participants.length} registered students across participating institutions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-ivory-100 text-xs font-semibold text-ink flex items-center gap-2 shadow-subtle self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-border bg-white shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter size={14} className="text-ink-muted" />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-border bg-ivory-50 text-ink focus:bg-white"
          >
            <option value="all">All Participants ({participants.length})</option>
            <option value="in_team">Assigned to a Team</option>
            <option value="no_team">No Team Yet</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-card border border-border bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 border-b border-border text-[11px] font-mono uppercase text-ink-muted">
              <tr>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Institution & Department</th>
                <th className="py-3 px-4">Team Assignment</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-ink-secondary">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-ivory-300 text-ink flex items-center justify-center font-bold text-[11px]">
                        {p.name.charAt(0)}
                      </div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-ink text-[11px]">{p.email}</div>
                    <div className="text-[10px] text-ink-muted">{p.phone || "No phone listed"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-ink line-clamp-1">{p.institution}</div>
                    <div className="text-[10px] text-ink-muted">
                      {p.department || "General"} {p.yearOfStudy ? `• ${p.yearOfStudy}` : ""}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.teamName ? (
                      <span className="font-semibold text-ink px-2 py-0.5 rounded bg-ivory-200 border border-border text-[11px]">
                        {p.teamName}
                      </span>
                    ) : (
                      <span className="text-ink-muted text-[11px] italic">No team</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                        p.role === "admin"
                          ? "bg-terracotta-50 text-terracotta"
                          : p.role === "leader"
                          ? "bg-saffron-50 text-saffron-700"
                          : "bg-indigo-50 text-indigo"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-ink-muted">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

