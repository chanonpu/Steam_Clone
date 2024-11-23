import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './css/User.css';

const User = () => {
    const [username, setUsername] = useState(null);
    const [data, setData] = useState([]);
    const [games, setGames] = useState([]);
    const [wishList, setWishList] = useState([]);
    const navigate = useNavigate();
    const { logOut } = useAuth(); // Use logOut function from AuthContext
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    setUsername(decoded.username);
                    const response = await axios.get(`${SERVER_URL}/user/user/${decoded.username}`);
                    setData(response.data);
                    const gameResponse = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.gamesOwn });
                    setGames(gameResponse.data);
                    const wishListResponse = await await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.wishList });
                    setWishList(wishListResponse.data);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.log('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            logOut(); // Call logOut to handle centralized logout
            navigate('/'); // Redirect to home after logging out
        } catch (error) {
            console.log('Error logging out: ', error);
        }
    };

    const handleUpload = () => {
        navigate(`/user/upload`);
    };

    return (
        <div className='user-profile-container'>
            <div className="user-profile-header">
                <h1>Welcome, {data.username}!</h1>
                <button className='user-upload-button' onClick={handleUpload}>Upload Game</button>
                <button className='user-logout-button' onClick={handleLogout}>Log Out</button>
            </div>

            {/* Owned Game Section */}
            <h2>Owned Games</h2>
            <ul className="user-game-list">
                {games.map((game) => (
                    <li key={game._id} className="user-game-card">
                        <a href={`/games/${game._id}`} className='user-game-link'>
                            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="user-game-image" />
                            <div className="user-game-info">
                                <h3>{game.name}</h3>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Wish List Section */}
            <h2 style={{marginTop: 20}}>Wish List</h2>
            <ul className="user-game-list">
                {wishList.map((game) => (
                    <li key={game._id} className="user-game-card">
                        <a href={`/games/${game._id}`} className='user-game-link'>
                            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="user-game-image" />
                            <div className="user-game-info">
                                <h3>{game.name}</h3>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
