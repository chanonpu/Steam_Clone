import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Cart.css';

function Cart() {
  const [username, setUsername] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // To track total price
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUsername(decoded.username);
        const response = await axios.get(`${SERVER_URL}/user/user/${decoded.username}`);
        const cartData = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.cart });
        setCart(cartData.data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    // Calculate the total price whenever the cart is updated
    const total = cart.reduce((acc, game) => acc + game.price, 0);
    setTotalPrice(total);
  }, [cart]);

  const removeFromCart = (gameId) => {
    try {
      axios.delete(`${SERVER_URL}/user/cart/${gameId}/${username}`)
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
      axios.post(`${SERVER_URL}/user/checkout`, { username: username });
      alert("Purchase Completed");
      navigate('/');
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
                  src={`${SERVER_URL}/img/${game.image}`}
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
