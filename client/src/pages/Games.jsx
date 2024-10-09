import React, { useEffect, useState } from 'react';
import './css/Games.css'; // Import the CSS file

const GamesPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetching game data from the server
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:8000/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="games-container">
      <h1 className="games-title">Games List</h1>
      <div className="games-list">
        {games.map((game) => (
          <a className="game-card" href={`/games/${game.id}`}>
            <img src={`http://localhost:8000/img/${game.image}`} alt={game.title} className="game-image" />
            <h2 className="game-title">{game.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;