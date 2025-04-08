// src/components/JobCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-gray-600">{job.company}</p>
                    <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {job.requirements && job.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {req}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{job.salary}</p>
                    <div className="mt-2 space-x-2">
                        <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                        >
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-600 line-clamp-3">{job.description}</p>
            </div>
        </div>
    );
};

export default JobCard;