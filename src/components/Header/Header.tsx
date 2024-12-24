import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();

  // Simulate checking for logged-in user
  useEffect(() => {
    const username = localStorage.getItem('username'); // Simulate logged-in user retrieval
    setLoggedInUser(username);
  }, []);

  // Function to check if a user exists via the API
  const checkUserExists = async (username: string): Promise<boolean> => {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
      const data = await response.json();
      // If the response contains a valid user, return true
      return !!data.username;
    }

    return false; // If response is not OK or user doesn't exist, return false
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      alert('Please enter a username.');
      return;
    }

    const searchTerm = searchQuery.trim().toLowerCase(); // Normalize search term

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
    localStorage.removeItem('username'); // Simulate logout
    setLoggedInUser(null);
    setShowDropdown(false);
    navigate('/login'); // Redirect to login
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
