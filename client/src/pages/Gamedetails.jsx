import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './css/Gamedetails.css';

const GameDetails = () => {
  const { id } = useParams(); // Get the Game ID from the route
  const [game, setGame] = useState(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [error, setError] = useState(null);
  const { logOut } = useAuth();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/game/fetch/${id}`);
        setGame(response.data);
        
        // Only fetch the image after game data is available
        if (response.data && response.data.image) {
          const imgResponse = await axios.get(`${SERVER_URL}/game/image`, {
            params: { name: response.data.image },
            responseType: 'blob'
          });
          const blob = imgResponse.data;
          const url = URL.createObjectURL(blob);
          setImage(url);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Error fetching Game details.');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${SERVER_URL}/user/user/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          if (response.data.gamesOwn.includes(id)) {
            setPurchased(true);
          }
          else if (response.data.cart.includes(id)) {
            setInCart(true);
          }
          if (response.data.wishList.includes(id)) {
            setIsInWishlist(true); // Check if game is in wishlist
          }
        }
      } catch (error) {
        // expired token
        if (error.response.status === 401) {
          logOut(); // Call logOut to handle centralized logout
        }
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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/user/cart/`, {
        id: id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("added to cart")
      setInCart(true);
    } catch (error) {
      console.log('Error adding to cart: ', error);
    }
  }

  const removeFromCart = () => {
    try {
      const token = localStorage.getItem('token');
      const response = axios.delete(`${SERVER_URL}/user/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      alert("removed from cart")
      setInCart(false);
    } catch (error) {
      console.log('Error removing from cart: ', error);
    }
  }

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to add to wishlist");
        return;
      }
      const action = isInWishlist ? 'remove' : 'add';
      const response = await axios.post(`${SERVER_URL}/user/wishlist/`, {
        gameId: id, action: action
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
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
          <img src={image || ""} alt={game.name} className='game-details-image' />
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
