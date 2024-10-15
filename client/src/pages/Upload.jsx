import React, { useState } from 'react';
import axios from 'axios';
import './css/Upload.css'

const Upload = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState(null);
    const [platforms, setPlatforms] = useState([]);

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
        formData.append('id',"123456") //make some unique
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        formData.append('genre', genre);
        formData.append('releaseDate', new Date);
        formData.append('developer', "userId"); // change
        formData.append('platforms', JSON.stringify(platforms));
        console.log(formData)
        try {
            const response = await axios.post('http://localhost:8000/save/upload', formData);
            alert('Game uploaded successfully');
        } catch (error) {
            console.error('Error uploading game:', error);
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
                        <input type="checkbox" value="PS5" onChange={handlePlatformChange} />
                        PS5
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
        </div>
    );
};

export default Upload;
