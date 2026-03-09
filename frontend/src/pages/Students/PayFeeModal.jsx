import React, { useState } from 'react';
import { FaTimes, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import feeService from '@/services/feeService';

export default function PayFeeModal({ isOpen, onClose, voucher, onSuccess }) {
    const totalAmount = parseFloat(voucher?.amount || 0);
    const existingPaid = parseFloat(voucher?.paidAmount || 0);
    const remainingBalance = totalAmount - existingPaid;

    // Default to paying the full remaining balance
    const [paidAmount, setPaidAmount] = useState(remainingBalance);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !voucher) return null;

    const handleSavePayment = async (e) => {
        e.preventDefault();

        // Convert to float just in case
        const parsedAmount = parseFloat(paidAmount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }

        const newTotalPaid = existingPaid + parsedAmount;

        if (newTotalPaid > totalAmount) {
            setError(`Total paid amount cannot exceed total voucher amount (Rs. ${totalAmount}). You are trying to pay Rs. ${newTotalPaid}.`);
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await feeService.payVoucher(voucher.id, { paidAmount: newTotalPaid });
            if (res.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error updating payment:', err);
            setError(err.response?.data?.message || 'Failed to update payment. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        Process Payment
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Voucher Summary block */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-sm flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Voucher Total:</span>
                            <span className="font-mono font-bold text-gray-800">Rs. {totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-green-700">
                            <span className="font-medium">Already Paid:</span>
                            <span className="font-mono">Rs. {existingPaid}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 text-red-600">
                            <span className="font-bold">Remaining Balance:</span>
                            <span className="font-mono font-bold mb-1">Rs. {remainingBalance}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSavePayment} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Amount (Rs.)</label>
                            <input
                                type="number"
                                step="any"
                                min="1"
                                max={remainingBalance}
                                required
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none text-lg font-mono placeholder:text-gray-300 shadow-sm"
                                placeholder="0.00"
                            />
                            <p className="text-xs text-gray-400 mt-2 flex justify-between">
                                <span>Enter the amount customer is paying now.</span>

                            </p>
                        </div>

                        <div className="mt-4 flex gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-70 shadow-sm"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : "Confirm Payment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
