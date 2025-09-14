import React from 'react';
import Footer from '../components/Footer';

// Reusable Checkmark Icon Component
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

// Reusable Pricing Card Component
const PricingCard = ({ plan, price, features, isPopular, buttonText, buttonStyle }) => (
  <div className={`relative bg-white rounded-lg shadow-md p-8 border ${isPopular ? 'border-red-500 border-2' : 'border-gray-200'}`}>
    {isPopular && (
      <div className="absolute top-0 -mt-5 w-full flex justify-center">
        <div className="bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      </div>
    )}
    <h3 className="text-2xl font-bold text-gray-800">{plan}</h3>
    <p className="text-5xl font-extrabold text-gray-900 my-4">
      ${price}<span className="text-xl font-medium text-gray-500">/month</span>
    </p>
    <ul className="space-y-4 text-gray-600">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckIcon />
          <span className="ml-3">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full mt-8 py-3 rounded-md font-semibold ${buttonStyle}`}>
      {buttonText}
    </button>
  </div>
);

// Main Page Component
const PricingPage = () => {
  const plans = {
    basic: {
      plan: 'Basic',
      price: 0,
      features: ['Unlimited short links', 'Basic analytics', 'Customizable links', '24/7 support'],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    },
    pro: {
      plan: 'Pro',
      price: 19,
      features: ['Everything in Basic, plus:', 'Advanced analytics', 'Team collaboration', 'Priority support'],
      isPopular: true,
      buttonText: 'Upgrade',
      buttonStyle: 'bg-red-500 text-white hover:bg-red-600',
    },
    enterprise: {
      plan: 'Enterprise',
      price: 99,
      features: ['Everything in Pro, plus:', 'Dedicated account manager', 'Custom domain', 'White-labeling'],
      buttonText: 'Contact Us',
      buttonStyle: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
            <span className="ml-3 text-2xl font-bold text-gray-800">ShortenIt</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-gray-600 font-medium">
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">Find the perfect plan for you</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Select the plan that best suits your needs. Start with a free trial to explore all features.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard {...plans.basic} />
          <PricingCard {...plans.pro} />
          <PricingCard {...plans.enterprise} />
        </div>
      </main>

      {/* Footer */}
     <Footer />
    </div>
  );
};

export default PricingPage;