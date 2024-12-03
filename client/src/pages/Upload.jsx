import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Upload.css'

const Upload = () => {
    const token = localStorage.getItem('token');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [result, setResult] = useState([]);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const genreType = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sandbox", "Rogue-like", "Shooter", "Sports", "Horror", "MOBA"];

    useEffect(() => {
        if (!token) {
            navigate('/login'); // if not login go to login page instead
        }
    }, [token])

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


    const uploadGame = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        genre.forEach(g => formData.append('genre[]', g));
        platforms.forEach(p => formData.append('platform[]', p))
        try {
            const response = await axios.post(`${SERVER_URL}/game/upload`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            alert('Game uploaded successfully');
            navigate(`/user/`)
        } catch (error) {
            console.log(error);
            const errorMessages = error.response.data.errors.map((err) => err.msg);
            setResult(errorMessages);
        }
    };

    return (
        <div className="upload-page-container">
            <h1>Upload Game</h1>
            <form onSubmit={uploadGame} className="upload-form">
                <label className="upload-title">Name</label>
                <input type='text' onChange={handleNameChange} />
                <label className="upload-title">Description</label>
                <input type='text' onChange={handleDescriptionChange} />
                <label className="upload-title">Price</label>
                <input type='number' step="0.01" onChange={handlePriceChange} />

                <label className="upload-title">Image</label>
                <input type="file" name="file" onChange={handleImageChange} />
                <label className="upload-title">Platform</label>
                <div className="platform-checkboxes">
                    <label>
                        <input type="checkbox" value="PS" onChange={handlePlatformChange} />
                        PS
                    </label>
                    <label>
                        <input type="checkbox" value="NSW" onChange={handlePlatformChange} />
                        NSW
                    </label>
                    <label>
                        <input type="checkbox" value="XBOX" onChange={handlePlatformChange} />
                        XBOX
                    </label>
                    <label>
                        <input type="checkbox" value="PC" onChange={handlePlatformChange} />
                        PC
                    </label>
                </div>
                <label className="upload-title">Genre</label>
                <div className="platform-checkboxes">
                    {genreType.map((genre) => (
                        <label key={genre}>
                            <input
                                type="checkbox"
                                value={genre}
                                onChange={handleGenreChange}
                            />{" "}
                            {genre}
                        </label>
                    ))}
                </div>
                <button type="submit">Upload</button>
            </form>

            {/* Show if there any validate error */}
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

export default Upload;
