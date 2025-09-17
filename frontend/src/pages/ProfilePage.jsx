// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiPhone, FiMail } from 'react-icons/fi';

const ProfilePage = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // State for the user's data and form fields
    const [userInfo, setUserInfo] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // On component load, get data from localStorage
    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
            setName(storedUserInfo.name || '');
            setPhoneNumber(storedUserInfo.phoneNumber || '');
        } else {
            // If no user info, redirect to auth page
            navigate('/auth');
        }
    }, [navigate]);

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: updatedUser } = await axios.put(`${API_URL}/users/profile`, { name, phoneNumber }, config);
                console.log("Phone Number", phoneNumber);
            // ✅ CRITICAL STEP: Update localStorage with the new, complete user object from the server
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            setMessage({ type: 'success', text: 'Profile updated successfully! Refreshing...' });

            // ✅ Refresh the page after a short delay to show the success message.
            // This forces the Navbar to re-read from localStorage and update.
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
            setLoading(false); // Stop loading only on error
        }
    };

    if (!userInfo) {
        return null; // Return nothing while redirecting
    }

    return (
        <div className="container mx-auto max-w-2xl p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-2">Manage your personal information.</p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdateDetails} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="email" value={userInfo.email} readOnly className="w-full pl-10 p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="pt-4 text-right">
                        <button type="submit" disabled={loading} className="bg-red-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300 transition-colors duration-300">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;