import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './LogIn.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const credentials = {
      username,
      password,
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 204) {
        // Login successful
        alert('Login successful!');
        // Redirect or take any action on successful login
      } else if (response.status === 401) {
        // Invalid username or password
        const data = await response.json();
        setError(`Invalid username or password: ${data.detail}`);
      } else if (response.status === 422) {
        // Validation errors
        const data = await response.json();
        setError(`Validation error: ${data.detail.map((err: any) => err.msg).join(', ')}`);
      } else {
        // Other errors
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <Header />

      <div className="login-page">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
