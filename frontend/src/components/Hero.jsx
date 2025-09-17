// src/components/Hero.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { FiCopy, FiCheck } from 'react-icons/fi';

const Hero = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // State for the form and result
    const [longUrl, setLongUrl] = useState('');
    const [shortUrlResult, setShortUrlResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!longUrl) return;

        setLoading(true);
        setError('');
        setShortUrlResult(null);
        setIsCopied(false);

        try {
            // Call the NEW public guest endpoint
            const response = await axios.post(`${API_URL}/guest/shorten`, {
                originalUrl: longUrl
            });
            setShortUrlResult(response.data.shortUrl);
            setLongUrl(''); // Clear the input field
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrlResult);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="bg-white text-center py-20">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">More than just shorter links</h1>
                <p className="text-gray-600 text-lg mb-8">Build your brand’s recognition and get detailed insights on how your links are performing.</p>
                
                <form onSubmit={handleShorten} className="flex justify-center">
                    <input
                        type="url" // Use type="url" for better validation
                        placeholder="Paste a long URL here"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-red-500 text-white px-6 py-3 rounded-r-md hover:bg-red-600 font-semibold disabled:bg-red-300"
                    >
                        {loading ? '...' : 'Shorten It!'}
                    </button>
                </form>

                {/* --- Result Display Section --- */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {shortUrlResult && (
                    <div className="mt-8 max-w-xl mx-auto bg-gray-50 p-4 rounded-lg shadow-md flex items-center justify-between">
                        <span className="text-gray-800 font-medium truncate">{shortUrlResult}</span>
                        <button 
                            onClick={handleCopy}
                            className={`ml-4 px-4 py-2 rounded-md font-semibold text-sm flex items-center transition ${
                                isCopied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {isCopied ? <FiCheck className="mr-2"/> : <FiCopy className="mr-2"/>}
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hero;