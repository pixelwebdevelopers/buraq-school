import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes, FaSpinner } from 'react-icons/fa';
import dayjs from 'dayjs';
import familyService from '@/services/familyService';

export default function PrintFamilyVoucher({ isOpen, onClose, group, family }) {
    const componentRef = useRef();
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!family?.id) return;
            try {
                const res = await familyService.getFamilyStudents(family.id);
                if (res.success) {
                    // Only active students
                    setAllStudents(res.data.filter(s => s.status === 'ACTIVE'));
                }
            } catch (err) {
                console.error("Error fetching siblings for print:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && family) {
            fetchStudents();
        }
    }, [isOpen, family]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Family_Voucher_${family?.fatherName || 'Student'}_${group?.month}_${group?.year}`,
        pageStyle: `
            @page { size: auto; margin: 3mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
            }
        `
    });

    if (!isOpen || !group || !family) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[group.month - 1];

    const copyTypes = ['School Copy', 'Student Copy', 'Bank/Office Copy'];

    // Cross-reference all students with vouchers in the group
    const studentVoucherMap = {};
    group.vouchers.forEach(v => {
        studentVoucherMap[v.studentId] = v;
    });

    const renderSlip = (copyType, index) => (
        <div key={index} className="flex-1 border border-gray-400 p-3 rounded-lg bg-white relative flex flex-col justify-between" style={{ minHeight: '380px', fontSize: '10px' }}>
            <div>
                {/* Header */}
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-1 mb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                        <img src="/logo.png" alt="Buraq School" className="w-6 h-6 object-contain grayscale" />
                        <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 leading-tight">Buraq School System</h2>
                    </div>
                    <p className="text-[8px] uppercase font-semibold text-gray-600">Collective Fee Voucher - {copyType}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] mb-2 border-b border-gray-100 pb-1">
                    <div className="font-semibold text-gray-700">Family ID: <span className="font-mono text-gray-900 ml-1">{family.id.toString().padStart(4, '0')}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Date: <span className="font-mono text-gray-900 ml-1">{dayjs().format('DD-MMM-YYYY')}</span></div>
                    <div className="font-semibold text-gray-700">Month/Year: <span className="font-mono text-gray-900 ml-1 font-bold">{monthName} {group.year}</span></div>
                    <div className="font-semibold text-gray-700 text-right">Father: <span className="text-gray-900 font-bold ml-1 uppercase">{family.fatherName}</span></div>
                </div>

                {/* Sibling List Table */}
                <table className="w-full text-left text-[9px] border-collapse mb-2 border">
                    <thead className="bg-gray-100">
                        <tr className="border-b border-gray-400">
                            <th className="px-1 py-0.5 border-r font-bold">Student Name</th>
                            <th className="px-1 py-0.5 border-r font-bold">Status</th>
                            <th className="px-1 py-0.5 font-bold text-right">Fee (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allStudents.map(student => {
                            const voucher = studentVoucherMap[student.id];
                            return (
                                <tr key={student.id} className="border-b border-gray-200">
                                    <td className="px-1 py-1 border-r font-medium">
                                        {student.name} <span className="text-[7px] text-gray-400">({student.currentClass})</span>
                                    </td>
                                    <td className="px-1 py-1 border-r text-center">
                                        {voucher ? (
                                            <span className={`font-bold ${voucher.status === 'PAID' ? 'text-green-600' : 'text-red-500 underline'}`}>
                                                {voucher.status}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic font-bold">PENDING GEN</span>
                                        )}
                                    </td>
                                    <td className="px-1 py-1 text-right font-mono">
                                        {voucher ? parseFloat(voucher.amount).toFixed(2) : '0.00'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold">
                        <tr>
                            <td colSpan="2" className="px-1 py-1 text-right border-r uppercase tracking-tighter">Collective Total:</td>
                            <td className="px-1 py-1 text-right font-mono text-indigo-700">Rs. {parseFloat(group.totalAmount).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Fee Breakdown Legend (Optional/Compact) */}
                <div className="text-[7.5px] text-gray-500 italic mb-2 leading-tight border-l-2 border-indigo-200 pl-1">
                    * Fee includes: Tuition, Academy, and Lab/Misc charges as defined in student profile.
                </div>
            </div>

            <div className="mt-auto">
                {/* Collective Balance info if partially paid */}
                {group.totalPaid > 0 && (
                    <div className="flex justify-between items-center bg-green-50 px-2 py-1 rounded mb-2 border border-green-100 text-[9px] font-mono">
                        <span className="font-bold text-green-700 uppercase">Paid So Far:</span>
                        <span className="font-black text-green-800">Rs. {parseFloat(group.totalPaid).toFixed(2)}</span>
                    </div>
                )}

                {/* Collective Remaining */}
                {(group.totalAmount - group.totalPaid) > 0 && (
                    <div className="flex justify-between items-center bg-red-50 px-2 py-1 rounded mb-4 border border-red-100 text-[9px] font-mono">
                        <span className="font-bold text-red-700 uppercase">Remaining Due:</span>
                        <span className="font-black text-red-800 underline">Rs. {(group.totalAmount - group.totalPaid).toFixed(2)}</span>
                    </div>
                )}

                {/* Signatures */}
                <div className="flex justify-between items-end mt-2 pt-2 text-[8px] uppercase font-bold text-gray-500">
                    <div className="border-t border-gray-400 w-16 pt-0.5 text-center">Cashier</div>
                    <div className="border-t border-gray-400 w-16 pt-0.5 text-center">Depositor</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[70] flex p-4 backdrop-blur-sm bg-black/70 overflow-hidden">
            <div className="w-full h-full flex flex-col mx-auto max-w-6xl relative">
                {/* Modal Header actions */}
                <div className="flex items-center justify-between mb-4 shrink-0 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Collective Print Preview
                            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{monthName} {group.year}</span>
                        </h2>
                        <p className="text-sm text-gray-500">Printing combined fee voucher for all siblings in the family.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            disabled={loading}
                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <FaPrint />} Print Collective
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
                    {loading ? (
                        <div className="h-40 flex flex-col items-center justify-center gap-2">
                            <FaSpinner className="text-4xl text-amber-500 animate-spin" />
                            <p className="font-semibold text-gray-500">Fetching sibling data...</p>
                        </div>
                    ) : (
                        <div ref={componentRef} className="bg-white p-6 shadow-sm w-full" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
                            <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-between print:flex-row print:gap-4 print:h-full pb-8">
                                {copyTypes.map((type, i) => renderSlip(type, i))}
                            </div>
                            <div className="border-t border-dashed border-gray-300 mt-2 text-center text-[10px] text-gray-400 print:hidden py-1">
                                ✂-------------------------------------------------- Fold or Cut Here --------------------------------------------------✂
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
