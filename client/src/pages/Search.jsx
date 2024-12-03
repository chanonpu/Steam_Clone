import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const navigate = useNavigate();
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
  
  const fetchImage = async (filename) => {
    if (imageCache[filename]) {
      return imageCache[filename];
    }
  
    try {
      const response = await axios.get(`${SERVER_URL}/game/image`, {
        params: { name: filename },
        responseType: 'blob'
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setImageCache((prev) => ({ ...prev, [filename]: url }));
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const images = await Promise.all(
        results.map(game => fetchImage(game.image))
      );
      // Update imageCache with new images
    };

    if (results.length > 0) {
      fetchImages();
    }
  }, [results]);

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
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
            <div
              key={game._id}
              className="search-result-item"
              onClick={() => handleGameClick(game._id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="search-image-container">
                <img
                  src={imageCache[game.image] || ""}
                  alt={game.title}
                  className="search-game-image"
                />
              </div>
              <div className="search-text-container">
                <h2>{game.name}</h2>
                <p>{game.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="search-no-results">No games found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
