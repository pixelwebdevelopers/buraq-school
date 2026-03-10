import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/apiServices';
import { FaPlus, FaSearch, FaFilter, FaUserGraduate, FaIdCard, FaPhoneAlt, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AdmissionForm from './AdmissionForm';
import Pagination from '@/components/common/Pagination';

// Helper to fetch branches if Admin
import branchServiceDefault from '@/services/branchService';

import StudentDetailModal from './StudentDetailModal';
import StudentFeeModal from './StudentFeeModal';

export default function Students() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);

    // Modal state for View/Print
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Modal state for Fees
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 0, totalCount: 0 });

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchTerm) params.search = searchTerm;
            if (selectedBranch && isAdmin) params.branchId = selectedBranch;
            if (selectedClass) params.currentClass = selectedClass;

            const response = await studentService.getStudents(params);
            setStudents(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch students:", err);
            setError("Failed to load students.");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedBranch, selectedClass, isAdmin, page]);

    useEffect(() => {
        const fetchBranchesList = async () => {
            if (isAdmin) {
                try {
                    const data = await branchServiceDefault.getAllBranches();
                    setBranches(data);
                } catch (e) {
                    console.error("Failed to load branches.", e);
                }
            }
        };
        fetchBranchesList();
    }, [isAdmin]);

    useEffect(() => {
        // Debounce search fetching
        const delayDebounceFn = setTimeout(() => {
            fetchStudents();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchStudents]);

    const handleOpenForm = (student = null) => {
        setStudentToEdit(student);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setStudentToEdit(null);
    };

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedStudent(null);
    };

    const handleOpenFeeModal = (e, student) => {
        e.stopPropagation(); // Prevent row click from opening detail modal
        setSelectedStudent(student);
        setIsFeeModalOpen(true);
    };

    const handleCloseFeeModal = () => {
        setIsFeeModalOpen(false);
        setSelectedStudent(null);
    };

    const handleSubmitForm = async (formData) => {
        try {
            if (studentToEdit) {
                await studentService.updateStudent(studentToEdit.id, formData);
            } else {
                await studentService.admitStudent(formData);
            }
            handleCloseForm();
            fetchStudents();
        } catch (err) {
            console.error("Failed to save student:", err);
            alert(err.response?.data?.message || 'Failed to save student.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-green-600 ring-1 ring-inset ring-green-600/20">Active</span>;
            case 'LEFT':
                return <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-600 ring-1 ring-inset ring-gray-600/20">Left</span>;
            case 'SUSPENDED':
                return <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-red-600 ring-1 ring-inset ring-red-600/20">Suspended</span>;
            case 'PASSED_OUT':
                return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-blue-600 ring-1 ring-inset ring-blue-600/20">Passed Out</span>;
            case 'STRUCK_OFF':
                return <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-orange-600 ring-1 ring-inset ring-orange-600/20">Struck Off</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-600 ring-1 ring-inset ring-gray-600/20">Unknown</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage enrollments, family records, and view student details.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#3A4A8B] hover:shadow-lg"
                >
                    <FaPlus />
                    Admit New Student
                </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Name, Father Name, or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                    />
                </div>

                <div className="flex w-full md:w-auto gap-4 flex-1">
                    {isAdmin && (
                        <div className="relative flex-1">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="relative flex-1">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] bg-white cursor-pointer"
                        >
                            <option value="">All Classes</option>
                            <option value="playgroup">Playgroup</option>
                            <option value="nursery">Nursery</option>
                            <option value="prep">Prep</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="firstyear">First Year</option>
                            <option value="secondyear">Second Year</option>
                        </select>
                    </div>
                </div>
            </div>


            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200">
                    {error}
                </div>
            )}

            {/* Students Data */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Family (Father)</th>
                                {isAdmin && <th className="px-6 py-4">Branch</th>}
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                                        Loading students...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                                        <FaUserGraduate className="mx-auto text-4xl text-gray-300 mb-3" />
                                        <p>No students found matching your filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                students.map(student => (
                                    <tr
                                        key={student.id}
                                        onClick={() => handleRowClick(student)}
                                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[#4B5EAA] font-bold text-xs shadow-sm shadow-indigo-100">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-700 capitalize">{student.currentClass}</span>
                                            {student.section && <span className="text-gray-400 ml-1 text-xs">({student.section})</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-800 font-medium">{student.Family?.fatherName || 'N/A'}</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 font-mono">
                                                    <FaPhoneAlt className="text-gray-400 text-[10px]" />
                                                    {student.Family?.fatherPhone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-gray-600 text-xs font-semibold tracking-wide">
                                                {student.Branch?.name || 'N/A'}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            {getStatusBadge(student.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenForm(student);
                                                    }}
                                                    className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded text-xs transition-colors"
                                                >
                                                    <FaEdit className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleOpenFeeModal(e, student)}
                                                    className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold py-1 px-3 rounded text-xs transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Fees
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                totalCount={pagination.totalCount}
            />

            {isFormOpen && (
                <AdmissionForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmitForm}
                    branches={branches}
                    isAdmin={isAdmin}
                    initialData={studentToEdit}
                />
            )}

            {isDetailModalOpen && selectedStudent && (
                <StudentDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    student={selectedStudent}
                    branchName={isAdmin ? branches.find(b => b.id === selectedStudent.branchId)?.name : user?.branchName}
                />
            )}

            {isFeeModalOpen && selectedStudent && (
                <StudentFeeModal
                    isOpen={isFeeModalOpen}
                    onClose={handleCloseFeeModal}
                    student={selectedStudent}
                />
            )}
        </div>
    );
}
