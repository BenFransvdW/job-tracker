import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ApplicationStatus } from '@job-tracker/shared';
import { STATUS_LABELS } from '@job-tracker/shared';

interface StatusEntry {
    status: ApplicationStatus;
    count: number;
}

interface StatusPieChartProps {
    data: StatusEntry[];
}

const PIE_COLORS: Record<string, string> = {
    wishlist: '#3b82f6', applied: '#22c55e', interviewing: '#f59e0b',
    offer: '#14b8a6', rejected: '#ef4444', ghosted: '#9ca3af'
};

export function StatusPieChart({ data }: StatusPieChartProps) {
    const chartData = data.filter(d => d.count > 0).map(d => ({
        name: STATUS_LABELS[d.status],
        value: d.count,
        status: d.status,
    }));

    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Status Breakdown</h3>
                <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {chartData.map((entry, i) => (
                            <Cell key={i} fill={PIE_COLORS[entry.status] ?? '#9ca3af'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
