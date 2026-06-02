import { useState } from 'react';
import { FaTimes, FaUserTie, FaSave } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const PROFESSIONS = [
    'Principal', 'Vice Principal', 'Coordinator', 'Senior Teacher',
    'Teacher', 'Junior Teacher', 'Lab Assistant', 'Librarian',
    'Accountant', 'Receptionist', 'Clerk', 'Admin', 'Assistant',
    'Driver', 'Guard', 'Peon', 'Sweeper', 'Janitor', 'Cook',
    'Cleaner', 'IT Support', 'Other'
];

// Safely convert any date-ish value to YYYY-MM-DD for <input type="date">.
// Returns '' for null/undefined/'0000-00-00'/malformed strings so we never
// call .toISOString() on an Invalid Date (which throws RangeError).
function toDateInputValue(value) {
    if (!value) return '';
    // Sequelize DATEONLY already returns 'YYYY-MM-DD' — short-circuit that path.
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function StaffForm({ isOpen, onClose, onSubmit, branches, isAdmin, initialData, saving }) {
    const { user } = useAuth();
    const isEditing = !!initialData;

    const [formData, setFormData] = useState(initialData ? {
        name: initialData.name || '',
        profession: initialData.profession || '',
        baseSalary: initialData.baseSalary || '',
        medicalLeaves: initialData.medicalLeaves ?? 0,
        phone: initialData.phone || '',
        cnic: initialData.cnic || '',
        address: initialData.address || '',
        joiningDate: toDateInputValue(initialData.joiningDate),
        status: initialData.status || 'ACTIVE',
        branchId: initialData.branchId || (isAdmin ? '' : user?.branchId || '')
    } : {
        name: '',
        profession: '',
        baseSalary: '',
        medicalLeaves: 0,
        phone: '',
        cnic: '',
        address: '',
        joiningDate: '',
        status: 'ACTIVE',
        branchId: isAdmin ? '' : (user?.branchId || '')
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            baseSalary: Number(formData.baseSalary) || 0,
            medicalLeaves: Number(formData.medicalLeaves) || 0
        };
        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#4B5EAA] to-[#3A4A8B] px-6 py-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
                            <FaUserTie className="text-lg" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">
                                {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h2>
                            <p className="text-xs text-white/70">
                                {isEditing ? 'Update details for this staff member' : 'Register a new staff member to a branch'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Basic Section */}
                    <Section title="Basic Information">
                        <Field label="Full Name *" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Muhammad Ali" />
                        <SelectField label="Profession *" name="profession" value={formData.profession} onChange={handleChange} required options={PROFESSIONS} placeholder="Select profession" />
                        <Field label="Base Salary (Rs) *" name="baseSalary" type="number" min="0" value={formData.baseSalary} onChange={handleChange} required placeholder="0" />
                        <Field label="Medical Leaves" name="medicalLeaves" type="number" min="0" value={formData.medicalLeaves} onChange={handleChange} placeholder="0" />
                    </Section>

                    <Section title="Contact & Identification">
                        <Field label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
                        <Field label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="XXXXX-XXXXXXX-X" />
                        <Field label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="House / Street / Area" wide />
                    </Section>

                    <Section title="Employment Details">
                        <Field label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
                        <SelectField label="Status" name="status" value={formData.status} onChange={handleChange}
                            options={['ACTIVE', 'INACTIVE', 'TERMINATED', 'RESIGNED']} />
                        {isAdmin && (
                            <div className="col-span-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Branch *</label>
                                <select
                                    required
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] transition"
                                >
                                    <option value="">Select branch</option>
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        )}
                    </Section>
                </form>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#4B5EAA] hover:bg-[#3A4A8B] shadow disabled:opacity-60"
                    >
                        <FaSave className="text-sm" />
                        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Staff'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">{children}</div>
        </div>
    );
}

function Field({ label, name, value, onChange, type = 'text', placeholder, required, min, wide }) {
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] transition"
            />
        </div>
    );
}

function SelectField({ label, name, value, onChange, options, placeholder, required }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] transition"
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
