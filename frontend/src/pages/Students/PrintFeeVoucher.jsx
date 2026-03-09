import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';

export default function PrintFeeVoucher({ isOpen, onClose, voucher, student }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Fee_Voucher_${student?.name}_${voucher?.month}_${voucher?.year}`,
        pageStyle: `
            @page { size: auto; margin: 5mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
            }
        `
    });

    if (!isOpen || !voucher || !student) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[voucher.month - 1];

    const totalAmount = parseFloat(voucher.amount);
    const paidAmount = parseFloat(voucher.paidAmount || 0);
    const balance = totalAmount - paidAmount;

    // We will render three identical slips: School Copy, Student Copy, Bank Copy
    const copyTypes = ['School Copy', 'Student Copy', 'Bank/Office Copy'];

    const renderSlip = (copyType, index) => (
        <div key={index} className="flex-1 border border-gray-400 p-4 rounded-lg bg-white relative flex flex-col justify-between" style={{ minHeight: '340px' }}>
            <div>
                {/* Header */}
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-2 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/logo.png" alt="Buraq School" className="w-8 h-8 object-contain grayscale" />
                        <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 leading-tight">Buraq School System</h2>
                    </div>
                    <p className="text-[10px] uppercase font-semibold text-gray-600">Fee Voucher - {copyType}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mb-3">
                    <div className="font-semibold text-gray-700">Voucher No: <span className="font-mono text-gray-900 ml-1">{voucher.id.toString().padStart(5, '0')}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Date: <span className="font-mono text-gray-900 ml-1">{dayjs().format('DD-MMM-YYYY')}</span></div>
                    <div className="font-semibold text-gray-700">Month/Year: <span className="font-mono text-gray-900 ml-1">{monthName} {voucher.year}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Roll No: <span className="font-mono text-gray-900 ml-1">{student.referenceNo || 'N/A'}</span></div>
                </div>

                {/* Student Detail */}
                <div className="bg-gray-100 rounded p-2 mb-3 text-[10px]">
                    <div className="flex justify-between">
                        <span className="font-bold text-gray-800">Student: {student.name}</span>
                        <span className="font-bold text-gray-800">Class: <span className="capitalize">{student.currentClass}</span> {student.section}</span>
                    </div>
                </div>

                {/* Fees Table */}
                <table className="w-full text-left text-[10px] border-collapse mb-3">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-800">
                            <th className="py-1 font-bold">Description</th>
                            <th className="py-1 font-bold text-right">Amount (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-gray-800 border-b border-gray-300">
                        {parseFloat(voucher.monthlyFee) > 0 && (
                            <tr>
                                <td className="py-1">Monthly Fee</td>
                                <td className="py-1 text-right">{parseFloat(voucher.monthlyFee).toFixed(2)}</td>
                            </tr>
                        )}
                        {parseFloat(voucher.academyFee) > 0 && (
                            <tr>
                                <td className="py-1 mt-1">Academy Fee</td>
                                <td className="py-1 mt-1 text-right">{parseFloat(voucher.academyFee).toFixed(2)}</td>
                            </tr>
                        )}
                        {parseFloat(voucher.labMiscFee) > 0 && (
                            <tr>
                                <td className="py-1 mt-1">Lab/Misc Fee</td>
                                <td className="py-1 mt-1 text-right">{parseFloat(voucher.labMiscFee).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                {/* Totals */}
                <div className="flex flex-col gap-0.5 text-[10px] font-mono mb-6">
                    <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="font-bold text-gray-800 uppercase text-[11px]">Total Fee:</span>
                        <span className="font-bold text-gray-900 text-[11px]">{totalAmount.toFixed(2)}</span>
                    </div>
                    {paidAmount > 0 && (
                        <div className="flex justify-between border-b border-gray-200 py-0.5 text-gray-600">
                            <span className="font-semibold uppercase">Total Paid:</span>
                            <span>{paidAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {balance > 0 && paidAmount > 0 && (
                        <div className="flex justify-between py-0.5 text-red-700">
                            <span className="font-bold uppercase">Balance:</span>
                            <span className="font-bold">{balance.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end mt-4 text-[9px] uppercase font-semibold text-gray-500">
                    <div className="border-t border-gray-400 w-24 pt-1 text-center">Cashier</div>
                    <div className="border-t border-gray-400 w-24 pt-1 text-center">Depositor</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[70] flex p-4 backdrop-blur-sm bg-black/70">
            <div className="w-full h-full flex flex-col mx-auto max-w-6xl relative">

                {/* Modal Header actions */}
                <div className="flex items-center justify-between mb-4 shrink-0 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Print Fee Voucher</h2>
                        <p className="text-sm text-gray-500">Review and print the 3-part academic fee slip.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-[#4B5EAA] hover:bg-[#3A4A8B] text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors"
                        >
                            <FaPrint /> Print Voucher
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Print Preview Container */}
                <div className="flex-1 overflow-auto bg-gray-100/50 rounded-xl p-4 sm:p-8 flex items-start justify-center">

                    {/* The Printable Page Area */}
                    <div ref={componentRef} className="bg-white p-6 shadow-sm w-full" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
                        <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-between print:flex-row print:gap-4 print:h-full pb-8">
                            {copyTypes.map((type, i) => renderSlip(type, i))}
                        </div>
                        {/* Optional cutting line indicator for print padding */}
                        <div className="border-t border-dashed border-gray-300 mt-2 text-center text-[10px] text-gray-400 print:hidden py-1">
                            ✂-------------------------------------------------- Fold or Cut Here --------------------------------------------------✂
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
