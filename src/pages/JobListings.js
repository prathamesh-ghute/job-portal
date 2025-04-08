// src/pages/JobListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const fetchJobs = async (query = 'Software Developer in India') => {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: query,
                page: '1',
                num_pages: '1',
                date_posted: 'all'
            },
            headers: {
                'X-RapidAPI-Key': 'e09cede52dmsh581a47e5d817d93p16ffaejsn51e0434c6a96',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        try {
            setLoading(true);
            setError('');
            console.log('Fetching jobs with query:', query);

            const response = await axios.request(options);
            console.log('API Response:', response.data);

            if (response.data && response.data.data) {
                setJobs(response.data.data);
                console.log('Jobs loaded:', response.data.data.length);
            } else {
                throw new Error('No data received from API');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                setError(`Error: ${error.response.data.message || 'Failed to load jobs'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                setError('Network error. Please check your internet connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                setError('Failed to load jobs. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = () => {
        const searchQuery = `${searchTerm} ${location ? 'in ' + location : ''}`.trim();
        fetchJobs(searchQuery || 'Software Developer in India');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Listings</h1>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    location={location}
                    setLocation={setLocation}
                    onSearch={handleSearch}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchJobs()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.job_id}
                            job={{
                                _id: job.job_id,
                                title: job.job_title,
                                company: job.employer_name,
                                location: `${job.job_city || ''} ${job.job_country || ''}`.trim(),
                                description: job.job_description,
                                requirements:
                                    job.job_highlights?.Qualifications ||
                                    job.job_highlights?.Requirements ||
                                    [],
                                salary: job.job_salary || 'Salary not specified',
                                type: job.job_employment_type || 'Full-time',
                                createdAt: job.job_posted_at_datetime_utc,
                                url: job.job_apply_link
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobListings;