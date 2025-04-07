import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, location, setLocation, onSearch }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={onSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar; 