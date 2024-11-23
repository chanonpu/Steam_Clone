import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Gamedetails.css';

const GameDetails = () => {
  const { id } = useParams(); // Get the Game ID from the route
  const [username, setUsername] = useState(null);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
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

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUsername(decoded.username);
          const response = await axios.get(`${SERVER_URL}/user/user/${decoded.username}`);
          if (response.data.gamesOwn.includes(id)) {
            setPurchased(true);
          }
          else if (response.data.cart.some(item => item._id.toString() === id.toString())) {
            setInCart(true);
          }
          if (response.data.wishList.includes(id)) {
            console.log("HI");
            setIsInWishlist(true); // Check if game is in wishlist
          }
        }
      } catch (error) {
        console.log('Error fetching user data: ', error);
      }
    }
    fetchGame();
    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading Game details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const addToCart = async () => {
    // Add game to cart logic here
    try {
      const response = await axios.post(`${SERVER_URL}/user/cart/`, { id, username });
      alert("added to cart")
      setInCart(true);
    } catch (error) {
      console.log('Error adding to cart: ', error);
    }
  }

  const removeFromCart = () => {
    try {
      axios.delete(`${SERVER_URL}/user/cart/${id}/${username}`)
        .then(() => {
          alert("removed from cart")
          setInCart(false);
        })
        .catch((error) => {
          console.log('Error removing game from cart: ', error);
        });
    } catch (error) {
      console.log('Error removing game from cart: ', error);
    }
  };

  const toggleWishlist = async () => {
    try {
      const action = isInWishlist ? 'remove' : 'add';
      await axios.post(`${SERVER_URL}/user/wishlist`, { gameId: id, username, action });
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Format the release date to YYYY-MM-DD format
  const formattedDate = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString()  // Formats the date to a readable format
    : 'N/A';

  return (
    <div className="game-details-page" style={{ position: 'relative' }}>
      {/* Wishlist button show if not purchased */}
      {purchased ? <></> :
        <button className="wishlist-button" onClick={toggleWishlist}>
          {isInWishlist ? <span style={{ fontSize: '20px' }}> &#x2764;&#xfe0f;</span> : <span style={{ fontSize: '20px' }}>&#x2764;&#xfe0e;</span>}
        </button>}

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
          {/* Change button depend on if purchased / incart / default */}
          {purchased ? (
            <button className="add-to-cart" onClick={() => alert("Starting Game")}>
              Start Game
            </button>
          ) : inCart ? (
            <button className="add-to-cart" onClick={() => removeFromCart()}>
              Remove from Cart
            </button>

          ) : (
            <button className="add-to-cart" onClick={() => addToCart()}>
              Add to Cart
            </button>
          )}


        </>
      )}
    </div>
  );
};

export default GameDetails;
