import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Upload.css'

const EditGame = () => {
    const token = localStorage.getItem('token');
    const { gameId } = useParams(); // Get the Game ID from the route
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [result, setResult] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const genreType = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sandbox", "Rogue-like", "Shooter", "Sports", "Horror", "MOBA"];

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/game/fetch/${gameId}`);
                setName(response.data.name);
                setDescription(response.data.description);
                setPrice(response.data.price);
                setGenre(response.data.genre);
                setPlatforms(response.data.platform);
            } catch (error) {
                console.error(error);
            }
        }
        if (!token) {
            window.location.href = '/login'; // if not login go to login page instead
        }
        fetchGame();

    }, [gameId, token])

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setGenre((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePlatformChange = (e) => {
        const value = e.target.value;
        setPlatforms((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };


    const editGame = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        genre.forEach(g => formData.append('genre[]', g));
        platforms.forEach(p => formData.append('platform[]', p))
        try {
            const response = await axios.put(`${SERVER_URL}/game/update/${gameId}`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            alert('Game edited successfully');
            window.location.href = '/user'; // go back to user page
        } catch (error) {
            console.log(error);
            const errorMessages = error.response.data.errors.map((err) => err.msg);
            setResult(errorMessages);
        }
    };

    const handleDeleteGame = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this game?');
        if (confirmDelete) {
            try {
                await axios.delete(`${SERVER_URL}/game/delete/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                alert('Game deleted successfully');
                window.location.href = '/user'; // go back to user page
            } catch (error) {
                console.error(error);
                alert('Failed to delete the game');
            }
        }
    };

    return (
        <div className="upload-page-container">
            <h1>Edit Game</h1>
            <form onSubmit={editGame} className="upload-form">
                <label className="upload-title">Name</label>
                <input type='text' onChange={handleNameChange} value={name} />
                <label className="upload-title">Description</label>
                <input type='text' onChange={handleDescriptionChange} value={description} />
                <label className="upload-title">Price</label>
                <input type='number' step="0.01" onChange={handlePriceChange} value={price} />

                <label className="upload-title">Image</label>
                <input type="file" name="file" onChange={handleImageChange} />
                <label className="upload-title">Platform</label>
                <div className="platform-checkboxes">
                    <label>
                        <input type="checkbox" value="PS" onChange={handlePlatformChange} checked={platforms.includes("PS")}/>
                        PS
                    </label>
                    <label>
                        <input type="checkbox" value="NSW" onChange={handlePlatformChange} checked={platforms.includes("NSW")}/>
                        NSW
                    </label>
                    <label>
                        <input type="checkbox" value="XBOX" onChange={handlePlatformChange} checked={platforms.includes("XBOX")}/>
                        XBOX
                    </label>
                    <label>
                        <input type="checkbox" value="PC" onChange={handlePlatformChange} checked={platforms.includes("PC")}/>
                        PC
                    </label>
                </div>
                <label className="upload-title">Genre</label>
                <div className="platform-checkboxes">
                    {genreType.map((g) => (
                        <label key={g}>
                            <input
                                type="checkbox"
                                value={g}
                                onChange={handleGenreChange}
                                checked={genre.includes(g)}
                            />{" "}
                            {g}
                        </label>
                    ))}
                </div>
                <button type="submit">Upload</button>
            </form>

            {/* Delete game button */}
            <button onClick={handleDeleteGame} className="delete-game-button">Delete Game</button>

            {/* Show if there are any validation errors */}
            {result.length > 0 && (
                <div style={{ color: 'red' }}>
                    {result.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditGame;
