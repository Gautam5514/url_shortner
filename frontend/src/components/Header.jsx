import React from 'react';

const Header = () => {
  return (
    <header className="bg-white py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="ml-3 text-2xl font-bold text-gray-800">ShortenIt</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-800">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Resources</a>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <a href="/auth" className="text-gray-600 hover:text-gray-800">Login</a>
          <a href="/auth" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Sign Up</a>
        </div>
      </div>
    </header>
  );
};

export default Header;