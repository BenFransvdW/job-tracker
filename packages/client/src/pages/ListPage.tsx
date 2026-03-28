import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Application } from '@job-tracker/shared';
import { STATUS_LABELS } from '@job-tracker/shared';
import { useApplications, useDeleteApplication } from '../hooks/useApplications';
import { StatusBadge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

type SortKey = 'company' | 'role' | 'status' | 'createdAt';

export function ListPage() {
    const { data, isLoading } = useApplications();
    const deleteApp = useDeleteApplication();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('createdAt');
    const [sortDir, setSortDir] = useState<1 | -1>(-1);
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

    const applications = data?.data ?? [];

    const filtered = useMemo(() => {
        let list = [...applications];
        if (search) list = list.filter(a => a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()));
        if (statusFilter) list = list.filter(a => a.status === statusFilter);
        list.sort((a, b) => {
            const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
            return String(av).localeCompare(String(bv)) * sortDir;
        });
        return list;
    }, [applications, search, statusFilter, sortKey, sortDir]);

    function toggleSort(key: SortKey) {
        if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1);
        else { setSortKey(key); setSortDir(1); }
    }

    function exportCsv() {
        const rows = [['Company', 'Role', 'Status', 'Applied', 'Location']];
        filtered.forEach(a => rows.push([a.company, a.role, STATUS_LABELS[a.status], a.appliedAt ?? '', a.location ?? '']));
        const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'applications.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortDir === 1 ? <span>↑</span> : <span>↓</span>) : null;

    if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                <button onClick={exportCsv} className="text-sm text-gray-600 hover:text-gray-900 border px-3 py-1.5 rounded-md">Export CSV</button>
            </div>
            <div className="flex gap-3 mb-4">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company or role..."
                    className="border rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {(['company', 'role', 'status', 'createdAt'] as SortKey[]).map(k => (
                                <th key={k} onClick={() => toggleSort(k)} className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 capitalize">
                                    {k === 'createdAt' ? 'Added' : k} <SortIcon k={k} />
                                </th>
                            ))}
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filtered.map(app => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3"><Link to={`/applications/${app._id}`} className="font-medium text-blue-600 hover:underline">{app.company}</Link></td>
                                <td className="px-4 py-3 text-gray-700">{app.role}</td>
                                <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                                <td className="px-4 py-3 text-gray-500">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setDeleteTarget(app)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No applications found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={async () => { if (deleteTarget) { await deleteApp.mutateAsync(deleteTarget._id); setDeleteTarget(null); } }}
                title="Delete Application"
                message={`Are you sure you want to delete the ${deleteTarget?.company} application? This cannot be undone.`}
                loading={deleteApp.isPending}
            />
        </div>
    );
}
