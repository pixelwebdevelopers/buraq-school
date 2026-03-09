import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileInvoiceDollar, FaPrint, FaMoneyBillWave, FaSpinner, FaPlus } from 'react-icons/fa';
import feeService from '@/services/feeService';
import PayFeeModal from './PayFeeModal';
import PrintFeeVoucher from './PrintFeeVoucher';

export default function StudentFeeModal({ isOpen, onClose, student }) {
    const [vouchers, setVouchers] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // Generate form state
    const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
    const [genYear, setGenYear] = useState(new Date().getFullYear());

    // Modals
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedVoucherForPay, setSelectedVoucherForPay] = useState(null);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState(null);

    const fetchFees = useCallback(async (page = 1) => {
        if (!student) return;
        setLoading(true);
        try {
            const res = await feeService.getStudentFees(student.id, { page, limit });
            if (res.success) {
                setVouchers(res.data.vouchers);
                setTotalBalance(res.data.totalBalance);
                setTotalPages(res.data.totalPages || 1);
                setCurrentPage(res.data.currentPage || 1);
            }
        } catch (error) {
            console.error("Failed to fetch fees:", error);
        } finally {
            setLoading(false);
        }
    }, [student, limit]);

    useEffect(() => {
        if (isOpen && student) {
            fetchFees();
        }
    }, [isOpen, student, fetchFees]);

    const handleGenerateVoucher = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await feeService.generateVoucher({
                studentId: student.id,
                month: parseInt(genMonth),
                year: parseInt(genYear)
            });
            if (res.success) {
                // Refresh list
                fetchFees(1);
            }
        } catch (error) {
            console.error("Error generating voucher:", error);
            alert(error.response?.data?.message || 'Failed to generate voucher.');
        } finally {
            setGenerating(false);
        }
    };

    const handleOpenPay = (voucher) => {
        if (voucher.status === 'PAID') return;
        setSelectedVoucherForPay(voucher);
        setPayModalOpen(true);
    };

    const handleOpenPrint = (voucher) => {
        setSelectedVoucherForPrint(voucher);
        setPrintModalOpen(true);
    };

    const handlePaymentComplete = () => {
        // Refresh fees after payment
        fetchFees(currentPage);
    };

    if (!isOpen || !student) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold font-mono">PAID</span>;
            case 'PARTIAL':
                return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold font-mono">PARTIAL</span>;
            default:
                return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold font-mono">PENDING</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[#4B5EAA] shadow-sm">
                            <FaFileInvoiceDollar className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                Fee Management: {student.name}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">Roll: {student.referenceNo || 'N/A'} • Class: <span className="capitalize">{student.currentClass}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto flex flex-col md:flex-row gap-6 bg-gray-50/30">
                    {/* Left Panel: Creation & Summary */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6 shrink-0">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-[#4B5EAA] to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl -ml-10 -mb-10"></div>

                            <h3 className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Pending Balance</h3>
                            <div className="text-4xl font-black tracking-tight font-mono">
                                <span>Rs.</span> {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* Generate Voucher Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                <FaPlus className="text-[#4B5EAA]" />
                                Generate New Voucher
                            </h3>
                            <form onSubmit={handleGenerateVoucher} className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Month</label>
                                        <select
                                            value={genMonth}
                                            onChange={(e) => setGenMonth(e.target.value)}
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#4B5EAA] focus:border-[#4B5EAA] bg-gray-50"
                                        >
                                            {monthNames.map((name, index) => (
                                                <option key={index + 1} value={index + 1}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Year</label>
                                        <input
                                            type="number"
                                            value={genYear}
                                            onChange={(e) => setGenYear(e.target.value)}
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#4B5EAA] focus:border-[#4B5EAA] bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4B5EAA] hover:bg-[#3A4A8B] text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {generating ? <FaSpinner className="animate-spin" /> : "Generate Voucher"}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center leading-tight">
                                    This will generate a voucher using the student's current assigned fees (Monthly, Academy, Lab/Misc).
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel: List */}
                    <div className="w-full md:w-2/3 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Generated Vouchers</h3>
                            {loading && <FaSpinner className="animate-spin text-gray-400" />}
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Month/Year</th>
                                        <th className="px-4 py-3">Fees total</th>
                                        <th className="px-4 py-3">Paid</th>
                                        <th className="px-4 py-3">Balance</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {!loading && vouchers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No fee vouchers found for this student.
                                            </td>
                                        </tr>
                                    ) : (
                                        vouchers.map(v => {
                                            const vTotal = parseFloat(v.amount);
                                            const vPaid = parseFloat(v.paidAmount || 0);
                                            const vBal = vTotal - vPaid;

                                            return (
                                                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-4 py-3 font-medium text-gray-800">
                                                        {monthNames[v.month - 1]} {v.year}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-gray-600">Rs. {vTotal}</td>
                                                    <td className="px-4 py-3 font-mono text-green-600">Rs. {vPaid}</td>
                                                    <td className="px-4 py-3 font-mono font-bold text-red-500">Rs. {vBal}</td>
                                                    <td className="px-4 py-3">{getStatusBadge(v.status)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                                            <button
                                                                onClick={() => handleOpenPay(v)}
                                                                disabled={v.status === 'PAID'}
                                                                className="p-1.5 rounded-lg border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title="Process Payment"
                                                            >
                                                                <FaMoneyBillWave />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenPrint(v)}
                                                                className="p-1.5 rounded-lg border border-gray-200 text-[#4B5EAA] hover:bg-indigo-50 hover:border-[#4B5EAA] transition-all"
                                                                title="Print Voucher"
                                                            >
                                                                <FaPrint />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination footer */}
                        {totalPages > 1 && (
                            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm">
                                <span className="text-gray-500">Page {currentPage} of {totalPages}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => fetchFees(currentPage - 1)}
                                        className="px-3 py-1 rounded border border-gray-200 hover:bg-white disabled:opacity-50"
                                    >Prev</button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => fetchFees(currentPage + 1)}
                                        className="px-3 py-1 rounded border border-gray-200 hover:bg-white disabled:opacity-50"
                                    >Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Child Modals */}
            {payModalOpen && selectedVoucherForPay && (
                <PayFeeModal
                    isOpen={payModalOpen}
                    onClose={() => {
                        setPayModalOpen(false);
                        setSelectedVoucherForPay(null);
                    }}
                    voucher={selectedVoucherForPay}
                    onSuccess={handlePaymentComplete}
                />
            )}

            {printModalOpen && selectedVoucherForPrint && (
                <PrintFeeVoucher
                    isOpen={printModalOpen}
                    onClose={() => {
                        setPrintModalOpen(false);
                        setSelectedVoucherForPrint(null);
                    }}
                    voucher={selectedVoucherForPrint}
                    student={student}
                />
            )}
        </div>
    );
}
