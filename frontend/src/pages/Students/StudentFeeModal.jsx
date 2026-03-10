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
                year: parseInt(genYear)
            });
            if (res.success) {
                toast.success("Voucher generated successfully.");
                fetchFees(1);
            }
        } catch (error) {
            console.error("Error generating voucher:", error);
            toast.error(error.response?.data?.message || 'Failed to generate voucher.');
        } finally {
            setGenerating(false);
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
                <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-8 sm:py-6 shrink-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Student Info & Balance */}
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

                        {/* Quick Generate Form */}
                        <div className="flex flex-wrap items-center gap-3 bg-slate-50/80 p-2 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 px-3 py-1.5">
                                <FaPlus className="text-indigo-500 text-[10px]" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing</span>
                            </div>
                            <select
                                value={genMonth}
                                onChange={(e) => setGenMonth(e.target.value)}
                                className="text-xs border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 min-w-[110px]"
                            >
                                {monthNames.map((name, index) => (
                                    <option key={index + 1} value={index + 1}>{name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={genYear}
                                onChange={(e) => setGenYear(e.target.value)}
                                className="text-xs border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white py-1.5 px-3 font-bold text-slate-700 w-20"
                            />
                            <button
                                onClick={handleGenerateVoucher}
                                disabled={generating}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                            >
                                {generating ? <FaSpinner className="animate-spin" /> : "GENERATE"}
                            </button>
                            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
                            <button 
                                onClick={onClose} 
                                className="text-slate-400 hover:text-slate-600 transition-all p-2 hover:bg-slate-200/50 rounded-xl"
                            >
                                <FaTimes className="text-base" />
                            </button>
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
                                                    <td className="px-8 py-4 font-bold text-slate-700">
                                                        {monthNames[v.month - 1]} {v.year}
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
                                    onPageChange={fetchFees}
                                />
                            </div>
                        </div>
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
