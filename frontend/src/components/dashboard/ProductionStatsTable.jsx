import { useState } from 'react';
import { FaChartBar, FaChevronLeft, FaChevronRight, FaMousePointer } from 'react-icons/fa';

export default function ProductionStatsTable() {
    // Define the mock data matching the screenshot
    const locations = [
        { name: 'SHIPPED', in: 0, out: 0 },
        { name: 'CANCELED', in: 0, out: 0 },
        { name: 'SETTINGS', in: 0, out: 0 },
        { name: 'POLISH', in: 0, out: 0 },
        { name: 'PICK', in: 0, out: 0 },
        { name: 'JEWELER', in: 0, out: 0 },
        { name: 'With', in: 0, out: 0 },
        { name: 'FILLING', in: 0, out: 0 },
        { name: 'EXTERNAL', in: 0, out: 0 },
    ];

    const [selectedLocation, setSelectedLocation] = useState(null);

    return (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-border">
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <FaChartBar className="text-xl text-text-muted" />
                    <h2 className="text-xl font-bold text-text-primary">Production Stats</h2>
                </div>

                {/* Date Picker (Mock) */}
                <div className="flex items-center gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-surface">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <button className="flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary hover:bg-gray-100">
                        Sat, Mar 7, 2026
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-surface">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col gap-6 lg:flex-row">

                {/* Table Left Side */}
                <div className="flex-1 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8f9fc] text-xs uppercase text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Location</th>
                                <th className="px-4 py-3 text-center font-semibold text-green-600">← In</th>
                                <th className="px-4 py-3 text-center font-semibold text-blue-600">→ Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-xs font-medium text-[#4b5563]">
                            {locations.map((loc) => (
                                <tr
                                    key={loc.name}
                                    onClick={() => setSelectedLocation(loc.name)}
                                    className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${selectedLocation === loc.name ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="px-4 py-3">{loc.name}</td>
                                    <td className="px-4 py-3 text-center text-green-600">{loc.in}</td>
                                    <td className="px-4 py-3 text-center text-blue-600">{loc.out}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Side Empty State / Details */}
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-[#fbfcfd] p-8 text-center lg:min-h-[400px]">
                    {selectedLocation ? (
                        <div className="animate-fade-in text-text-secondary">
                            <p className="text-lg font-semibold">{selectedLocation} Details</p>
                            <p className="text-sm mt-2">No child locations found.</p>
                        </div>
                    ) : (
                        <div className="text-text-muted flex flex-col items-center">
                            <FaMousePointer className="mb-4 text-3xl opacity-50" />
                            <p className="font-semibold text-text-secondary">Select a location</p>
                            <p className="text-xs text-text-muted mt-1">Click on a parent to view its children</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
