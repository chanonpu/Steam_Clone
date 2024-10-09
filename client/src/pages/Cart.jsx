import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/user/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => setCart(response.data))
    .catch(err => alert('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cart.map(game => (
          <li key={game._id}>{game.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
