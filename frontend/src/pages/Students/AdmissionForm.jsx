import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function AdmissionForm({ isOpen, onClose, onSubmit, branches, isAdmin, initialData }) {
    const isEditing = !!initialData;

    const [formData, setFormData] = useState(initialData ? {
        ...initialData,
        // Extract family data if nested
        fatherName: initialData.Family?.fatherName || initialData.fatherName || '',
        fatherPhone: initialData.Family?.fatherPhone || initialData.fatherPhone || '',
        fatherOccupation: initialData.Family?.fatherOccupation || initialData.fatherOccupation || '',
        // Make sure date is formatted correctly for date input if it exists
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
    } : {
        // Basic Info
        name: '',
        dateOfBirth: '',
        gender: 'Male',
        formBNicNo: '',
        caste: '',
        religion: '',
        previousSchool: '',

        // Academic Info
        classAdmitted: '',
        currentClass: 'playgroup',
        section: '',
        referenceNo: '',
        referenceInSchool: '',
        specialInfo: '',

        // Contact & Address
        fatherName: '',
        fatherPhone: '',
        fatherOccupation: '',
        guardianName: '',
        guardianRelation: '',
        houseNo: '',
        streetNo: '',
        blockPhase: '',
        mohallahColony: '',
        cell1: '',
        cell2: '',
        whatsapp: '',

        // Fees Configuration
        admissionFee: 0,
        monthlyFee: 0,
        annualCharges: 0,
        academyFee: 0,
        labMiscFee: 0,

        // Certifications
        schoolLeavingCert: false,
        characterCert: false,
        birthCert: false,

        branchId: '',
        status: 'ACTIVE'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const classOptions = [
        { value: 'playgroup', label: 'Playgroup' },
        { value: 'nursery', label: 'Nursery' },
        { value: 'prep', label: 'Prep' },
        ...Array.from({ length: 10 }, (_, i) => ({ value: `${i + 1}`, label: `Class ${i + 1}` })),
        { value: 'firstyear', label: 'First Year' },
        { value: 'secondyear', label: 'Second Year' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditing ? 'Edit Student Profile' : 'Admit New Student'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-6 flex-1 bg-gray-50/20">
                    <form id="admission-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Family Tree Link */}
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-[#4B5EAA] flex items-center gap-2 uppercase tracking-wide">
                                        <span className="w-1.5 h-4 bg-[#4B5EAA] rounded-full"></span>
                                        Family Tree Link
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                                        {isEditing
                                            ? "Family details are managed separately in the Family Tree section."
                                            : "A family tree is constructed automatically based on the Father's phone number within the target branch. It links sibling records together for fee management."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Father Phone <span className="text-red-500">*</span></label>
                                    <input required type="text" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} disabled={isEditing} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm disabled:bg-gray-100 disabled:text-gray-500" placeholder="e.g. 03xx-xxxxxxx" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Father Name <span className="text-red-500">*</span></label>
                                    <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} disabled={isEditing} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm disabled:bg-gray-100 disabled:text-gray-500" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Occupation</label>
                                    <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} disabled={isEditing} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm disabled:bg-gray-100 disabled:text-gray-500" placeholder="Engineer" />
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-700 mb-5 pb-2 border-b flex items-center gap-2 uppercase tracking-wide">
                                <span className="w-1.5 h-4 bg-gray-400 rounded-full"></span>
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {isAdmin && (
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Select Branch <span className="text-red-500">*</span></label>
                                        <select required name="branchId" value={formData.branchId} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all cursor-pointer bg-white shadow-sm">
                                            <option value="">-- Choose Branch --</option>
                                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Student Name <span className="text-red-500">*</span></label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Date of Birth</label>
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all bg-white cursor-pointer shadow-sm">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Form B / NIC No</label>
                                    <input type="text" name="formBNicNo" value={formData.formBNicNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Caste</label>
                                    <input type="text" name="caste" value={formData.caste} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Religion</label>
                                    <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                {isEditing && (
                                    <div className="sm:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Student Status <span className="text-red-500">*</span></label>
                                        <select name="status" value={formData.status} onChange={handleChange} className="w-full md:w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all bg-white cursor-pointer shadow-sm">
                                            <option value="ACTIVE" className="text-green-600 font-bold">Active</option>
                                            <option value="LEFT" className="text-gray-600 font-bold">Left</option>
                                            <option value="SUSPENDED" className="text-red-600 font-bold">Suspended</option>
                                            <option value="PASSED_OUT" className="text-blue-600 font-bold">Passed Out</option>
                                            <option value="STRUCK_OFF" className="text-orange-600 font-bold">Struck Off</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-700 mb-5 pb-2 border-b flex items-center gap-2 uppercase tracking-wide">
                                <span className="w-1.5 h-4 bg-gray-400 rounded-full"></span>
                                Academic Profile
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Current Class <span className="text-red-500">*</span></label>
                                    <select required name="currentClass" value={formData.currentClass} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all bg-white cursor-pointer shadow-sm">
                                        {classOptions.map(opt => <option key={`curr-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Class Admitted In</label>
                                    <select name="classAdmitted" value={formData.classAdmitted} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all bg-white cursor-pointer shadow-sm">
                                        <option value="">(Same as Current)</option>
                                        {classOptions.map(opt => <option key={`adm-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Section</label>
                                    <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" placeholder="A" />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Previous School</label>
                                    <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Reference No.</label>
                                    <input type="text" name="referenceNo" value={formData.referenceNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Any specific medical / special info</label>
                                    <input type="text" name="specialInfo" value={formData.specialInfo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Contact & Address */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-700 mb-5 pb-2 border-b flex items-center gap-2 uppercase tracking-wide">
                                <span className="w-1.5 h-4 bg-gray-400 rounded-full"></span>
                                Contact & Address
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {/* Guardian */}
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Guardian Name (If not Father)</label>
                                    <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Guardian Relation</label>
                                    <input type="text" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">House No</label>
                                    <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Street No</label>
                                    <input type="text" name="streetNo" value={formData.streetNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Block / Phase</label>
                                    <input type="text" name="blockPhase" value={formData.blockPhase} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Mohallah / Colony</label>
                                    <input type="text" name="mohallahColony" value={formData.mohallahColony} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>

                                {/* Phones */}
                                <div className="lg:col-span-1 border-t border-gray-100 pt-3 mt-1 lg:border-t-0 lg:pt-0 lg:mt-0">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Cell 1</label>
                                    <input type="text" name="cell1" value={formData.cell1} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div className="lg:col-span-1 border-t border-gray-100 pt-3 mt-1 lg:border-t-0 lg:pt-0 lg:mt-0">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Cell 2</label>
                                    <input type="text" name="cell2" value={formData.cell2} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA] outline-none transition-all shadow-sm" />
                                </div>
                                <div className="lg:col-span-2 border-t border-gray-100 pt-3 mt-1 lg:border-t-0 lg:pt-0 lg:mt-0">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase text-green-600">WhatsApp Number</label>
                                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm bg-green-50/30" />
                                </div>
                            </div>
                        </div>

                        {/* Fee and Docs Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Fees Setup */}
                            <div className="bg-orange-50/30 p-5 rounded-xl border border-orange-100 shadow-sm">
                                <h3 className="text-sm font-bold text-orange-700 mb-5 pb-2 border-b border-orange-100 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
                                    Fees Configuration
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Admission Fee</label>
                                        <input type="number" name="admissionFee" value={formData.admissionFee} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Monthly Fee</label>
                                        <input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Annual Charges</label>
                                        <input type="number" name="annualCharges" value={formData.annualCharges} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Academy Fee</label>
                                        <input type="number" name="academyFee" value={formData.academyFee} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Lab / Misc Fee</label>
                                        <input type="number" name="labMiscFee" value={formData.labMiscFee} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Certificates */}
                            <div className="bg-purple-50/30 p-5 rounded-xl border border-purple-100 shadow-sm flex flex-col">
                                <h3 className="text-sm font-bold text-purple-700 mb-5 pb-2 border-b border-purple-100 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="w-1.5 h-4 bg-purple-400 rounded-full"></span>
                                    Certificates Provided
                                </h3>
                                <div className="flex-1 flex flex-col justify-center space-y-4 px-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" name="schoolLeavingCert" checked={formData.schoolLeavingCert} onChange={handleChange} className="peer sr-only" />
                                            <div className="h-5 w-5 rounded border-2 border-purple-300 bg-white transition-all peer-checked:border-purple-600 peer-checked:bg-purple-600 group-hover:border-purple-400"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">School Leaving Certificate</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" name="characterCert" checked={formData.characterCert} onChange={handleChange} className="peer sr-only" />
                                            <div className="h-5 w-5 rounded border-2 border-purple-300 bg-white transition-all peer-checked:border-purple-600 peer-checked:bg-purple-600 group-hover:border-purple-400"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Character Certificate</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" name="birthCert" checked={formData.birthCert} onChange={handleChange} className="peer sr-only" />
                                            <div className="h-5 w-5 rounded border-2 border-purple-300 bg-white transition-all peer-checked:border-purple-600 peer-checked:bg-purple-600 group-hover:border-purple-400"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Birth Certificate / B-Form Copy</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                    <button type="button" onClick={onClose} className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="admission-form" className="rounded-lg bg-[#4B5EAA] px-8 py-2 text-sm font-medium text-white shadow-md hover:bg-[#3A4A8B] hover:shadow-lg transition-all">
                        {isEditing ? 'Update Details' : 'Finalize Admission'}
                    </button>
                </div>
            </div>
        </div>
    );
}
