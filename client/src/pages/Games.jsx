import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Games.css';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const [platforms, setPlatforms] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ direction: "", value: "" });
  const navigate = useNavigate();
  const genreOptions = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sandbox", "Rogue-like", "Shooter", "Sports", "Horror", "MOBA"];
  const platformOptions = ["PS", "XBOX", "PC", "NSW"];
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchFilteredGames();
  }, [genres, platforms, priceFilter]);

  const fetchFilteredGames = async () => {
    const queryParams = new URLSearchParams();
    if (genres.length > 0) queryParams.append("genre", JSON.stringify(genres));
    if (platforms.length > 0) queryParams.append("platform", JSON.stringify(platforms));
    if (priceFilter.direction && priceFilter.value) {
      queryParams.append("price", priceFilter.value);
      queryParams.append("rng", priceFilter.direction);
    }

    try {
      const response = await fetch(`${SERVER_URL}/game/filter?${queryParams.toString()}`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
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
        games.map(game => fetchImage(game.image))
      );
      // Update imageCache with new images
    };

    if (games.length > 0) {
      fetchImages();
    }
  }, [games]);

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setGenres((prev) =>
      prev.includes(value) ? prev.filter((genre) => genre !== value) : [...prev, value]
    );
  };

  const handlePlatformChange = (event) => {
    const value = event.target.value;
    setPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="games-container">
      <div className="filter-sidebar">
        <h2>Filter Games</h2>

        {/* Price Filter */}
        <div className="filter-group">
          <h3>Price</h3>
          <div className="price-filter">
            <select
              name="direction"
              value={priceFilter.direction}
              onChange={handlePriceChange}
              className="price-select"
            >
              <option value="">Select</option>
              <option value="lte">&lt;=</option>
              <option value="gte">&gt;=</option>
            </select>
            <input
              type="number"
              name="value"
              value={priceFilter.value}
              onChange={handlePriceChange}
              className="price-input"
              placeholder="Price"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="filter-group">
          <h3>Genre</h3>
          <div className="filter-options">
            {genreOptions.map((genre) => (
              <label key={genre} className="checkbox-label">
                <input type="checkbox" className='filter-checkbox' value={genre} onChange={handleGenreChange} />
                <span className="checkbox-text">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Platform Filter */}
        <div className="filter-group">
          <h3>Platform</h3>
          <div className="filter-options">
            {platformOptions.map((platform) => (
              <label key={platform} className="checkbox-label">
                <input type="checkbox" className='filter-checkbox' value={platform} onChange={handlePlatformChange} />
                <span className="checkbox-text">{platform}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="games-list">
        {games.map((game) => (
          <div
            key={game._id}
            className="game-card"
            onClick={() => handleCardClick(game._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={imageCache[game.image] || ""} alt={game.name} className="game-image" style={{ height: "300px" }} />
            <h2 className="game-title">{game.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
