import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

export default function BranchForm({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        principalName: '',
        principalEmail: '',
        principalUsername: '',
        principalPassword: '',
        principalPhone: '',
        accounts: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                address: initialData.address || '',
                principalName: initialData.principal?.name || '',
                principalEmail: initialData.principal?.email || '',
                principalUsername: initialData.principal?.username || '',
                principalPassword: '', // Don't prefill password
                principalPhone: initialData.principal?.phone || '',
                accounts: initialData.accounts || []
            });
        } else {
            setFormData({
                name: '',
                address: '',
                principalName: '',
                principalEmail: '',
                principalUsername: '',
                principalPassword: '',
                principalPhone: '',
                accounts: []
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAccountChange = (index, field, value) => {
        const newAccounts = [...formData.accounts];
        newAccounts[index][field] = value;
        setFormData(prev => ({ ...prev, accounts: newAccounts }));
    };

    const addAccount = () => {
        setFormData(prev => ({
            ...prev,
            accounts: [...prev.accounts, { name: '', accountTitle: '', accountNumber: '' }]
        }));
    };

    const removeAccount = (index) => {
        setFormData(prev => ({
            ...prev,
            accounts: prev.accounts.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Edit Branch' : 'Add New Branch'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-4 flex-1">
                    <form id="branch-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Branch Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Branch Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name <span className="text-red-500">*</span></label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="e.g. Main Campus" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Address <span className="text-red-500">*</span></label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="123 Education St." />
                                </div>
                            </div>
                        </div>

                        {/* Principal Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Principal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input required type="text" name="principalName" value={formData.principalName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                    <input required type="email" name="principalEmail" value={formData.principalEmail} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                                    <input required type="text" name="principalUsername" value={formData.principalUsername} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="johndoe123" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" name="principalPhone" value={formData.principalPhone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="+1234567890" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password {initialData ? '(Leave blank to keep unchanged)' : <span className="text-red-500">*</span>}</label>
                                    <input required={!initialData} type="password" name="principalPassword" value={formData.principalPassword} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-lg font-semibold text-gray-700">Account Details</h3>
                                <button
                                    type="button"
                                    onClick={addAccount}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#4B5EAA] hover:text-[#3A4A8B] transition-colors bg-[#4B5EAA]/5 px-3 py-1.5 rounded-full border border-[#4B5EAA]/10"
                                >
                                    <FaPlus className="text-[10px]" /> Add Account
                                </button>
                            </div>

                            {formData.accounts.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">No accounts added yet. Accounts will appear on fee vouchers.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.accounts.map((account, index) => (
                                        <div key={index} className="relative bg-gray-50/50 p-4 rounded-xl border border-gray-100 group">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={account.name}
                                                        onChange={(e) => handleAccountChange(index, 'name', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all"
                                                        placeholder="e.g. Easypaisa"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Title</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={account.accountTitle}
                                                        onChange={(e) => handleAccountChange(index, 'accountTitle', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all"
                                                        placeholder="e.g. Buraq School"
                                                    />
                                                </div>
                                                <div className="pr-10">
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Number</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={account.accountNumber}
                                                        onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all"
                                                        placeholder="e.g. 03115161902"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAccount(index)}
                                                className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                title="Remove Account"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="branch-form" className="rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#3A4A8B] hover:shadow-lg transition-all">
                        {initialData ? 'Update Branch' : 'Create Branch'}
                    </button>
                </div>
            </div>
        </div>
    );
}
