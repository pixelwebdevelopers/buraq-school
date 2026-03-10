import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileInvoiceDollar, FaPrint, FaMoneyBillWave, FaSpinner, FaPlus, FaUsers } from 'react-icons/fa';
import feeService from '@/services/feeService';
import PayFamilyFeeModal from './PayFamilyFeeModal';
import PrintFamilyVoucher from './PrintFamilyVoucher';

export default function FamilyFeeModal({ isOpen, onClose, family }) {
    const [history, setHistory] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Generate form state
    const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
    const [genYear, setGenYear] = useState(new Date().getFullYear());

    // Modals
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedGroupForPay, setSelectedGroupForPay] = useState(null);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedGroupForPrint, setSelectedGroupForPrint] = useState(null);

    const fetchFees = useCallback(async () => {
        if (!family) return;
        setLoading(true);
        try {
            const res = await feeService.getFamilyFees(family.id);
            if (res.success) {
                setHistory(res.data.history);
                setTotalBalance(res.data.totalBalance);
            }
        } catch (error) {
            console.error("Failed to fetch family fees:", error);
        } finally {
            setLoading(false);
        }
    }, [family]);

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
                year: parseInt(genYear)
            });
            if (res.success) {
                fetchFees();
            }
        } catch (error) {
            console.error("Error generating family vouchers:", error);
            alert(error.response?.data?.message || 'Failed to generate vouchers.');
        } finally {
            setGenerating(false);
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
        if (allPaid) return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold font-mono">ALL PAID</span>;

        const anyPaid = vouchers.some(v => v.status === 'PAID' || v.status === 'PARTIAL');
        if (anyPaid) return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold font-mono">PARTIAL COLLECTIVE</span>;

        return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold font-mono">PENDING ALL</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-sm">
                            <FaFileInvoiceDollar className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                Family Fee Management: {family.fatherName}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">Family ID: {family.id} • Collective sibling account</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto flex flex-col md:flex-row gap-6 bg-gray-50/30">
                    {/* Left Panel */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6 shrink-0">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <h3 className="text-amber-100 text-sm font-semibold uppercase tracking-wider mb-2">Collective Balance</h3>
                            <div className="text-4xl font-black tracking-tight font-mono">
                                <span>Rs.</span> {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                <FaPlus className="text-amber-600" />
                                Bulk Generate (Siblings)
                            </h3>
                            <form onSubmit={handleGenerateVouchers} className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Month</label>
                                        <select
                                            value={genMonth}
                                            onChange={(e) => setGenMonth(e.target.value)}
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
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
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                                >
                                    {generating ? <FaSpinner className="animate-spin" /> : "Generate for All Siblings"}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center leading-tight">
                                    Generates vouchers for all active siblings for the selected month. Existing vouchers will be skipped.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-full md:w-2/3 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Family Fee History</h3>
                            {loading && <FaSpinner className="animate-spin text-gray-400" />}
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Month/Year</th>
                                        <th className="px-4 py-3">Siblings</th>
                                        <th className="px-4 py-3">Collective Total</th>
                                        <th className="px-4 py-3">Collective Paid</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {!loading && history.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No collective logs found. Generate some vouchers above.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map(group => (
                                            <tr key={`${group.month}-${group.year}`} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-4 py-3 font-bold text-gray-800">
                                                    {monthNames[group.month - 1]} {group.year}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-indigo-100">
                                                        <FaUsers className="text-[8px]" /> {group.vouchers.length}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-gray-600">Rs. {group.totalAmount}</td>
                                                <td className="px-4 py-3 font-mono text-green-600">Rs. {group.totalPaid}</td>
                                                <td className="px-4 py-3">{getGroupStatus(group.vouchers)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2 text-lg">
                                                        <button
                                                            onClick={() => handleOpenPay(group)}
                                                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                                            title="Receive Payment"
                                                        >
                                                            <FaMoneyBillWave />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenPrint(group)}
                                                            className="p-1 text-amber-600 hover:text-amber-700 transition-colors"
                                                            title="Print Collective Voucher"
                                                        >
                                                            <FaPrint />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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
        </div>
    );
}
