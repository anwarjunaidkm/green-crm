"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Mail, Phone, Plus, Trash2, Users } from "lucide-react";

import { deleteStaff, getStoredStaff } from "@/lib/staffStorage";
import type { Staff } from "@/types/staff";

function formatDate(date: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export default function StaffList() {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStaff = () => {
    setStaff(getStoredStaff());
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem("greenvedha_user") || "null") as { role?: string } | null;
      if (user?.role !== "super_admin") {
        router.replace("/home");
        return;
      }
    } catch {
      router.replace("/");
      return;
    }

    const initialLoad = window.setTimeout(loadStaff, 0);
    window.addEventListener("greenvedha:staff-change", loadStaff);
    window.addEventListener("storage", loadStaff);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("greenvedha:staff-change", loadStaff);
      window.removeEventListener("storage", loadStaff);
    };
  }, [router]);

  const handleDelete = (member: Staff) => {
    if (!window.confirm(`Delete ${member.fullName}? This action cannot be undone.`)) return;
    deleteStaff(member.id);
    loadStaff();
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-medium text-[#588064]">Team management</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#16391f]">Staff</h2><p className="mt-1 text-xs text-slate-500">Manage team members, roles, salary, and CRM access.</p></div><Link href="/staff/add" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#176b32] px-4 text-xs font-medium text-white hover:bg-[#125727]"><Plus size={16} />Add Staff</Link></div>
      <section className="mt-5 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
        {isLoading ? <StateMessage title="Loading staff..." /> : staff.length === 0 ? <StateMessage title="No staff members yet" description="Add your first staff member to get started." action={<Link href="/staff/add" className="mt-3 text-xs font-semibold text-[#176b32]">Add Staff</Link>} /> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="border-b border-slate-100 bg-[#fafcfa]"><tr>{["Staff member", "Contact", "Designation", "Salary", "Joining date", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{staff.map((member) => <tr key={member.id} className="transition hover:bg-[#fbfefb]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a]">{member.fullName.charAt(0).toUpperCase()}</div><div><p className="text-xs font-semibold text-slate-800">{member.fullName}</p><p className="mt-0.5 text-[10px] text-slate-400">{member.status === "Active" ? "CRM access enabled" : "Access inactive"}</p></div></div></td><td className="px-5 py-4"><p className="flex items-center gap-1.5 text-[11px] text-slate-600"><Phone size={12} />{member.phone}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400"><Mail size={12} />{member.email}</p></td><td className="px-5 py-4 text-xs text-slate-600">{member.designation}</td><td className="px-5 py-4 text-xs font-medium text-slate-700">AED {member.salary.toLocaleString()}</td><td className="px-5 py-4 text-xs text-slate-600">{formatDate(member.joiningDate)}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${member.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{member.status}</span></td><td className="px-5 py-4"><div className="flex items-center gap-1"><Link href={`/staff/${member.id}/edit`} aria-label={`Edit ${member.fullName}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-green-50 hover:text-[#176b32]"><Edit3 size={15} /></Link><button type="button" aria-label={`Delete ${member.fullName}`} onClick={() => handleDelete(member)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  );
}

function StateMessage({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f3e9] text-[#237638]"><Users size={22} /></div><p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>{description && <p className="mt-1 text-xs text-slate-400">{description}</p>}{action}</div>;
}
