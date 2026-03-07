import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/apiServices';
import { FaUserGraduate, FaBuilding, FaUserTie } from 'react-icons/fa';
import StatsCard from '@/components/dashboard/StatsCard';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0, totalBranches: 0, totalPrincipals: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats({
                    totalStudents: data.totalStudents || 0,
                    totalStaff: data.totalStaff || 0,
                    totalBranches: data.totalBranches || 0,
                    totalPrincipals: data.totalPrincipals || 0
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center pb-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4B5EAA] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-10">
            {/* Header line */}
            <div className="mb-6 border-b-2 border-primary/10 pb-2 inline-block">
                <h1 className="text-3xl font-bold tracking-tight text-[#1E293B] uppercase">DASHBOARD</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {user?.role === 'ADMIN' && (
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

                {user?.role === 'ADMIN' ? (
                    <StatsCard
                        icon={<FaUserTie className="text-xl text-purple-600" />}
                        title="Total Principals"
                        value={stats.totalPrincipals}
                        colorClass="text-purple-600"
                        bgColorClass="bg-purple-100"
                    />
                ) : (
                    <StatsCard
                        icon={<FaUserTie className="text-xl text-purple-600" />}
                        title="Total Staff"
                        value={stats.totalStaff}
                        colorClass="text-purple-600"
                        bgColorClass="bg-purple-100"
                    />
                )}
            </div>

            {/* Welcome Section */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm min-h-[200px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}</h2>
                <p className="text-gray-500 max-w-lg">
                    You are logged in as <strong className="text-[#4B5EAA]">{user?.role}</strong>. Use the sidebar menu to navigate through your authorized modules.
                </p>
            </div>
        </div>
    );
}
