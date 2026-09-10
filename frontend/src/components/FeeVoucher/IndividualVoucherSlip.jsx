import React from 'react';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function IndividualVoucherSlip({ voucher, student, family, copyType, accounts = [], branchName = "" }) {
    if (!voucher || !student) return null;

    // Use passed family or fallback to student.Family or voucher.Family
    const familyData = family || voucher.Family || student.Family || {};

    const monthName = monthNames[voucher.month - 1];
    const totalAmount = parseFloat(voucher.amount);
    const paidAmount = parseFloat(voucher.paidAmount || 0);
    const previousBalance = parseFloat(voucher.previousBalance || 0);
    const currentTotal = totalAmount + previousBalance;

    return (
        <div className="slip bg-white relative flex flex-col justify-between" style={{
            width: '92mm',
            minHeight: '100%',
            padding: '4mm',
            border: '2px solid #000',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div>
                {/* Top Bar: Family ID & Month Year */}
                <div className="flex justify-between items-center text-xs font-black uppercase mb-1 pb-1 border-b border-gray-300">
                    <span>Family ID: {familyData.id?.toString().padStart(4, '0') || '____'}</span>
                    <span>{monthName} {voucher.year}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col items-center mb-1.5">
                    <div className="flex flex-col items-center w-full justify-center text-center">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain grayscale" />
                            <h1 className="text-base font-black uppercase underline decoration-2 underline-offset-4 whitespace-nowrap">Buraq School & College</h1>
                        </div>
                        {branchName && <div className="text-[11px] font-black uppercase tracking-widest mt-0.5">{branchName}</div>}
                    </div>

                    <div className="mt-1 bg-black text-white px-6 py-0.5 rounded-full text-xs font-black tracking-wider uppercase text-center">
                        Due Date = 8th of each month
                    </div>
                </div>

                {/* Account Info Box */}
                <div className="border border-black rounded-lg p-2 mb-2">
                    <div className="space-y-1 text-xs">
                        {accounts.length > 0 ? (
                            accounts.map((acc, idx) => {
                                const label = acc.name?.toLowerCase().endsWith('account') ? acc.name : `${acc.name} Account`;
                                return (
                                    <div key={idx} className="leading-tight">
                                        <div className="font-black uppercase text-[11px]">
                                            ({String.fromCharCode(65 + idx)}) {label}
                                        </div>
                                        <div className="ml-3 font-mono text-xs font-black">
                                            A/c: {acc.accountNumber} {acc.accountTitle ? `- ${acc.accountTitle}` : ''}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-[10px] leading-tight italic text-gray-400">No bank accounts configured</div>
                        )}

                        <div className="pt-1 border-t border-gray-300 font-black uppercase text-[11px]">
                            ({String.fromCharCode(65 + accounts.length)}) Cash in office
                        </div>
                    </div>
                </div>

                {/* Info Grid (Father Name & Phone) */}
                <div className="space-y-1 text-sm mb-2">
                    <div className="flex items-center">
                        <span className="font-bold whitespace-nowrap">Father Name:</span>
                        <span className="ml-2 font-black uppercase truncate">{familyData.fatherName || '________________'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold whitespace-nowrap">Phone:</span>
                        <span className="ml-2 font-mono font-black text-sm tracking-wide">{familyData.fatherPhone || familyData.motherPhone || '__________'}</span>
                    </div>
                </div>

                {/* Student Box */}
                <div className="border border-black rounded-lg px-2.5 py-1.5 mb-2">
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex-1 flex mr-2 truncate">
                            <span className="font-bold">Student:</span>
                            <span className="ml-1.5 font-black uppercase truncate">{student.name}</span>
                        </div>
                        <div className="flex shrink-0">
                            <span className="font-bold">Class:</span>
                            <span className="ml-1.5 font-black uppercase">{student.currentClass} - {student.section}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-2">
                    <div className="flex justify-between font-black border-b-2 border-black text-sm pb-0.5 mb-1.5">
                        <span>Description</span>
                        <span>Amount (Rs.)</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        {parseFloat(voucher.monthlyFee) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-bold">Monthly Fee</span>
                                <span className="font-black">Rs = {parseFloat(voucher.monthlyFee).toFixed(0)}</span>
                            </div>
                        )}
                        {parseFloat(voucher.academyFee) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-bold">Academy Fee</span>
                                <span className="font-black">Rs = {parseFloat(voucher.academyFee).toFixed(0)}</span>
                            </div>
                        )}
                        {parseFloat(voucher.labMiscFee) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-bold">Lab / Misc Fee</span>
                                <span className="font-black">Rs = {parseFloat(voucher.labMiscFee).toFixed(0)}</span>
                            </div>
                        )}
                        {parseFloat(voucher.extraChargeAmount) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-bold">{voucher.extraChargeName || 'Extra Fee'}</span>
                                <span className="font-black">Rs = {parseFloat(voucher.extraChargeAmount).toFixed(0)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                    <span className="font-bold">Previous Outstanding:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{previousBalance.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Current Month Bill:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{totalAmount.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-indigo-950 border-t-2 border-dashed border-gray-400 pt-1 font-black text-sm">
                    <span className="uppercase">TOTAL AMOUNT:</span>
                    <div className="flex border-b-2 border-black w-32 justify-between px-1">
                        <span className="font-black">Rs:</span>
                        <span className="font-black text-base">{currentTotal.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center italic text-gray-700">
                    <span className="font-bold">Received:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-semibold">{paidAmount > 0 ? paidAmount.toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Balanced:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-bold">{paidAmount > 0 ? (currentTotal - paidAmount).toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-1.5">
                    <span className="font-bold">Received By:</span>
                    <div className="border-b border-black w-32"></div>
                </div>
            </div>
        </div>
    );
}
