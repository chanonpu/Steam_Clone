import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './css/Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // To track total price
  const [imageCache, setImageCache] = useState({});
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { logOut } = useAuth(); // Use logOut function from AuthContext
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${SERVER_URL}/user/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const cartData = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.cart });
        setCart(cartData.data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      if(error.response.status === 401) {
        logOut(); // Call logOut to handle centralized logout
        navigate('/login'); // go to login page
    }
      console.log('Error fetching user data: ', error);
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
        cart.map(game => fetchImage(game.image))
      );
      // Update imageCache with new images
    };

    if (cart.length > 0) {
      fetchImages();
    }
  }, [cart]);

  useEffect(() => {
    // Calculate the total price whenever the cart is updated
    const total = cart.reduce((acc, game) => acc + game.price, 0);
    setTotalPrice(total);
  }, [cart]);

  const removeFromCart = (gameId) => {
    try {
      const token = localStorage.getItem('token');
      axios.delete(`${SERVER_URL}/user/cart/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
        .then(() => {
          // Remove the deleted item from the local cart state
          setCart((prevCart) => prevCart.filter((item) => item._id !== gameId));
        })
        .catch((error) => {
          console.log('Error removing game from cart: ', error);
        });
    } catch (error) {
      console.log('Error removing game from cart: ', error);
    }
  };

  const handleCheckout = () => {
    try {
      const token = localStorage.getItem('token');
      axios.post(`${SERVER_URL}/user/checkout`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).then(() => {
        alert("Purchase Completed");
        navigate('/');
      })
    } catch (error) {
      console.log('Error checking out: ', error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="cart-empty">No games in your cart.</p>
      ) : (
        <>
          <ul className="cart-game-list">
            {cart.map((game) => (
              <li key={game._id} className="cart-game-row">
                <img
                  src={imageCache[game.image] || ""}
                  alt={game.title}
                  className="cart-game-image"
                />
                <p className="cart-game-name">{game.name}</p>
                <p className="cart-game-price">${game.price.toFixed(2)}</p>
                <button onClick={() => removeFromCart(game._id)} className="remove-btn">🗑️</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
          <button className="check-out" onClick={handleCheckout}>Check Out</button>
        </>
      )}
    </div>
  );
}

export default Cart;
