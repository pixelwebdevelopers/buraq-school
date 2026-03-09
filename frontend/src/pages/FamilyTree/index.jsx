import { useState } from 'react';
import { FaSearch, FaUserGraduate, FaPhoneAlt, FaUsers, FaMapMarkerAlt, FaTimes, FaIdCard, FaBuilding, FaEdit, FaSave } from 'react-icons/fa';
import familyService from '@/services/familyService';

export default function FamilyTree() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [familyToEdit, setFamilyToEdit] = useState(null);
    const [editForm, setEditForm] = useState({ fatherName: '', fatherPhone: '', fatherOccupation: '', balance: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchQuery = query.trim();
        if (!searchQuery) {
            setError('Please enter a phone number or father name to search.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await familyService.searchFamilies(searchQuery);
            if (response.success) {
                setFamilies(response.data);
                if (response.data.length === 0) {
                    setError('No families found matching your search.');
                }
            } else {
                setError(response.message || 'Failed to search families.');
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudents = async (family) => {
        setSelectedFamily(family);
        setIsModalOpen(true);
        setLoadingStudents(true);
        setStudents([]);

        try {
            const response = await familyService.getFamilyStudents(family.id);
            if (response.success) {
                setStudents(response.data);
            } else {
                console.error(response.message || 'Failed to fetch students for this family.');
            }
        } catch (error) {
            console.error('Fetch students error:', error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFamily(null);
        setStudents([]);
    };

    const handleEditFamily = (family) => {
        setFamilyToEdit(family);
        setEditForm({
            fatherName: family.fatherName,
            fatherPhone: family.fatherPhone,
            fatherOccupation: family.fatherOccupation || '',
            balance: family.balance || 0
        });
        setIsEditModalOpen(true);
    };

    const handleSaveFamily = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await familyService.updateFamily(familyToEdit.id, editForm);
            if (response.success) {
                // Update local list
                setFamilies(families.map(f => f.id === familyToEdit.id ? response.data : f));
                // Update selected family if viewing details
                if (selectedFamily?.id === familyToEdit.id) {
                    setSelectedFamily(response.data);
                }
                setIsEditModalOpen(false);
            } else {
                setError(response.message || 'Failed to update family.');
            }
        } catch (error) {
            console.error('Update error:', error);
            setError('An error occurred while updating the family.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <FaUsers className="text-[#4B5EAA]" />
                        Family Tree
                    </h1>
                    <p className="text-gray-500 text-sm">Organized view of families and their enrolled students.</p>
                </div>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Families
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 w-full py-2.5 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B5EAA]/50 focus:border-[#4B5EAA] focus:bg-white outline-none transition-all duration-200"
                                placeholder="Enter Father Name or Phone Number (e.g. 03001234567)"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#4B5EAA] hover:bg-[#3A4A8B] text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-w-[120px]"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <FaSearch /> Search
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="bg-white border rounded-xl shadow-sm border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800">Search Results</h3>
                </div>

                {families.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="text-xs text-gray-500 font-semibold uppercase bg-gray-100/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Father Name</th>
                                    <th className="px-6 py-4">Phone Number</th>
                                    <th className="px-6 py-4">Branch</th>
                                    <th className="px-6 py-4">Occupation</th>
                                    <th className="px-6 py-4">Balance</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {families.map((family) => (
                                    <tr key={family.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {family.fatherName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-gray-600">
                                                <FaPhoneAlt className="text-gray-400" /> {family.fatherPhone}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4B5EAA] border border-indigo-100">
                                                <FaMapMarkerAlt /> {family.Branch?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {family.fatherOccupation || <span className="text-gray-400 italic">Not set</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${family.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                Rs. {family.balance || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewStudents(family)}
                                                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:border-[#4B5EAA] hover:text-[#4B5EAA] text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                                >
                                                    <FaUsers /> Students
                                                </button>
                                                <button
                                                    onClick={() => handleEditFamily(family)}
                                                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:border-amber-500 hover:text-amber-600 text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <FaUsers className="text-3xl text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Families to Display</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Use the search bar above to find a family using the father's name or phone number.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedFamily && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaUsers className="text-[#4B5EAA]" />
                                Family Profile & Attached Students
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto px-6 py-6 flex-1 bg-white space-y-6">

                            {/* Family Details Card */}
                            <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-2xl p-5 border border-indigo-100/50 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#4B5EAA] border border-indigo-100 shadow-sm">
                                        {selectedFamily.fatherName ? selectedFamily.fatherName.charAt(0).toUpperCase() : 'F'}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{selectedFamily.fatherName}</h2>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                            <span className="flex items-center gap-1.5"><FaPhoneAlt className="text-indigo-400" /> {selectedFamily.fatherPhone}</span>
                                            <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-indigo-400" /> {selectedFamily.Branch?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 self-start md:self-auto">
                                    <div className="bg-white/60 py-2 px-4 rounded-xl border border-white/40 shadow-sm text-sm font-semibold text-gray-700">
                                        Occupation: <span className="font-normal text-gray-600">{selectedFamily.fatherOccupation || 'N/A'}</span>
                                    </div>
                                    <div className="bg-white/60 py-2 px-4 rounded-xl border border-white/40 shadow-sm text-sm font-semibold text-gray-700">
                                        Balance: <span className={`font-bold ${selectedFamily.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>Rs. {selectedFamily.balance || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Students Section */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                    <FaUserGraduate className="text-gray-400" />
                                    Enrolled Students ({students.length})
                                </h3>

                                {loadingStudents ? (
                                    <div className="py-12 flex justify-center items-center">
                                        <span className="w-8 h-8 border-4 border-gray-200 border-t-[#4B5EAA] rounded-full animate-spin"></span>
                                    </div>
                                ) : students.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {students.map(student => (
                                            <div key={student.id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#4B5EAA] opacity-80 rounded-l-xl"></div>
                                                <div className="pl-2">
                                                    <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{student.name}</h4>
                                                    <div className="text-xs text-gray-500 font-mono mb-3 bg-gray-50 uppercase inline-block px-2 py-0.5 rounded border">
                                                        #{student.admissionNo}
                                                    </div>

                                                    <div className="space-y-2 mt-1">
                                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded">
                                                            <span className="text-gray-500 text-xs font-semibold flex items-center gap-1.5"><FaBuilding className="text-gray-400" /> Class</span>
                                                            <span className="font-bold text-gray-800 capitalize">{student.currentClass} - {student.section}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded">
                                                            <span className="text-gray-500 text-xs font-semibold flex items-center gap-1.5"><FaIdCard className="text-gray-400" /> Roll/Ref</span>
                                                            <span className="font-medium text-gray-700">{student.referenceNo || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded border-t border-gray-100">
                                                            <span className="text-gray-500 text-xs font-semibold font-mono">Monthly Fee</span>
                                                            <span className="font-medium text-gray-700 text-xs">Rs. {student.monthlyFee || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded">
                                                            <span className="text-gray-500 text-xs font-semibold font-mono">Academy Fee</span>
                                                            <span className="font-medium text-gray-700 text-xs">Rs. {student.academyFee || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded">
                                                            <span className="text-gray-500 text-xs font-semibold font-mono">Lab/Misc</span>
                                                            <span className="font-medium text-gray-700 text-xs">Rs. {student.labMiscFee || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        <p className="text-gray-500">No students are currently linked to this family profile.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Edit Family Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaEdit className="text-amber-500" />
                                Edit Family Profile
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSaveFamily} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Father Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.fatherName}
                                        onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                                        className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.fatherPhone}
                                            onChange={(e) => setEditForm({ ...editForm, fatherPhone: e.target.value })}
                                            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                                        <input
                                            type="text"
                                            value={editForm.fatherOccupation}
                                            onChange={(e) => setEditForm({ ...editForm, fatherOccupation: e.target.value })}
                                            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Balance (Rs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.balance}
                                        onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })}
                                        className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none font-medium"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-70"
                                    >
                                        {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><FaSave /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
