// src/pages/ViewURL.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- CORRECTED ICONS ---
// Only one import line for 'fi' icons, and one for 'io5'
import { FiLink, FiEdit2, FiBarChart2 } from 'react-icons/fi';
import { IoQrCode } from 'react-icons/io5';

// --- Reusable Components (no changes) ---
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
);
const StatBox = ({ label, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
    </div>
);


// --- Main Page Component (no other changes needed) ---
const ViewURL = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [linkDetails, setLinkDetails] = useState(null);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'Active' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchLinkData = async () => {
            setLoading(true);
            setError('');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo?.token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            try {
                const [detailsRes, statsRes] = await Promise.all([
                    axios.get(`${API_URL}/urls/${id}`, config),
                    axios.get(`${API_URL}/urls/${id}/stats`, config),
                ]);

                setLinkDetails(detailsRes.data);
                setStats(statsRes.data);
                setFormData({
                    title: detailsRes.data.title,
                    description: detailsRes.data.description,
                    status: detailsRes.data.status,
                });

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch link details.');
            } finally {
                setLoading(false);
            }
        };
        fetchLinkData();
    }, [id, navigate, API_URL]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        setError('');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        try {
            const { data: updatedLink } = await axios.put(`${API_URL}/urls/${id}`, formData, config);
            setLinkDetails(updatedLink);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    const clickRate = useMemo(() => {
        if (!stats || stats.totalClicks === 0) return '0%';
        const rate = (stats.uniqueClicks / stats.totalClicks) * 100;
        return `${rate.toFixed(0)}%`;
    }, [stats]);

    if (loading) return <LoadingSpinner />;
    if (error && !linkDetails) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!linkDetails || !stats) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <p className="text-sm text-gray-500">
                        <Link to="/my-links" className="hover:underline">My Links</Link> / Link Details
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mt-1">Shortened Link Details</h1>
                    <p className="text-gray-600 mt-2">View detailed statistics, generate QR codes, and edit options for your link.</p>
                </div>

                <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><FiLink className="mr-3 text-gray-400" />Link Overview</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Shortened URL</label>
                                    <input type="text" readOnly value={linkDetails.shortUrl} className="mt-1 w-full p-2 bg-gray-100 border rounded-md" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Original URL</label>
                                    <input type="url" readOnly value={linkDetails.originalUrl} className="mt-1 w-full p-2 bg-gray-100 border rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                                    <input id="title" name="title" type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea id="description" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><FiBarChart2 className="mr-3 text-gray-400" />Statistics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatBox label="Total Clicks" value={stats.totalClicks.toLocaleString()} />
                                <StatBox label="Unique Clicks" value={stats.uniqueClicks.toLocaleString()} />
                                <StatBox label="Click Rate" value={clickRate} />
                            </div>
                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-800">Clicks Over Time (Last 30 Days)</h3>
                                <div style={{ width: '100%', height: 250 }} className="mt-4">
                                    <ResponsiveContainer>
                                        <AreaChart data={stats.clicksOverTime}>
                                            <Tooltip />
                                            <Area type="monotone" dataKey="clicks" stroke="#ef4444" fill="#fca5a5" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><IoQrCode className="mr-3 text-gray-400" />QR Code</h2>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${linkDetails.shortUrl}`} alt="QR Code" />
                            </div>
                            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${linkDetails.shortUrl}&download=1`} download className="block text-center w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-300">Download QR Code</a>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><FiEdit2 className="mr-3 text-gray-400" />Edit Options</h2>
                            <div>
                                <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                                <select id="status" name="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isSaving} className="w-full mt-6 bg-red-500 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-600 disabled:bg-red-300">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {saveSuccess && <p className="text-green-600 text-sm text-center mt-2">Changes saved successfully!</p>}
                            {error && !saveSuccess && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                        </Card>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ViewURL;