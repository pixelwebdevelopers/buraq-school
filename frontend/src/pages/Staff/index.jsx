import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import staffService from '@/services/staffService';
import branchService from '@/services/branchService';
import toast from 'react-hot-toast';
import {
    FaPlus, FaSearch, FaFilter, FaUserTie, FaEdit, FaTrash,
    FaPhone, FaIdCard, FaMoneyBillWave, FaNotesMedical, FaBriefcase
} from 'react-icons/fa';
import Pagination from '@/components/common/Pagination';
import StaffForm from './StaffForm';

export default function Staff() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [staff, setStaff] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [staffToEdit, setStaffToEdit] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchTerm) params.search = searchTerm;
            if (selectedBranch && isAdmin) params.branchId = selectedBranch;
            if (selectedProfession) params.profession = selectedProfession;

            const response = await staffService.getStaff(params);
            setStaff(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            console.error('Failed to load staff:', err);
            setError('Failed to load staff.');
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, selectedBranch, selectedProfession, isAdmin]);

    useEffect(() => {
        if (!isAdmin) return;
        branchService.getAllBranches().then(setBranches).catch(() => {});
    }, [isAdmin]);

    useEffect(() => {
        const t = setTimeout(fetchStaff, 400);
        return () => clearTimeout(t);
    }, [fetchStaff]);

    const handleOpenForm = (member = null) => {
        setStaffToEdit(member);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setStaffToEdit(null);
        setIsFormOpen(false);
    };

    const handleSubmit = async (formData) => {
        setSaving(true);
        try {
            if (staffToEdit) {
                await staffService.updateStaff(staffToEdit.id, formData);
                toast.success('Staff member updated');
            } else {
                await staffService.createStaff(formData);
                toast.success('Staff member added');
            }
            handleCloseForm();
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save staff member');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (member) => {
        if (!window.confirm(`Permanently delete staff member "${member.name}"?`)) return;
        try {
            await staffService.deleteStaff(member.id);
            toast.success('Staff member deleted');
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const fmtPKR = (v) => Number(v || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage teachers and staff members per branch.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#3A4A8B] hover:shadow-lg"
                >
                    <FaPlus /> Add Staff
                </button>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPI icon={<FaUserTie />} label="Total Staff" value={pagination.totalCount || 0} color="indigo" />
                <KPI icon={<FaBriefcase />} label="Active" value={staff.filter(s => s.status === 'ACTIVE').length} color="green" />
                <KPI icon={<FaMoneyBillWave />} label="Sum (visible)" value={`Rs ${fmtPKR(staff.reduce((a, s) => a + Number(s.baseSalary || 0), 0))}`} color="amber" />
                <KPI icon={<FaNotesMedical />} label="Med. Leaves Total" value={staff.reduce((a, s) => a + Number(s.medicalLeaves || 0), 0)} color="rose" />
            </div>

            {/* Filter Bar */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, profession, phone, CNIC..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                    />
                </div>

                <div className="flex w-full md:w-auto gap-4 flex-1">
                    {isAdmin && (
                        <div className="relative flex-1">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select
                                value={selectedBranch}
                                onChange={(e) => { setSelectedBranch(e.target.value); setPage(1); }}
                                className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="relative flex-1">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <select
                            value={selectedProfession}
                            onChange={(e) => { setSelectedProfession(e.target.value); setPage(1); }}
                            className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                        >
                            <option value="">All Professions</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Senior Teacher">Senior Teacher</option>
                            <option value="Junior Teacher">Junior Teacher</option>
                            <option value="Principal">Principal</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Lab Assistant">Lab Assistant</option>
                            <option value="Librarian">Librarian</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Driver">Driver</option>
                            <option value="Guard">Guard</option>
                            <option value="Janitor">Janitor</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200">{error}</div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Staff</th>
                                <th className="px-6 py-4">Profession</th>
                                <th className="px-6 py-4">Base Salary</th>
                                <th className="px-6 py-4">Medical Leaves</th>
                                <th className="px-6 py-4">Contact</th>
                                {isAdmin && <th className="px-6 py-4">Branch</th>}
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={isAdmin ? 8 : 7} className="px-6 py-8 text-center text-gray-500">Loading staff...</td></tr>
                            ) : staff.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 8 : 7} className="px-6 py-14 text-center text-gray-500">
                                    <FaUserTie className="mx-auto text-4xl text-gray-300 mb-3" />
                                    <p>No staff members found.</p>
                                </td></tr>
                            ) : staff.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100 text-[#4B5EAA] font-bold text-xs uppercase">
                                                {member.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{member.name}</div>
                                                {member.cnic && (
                                                    <div className="text-[11px] text-gray-400 flex items-center gap-1 font-mono mt-0.5">
                                                        <FaIdCard className="text-[10px]" /> {member.cnic}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{member.profession}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">Rs {fmtPKR(member.baseSalary)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                                            {member.medicalLeaves || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.phone ? (
                                            <div className="flex items-center gap-1 text-xs text-gray-600 font-mono">
                                                <FaPhone className="text-gray-400 text-[10px]" /> {member.phone}
                                            </div>
                                        ) : <span className="text-gray-400 text-xs">—</span>}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-gray-600 text-xs font-semibold tracking-wide">
                                            {member.Branch?.name || 'N/A'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">{statusBadge(member.status)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenForm(member)}
                                                className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded text-xs transition-colors"
                                            >
                                                <FaEdit className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member)}
                                                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-1 px-3 rounded text-xs transition-colors"
                                            >
                                                <FaTrash className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                totalCount={pagination.totalCount}
            />

            {isFormOpen && (
                <StaffForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmit}
                    branches={branches}
                    isAdmin={isAdmin}
                    initialData={staffToEdit}
                    saving={saving}
                />
            )}
        </div>
    );
}

function KPI({ icon, label, value, color }) {
    const map = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600'
    };
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${map[color]}`}>{icon}</div>
            <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
                <div className="text-lg font-bold text-gray-800 leading-tight mt-0.5">{value}</div>
            </div>
        </div>
    );
}

function statusBadge(status) {
    const base = 'inline-flex items-center rounded-full px-2 py-1 text-[10px] uppercase tracking-wider font-bold ring-1 ring-inset';
    switch (status) {
        case 'ACTIVE':
            return <span className={`${base} bg-green-50 text-green-600 ring-green-600/20`}>Active</span>;
        case 'INACTIVE':
            return <span className={`${base} bg-gray-50 text-gray-600 ring-gray-600/20`}>Inactive</span>;
        case 'TERMINATED':
            return <span className={`${base} bg-red-50 text-red-600 ring-red-600/20`}>Terminated</span>;
        case 'RESIGNED':
            return <span className={`${base} bg-orange-50 text-orange-600 ring-orange-600/20`}>Resigned</span>;
        default:
            return <span className={`${base} bg-gray-50 text-gray-600 ring-gray-600/20`}>Unknown</span>;
    }
}
