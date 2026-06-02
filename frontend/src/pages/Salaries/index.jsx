import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import salaryService from '@/services/salaryService';
import branchService from '@/services/branchService';
import toast from 'react-hot-toast';
import {
    FaChevronLeft, FaChevronRight, FaCalendarAlt, FaPlus, FaEdit, FaFileInvoiceDollar,
    FaTrash, FaMoneyBillWave, FaUsers, FaCheckCircle, FaExclamationCircle, FaPrint
} from 'react-icons/fa';
import SalarySlipEditor from './SalarySlipEditor';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Salaries() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(isAdmin ? '' : user?.branchId || '');

    const [sheet, setSheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editorStaff, setEditorStaff] = useState(null);

    // Expense add state
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [addingExpense, setAddingExpense] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        branchService.getAllBranches().then(setBranches).catch(() => {});
    }, [isAdmin]);

    const loadSheet = useCallback(async () => {
        if (isAdmin && !selectedBranch) {
            setSheet(null);
            return;
        }
        setLoading(true);
        try {
            const data = await salaryService.getMonthlySheet({
                branchId: isAdmin ? selectedBranch : undefined,
                month,
                year
            });
            setSheet(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load salary sheet');
            setSheet(null);
        } finally {
            setLoading(false);
        }
    }, [isAdmin, selectedBranch, month, year]);

    useEffect(() => { loadSheet(); }, [loadSheet]);

    const stepMonth = (delta) => {
        let m = month + delta;
        let y = year;
        if (m > 12) { m = 1; y += 1; }
        if (m < 1) { m = 12; y -= 1; }
        setMonth(m); setYear(y);
    };

    const handleOpenEditor = (staff) => setEditorStaff(staff);
    const handleCloseEditor = () => setEditorStaff(null);

    const handleSaveSlip = async (payload) => {
        setSaving(true);
        try {
            await salaryService.upsertSlip(payload);
            toast.success('Salary slip saved');
            handleCloseEditor();
            loadSheet();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save slip');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSlip = async (slipId) => {
        if (!window.confirm('Delete this salary slip?')) return;
        try {
            await salaryService.deleteSlip(slipId);
            toast.success('Slip deleted');
            loadSheet();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const handleAddExpense = async () => {
        if (!expenseName.trim() || !expenseAmount) {
            toast.error('Enter expense name and amount');
            return;
        }
        setAddingExpense(true);
        try {
            await salaryService.addExpense({
                branchId: isAdmin ? selectedBranch : undefined,
                month,
                year,
                name: expenseName.trim(),
                amount: Number(expenseAmount) || 0
            });
            setExpenseName(''); setExpenseAmount('');
            toast.success('Expense added');
            loadSheet();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setAddingExpense(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await salaryService.deleteExpense(id);
            toast.success('Expense removed');
            loadSheet();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const totals = useMemo(() => {
        if (!sheet) return { totalPayable: 0, expenses: 0, generated: 0 };
        const slips = Object.values(sheet.slipsByStaffId || {});
        const totalPayable = slips.reduce((s, x) => s + Number(x.payableSalary || 0), 0);
        const expenses = (sheet.expenses || []).reduce((s, x) => s + Number(x.amount || 0), 0);
        return { totalPayable, expenses, generated: slips.length };
    }, [sheet]);

    const fmt = (v) => Number(v || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 });
    const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
    const branchName = sheet?.branch?.name || (isAdmin ? '' : user?.branchName);

    return (
        <div className="space-y-6">
            {/* Page-scoped print rule: enforce A4 portrait for the salary sheet.
                Lives in JSX so it's only present in the DOM while this page is mounted,
                which keeps it out of react-to-print iframes (fee vouchers) entirely. */}
            <style>{`@page { size: A4 portrait; margin: 8mm; }`}</style>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Salaries</h1>
                    <p className="text-sm text-gray-500 mt-1">Generate, edit and print monthly salary slips & track expenses.</p>
                </div>

                {/* Period & Branch picker */}
                <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-xl shadow-sm p-2">
                    <button onClick={() => stepMonth(-1)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" title="Previous month">
                        <FaChevronLeft />
                    </button>
                    <div className="flex items-center gap-1 px-2">
                        <FaCalendarAlt className="text-[#4B5EAA]" />
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="text-sm font-semibold bg-transparent outline-none">
                            {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-sm font-semibold bg-transparent outline-none">
                            {Array.from({ length: 7 }, (_, i) => today.getFullYear() - 3 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => stepMonth(1)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" title="Next month">
                        <FaChevronRight />
                    </button>

                    {isAdmin && (
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="ml-2 rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                        >
                            <option value="">Select branch...</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                <KPI icon={<FaUsers />} label="Total Staff" value={sheet?.staff?.length || 0} color="indigo" />
                <KPI icon={<FaCheckCircle />} label="Slips Generated" value={totals.generated} color="green" />
                <KPI icon={<FaMoneyBillWave />} label="Total Payable" value={`Rs ${fmt(totals.totalPayable)}`} color="amber" />
                <KPI icon={<FaExclamationCircle />} label="Additional Expenses" value={`Rs ${fmt(totals.expenses)}`} color="rose" />
            </div>

            {isAdmin && !selectedBranch && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm print:hidden">
                    Please select a branch to view its salary sheet.
                </div>
            )}

            {/* Sheet */}
            {sheet && (
                <>
                    <div className="print-area">
                    {/* Print-only sheet header */}
                    <div className="hidden print:block text-center mb-2">
                        <h1 className="text-lg font-bold tracking-wide uppercase leading-tight">Staff Salary</h1>
                        <div className="text-[10px] font-semibold leading-tight">{branchName || ''}</div>
                        <div className="text-[10px] font-semibold leading-tight">Month / Year: {monthLabel}</div>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4B5EAA]/5 to-transparent print:hidden">
                            <div>
                                <h3 className="font-bold text-gray-800">Salary Sheet — {monthLabel}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{branchName} • {sheet.monthDays} days in month</p>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#3A4A8B] border border-[#4B5EAA] px-4 py-2 rounded-lg hover:bg-[#4B5EAA]/5"
                            >
                                <FaPrint /> Print Sheet
                            </button>
                        </div>

                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="salary-print-table w-full whitespace-nowrap text-left text-sm print:text-xs print:border print:border-black print:border-collapse">
                                <colgroup>
                                    <col className="c-num" />
                                    <col className="c-name" />
                                    <col className="c-prof" />
                                    <col className="c-base" />
                                    <col className="c-days" />
                                    <col className="c-absent" />
                                    <col className="c-calc" />
                                    <col className="c-allow" />
                                    <col className="c-deduct" />
                                    <col className="c-payable" />
                                    <col className="c-screen-only" />
                                    <col className="c-screen-only" />
                                    <col className="c-sign" />
                                </colgroup>
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs print:bg-gray-100 print:text-black print:border print:border-black">
                                    <tr>
                                        <th className="px-4 py-3 w-10 print:border print:border-black">#</th>
                                        <th className="px-4 py-3 print:border print:border-black">Name</th>
                                        <th className="px-4 py-3 print:border print:border-black">Profession</th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Salary / Mo.</span><span className="print:hidden">Base Salary</span></th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Existing</span><span className="print:hidden">Existing Days</span></th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Absent</span><span className="print:hidden">Absent Days</span></th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Salary</span><span className="print:hidden">Calculated</span></th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Allowance</span><span className="print:hidden">Allowances</span></th>
                                        <th className="px-4 py-3 print:border print:border-black"><span className="hidden print:inline">Deduction</span><span className="print:hidden">Deductions</span></th>
                                        <th className="px-4 py-3 print:border print:border-black">Payable</th>
                                        <th className="px-4 py-3 print:hidden">Status</th>
                                        <th className="px-4 py-3 text-center print:hidden">Action</th>
                                        <th className="px-4 py-3 hidden print:table-cell print:border print:border-black">Signature</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan={13} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                                    ) : sheet.staff.length === 0 ? (
                                        <tr><td colSpan={13} className="px-4 py-10 text-center text-gray-500">No staff members in this branch.</td></tr>
                                    ) : sheet.staff.map((s, idx) => {
                                        const slip = sheet.slipsByStaffId[s.id];
                                        // Historical accuracy: when a slip exists, prefer its snapshot
                                        // values over the staff's current data.
                                        const displayName = slip?.nameSnapshot || s.name;
                                        const displayProfession = slip?.professionSnapshot || s.profession;
                                        const displayBase = slip?.baseSalary ?? s.baseSalary;
                                        const displayMedicalLeaves = slip?.medicalLeavesSnapshot ?? s.medicalLeaves ?? 0;
                                        return (
                                            <tr key={s.id} className="hover:bg-gray-50/70 print:hover:bg-transparent">
                                                <td className="px-4 py-3 text-gray-500 text-xs font-mono print:border print:border-black print:text-black">{idx + 1}</td>
                                                <td className="px-4 py-3 print:border print:border-black">
                                                    <div className="font-medium text-gray-800 print:text-black">{displayName}</div>
                                                    <div className="text-[11px] text-rose-500 mt-0.5 print:hidden">Med. leaves: {displayMedicalLeaves}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 print:border print:border-black print:text-black">{displayProfession}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-800 print:border print:border-black print:text-black">
                                                    <span className="print:hidden">Rs {fmt(displayBase)}</span>
                                                    <span className="hidden print:inline">{fmt(displayBase)}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 print:border print:border-black print:text-black">
                                                    {slip ? `${slip.existingDays}/${slip.monthDays}` : `—/${sheet.monthDays}`}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 print:border print:border-black print:text-black">
                                                    {slip ? (slip.absentDays ?? 0) : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-800 print:border print:border-black print:text-black">
                                                    <span className="print:hidden">{slip ? `Rs ${fmt(slip.calculatedSalary)}` : '—'}</span>
                                                    <span className="hidden print:inline">{slip ? fmt(slip.calculatedSalary) : '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-green-700 print:border print:border-black print:text-black">
                                                    <span className="print:hidden">{slip ? `Rs ${fmt(slip.allowanceTotal)}` : '—'}</span>
                                                    <span className="hidden print:inline">{slip ? fmt(slip.allowanceTotal) : '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-red-700 print:border print:border-black print:text-black">
                                                    <span className="print:hidden">{slip ? `Rs ${fmt(slip.deductionTotal)}` : '—'}</span>
                                                    <span className="hidden print:inline">{slip ? fmt(slip.deductionTotal) : '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-[#3A4A8B] print:border print:border-black print:text-black">
                                                    <span className="print:hidden">{slip ? `Rs ${fmt(slip.payableSalary)}` : '—'}</span>
                                                    <span className="hidden print:inline">{slip ? fmt(slip.payableSalary) : '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 print:hidden">
                                                    {slip ? (
                                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-green-50 text-green-600 ring-1 ring-inset ring-green-600/20">Generated</span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">Pending</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center print:hidden">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditor(s)}
                                                            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded text-xs"
                                                        >
                                                            {slip ? <><FaEdit className="w-3 h-3" /> Edit</> : <><FaPlus className="w-3 h-3" /> Generate</>}
                                                        </button>
                                                        {slip && (
                                                            <button
                                                                onClick={() => handleDeleteSlip(slip.id)}
                                                                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-1 px-3 rounded text-xs"
                                                            >
                                                                <FaTrash className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="hidden print:table-cell print:border print:border-black" style={{ minWidth: '120px' }}></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                {sheet.staff.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-gray-50 font-semibold text-gray-800 print:bg-gray-100 print:text-black">
                                            <td colSpan={9} className="px-4 py-3 text-right print:border print:border-black">Total Payable for {monthLabel}</td>
                                            <td className="px-4 py-3 text-[#3A4A8B] print:text-black print:border print:border-black">Rs {fmt(totals.totalPayable)}</td>
                                            <td colSpan={2} className="print:hidden"></td>
                                            <td className="hidden print:table-cell print:border print:border-black"></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                    </div>
                    {/* /print-area */}

                    {/* Additional Expenses */}
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm print:hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800">Additional Expenses ({monthLabel})</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Recorded against this branch — used in revenue/expense reports. Not printed on slips.</p>
                            </div>
                            <div className="text-sm font-semibold text-rose-600">Total: Rs {fmt(totals.expenses)}</div>
                        </div>

                        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-gray-100 bg-gray-50/60">
                            <input
                                type="text"
                                placeholder="Expense name (e.g. Electricity Bill)"
                                value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                            />
                            <div className="relative md:w-48">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-2 py-2 text-sm outline-none focus:border-[#4B5EAA] focus:ring-1 focus:ring-[#4B5EAA]"
                                />
                            </div>
                            <button
                                onClick={handleAddExpense}
                                disabled={addingExpense}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#4B5EAA] hover:bg-[#3A4A8B] text-white text-sm font-medium px-4 py-2 shadow disabled:opacity-60"
                            >
                                <FaPlus /> Add Expense
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {(sheet.expenses || []).length === 0 ? (
                                <div className="px-6 py-10 text-center text-gray-500 text-sm">No additional expenses recorded for this month.</div>
                            ) : sheet.expenses.map(exp => (
                                <div key={exp.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/60">
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{exp.name}</div>
                                        <div className="text-[11px] text-gray-400 mt-0.5">Added {new Date(exp.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-semibold text-rose-700">Rs {fmt(exp.amount)}</div>
                                        <button
                                            onClick={() => handleDeleteExpense(exp.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                            title="Delete expense"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {editorStaff && sheet && (
                <SalarySlipEditor
                    isOpen={!!editorStaff}
                    onClose={handleCloseEditor}
                    staff={editorStaff}
                    branchName={branchName}
                    month={month}
                    year={year}
                    existingSlip={sheet.slipsByStaffId[editorStaff.id] || null}
                    onSaved={handleSaveSlip}
                    saving={saving}
                />
            )}
        </div>
    );
}

function KPI({ icon, label, value, color }) {
    const map = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600'
    };
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${map[color]}`}>{icon}</div>
            <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
                <div className="text-lg font-bold text-gray-800 leading-tight mt-0.5">{value}</div>
            </div>
        </div>
    );
}
