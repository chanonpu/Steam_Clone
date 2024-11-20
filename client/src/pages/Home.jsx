import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Home.css';

const Home = () => {
    const [newReleases, setNewReleases] = useState([]);
    const [topRanked, setTopRanked] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const newReleaseRes = await axios.get(`${SERVER_URL}/game/new-releases`);
                const topRankedRes = await axios.get(`${SERVER_URL}/game/top-ranked`);
                setNewReleases(newReleaseRes.data);
                setTopRanked(topRankedRes.data);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
        fetchGames();
    }, []);

    return (
        <div className="homepage-container">

            <header className="welcome-message">
                <h1>Welcome to GameHub!</h1>
                <p>Discover the latest releases and top-ranked games chosen just for you.</p>
            </header>

            <section className="top-ranked-section">
                <h2>Top Ranked Games</h2>
                <div className="top-ranked-cards">
                    {topRanked.slice(0, 3).map((game, index) => (
                        <a key={game.id} className={`top-game-card rank-${index + 1}`} href={`/games/${game._id}`}>
                            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.name} style={{height:'50%'}}/>
                            <div className="game-info">
                                <h3>{game.name}</h3>
                                <p>{game.description}</p>
                                <span className="price">${game.price}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            <section className="new-releases-section">
                <h2>New Releases</h2>
                <div className="new-releases-grid">
                    {newReleases.map(game => (
                        <a key={game.id} className="game-card" href={`/games/${game._id}`}>
                            <img src={`${SERVER_URL}/img/${game.image}`} alt={game.name} style={{maxWidth:'100%', height:'70%'}} />
                            <h3>{game.name}</h3>
                            {/* <p>{game.description}</p> */}
                            <span className="price">${game.price}</span>
                        </a>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default Home;
