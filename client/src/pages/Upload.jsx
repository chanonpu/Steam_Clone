import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Upload.css'

const Upload = () => {
    const token = localStorage.getItem('token');
    const [username, setUsername] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [result, setResult] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));;
            setUsername(decoded.username);
        } else {
            window.location.href = '/login';
        }
    },[])

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
        // Toggle genre in array when checkbox is checked/unchecked
        const value = e.target.value;
        setGenre((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePlatformChange = (e) => {
        // Toggle platform in array when checkbox is checked/unchecked
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
        formData.append('developer', username);
        platforms.forEach(p => formData.append('platform[]', p))
        try {
            const response = await axios.post(`${SERVER_URL}/game/upload`, formData);
            alert('Game uploaded successfully');
        } catch (error) {
            const errorMessages = error.response.data.errors.map((err) => err.msg);
            console.log(error);
            setResult(errorMessages);
        }
    };

    return (
        <div className="login-page-container">
            <h1>Upload Game</h1>
            <form onSubmit={uploadGame} className="login-form">
                <label>Name</label>
                <input type='text' onChange={handleNameChange} />
                <label>Description</label>
                <input type='text' onChange={handleDescriptionChange} />
                <label>Price</label>
                <input type='number' step="0.01" onChange={handlePriceChange} />
                <label>Genre</label>
                <div className="platform-checkboxes">
                    <label>
                        <input type="checkbox" value="Action" onChange={handleGenreChange} /> Action
                    </label>
                    <label>
                        <input type="checkbox" value="Adventure" onChange={handleGenreChange} /> Adventure
                    </label>
                    <label>
                        <input type="checkbox" value="RPG" onChange={handleGenreChange} /> RPG
                    </label>
                </div>
                <label>Image</label>
                <input type="file" name="file" onChange={handleImageChange} />
                <label>Platform</label>
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
