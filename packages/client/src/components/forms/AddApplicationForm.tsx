import { useState } from 'react';
import type { FormEvent } from 'react';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@job-tracker/shared';
import { useCreateApplication } from '../../hooks/useApplications';

interface AddApplicationFormProps {
    onSuccess?: () => void;
}

export function AddApplicationForm({ onSuccess }: AddApplicationFormProps) {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState<string>('wishlist');
    const [jobUrl, setJobUrl] = useState('');
    const createApp = useCreateApplication();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await createApp.mutateAsync({ company, role, status, jobUrl: jobUrl || undefined });
        setCompany(''); setRole(''); setStatus('wishlist'); setJobUrl('');
        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input value={company} onChange={e => setCompany(e.target.value)} required
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <input value={role} onChange={e => setRole(e.target.value)} required
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {APPLICATION_STATUSES.map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                    <input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <button type="submit" disabled={createApp.isPending}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {createApp.isPending ? 'Adding...' : 'Add Application'}
            </button>
            {createApp.isError && <p className="text-red-600 text-sm">Failed to add application</p>}
        </form>
    );
}
