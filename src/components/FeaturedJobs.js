// src/components/FeaturedJobs.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FeaturedJobs = () => {
    const navigate = useNavigate();

    const featuredJobs = [
        {
            id: 1,
            title: "Software Engineer",
            company: "Tech Company Inc.",
            location: "Bangalore, India",
            category: "software"
        },
        {
            id: 2,
            title: "Data Analyst",
            company: "Data Solutions Ltd.",
            location: "Mumbai, India",
            category: "data"
        },
        {
            id: 3,
            title: "Marketing Executive",
            company: "Growth Marketing Co.",
            location: "Delhi, India",
            category: "marketing"
        }
    ];

    const handleViewDetails = (category) => {
        // Navigate to jobs page with category filter
        navigate(`/jobs?category=${category}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Featured Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <p className="text-gray-500 mb-4">{job.location}</p>
                        <button
                            onClick={() => handleViewDetails(job.category)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            View Details <span className="ml-1">→</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedJobs;