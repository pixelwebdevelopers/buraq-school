import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import feeService from '@/services/feeService';
import { FaSync, FaPrint, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUsers } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BulkPrintVouchers from './BulkPrintVouchers';
import BulkPrintFamilyVouchers from './BulkPrintFamilyVouchers';
import Pagination from '@/components/common/Pagination';

export default function VoucherManager({ filters }) {
    const [vouchers, setVouchers] = useState([]);
    const [familyVouchers, setFamilyVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [fetchingFamily, setFetchingFamily] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });
    const [extraName, setExtraName] = useState('');
    const [extraAmount, setExtraAmount] = useState('');
    const printRef = useRef();
    const familyPrintRef = useRef();

    const fetchVouchers = useCallback(async () => {
        if (!filters.branchId || !filters.currentClass) return;
        setLoading(true);
        try {
            const result = await feeService.getBulkFees({ ...filters, page, limit: 10 });
            setVouchers(result.data);
            setPagination(result.pagination);
        } catch (error) {
            console.error("Failed to fetch vouchers:", error);
            toast.error("Failed to load vouchers.");
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchVouchers();
    }, [filters.branchId, filters.month, filters.year, fetchVouchers]);

    const handleBulkGenerate = async () => {
        if (!filters.branchId) {
            toast.error("Please select a branch first.");
            return;
        }

        const confirmGen = window.confirm(`Generate vouchers for ${filters.month}/${filters.year}? This will only create vouchers for students who don't already have one for this period.`);
        if (!confirmGen) return;

        setGenerating(true);
        try {
            const result = await feeService.bulkGenerateVouchers({
                ...filters,
                extraChargeName: extraName,
                extraChargeAmount: parseFloat(extraAmount || 0)
            });
            toast.success(result.message);
            setExtraName('');
            setExtraAmount('');
            fetchVouchers();
        } catch (error) {
            console.error("Bulk generation error:", error);
            toast.error(error.response?.data?.message || "Failed to generate vouchers.");
        } finally {
            setGenerating(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Bulk_Vouchers_${filters.month}_${filters.year}`,
        pageStyle: `
            @page { size: landscape; margin: 0; }
            @media print {
                body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
            }
        `
    });

    const handleFamilyPrint = useReactToPrint({
        contentRef: familyPrintRef,
        documentTitle: `Family_Vouchers_${filters.month}_${filters.year}`,
        pageStyle: `
            @page { size: landscape; margin: 0; }
            @media print {
                body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
            }
        `
    });

    const triggerFamilyPrint = async () => {
        if (!filters.branchId || !filters.currentClass) return;
        
        setFetchingFamily(true);
        try {
            const result = await feeService.getBulkFamilyFees(filters);
            if (result.success) {
                if (result.data.length === 0) {
                    toast.error("No family vouchers found for this selection.");
                    return;
                }
                setFamilyVouchers(result.data);
                // Use a small timeout to ensure data is rendered before printing
                setTimeout(() => {
                    handleFamilyPrint();
                }, 500);
            }
        } catch (error) {
            console.error("Family print error:", error);
            toast.error("Failed to fetch family vouchers.");
        } finally {
            setFetchingFamily(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Voucher Management</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Generate and print vouchers in bulk for the selected period.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 group">
                        <input
                            type="text"
                            placeholder="Extra (e.g. Exam)"
                            value={extraName}
                            onChange={(e) => setExtraName(e.target.value)}
                            className="w-32 rounded-lg border border-gray-300 py-1.5 px-3 text-xs outline-none focus:border-orange-500 font-bold"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={extraAmount}
                            onChange={(e) => setExtraAmount(e.target.value)}
                            className="w-20 rounded-lg border border-gray-300 py-1.5 px-3 text-xs outline-none focus:border-orange-500 font-bold"
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden sm:block"></div>
                    <button
                        onClick={handleBulkGenerate}
                        disabled={generating || !filters.branchId}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-orange-700 disabled:bg-gray-300"
                    >
                        {generating ? <FaSpinner className="animate-spin" /> : <FaSync />}
                        {generating ? 'Generating...' : 'Bulk Generate'}
                    </button>
                    <button
                        onClick={() => handlePrint()}
                        disabled={vouchers.length === 0}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#3A4A8B] disabled:bg-gray-300"
                    >
                        <FaPrint />
                        Print All ({vouchers.length})
                    </button>
                    <button
                        onClick={triggerFamilyPrint}
                        disabled={fetchingFamily || !filters.branchId || !filters.currentClass}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-700 disabled:bg-gray-300"
                    >
                        {fetchingFamily ? <FaSpinner className="animate-spin" /> : <FaUsers />}
                        {fetchingFamily ? 'Fetching...' : 'Print Family Vouchers'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-500">
                    <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-[#4B5EAA]" />
                    <p className="font-medium">Loading vouchers...</p>
                </div>
            ) : (!filters.branchId || !filters.currentClass) ? (
                <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <FaExclamationTriangle className="text-4xl mx-auto mb-3 text-amber-300" />
                    <p className="text-sm font-medium">Please select a class to view or generate vouchers.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Roll No.</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">Father Name</th>
                                    <th className="px-6 py-4 text-right">Amount (Rs.)</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vouchers.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{v.Student?.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{v.Student?.referenceNo || 'N/A'}</td>
                                        <td className="px-6 py-4 capitalize">{v.Student?.currentClass} {v.Student?.section && `(${v.Student.section})`}</td>
                                        <td className="px-6 py-4 text-gray-600">{v.Family?.fatherName}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">Rs. {parseFloat(v.amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            {v.status === 'PAID' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] uppercase font-black text-green-600 ring-1 ring-inset ring-green-600/20">
                                                    <FaCheckCircle className="text-[8px]" /> Paid
                                                </span>
                                            ) : v.status === 'PARTIAL' ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] uppercase font-black text-amber-600 ring-1 ring-inset ring-amber-600/20">Partial</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-[10px] uppercase font-black text-red-600 ring-1 ring-inset ring-red-600/20">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                        totalCount={pagination.totalCount}
                    />
                </>
            )}

            {/* Hidden components for printing - Using absolute positioning to hide from screen */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <BulkPrintVouchers ref={printRef} vouchers={vouchers} />
                <BulkPrintFamilyVouchers ref={familyPrintRef} familyGroups={familyVouchers} />
            </div>
        </div>
    );
}
