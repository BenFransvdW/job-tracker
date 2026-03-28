import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplication, useDeleteApplication, useUpdateStatus } from '../hooks/useApplications';
import { useInterviews, useDeleteInterview } from '../hooks/useInterviews';
import { StatusStepper } from '../components/ui/StatusStepper';
import { StatusBadge, PriorityDot } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EditApplicationForm } from '../components/forms/EditApplicationForm';
import { AddInterviewForm } from '../components/forms/AddInterviewForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { ApplicationStatus } from '@job-tracker/shared';

type Tab = 'overview' | 'interviews' | 'notes' | 'contacts';

export function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading } = useApplication(id!);
    const { data: interviewData } = useInterviews(id!);
    const deleteApp = useDeleteApplication();
    const updateStatus = useUpdateStatus(id!);
    const deleteInterview = useDeleteInterview(id!);
    const [tab, setTab] = useState<Tab>('overview');
    const [editOpen, setEditOpen] = useState(false);
    const [addInterviewOpen, setAddInterviewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;
    if (!data?.data) return <div className="p-6"><p className="text-gray-500">Application not found</p></div>;

    const app = data.data;
    const interviews = interviewData?.data ?? [];

    async function handleDelete() {
        await deleteApp.mutateAsync(app._id);
        navigate('/list');
    }

    const tabs: { key: Tab; label: string }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'interviews', label: `Interviews (${interviews.length})` },
        { key: 'notes', label: 'Notes' },
        { key: 'contacts', label: `Contacts (${app.contacts?.length ?? 0})` },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{app.company}</h1>
                        <p className="text-lg text-gray-600">{app.role}</p>
                        {app.location && <p className="text-sm text-gray-500 mt-1">{app.location}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditOpen(true)} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">Edit</button>
                        <button onClick={() => setDeleteOpen(true)} className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50">Delete</button>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <StatusBadge status={app.status} />
                    <PriorityDot priority={app.priority} />
                    <span className="text-sm text-gray-500 capitalize">{app.priority} priority</span>
                </div>
                <div className="mt-4">
                    <StatusStepper current={app.status} onChange={(s: ApplicationStatus) => updateStatus.mutate(s)} />
                </div>
            </div>

            <div className="border-b mb-6">
                <nav className="flex gap-6">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {t.label}
                        </button>
                    ))}
                </nav>
            </div>

            {tab === 'overview' && (
                <div className="space-y-4">
                    {app.jobUrl && <p className="text-sm"><span className="font-medium">URL: </span><a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{app.jobUrl}</a></p>}
                    {app.salary && <p className="text-sm"><span className="font-medium">Salary: </span>{app.salary.currency} {app.salary.min.toLocaleString()}–{app.salary.max.toLocaleString()} / {app.salary.period}</p>}
                    {app.tags?.length > 0 && <div className="flex flex-wrap gap-1">{app.tags.map(t => <span key={t} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{t}</span>)}</div>}
                    {app.appliedAt && <p className="text-sm text-gray-500">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>}
                </div>
            )}

            {tab === 'interviews' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setAddInterviewOpen(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700">+ Add Interview</button>
                    </div>
                    {interviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No interviews scheduled yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {interviews.map(iv => (
                                <div key={iv._id} className="bg-white border rounded-lg p-4 flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-sm capitalize">{iv.type} — Round {iv.round}</p>
                                        <p className="text-sm text-gray-500">{new Date(iv.scheduledAt).toLocaleString()}</p>
                                        {iv.notes && <p className="text-sm text-gray-600 mt-1">{iv.notes}</p>}
                                        <span className={`text-xs font-medium ${iv.outcome === 'passed' ? 'text-green-600' : iv.outcome === 'failed' ? 'text-red-600' : 'text-gray-500'}`}>{iv.outcome}</span>
                                    </div>
                                    <button onClick={() => deleteInterview.mutate(iv._id)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'notes' && (
                <div className="prose max-w-none">
                    {app.notes ? <p className="text-gray-700 whitespace-pre-wrap">{app.notes}</p> : <p className="text-gray-500 text-sm">No notes yet. Edit this application to add notes.</p>}
                </div>
            )}

            {tab === 'contacts' && (
                <div className="space-y-3">
                    {(app.contacts ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">No contacts added yet.</p>
                    ) : (
                        app.contacts.map((c, i) => (
                            <div key={`${c.name}-${i}`} className="bg-white border rounded-lg p-4">
                                <p className="font-medium text-sm">{c.name}</p>
                                {c.role && <p className="text-sm text-gray-500">{c.role}</p>}
                                {c.email && <p className="text-sm text-blue-600">{c.email}</p>}
                                {c.notes && <p className="text-sm text-gray-600 mt-1">{c.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}

            <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Application">
                <EditApplicationForm application={app} onSuccess={() => setEditOpen(false)} />
            </Modal>
            <Modal open={addInterviewOpen} onClose={() => setAddInterviewOpen(false)} title="Schedule Interview">
                <AddInterviewForm appId={id!} onSuccess={() => setAddInterviewOpen(false)} />
            </Modal>
            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Application"
                message="Are you sure you want to delete this application? This cannot be undone."
                loading={deleteApp.isPending}
            />
        </div>
    );
}
