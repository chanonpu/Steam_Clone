import React, { useState } from 'react';
import axios from 'axios';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      console.log('Login success:', response.data);
    } catch (error) {
      console.log('Error logging in:', error);
    }
  };

  return (
    <div className="login-page-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <a href="/register">Create an account</a>
      </form>
    </div>
  );
};

export default Login;
