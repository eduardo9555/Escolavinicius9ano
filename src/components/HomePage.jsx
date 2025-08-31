import React from 'react';

const HomePage = ({ onLogin, latestNews = [], latestEvents = [] }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your gateway to amazing experiences
          </p>
          <button
            onClick={onLogin}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Latest News
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.slice(0, 3).map((news, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {news.title || 'News Title'}
                  </h3>
                  <p className="text-gray-600">
                    {news.content || 'News content goes here...'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Latest Events Section */}
      {latestEvents.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {event.title || 'Event Title'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {event.date || 'Event date'}
                  </p>
                  <p className="text-gray-600">
                    {event.description || 'Event description goes here...'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;