import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/User.css';

const User = () => {
    const id = useParams().id;
    const [data, setData] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fetch/user/${id}`);
                setData(response.data) //may be change
                const gameResponse = await axios.post('http://localhost:8000/fetch/games', { gameIds: response.data.ownedGames });
                setGames(gameResponse.data);
            } catch (error) {
                console.log('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, []);

    // handle log out
    const handleLogout = async() => {
        try {
            // // await axios.post(`http://localhost:8000/logout`);
            console.log("Logout successful")
            window.location.href = '/';
        } catch (error) {
            console.log('Error logging out: ',error)
        }
    };

    return (
        <div className='user-profile-container'>
            <h1>User Profile</h1>
            <p>{data.email}</p>



            <h2>Owned Games List</h2>
            <ul className="game-list">
                {games.map((game) => (
                    <a className='game-link' href={`/games/${game.id}`}>
                    <li className="game-card">
                        <img src={`http://localhost:8000/img/${game.image}`} alt={game.title} className="game-image" />
                        <p>{game.name}</p>
                    </li>
                    </a>
                ))}
            </ul>

            <button className='logout-button' onClick={handleLogout}>Log out</button>
        </div>
    )
}

export default User;