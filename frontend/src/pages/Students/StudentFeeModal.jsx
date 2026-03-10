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
    const limit = 10;

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
                return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">PAID</span>;
            case 'PARTIAL':
                return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">PARTIAL</span>;
            default:
                return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">PENDING</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-6xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                    <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-[#4B5EAA] to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl -ml-10 -mb-10"></div>

                            <h3 className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Total Outstanding</h3>
                            <div className="text-3xl font-black tracking-tight font-mono">
                                <span className="text-xl opacity-60 mr-1">Rs.</span>
                                {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                        </div>

                        {/* Generate Voucher Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><FaPlus className="text-xs" /></div>
                                New Voucher
                            </h3>
                            <form onSubmit={handleGenerateVoucher} className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Billing Month</label>
                                        <select
                                            value={genMonth}
                                            onChange={(e) => setGenMonth(e.target.value)}
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#4B5EAA] focus:border-[#4B5EAA] bg-gray-50 font-medium"
                                        >
                                            {monthNames.map((name, index) => (
                                                <option key={index + 1} value={index + 1}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Year</label>
                                        <input
                                            type="number"
                                            value={genYear}
                                            onChange={(e) => setGenYear(e.target.value)}
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#4B5EAA] focus:border-[#4B5EAA] bg-gray-50 font-mono"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#4B5EAA] hover:bg-[#3A4A8B] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70"
                                >
                                    {generating ? <FaSpinner className="animate-spin" /> : "Generate Voucher"}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center leading-tight">
                                    Voucher will include Monthly, Academy, and Lab fees.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel: List */}
                    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Generated Vouchers History</h3>
                            {loading && <FaSpinner className="animate-spin text-indigo-500" />}
                        </div>
                        <div className="flex-1 overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-center">Month/Year</th>
                                        <th className="px-6 py-4 text-right">Bill Amount</th>
                                        <th className="px-6 py-4 text-right">Paid</th>
                                        <th className="px-6 py-4 text-right">Balance</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {!loading && vouchers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <FaFileInvoiceDollar className="text-4xl mb-4 opacity-10" />
                                                    <p className="font-medium">No fee records found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        vouchers.map(v => {
                                            const vTotal = parseFloat(v.amount);
                                            const vPaid = parseFloat(v.paidAmount || 0);
                                            const vBal = vTotal - vPaid;

                                            return (
                                                <tr key={v.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-gray-800 text-center">
                                                        {monthNames[v.month - 1]} {v.year}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-gray-900 font-bold">Rs. {vTotal.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right font-mono text-green-600 font-bold">Rs. {vPaid.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right font-mono font-black text-red-500">Rs. {vBal.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-center">{getStatusBadge(v.status)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                            <button
                                                                onClick={() => handleOpenPay(v)}
                                                                disabled={v.status === 'PAID'}
                                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all disabled:opacity-20"
                                                                title="Receive Payment"
                                                            >
                                                                <FaMoneyBillWave className="text-xs" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenPrint(v)}
                                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-indigo-100 text-indigo-600 hover:bg-[#4B5EAA] hover:text-white transition-all"
                                                                title="Print Receipt"
                                                            >
                                                                <FaPrint className="text-xs" />
                                                            </button>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={(e) => handleDeleteVoucher(e, v.id)}
                                                                    disabled={v.status === 'PAID' || v.status === 'PARTIAL'}
                                                                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-20"
                                                                    title="Delete Voucher"
                                                                >
                                                                    <FaTrashAlt className="text-xs" />
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
                        {/* Standard Pagination component */}
                        <div className="border-t border-gray-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={fetchFees}
                                totalCount={pagination.totalCount}
                            />
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
