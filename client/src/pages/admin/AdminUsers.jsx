import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, UserCheck, UserX, Ban, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard, Pagination } from '../../components/admin/AdminWidgets';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { Select } from '../../components/Input';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users', { params: { search, role, page, limit: 10 } })
      .then((res) => { setUsers(res.data.data); setPages(res.data.pagination.pages); })
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, role]); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggle = async (id) => {
    await api.patch(`/users/${id}/status`);
    fetchUsers();
  };

  const total = users.length;
  const active = users.filter((u) => u.isActive).length;
  const inactive = users.filter((u) => !u.isActive).length;
  const admins = users.filter((u) => u.role === 'admin').length;

  return (
    <AdminLayout title="Users" subtitle="View and manage customer and admin accounts.">
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={UsersIcon} value={total} label="Users on Page" color="blue" />
        <StatCard icon={UserCheck} value={active} label="Active" color="green" />
        <StatCard icon={UserX} value={inactive} label="Deactivated" color="red" />
        <StatCard icon={ShieldCheck} value={admins} label="Admins" color="orange" />
      </div>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-10" />
          </div>
          <Select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="sm:w-48">
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </Select>
        </div>

        {loading && <Loading />}
        {!loading && error && <ErrorState description={error} />}
        {!loading && !error && users.length === 0 && <EmptyState title="No users found" />}
        {!loading && !error && users.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border bg-off-white text-left text-xs font-bold uppercase text-text-muted">
                  <th className="px-4 py-3">#</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} className="border-b border-border last:border-0 hover:bg-off-white/60">
                    <td className="px-4 py-3 text-text-muted">{(page - 1) * 10 + i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-text-primary">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isActive ? 'bg-green-50 text-success' : 'bg-red-50 text-error'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-success' : 'bg-error'}`} /> {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(u._id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white" title={u.isActive ? 'Deactivate' : 'Activate'}>
                        <Ban size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 pb-4"><Pagination page={page} pages={pages} onChange={setPage} /></div>
          </div>
        )}
        </div>
        </div>
    </AdminLayout>
  );
}
