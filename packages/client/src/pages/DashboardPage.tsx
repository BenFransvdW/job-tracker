import { useSummaryStats, useTimelineStats, useFunnelStats } from '../hooks/useStats';
import { useApplications } from '../hooks/useApplications';
import { StatCard } from '../components/ui/StatCard';
import { ActivityChart } from '../components/charts/ActivityChart';
import { FunnelChart } from '../components/charts/FunnelChart';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { APPLICATION_STATUSES } from '@job-tracker/shared';
import { Link } from 'react-router-dom';

export function DashboardPage() {
    const { data: summaryData, isLoading: summaryLoading } = useSummaryStats();
    const { data: timelineData } = useTimelineStats(12);
    const { data: funnelData } = useFunnelStats();
    const { data: appsData } = useApplications();

    const summary = summaryData?.data;
    const timeline = timelineData?.data ?? [];
    const funnel = funnelData?.data ?? [];
    const applications = appsData?.data ?? [];

    const upcoming = applications
        .filter(a => a.status === 'interviewing')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    const statusChartData = APPLICATION_STATUSES.map(s => ({
        status: s,
        count: summary?.counts[s] ?? 0,
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Summary Stats */}
            {summaryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse h-24" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total Applications" value={summary?.total ?? 0} />
                    <StatCard label="Response Rate" value={`${summary?.responseRate ?? 0}%`} />
                    <StatCard label="Interviewing" value={summary?.counts?.['interviewing'] ?? 0} />
                    <StatCard label="Offers" value={summary?.counts?.['offer'] ?? 0} />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ActivityChart data={timeline} />
                <StatusPieChart data={statusChartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FunnelChart data={funnel} />

                {/* Upcoming Interviews panel */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Interviewing Now</h3>
                    {upcoming.length === 0 ? (
                        <p className="text-gray-500 text-sm">No active interviews. Keep applying!</p>
                    ) : (
                        <ul className="space-y-3">
                            {upcoming.map(app => (
                                <li key={app._id} className="flex items-center justify-between">
                                    <div>
                                        <Link to={`/applications/${app._id}`} className="font-medium text-sm text-blue-600 hover:underline">{app.company}</Link>
                                        <p className="text-xs text-gray-500">{app.role}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
