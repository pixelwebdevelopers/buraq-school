import { useState, useEffect, useCallback } from 'react';
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
    const [showUserModal, setShowUserModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        phone: '',
        role: 'STAFF',
        branchId: ''
    });

    const isAdmin = currentUser?.role === 'ADMIN';
    const isPrincipal = currentUser?.role === 'PRINCIPAL';

    useEffect(() => {
        if (isPrincipal) {
            setFilters(prev => ({ ...prev, branchId: currentUser.branchId }));
        }
        fetchBranches();
    }, [isPrincipal, currentUser?.branchId]);

    useEffect(() => {
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
        } catch {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                username: user.username,
                phone: user.phone || '',
                role: user.role,
                branchId: user.branchId || ''
            });
        } else {
            setSelectedUser(null);
            setFormData({
                name: '',
                email: '',
                username: '',
                password: '',
                phone: '',
                role: 'STAFF',
                branchId: isPrincipal ? currentUser.branchId : ''
            });
        }
        setShowUserModal(true);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await userService.updateUser(selectedUser.id, formData);
                toast.success('User updated successfully');
            } else {
                await userService.createUser(formData);
                toast.success('User created successfully');
            }
            setShowUserModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await userService.toggleStatus(user.id);
            toast.success(`User ${user.isActive ? 'disabled' : 'enabled'} successfully`);
            fetchUsers();
        } catch {
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
        } catch {
            toast.error('Failed to update password');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">User Management</h1>
                    <p className="text-text-muted">
                        {isPrincipal ? `Manage staff for Branch #${currentUser.branchId}` : 'View and manage system users across all branches.'}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-light active:scale-95"
                >
                    <FaPlus /> Add New User
                </button>
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
                {!isPrincipal && (
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
                )}
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
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenModal(u)}
                                                    className="p-2 text-text-muted hover:text-primary transition-colors"
                                                    title="Edit User"
                                                >
                                                    <FaUserEdit />
                                                </button>
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

            {/* User Create/Edit Modal */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-primary mb-6">
                            {selectedUser ? 'Edit User' : 'Create New User'}
                        </h3>

                        <form onSubmit={handleSubmitUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            {!selectedUser && (
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Initial Password</label>
                                    <input
                                        type="password"
                                        className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Role</label>
                                <select
                                    className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none disabled:bg-gray-50 disabled:text-text-muted"
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    disabled={!isAdmin}
                                >
                                    <option value="STAFF">Staff Member</option>
                                    <option value="PRINCIPAL">Principal</option>
                                    <option value="ADMIN">System Admin</option>
                                </select>
                            </div>
                            {!isPrincipal && (
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Branch Assignment</label>
                                    <select
                                        className="w-full rounded-xl border border-border p-3 focus:border-primary focus:outline-none"
                                        value={formData.branchId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                                    >
                                        <option value="">Central / No Branch</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="md:col-span-2 mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-6 py-2 text-sm font-bold border border-border rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-light shadow-md"
                                >
                                    {selectedUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                Save Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
