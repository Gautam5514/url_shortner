import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


// --- Header Component for this page ---
const LinksHeader = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="container mx-auto flex justify-between items-center p-4">
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
            <span className="ml-3 text-2xl font-bold text-gray-800">ShortenIt</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
          <a href="/dashboard" className="hover:text-gray-900">Dashboard</a>
          <a href="#" className="hover:text-gray-900">Create New</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
            <input 
                type="search" 
                placeholder="Search links..." 
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
      </div>
    </div>
  </header>
);


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
            <LinksHeader />
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
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="grid grid-cols-10 gap-4 font-semibold text-xs text-gray-500 uppercase p-4 border-b bg-gray-50">
                            <div className="col-span-3">Shortened URL</div>
                            <div className="col-span-4">Original URL</div>
                            <div className="col-span-1 text-center">Clicks</div>
                            <div className="col-span-2 text-center">Created At</div>
                        </div>
                        {links.length > 0 ? (
                            <div>
                                {links.map((link) => (
                                <div key={link._id} className="grid grid-cols-10 gap-4 items-center p-4 border-b hover:bg-gray-50">
                                    <div className="col-span-3">
                                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-500 hover:underline">{link.shortUrl.replace(/^https?:\/\//, '')}</a>
                                    </div>
                                    <div className="col-span-4 text-gray-600 truncate">{link.originalUrl}</div>
                                    <div className="col-span-1 text-center text-gray-800 font-medium">{link.clicks}</div>
                                    <div className="col-span-2 text-center text-gray-600">{link.createdAt}</div>
                                </div>
                                ))}
                            </div>
                        ) : (
                            <p className="p-6 text-center text-gray-500">You haven't created any links yet.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyLinksPage;