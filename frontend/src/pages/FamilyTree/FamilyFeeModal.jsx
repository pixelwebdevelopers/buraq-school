import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileInvoiceDollar, FaPrint, FaMoneyBillWave, FaSpinner, FaPlus, FaUsers } from 'react-icons/fa';
import feeService from '@/services/feeService';
import PayFamilyFeeModal from './PayFamilyFeeModal';
import PrintFamilyVoucher from './PrintFamilyVoucher';
import Pagination from '@/components/common/Pagination';

export default function FamilyFeeModal({ isOpen, onClose, family }) {
    const [history, setHistory] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });

    // Generate form state
    const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
    const [genYear, setGenYear] = useState(new Date().getFullYear());
    const [extraName, setExtraName] = useState('');
    const [extraAmount, setExtraAmount] = useState('');

    // Modals
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedGroupForPay, setSelectedGroupForPay] = useState(null);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedGroupForPrint, setSelectedGroupForPrint] = useState(null);

    // New Modals
    const [bulkCollectOpen, setBulkCollectOpen] = useState(false);
    const [discountOpen, setDiscountOpen] = useState(false);
    const [bulkAmount, setBulkAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchFees = useCallback(async () => {
        if (!family) return;
        setLoading(true);
        try {
            const res = await feeService.getFamilyFees(family.id, { page, limit: 5 });
            if (res.success) {
                setHistory(res.data.history);
                setTotalBalance(res.data.totalBalance);
                setPagination(res.data.pagination || { totalPages: 1, totalCount: res.data.history.length });
            }
        } catch (error) {
            console.error("Failed to fetch family fees:", error);
        } finally {
            setLoading(false);
        }
    }, [family, page]);

    useEffect(() => {
        if (isOpen && family) {
            fetchFees();
        }
    }, [isOpen, family, fetchFees]);

    const handleGenerateVouchers = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await feeService.generateFamilyVouchers({
                familyId: family.id,
                month: parseInt(genMonth),
                year: parseInt(genYear),
                extraChargeName: extraName,
                extraChargeAmount: parseFloat(extraAmount || 0)
            });
            if (res.success) {
                fetchFees();
                setExtraName('');
                setExtraAmount('');
            }
        } catch (error) {
            console.error("Error generating family vouchers:", error);
            alert(error.response?.data?.message || 'Failed to generate vouchers.');
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
                familyId: family.id,
                amount: parseFloat(bulkAmount)
            });
            if (res.success) {
                setBulkCollectOpen(false);
                setBulkAmount('');
                fetchFees();
            }
        } catch (error) {
            console.error("Bulk collection error:", error);
            alert(error.response?.data?.message || 'Failed to collect payment.');
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
                familyId: family.id,
                amount: parseFloat(bulkAmount)
            });
            if (res.success) {
                setDiscountOpen(false);
                setBulkAmount('');
                fetchFees();
            }
        } catch (error) {
            console.error("Discount error:", error);
            alert(error.response?.data?.message || 'Failed to apply discount.');
        } finally {
            setProcessing(false);
        }
    };

    const handleOpenPay = (group) => {
        // Only allow pay if at least one voucher is not paid
        const hasUnpaid = group.vouchers.some(v => v.status !== 'PAID');
        if (!hasUnpaid) return;

        setSelectedGroupForPay(group);
        setPayModalOpen(true);
    };

    const handleOpenPrint = (group) => {
        setSelectedGroupForPrint(group);
        setPrintModalOpen(true);
    };

    const handlePaymentComplete = () => {
        fetchFees();
    };

    if (!isOpen || !family) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getGroupStatus = (vouchers) => {
        const allPaid = vouchers.every(v => v.status === 'PAID');
        if (allPaid) return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">CLEARED</span>;

        const anyPaid = vouchers.some(v => v.status === 'PAID' || v.status === 'PARTIAL');
        if (anyPaid) return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">PARTIAL</span>;

        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200">DUE</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-7xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Unified Header & Controls Section */}
                <div className="relative border-b border-slate-100 bg-white px-4 py-4 sm:px-8 sm:py-6 shrink-0">
                    {/* Top Row: Info and Close Button */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 italic font-black text-xl">
                                    F
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-slate-800 truncate leading-tight">
                                        {family.fatherName}
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                        Ledger ID: {family.id}
                                    </p>
                                </div>
                            </div>

                            <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</span>
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
                                    onClick={handleGenerateVouchers}
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
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest">Financial Timeline</h3>
                            {loading && <FaSpinner className="animate-spin text-indigo-500" />}
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
                                <thead className="bg-[#F8FAFC] text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4">Statement Period</th>
                                        <th className="px-6 py-4">Count</th>
                                        <th className="px-6 py-4">Gross Bill</th>
                                        <th className="px-6 py-4">Collected</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {!loading && history.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-32 text-center text-slate-300 font-medium">
                                                No financial history available for this family account.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map(group => (
                                            <tr key={`${group.month}-${group.year}`} className="hover:bg-slate-50/80 transition-all duration-150 group">
                                                <td className="px-8 py-4 font-bold text-slate-700">
                                                    {monthNames[group.month - 1]} {group.year}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center h-6 w-6 bg-slate-100 text-slate-600 rounded-lg text-xs font-black border border-slate-200/50">
                                                        {group.vouchers.length}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-700 tabular-nums">Rs. {group.totalAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 font-black text-indigo-600 tabular-nums">Rs. {group.totalPaid.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-[10px] font-black tracking-widest">
                                                    {getGroupStatus(group.vouchers)}
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleOpenPay(group)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-[10px] font-black transition-all"
                                                            title="Receive Payment"
                                                        >
                                                            <FaMoneyBillWave />
                                                            RECEIVE
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenPrint(group)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-[10px] font-black transition-all"
                                                            title="Print Statement"
                                                        >
                                                            <FaPrint />
                                                            PRINT
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-4 border-t border-slate-50 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Collective Ledger Sync</span>
                            <div className="scale-90 sm:scale-100">
                                <Pagination
                                    currentPage={page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={setPage}
                                    totalCount={pagination.totalCount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Child Modals */}
            {payModalOpen && selectedGroupForPay && (
                <PayFamilyFeeModal
                    isOpen={payModalOpen}
                    onClose={() => {
                        setPayModalOpen(false);
                        setSelectedGroupForPay(null);
                    }}
                    group={selectedGroupForPay}
                    family={family}
                    onSuccess={handlePaymentComplete}
                />
            )}

            {printModalOpen && selectedGroupForPrint && (
                <PrintFamilyVoucher
                    isOpen={printModalOpen}
                    onClose={() => {
                        setPrintModalOpen(false);
                        setSelectedGroupForPrint(null);
                    }}
                    group={selectedGroupForPrint}
                    family={family}
                />
            )}

            {/* Bulk Collection Modal */}
            {bulkCollectOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaMoneyBillWave className="text-emerald-600" />
                                Collective Fee Collection
                            </h2>
                            <button onClick={() => setBulkCollectOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleBulkCollect} className="p-6">
                            <p className="text-sm text-gray-500 mb-4 font-medium">
                                Entered amount will be adjusted automatically starting from the oldest pending vouchers.
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
                                Apply Bulk Discount
                            </h2>
                            <button onClick={() => setDiscountOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleApplyDiscount} className="p-6">
                            <p className="text-sm text-gray-500 mb-4 font-medium">
                                Discount amount will reduce the bill starting from the oldest pending vouchers.
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
    );
}
