import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username'); 
    setLoggedInUser(username);
  }, []);

  const checkUserExists = async (username: string): Promise<boolean> => {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
      const data = await response.json();
      return !!data.username;
    }

    return false; 
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      alert('Please enter a username.');
      return;
    }

    const searchTerm = searchQuery.trim().toLowerCase();

    try {
      const userExists = await checkUserExists(searchTerm);

      if (userExists) {
        navigate(`/watch-user/${searchTerm}`);
      } else {
        alert('This user doesn’t exist.');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      alert('An error occurred while searching for the user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); 
    setLoggedInUser(null);
    setShowDropdown(false);
    navigate('/login'); 
  };

  return (
    <header className="header">
      {/* Block 1: Logo Section */}
      <div className="menu-search-container">

      <div className="logo-section">
        <img src="/public/logo.png" alt="Microblog Logo" className="logo-image" />
        <span className="logo-label">Ping</span>
      </div>
  
      {/* Block 2: HomePage Button and Search Bar */}
        <nav className="menu">
          <a href="/">{"Home Page"}</a>
        </nav>
        <div className="search-bar">
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
        </div>
      </div>
  
      {/* Block 3: Logged-in User and Auth Links */}
      <div className="user-actions">
        <div className="user-info">
          {loggedInUser ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <span className="logged-in-user">Logged in as: {loggedInUser}</span>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button className="logout-button" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="unauthorized">Authorize</span>
          )}
        </div>
        <div className="auth-links">
          <a href="/login" className="login-link">Log In</a>
          <a href="/register" className="signup-link">Sign Up</a>
        </div>
      </div>
    </header>
  );
  
  
};

export default Header;
