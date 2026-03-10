import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import feeService from '@/services/feeService';
import branchServiceDefault from '@/services/branchService';
import { useAuth } from '@/context/AuthContext';
import {
    FaPrint, FaSearch, FaUserClock, FaPhoneAlt, FaExclamationCircle,
    FaFilter, FaFileAlt, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import logo from '@/assets/images/logo.png';
import Pagination from '@/components/common/Pagination';

export default function PendingFeesReport() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const printRef = useRef();

    const [report, setReport] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        branchId: user?.branchId || '',
        currentClass: '',
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString(),
        minBalance: ''
    });

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });
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
            const result = await feeService.getPendingFeesReport({
                ...filters,
                page,
                limit: 10
            });
            setReport(result.data);
            setPagination(result.pagination);
        } catch (error) {
            console.error("Failed to fetch report:", error);
            toast.error("Failed to load pending fees report.");
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePrintRequest = async () => {
        // Fetch fresh full data before printing to ensure accuracy
        setLoading(true);
        try {
            const response = await feeService.getPendingFeesReport({ ...filters, limit: 10000 });
            setAllDataForPrint(response.data);
            // useReactToPrint will trigger after state update if we use a ref and effect, 
            // but for simplicity we can just wait for the next render if the user clicks again, 
            // or trigger it manually. Actually, handlePrint() is from useReactToPrint.
            // Let's just update the contentRef to use the new data.
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
        documentTitle: `Pending_Fees_Report_${dayjs().format('YYYY-MM-DD')}`,
        pageStyle: `
            @page { size: A4 portrait; margin: 15mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .print-header { display: flex !important; }
            }
        `
    });

    const filteredReport = report.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOutstanding = filteredReport.reduce((acc, item) => acc + item.outstandingBalance, 0);
    const selectedBranchName = branches.find(b => b.id.toString() === filters.branchId.toString())?.name || (user?.branchId ? "Current Branch" : "All Branches");

    const months = [
        { value: '1', label: 'January' }, { value: '2', label: 'February' },
        { value: '3', label: 'March' }, { value: '4', label: 'April' },
        { value: '5', label: 'May' }, { value: '6', label: 'June' },
        { value: '7', label: 'July' }, { value: '8', label: 'August' },
        { value: '9', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard/reports"
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        title="Back to Reports Hub"
                    >
                        <FaArrowLeft className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaFileAlt className="text-[#4B5EAA]" />
                            Pending Fees Report
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Institutional defaulters list with advanced filtering.</p>
                    </div>
                </div>
                <button
                    onClick={handlePrintRequest}
                    disabled={loading || pagination.totalCount === 0}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#3A4A8B] transition-all disabled:bg-gray-300"
                >
                    <FaPrint />
                    {loading && allDataForPrint.length === 0 ? 'Preparing Print...' : 'Print A4 Report'}
                </button>
            </div>

            {/* Advanced Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#4B5EAA] font-bold text-sm uppercase tracking-wider">
                    <FaFilter className="text-xs" /> Filters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {isAdmin && (
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                                <FaMapMarkerAlt /> Branch
                            </label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaUserClock /> Class
                        </label>
                        <select
                            name="currentClass"
                            value={filters.currentClass}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white"
                        >
                            <option value="">All Classes</option>
                            <option value="playgroup">Playgroup</option>
                            <option value="nursery">Nursery</option>
                            <option value="prep">Prep</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>Class {i + 1}</option>
                            ))}
                            <option value="firstyear">First Year</option>
                            <option value="secondyear">Second Year</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaCalendarAlt /> Period (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                            <select
                                name="month"
                                value={filters.month}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 py-2 px-2 text-xs outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white"
                            >
                                <option value="">Month</option>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 py-2 px-2 text-xs outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white"
                            >
                                <option value="">Year</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaMoneyBillWave /> Min. Balance
                        </label>
                        <input
                            type="number"
                            name="minBalance"
                            placeholder="e.g. 2000"
                            value={filters.minBalance}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaSearch /> Search Name/No
                        </label>
                        <input
                            type="text"
                            placeholder="Student search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-lg text-red-600">
                        <FaExclamationCircle className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Total Outstanding</p>
                        <p className="text-xl font-black text-red-600">Rs. {totalOutstanding.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        <FaUserClock className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Student Count</p>
                        <p className="text-xl font-black text-blue-600">{filteredReport.length}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                        <FaFileAlt className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Class Focus</p>
                        <p className="text-xl font-black text-amber-600 capitalize">{filters.currentClass || 'All Classes'}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                        <FaMapMarkerAlt className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Branch</p>
                        <p className="text-sm font-black text-purple-600 truncate max-w-[150px]">{selectedBranchName}</p>
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
                ) : filteredReport.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <FaExclamationCircle className="text-5xl mx-auto mb-4 text-gray-200" />
                        <p className="text-lg font-medium">No pending records found.</p>
                        <p className="text-sm">Try adjusting your filters or search criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#4B5EAA]/5 text-[#4B5EAA] font-bold uppercase text-xs border-b border-[#4B5EAA]/10">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Branch/Class</th>
                                    <th className="px-6 py-4">Parent Info</th>
                                    <th className="px-6 py-4 text-center">Unpaid</th>
                                    <th className="px-6 py-4 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReport.map(item => (
                                    <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{item.name}</span>
                                                <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">{item.admissionNo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700">{item.branch}</span>
                                                <span className="text-[10px] text-gray-400 uppercase">{item.currentClass} {item.section && `(${item.section})`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-700">{item.fatherName}</span>
                                                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <FaPhoneAlt className="scale-75" /> {item.fatherPhone}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-black text-red-700 ring-1 ring-inset ring-red-700/10 uppercase">
                                                {item.pendingVouchers} Vouchers
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-red-600">
                                            Rs. {item.outstandingBalance.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    totalCount={pagination.totalCount}
                />
            </div>


            {/* Hidden Print Content (A4 Portrait) */}
            <div className="hidden">
                <div ref={printRef} className="p-12 text-black bg-white min-h-[297mm]" style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif" }}>
                    <div className="flex justify-between items-start border-b-[1.5pt] border-black pb-4 mb-6">
                        <div className="flex gap-5">
                            <img src={logo} alt="School Logo" className="h-20 w-auto object-contain" style={{ filter: 'grayscale(100%)' }} />
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Buraq School System</h1>
                                <p className="text-[10pt] font-semibold text-gray-700 uppercase tracking-widest">{selectedBranchName}</p>
                                <p className="text-[8pt] text-gray-500 mt-1 uppercase font-medium">Pending Dues Statement • {dayjs().format('MMMM DD, YYYY')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="flex justify-between gap-4 mb-8 bg-gray-50 p-4 border border-gray-200">
                        <div className="flex flex-col">
                            <span className="text-[7pt] uppercase font-black text-gray-400 tracking-wider">Report Scope</span>
                            <span className="text-[10pt] font-bold uppercase">{filters.currentClass ? `Class: ${filters.currentClass}` : 'Whole School'}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-[7pt] uppercase font-black text-gray-400 tracking-wider">Defaulter Count</span>
                            <span className="text-[10pt] font-bold">{filteredReport.length} Students</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[7pt] uppercase font-black text-gray-400 tracking-wider">Total Outstanding</span>
                            <span className="text-[11pt] font-black text-gray-900">PKR {totalOutstanding.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Main Report Table */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-[1pt] border-black">
                                <th className="py-2 px-1 text-left text-[8pt] font-black uppercase text-gray-600">Class</th>
                                <th className="py-2 px-1 text-left text-[8pt] font-black uppercase text-gray-600">Sec</th>
                                <th className="py-2 px-1 text-left text-[8pt] font-black uppercase text-gray-600">Student Name</th>
                                <th className="py-2 px-1 text-left text-[8pt] font-black uppercase text-gray-600">Father's Name</th>
                                <th className="py-2 px-1 text-left text-[8pt] font-black uppercase text-gray-600">Contact</th>
                                <th className="py-2 px-1 text-center text-[8pt] font-black uppercase text-gray-600">Logs</th>
                                <th className="py-2 px-1 text-right text-[8pt] font-black uppercase text-gray-600">Balance Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDataForPrint.map((item) => (
                                <tr key={item.id} className="border-b-[0.5pt] border-gray-200">
                                    <td className="py-2.5 px-1 text-[8.5pt] font-bold text-gray-700 uppercase">{item.currentClass}</td>
                                    <td className="py-2.5 px-1 text-[8.5pt] font-bold text-gray-700 uppercase">{item.section}</td>
                                    <td className="py-2.5 px-1 text-[9pt] font-bold text-gray-900 uppercase">{item.name}</td>
                                    <td className="py-2.5 px-1 text-[8.5pt] font-semibold text-gray-700 uppercase">{item.fatherName}</td>
                                    <td className="py-2.5 px-1 text-[8.5pt] font-mono text-gray-600">{item.fatherPhone}</td>
                                    <td className="py-2.5 px-1 text-center text-[8.5pt] font-bold text-gray-500">{item.pendingVouchers}</td>
                                    <td className="py-2.5 px-1 text-right text-[9pt] font-black">Rs. {item.outstandingBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Grand Total Footer Item */}
                    <div className="flex justify-end mt-4">
                        <div className="w-1/3 border-t-2 border-black pt-2 flex justify-between items-center">
                            <span className="text-[9pt] font-black uppercase tracking-tighter">Grand Total:</span>
                            <span className="text-lg font-black underline decoration-double">Rs. {totalOutstanding.toLocaleString()}</span>
                        </div>
                    </div>


                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[6.5pt] font-bold uppercase tracking-[0.2em] text-gray-300">
                        <span>Print Date: {dayjs().format('YYYY-MM-DD HH:mm')}</span>
                        <span>Buraq School ERP System</span>
                        <span>Page 01 of 01</span>
                    </div>
                </div>
            </div>
        </div >
    );
}
