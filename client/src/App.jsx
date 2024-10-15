import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Games from './pages/Games';
import Login from './pages/Login';
import Search from './pages/Search';
import GameDetails from './pages/Gamedetails';
import Register from './pages/Register';
import User from './pages/User';
import Cart from './pages/Cart';
import Upload from './pages/Upload';


function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} /> {/* Route for product details page */}
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Login />} /> {/* If no login go to login instead */}
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/register" element={<Register />} /> {/* Route for register */}
          <Route path="/user/:id" element={<User />} /> {/* Route for profile page */}
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
