import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import axios from 'axios';


const MyLinksPage = () => {
    const API_URL = 'http://localhost:5000/api';
    const navigate = useNavigate();

    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            try {
                const { data } = await axios.get(`${API_URL}/urls`, config);
                // Format the date for better readability
                const formattedData = data.map(link => ({
                    ...link,
                    createdAt: new Date(link.createdAt).toLocaleDateString(),
                }));
                setLinks(formattedData);
            } catch (err) {
                setError('Failed to fetch links.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, [navigate]);


    return (
        <div className="bg-gray-50 min-h-screen">
          
            <main className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">My Links</h1>
                        <p className="text-gray-600 mt-1">Manage and track all your shortened links.</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="bg-red-500 text-white font-semibold px-5 py-3 rounded-lg hover:bg-red-600">
                        Create New Link
                    </button>
                </div>

                {loading && <p>Loading your links...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortened URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {links.length > 0 ? (
                                    links.map((link) => (
                                        <tr key={link._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-500 hover:underline">
                                                    {link.shortUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 truncate max-w-xs">{link.originalUrl}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 font-medium">{link.clicks}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">{link.createdAt}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {/* --- THIS IS THE NEW BUTTON --- */}
                                                <Link to={`/links/${link._id}`} className="text-gray-500 hover:text-red-600 transition duration-200" title="View Details">
                                                    <FiEye className="w-5 h-5 inline-block" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">You haven't created any links yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyLinksPage;