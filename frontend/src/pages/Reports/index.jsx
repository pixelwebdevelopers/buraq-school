import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaChartLine, FaUsers, FaHistory } from 'react-icons/fa';

const reportCards = [
    {
        id: 'pending-fees',
        title: 'Pending Fees Report',
        description: 'Comprehensive list of students with outstanding balances, filterable by branch, class, and deficit threshold.',
        icon: <FaFileInvoiceDollar className="text-red-500" />,
        path: '/dashboard/reports/pending-fees',
        category: 'Finance'
    },
    {
        id: 'family-pending-fees',
        title: 'Family Pending Fees',
        description: 'Consolidated report of families with outstanding balances, showing all siblings and total family dues.',
        icon: <FaUsers className="text-orange-500" />,
        path: '/dashboard/reports/family-pending-fees',
        category: 'Finance'
    },
    {
        id: 'collection-history',
        title: 'Fee Collection Summary',
        description: 'Analyze daily and monthly collection trends across your institution (Coming Soon).',
        icon: <FaChartLine className="text-green-500" />,
        path: '#',
        category: 'Finance',
        disabled: true
    },
    {
        id: 'student-strength',
        title: 'Enrollment Statistics',
        description: 'Overview of student distribution by class, gender, and branch (Coming Soon).',
        icon: <FaUsers className="text-blue-500" />,
        path: '#',
        category: 'Academic',
        disabled: true
    }
];

export default function ReportsHub() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Institutional Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Access professional datasets and printable statements for administrative decision making.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => !report.disabled && navigate(report.path)}
                        className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${report.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-white transition-colors`}>
                                {report.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                {report.category}
                            </span>
                        </div>

                        <div className="mt-5">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#4B5EAA] transition-colors">
                                {report.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                                {report.description}
                            </p>
                        </div>

                        {!report.disabled && (
                            <div className="mt-6 flex items-center text-xs font-bold text-[#4B5EAA] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                                Generate Report →
                            </div>
                        )}

                        {report.disabled && (
                            <div className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                                Coming Soon
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
