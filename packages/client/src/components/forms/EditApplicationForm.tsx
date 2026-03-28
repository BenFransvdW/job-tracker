import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Application } from '@job-tracker/shared';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@job-tracker/shared';
import { TagInput } from '../ui/TagInput';
import { useUpdateApplication } from '../../hooks/useApplications';

interface EditApplicationFormProps {
    application: Application;
    onSuccess?: () => void;
}

export function EditApplicationForm({ application, onSuccess }: EditApplicationFormProps) {
    const [company, setCompany] = useState(application.company);
    const [role, setRole] = useState(application.role);
    const [status, setStatus] = useState(application.status);
    const [priority, setPriority] = useState(application.priority);
    const [jobUrl, setJobUrl] = useState(application.jobUrl ?? '');
    const [location, setLocation] = useState(application.location ?? '');
    const [notes, setNotes] = useState(application.notes ?? '');
    const [tags, setTags] = useState<string[]>(application.tags);
    const updateApp = useUpdateApplication(application._id);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await updateApp.mutateAsync({ company, role, status, priority, jobUrl: jobUrl || undefined, location: location || undefined, notes: notes || undefined, tags });
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
                    <select value={status} onChange={e => setStatus(e.target.value as typeof status)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                <input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <TagInput value={tags} onChange={setTags} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={updateApp.isPending}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {updateApp.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {updateApp.isError && <p className="text-red-600 text-sm">Failed to save changes</p>}
        </form>
    );
}
