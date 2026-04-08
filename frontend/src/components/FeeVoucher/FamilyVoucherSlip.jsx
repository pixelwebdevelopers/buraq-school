import React from 'react';
import dayjs from 'dayjs';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function FamilyVoucherSlip({ group, family, students, accounts = [], branchName = "" }) {
    if (!group || !family || !students) return null;

    const monthName = monthNames[group.month - 1];
    const totalAmount = parseFloat(group.totalAmount);
    const totalPaid = parseFloat(group.totalPaid || 0);
    const previousBalance = parseFloat(group.previousBalance || 0);
    const currentTotal = totalAmount + previousBalance - totalPaid;

    // Create a map of student ID to voucher for easy lookup
    const studentVoucherMap = {};
    group.vouchers.forEach(v => {
        studentVoucherMap[v.studentId] = v;
    });

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

                <div className="mt-2 bg-black text-white px-8 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-center w-fit mx-auto">
                    Collective Fees Submission
                </div>
            </div>

            {/* Account Info Box */}
            <div className="border border-black p-2 mb-2 relative min-h-[70px]">
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
            <div className="space-y-1 text-[10px] mb-2">
                <div className="flex justify-between gap-3">
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Family ID:</span>
                        <span className="ml-2 font-bold">{family.id.toString().padStart(4, '0')}</span>
                    </div>
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Date:</span>
                        <span className="ml-2 font-mono">{dayjs().format('DD-MM-YYYY')}</span>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Month / Year:</span>
                        <span className="ml-2 font-bold uppercase">{monthName} / {group.year}</span>
                    </div>
                    <div className="flex-1 flex border-b border-black">
                        <span className="font-bold whitespace-nowrap">Father Name:</span>
                        <span className="ml-2 font-black uppercase truncate">{family.fatherName}</span>
                    </div>
                </div>
                <div className="flex border-b border-black">
                    <span className="font-bold whitespace-nowrap">Phone No:</span>
                    <span className="ml-2 font-bold flex-1 flex justify-around">
                        <span>1) {family.fatherPhone || '__________'}</span>
                        <span>2) {family.motherPhone || '__________'}</span>
                    </span>
                </div>
            </div>

            {/* Students Table Section (replaces the single Student Box) */}
            <div className="border border-black rounded-lg px-2 py-1 mb-2">
                <table className="w-full text-[9px] border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left py-0.5 font-black uppercase">Student Detail</th>
                            <th className="text-center py-0.5 font-black uppercase">Class</th>
                            <th className="text-right py-0.5 font-black uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            const voucher = studentVoucherMap[student.id];
                            if (!voucher) return null;
                            return (
                                <React.Fragment key={student.id}>
                                    <tr className="bg-gray-100/50">
                                        <td className="py-0.5 font-black uppercase truncate max-w-[120px]">{student.name}</td>
                                        <td className="py-0.5 text-center font-bold uppercase">{student.currentClass}</td>
                                        <td className="py-0.5 text-right font-black">Rs {parseFloat(voucher.amount).toFixed(0)}</td>
                                    </tr>
                                    {/* Detailed Breakdown */}
                                    {parseFloat(voucher.monthlyFee) > 0 && (
                                        <tr className="text-[8px] italic text-gray-600">
                                            <td className="pl-4 py-0" colSpan="2"> - Monthly Fee</td>
                                            <td className="text-right py-0">{parseFloat(voucher.monthlyFee).toFixed(0)}</td>
                                        </tr>
                                    )}
                                    {parseFloat(voucher.academyFee) > 0 && (
                                        <tr className="text-[8px] italic text-gray-600">
                                            <td className="pl-4 py-0" colSpan="2"> - Academy Fee</td>
                                            <td className="text-right py-0">{parseFloat(voucher.academyFee).toFixed(0)}</td>
                                        </tr>
                                    )}
                                    {parseFloat(voucher.labMiscFee) > 0 && (
                                        <tr className="text-[8px] italic text-gray-600">
                                            <td className="pl-4 py-0" colSpan="2"> - Lab/Misc Fee</td>
                                            <td className="text-right py-0">{parseFloat(voucher.labMiscFee).toFixed(0)}</td>
                                        </tr>
                                    )}
                                    {parseFloat(voucher.extraChargeAmount) > 0 && (
                                        <tr className="text-[8px] italic text-gray-600 border-b border-gray-200">
                                            <td className="pl-4 py-0" colSpan="2"> - {voucher.extraChargeName || 'Extra'}</td>
                                            <td className="text-right py-0">{parseFloat(voucher.extraChargeAmount).toFixed(0)}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto space-y-1 text-[10px]">
                <div className="flex justify-between">
                    <span className="font-bold">Previous Outstanding:</span>
                    <div className="flex border-b border-black w-28 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{previousBalance.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Current Month Collective:</span>
                    <div className="flex border-b border-black w-28 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{totalAmount.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between text-indigo-900 border-t-2 border-dashed border-gray-300 pt-1">
                    <span className="font-black uppercase tracking-tighter">Total Payable Amount:</span>
                    <div className="flex border-b-2 border-black w-28 justify-between px-1">
                        <span className="font-black">Rs:</span>
                        <span className="font-black text-[11px]">{currentTotal.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between italic text-gray-600">
                    <span className="font-bold">Received:</span>
                    <div className="flex border-b border-black w-28 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span>{totalPaid > 0 ? totalPaid.toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Balanced:</span>
                    <div className="flex border-b border-black w-28 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span>{(currentTotal - totalPaid).toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between pt-1">
                    <span className="font-bold">Received By:</span>
                    <div className="border-b border-black w-28"></div>
                </div>
            </div>
        </div>
    );
}
