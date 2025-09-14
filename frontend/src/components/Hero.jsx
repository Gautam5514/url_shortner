import React from 'react';

const Hero = () => {
  return (
    <div className="bg-white text-center py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">More than just shorter links</h1>
        <p className="text-gray-600 text-lg mb-8">Build your brand’s recognition and get detailed insights on how your links are performing.</p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Paste a long URL here"
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button className="bg-red-500 text-white px-6 py-3 rounded-r-md hover:bg-red-600">Shorten It!</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;