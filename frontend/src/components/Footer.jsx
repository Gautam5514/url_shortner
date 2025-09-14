import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="ml-3 text-2xl font-bold text-gray-800">ShortenIt</span>
        </div>
        <div className="text-gray-600">
          <a href="#" className="mr-4 hover:text-gray-800">About</a>
          <a href="#" className="mr-4 hover:text-gray-800">Contact</a>
          <a href="#" className="mr-4 hover:text-gray-800">Terms of Service</a>
          <a href="#" className="hover:text-gray-800">Privacy Policy</a>
        </div>
        <div className="text-gray-600">
          <p>&copy; 2024 ShortenIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;