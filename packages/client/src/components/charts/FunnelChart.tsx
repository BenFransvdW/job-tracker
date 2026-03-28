import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
}

interface FunnelChartProps {
    data: FunnelStage[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function FunnelChart({ data }: FunnelChartProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Application Funnel</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip formatter={(v, n) => [v, n === 'count' ? 'Applications' : n]} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
