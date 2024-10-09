import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Gamedetails.css';

const GameDetails = () => {
  const { id } = useParams(); // Get the Game ID from the route
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchImage, setFetchImage] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true); // Set loading to true at the beginning
      try {
        const response = await axios.get(`http://localhost:8000/fetch/games/${id}`);
        setGame(response.data);

        // Fetch the image after the game data is set
        const imgResponse = await fetch(`http://localhost:8000/fetch/image/${response.data.image}`);
        const blob = await imgResponse.blob();
        const url = URL.createObjectURL(blob);
        setFetchImage(url); // Set the fetched image URL correctly

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

  return (
    <div className="game-details-page">
      {game && (
        <>
          <h1 className="game-details-title">{game.name}</h1>
          <img src={fetchImage} alt={game.name} className='game-details-image' />
          <div className="game-details">
            <p><strong>Genre:</strong> {game.genre}</p>
            <p><strong>Release Date:</strong> {game.releaseDate}</p>
            <p><strong>Description:</strong> {game.description}</p>
          </div>
          <h2>Price: ${game.price}</h2>
          <button className="add-to-cart" onClick={() => alert('Added to cart')}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default GameDetails;
