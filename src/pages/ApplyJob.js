import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: '',
    });

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await axios.post(`https://api.example.com/jobs/${id}/apply`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/jobs');
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!job) {
        return <div className="text-center py-8">Job not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for {job.title}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                            Resume (PDF)
                        </label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            required
                            accept=".pdf"
                            className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                            Cover Letter
                        </label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            rows="4"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.coverLetter}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyJob; 