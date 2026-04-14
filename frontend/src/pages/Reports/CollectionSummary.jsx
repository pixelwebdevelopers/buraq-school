import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import feeService from '@/services/feeService';
import branchServiceDefault from '@/services/branchService';
import { useAuth } from '@/context/AuthContext';
import {
    FaPrint, FaSearch, FaFilter, FaFileAlt, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft,
    FaRegCalendarAlt, FaUserTie, FaUserGraduate, FaCoins, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import logo from '@/assets/images/logo.png';
import Pagination from '@/components/common/Pagination';
import PrintFooter from '@/components/common/PrintFooter';

export default function CollectionSummaryReport() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const printRef = useRef();

    const [logs, setLogs] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        branchId: user?.branchId || '',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        familyId: ''
    });

    const [summary, setSummary] = useState({ totalAmount: 0, dailySummary: [] });
    const [allDataForPrint, setAllDataForPrint] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            if (isAdmin) {
                try {
                    const data = await branchServiceDefault.getAllBranches();
                    setBranches(data);
                } catch (e) {
                    console.error("Failed to load branches.", e);
                }
            }
        };
        fetchBranches();
    }, [isAdmin]);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const result = await feeService.getCollectionReport(filters);
            setLogs(result.data.logs);
            setSummary(result.data.summary);
        } catch (error) {
            console.error("Failed to fetch report:", error);
            toast.error("Failed to load collection summary report.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePrintRequest = async () => {
        setLoading(true);
        try {
            const response = await feeService.getCollectionReport(filters);
            setAllDataForPrint(response.data.logs);
            setTimeout(() => {
                handlePrint();
                setLoading(false);
            }, 500);
        } catch (err) {
            console.error("Print fetch failed", err);
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Collection_Summary_${dayjs().format('YYYY-MM-DD')}`,
    });

    const filteredLogs = logs.filter(log =>
        log.studentNames?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.Family?.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.Family?.fatherPhone.includes(searchTerm)
    );

    const totalCollected = searchTerm ? 
        filteredLogs.reduce((acc, log) => acc + parseFloat(log.amountPaid), 0) : 
        summary.totalAmount;

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard/reports"
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <FaArrowLeft className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaCoins className="text-[#4B5EAA]" />
                            Fee Collection Summary
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Daily and periodic fee collection tracking.</p>
                    </div>
                </div>
                <button
                    onClick={handlePrintRequest}
                    disabled={loading || logs.length === 0}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#3A4A8B] transition-all disabled:bg-gray-300"
                >
                    <FaPrint />
                    Print Report
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isAdmin && (
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                                <FaMapMarkerAlt /> Branch
                            </label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaCalendarAlt /> Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaCalendarAlt /> End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaSearch /> Search Parent/Student
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-green-600">
                        <FaCoins className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Total Collected</p>
                        <p className="text-xl font-black text-green-600">Rs. {totalCollected.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        <FaCheckCircle className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Transactions</p>
                        <p className="text-xl font-black text-blue-600">{filteredLogs.length}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                        <FaMapMarkerAlt className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Branch Scope</p>
                        <p className="text-sm font-black text-purple-600 truncate">
                            {isAdmin ? (branches.find(b => b.id.toString() === filters.branchId)?.name || 'All Branches') : user.branchName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 w-48 bg-gray-100 mx-auto rounded"></div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <FaCoins className="text-5xl mx-auto mb-4 text-gray-200" />
                        <p className="text-lg font-medium">No collection records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#4B5EAA]/5 text-[#4B5EAA] font-bold uppercase text-xs border-b border-[#4B5EAA]/10">
                                <tr>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Family/Student</th>
                                    <th className="px-6 py-4 text-center">Phone Number</th>
                                    <th className="px-6 py-4 text-center border-l-2 border-white">Received By</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{dayjs(log.createdAt).format('DD MMM YYYY')}</span>
                                                <span className="text-[10px] text-gray-400">{dayjs(log.createdAt).format('hh:mm A')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                    <FaUserTie className="text-[10px]" /> {log.Family?.fatherName}
                                                </span>
                                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <FaUserGraduate className="text-[10px]" /> {log.studentNames?.join(', ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-mono font-bold text-[#4B5EAA] bg-[#4B5EAA]/5 px-2 py-1 rounded">
                                                {log.Family?.fatherPhone}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center border-l-2 border-gray-50">
                                            <span className="text-xs text-gray-600">{log.receivedBy?.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-green-600">
                                            Rs. {parseFloat(log.amountPaid).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Hidden Print Content */}
            <div className="hidden">
                <div ref={printRef} className="p-12 text-black bg-white relative">
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                        <div className="flex gap-4">
                            <img src={logo} alt="Logo" className="h-16 w-auto" />
                            <div>
                                <h1 className="text-xl font-bold uppercase">Buraq School System</h1>
                                <p className="text-sm font-semibold uppercase">Fee Collection Summary Report</p>
                                <p className="text-xs">{filters.startDate} to {filters.endDate}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-black text-left text-[10px] uppercase">
                                <th className="py-2">Date</th>
                                <th className="py-2">Parent Name</th>
                                <th className="py-2">Phone Number</th>
                                <th className="py-2">Student Name</th>
                                <th className="py-2 text-right">Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody className="text-[10px]">
                            {allDataForPrint.map(log => (
                                <tr key={log.id} className="border-b border-gray-200">
                                    <td className="py-2">{dayjs(log.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className="py-2 uppercase">{log.Family?.fatherName}</td>
                                    <td className="py-2 text-blue-800 font-mono">{log.Family?.fatherPhone}</td>
                                    <td className="py-2 uppercase">{log.studentNames?.join(', ')}</td>
                                    <td className="py-2 text-right font-bold">Rs. {parseFloat(log.amountPaid).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold border-t border-black">
                                <td colSpan="4" className="py-2 text-right uppercase">Grand Total:</td>
                                <td className="py-2 text-right underline decoration-double">Rs. {allDataForPrint.reduce((acc, l) => acc + parseFloat(l.amountPaid), 0).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <PrintFooter />
                </div>
            </div>
        </div>
    );
}
