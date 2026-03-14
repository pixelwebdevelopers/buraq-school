import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileInvoiceDollar, FaPrint, FaMoneyBillWave, FaSpinner, FaPlus, FaTrashAlt } from 'react-icons/fa';
import feeService from '@/services/feeService';
import PayFeeModal from './PayFeeModal';
import PrintFeeVoucher from './PrintFeeVoucher';
import Pagination from '@/components/common/Pagination';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function StudentFeeModal({ isOpen, onClose, student }) {
    const { user } = useAuth();
    const canDelete = ['ADMIN', 'PRINCIPAL'].includes(user?.role);

    const [vouchers, setVouchers] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });
    const limit = 5;

    // Generate form state
    const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
    const [genYear, setGenYear] = useState(new Date().getFullYear());
    const [extraName, setExtraName] = useState('');
    const [extraAmount, setExtraAmount] = useState('');

    // Modals
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedVoucherForPay, setSelectedVoucherForPay] = useState(null);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState(null);

    // New Modals
    const [bulkCollectOpen, setBulkCollectOpen] = useState(false);
    const [discountOpen, setDiscountOpen] = useState(false);
    const [bulkAmount, setBulkAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchFees = useCallback(async (page = 1) => {
        if (!student) return;
        setLoading(true);
        try {
            const res = await feeService.getStudentFees(student.id, { page, limit });
            if (res.success) {
                setVouchers(res.data.vouchers);
                setTotalBalance(res.data.totalBalance);
                setPagination({
                    totalPages: res.data.totalPages || 1,
                    totalCount: res.data.totalCount || 0
                });
                setCurrentPage(res.data.currentPage || 1);
            }
        } catch (error) {
            console.error("Failed to fetch fees:", error);
            toast.error("Failed to load fee records.");
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
                year: parseInt(genYear),
                extraChargeName: extraName,
                extraChargeAmount: parseFloat(extraAmount || 0)
            });
            if (res.success) {
                toast.success("Voucher generated successfully.");
                setExtraName('');
                setExtraAmount('');
                fetchFees(1);
            }
        } catch (error) {
            console.error("Error generating voucher:", error);
            toast.error(error.response?.data?.message || 'Failed to generate voucher.');
        } finally {
            setGenerating(false);
        }
    };

    const handleBulkCollect = async (e) => {
        e.preventDefault();
        if (!bulkAmount || parseFloat(bulkAmount) <= 0) return;
        setProcessing(true);
        try {
            const res = await feeService.collectBulkPayment({
                studentId: student.id,
                amount: parseFloat(bulkAmount)
            });
            if (res.success) {
                toast.success("Payment collected and adjusted.");
                setBulkCollectOpen(false);
                setBulkAmount('');
                fetchFees(currentPage);
            }
        } catch (error) {
            console.error("Bulk collection error:", error);
            toast.error(error.response?.data?.message || 'Failed to collect payment.');
        } finally {
            setProcessing(false);
        }
    };

    const handleApplyDiscount = async (e) => {
        e.preventDefault();
        if (!bulkAmount || parseFloat(bulkAmount) <= 0) return;
        setProcessing(true);
        try {
            const res = await feeService.applyBulkDiscount({
                studentId: student.id,
                amount: parseFloat(bulkAmount)
            });
            if (res.success) {
                toast.success("Discount applied across vouchers.");
                setDiscountOpen(false);
                setBulkAmount('');
                fetchFees(currentPage);
            }
        } catch (error) {
            console.error("Discount error:", error);
            toast.error(error.response?.data?.message || 'Failed to apply discount.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteVoucher = async (e, voucherId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this voucher? This cannot be undone.")) return;

        try {
            const res = await feeService.deleteVoucher(voucherId);
            if (res.success) {
                toast.success("Voucher deleted successfully.");
                fetchFees(currentPage);
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete voucher.");
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
        fetchFees(currentPage);
    };

    if (!isOpen || !student) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">CLEARED</span>;
            case 'PARTIAL':
                return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">PARTIAL</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200">DUE</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-6xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Unified Header & Controls Section */}
                <div className="relative border-b border-slate-100 bg-white px-4 py-4 sm:px-8 sm:py-6 shrink-0">
                    {/* Top Row: Info and Close Button */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 italic font-black text-xl">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-slate-800 truncate leading-tight">
                                        {student.name}
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                        Roll: {student.referenceNo || 'N/A'} <span className="mx-1 opacity-20">|</span> Class: {student.currentClass}
                                    </p>
                                </div>
                            </div>

                            <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding</span>
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    <span className="text-indigo-600 mr-1 italic">Rs.</span>
                                    {totalBalance.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-all p-2 hover:bg-slate-100 rounded-xl"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Bottom Row: Actions and Billing Form */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setBulkCollectOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-200"
                            >
                                <FaMoneyBillWave /> COLLECT FEE
                            </button>
                            <button
                                onClick={() => setDiscountOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md"
                            >
                                DISCOUNT
                            </button>
                        </div>

                        {/* Quick Generate Form */}
                        <div className="flex flex-wrap items-center gap-3 bg-slate-200/60 p-2.5 rounded-2xl border border-slate-300/50">
                            <div className="flex items-center gap-2 px-2">
                                <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">Generate</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={genMonth}
                                    onChange={(e) => setGenMonth(e.target.value)}
                                    className="text-[11px] border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 min-w-[100px]"
                                >
                                    {monthNames.map((name, index) => (
                                        <option key={index + 1} value={index + 1}>{name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={genYear}
                                    onChange={(e) => setGenYear(e.target.value)}
                                    className="text-[11px] border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 w-20"
                                />

                                <div className="h-6 w-[1px] bg-slate-300 mx-1 hidden sm:block"></div>

                                <input
                                    type="text"
                                    placeholder="Extra (e.g. Fine)"
                                    value={extraName}
                                    onChange={(e) => setExtraName(e.target.value)}
                                    className="text-[11px] border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 w-32"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={extraAmount}
                                    onChange={(e) => setExtraAmount(e.target.value)}
                                    className="text-[11px] border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 w-24"
                                />

                                <button
                                    onClick={handleGenerateVoucher}
                                    disabled={generating}
                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                                >
                                    {generating ? <FaSpinner className="animate-spin" /> : "PROCESS"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ledger Content Section */}
                <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8">
                    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full min-h-[500px]">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest">Voucher Archive</h3>
                            {loading && <FaSpinner className="animate-spin text-indigo-500" />}
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
                                <thead className="bg-[#F8FAFC] text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4">Billing Cycle</th>
                                        <th className="px-6 py-4 text-right">Bill Amount</th>
                                        <th className="px-6 py-4 text-right">Collected</th>
                                        <th className="px-6 py-4 text-right">Balance</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {!loading && vouchers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-32 text-center text-slate-300 font-medium font-bold text-base">
                                                No fee records found for this student.
                                            </td>
                                        </tr>
                                    ) : (
                                        vouchers.map(v => {
                                            const vTotal = parseFloat(v.amount);
                                            const vPaid = parseFloat(v.paidAmount || 0);
                                            const vBal = vTotal - vPaid;

                                            return (
                                                <tr key={v.id} className="hover:bg-slate-50/80 transition-all duration-150 group">
                                                    <td className="px-8 py-4">
                                                        <div className="font-bold text-slate-700">
                                                            {monthNames[v.month - 1]} {v.year}
                                                        </div>
                                                        {v.extraChargeName && (
                                                            <div className="text-[10px] text-indigo-500 font-bold italic">
                                                                + {v.extraChargeName} (Rs. {parseFloat(v.extraChargeAmount).toLocaleString()})
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-black text-slate-900 tabular-nums">Rs. {vTotal.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right font-black text-emerald-600 tabular-nums">Rs. {vPaid.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right font-black text-rose-500 tabular-nums">Rs. {vBal.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {getStatusBadge(v.status)}
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleOpenPay(v)}
                                                                disabled={v.status === 'PAID'}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-[10px] font-black transition-all disabled:opacity-20"
                                                                title="Receive Payment"
                                                            >
                                                                <FaMoneyBillWave />
                                                                PAY
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenPrint(v)}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-[10px] font-black transition-all"
                                                                title="Print Voucher"
                                                            >
                                                                <FaPrint />
                                                                PRINT
                                                            </button>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={(e) => handleDeleteVoucher(e, v.id)}
                                                                    disabled={v.status === 'PAID' || v.status === 'PARTIAL'}
                                                                    className="flex items-center justify-center p-2 bg-slate-100 hover:bg-rose-500 hover:text-white rounded-lg text-rose-500 transition-all disabled:opacity-20"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrashAlt />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-4 border-t border-slate-50 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="scale-90 sm:scale-100">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(p) => fetchFees(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Collection Modal */}
                {bulkCollectOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-emerald-600" />
                                    Fee Collection
                                </h2>
                                <button onClick={() => setBulkCollectOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full">
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleBulkCollect} className="p-6">
                                <p className="text-sm text-gray-500 mb-4 font-medium">
                                    Entered amount will be adjusted automatically across oldest pending vouchers for <b>{student.name}</b>.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Received Amount (Rs.)</label>
                                        <input
                                            type="number"
                                            required
                                            autoFocus
                                            value={bulkAmount}
                                            onChange={(e) => setBulkAmount(e.target.value)}
                                            className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xl font-black font-mono shadow-inner"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setBulkCollectOpen(false)}
                                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-bold transition-all"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !bulkAmount || parseFloat(bulkAmount) <= 0}
                                            className="flex-1 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                                        >
                                            {processing ? <FaSpinner className="animate-spin" /> : "CONFIRM RECEIPT"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Discount Modal */}
                {discountOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaFileInvoiceDollar className="text-slate-800" />
                                    Apply Discount
                                </h2>
                                <button onClick={() => setDiscountOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full">
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleApplyDiscount} className="p-6">
                                <p className="text-sm text-gray-500 mb-4 font-medium">
                                    Discount will reduce the outstanding balance starting from the oldest vouchers.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount Amount (Rs.)</label>
                                        <input
                                            type="number"
                                            required
                                            autoFocus
                                            value={bulkAmount}
                                            onChange={(e) => setBulkAmount(e.target.value)}
                                            className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none text-xl font-black font-mono shadow-inner"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setDiscountOpen(false)}
                                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-bold transition-all"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !bulkAmount || parseFloat(bulkAmount) <= 0}
                                            className="flex-1 px-8 py-2.5 bg-slate-800 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg disabled:opacity-50"
                                        >
                                            {processing ? <FaSpinner className="animate-spin" /> : "APPLY DISCOUNT"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
