import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import "./Navbar.css";
import Header from '../components/Header';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/stores">Stores</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
            <Header />
        )}
      </div>

      
      
    </nav>
  );
}
