import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/Upload.css'

const Upload = () => {
    const username = useParams().username;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [result, setResult] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
        setGenre(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePlatformChange = (e) => {
        setPlatforms(e.target.value);
    };


    const uploadGame = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        formData.append('genre', genre);
        formData.append('developer', username);
        formData.append('platforms', JSON.stringify(platforms));
        console.log(formData)
        try {
            const response = await axios.post(`${SERVER_URL}/game/upload`, formData);
            alert('Game uploaded successfully');
        } catch (error) {
            const errorMessages = error.response.data.errors.map((err) => err.msg);
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
                <input type='text' onChange={handleGenreChange} />
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
