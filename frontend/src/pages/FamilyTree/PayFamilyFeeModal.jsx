import React, { useState, useEffect } from 'react';
import { FaTimes, FaMoneyBillWave, FaSpinner, FaUserGraduate } from 'react-icons/fa';
import feeService from '@/services/feeService';

export default function PayFamilyFeeModal({ isOpen, onClose, group, onSuccess }) {
    // group contains { month, year, vouchers: [] }
    // Initialize payments state: { voucherId: amountToPay }
    const [payments, setPayments] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (group && group.vouchers) {
            const initialPayments = {};
            group.vouchers.forEach(v => {
                if (v.status !== 'PAID') {
                    const remaining = parseFloat(v.amount) - parseFloat(v.paidAmount || 0);
                    initialPayments[v.id] = remaining;
                } else {
                    initialPayments[v.id] = 0;
                }
            });
            setPayments(initialPayments);
        }
    }, [group]);

    if (!isOpen || !group) return null;

    const handleInputChange = (voucherId, value) => {
        setPayments(prev => ({
            ...prev,
            [voucherId]: value
        }));
    };

    const handleSavePayments = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const promises = [];
            for (const voucher of group.vouchers) {
                const amountToAdd = parseFloat(payments[voucher.id] || 0);
                if (amountToAdd > 0) {
                    const currentPaid = parseFloat(voucher.paidAmount || 0);
                    const totalAmount = parseFloat(voucher.amount);
                    const newTotalPaid = currentPaid + amountToAdd;

                    if (newTotalPaid > totalAmount) {
                        throw new Error(`Amount for ${voucher.Student?.name} exceeds remaining balance.`);
                    }

                    promises.push(feeService.payVoucher(voucher.id, { paidAmount: newTotalPaid }));
                }
            }

            if (promises.length === 0) {
                setError('Please enter a payment amount for at least one student.');
                setSaving(false);
                return;
            }

            await Promise.all(promises);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating family payments:', err);
            setError(err.message || err.response?.data?.message || 'Failed to update payments.');
        } finally {
            setSaving(false);
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const totalToPay = Object.values(payments).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        Receive Family Payment: {monthNames[group.month - 1]} {group.year}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6 font-medium">
                        Specify the amount received for each student individually. The total will be tracked against the family's collective account.
                    </p>

                    <form onSubmit={handleSavePayments} className="flex flex-col gap-4">
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {group.vouchers.map(voucher => {
                                const remaining = parseFloat(voucher.amount) - parseFloat(voucher.paidAmount || 0);
                                const isPaid = voucher.status === 'PAID';

                                return (
                                    <div key={voucher.id} className={`p-4 rounded-xl border ${isPaid ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <FaUserGraduate />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{voucher.Student?.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ROLL: {voucher.Student?.referenceNo || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right shrink-0">
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Remaining</p>
                                                    <p className="text-sm font-black text-red-500 font-mono">Rs. {remaining}</p>
                                                </div>
                                                <div className="w-32">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="0.00"
                                                        disabled={isPaid}
                                                        value={isPaid ? "PAID" : (payments[voucher.id] || '')}
                                                        onChange={(e) => handleInputChange(voucher.id, e.target.value)}
                                                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none font-mono text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
                            <div className="text-center md:text-left">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Payment Being Received</p>
                                <p className="text-3xl font-black font-mono text-green-600 tracking-tight">Rs. {totalToPay.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || totalToPay <= 0}
                                    className="flex-1 md:flex-none px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? <FaSpinner className="animate-spin" /> : "Confirm Batch Payment"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
