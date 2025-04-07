import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Find Your Dream Job as a Fresher
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl">
                            Discover thousands of job opportunities for fresh graduates. Start your career journey today!
                        </p>
                        <div className="mt-10">
                            <Link
                                to="/jobs"
                                className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Jobs</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Sample Job Cards */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Software Engineer</h3>
                        <p className="mt-2 text-gray-600">Tech Company Inc.</p>
                        <p className="mt-2 text-sm text-gray-500">Bangalore, India</p>
                        <div className="mt-4">
                            <Link
                                to="/jobs/1"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Data Analyst</h3>
                        <p className="mt-2 text-gray-600">Data Solutions Ltd.</p>
                        <p className="mt-2 text-sm text-gray-500">Mumbai, India</p>
                        <div className="mt-4">
                            <Link
                                to="/jobs/2"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Marketing Executive</h3>
                        <p className="mt-2 text-gray-600">Growth Marketing Co.</p>
                        <p className="mt-2 text-sm text-gray-500">Delhi, India</p>
                        <div className="mt-4">
                            <Link
                                to="/jobs/3"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 