import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();
  const { logIn } = useAuth(); // Use logIn function from AuthContext
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/user/login`, { username, password });
      logIn(response.data.token); // Call logIn to update the context
      navigate(`/user/`)
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  // Use navigate function to go to register page
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" >Login</button>
        {result && <p style={{ color: 'red' }}>{result}</p>}
        <button type="button" onClick={goToRegister} style={{marginTop: "20px"}}>Create an account</button>
      </form>
    </div>
  );
};

export default Login;
