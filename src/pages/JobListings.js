import React, { useState } from 'react';
import { jobsData } from '../data/jobsData';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

const JobListings = () => {
    const [jobs] = useState(jobsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        // Search functionality is handled in the filter
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                location={location}
                setLocation={setLocation}
                onSearch={handleSearch}
            />

            <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default JobListings; 