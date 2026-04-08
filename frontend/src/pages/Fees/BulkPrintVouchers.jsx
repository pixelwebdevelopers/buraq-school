import React from 'react';
import dayjs from 'dayjs';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const VoucherSlip = ({ voucher, student, copyType }) => {
    const monthName = monthNames[voucher.month - 1];
    const totalAmount = parseFloat(voucher.amount);
    const paidAmount = parseFloat(voucher.paidAmount || 0);

    return (
        <div className="slip border border-gray-400 p-4 rounded-lg bg-white relative flex flex-col justify-between" style={{ width: '92mm', minHeight: '100%', fontSize: '11px' }}>
            <div>
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-2 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/logo.png" alt="Buraq School" className="w-8 h-8 object-contain grayscale" />
                        <h2 className="text-[15px] font-bold uppercase tracking-tight text-gray-900 whitespace-nowrap leading-tight">Buraq School & College</h2>
                    </div>
                    <p className="text-[9px] uppercase font-semibold text-gray-600 tracking-widest font-mono leading-none">Fee Voucher - {copyType}</p>
                </div>

                {/* Payment Options Box */}
                <div className="bg-gray-50 p-2 rounded border border-gray-200 mb-3 text-[9px] leading-tight">
                    {/* (a) Easypaisa */}
                    <div className="flex flex-col border-b border-gray-100 pb-1 mb-1">
                        <span className="font-bold underline text-[7.5px] uppercase mb-0.5">(a) Easypaisa Account</span>
                        <div className="flex justify-between items-center font-mono text-gray-900 text-[9px]">
                            <span>A/c : 0311-5161902</span>
                            <span>Title : Fazal Hussain</span>
                        </div>
                    </div>

                    {/* (b) Bank Account */}
                    <div className="flex flex-col border-b border-gray-100 pb-1 mb-1">
                        <span className="font-bold underline text-[7.5px] uppercase mb-1">(b) Soneri Bank Ltd</span>
                        <div className="flex justify-between items-center font-mono text-gray-900 text-[9px]">
                            <span>A/c : 015920005257329</span>
                            <span>Title : Buraq School</span>
                        </div>
                    </div>

                    {/* (c) Cash in Office */}
                    <div className="flex justify-between items-center">
                        <span className="font-bold underline text-[7.5px] uppercase">(c) Cash in office</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mb-3">
                    <div className="font-semibold text-gray-700">Voucher No: <span className="font-mono text-gray-900 ml-1">{voucher.id.toString().padStart(5, '0')}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Date: <span className="font-mono text-gray-900 ml-1">{dayjs().format('DD-MMM-YYYY')}</span></div>
                    <div className="font-semibold text-gray-700">Month/Year: <span className="font-mono text-gray-900 ml-1 font-bold">{monthName} {voucher.year}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Family ID: <span className="font-mono text-gray-900 ml-1 font-bold">{(voucher.Family?.id || student?.familyId || '').toString().padStart(4, '0')}</span></div>
                    <div className="font-semibold text-gray-700 col-span-2">Phone No: <span className="font-mono text-gray-900 ml-1 font-bold">{voucher.Family?.fatherPhone || 'N/A'}</span></div>
                </div>

                <div className="bg-gray-100 rounded px-3 py-2 mb-3 text-[10px] border border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 tracking-tight">Student: <span className="uppercase text-gray-900 ml-1">{student.name}</span></span>
                        <span className="font-bold text-gray-800">Class: <span className="capitalize text-gray-900 ml-1 font-mono">{student.currentClass} - {student.section}</span></span>
                    </div>
                </div>

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
                        {parseFloat(voucher.extraChargeAmount) > 0 && (
                            <tr>
                                <td className="py-1 mt-1">{voucher.extraChargeName || 'Extra Fee'}</td>
                                <td className="py-1 mt-1 text-right font-bold">{parseFloat(voucher.extraChargeAmount).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <div className="flex flex-col gap-1 text-[11px] font-mono mb-4 bg-gray-50 p-2 rounded border border-gray-100 italic">
                    {/* Previous Outstanding */}
                    <div className="flex justify-between border-b border-gray-200 pb-1 text-gray-600">
                        <span className="font-bold uppercase tracking-tighter text-[9px]">Previous Outstanding:</span>
                        <span className="font-bold">Rs. {parseFloat(voucher.previousBalance || 0).toFixed(2)}</span>
                    </div>

                    {/* Current Bill */}
                    <div className="flex justify-between border-b border-gray-200 py-0.5 text-gray-600">
                        <span className="font-bold uppercase tracking-tighter text-[9px]">Current Month Bill:</span>
                        <span className="font-bold">Rs. {totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Paid (This Month) */}
                    {paidAmount > 0 && (
                        <div className="flex justify-between border-b border-gray-200 py-0.5 text-green-700">
                            <span className="font-bold uppercase tracking-tighter text-[9px]">Paid (This Month):</span>
                            <span className="font-bold">Rs. {paidAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {/* TOTAL PAYABLE */}
                    <div className="flex justify-between bg-slate-900 text-white px-2 py-1.5 rounded mt-1 shadow-sm">
                        <span className="font-black uppercase tracking-widest text-[10px]">Total Payable:</span>
                        <span className="font-black">
                            Rs. {(parseFloat(voucher.previousBalance || 0) + totalAmount - paidAmount).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-4 text-[9px] uppercase font-bold text-gray-500">
                    <div className="border-t-2 border-gray-400 w-20 pt-1 text-center">Cashier</div>
                    <div className="border-t-2 border-gray-400 w-20 pt-1 text-center">Depositor</div>
                </div>
            </div>
        </div>
    );
};

const BulkPrintVouchers = React.forwardRef(({ vouchers }, ref) => {
    // Group vouchers into chunks of 3
    const chunks = vouchers.reduce((acc, curr, i) => {
        const chunkIndex = Math.floor(i / 3);
        if (!acc[chunkIndex]) acc[chunkIndex] = [];
        acc[chunkIndex].push(curr);
        return acc;
    }, []);

    return (
        <div ref={ref} className="bulk-print-container">
            {chunks.map((chunk, index) => (
                <div key={index} className="print-page" style={{
                    height: '210mm',
                    width: '297mm',
                    padding: '10mm',
                    boxSizing: 'border-box',
                    pageBreakAfter: 'always',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10mm',
                    backgroundColor: 'white'
                }}>
                    {chunk.map((voucher) => (
                        <VoucherSlip
                            key={voucher.id}
                            voucher={voucher}
                            student={voucher.Student}
                            copyType="Student Copy"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

export default BulkPrintVouchers;
