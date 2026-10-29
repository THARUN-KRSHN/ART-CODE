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
        <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-ink/70">Loading participant registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-bold text-ink">Registered Participants</h1>
          <p className="text-xs text-ink/80 mt-0.5">
            Total {participants.length} registered students across participating institutions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl border border-mutedGold/70 bg-cream/90 hover:bg-cream text-xs font-bold text-darkRed flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
        >
          <Download size={14} className="text-vermilion" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedGold" />
          <input
            type="text"
            placeholder="Search by name, email, or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream focus:outline-none focus:ring-1 focus:ring-vermilion font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter size={14} className="text-mutedGold" />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-mutedGold/70 bg-cream/70 text-ink focus:bg-cream font-medium"
          >
            <option value="all">All Participants ({participants.length})</option>
            <option value="in_team">Assigned to a Team</option>
            <option value="no_team">No Team Yet</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-mutedGold/60 bg-paleCream/95 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream border-b border-mutedGold/50 text-[11px] font-mono uppercase text-darkRed font-bold">
              <tr>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Institution & Department</th>
                <th className="py-3 px-4">Team Assignment</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mutedGold/30 text-ink/80">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-cream/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cream border border-mutedGold/60 text-darkRed flex items-center justify-center font-bold text-[11px]">
                        {p.name.charAt(0)}
                      </div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-ink text-[11px] font-medium">{p.email}</div>
                    <div className="text-[10px] text-ink/60">{p.phone || "No phone listed"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-ink line-clamp-1 font-medium">{p.institution}</div>
                    <div className="text-[10px] text-ink/60">
                      {p.department || "General"} {p.yearOfStudy ? `• ${p.yearOfStudy}` : ""}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.teamName ? (
                      <span className="font-bold text-darkRed px-2 py-0.5 rounded bg-cream border border-mutedGold/60 text-[11px]">
                        {p.teamName}
                      </span>
                    ) : (
                      <span className="text-ink/50 text-[11px] italic">No team</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                        p.role === "admin"
                          ? "bg-vermilion/15 text-vermilion border border-vermilion/40"
                          : p.role === "leader"
                          ? "bg-accentGold/20 text-darkRed border border-accentGold/50"
                          : "bg-cream text-ink/70 border border-mutedGold/50"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-ink/60">
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
