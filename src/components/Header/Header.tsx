import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Assuming you have this CSS file

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/watch-user/${searchQuery}`); // Redirect to the WatchUser page with the search query as a parameter
    }
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src="/public/logo.png" alt="Microblog Logo" className="logo-image" />
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
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          placeholder="Search user..."
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
    </header>
  );
};

export default Header;
