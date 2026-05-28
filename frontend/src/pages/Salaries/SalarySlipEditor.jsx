import { useState, useMemo, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaSave, FaPrint, FaFileInvoiceDollar } from 'react-icons/fa';

const MAX_ITEMS = 5;

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function computeSalary({ baseSalary, monthDays, existingDays, allowances, deductions }) {
    const base = Number(baseSalary) || 0;
    const md = Math.max(1, parseInt(monthDays) || 30);
    const ed = Math.max(0, Math.min(md, parseInt(existingDays) || 0));
    const absences = md - ed;
    const billable = Math.max(0, absences - 1);
    const perDay = base / md;
    const calculated = Math.max(0, base - perDay * billable);
    const at = (allowances || []).reduce((s, a) => s + (Number(a.amount) || 0), 0);
    const dt = (deductions || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const payable = Math.max(0, calculated + at - dt);
    return { calculated, at, dt, payable, billable, perDay };
}

export default function SalarySlipEditor({ isOpen, onClose, staff, month, year, branchName, existingSlip, onSaved, saving }) {
    const md = useMemo(() => daysInMonth(month, year), [month, year]);

    const [existingDays, setExistingDays] = useState(existingSlip?.existingDays ?? md);
    const [allowances, setAllowances] = useState(
        existingSlip?.allowances?.length ? existingSlip.allowances : [{ name: '', amount: '' }]
    );
    const [deductions, setDeductions] = useState(
        existingSlip?.deductions?.length ? existingSlip.deductions : [{ name: '', amount: '' }]
    );
    const [notes, setNotes] = useState(existingSlip?.notes || '');
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        // Reset when staff/month/year/existingSlip changes
        setExistingDays(existingSlip?.existingDays ?? md);
        setAllowances(existingSlip?.allowances?.length ? existingSlip.allowances : [{ name: '', amount: '' }]);
        setDeductions(existingSlip?.deductions?.length ? existingSlip.deductions : [{ name: '', amount: '' }]);
        setNotes(existingSlip?.notes || '');
    }, [existingSlip, md, staff?.id]);

    const calc = useMemo(() => computeSalary({
        baseSalary: staff?.baseSalary || 0,
        monthDays: md,
        existingDays,
        allowances,
        deductions
    }), [staff, md, existingDays, allowances, deductions]);

    if (!isOpen) return null;

    const updateItem = (list, setList, idx, field, value) => {
        const copy = [...list];
        copy[idx] = { ...copy[idx], [field]: value };
        setList(copy);
    };

    const addItem = (list, setList) => {
        if (list.length >= MAX_ITEMS) return;
        setList([...list, { name: '', amount: '' }]);
    };

    const removeItem = (list, setList, idx) => {
        if (list.length === 1) {
            setList([{ name: '', amount: '' }]);
            return;
        }
        setList(list.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        const payload = {
            staffId: staff.id,
            month,
            year,
            existingDays: Number(existingDays) || 0,
            allowances: allowances.filter(a => a.name || a.amount),
            deductions: deductions.filter(d => d.name || d.amount),
            notes
        };
        onSaved(payload);
    };

    const handlePrint = () => {
        setPrinting(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrinting(false), 400);
        }, 50);
    };

    const monthLabel = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print-modal">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden print-modal">
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#4B5EAA] to-[#3A4A8B] px-6 py-4 print:hidden">
                    <div className="flex items-center gap-3 text-white">
                        <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
                            <FaFileInvoiceDollar className="text-lg" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">Salary Slip — {staff?.name}</h2>
                            <p className="text-xs text-white/70">{staff?.profession} • {monthLabel}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 print-modal-body">
                    {/* --- Editor View (hidden in print) --- */}
                    <div className="space-y-6 print:hidden">
                        {/* Pre-filled info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <ReadField label="Name" value={staff?.name} />
                            <ReadField label="Profession" value={staff?.profession} />
                            <ReadField label="Base Salary" value={`Rs ${Number(staff?.baseSalary || 0).toLocaleString('en-PK')}`} />
                            <ReadField label="Medical Leaves" value={staff?.medicalLeaves || 0} />
                        </div>

                        {/* Days + calc */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Attendance & Calculation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <ReadField label="Month" value={monthLabel} />
                                <ReadField label="Total Days" value={md} />
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Existing Days *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={md}
                                        value={existingDays}
                                        onChange={(e) => setExistingDays(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">1 leave allowed without deduction.</p>
                                </div>
                                <ReadField label="Salary (calculated)" highlight value={`Rs ${calc.calculated.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`} />
                            </div>
                        </div>

                        {/* Allowances & Deductions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ItemList
                                title="Allowances"
                                color="green"
                                items={allowances}
                                onChange={(i, f, v) => updateItem(allowances, setAllowances, i, f, v)}
                                onAdd={() => addItem(allowances, setAllowances)}
                                onRemove={(i) => removeItem(allowances, setAllowances, i)}
                                total={calc.at}
                                max={MAX_ITEMS}
                            />
                            <ItemList
                                title="Deductions"
                                color="red"
                                items={deductions}
                                onChange={(i, f, v) => updateItem(deductions, setDeductions, i, f, v)}
                                onAdd={() => addItem(deductions, setDeductions)}
                                onRemove={(i) => removeItem(deductions, setDeductions, i)}
                                total={calc.dt}
                                max={MAX_ITEMS}
                            />
                        </div>

                        {/* Payable + notes */}
                        <div className="bg-gradient-to-r from-[#4B5EAA]/10 to-[#3A4A8B]/10 border border-[#4B5EAA]/20 rounded-xl p-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-[#3A4A8B]">Final Payable Salary</div>
                                <div className="text-3xl font-extrabold text-[#3A4A8B] mt-1">
                                    Rs {calc.payable.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                    Calculated {calc.calculated.toFixed(0)} + Allowances {calc.at.toFixed(0)} − Deductions {calc.dt.toFixed(0)}
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Internal Notes (not printed)</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Optional notes..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Printable Slip --- */}
                    <PrintableSlip
                        staff={staff}
                        branchName={branchName}
                        monthLabel={monthLabel}
                        md={md}
                        existingDays={existingDays}
                        allowances={allowances}
                        deductions={deductions}
                        calc={calc}
                        printingPreview={false}
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 print:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#3A4A8B] bg-white border border-[#4B5EAA] hover:bg-[#4B5EAA]/5"
                    >
                        <FaPrint /> Print
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#4B5EAA] hover:bg-[#3A4A8B] shadow disabled:opacity-60"
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Slip'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReadField({ label, value, highlight }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
            <div className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${highlight ? 'bg-[#4B5EAA]/10 border-[#4B5EAA]/30 text-[#3A4A8B]' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                {value ?? '—'}
            </div>
        </div>
    );
}

function ItemList({ title, color, items, onChange, onAdd, onRemove, total, max }) {
    const palette = color === 'green'
        ? { ring: 'ring-green-500/20', dot: 'bg-green-500', text: 'text-green-700', total: 'bg-green-50 text-green-700 border-green-200' }
        : { ring: 'ring-red-500/20', dot: 'bg-red-500', text: 'text-red-700', total: 'bg-red-50 text-red-700 border-red-200' };

    return (
        <div className="border border-gray-100 rounded-xl bg-white p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                    <span className="text-[10px] text-gray-400 ml-1">(max {max})</span>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    disabled={items.length >= max}
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${palette.text} disabled:opacity-30 hover:underline`}
                >
                    <FaPlus className="text-[10px]" /> Add
                </button>
            </div>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Name (e.g. House Rent)"
                            value={item.name}
                            onChange={(e) => onChange(idx, 'name', e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        />
                        <div className="relative w-32">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={item.amount}
                                onChange={(e) => onChange(idx, 'amount', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white pl-7 pr-2 py-2 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Remove"
                        >
                            <FaTrash className="text-xs" />
                        </button>
                    </div>
                ))}
            </div>
            <div className={`mt-3 flex items-center justify-between rounded-lg border ${palette.total} px-3 py-2 text-sm font-semibold`}>
                <span>Total</span>
                <span>Rs {total.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</span>
            </div>
        </div>
    );
}

// Printable single-staff slip used by window.print()
function PrintableSlip({ staff, branchName, monthLabel, md, existingDays, allowances, deductions, calc }) {
    return (
        <div className="hidden print:block bg-white text-black p-8">
            <style>{`
                @page { size: A4 portrait; margin: 12mm; }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-hide { display: none !important; }
                }
            `}</style>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-wide">STAFF SALARY SLIP</h1>
                <div className="text-sm text-gray-600 mt-1">{branchName || 'Buraq School System'}</div>
                <div className="text-sm font-semibold mt-1">Month / Year: {monthLabel}</div>
            </div>

            <table className="w-full border-collapse text-sm">
                <tbody>
                    <tr>
                        <td className="border border-black px-3 py-2 w-1/4 font-semibold bg-gray-100">Name</td>
                        <td className="border border-black px-3 py-2">{staff?.name}</td>
                        <td className="border border-black px-3 py-2 w-1/4 font-semibold bg-gray-100">Profession</td>
                        <td className="border border-black px-3 py-2">{staff?.profession}</td>
                    </tr>
                    <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Base Salary</td>
                        <td className="border border-black px-3 py-2">Rs {Number(staff?.baseSalary || 0).toLocaleString('en-PK')}</td>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Medical Leaves</td>
                        <td className="border border-black px-3 py-2">{staff?.medicalLeaves || 0}</td>
                    </tr>
                    <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Month Days</td>
                        <td className="border border-black px-3 py-2">{md}</td>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Existing Days</td>
                        <td className="border border-black px-3 py-2">{existingDays}</td>
                    </tr>
                    <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Calculated Salary</td>
                        <td className="border border-black px-3 py-2" colSpan={3}>
                            Rs {calc.calculated.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <h3 className="font-bold mb-1">Allowances</h3>
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            {allowances.filter(a => a.name || a.amount).map((a, i) => (
                                <tr key={i}>
                                    <td className="border border-black px-2 py-1">{a.name || '—'}</td>
                                    <td className="border border-black px-2 py-1 text-right w-1/3">Rs {Number(a.amount || 0).toLocaleString('en-PK')}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Total</td>
                                <td className="border border-black px-2 py-1 text-right font-semibold bg-gray-100">Rs {calc.at.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3 className="font-bold mb-1">Deductions</h3>
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            {deductions.filter(d => d.name || d.amount).map((d, i) => (
                                <tr key={i}>
                                    <td className="border border-black px-2 py-1">{d.name || '—'}</td>
                                    <td className="border border-black px-2 py-1 text-right w-1/3">Rs {Number(d.amount || 0).toLocaleString('en-PK')}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border border-black px-2 py-1 font-semibold bg-gray-100">Total</td>
                                <td className="border border-black px-2 py-1 text-right font-semibold bg-gray-100">Rs {calc.dt.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 border border-black p-3 flex justify-between items-center bg-gray-100">
                <span className="font-bold text-lg">PAYABLE SALARY</span>
                <span className="font-bold text-lg">Rs {calc.payable.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-16 text-sm">
                <div className="text-center">
                    <div className="border-t border-black pt-1">Employee Signature</div>
                </div>
                <div className="text-center">
                    <div className="border-t border-black pt-1">Authorized Signature</div>
                </div>
            </div>
        </div>
    );
}
