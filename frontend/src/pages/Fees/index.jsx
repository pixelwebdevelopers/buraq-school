import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import branchServiceDefault from '@/services/branchService';
import { FaMoneyBillWave, FaFileInvoiceDollar } from 'react-icons/fa';
import VoucherManager from './VoucherManager';

export default function Fees() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [branches, setBranches] = useState([]);

    // Global filters for the fees section
    const [filters, setFilters] = useState({
        branchId: user?.branchId || '',
        currentClass: '',
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString()
    });

    useEffect(() => {
        const fetchBranches = async () => {
            if (isAdmin) {
                try {
                    const data = await branchServiceDefault.getAllBranches();
                    setBranches(data);
                } catch (e) {
                    console.error("Failed to load branches.", e);
                }
            }
        };
        fetchBranches();
    }, [isAdmin]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const months = [
        { value: '1', label: 'January' }, { value: '2', label: 'February' },
        { value: '3', label: 'March' }, { value: '4', label: 'April' },
        { value: '5', label: 'May' }, { value: '6', label: 'June' },
        { value: '7', label: 'July' }, { value: '8', label: 'August' },
        { value: '9', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#4B5EAA]" />
                        Fees Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Bulk voucher generation, printing, and balance reporting.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isAdmin && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch</label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
                        <select
                            name="currentClass"
                            value={filters.currentClass}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                        >
                            <option value="">Select Class</option>
                            <option value="playgroup">Playgroup</option>
                            <option value="nursery">Nursery</option>
                            <option value="prep">Prep</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>Class {i + 1}</option>
                            ))}
                            <option value="firstyear">First Year</option>
                            <option value="secondyear">Second Year</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                        <select
                            name="month"
                            value={filters.month}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                        >
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                        <select
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content - Only Voucher Manager Now */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <VoucherManager filters={filters} isAdmin={isAdmin} />
            </div>
        </div>
    );
}
