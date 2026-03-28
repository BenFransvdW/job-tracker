import { useState } from 'react';
import type { FormEvent } from 'react';
import { INTERVIEW_TYPES } from '@job-tracker/shared';
import { useCreateInterview } from '../../hooks/useInterviews';

interface AddInterviewFormProps {
    appId: string;
    onSuccess?: () => void;
}

export function AddInterviewForm({ appId, onSuccess }: AddInterviewFormProps) {
    const [type, setType] = useState(INTERVIEW_TYPES[0]);
    const [round, setRound] = useState(1);
    const [scheduledAt, setScheduledAt] = useState('');
    const [durationMins, setDurationMins] = useState('');
    const [notes, setNotes] = useState('');
    const createInterview = useCreateInterview(appId);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await createInterview.mutateAsync({
            type, round,
            scheduledAt: new Date(scheduledAt).toISOString(),
            durationMins: durationMins ? parseInt(durationMins) : undefined,
            notes: notes || undefined,
            interviewers: [],
        });
        setType(INTERVIEW_TYPES[0]); setRound(1); setScheduledAt(''); setDurationMins(''); setNotes('');
        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as typeof type)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Round</label>
                    <input type="number" min={1} value={round} onChange={e => setRound(parseInt(e.target.value))}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                    <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input type="number" min={1} value={durationMins} onChange={e => setDurationMins(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={createInterview.isPending}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {createInterview.isPending ? 'Scheduling...' : 'Schedule Interview'}
            </button>
            {createInterview.isError && <p className="text-red-600 text-sm">Failed to schedule interview</p>}
        </form>
    );
}
