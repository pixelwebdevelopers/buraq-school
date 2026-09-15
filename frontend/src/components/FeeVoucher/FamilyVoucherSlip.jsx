import React from 'react';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function FamilyVoucherSlip({ group, family, students, accounts = [], branchName = "" }) {
    if (!group || !family || !students) return null;

    const monthName = monthNames[group.month - 1];
    const totalAmount = parseFloat(group.totalAmount);
    const totalPaid = parseFloat(group.totalPaid || 0);
    const previousBalance = parseFloat(group.previousBalance || 0);
    const currentTotal = totalAmount + previousBalance;

    // Create a map of student ID to voucher for easy lookup
    const studentVoucherMap = {};
    group.vouchers.forEach(v => {
        studentVoucherMap[v.studentId] = v;
    });

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
                    <span>Family ID: {family.id.toString().padStart(4, '0')}</span>
                    <span>{monthName} {group.year}</span>
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

                    <div className="mt-1 bg-black text-white px-6 py-0.5 rounded-full text-xs font-black tracking-wider uppercase text-center w-fit mx-auto">
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
                        <span className="ml-2 font-black uppercase truncate">{family.fatherName}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold whitespace-nowrap">Phone:</span>
                        <span className="ml-2 font-mono font-black text-sm tracking-wide">{family.fatherPhone || family.motherPhone || '__________'}</span>
                    </div>
                </div>

                {/* Students Table Section */}
                <div className="border border-black rounded-lg px-2.5 py-1.5 mb-2">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="text-left py-1 font-black uppercase text-sm">Student Detail</th>
                                <th className="text-center py-1 font-black uppercase text-sm">Class</th>
                                <th className="text-right py-1 font-black uppercase text-sm">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                // 1. Build a list of billed students from vouchers if the Student relation is available
                                const billedStudents = [];
                                const seenStudentIds = new Set();

                                group.vouchers.forEach(v => {
                                    if (v.Student && !seenStudentIds.has(v.studentId)) {
                                        billedStudents.push({
                                            id: v.studentId,
                                            name: v.Student.name,
                                            currentClass: v.Student.currentClass,
                                            section: v.Student.section,
                                            voucher: v
                                        });
                                        seenStudentIds.add(v.studentId);
                                    }
                                });

                                // 2. Fallback to the passed students list (e.g. for bulk printing where relation isn't pre-loaded)
                                if (billedStudents.length === 0 && students) {
                                    students.forEach(student => {
                                        const voucher = studentVoucherMap[student.id];
                                        if (voucher && !seenStudentIds.has(student.id)) {
                                            billedStudents.push({
                                                id: student.id,
                                                name: student.name,
                                                currentClass: student.currentClass,
                                                section: student.section,
                                                voucher: voucher
                                            });
                                            seenStudentIds.add(student.id);
                                        }
                                    });
                                }

                                return billedStudents.map(item => {
                                    const { voucher } = item;
                                    return (
                                        <tr key={item.id} className="border-t border-gray-300">
                                            <td className="py-1 font-semibold uppercase text-xs truncate max-w-[120px]">{item.name}</td>
                                            <td className="py-1 text-center font-semibold uppercase text-xs">{item.currentClass}</td>
                                            <td className="py-1 text-right font-black text-sm">Rs {parseFloat(voucher.amount).toFixed(0)}</td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                    <span className="font-bold">Previous Outstanding:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-black">{previousBalance.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Current Month Collective:</span>
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
                        <span className="font-semibold">{totalPaid > 0 ? totalPaid.toFixed(0) : ''}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Balanced:</span>
                    <div className="flex border-b border-black w-32 justify-between px-1">
                        <span className="font-bold">Rs:</span>
                        <span className="font-bold">{totalPaid > 0 ? (currentTotal - totalPaid).toFixed(0) : ''}</span>
                    </div>
                </div>
            </div>

            {/* Received By Pinned to Bottom */}
            <div className="flex justify-between items-center  mt-5 pt-5 text-sm">
                <span className="font-bold">Received By:</span>
                <div className="border-b border-black w-32 mt-1"></div>
            </div>
        </div>
    );
}
