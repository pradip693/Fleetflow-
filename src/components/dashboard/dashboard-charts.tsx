import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface DashboardChartsProps {
    statusDistribution: any[];
    typeDistribution: any[];
    statusColors: Record<string, string>;
}

export function DashboardCharts({ statusDistribution, typeDistribution, statusColors }: DashboardChartsProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-5">
            {/* Status Distribution Pie */}
            <Card className="lg:col-span-2 glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-4">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Vehicle Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {statusDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {statusDistribution.map((entry) => (
                                        <Cell key={entry.name} fill={statusColors[entry.name] || "#CBD5E1"} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontSize: '9px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        paddingTop: '10px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground italic font-medium">
                            No data available for the current selection
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Type Breakdown Bar Chart */}
            <Card className="lg:col-span-3 glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-4">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Fleet by Type & Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {typeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={typeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                                <XAxis
                                    dataKey="type"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 10 }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 10 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                <Bar dataKey="Available" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="On Trip" stackId="a" fill="#6366f1" />
                                <Bar dataKey="In Shop" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Out of Service" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground italic font-medium">
                            No data available for the current selection
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
