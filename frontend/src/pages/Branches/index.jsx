import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaMapMarkerAlt, FaUserTie, FaUsers } from 'react-icons/fa';
import branchService from '@/services/branchService';
import BranchForm from './BranchForm';

export default function Branches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger re-fetch

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const data = await branchService.getAllBranches();
                setBranches(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch branches:", err);
                setError("Failed to load branches. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, [refreshTrigger]);

    const handleOpenCreateForm = () => {
        setEditingBranch(null);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (branch) => {
        setEditingBranch(branch);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBranch(null);
    };

    const handleSubmitForm = async (formData) => {
        try {
            if (editingBranch) {
                await branchService.updateBranch(editingBranch.id, formData);
            } else {
                await branchService.createBranch(formData);
            }
            handleCloseForm();
            setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
        } catch (err) {
            console.error("Failed to save branch:", err);
            alert(err.response?.data?.message || 'Failed to save branch.');
        }
    };

    if (loading && branches.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4B5EAA] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Branch Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage school branches, assign principals, and view student capacities.</p>
                </div>
                <button
                    onClick={handleOpenCreateForm}
                    className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#3A4A8B] hover:shadow-lg"
                >
                    <FaPlus />
                    Add New Branch
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {branches.map(branch => (
                    <div key={branch.id} className="rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800">{branch.name}</h3>
                                <button
                                    onClick={() => handleOpenEditForm(branch)}
                                    className="p-2 text-gray-400 hover:text-[#4B5EAA] hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Edit Branch"
                                >
                                    <FaEdit />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm text-gray-600">
                                    <FaMapMarkerAlt className="mt-0.5 text-gray-400 shrink-0" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-600">
                                    <FaUserTie className="mt-0.5 text-gray-400 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">{branch.principal?.name || 'No Principal Assigned'}</p>
                                        {branch.principal?.email && <p className="text-xs text-gray-500">{branch.principal.email}</p>}
                                        {branch.principal?.phone && <p className="text-xs text-gray-500">{branch.principal.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 flex items-center justify-between border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaUsers className="text-[#4B5EAA]" />
                                <span className="font-medium text-gray-800">{branch.studentCount}</span> Students
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium border border-green-100">Active</span>
                        </div>
                    </div>
                ))}

                {branches.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <FaMapMarkerAlt className="mx-auto text-4xl text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No branches found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new school branch.</p>
                        <button
                            onClick={handleOpenCreateForm}
                            className="mt-4 px-4 py-2 inline-flex items-center text-sm font-medium text-[#4B5EAA] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                        >
                            <FaPlus className="mr-2 text-xs" /> Add Branch
                        </button>
                    </div>
                )}
            </div>

            <BranchForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmitForm}
                initialData={editingBranch}
            />
        </div>
    );
}
