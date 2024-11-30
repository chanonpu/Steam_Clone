import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Register.css'

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState([]);
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/user/register`, {
        username,
        email,
        password,
      });
      alert("Register successful");
      navigate(`/login`)
    } catch (error) {
      const errorMessages = error.response.data.errors.map((err) => err.msg);
      setResult(errorMessages);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="register-form">
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>

        {/* Show if there any validate error */}
        {result.length > 0 && (
          <div style={{ color: 'red' }}>
            {result.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <p className="login-redirect" onClick={goToLogin} style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '15px' }}>
          Already have an account? Login here
        </p>
      </form>
    </div>
  )
}

export default Register;