import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FiHelpCircle, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/auth');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userInitials = useMemo(() => {
        if (!userInfo || !userInfo.name) return '';
        const nameParts = userInfo.name.split(' ');
        const firstInitial = nameParts[0]?.[0] || '';
        const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, [userInfo]);

    const activeLinkStyle = { color: '#111827', fontWeight: '600' };

    if (!userInfo) {
        return null; 
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-10">
                        <Link to="/dashboard" className="flex items-center cursor-pointer">
                            <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 14" fill="currentColor"><path d="M24 6.81818H15.1538L11.8462 0L8.53846 6.81818H0L6.80769 11.2273L3.84615 18L11.8462 13.5909L20.1538 18L17.1923 11.2273L24 6.81818Z" /></svg>
                            <span className="ml-2 text-2xl font-bold text-gray-800">Linkly</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <NavLink to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
                            <NavLink to="/my-links" className="text-gray-600 hover:text-gray-900 font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>My Links</NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">

                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
                                <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                                    {userInitials}
                                </div>
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-semibold text-gray-900">{userInfo.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                        <FiUser className="mr-3" /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FiLogOut className="mr-3" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;