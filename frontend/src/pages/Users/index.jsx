import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import branchService from '@/services/branchService';
import Pagination from '@/components/common/Pagination';
import { FaSearch, FaUserEdit, FaTrash, FaLock, FaUserSlash, FaUserCheck, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Users() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ branchId: '', search: '' });

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchBranches();
        fetchUsers();
    }, [pagination.currentPage, filters]);

    const fetchBranches = async () => {
        try {
            const data = await branchService.getAllBranches();
            setBranches(data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers({
                page: pagination.currentPage,
                limit: 10,
                ...filters
            });
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await userService.toggleStatus(user.id);
            toast.success(`User ${user.isActive ? 'disabled' : 'enabled'} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
        try {
            await userService.deleteUser(id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        try {
            await userService.updateUserPassword(selectedUser.id, newPassword);
            toast.success('Password updated successfully');
            setShowPasswordModal(false);
            setNewPassword('');
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">User Management</h1>
                    <p className="text-text-muted">View and manage system users across all branches.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:grid-cols-3">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full rounded-lg border border-border py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                </div>
                <select
                    className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={filters.branchId}
                    onChange={(e) => setFilters(prev => ({ ...prev, branchId: e.target.value, page: 1 }))}
                >
                    <option value="">All Branches</option>
                    {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-text-muted">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Username / Email</th>
                                <th className="px-6 py-4 font-semibold">Display Name</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Branch</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-text-muted">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-text-muted">No users found.</td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-primary">{u.username}</div>
                                            <div className="text-xs text-text-muted">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{u.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-red-50 text-red-600' :
                                                    u.role === 'PRINCIPAL' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">{u.branch?.name || 'Central'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${u.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className={u.isActive ? 'text-green-600' : 'text-gray-400'}>{u.isActive ? 'Active' : 'Disabled'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }}
                                                    className="p-2 text-text-muted hover:text-primary transition-colors"
                                                    title="Change Password"
                                                >
                                                    <FaLock />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(u)}
                                                    className={`p-2 transition-colors ${u.isActive ? 'text-text-muted hover:text-orange-500' : 'text-green-500 hover:text-green-600'}`}
                                                    title={u.isActive ? 'Disable User' : 'Enable User'}
                                                >
                                                    {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 text-text-muted hover:text-error transition-colors"
                                                    title="Delete User"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="border-t border-border p-4">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                        />
                    </div>
                )}
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-primary mb-2">Update Password</h3>
                        <p className="text-sm text-text-muted mb-6">Enter a new password for <strong>{selectedUser?.username}</strong>.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-border p-3 focus:border-primary focus:outline-none"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowPasswordModal(false); setNewPassword(''); }}
                                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePassword}
                                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light shadow-md"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
