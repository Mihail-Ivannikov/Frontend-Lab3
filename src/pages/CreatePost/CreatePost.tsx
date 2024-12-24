import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './CreatePost.css';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
      alert('You must be logged in to create a post.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setError(null);
    setSuccessMessage(null);

    if (content.trim().length === 0) {
      setError('Post content cannot be empty.');
      return;
    }

    if (content.length > 140) {
      setError('Post content cannot exceed 140 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        setError('You must be logged in to create a post.');
        return;
      }

      const encodedCredentials = btoa(`${username}:${password}`);
      const response = await axios.post(
        `http://localhost:8000/api/users/${username}/posts`,
        { content },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Post created successfully!');
        setContent('');
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="create-post-container">
        <h2 className="create-post-header">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
            className="create-post-textarea"
            placeholder="Write your post here (max 140 characters)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={140}
            required
          />
          {error && <p className="create-post-error">{error}</p>}
          {successMessage && <p className="create-post-success">{successMessage}</p>}
          <button type="submit" className="create-post-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
