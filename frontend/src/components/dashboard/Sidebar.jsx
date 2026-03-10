import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    FaHome, FaUserGraduate, FaMoneyBillWave, FaCog, FaAngleDoubleLeft, FaAngleDoubleRight,
    FaMapMarkerAlt, FaGlobe, FaChartBar
} from 'react-icons/fa';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { user } = useAuth();
    // Defaulting to STAFF for testing if role is undefined
    const role = user?.role || 'STAFF';

    // Manage collapse state internally for desktop
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filtered base links for Buraq School
    const allLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaHome />, roles: ['ADMIN', 'PRINCIPAL', 'STAFF'] },
        { name: 'Students', path: '/dashboard/students', icon: <FaUserGraduate />, roles: ['ADMIN', 'PRINCIPAL', 'STAFF'] },
        { name: 'Branches', path: '/dashboard/branches', icon: <FaMapMarkerAlt />, roles: ['ADMIN'] },
        { name: 'Family Tree', path: '/dashboard/family-tree', icon: <FaGlobe />, roles: ['ADMIN', 'PRINCIPAL', 'STAFF'] },
        { name: 'Fees', path: '/dashboard/fees', icon: <FaMoneyBillWave />, roles: ['ADMIN', 'PRINCIPAL'] },
        { name: 'Reports', path: '/dashboard/reports', icon: <FaChartBar />, roles: ['ADMIN', 'PRINCIPAL'] },
        { name: 'Users', path: '/dashboard/users', icon: <FaGlobe />, roles: ['ADMIN'] }, // Reusing an icon for simple users view
        { name: 'Settings', path: '/dashboard/settings', icon: <FaCog />, roles: ['ADMIN', 'PRINCIPAL', 'STAFF'] },
    ];

    // Ensure we handle case insensitivity
    const visibleLinks = allLinks.filter(link => link.roles.includes(role.toUpperCase()));

    // Width classes - Responsive by default, but manual toggle overrides
    // lg (1024px) -> w-20 (Mini)
    // xl (1280px) -> w-56 (Full - Adjusted for smaller lpatops)
    const widthClass = isCollapsed ? 'w-20' : 'w-20 xl:w-56';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#242A45] text-[#9EA6C9] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${widthClass}`}>


                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 no-scrollbar">
                    <nav className="space-y-2">
                        {visibleLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                end={link.path === '/dashboard'}
                                title={isCollapsed ? link.name : undefined}
                                className={({ isActive }) =>
                                    `group relative flex items-center rounded-lg py-3 text-sm font-medium transition-all ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-4'
                                    } ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`text-xl transition-colors ${isActive ? 'text-white' : 'text-[#8C98B9] group-hover:text-white'}`}>
                                            {link.icon}
                                        </span>
                                        {!isCollapsed && <span className="hidden xl:block whitespace-nowrap">{link.name}</span>}
                                        {isActive && (
                                            <span className={`absolute bg-red-500 rounded-full ${isCollapsed ? 'top-1 right-2 h-2 w-2' : 'right-3 xl:right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2'
                                                }`} />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Collapse Toggle Button - Hidden on Mobile */}
                <div className="hidden border-t border-white/10 p-4 lg:block">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        className={`flex w-full items-center rounded-lg bg-white/5 py-3 text-sm font-medium text-[#8C98B9] transition-colors hover:bg-white/10 hover:text-white ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4'
                            }`}
                    >
                        {isCollapsed ? (
                            <FaAngleDoubleRight className="text-xl" />
                        ) : (
                            <>
                                <FaAngleDoubleLeft className="text-xl" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
