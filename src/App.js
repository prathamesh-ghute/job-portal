import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import DeveloperDashboard from './pages/DeveloperDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/jobs" element={<JobListings />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />
                            <Route path="/apply/:id" element={<ApplyJob />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/post-job" element={<PostJob />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/developer" element={<DeveloperDashboard />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App; 