import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes, FaSpinner } from 'react-icons/fa';

import familyService from '@/services/familyService';
import branchService from '@/services/branchService';
import FamilyVoucherSlip from '@/components/FeeVoucher/FamilyVoucherSlip';
import PrintFooter from '@/components/common/PrintFooter';

export default function PrintFamilyVoucher({ isOpen, onClose, group, family }) {
    const componentRef = useRef();
    const [allStudents, setAllStudents] = useState([]);
    const [branchAccounts, setBranchAccounts] = useState([]);
    const [branchName, setBranchName] = useState("");
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
                    if (branchData) {
                        setBranchAccounts(branchData.accounts || []);
                        setBranchName(branchData.name || "");
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
        <FamilyVoucherSlip
            key={index}
            group={group}
            family={family}
            students={allStudents}
            copyType={copyType}
            accounts={branchAccounts}
            branchName={branchName}
        />
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
                        <div ref={componentRef} className="print-container bg-white p-6 shadow-sm w-full relative" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
                            <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-between print:flex-row print:gap-4 print:h-full pb-8">
                                {copyTypes.map((type, i) => renderSlip(type, i))}
                            </div>
                            <div className="border-t border-dashed border-gray-300 mt-2 text-center text-[10px] text-gray-400 print:hidden py-1">
                                ✂-------------------------------------------------- Fold or Cut Here --------------------------------------------------✂
                            </div>
                            <PrintFooter />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
