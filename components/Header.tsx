import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#D4E7C5] p-4 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800">
          eCourts Cause List Scraper
        </h1>
        <p className="text-center text-sm text-slate-600 mt-1">
          AI-Powered Simulation of eCourts Data Retrieval
        </p>
      </div>
    </header>
  );
};

export default Header;