import React from 'react';
import dayjs from 'dayjs';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const FamilyVoucherSlip = ({ family, students, group, copyType }) => {
    const monthName = monthNames[group.month - 1];

    // Create a map of student ID to voucher for easy lookup
    const studentVoucherMap = {};
    group.vouchers.forEach(v => {
        studentVoucherMap[v.studentId] = v;
    });

    return (
        <div className="slip flex-1 border border-gray-400 p-3 rounded-lg bg-white relative flex flex-col justify-between" style={{ minHeight: '100%', fontSize: '9px' }}>
            <div className="overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-1 mb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                        <img src="/logo.png" alt="Buraq School" className="w-6 h-6 object-contain grayscale" />
                        <h2 className="text-[15px] font-bold uppercase tracking-tight text-gray-900 leading-tight whitespace-nowrap">Buraq School & College</h2>
                    </div>
                    <p className="text-[8px] uppercase font-semibold text-gray-600 font-mono tracking-widest leading-none">Collective Fee Voucher - {copyType}</p>
                </div>

                {/* Payment Options Box */}
                <div className="bg-gray-50 p-1.5 rounded border border-gray-200 mb-2 text-[8px] leading-tight">
                    {/* (a) Easypaisa */}
                    <div className="flex flex-col border-b border-gray-100 pb-1 mb-1 px-0.5">
                        <span className="font-bold underline text-[6.5px] uppercase mb-0.5">(a) Easypaisa Account</span>
                        <div className="flex justify-between items-center font-mono text-gray-900 text-[8px]">
                            <span>A/c : 0311-5161902</span>
                            <span>Title : Fazal Hussain</span>
                        </div>
                    </div>

                    {/* (b) Bank Account */}
                    <div className="flex flex-col border-b border-gray-100 pb-1 mb-1 px-0.5">
                        <span className="font-bold underline text-[6.5px] uppercase mb-1">(b) Soneri Bank Ltd</span>
                        <div className="flex justify-between items-center font-mono text-gray-900 text-[8px]">
                            <span>A/c : 015920005257329</span>
                            <span>Title : Buraq School</span>
                        </div>
                    </div>

                    {/* (c) Cash in Office */}
                    <div className="flex justify-between px-0.5">
                        <span className="font-bold underline text-[6.5px] uppercase">(c) Cash in office</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] mb-2 border-b border-gray-100 pb-1">
                    <div className="font-semibold text-gray-700">Family ID: <span className="font-mono text-gray-900 ml-1">{family.id.toString().padStart(4, '0')}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Date: <span className="font-mono text-gray-900 ml-1">{dayjs().format('DD-MMM-YYYY')}</span></div>
                    <div className="font-semibold text-gray-700 uppercase tracking-tighter">Father: <span className="text-gray-900 font-bold ml-1">{family.fatherName}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Phone: <span className="font-mono text-gray-900 ml-1 font-bold">{family.fatherPhone}</span></div>
                    <div className="font-semibold text-gray-700">Month/Year: <span className="font-mono text-gray-900 ml-1 font-bold">{monthName} {group.year}</span></div>
                </div>

                {/* Sibling List Table */}
                <div className="flex-1 overflow-hidden">
                    <table className="w-full text-left text-[9px] border-collapse mb-1 border">
                        <thead className="bg-gray-100">
                            <tr className="border-b border-gray-400">
                                <th className="px-1 py-0.5 border-r font-bold">Student Name</th>
                                <th className="px-1 py-0.5 border-r font-bold">Class</th>
                                <th className="px-1 py-0.5 font-bold text-right">Fee (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => {
                                const voucher = studentVoucherMap[student.id];
                                return (
                                    <tr key={student.id} className="border-b border-gray-200">
                                        <td className="px-1 py-0.5 border-r font-medium uppercase truncate" style={{ maxWidth: '80px' }}>
                                            {student.name}
                                            {voucher?.extraChargeAmount > 0 && (
                                                <div className="text-[6px] normal-case text-orange-600 font-bold leading-none mt-0.5">
                                                    + {voucher.extraChargeName}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-1 py-0.5 border-r text-center font-mono">
                                            {student.currentClass}
                                        </td>
                                        <td className="px-1 py-0.5 text-right font-mono font-bold">
                                            {voucher ? parseFloat(voucher.amount).toFixed(2) : '0.00'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                            <tr>
                                <td colSpan="2" className="px-1 py-1 text-right border-r uppercase tracking-tighter">Collective Total:</td>
                                <td className="px-1 py-1 text-right font-mono text-indigo-800 underline">Rs. {parseFloat(group.totalAmount).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Fee Breakdown Legend */}
                <div className="text-[7px] text-gray-400 italic mb-2 leading-none">
                    * Fee includes: Tuition, Academy, and Lab/Misc charges.
                </div>
            </div>

            <div className="mt-auto">
                {/* Balance Calculation Section */}
                <div className="space-y-0.5 border-t border-gray-200 pt-1">
                    {/* Previous Outstanding */}
                    <div className="flex justify-between items-center text-[8px] font-mono px-1">
                        <span className="text-gray-500 uppercase tracking-tighter">Previous Outstanding:</span>
                        <span className="font-bold text-gray-900">Rs. {parseFloat(group.previousBalance || 0).toFixed(2)}</span>
                    </div>

                    {/* Current Month Total */}
                    <div className="flex justify-between items-center text-[8px] font-mono px-1">
                        <span className="text-gray-500 uppercase tracking-tighter">Current Month Total:</span>
                        <span className="font-bold text-gray-900">Rs. {parseFloat(group.totalAmount).toFixed(2)}</span>
                    </div>

                    {/* Collective Paid (Current Month) */}
                    {group.totalPaid > 0 && (
                        <div className="flex justify-between items-center bg-green-50 px-1 py-0.5 rounded text-[8px] font-mono border border-green-100">
                            <span className="font-bold text-green-700 uppercase tracking-tighter">Paid (This Month):</span>
                            <span className="font-bold text-green-800">Rs. {parseFloat(group.totalPaid).toFixed(2)}</span>
                        </div>
                    )}

                    {/* TOTAL PAYABLE */}
                    <div className="flex justify-between items-center bg-slate-900 text-white px-2 py-1 rounded shadow-sm text-[9px] font-mono">
                        <span className="font-black uppercase tracking-widest">Total Payable:</span>
                        <span className="font-black">
                            Rs. {(parseFloat(group.previousBalance || 0) + parseFloat(group.totalAmount) - parseFloat(group.totalPaid)).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end mt-1 pt-1 text-[8px] uppercase font-bold text-gray-500">
                    <div className="border-t-2 border-gray-400 w-16 pt-0.5 text-center">Cashier</div>
                    <div className="border-t-2 border-gray-400 w-16 pt-0.5 text-center">Depositor</div>
                </div>
            </div>
        </div>
    );
};

const BulkPrintFamilyVouchers = React.forwardRef(({ familyGroups }, ref) => {
    const copyTypes = ['School Copy', 'Student Copy', 'Bank/Office Copy'];

    return (
        <div ref={ref} className="bulk-print-container">
            {familyGroups.map((item, index) => (
                <div key={index} className="print-page" style={{
                    height: '210mm',
                    width: '297mm',
                    padding: '8mm',
                    boxSizing: 'border-box',
                    pageBreakAfter: 'always',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '5mm',
                    backgroundColor: 'white'
                }}>
                    {copyTypes.map((type, i) => (
                        <FamilyVoucherSlip
                            key={`${index}-${i}`}
                            family={item.family}
                            students={item.students}
                            group={item.group}
                            copyType={type}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

export default BulkPrintFamilyVouchers;
