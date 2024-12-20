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
import EditGame from './pages/Editgame';


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
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} /> {/* Route for register */}
          <Route path="/user" element={<User />} /> {/* Route for profile page */}
          <Route path="/user/upload" element={<Upload />} /> {/* Route for upload game */}
          <Route path="/games/edit/:gameId" element={<EditGame />} /> {/* Route for edit / delete game */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
