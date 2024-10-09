import { useState } from "react";
import axios from 'axios';
import './css/Register.css'

const Register = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:8000/register', {
            email,
            password,
          });
          console.log('Registration success:', response.data);
        } catch (error) {
          console.log('Error registering:', error);
        }
      };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister} className="register-form">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> 
                <button type="submit">Register</button>
                <a href="/login">Already have an account? Login here</a>
            </form>
        </div>
    )
}

export default Register;