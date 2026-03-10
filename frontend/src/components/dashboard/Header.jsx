import { useAuth } from '@/context/AuthContext';
import { FaUser, FaBars } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';

export default function Header({ toggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 shadow-sm sm:px-6">
            <div className="flex flex-1 items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-gray-100 lg:hidden"
                >
                    <FaBars className="text-xl" />
                </button>
            </div>

            {/* Centered School Identity */}
            <div className="flex flex-initial items-center justify-center gap-2 sm:gap-4 px-2">
                <img src={logo} alt="School Logo" className="h-6 sm:h-8 w-auto object-contain" />
                <h2 className="text-sm sm:text-lg lg:text-xl font-black text-[#242A45] tracking-tight sm:tracking-normal whitespace-nowrap uppercase font-display">
                    Buraq School & College
                </h2>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
                <div className="relative group">
                    {/* User profile icon matching sidebar styling */}
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#242A45] text-white transition-colors hover:bg-[#2d3453] shadow-inner shadow-black/20">
                        <FaUser className="text-sm" />
                    </button>

                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                        <div className="w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                            <div className="border-b border-border px-4 py-2">
                                <p className="text-sm font-semibold text-text-primary">{user?.name || 'User'}</p>
                                <p className="text-xs text-text-muted uppercase">{user?.role || 'STAFF'}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full px-4 py-2 text-left text-sm text-error transition-colors hover:bg-error/5"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
