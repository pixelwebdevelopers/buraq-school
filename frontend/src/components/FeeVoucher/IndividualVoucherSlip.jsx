import React from 'react';
import dayjs from 'dayjs';

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
        <div className="slip bg-white relative flex flex-col" style={{
            width: '92mm',
            minHeight: '100%',
            padding: '5mm',
            border: '2px solid #000',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div className="flex flex-col items-center mb-2">
                <div className="flex flex-col items-center w-full justify-center text-center">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain grayscale" />
                        <h1 className="text-lg font-black uppercase underline decoration-2 underline-offset-4 whitespace-nowrap">Buraq School & College</h1>
                    </div>
                    {branchName && <div className="text-[12px] font-black uppercase tracking-widest mt-0.5">{branchName}</div>}
                </div>

                <div className="mt-2 bg-black text-white px-8 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Fees Submission
                </div>
            </div>

            {/* Account Info Box */}
            <div className="border border-black p-2 mb-3 relative min-h-[70px]">
                <div className="space-y-1">
                    {accounts.length > 0 ? (
                        accounts.map((acc, idx) => (
                            <div key={idx} className="text-[11px] leading-tight">
                                <span className="font-bold underline uppercase">({String.fromCharCode(97 + idx)}) {acc.name} Account</span>
                                <div className="ml-4 font-mono text-[13px] font-bold mt-1">A/c: {acc.accountNumber} - {acc.accountTitle}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-[10px] leading-tight italic text-gray-400">No bank accounts configured</div>
                    )}
                    <div className="text-[11px] leading-tight">
                        <span className="font-bold underline uppercase">({String.fromCharCode(97 + accounts.length)}) Cash in office</span>
                    </div>
                </div>
                {/* Due Date Box */}
                <div className="absolute bottom-1 right-1 border border-black px-1.5 py-0.5 text-[8px] font-bold bg-white uppercase">
                    Due date = 8th of each month
                </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-1 text-[10px] mb-3">
                <div className="flex justify-between gap-4">
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Family ID:</span>
                        <span className="ml-2 font-bold">{familyData.id?.toString().padStart(4, '0') || '____'}</span>
                    </div>
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Date:</span>
                        <span className="ml-2 font-mono">{dayjs().format('DD-MM-YYYY')}</span>
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Month / Year:</span>
                        <span className="ml-2 font-bold uppercase">{monthName} / {voucher.year}</span>
                    </div>
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Father Name:</span>
                        <span className="ml-2 font-black uppercase truncate">{familyData.fatherName || '________________'}</span>
                    </div>
                </div>
                <div className="flex border-b border-black">
                    <span className="font-bold whitespace-nowrap">Phone No:</span>
                    <span className="ml-2 font-bold flex-1 flex justify-around">
                        <span>1) {familyData.fatherPhone || '__________'}</span>
                        <span>2) {familyData.motherPhone || '__________'}</span>
                    </span>
                </div>
            </div>

            {/* Student Box */}
            <div className="border border-black rounded-xl px-4 py-2 mb-3">
                <div className="flex justify-between text-[11px]">
                    <div className="flex-1 flex border-b border-gray-400 mr-4">
                        <span className="font-bold">Student:</span>
                        <span className="ml-2 font-black uppercase truncate">{student.name}</span>
                    </div>
                    <div className="w-1/3 flex border-b border-gray-400">
                        <span className="font-bold">Class:</span>
                        <span className="ml-2 font-black uppercase">{student.currentClass} - {student.section}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1">
                <div className="flex justify-between font-bold border-b-2 border-black text-[11px] mb-1">
                    <span>Description</span>
                    <span>Amount (Rs.)</span>
                </div>
                <div className="space-y-1 text-[11px]">
                    {parseFloat(voucher.monthlyFee) > 0 && (
                        <div className="flex justify-between">
                            <span className="font-bold">Monthly Fee</span>
                            <span className="font-bold">Rs = {parseFloat(voucher.monthlyFee).toFixed(0)}</span>
                        </div>
                    )}
                    {parseFloat(voucher.academyFee) > 0 && (
                        <div className="flex justify-between">
                            <span className="font-bold">Academy Fee</span>
                            <span className="font-bold">Rs = {parseFloat(voucher.academyFee).toFixed(0)}</span>
                        </div>
                    )}
                    {parseFloat(voucher.labMiscFee) > 0 && (
                        <div className="flex justify-between">
                            <span className="font-bold">Lab / Misc Fee</span>
                            <span className="font-bold">Rs = {parseFloat(voucher.labMiscFee).toFixed(0)}</span>
                        </div>
                    )}
                    {parseFloat(voucher.extraChargeAmount) > 0 && (
                        <div className="flex justify-between">
                            <span className="font-bold">{voucher.extraChargeName || 'Extra Fee'}</span>
                            <span className="font-bold">Rs = {parseFloat(voucher.extraChargeAmount).toFixed(0)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 space-y-1 text-[11px]">
                <div className="flex justify-between">
                    <span className="font-bold">Previous Outstanding:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{previousBalance.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Current Month Bill:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{totalAmount.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between text-indigo-900 border-t-2 border-dashed border-gray-300 pt-1">
                    <span className="font-black uppercase">Total Payable Amount:</span>
                    <div className="flex border-b-2 border-black w-32 justify-between px-1">
                        <span className="font-black">Rs:</span>
                        <span className="font-black text-xs">{currentTotal.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between italic text-gray-600">
                    <span className="font-bold">Received:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span>{paidAmount > 0 ? paidAmount.toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Balanced:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span>{paidAmount > 0 ? (currentTotal - paidAmount).toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between pt-2">
                    <span className="font-bold">Received By:</span>
                    <div className="border-b border-black w-32"></div>
                </div>
            </div>
        </div>
    );
}
