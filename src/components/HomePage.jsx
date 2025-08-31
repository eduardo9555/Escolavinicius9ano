import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Welcome Home
        </h1>
        <p className="text-gray-600 text-center">
          This is the home page component.
        </p>
      </div>
    </div>
  );
};

export default HomePage;