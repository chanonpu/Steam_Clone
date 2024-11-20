import React, { useState } from 'react';
import axios from 'axios';
import './css/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${SERVER_URL}/game/search?name=${query}`);
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

      <div className="search-results">
        {results.length > 0 ? (
          results.map((game) => (
            <a key={game._id} className="search-result-item" href={`/games/${game._id}`}>
              <div className="search-image-container">
                <img
                  src={`${SERVER_URL}/img/${game.image}`}
                  alt={game.title}
                  className="search-game-image"
                />
              </div>
              <div className="search-text-container">
                <h2>{game.name}</h2>
                <p>{game.description}</p>
              </div>
            </a>
          ))
        ) : (
          <p className="search-no-results">No games found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
