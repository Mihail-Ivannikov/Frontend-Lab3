import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Use a separate CSS file for styling

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-section">
        <img src="/public/logo.png" alt="Microblog Logo" className="logo-image" /> {/* Replace '/logo.png' with the actual path */}
        <span className="logo-label">Ping</span>
      </div>
      <nav className="menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
      <div className="auth-links">
        <a href="/login" className="login-link">Log In</a>
        <a href="/register" className="signup-link">Sign Up</a>
      </div>
    </header>
  );
};

export default Header;
