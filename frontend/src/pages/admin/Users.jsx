import { useEffect, useState } from "react";
import {
  Search,
  Users as UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";

import { getAdminUsers } from "../../services/admin.service";
import { formatDate } from "../../utils/format";

const ROLE_FILTERS = ["", "PATIENT", "DOCTOR", "ADMIN"];

function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({ search, role, page, limit: 10 });
      setUsers(res.data?.users || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, page]);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        subtitle="View and manage all registered users."
      />

      <section className="mt-6 grid gap-4 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:grid-cols-[1fr_220px]">
        <div className="flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-[#457D58]">
          <Search size={20} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
            className="w-full bg-transparent px-3 py-3.5 outline-none"
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-[#457D58]"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>
              {r === "" ? "All roles" : r}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-3xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="Try a different search or role filter."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-sm backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5f9f6] text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f9fcfa]">
                      <td className="px-5 py-4 font-semibold text-slate-800">{u.name}</td>
                      <td className="px-5 py-4 text-slate-600">{u.email}</td>
                      <td className="px-5 py-4">
                        <Badge status={u.role} />
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 text-sm font-semibold text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Users;
