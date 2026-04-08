import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes, FaSpinner } from 'react-icons/fa';
import dayjs from 'dayjs';
import familyService from '@/services/familyService';
import branchService from '@/services/branchService';

export default function PrintFamilyVoucher({ isOpen, onClose, group, family }) {
    const componentRef = useRef();
    const [allStudents, setAllStudents] = useState([]);
    const [branchAccounts, setBranchAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!family?.id) return;
            try {
                setLoading(true);
                // Fetch siblings
                const studentsRes = await familyService.getFamilyStudents(family.id);
                if (studentsRes.success) {
                    setAllStudents(studentsRes.data.filter(s => s.status === 'ACTIVE'));
                }

                // Fetch branch accounts
                if (family.branchId) {
                    const branchData = await branchService.getBranchById(family.branchId);
                    if (branchData && branchData.accounts) {
                        setBranchAccounts(branchData.accounts);
                    }
                }
            } catch (err) {
                console.error("Error fetching data for print:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && family) {
            fetchData();
        }
    }, [isOpen, family]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Family_Voucher_${family?.fatherName || 'Student'}_${group?.month}_${group?.year}`,
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
                    padding: 8mm !important;
                    box-sizing: border-box;
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 5mm !important;
                    overflow: hidden !important;
                    background: white !important;
                }
                 .slip {
                    width: 92mm !important;
                    flex: none !important;
                    height: 100%;
                    border: 1px solid #000 !important;
                    padding: 5mm !important;
                    box-sizing: border-box;
                    page-break-inside: avoid;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: space-between !important;
                    overflow: hidden !important;
                }
                table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                }
                th, td {
                    padding: 1mm !important;
                    border: 0.1mm solid #ccc !important;
                }
            }
        `
    });

    if (!isOpen || !group || !family) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[group.month - 1];

    const copyTypes = ['Student Copy'];

    // Cross-reference all students with vouchers in the group
    const studentVoucherMap = {};
    group.vouchers.forEach(v => {
        studentVoucherMap[v.studentId] = v;
    });

    const renderSlip = (copyType, index) => (
        <div key={index} className="slip border border-gray-400 p-3 rounded-lg bg-white relative flex flex-col justify-between" style={{ width: '92mm', minHeight: '100%', fontSize: '9px' }}>
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
                    {/* Dynamic Accounts */}
                    {branchAccounts.map((acc, idx) => (
                        <div key={idx} className="flex flex-col border-b border-gray-100 pb-1 mb-1 px-0.5 last:mb-0 last:border-0">
                            <span className="font-bold underline text-[6.5px] uppercase mb-0.5">({String.fromCharCode(97 + idx)}) {acc.name}</span>
                            <div className="flex justify-between items-center font-mono text-gray-900 text-[8px]">
                                <span>A/c : {acc.accountNumber}</span>
                                <span>Title : {acc.accountTitle}</span>
                            </div>
                        </div>
                    ))}

                    {/* Hardcoded Cash in Office */}
                    <div className={`flex justify-between px-0.5 ${branchAccounts.length > 0 ? 'border-t border-gray-100 pt-1 mt-1' : ''}`}>
                        <span className="font-bold underline text-[6.5px] uppercase">({String.fromCharCode(97 + branchAccounts.length)}) Cash in office</span>
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
                            {allStudents.map(student => {
                                const voucher = studentVoucherMap[student.id];
                                if (!voucher) return null;
                                return (
                                    <React.Fragment key={student.id}>
                                        <tr className="border-b border-gray-300 bg-gray-50/50">
                                            <td className="px-1 py-0.5 border-r font-bold uppercase truncate" style={{ maxWidth: '100px' }}>
                                                {student.name}
                                            </td>
                                            <td className="px-1 py-0.5 border-r text-center font-mono text-[8px]">
                                                {student.currentClass}
                                            </td>
                                            <td className="px-1 py-0.5 text-right font-mono font-bold bg-gray-100/50">
                                                {parseFloat(voucher.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                        {/* Breakdown items */}
                                        {parseFloat(voucher.monthlyFee) > 0 && (
                                            <tr className="border-b border-gray-100 text-[7.5px] text-gray-600">
                                                <td className="px-2 py-0 border-r italic" colSpan="2">Monthly Fee</td>
                                                <td className="px-1 py-0 text-right font-mono">{parseFloat(voucher.monthlyFee).toFixed(2)}</td>
                                            </tr>
                                        )}
                                        {parseFloat(voucher.academyFee) > 0 && (
                                            <tr className="border-b border-gray-100 text-[7.5px] text-gray-600">
                                                <td className="px-2 py-0 border-r italic" colSpan="2">Academy Fee</td>
                                                <td className="px-1 py-0 text-right font-mono">{parseFloat(voucher.academyFee).toFixed(2)}</td>
                                            </tr>
                                        )}
                                        {parseFloat(voucher.labMiscFee) > 0 && (
                                            <tr className="border-b border-gray-100 text-[7.5px] text-gray-600">
                                                <td className="px-2 py-0 border-r italic" colSpan="2">Lab/Misc Fee</td>
                                                <td className="px-1 py-0 text-right font-mono">{parseFloat(voucher.labMiscFee).toFixed(2)}</td>
                                            </tr>
                                        )}
                                        {parseFloat(voucher.extraChargeAmount) > 0 && (
                                            <tr className="border-b border-gray-100 text-[7.5px] text-gray-600">
                                                <td className="px-2 py-0 border-r italic" colSpan="2">{voucher.extraChargeName || 'Extra Charge'}</td>
                                                <td className="px-1 py-0 text-right font-mono">{parseFloat(voucher.extraChargeAmount).toFixed(2)}</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
                        <div ref={componentRef} className="print-container bg-white p-6 shadow-sm w-full" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
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
