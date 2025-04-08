// src/pages/JobListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentQuery, setCurrentQuery] = useState('Software Developer in India');

    const fetchJobs = async (query = currentQuery, pageNum = 1, isNewSearch = false) => {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: query,
                page: pageNum.toString(),
                num_pages: '1',
                date_posted: 'all'
            },
            headers: {
                'X-RapidAPI-Key': 'e09cede52dmsh581a47e5d817d93p16ffaejsn51e0434c6a96',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        try {
            if (pageNum === 1) {
                setLoading(true);
            }
            setError('');

            const response = await axios.request(options);

            if (response.data && response.data.data) {
                if (isNewSearch) {
                    setJobs(response.data.data);
                } else {
                    setJobs(prevJobs => [...prevJobs, ...response.data.data]);
                }

                // If we received fewer items than expected, there are no more jobs to load
                setHasMore(response.data.data.length >= 10);
            } else {
                throw new Error('No data received from API');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError(error.response?.data?.message || 'Failed to load jobs');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(currentQuery, 1, true);
    }, []);

    const handleSearch = () => {
        const searchQuery = `${searchTerm} ${location ? 'in ' + location : ''}`.trim();
        setCurrentQuery(searchQuery || 'Software Developer in India');
        setPage(1);
        fetchJobs(searchQuery || 'Software Developer in India', 1, true);
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchJobs(currentQuery, nextPage, false);
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

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

            {loading && page === 1 ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchJobs(currentQuery, 1, true)}
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
                <InfiniteScroll
                    dataLength={jobs.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<LoadingSpinner />}
                    endMessage={null} // Removed the end message
                    scrollThreshold="90%"
                >
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map((job, index) => (
                            <JobCard
                                key={`${job.job_id}-${index}`}
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
                </InfiniteScroll>
            )}
        </div>
    );
};

export default JobListings;