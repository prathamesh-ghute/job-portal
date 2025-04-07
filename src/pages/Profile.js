import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [userJobs, setUserJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!userData || !token) {
            navigate('/login');
            return;
        }

        setUser(userData);
        setLoading(false);

        // Fetch user's posted jobs
        const fetchUserJobs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/jobs/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUserJobs(data);
                }
            } catch (error) {
                console.error('Error fetching user jobs:', error);
            } finally {
                setJobsLoading(false);
            }
        };

        fetchUserJobs();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'profile'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'jobs'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                My Job Posts
                            </button>
                        </nav>
                    </div>

                    {/* Profile Information Tab */}
                    {activeTab === 'profile' && (
                        <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{user.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{user.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Account type</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{user.role || 'User'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Member since</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {formatDate(user.createdAt)}
                                    </dd>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    View Jobs
                                </button>
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {/* My Job Posts Tab */}
                    {activeTab === 'jobs' && (
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => navigate('/post-job')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Post New Job
                                </button>
                            </div>

                            {jobsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : userJobs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">You haven't posted any jobs yet.</p>
                                    <p className="text-gray-500 mt-1">Click the button above to post your first job!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {userJobs.map(job => (
                                        <div key={job._id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/jobs/${job._id}/edit`)}
                                                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{job.type}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Posted on</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(job.createdAt)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Applications</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{job.applications?.length || 0}</dd>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 