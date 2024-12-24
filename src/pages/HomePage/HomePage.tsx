import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PostsList from '../../components/PostList/PostList';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      const isAuthenticated = Boolean(username && password);
      const encodedCredentials = isAuthenticated ? btoa(`${username}:${password}`) : null;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${username}/posts`,
          {
            params: { page: currentPage },
            headers: isAuthenticated
              ? {
                  Authorization: `Basic ${encodedCredentials}`,
                }
              : undefined,
          }
        );

        const fetchedPosts = response.data;

        if (fetchedPosts.length < 10) {
          setHasMore(false); // No more posts to fetch
        }

        // Replace posts only if it's the first page, otherwise append new posts
        setPosts((prevPosts) => {
          if (currentPage === 1) {
            return fetchedPosts; // Replace posts for the first page
          } else {
            return [...prevPosts, ...fetchedPosts]; // Append for subsequent pages
          }
        });
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="homepage-wrapper">
      <Header />
      <h1>Welcome to the Microblogging Platform</h1>
      <div className="button-container">
        <Link to="/create-post" className="create-post-button">
          Create Post
        </Link>
      </div>
      <PostsList
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        error={error}
      />
    </div>
  );
};

export default HomePage;
