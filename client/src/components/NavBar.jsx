import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './NavBar.css';  // Add a CSS file for styles

function NavBar() {
  const { isLogIn } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Steam Clone</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
        {isLogIn ? (
          <>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/user">Profile</Link></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;