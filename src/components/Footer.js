import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">FresherJobs</h3>
                        <p className="text-gray-400">
                            Helping fresh graduates find their dream jobs and start their careers.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="text-gray-400 hover:text-white">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/post-job" className="text-gray-400 hover:text-white">
                                    Post a Job
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-gray-400 hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Email: prathameshghute6@gmail.com</li>
                            <li className="text-gray-400">Phone: +91 9370694846</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <p className="text-center text-gray-400">
                        &copy; {new Date().getFullYear()} FresherJobs. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 