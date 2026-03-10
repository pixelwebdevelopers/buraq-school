import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';

export default function PrintFeeVoucher({ isOpen, onClose, voucher, student }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Fee_Voucher_${student?.name}_${voucher?.month}_${voucher?.year}`,
        pageStyle: `
            @page { 
                size: landscape; 
                margin: 0; 
            }
            @media print {
                body { 
                    -webkit-print-color-adjust: exact; 
                    padding: 0 !important; 
                    margin: 0 !important; 
                }
                .print-container {
                    width: 297mm;
                    height: 210mm;
                    padding: 10mm !important;
                    box-sizing: border-box;
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 10mm !important;
                    background: white !important;
                }
                .slip {
                    flex: 1;
                    height: 100%;
                    border: 1px solid #000 !important;
                    padding: 8mm !important;
                    box-sizing: border-box;
                    page-break-inside: avoid;
                }
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
        <div key={index} className="slip flex-1 border border-gray-400 p-4 rounded-lg bg-white relative flex flex-col justify-between" style={{ minHeight: '100%', fontSize: '11px' }}>
            <div>
                {/* Header */}
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-2 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/logo.png" alt="Buraq School" className="w-8 h-8 object-contain grayscale" />
                        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 leading-tight">Buraq School System</h2>
                    </div>
                    <p className="text-[9px] uppercase font-semibold text-gray-600 tracking-widest font-mono">Fee Voucher - {copyType}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mb-3">
                    <div className="font-semibold text-gray-700">Voucher No: <span className="font-mono text-gray-900 ml-1">{voucher.id.toString().padStart(5, '0')}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Date: <span className="font-mono text-gray-900 ml-1">{dayjs().format('DD-MMM-YYYY')}</span></div>
                    <div className="font-semibold text-gray-700">Month/Year: <span className="font-mono text-gray-900 ml-1 font-bold">{monthName} {voucher.year}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Roll No: <span className="font-mono text-gray-900 ml-1 font-bold">{student.referenceNo || 'N/A'}</span></div>
                </div>

                {/* Student Detail */}
                <div className="bg-gray-100 rounded px-3 py-2 mb-3 text-[10px] border border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 tracking-tight">Student: <span className="uppercase text-gray-900 ml-1">{student.name}</span></span>
                        <span className="font-bold text-gray-800">Class: <span className="capitalize text-gray-900 ml-1 font-mono">{student.currentClass} - {student.section}</span></span>
                    </div>
                </div>

                {/* Fees Table */}
                <table className="w-full text-left text-[11px] border-collapse mb-3">
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
                                <td className="py-1 text-right font-bold">{parseFloat(voucher.monthlyFee).toFixed(2)}</td>
                            </tr>
                        )}
                        {parseFloat(voucher.academyFee) > 0 && (
                            <tr>
                                <td className="py-1 mt-1">Academy Fee</td>
                                <td className="py-1 mt-1 text-right font-bold">{parseFloat(voucher.academyFee).toFixed(2)}</td>
                            </tr>
                        )}
                        {parseFloat(voucher.labMiscFee) > 0 && (
                            <tr>
                                <td className="py-1 mt-1">Lab/Misc Fee</td>
                                <td className="py-1 mt-1 text-right font-bold">{parseFloat(voucher.labMiscFee).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                {/* Totals */}
                <div className="flex flex-col gap-1 text-[11px] font-mono mb-4 bg-gray-50 p-2 rounded border border-gray-100">
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="font-bold text-gray-800 uppercase tracking-tighter">Total Amount:</span>
                        <span className="font-black text-gray-900 underline">Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                    {paidAmount > 0 && (
                        <div className="flex justify-between border-b border-gray-200 py-0.5 text-green-700">
                            <span className="font-bold uppercase tracking-tighter text-[9px]">Amount Paid:</span>
                            <span className="font-bold">Rs. {paidAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {balance > 0 && paidAmount > 0 && (
                        <div className="flex justify-between py-0.5 text-red-700">
                            <span className="font-bold uppercase tracking-tighter text-[9px]">Remaining Balance:</span>
                            <span className="font-bold underline">Rs. {balance.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end mt-4 text-[9px] uppercase font-bold text-gray-500">
                    <div className="border-t-2 border-gray-400 w-20 pt-1 text-center">Cashier</div>
                    <div className="border-t-2 border-gray-400 w-20 pt-1 text-center">Depositor</div>
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
                    <div ref={componentRef} className="print-container bg-white p-6 shadow-sm w-full" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
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
