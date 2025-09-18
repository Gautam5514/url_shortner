// src/components/ShareModal.jsx

import React, { useState } from 'react';
import { FiCopy, FiCheck, FiX } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, shortUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    // Note: Instagram doesn't have a direct web sharing URL. 
    // The best we can do is copy the link and prompt the user.
    const shareText = "Check out this link!";
    const encodedUrl = encodeURIComponent(shortUrl);
    const encodedText = encodeURIComponent(shareText);

    const socialPlatforms = [
        {
            name: 'Copy Link',
            icon: isCopied ? FiCheck : FiCopy,
            action: handleCopy,
            color: isCopied ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600',
            isLink: false
        },
        {
            name: 'Facebook',
            icon: FaFacebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'bg-blue-600 hover:bg-blue-700',
            isLink: true
        },
        {
            name: 'X (Twitter)',
            icon: FaTwitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            color: 'bg-gray-800 hover:bg-gray-900',
            isLink: true
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
            color: 'bg-green-500 hover:bg-green-600',
            isLink: true
        },
    ];

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full relative transform transition-all"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Link is Ready!</h2>

                {/* The shortened link display */}
                <div className="bg-gray-100 p-3 rounded-md mb-6 text-center">
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 font-semibold break-all">
                        {shortUrl}
                    </a>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {socialPlatforms.map((platform) => (
                        platform.isLink ? (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center justify-center p-4 text-white rounded-lg transition ${platform.color}`}
                            >
                                <platform.icon size={24} />
                                <span className="mt-2 text-sm font-semibold">{platform.name}</span>
                            </a>
                        ) : (
                            <button
                                key={platform.name}
                                onClick={platform.action}
                                className={`flex flex-col items-center justify-center p-4 text-white rounded-lg transition ${platform.color}`}
                            >
                                <platform.icon size={24} />
                                <span className="mt-2 text-sm font-semibold">{isCopied ? 'Copied!' : platform.name}</span>
                            </button>
                        )
                    ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                    Note: For Instagram, copy the link and paste it in your bio or story.
                </p>
            </div>
        </div>
    );
};

export default ShareModal;