import React from 'react';
import Link from 'next/link';
import { MapPinIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Job } from '@/types/job';
import { formatDate } from '@/app/utils/dateUtils';

interface JobCardProps {
    job: Job;
    showApplicationCount?: boolean;
}

export default function JobCard({ job, showApplicationCount = false }: JobCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-4">{job.company}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {job.location}
                </span>
                <span className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 mr-1" />
                    {job.type}
                </span>
                {showApplicationCount && job.applications && (
                    <span className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {job.applications.length} Applications
                    </span>
                )}
            </div>
            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Posted {formatDate(job.createdAt)}
                </div>
                <Link
                    href={`/jobs/${job._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
} 