import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Cart() {
  const {id} = useParams();
  const [cart, setCart] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/fetch/user/${id}`);
            const cartData = await axios.post(`${SERVER_URL}/fetch/games`, { gameIds: response.data.cart });
            setCart(cartData.data);
        } catch (error) {
            console.log('Error fetching user data: ', error);
        }
    };

    fetchUserData();
}, []);

  return (
    <div>
      <h1>Your Cart</h1>
      <ul className="game-list">
                {cart.map((game) => (
                    // <a className='game-link' href={`/games/${game.id}`}>
                    <li key={game.id} className="game-card">
                        <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="game-image" />
                        <p>{game.name}</p>
                    </li>
                    // </a>
                ))}
            </ul>
      {/* <ul>
        {cart.map( game => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul> */}
      <button className='check-out' onClick={() => alert('Go to Check out')}>Check Out</button>
    </div>
  );
}

export default Cart;
