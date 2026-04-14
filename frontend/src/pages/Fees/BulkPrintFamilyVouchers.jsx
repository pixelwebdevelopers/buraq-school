import React, { useState, useEffect } from 'react';
import branchService from '@/services/branchService';
import FamilyVoucherSlip from '@/components/FeeVoucher/FamilyVoucherSlip';
import PrintFooter from '@/components/common/PrintFooter';

const FamilyVoucherSlipInternal = ({ family, students, group, copyType, accounts = [], branchName = "" }) => {
    return (
        <FamilyVoucherSlip
            group={group}
            family={family}
            students={students}
            copyType={copyType}
            accounts={accounts}
            branchName={branchName}
        />
    );
};

const BulkPrintFamilyVouchers = React.forwardRef(({ familyGroups }, ref) => {
    const [branchAccountsMap, setBranchAccountsMap] = useState({});
    const [branchNamesMap, setBranchNamesMap] = useState({});

    useEffect(() => {
        const fetchAllBranchAccounts = async () => {
            if (!familyGroups || familyGroups.length === 0) return;

            // Get unique branch IDs
            const branchIds = [...new Set(familyGroups.map(item => item.family.branchId))];
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
                console.error("Error fetching branch accounts for bulk print:", err);
            }
        };

        fetchAllBranchAccounts();
    }, [familyGroups]);

    // Group families into chunks of 3
    const chunks = familyGroups.reduce((acc, curr, i) => {
        const chunkIndex = Math.floor(i / 3);
        if (!acc[chunkIndex]) acc[chunkIndex] = [];
        acc[chunkIndex].push(curr);
        return acc;
    }, []);

    return (
        <div ref={ref} className="bulk-print-container">
            {chunks.map((chunk, index) => (
                <div key={index} className="print-page relative" style={{
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
                    {chunk.map((item, i) => (
                        <FamilyVoucherSlipInternal
                            key={i}
                            family={item.family}
                            students={item.students}
                            group={item.group}
                            copyType="Student Copy"
                            accounts={branchAccountsMap[item.family.branchId] || []}
                            branchName={branchNamesMap[item.family.branchId] || ""}
                        />
                    ))}
                    <PrintFooter />
                </div>
            ))}
        </div>
    );
});

export default BulkPrintFamilyVouchers;
