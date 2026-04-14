import React, { forwardRef } from 'react';
import PrintFooter from '@/components/common/PrintFooter';

const PrintAdmissionForm = forwardRef(({ student }, ref) => {
    if (!student) return null;

    const createdAt = new Date(student.createdAt);
    const day = String(createdAt.getDate()).padStart(2, '0');
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const year = createdAt.getFullYear();

    const totalFees = (
        parseFloat(student.admissionFee || 0) +
        parseFloat(student.annualCharges || 0) +
        parseFloat(student.monthlyFee || 0) +
        parseFloat(student.academyFee || 0) +
        parseFloat(student.labMiscFee || 0)
    ).toFixed(2);

    return (
        <div ref={ref} className="print-admission-form print:p-0 p-8 bg-white text-black font-serif text-[12px] leading-relaxed relative">
            <style>
                {`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                    }
                    .print-admission-form {
                        padding: 0 !important;
                        width: 100%;
                    }
                }
                .form-header-box {
                    background-color: black;
                    color: white;
                    border-radius: 9999px;
                    padding: 4px 20px;
                    display: inline-block;
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .section-header {
                    background-color: black;
                    color: white;
                    padding: 2px 8px;
                    font-weight: bold;
                    text-transform: uppercase;
                    display: inline-block;
                    margin-right: 10px;
                }
                .field-line {
                    border-bottom: 1px solid black;
                    display: inline-block;
                    min-width: 50px;
                    padding: 0 5px;
                    vertical-align: bottom;
                }
                .checkbox-box {
                    width: 30px;
                    height: 15px;
                    border: 1px solid black;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 5px;
                    position: relative;
                }
                .checkbox-box.checked::after {
                    content: '✓';
                    position: absolute;
                    top: -4px;
                    left: 2px;
                    font-size: 12px;
                }
                .date-box {
                    border: 1px solid black;
                    width: 30px;
                    height: 20px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: -1px;
                }
                .no-margin-last {
                    margin-right: 0;
                }
                `}
            </style>

            {/* Header */}
            <div className="flex flex-col items-center mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 grayscale" />
                    <h1 className="text-2xl font-black uppercase">BURAQ SECONDARY SCHOOL <span className="text-sm normal-case font-normal">(Regd)</span></h1>
                </div>
                <div className="form-header-box">Admission Form</div>
            </div>

            {/* Date and Nos */}
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center">
                    <span className="font-bold mr-2">Date:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] uppercase">Day</span>
                        <div className="date-box">{day}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] uppercase">Month</span>
                        <div className="date-box">{month}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] uppercase">Year</span>
                        <div className="date-box w-[50px]">{year}</div>
                    </div>
                </div>
                <div>
                    <span className="font-bold">Reference No.</span> <span className="field-line min-w-[150px]">{student.referenceNo}</span>
                </div>
                <div>
                    <span className="font-bold">Admission No.</span> <span className="field-line min-w-[150px]">{student.admissionNo}</span>
                </div>
            </div>

            {/* Student Information Section */}
            <div className="border border-black p-1 mb-2">
                <div className="flex items-center mb-2">
                    <div className="section-header">Student Information</div>
                    <span className="font-bold ml-1">Reference in School.</span>
                    <span className="field-line flex-1 ml-1">{student.referenceInSchool}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-2">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Student Name:</span>
                        <span className="field-line flex-1 capitalize">{student.name}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Date of Birth:</span>
                        <span className="field-line flex-1">{student.dateOfBirth}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-2">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Form B / NIC No.</span>
                        <span className="field-line flex-1">{student.formBNicNo}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Previous School.</span>
                        <span className="field-line flex-1">{student.previousSchool}</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="flex items-end col-span-1">
                        <span className="font-bold mr-1">Casts.</span>
                        <span className="field-line flex-1">{student.caste}</span>
                    </div>
                    <div className="flex items-end col-span-1">
                        <span className="font-bold mr-1">Religion.</span>
                        <span className="field-line flex-1">{student.religion}</span>
                    </div>
                    <div className="flex items-end col-span-1">
                        <span className="font-bold mr-1">Gender.</span>
                        <span className="field-line flex-1">{student.gender}</span>
                    </div>
                    <div className="flex items-end col-span-1">
                        <span className="font-bold mr-1">Admission Class.</span>
                        <span className="field-line flex-1 capitalize">{student.classAdmitted || student.currentClass}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Hifz-E-Quran.</span>
                        <span className="field-line flex-1"></span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Medical Problem.</span>
                        <span className="field-line flex-1">{student.specialInfo}</span>
                    </div>
                    <div className="flex items-end justify-end">
                        <span className="font-bold mr-1">Vaccine:</span>
                        <span className="mr-1">Yes</span> <div className="checkbox-box mr-2"></div>
                        <span className="mr-1">No</span> <div className="checkbox-box"></div>
                    </div>
                </div>

                <div className="flex items-center">
                    <span className="font-bold text-[10px]">Academy is Compulsory for Board Classes (9th, 10th, 11th & 12th) students:</span>
                    <div className="flex items-center ml-auto">
                        <span className="mr-1">Yes</span> <div className="checkbox-box mr-2"></div>
                        <span className="mr-1">No</span> <div className="checkbox-box"></div>
                    </div>
                </div>
            </div>

            {/* Father / Guardian Section */}
            <div className="border border-black p-1 mb-2">
                <div className="section-header mb-2">Father / Guardian</div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Father Name.</span>
                        <span className="field-line flex-1 capitalize">{student.Family?.fatherName}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Occupation.</span>
                        <span className="field-line flex-1">{student.Family?.fatherOccupation}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-1">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Guardian Name (if any)</span>
                        <span className="field-line flex-1">{student.guardianName}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Relation.</span>
                        <span className="field-line flex-1">{student.guardianRelation}</span>
                    </div>
                </div>
            </div>

            {/* Residential Address Section */}
            <div className="border border-black p-1 mb-2">
                <div className="flex items-center mb-2">
                    <div className="section-header">Residential Address</div>
                    <span className="font-bold mr-1">H. No.</span>
                    <span className="field-line min-w-[100px] mr-4">{student.houseNo}</span>
                    <span className="font-bold mr-1">Street No.</span>
                    <span className="field-line min-w-[150px] mr-4">{student.streetNo}</span>
                    <span className="font-bold mr-1">Block /Phase.</span>
                    <span className="field-line flex-1">{student.blockPhase}</span>
                </div>

                <div className="flex items-start mb-1">
                    <div className="flex-1">
                        <span className="font-bold mr-1">Mohallah / Colony:</span>
                        <span className="field-line w-full mb-1">{student.mohallahColony}</span>
                    </div>
                    <div className="ml-4 border-l border-black pl-2 flex flex-col gap-2">
                        <div className="flex gap-4">
                            <span className="font-bold text-[10px]">Cell 1.</span>
                            <span className="field-line min-w-[150px]">{student.cell1}</span>
                            <span className="font-bold text-[10px]">2.</span>
                            <span className="field-line min-w-[150px]">{student.cell2}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-[10px] ml-4">3.</span>
                            <span className="field-line min-w-[150px]">{student.whatsapp}</span>
                            <span className="font-bold text-[10px]">4.</span>
                            <span className="field-line min-w-[150px]"></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Declaration Section */}
            <div className="border border-black p-1 mb-2 flex items-center">
                <div className="section-header">Declaration</div>
                <p className="text-[10px] italic flex-1 ml-2 font-bold">
                    It is hereby declared that above information is true and correct, I shall abide by the school regulations.
                </p>
            </div>
            <div className="flex justify-end mb-4 px-4">
                <div className="flex flex-col items-center">
                    <span className="field-line min-w-[200px] mb-1"></span>
                    <span className="font-bold">Sign. Parents / Guardian</span>
                </div>
            </div>

            {/* Provision Section */}
            <div className="border border-black p-1 mb-2">
                <div className="section-header mb-2">Provision</div>
                <div className="flex justify-around py-1">
                    <div className="flex items-center">
                        <span>(a) School Leaving Certificate</span>
                        <div className={`checkbox-box ${student.schoolLeavingCert ? 'checked' : ''} ml-2`}></div>
                    </div>
                    <div className="flex items-center">
                        <span>(b) Character Certificate</span>
                        <div className={`checkbox-box ${student.characterCert ? 'checked' : ''} ml-2`}></div>
                    </div>
                    <div className={`flex items-center ${student.birthCert ? 'checked' : ''}`}>
                        <span>(c) Form.B / Birth Certif.</span>
                        <div className={`checkbox-box ${student.birthCert ? 'checked' : ''} ml-2`}></div>
                    </div>
                </div>
            </div>

            {/* Fees Detail Section */}
            <div className="border border-black p-1 mb-10">
                <div className="section-header mb-2">Fees Detail</div>
                <div className="grid grid-cols-3 gap-y-3 px-4 py-2">
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Admission Fee Rs:</span>
                        <span className="field-line flex-1">{student.admissionFee}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Annual Charges Rs:</span>
                        <span className="field-line flex-1">{student.annualCharges}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Monthly Fee Rs:</span>
                        <span className="field-line flex-1">{student.monthlyFee}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Academy Fee Rs:</span>
                        <span className="field-line flex-1">{student.academyFee}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Lab/ Misc Rs:</span>
                        <span className="field-line flex-1">{student.labMiscFee}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold mr-1">Total Amount Rs:</span>
                        <span className="field-line flex-1 font-bold">{totalFees}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 mt-12">
                <div className="flex flex-col items-center border-t border-black pt-1 min-w-[150px]">
                    <span className="font-bold">Signature Principal</span>
                </div>
            </div>
            <PrintFooter />
        </div>
    );
});

export default PrintAdmissionForm;
