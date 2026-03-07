import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function BranchForm({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        principalName: '',
        principalEmail: '',
        principalUsername: '',
        principalPassword: '',
        principalPhone: ''
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
                principalPhone: initialData.principal?.phone || ''
            });
        } else {
            setFormData({
                name: '',
                address: '',
                principalName: '',
                principalEmail: '',
                principalUsername: '',
                principalPassword: '',
                principalPhone: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
