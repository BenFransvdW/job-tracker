interface StatCardProps {
    label: string;
    value: number | string;
    trend?: 'up' | 'down' | null;
}

export function StatCard({ label, value, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend === 'up' && <span className="text-green-600 text-sm">↑</span>}
                {trend === 'down' && <span className="text-red-600 text-sm">↓</span>}
            </div>
        </div>
    );
}
