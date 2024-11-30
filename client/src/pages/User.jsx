import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './css/User.css';

const User = () => {
    const [data, setData] = useState([]);
    const [games, setGames] = useState([]);
    const [wishList, setWishList] = useState([]);
    const [gameUploaded, setGameUploaded] = useState([]);
    const navigate = useNavigate();
    const { logOut } = useAuth(); // Use logOut function from AuthContext
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`${SERVER_URL}/user/user/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setData(response.data);
                    const gameResponse = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.gamesOwn });
                    setGames(gameResponse.data);
                    const wishListResponse = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.wishList });
                    setWishList(wishListResponse.data);
                    const gameUploadedResponse = await axios.post(`${SERVER_URL}/game/games_id`, { gameIds: response.data.uploadedGame });
                    setGameUploaded(gameUploadedResponse.data);
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

    const handleGameClick = (gameId) => {
        navigate(`/games/${gameId}`);
    };

    const handleEditGameClick = (gameId) => {
        navigate(`/games/edit/${gameId}`);
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
                    <li
                        key={game._id}
                        className="user-game-card"
                        onClick={() => handleGameClick(game._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="user-game-image" />
                        <div className="user-game-info">
                            <h3>{game.name}</h3>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Wish List Section */}
            <h2 style={{ marginTop: 20 }}>Wish List</h2>
            <ul className="user-game-list">
                {wishList.map((game) => (
                    <li
                        key={game._id}
                        className="user-game-card"
                        onClick={() => handleGameClick(game._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="user-game-image" />
                        <div className="user-game-info">
                            <h3>{game.name}</h3>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Game uploaded Section (if uploaded) */}
            {gameUploaded.length > 0 && (
                <div className="user-game-list">
                    <h2 style={{ marginTop: 20 }}>Game Uploaded! (Click on the game to edit)</h2>
                    {gameUploaded.map((game) => (
                        <li
                            key={game._id}
                            className="user-game-card"
                            onClick={() => handleEditGameClick(game._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.title} className="user-game-image" />
                            <div className="user-game-info">
                                <h3>{game.name}</h3>
                            </div>
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
};

export default User;
