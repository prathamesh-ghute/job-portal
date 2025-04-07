'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import JobCard from '@/app/components/JobCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MyJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs/user', {
                    headers: {
                        'Authorization': `Bearer ${session?.user?.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, [session, router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Posted Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} showApplicationCount={true} />
                ))}
                {jobs.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center">
                        You haven't posted any jobs yet.
                    </p>
                )}
            </div>
        </div>
    );
} 