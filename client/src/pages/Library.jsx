import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Library() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/user/library', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => setGames(response.data))
    .catch(err => alert('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h1>Your Library</h1>
      <ul>
        {games.map(game => (
          <li key={game._id}>{game.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Library;
