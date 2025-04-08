// src/components/PostJob.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        job_title: '',
        employer_name: '',
        job_city: '',
        job_country: 'India',
        job_description: '',
        job_highlights: {
            Qualifications: ['']
        },
        job_employment_type: 'Full-time',
        job_salary_currency: 'INR',
        job_min_salary: '',
        job_max_salary: '',
        job_apply_link: '',
        job_posted_at_datetime_utc: new Date().toISOString()
    });

    const handleQualificationChange = (index, value) => {
        const newQualifications = [...formData.job_highlights.Qualifications];
        newQualifications[index] = value;
        setFormData(prev => ({
            ...prev,
            job_highlights: {
                ...prev.job_highlights,
                Qualifications: newQualifications
            }
        }));
    };

    const addQualification = () => {
        setFormData(prev => ({
            ...prev,
            job_highlights: {
                ...prev.job_highlights,
                Qualifications: [...prev.job_highlights.Qualifications, '']
            }
        }));
    };

    const removeQualification = (index) => {
        const newQualifications = formData.job_highlights.Qualifications.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            job_highlights: {
                ...prev.job_highlights,
                Qualifications: newQualifications
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Filter out empty qualifications
            const cleanedQualifications = formData.job_highlights.Qualifications.filter(q => q.trim() !== '');

            const jobData = {
                ...formData,
                job_highlights: {
                    ...formData.job_highlights,
                    Qualifications: cleanedQualifications
                },
                job_min_salary: Number(formData.job_min_salary),
                job_max_salary: Number(formData.job_max_salary)
            };

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/jobs', jobData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                navigate('/jobs');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Job</h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Job Information */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.job_title}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.employer_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, employer_name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.job_city}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_city: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employment Type
                            </label>
                            <select
                                value={formData.job_employment_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_employment_type: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Currency
                            </label>
                            <select
                                value={formData.job_salary_currency}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_salary_currency: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Salary
                            </label>
                            <input
                                type="number"
                                value={formData.job_min_salary}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_min_salary: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Salary
                            </label>
                            <input
                                type="number"
                                value={formData.job_max_salary}
                                onChange={(e) => setFormData(prev => ({ ...prev, job_max_salary: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>

                    <textarea
                        required
                        value={formData.job_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                        rows="6"
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter detailed job description..."
                    ></textarea>
                </div>

                {/* Requirements/Qualifications */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
                        <button
                            type="button"
                            onClick={addQualification}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            + Add Requirement
                        </button>
                    </div>

                    {formData.job_highlights.Qualifications.map((qual, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={qual}
                                onChange={(e) => handleQualificationChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter requirement..."
                            />
                            {formData.job_highlights.Qualifications.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQualification(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Apply Link */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Link</h2>

                    <input
                        type="url"
                        required
                        value={formData.job_apply_link}
                        onChange={(e) => setFormData(prev => ({ ...prev, job_apply_link: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;