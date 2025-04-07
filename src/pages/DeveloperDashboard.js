import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeveloperDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        users: [],
        jobs: [],
        applications: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user || user.role !== 'admin') {
            console.error('Access denied: Invalid token or non-admin user');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                console.log('Fetching data from backend...');
                const [usersRes, jobsRes, applicationsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users', {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => {
                        console.error('Error fetching users:', err.response?.data || err.message);
                        return { data: [] };
                    }),
                    axios.get('http://localhost:5000/api/jobs', {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => {
                        console.error('Error fetching jobs:', err.response?.data || err.message);
                        return { data: [] };
                    }),
                    axios.get('http://localhost:5000/api/applications', {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => {
                        console.error('Error fetching applications:', err.response?.data || err.message);
                        return { data: [] };
                    })
                ]);

                console.log('Data fetched successfully:', {
                    users: usersRes.data.length,
                    jobs: jobsRes.data.length,
                    applications: applicationsRes.data.length
                });

                setData({
                    users: usersRes.data,
                    jobs: jobsRes.data,
                    applications: applicationsRes.data
                });
                setLoading(false);
            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('Failed to fetch data. Please check the console for details.');
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">
                    <p className="text-lg font-semibold">{error}</p>
                    <p className="text-sm mt-2">Please check the browser console for more details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Dashboard</h1>

                {/* Users Section */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Users Database</h3>
                        <p className="mt-1 text-sm text-gray-500">Total Users: {data.users.length}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.users.map((user) => (
                                        <tr key={user._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Jobs Database</h3>
                        <p className="mt-1 text-sm text-gray-500">Total Jobs: {data.jobs.length}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.company}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Applications Database</h3>
                        <p className="mt-1 text-sm text-gray-500">Total Applications: {data.applications.length}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.applications.map((application) => (
                                        <tr key={application._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {application.user?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {application.job?.title || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {application.status || 'Pending'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(application.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboard; 