import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-indigo-600">
                                FresherJobs
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Home
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        to="/jobs"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Jobs
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-2">Welcome,</span>
                                    <span className="font-semibold text-indigo-600">{user.name}</span>
                                </div>
                                <Link
                                    to="/post-job"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                                >
                                    Post Job
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Home
                    </Link>
                    {user && (
                        <>
                            <Link
                                to="/jobs"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/post-job"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Post Job
                            </Link>
                        </>
                    )}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    {user ? (
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <span className="text-gray-700">Welcome,</span>
                                <span className="ml-2 font-semibold text-indigo-600">{user.name}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 space-y-1">
                            <Link
                                to="/login"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                    {user && (
                        <div className="mt-3">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 