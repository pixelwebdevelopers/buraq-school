import React, { useState, useEffect } from 'react';
import branchService from '@/services/branchService';
import IndividualVoucherSlip from '@/components/FeeVoucher/IndividualVoucherSlip';



export const VoucherSlip = ({ voucher, student, family, copyType, accounts = [], branchName = "" }) => {
    return (
        <IndividualVoucherSlip
            voucher={voucher}
            student={student}
            family={family}
            copyType={copyType}
            accounts={accounts}
            branchName={branchName}
        />
    );
};

const BulkPrintVouchers = React.forwardRef(({ vouchers }, ref) => {
    const [branchAccountsMap, setBranchAccountsMap] = useState({});
    const [branchNamesMap, setBranchNamesMap] = useState({});

    useEffect(() => {
        const fetchAllBranchAccounts = async () => {
            if (!vouchers || vouchers.length === 0) return;

            // Get unique branch IDs from students
            const branchIds = [...new Set(vouchers.map(v => v.Student?.branchId))];
            const map = {};

            try {
                await Promise.all(branchIds.map(async (id) => {
                    if (!id) return;
                    const data = await branchService.getBranchById(id);
                    if (data) {
                        map[id] = data.accounts || [];
                        setBranchNamesMap(prev => ({ ...prev, [id]: data.name || "" }));
                    }
                }));
                setBranchAccountsMap(map);
            } catch (err) {
                console.error("Error fetching branch accounts for bulk student print:", err);
            }
        };

        fetchAllBranchAccounts();
    }, [vouchers]);

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
                            family={voucher.Family}
                            copyType="Student Copy"
                            accounts={branchAccountsMap[voucher.Student?.branchId] || []}
                            branchName={branchNamesMap[voucher.Student?.branchId] || ""}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

export default BulkPrintVouchers;
