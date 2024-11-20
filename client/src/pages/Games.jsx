import React, { useEffect, useState } from 'react';
import './css/Games.css';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ direction: "", value: "" });
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

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setGenres((prev) =>
      prev.includes(value) ? prev.filter((genre) => genre !== value) : [...prev,value]
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
          <a key={game._id} className="game-card" href={`/games/${game._id}`}>
            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.name} className="game-image" style={{ height: "300px" }} />
            <h2 className="game-title">{game.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
