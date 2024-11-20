import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Gamedetails.css';

const GameDetails = () => {
  const { id } = useParams(); // Get the Game ID from the route
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true); // Set loading to true at the beginning
      try {
        const response = await axios.get(`${SERVER_URL}/game/fetch/${id}`);
        setGame(response.data);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        setError('Error fetching Game details.');
        setLoading(false); // Ensure loading is false in case of error
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return <div>Loading Game details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const addToCart = () => {
    // Add game to cart logic here
    alert('Added to cart');
  }

  // Format the release date to YYYY-MM-DD format
  const formattedDate = game?.releasedate
    ? new Date(game.releasedate).toISOString().split('T')[0]
    : 'N/A';

  return (
    <div className="game-details-page">
      {game && (
        <>
          <h1 className="game-details-title">{game.name}</h1>
          <img src={`${SERVER_URL}/img/${game.image}`} alt={game.name} className='game-details-image' />
          <div className="game-details">
            <p><strong>Genre:</strong> {game.genre.join(", ")}</p>
            <p><strong>Release Date:</strong> {formattedDate}</p>
            <p><strong>Description:</strong> {game.description}</p>
            <p><strong>Platform:</strong> {game.platform.join(", ")}</p>
          </div>
          <h2>Price: ${game.price}</h2>
          <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default GameDetails;
