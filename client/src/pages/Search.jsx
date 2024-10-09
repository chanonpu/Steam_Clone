import React, { useState } from 'react';
import axios from 'axios';
import './css/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/search?query=${query}`);
      console.log('Search results:', response.data);
      setResults(response.data);
    } catch (error) {
      console.log('Error searching:', error);
    }
  };

  return (
    <div className="search-page-container">
      <h1>Search Game</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.map((result, index) => (
          <p key={index}>{result.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Search;
