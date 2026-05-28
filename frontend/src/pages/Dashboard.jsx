import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/apiServices';
import analyticsService from '@/services/analyticsService';
import branchService from '@/services/branchService';
import {
    FaUserGraduate, FaBuilding, FaUserTie, FaMoneyBillWave,
    FaChartLine, FaArrowUp, FaArrowDown, FaCalendarAlt, FaBalanceScale
} from 'react-icons/fa';
import StatsCard from '@/components/dashboard/StatsCard';
import LineBarChart from '@/components/dashboard/charts/LineBarChart';
import DonutChart from '@/components/dashboard/charts/DonutChart';

const fmtPKR = (v) => `Rs ${Number(v || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
const compact = (v) => {
    const n = Number(v) || 0;
    if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
    if (n >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return n.toString();
};

export default function Dashboard() {
    const { user } = useAuth();
    const role = user?.role;
    const isAdmin = role === 'ADMIN';
    const canSeeFinance = role === 'ADMIN' || role === 'PRINCIPAL';

    const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0, totalBranches: 0, totalPrincipals: 0 });
    const [loading, setLoading] = useState(true);

    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [granularity, setGranularity] = useState('monthly'); // monthly | quarterly | yearly
    const [branches, setBranches] = useState([]);
    const [branchFilter, setBranchFilter] = useState('');

    useEffect(() => {
        dashboardService.getStats()
            .then(data => setStats({
                totalStudents: data.totalStudents || 0,
                totalStaff: data.totalStaff || 0,
                totalBranches: data.totalBranches || 0,
                totalPrincipals: data.totalPrincipals || 0
            }))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        branchService.getAllBranches().then(setBranches).catch(() => {});
    }, [isAdmin]);

    useEffect(() => {
        if (!canSeeFinance) { setAnalyticsLoading(false); return; }
        setAnalyticsLoading(true);
        analyticsService.getFinancialOverview({
            year,
            branchId: isAdmin ? branchFilter || undefined : undefined
        })
            .then(setAnalytics)
            .catch(err => console.error(err))
            .finally(() => setAnalyticsLoading(false));
    }, [canSeeFinance, isAdmin, year, branchFilter]);

    const chartData = useMemo(() => {
        if (!analytics) return [];
        if (granularity === 'monthly') return analytics.monthly.map(m => ({ ...m, label: m.label.split(' ')[0] }));
        if (granularity === 'quarterly') return analytics.quarterly;
        return analytics.yearly;
    }, [analytics, granularity]);

    const breakdownDonut = useMemo(() => {
        if (!analytics) return [];
        return [
            { label: 'Salaries', value: analytics.totals.salaries, color: '#EF4444' },
            { label: 'Other Expenses', value: analytics.totals.additionalExpenses, color: '#F59E0B' }
        ];
    }, [analytics]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center pb-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4B5EAA] border-t-transparent" />
            </div>
        );
    }

    const totals = analytics?.totals || { revenue: 0, expenses: 0, salaries: 0, additionalExpenses: 0, net: 0 };
    const profit = totals.net;
    const margin = totals.revenue > 0 ? (profit / totals.revenue) * 100 : 0;

    return (
        <div className="animate-fade-in pb-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1E293B] uppercase">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isAdmin ? 'Aggregated overview across all branches.' : `Welcome back, ${user?.name || ''}.`}
                    </p>
                </div>

                {canSeeFinance && (
                    <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-xl shadow-sm p-2">
                        <div className="flex items-center gap-1 px-2">
                            <FaCalendarAlt className="text-[#4B5EAA]" />
                            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-sm font-semibold bg-transparent outline-none">
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {isAdmin && (
                            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}
                                className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:border-[#4B5EAA]">
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        )}
                    </div>
                )}
            </div>

            {/* Top KPIs */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {isAdmin && (
                    <StatsCard
                        icon={<FaBuilding className="text-xl text-blue-600" />}
                        title="Total Branches"
                        value={stats.totalBranches}
                        colorClass="text-blue-600"
                        bgColorClass="bg-blue-100"
                    />
                )}
                <StatsCard
                    icon={<FaUserGraduate className="text-xl text-green-600" />}
                    title="Total Students"
                    value={stats.totalStudents}
                    colorClass="text-green-600"
                    bgColorClass="bg-green-100"
                />
                <StatsCard
                    icon={<FaUserTie className="text-xl text-purple-600" />}
                    title="Total Staff"
                    value={stats.totalStaff}
                    colorClass="text-purple-600"
                    bgColorClass="bg-purple-100"
                />
                {canSeeFinance && (
                    <StatsCard
                        icon={<FaMoneyBillWave className="text-xl text-amber-600" />}
                        title={`Revenue (${year})`}
                        value={fmtPKR(totals.revenue)}
                        colorClass="text-amber-600"
                        bgColorClass="bg-amber-100"
                    />
                )}
            </div>

            {/* Finance KPIs */}
            {canSeeFinance && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <FinanceKPI
                        label="Revenue"
                        value={fmtPKR(totals.revenue)}
                        sub="Fees collected"
                        icon={<FaArrowUp />}
                        color="green"
                    />
                    <FinanceKPI
                        label="Total Expenses"
                        value={fmtPKR(totals.expenses)}
                        sub={`Salaries ${fmtPKR(totals.salaries)} + Other ${fmtPKR(totals.additionalExpenses)}`}
                        icon={<FaArrowDown />}
                        color="rose"
                    />
                    <FinanceKPI
                        label="Net Profit"
                        value={fmtPKR(profit)}
                        sub={`${margin.toFixed(1)}% margin`}
                        icon={<FaBalanceScale />}
                        color={profit >= 0 ? 'indigo' : 'rose'}
                    />
                    <FinanceKPI
                        label="Avg. Monthly Revenue"
                        value={fmtPKR(totals.revenue / 12)}
                        sub={`Year ${year}`}
                        icon={<FaChartLine />}
                        color="amber"
                    />
                </div>
            )}

            {/* Main chart */}
            {canSeeFinance && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Revenue vs Expenses</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {granularity === 'monthly' ? 'Monthly trend' : granularity === 'quarterly' ? 'Quarterly performance' : 'Yearly performance'}
                                {' · '}{year}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {['monthly', 'quarterly', 'yearly'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGranularity(g)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition ${
                                        granularity === g ? 'bg-white text-[#3A4A8B] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {analyticsLoading ? (
                        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Loading analytics...</div>
                    ) : (
                        <LineBarChart
                            data={chartData}
                            xKey="label"
                            series={[
                                { key: 'revenue', label: 'Revenue', color: '#10B981' },
                                { key: 'expenses', label: 'Expenses', color: '#EF4444' },
                                { key: 'net', label: 'Net', color: '#4B5EAA' }
                            ]}
                            formatY={compact}
                            initialType={granularity === 'monthly' ? 'bar' : 'bar'}
                        />
                    )}
                </div>
            )}

            {/* Secondary panels */}
            {canSeeFinance && analytics && (
                <div className="grid gap-5 lg:grid-cols-3">
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-base font-bold text-gray-800 mb-1">Expense Breakdown</h3>
                        <p className="text-xs text-gray-500 mb-4">Composition of total expenses ({year})</p>
                        {totals.expenses === 0 ? (
                            <div className="text-sm text-gray-400 py-8 text-center">No expense data yet.</div>
                        ) : (
                            <DonutChart data={breakdownDonut} size={180} thickness={26} formatValue={fmtPKR} />
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-base font-bold text-gray-800 mb-1">Year-over-Year Net</h3>
                        <p className="text-xs text-gray-500 mb-4">Net profit comparison (last 5 years)</p>
                        <LineBarChart
                            data={analytics.yearly}
                            xKey="label"
                            series={[
                                { key: 'revenue', label: 'Revenue', color: '#10B981' },
                                { key: 'expenses', label: 'Expenses', color: '#EF4444' }
                            ]}
                            formatY={compact}
                            initialType="line"
                            height={260}
                        />
                    </div>
                </div>
            )}

            {/* Branch breakdown for ADMIN when not filtered */}
            {canSeeFinance && analytics?.branchBreakdown?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-base font-bold text-gray-800 mb-1">Branch Performance ({year})</h3>
                    <p className="text-xs text-gray-500 mb-4">Revenue, expenses and net per branch</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="py-2 px-3">Branch</th>
                                    <th className="py-2 px-3">Revenue</th>
                                    <th className="py-2 px-3">Expenses</th>
                                    <th className="py-2 px-3">Net</th>
                                    <th className="py-2 px-3 w-1/3">Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {analytics.branchBreakdown.map(b => {
                                    const maxRev = Math.max(1, ...analytics.branchBreakdown.map(x => x.revenue));
                                    const pct = (b.revenue / maxRev) * 100;
                                    return (
                                        <tr key={b.id} className="hover:bg-gray-50/60">
                                            <td className="py-3 px-3 font-medium text-gray-800">{b.name}</td>
                                            <td className="py-3 px-3 text-green-700 font-semibold">{fmtPKR(b.revenue)}</td>
                                            <td className="py-3 px-3 text-red-700 font-semibold">{fmtPKR(b.expenses)}</td>
                                            <td className={`py-3 px-3 font-bold ${b.net >= 0 ? 'text-[#3A4A8B]' : 'text-red-600'}`}>{fmtPKR(b.net)}</td>
                                            <td className="py-3 px-3">
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-[#4B5EAA] to-[#3A4A8B]" style={{ width: `${pct}%` }} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function FinanceKPI({ label, value, sub, icon, color }) {
    const map = {
        green: { bg: 'bg-green-50', text: 'text-green-600', accent: 'from-green-500/10' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', accent: 'from-rose-500/10' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', accent: 'from-indigo-500/10' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', accent: 'from-amber-500/10' }
    };
    const c = map[color] || map.indigo;
    return (
        <div className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} to-transparent opacity-60 pointer-events-none`} />
            <div className="relative flex items-start justify-between">
                <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                    <div className="text-2xl font-extrabold text-gray-800 mt-1">{value}</div>
                    <div className="text-[11px] text-gray-500 mt-1">{sub}</div>
                </div>
                <div className={`h-10 w-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-lg`}>{icon}</div>
            </div>
        </div>
    );
}
