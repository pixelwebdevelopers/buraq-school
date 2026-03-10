import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaBars, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';

export default function Header({ toggleSidebar }) {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white px-2 sm:px-4 md:px-6 shadow-sm">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex flex-1 items-center">
                <button
                    onClick={toggleSidebar}
                    className="rounded-xl p-2.5 text-[#242A45] transition-all hover:bg-gray-100 lg:hidden active:scale-95"
                    aria-label="Toggle Navigation"
                >
                    <FaBars className="text-xl" />
                </button>
            </div>

            {/* Center: School Identity (Responsive) */}
            <div className="flex flex-initial items-center justify-center gap-2 sm:gap-3 px-1">
                <img src={logo} alt="School Logo" className="h-7 sm:h-9 w-auto object-contain shrink-0" />
                <div className="flex flex-col">
                    <h2 className="text-xs sm:text-base lg:text-xl font-black text-[#242A45] tracking-tight whitespace-nowrap uppercase font-display leading-none">
                        Buraq School <span className="text-[#4B5EAA]">&</span> College
                    </h2>
                    <p className="hidden xs:block text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                        Federal Board Affiliated
                    </p>
                </div>
            </div>

            {/* Right: User Profile (Touch-safe) */}
            <div className="flex flex-1 items-center justify-end">
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full transition-all active:scale-95 ${
                            dropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                    >
                        {/* Hidden on very small screens to save space */}
                        <div className="hidden md:flex flex-col items-end mr-1">
                            <span className="text-xs font-bold text-[#242A45] leading-none mb-0.5">{user?.name?.split(' ')[0] || 'User'}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{user?.role || 'Staff'}</span>
                        </div>
                        <div className="relative">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#242A45] text-white shadow-md ring-2 ring-white overflow-hidden">
                                <FaUser className="text-xs" />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500`}></div>
                        </div>
                        <FaChevronDown className={`text-[10px] text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in duration-150 z-[100]">
                            <div className="px-3.5 py-3 border-b border-gray-50 mb-1">
                                <p className="text-sm font-bold text-[#242A45] truncate">{user?.name || 'Hello!'}</p>
                                <p className="text-[10px] font-black text-[#4B5EAA] uppercase tracking-wider mt-0.5">{user?.role || 'STAFF'} PORTAL</p>
                            </div>
                            
                            <button
                                onClick={logout}
                                className="group flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 rounded-xl"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/50 group-hover:bg-red-100 transition-colors">
                                    <FaSignOutAlt className="text-sm" />
                                </div>
                                Logout Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
