import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint, FaTimes } from 'react-icons/fa';
import branchService from '@/services/branchService';
import IndividualVoucherSlip from '@/components/FeeVoucher/IndividualVoucherSlip';
import PrintFooter from '@/components/common/PrintFooter';

export default function PrintFeeVoucher({ isOpen, onClose, voucher, student }) {
    const componentRef = useRef();
    const [branchAccounts, setBranchAccounts] = useState([]);
    const [branchName, setBranchName] = useState("");

    useEffect(() => {
        const fetchBranchAccounts = async () => {
            if (student?.branchId) {
                try {
                    const branchData = await branchService.getBranchById(student.branchId);
                    if (branchData) {
                        setBranchAccounts(branchData.accounts || []);
                        setBranchName(branchData.name || "");
                    }
                } catch (err) {
                    console.error("Error fetching branch accounts:", err);
                }
            }
        };

        if (isOpen && student) {
            fetchBranchAccounts();
        }
    }, [isOpen, student]);

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
                    width: 92mm !important;
                    flex: none !important;
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

    // Slips rendering
    const copyTypes = ['Student Copy'];

    const renderSlip = (copyType, index) => (
        <IndividualVoucherSlip
            key={index}
            voucher={voucher}
            student={student}
            family={voucher.Family || student.Family}
            copyType={copyType}
            accounts={branchAccounts}
            branchName={branchName}
        />
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
                    <div ref={componentRef} className="print-container bg-white p-6 shadow-sm w-full relative" style={{ width: '100%', maxWidth: '297mm', minHeight: '210mm' }}>
                        <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-between print:flex-row print:gap-4 print:h-full pb-8">
                            {copyTypes.map((type, i) => renderSlip(type, i))}
                        </div>
                        {/* Optional cutting line indicator for print padding */}
                        <div className="border-t border-dashed border-gray-300 mt-2 text-center text-[10px] text-gray-400 print:hidden py-1">
                            ✂-------------------------------------------------- Fold or Cut Here --------------------------------------------------✂
                        </div>
                        <PrintFooter />
                    </div>
                </div>
            </div>
        </div>
    );

}
