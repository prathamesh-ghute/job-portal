import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/common.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting to register with:', {
                name: formData.name,
                email: formData.email,
                password: '********'
            });

            const response = await axios.post('/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log('Registration response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/jobs');
            } else {
                setError('Registration successful but no token received');
            }
        } catch (err) {
            console.error('Registration error:', err);

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server response:', err.response.data);
                if (err.response.data.message) {
                    setError(err.response.data.message);
                } else if (err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Registration failed: ' + (err.response.status === 400 ? 'Invalid data' : 'Server error'));
                }
            } else if (err.request) {
                // The request was made but no response was received
                console.error('No response received');
                setError('No response from server. Please check if the server is running at http://localhost:5000');
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', err.message);
                setError('Failed to send registration request: ' + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Welcome to FresherJobs
                    </h1>
                    <h2 className="text-2xl font-bold text-indigo-600 mb-8">
                        Create your account
                    </h2>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 transform transition-all duration-300 hover:shadow-2xl">
                    <form className="space-y-6 fade-in" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="John Doe"
                                    minLength={2}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Must be at least 6 characters long
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-message text-center bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn w-full flex justify-center py-3 ${isLoading ? 'opacity-50 cursor-not-allowed bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } text-white font-semibold rounded-md transition-all duration-200 transform hover:scale-[1.02]`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating your account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="btn w-full flex justify-center py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-md transition-all duration-200"
                            >
                                Sign in to your account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 