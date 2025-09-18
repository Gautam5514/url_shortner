// src/components/Hero.jsx

import React, { useState } from 'react';
import axios from 'axios';
// We don't need the copy icons here anymore
// import { FiCopy, FiCheck } from 'react-icons/fi';
import ShareModal from './ShareModal'; // Import the new modal component

const Hero = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // State for the form and result
    const [longUrl, setLongUrl] = useState('');
    const [shortUrlResult, setShortUrlResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // New state to control the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!longUrl) return;

        setLoading(true);
        setError('');
        setShortUrlResult(null);
        setIsModalOpen(false); // Make sure modal is closed on new requests

        try {
            // Call the NEW public guest endpoint
            const response = await axios.post(`${API_URL}/guest/shorten`, {
                originalUrl: longUrl
            });
            setShortUrlResult(response.data.shortUrl);
            setLongUrl(''); // Clear the input field
            setIsModalOpen(true); // Open the modal on success!
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="bg-white text-center py-20">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">More than just shorter links</h1>
                <p className="text-gray-600 text-lg mb-8">Build your brand’s recognition and get detailed insights on how your links are performing.</p>
                
                <form onSubmit={handleShorten} className="flex justify-center">
                    <input
                        type="url"
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

                
                {error && <p className="text-red-500 mt-4">{error}</p>}

            
            </div>

            {/* Render the Modal */}
            <ShareModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shortUrl={shortUrlResult}
            />
        </div>
    );
};

export default Hero;