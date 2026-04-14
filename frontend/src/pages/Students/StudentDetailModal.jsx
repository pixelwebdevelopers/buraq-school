import { useRef } from 'react';
import { FaTimes, FaPrint, FaIdCard, FaBuilding, FaUserGraduate, FaPhoneAlt, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import PrintAdmissionForm from './PrintAdmissionForm';

export default function StudentDetailModal({ isOpen, onClose, student, branchName }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Admission_Form_${student?.admissionNo}`,
        pageStyle: `@media print { @page { size: auto; margin: 5mm; } html, body { background-color: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`
    });

    if (!isOpen || !student) return null;

    // Helper to format booleans
    const renderCertStatus = (hasCert) => (
        hasCert ?
            <span className="text-green-600 font-medium">Provided</span> :
            <span className="text-red-500 font-medium text-sm">Pending</span>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm print:static print:bg-white print:p-0 print:block">
            {/* Main Modal Container */}
            <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col print:shadow-none print:max-h-none print:rounded-none">

                {/* Header (Screen Only) */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 print:hidden">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaIdCard className="text-[#4B5EAA]" />
                        Student Profile
                    </h2>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg bg-[#4B5EAA] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#3A4A8B] transition-colors">
                            <FaPrint /> Print Application
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Printable Content Area */}
                <div ref={componentRef} id="printable-student-detail" className="overflow-y-auto px-6 py-6 flex-1 bg-white print:overflow-visible print:px-2 print:py-0 print:text-[11px]">

                    {/* New Print View (Visible only during print) */}
                    <div className="hidden print:block">
                        <PrintAdmissionForm ref={componentRef} student={student} branchName={branchName} />
                    </div>

                    {/* Original Screen-only Detail View */}
                    <div className="print:hidden">
                        {/* Top Stats Banner */}
                        <div className="flex flex-col md:flex-row gap-3 mb-4 print:mb-3">
                            {/* Profile Avatar & Primary Info */}
                            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100/50 flex items-center gap-4 print:p-2 print:border-gray-300 print:bg-none print:shadow-none">
                                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-[#4B5EAA] border-2 border-indigo-100 print:border-gray-200">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{student.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 font-medium">
                                        <span className="flex items-center gap-1.5"><FaUserGraduate className="text-indigo-400" /> Class: <span className="text-gray-900 capitalize">{student.currentClass}</span></span>
                                        <span className="flex items-center gap-1.5"><FaBuilding className="text-indigo-400" /> Sec: <span className="text-gray-900">{student.section || 'N/A'}</span></span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500 font-mono">Form B/NIC: {student.formBNicNo || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Father/Family Quick View */}
                            <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-center print:shadow-none print:border-gray-300">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Family Primary Contact</h3>
                                <div className="font-bold text-gray-800 text-lg">{student.Family?.fatherName || 'N/A'}</div>
                                <div className="text-sm text-gray-500 mt-0.5">{student.Family?.fatherOccupation || 'No Occupation Listed'}</div>
                                <div className="flex items-center gap-2 mt-3 text-sm font-medium text-[#4B5EAA] bg-blue-50/50 py-1.5 px-3 rounded-lg w-fit print:border print:border-gray-200 print:bg-transparent print:text-gray-800">
                                    <FaPhoneAlt /> {student.Family?.fatherPhone || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:gap-3 print:grid-cols-2">

                            {/* Basic & Academic Details */}
                            <div className="space-y-5 print:space-y-3">
                                <div className="bg-white border text-sm print:text-xs border-gray-100 rounded-xl p-4 shadow-sm print:p-3 print:shadow-none print:border-gray-300">
                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2"><FaUserGraduate className="text-gray-400" /> Personal & Academic</h4>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-3">
                                        <div><span className="block text-[10px] text-gray-500 mb-0.5">Gender</span><span className="font-medium text-gray-900">{student.gender || 'N/A'}</span></div>
                                        <div><span className="block text-[10px] text-gray-500 mb-0.5">Date of Birth</span><span className="font-medium text-gray-900">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
                                        <div><span className="block text-[10px] text-gray-500 mb-0.5">Religion</span><span className="font-medium text-gray-900">{student.religion || 'N/A'}</span></div>
                                        <div><span className="block text-[10px] text-gray-500 mb-0.5">Caste</span><span className="font-medium text-gray-900">{student.caste || 'N/A'}</span></div>
                                        <div className="col-span-2"><span className="block text-[10px] text-gray-500 mb-0.5">Previous School</span><span className="font-medium text-gray-900">{student.previousSchool || 'N/A'}</span></div>
                                        <div className="col-span-2"><span className="block text-[10px] text-gray-500 mb-0.5">Special Medical / Info</span><span className="font-medium text-gray-900 truncate" title={student.specialInfo}>{student.specialInfo || 'None'}</span></div>
                                    </div>
                                </div>

                                <div className="bg-white border text-sm print:text-xs border-gray-100 rounded-xl p-4 shadow-sm print:p-3 print:shadow-none print:border-gray-300">
                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> Address & Contact</h4>
                                    <div className="space-y-2">
                                        <div className="text-gray-900 font-medium leading-relaxed">
                                            House #{student.houseNo || '-'}, St #{student.streetNo || '-'}, {student.blockPhase || ''} {student.mohallahColony || ''}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                                            <div><span className="block text-[10px] text-gray-500 mb-0.5">Cell 1</span><span className="font-medium text-gray-800">{student.cell1 || 'N/A'}</span></div>
                                            <div><span className="block text-[10px] text-gray-500 mb-0.5">Cell 2</span><span className="font-medium text-gray-800">{student.cell2 || 'N/A'}</span></div>
                                            <div className="col-span-2"><span className="block text-[10px] text-green-600 mb-0.5">WhatsApp</span><span className="font-medium text-gray-800">{student.whatsapp || 'N/A'}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guardian, Fees & Certificates */}
                            <div className="space-y-5 print:space-y-3 text-sm print:text-xs">
                                {(student.guardianName || student.guardianRelation) && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 print:p-2 print:bg-transparent print:border-gray-300">
                                        <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Guardian Information</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{student.guardianName}</span>
                                            <span className="bg-white px-2 py-0.5 rounded text-[10px] border font-medium text-gray-600">{student.guardianRelation}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm print:p-3 print:shadow-none print:border-gray-300">
                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Assigned Fees Profile</h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-600">Admission</span> <span className="font-bold">Rs. {student.admissionFee || 0}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-600">Monthly</span> <span className="font-bold">Rs. {student.monthlyFee || 0}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-600">Annual</span> <span className="font-bold">Rs. {student.annualCharges || 0}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-600">Academy</span> <span className="font-bold">Rs. {student.academyFee || 0}</span></div>
                                        <div className="flex justify-between col-span-2 pt-1"><span className="text-gray-600">Lab / Misc Charges</span> <span className="font-bold">Rs. {student.labMiscFee || 0}</span></div>
                                    </div>
                                </div>

                                <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm print:p-3 print:shadow-none print:border-gray-300">
                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2"><FaFileAlt className="text-purple-400" /> Documents Status</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded print:bg-transparent print:p-1 print:border-b"><span className="text-gray-700">School Leaving Certificate</span> {renderCertStatus(student.schoolLeavingCert)}</div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded print:bg-transparent print:p-1 print:border-b"><span className="text-gray-700">Character Certificate</span> {renderCertStatus(student.characterCert)}</div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded print:bg-transparent print:p-1 print:border-b"><span className="text-gray-700">Birth Certificate / Form B</span> {renderCertStatus(student.birthCert)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Print Footer Elements (Hidden on screen) */}
                    {/* <div className="hidden print:block mt-4 pt-2 break-inside-avoid">
                        <div className="flex justify-between items-end border-t border-gray-300 pt-8 px-6">
                            <div className="text-center w-40">
                                <div className="border-b border-gray-800 mb-1.5 h-6"></div>
                                <span className="text-[10px] font-bold text-gray-700 uppercase">Parent / Guardian Signature</span>
                            </div>
                            <div className="text-center w-40">
                                <div className="border-b border-gray-800 mb-1.5 h-6"></div>
                                <span className="text-[10px] font-bold text-gray-700 uppercase">Principal Signature</span>
                            </div>
                        </div>
                        <p className="text-center text-[9px] text-gray-400 mt-4 font-mono">System Generated Document - Buraq School Management Portal</p>
                    </div> */}

                </div>
            </div>
        </div>
    );
}
