import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import feeService from '@/services/feeService';
import branchServiceDefault from '@/services/branchService';
import { useAuth } from '@/context/AuthContext';
import {
    FaPrint, FaSearch, FaUserClock, FaPhoneAlt, FaExclamationCircle,
    FaFilter, FaFileAlt, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft,
    FaUsers, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import logo from '@/assets/images/logo.png';
import Pagination from '@/components/common/Pagination';
import PrintFooter from '@/components/common/PrintFooter';

export default function FamilyPendingFeesReport() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const printRef = useRef();

    const [report, setReport] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFamily, setExpandedFamily] = useState(null);

    const [filters, setFilters] = useState({
        branchId: user?.branchId || '',
        month: '',
        year: '',
        minBalance: ''
    });

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });
    const [summary, setSummary] = useState({ totalBalance: 0, totalFamilies: 0 });
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
            const result = await feeService.getFamilyPendingFeesReport({
                ...filters,
                search: searchTerm,
                page,
                limit: 10
            });
            setReport(result.data);
            setPagination(result.pagination);
            setSummary(result.summary || { totalBalance: 0, totalFamilies: 0 });
        } catch (error) {
            console.error("Failed to fetch report:", error);
            toast.error("Failed to load family pending fees report.");
        } finally {
            setLoading(false);
        }
    }, [filters, page, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReport();
        }, 300); // 300ms debounce for search
        return () => clearTimeout(timer);
    }, [fetchReport]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page on filter change
    };

    const handlePrintRequest = async () => {
        setLoading(true);
        try {
            const response = await feeService.getFamilyPendingFeesReport({ 
                ...filters, 
                search: searchTerm,
                limit: 10000 
            });
            setAllDataForPrint(response.data);
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
        documentTitle: `Family_Pending_Fees_Report_${dayjs().format('YYYY-MM-DD')}`,
        pageStyle: `
            @page { size: A4 portrait; margin: 15mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .print-header { display: flex !important; }
            }
        `
    });

    const filteredReport = report;

    // For Print totals, we calculate from allDataForPrint
    const totalOutstandingPrint = allDataForPrint.reduce((acc, item) => acc + item.totalOutstanding, 0);

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
                            <FaUsers className="text-orange-500" />
                            Family Pending Fees Report
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Consolidated family dues with sibling breakdown.</p>
                    </div>
                </div>
                <button
                    onClick={handlePrintRequest}
                    disabled={loading || pagination.totalCount === 0}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#3A4A8B] transition-all disabled:bg-gray-300"
                >
                    <FaPrint />
                    {loading && allDataForPrint.length === 0 ? 'Preparing Print...' : 'Print Family Report'}
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#4B5EAA] font-bold text-sm uppercase tracking-wider">
                    <FaFilter className="text-xs" /> Filters
                </div>
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
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] bg-white"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaCalendarAlt /> Period
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                            <select
                                name="month"
                                value={filters.month}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 py-2 px-2 text-xs outline-none focus:border-[#4B5EAA] bg-white"
                            >
                                <option value="">All Months</option>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 py-2 px-2 text-xs outline-none focus:border-[#4B5EAA] bg-white"
                            >
                                <option value="">All Years</option>
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
                            placeholder="e.g. 5000"
                            value={filters.minBalance}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA]"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaSearch /> Search Father/Sibling
                        </label>
                        <input
                            type="text"
                            placeholder="Search keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA]"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-lg text-red-600">
                        <FaExclamationCircle className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                            {filters.month && filters.year 
                                ? `${months.find(m => m.value === filters.month)?.label} ${filters.year} Outstanding` 
                                : 'Total Overall Outstanding'}
                        </p>
                        <p className="text-xl font-black text-red-600">Rs. {summary.totalBalance.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                        <FaUsers className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Defaulter Families</p>
                        <p className="text-xl font-black text-orange-600">{summary.totalFamilies}</p>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 w-48 bg-gray-100 mx-auto rounded"></div>
                    </div>
                ) : filteredReport.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <FaExclamationCircle className="text-5xl mx-auto mb-4 text-gray-200" />
                        <p className="text-lg font-medium">No records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#4B5EAA]/5 text-[#4B5EAA] font-bold uppercase text-xs border-b border-[#4B5EAA]/10">
                                <tr>
                                    <th className="px-6 py-4">Family (Father Info)</th>
                                    <th className="px-6 py-4 text-center">Siblings Count</th>
                                    <th className="px-6 py-4 text-right">Total Outstanding</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReport.map(item => (
                                    <Fragment key={item.id}>
                                        <tr className="hover:bg-gray-50 transition-colors group border-b border-gray-100">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 uppercase">{item.fatherName}</span>
                                                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                                        <FaPhoneAlt className="scale-75" /> {item.fatherPhone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                                                    {item.siblings.length} Active Siblings
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-red-600">
                                                Rs. {item.totalOutstanding.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setExpandedFamily(expandedFamily === item.id ? null : item.id)}
                                                    className="p-2 text-gray-400 hover:text-[#4B5EAA]"
                                                >
                                                    {expandedFamily === item.id ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedFamily === item.id && (
                                            <tr className="border-b border-gray-100">
                                                <td colSpan="4" className="bg-gray-50 px-6 py-4 animate-fadeIn">
                                                    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 border-b">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">Student Name</th>
                                                                    <th className="px-4 py-2 text-left">Class/Sec</th>
                                                                    <th className="px-4 py-2 text-center">Logs</th>
                                                                    <th className="px-4 py-2 text-right">Balance Due</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {item.siblings.map(sib => (
                                                                    <tr key={sib.id}>
                                                                        <td className="px-4 py-3 font-bold text-gray-700 uppercase">{sib.name} <span className="text-[10px] font-mono text-gray-400">({sib.admissionNo})</span></td>
                                                                        <td className="px-4 py-3 capitalize">{sib.currentClass} {sib.section}</td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded-lg font-black">{sib.pendingVouchers}</span>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right font-bold text-gray-900">Rs. {sib.outstandingBalance.toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    totalCount={pagination.totalCount}
                />
            </div>

            {/* Print Layout */}
            <div className="hidden">
                <div ref={printRef} className="p-10 text-black bg-white min-h-[297mm] relative">
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                        <div className="flex gap-4">
                            <img src={logo} alt="Logo" className="h-16 w-auto grayscale" />
                            <div>
                                <h1 className="text-xl font-bold uppercase">Buraq School System</h1>
                                <p className="text-xs font-semibold uppercase">{selectedBranchName}</p>
                                <p className="text-[8pt] text-gray-600 mt-0.5 font-bold uppercase tracking-widest">Family Pending Dues Statement • {dayjs().format('MMMM DD, YYYY')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 mb-6 bg-gray-50 p-4 border border-gray-200">
                        <div className="flex flex-col">
                            <span className="text-[7pt] uppercase font-black text-gray-400">Report Focus</span>
                            <span className="text-[9pt] font-black">{filters.month && filters.year ? `${months.find(m => m.value === filters.month)?.label} ${filters.year}` : 'Overall Outstanding Balance'}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[7pt] uppercase font-black text-gray-400">Total Family Dues</span>
                            <span className="text-[12pt] font-black">PKR {totalOutstandingPrint.toLocaleString()}</span>
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-[1.5pt] border-black">
                                <th className="py-2 text-left text-[8pt] font-black uppercase">Father Name / Phone</th>
                                <th className="py-2 text-left text-[8pt] font-black uppercase">Siblings & Individual Dues</th>
                                <th className="py-2 text-right text-[8pt] font-black uppercase">Family Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDataForPrint.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-4 align-top w-1/4">
                                        <div className="font-black text-[9pt] uppercase">{item.fatherName}</div>
                                        <div className="text-[8pt] font-mono text-gray-600">{item.fatherPhone}</div>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <div className="space-y-2">
                                            {item.siblings.map(sib => (
                                                <div key={sib.id} className="flex justify-between text-[8pt] border-b border-dashed border-gray-100 pb-1 last:border-0">
                                                    <span className="font-semibold uppercase">{sib.name} <span className="text-gray-400 text-[7pt]">({sib.currentClass})</span></span>
                                                    <span className="font-bold">Rs. {sib.outstandingBalance.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right align-top font-black text-[10pt]">
                                        Rs. {item.totalOutstanding.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-6">
                        <div className="w-1/3 border-t-2 border-black pt-2 flex justify-between items-center">
                            <span className="text-[9pt] font-black uppercase tracking-tighter">Grand Total:</span>
                            <span className="text-lg font-black underline decoration-double">Rs. {totalOutstandingPrint.toLocaleString()}</span>
                        </div>
                    </div>
                    <PrintFooter />
                </div>
            </div>
        </div>
    );
}
