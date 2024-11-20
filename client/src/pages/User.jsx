import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/User.css';

const User = () => {
    const username = useParams().username;
    const [data, setData] = useState([]);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/user/user/${username}`);
                setData(response.data);
                const gameResponse = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.gamesOwn });
                setGames(gameResponse.data);
            } catch (error) {
                console.log('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, [username]);

    const handleLogout = async () => {
        try {
            console.log("Logout successful");
            window.location.href = '/';
        } catch (error) {
            console.log('Error logging out: ', error);
        }
    };

    const handleUpload = () => {
        navigate(`/user/${username}/upload`);
    };

    return (
        <div className='user-profile-container'>
            <div className="user-profile-header">
                <h1>Welcome, {data.username}!</h1>
                <button className='user-upload-button' onClick={handleUpload}>Upload Game</button>
                <button className='user-logout-button' onClick={handleLogout}>Log Out</button>
            </div>

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
        </div>
    );
};

export default User;
