import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Home.css";

const Home = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [topRanked, setTopRanked] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const newReleaseRes = await axios.get(`${SERVER_URL}/game/new-releases`);
        const topRankedRes = await axios.get(`${SERVER_URL}/game/top-ranked`);
        setNewReleases(newReleaseRes.data);
        setTopRanked(topRankedRes.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

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
      const newImages = await Promise.all(
        newReleases.map(game => fetchImage(game.image))
      );
      const topImages = await Promise.all(
        topRanked.map(game => fetchImage(game.image))
      );
      // Update imageCache with new images
    };

    if (newReleases.length > 0 && topRanked.length > 0) {
      fetchImages();
    }
  }, [newReleases, topRanked]);

  const handleCardClick = (gameId) => {
    navigate(`/games/${gameId}`); // Navigate to the game details page
  };

  return (
    <div className="homepage-container">
      <header className="welcome-message">
        <h1>Welcome to GameHub!</h1>
        <p>Discover the latest releases and top-ranked games chosen just for you.</p>
      </header>

      <section className="top-ranked-section">
        <h2>Top Ranked Games</h2>
        <div className="top-ranked-cards">
          {topRanked.slice(0, 3).map((game, index) => (
            <div
              key={game.id}
              className={`top-game-card rank-${index + 1}`}
              onClick={() => handleCardClick(game._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageCache[game.image] || ""}
                alt={game.name}
                style={{ height: "50%" }}
              />
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <span className="price">${game.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="new-releases-section">
        <h2>New Releases</h2>
        <div className="new-releases-grid">
          {newReleases.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => handleCardClick(game._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageCache[game.image] || ""}
                alt={game.name}
                style={{ maxWidth: "100%", height: "70%" }}
              />
              <h3>{game.name}</h3>
              <span className="price">${game.price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
