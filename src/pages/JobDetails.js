import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`https://api.example.com/jobs/${id}`); // Replace with your API endpoint
                setJob(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!job) {
        return <div className="text-center py-8">Job not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="mt-2 text-xl text-gray-600">{job.company}</p>
                    <p className="mt-1 text-gray-500">{job.location}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Description</h2>
                            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Requirements</h2>
                            <ul className="list-disc list-inside text-gray-600">
                                {job.requirements.map((requirement, index) => (
                                    <li key={index}>{requirement}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Responsibilities</h2>
                            <ul className="list-disc list-inside text-gray-600">
                                {job.responsibilities.map((responsibility, index) => (
                                    <li key={index}>{responsibility}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Posted Date</p>
                                    <p className="text-gray-900">{job.postedDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Job Type</p>
                                    <p className="text-gray-900">{job.jobType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Experience</p>
                                    <p className="text-gray-900">{job.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Salary</p>
                                    <p className="text-gray-900">{job.salary}</p>
                                </div>
                            </div>
                            <Link
                                to={`/apply/${id}`}
                                className="mt-6 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails; 