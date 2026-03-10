import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import { FaUser, FaLock, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Settings() {
    const { user, setUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const data = await userService.updateProfile(profileData);
            setUser({ ...user, ...data.user });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (passwords.newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters');
        }

        try {
            await userService.updateMyPassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password update failed');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary">Account Settings</h1>
                <p className="text-text-muted">Manage your personal information and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Profile Information */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/5 text-primary rounded-lg">
                            <FaUser />
                        </div>
                        <h2 className="text-lg font-bold text-primary">Personal Information</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Username</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-border bg-gray-50 p-3 text-sm text-text-muted"
                                value={user?.username}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full rounded-xl border border-border bg-gray-50 p-3 text-sm text-text-muted"
                                value={user?.email}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Phone Number</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                                value={profileData.phone}
                                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-light active:scale-95"
                        >
                            <FaSave /> Save Profile Changes
                        </button>
                    </form>
                </div>

                {/* Security / Password */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-secondary/5 text-secondary rounded-lg">
                            <FaLock />
                        </div>
                        <h2 className="text-lg font-bold text-primary">Security & Password</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Current Password</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                                placeholder="••••••••"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                                required
                            />
                        </div>
                        <hr className="my-4 border-dashed border-border" />
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                                placeholder="Min. 6 characters"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                                placeholder="Repeat new password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-light active:scale-95"
                        >
                            Update Security Key
                        </button>
                    </form>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-8 rounded-2xl bg-primary-50 p-6 border border-primary/10">
                <p className="text-sm text-primary leading-relaxed opacity-80">
                    <strong className="block mb-1">Note:</strong>
                    Role-based permissions (<b>{user?.role}</b>) and branch assignments (<b>{user?.branchId ? `Branch #${user.branchId}` : 'Main Branch'}</b>)
                    can only be modified by a system administrator. If you need to change these details, please contact the main office.
                </p>
            </div>
        </div>
    );
}
