import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A separate header component for this page to match the design
const AuthHeader = () => {
  return (
    <header className="bg-white py-4 px-8 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          <span className="ml-3 text-2xl font-bold text-gray-800">ShortenURL</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-gray-600">
          <a href="#" className="hover:text-gray-900">Features</a>
          <a href="#" className="hover:text-gray-900">Pricing</a>
          <a href="#" className="hover:text-gray-900">Resources</a>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <button className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 font-semibold">Sign Up</button>
          <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 font-semibold">Log In</button>
        </div>
      </div>
    </header>
  );
};

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;
      if (isSignUp) {
        // --- Call the new /register endpoint ---
        response = await axios.post('http://localhost:5000/api/users/register', {
          name,
          email,
          password,
          phoneNumber,
        });
      } else {
        // --- Call the new /login endpoint ---
        response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password,
        });
      }
      
      // Store user data and token in local storage to keep them logged in
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      navigate('/dashboard');

    } catch (err) {
      // Set the error message from the backend's response
      setError(err.response?.data?.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
   return (
    <div className="bg-white min-h-screen">
      <AuthHeader />
      <div className="flex flex-col items-center justify-center mt-12 md:mt-20">
        <div className="w-full max-w-md text-center px-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {isSignUp ? 'Create your account' : 'Welcome Back'}
          </h1>
          <p className="mt-3 text-gray-600">
            Or{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="font-semibold text-red-500 hover:underline"
            >
              {isSignUp ? 'sign in to your existing account' : 'create a new account'}
            </button>
          </p>
          
          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {isSignUp && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 font-semibold text-lg disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              type="button"
              className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.438 36.338 48 30.656 48 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
            </button>
            <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35C.598 0 0 .597 0 1.334v21.332C0 23.402.598 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.713c.727 0 1.325-.598 1.325-1.334V1.334C24 .597 23.402 0 22.675 0z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;