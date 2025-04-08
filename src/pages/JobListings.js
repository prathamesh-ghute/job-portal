// src/pages/JobListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { jobsData } from '../data/jobsData';
import { useSearchParams } from 'react-router-dom';

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [usingFallbackData, setUsingFallbackData] = useState(false);
    const [searchParams] = useSearchParams();

    const categoryFilter = searchParams.get('category');

    const filterJobsByCategory = (jobsToFilter) => {
        if (!categoryFilter) return jobsToFilter;

        return jobsToFilter.filter(job => {
            const title = job.job_title.toLowerCase();
            const description = job.job_description.toLowerCase();

            switch (categoryFilter) {
                case 'software':
                    return title.includes('software') ||
                        title.includes('engineer') ||
                        title.includes('developer') ||
                        description.includes('software development');
                case 'data':
                    return title.includes('data') ||
                        title.includes('analyst') ||
                        title.includes('scientist') ||
                        description.includes('data analysis');
                case 'marketing':
                    return title.includes('marketing') ||
                        title.includes('sales') ||
                        title.includes('growth') ||
                        description.includes('marketing');
                case 'design':
                    return title.includes('design') ||
                        title.includes('ui') ||
                        title.includes('ux') ||
                        description.includes('design');
                case 'management':
                    return title.includes('manager') ||
                        title.includes('lead') ||
                        title.includes('head') ||
                        description.includes('management');
                default:
                    return true;
            }
        });
    };

    const filterJobsBySearch = (jobsToFilter) => {
        if (!searchTerm && !location) return jobsToFilter;

        return jobsToFilter.filter(job => {
            const matchesSearch = !searchTerm ||
                job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.job_description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = !location ||
                (job.job_city && job.job_city.toLowerCase().includes(location.toLowerCase())) ||
                (job.job_country && job.job_country.toLowerCase().includes(location.toLowerCase()));

            return matchesSearch && matchesLocation;
        });
    };

    const fetchJobs = async (pageNum = 1, isNewSearch = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            }
            setError('');

            const options = {
                method: 'GET',
                url: 'https://jsearch.p.rapidapi.com/search',
                params: {
                    query: searchTerm || 'Software Developer in India',
                    page: pageNum.toString(),
                    num_pages: '1'
                },
                headers: {
                    'X-RapidAPI-Key': 'e09cede52dmsh581a47e5d817d93p16ffaejsn51e0434c6a96',
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);

            if (response.data && response.data.data) {
                let filteredJobs = filterJobsByCategory(response.data.data);
                filteredJobs = filterJobsBySearch(filteredJobs);

                if (isNewSearch) {
                    setJobs(filteredJobs);
                } else {
                    setJobs(prev => [...prev, ...filteredJobs]);
                }

                setHasMore(filteredJobs.length >= 10);
                setUsingFallbackData(false);
            } else {
                throw new Error('No data received from API');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            if (pageNum === 1) {
                let filteredFallbackJobs = filterJobsByCategory(jobsData);
                filteredFallbackJobs = filterJobsBySearch(filteredFallbackJobs);
                setJobs(filteredFallbackJobs);
                setUsingFallbackData(true);
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1, true);
    }, [categoryFilter]); // Refetch when category changes

    const handleSearch = () => {
        setPage(1);
        fetchJobs(1, true);
    };

    const loadMore = () => {
        if (!usingFallbackData) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchJobs(nextPage, false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {categoryFilter
                        ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Jobs`
                        : 'All Jobs'}
                </h1>
                {usingFallbackData && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-sm text-yellow-700">
                            Currently showing sample job listings. Live job data is temporarily unavailable.
                        </p>
                    </div>
                )}
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    location={location}
                    setLocation={setLocation}
                    onSearch={handleSearch}
                />
            </div>

            {loading && page === 1 ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={jobs.length}
                    next={loadMore}
                    hasMore={!usingFallbackData && hasMore}
                    loader={
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    }
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
                                    job_min_salary: job.job_min_salary,
                                    job_max_salary: job.job_max_salary,
                                    job_salary_currency: job.job_salary_currency,
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