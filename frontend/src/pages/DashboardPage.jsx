import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// --- Reusable Card Component ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>{children}</div>
);

// --- Header Component ---
const DashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
          <span className="ml-3 text-2xl font-bold text-gray-800">ShortenIt</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
          <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900">Dashboard</button>
          <button onClick={() => navigate('/my-links')} className="hover:text-gray-900">My Links</button>
        </nav>
        <div className="flex items-center space-x-4">
          <img className="w-9 h-9 rounded-full" src="https://i.pravatar.cc/150?img=32" alt="User" />
        </div>
      </div>
    </header>
  );
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
  const API_URL = 'http://localhost:5000/api';
  const navigate = useNavigate();

  // State for the creation form
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  
  // State to hold the most recently created link's details and stats
  const [createdLink, setCreatedLink] = useState(null);
  const [stats, setStats] = useState({ totalClicks: 0, uniqueClicks: 0, clicksOverTime: [] });
  
  // UI State
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Handler for the "Shorten URL" form submission
  const handleCreateLink = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setCreatedLink(null); // Clear previous result

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      navigate('/login'); // Redirect to login if user info is missing
      return;
    }

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const body = { originalUrl, customCode: customCode || undefined };

    try {
      // Step 1: Create the new link by calling the backend API
      const { data: newLink } = await axios.post(`${API_URL}/urls`, body, config);
      setCreatedLink(newLink);

      // Step 2: Immediately fetch its (initial) stats
      const { data: newStats } = await axios.get(`${API_URL}/urls/${newLink._id}/stats`, config);
      setStats(newStats);

      // Clear the form fields for the next use
      setOriginalUrl('');
      setCustomCode('');

    } catch (err) {
      // Display a user-friendly error from the backend if available
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  // --- Main Render ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        
        {/* --- Section 1: Create New Link Form --- */}
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shorten a Long URL</h1>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label htmlFor="originalUrl" className="text-sm font-medium text-gray-700">Paste your long URL here</label>
              <input
                id="originalUrl"
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/my-long-url-to-shorten"
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="customCode" className="text-sm font-medium text-gray-700">Custom back-half (Optional)</label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  yourdomain.com/
                </span>
                <input
                  id="customCode"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="my-awesome-link"
                  className="flex-1 block w-full rounded-none rounded-r-md p-3 border-gray-300 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-red-500 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-600 disabled:bg-red-300"
            >
              {isCreating ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>
        </Card>

        {/* --- Section 2: Show Result After Creation --- */}
        {/* This entire section will only appear after a link has been successfully created */}
        {createdLink && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Left Column: Details & Stats */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="text-xl font-bold mb-4 text-green-600">Link Created Successfully!</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your Shortened URL (Click to copy)</label>
                    <input
                      type="text"
                      readOnly
                      value={createdLink.shortUrl}
                      onClick={(e) => navigator.clipboard.writeText(e.target.value)}
                      className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Original URL</label>
                    <input type="text" readOnly value={createdLink.originalUrl} className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold">Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mt-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Clicks</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Unique Clicks</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.uniqueClicks.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800">Clicks Over Time (will update as people click)</h3>
                  <div style={{ width: '100%', height: 200 }} className="mt-4">
                    <ResponsiveContainer>
                      <AreaChart data={stats.clicksOverTime}>
                        <Tooltip />
                        <Area type="monotone" dataKey="clicks" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: QR Code */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-xl font-bold mb-4">QR Code</h2>
                <div className="bg-gray-100 p-6 rounded-lg flex justify-center items-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${createdLink.shortUrl}`} alt="QR Code for shortened link" />
                </div>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${createdLink.shortUrl}&download=1`}
                  download
                  className="block text-center w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-300"
                >
                  Download QR Code
                </a>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;