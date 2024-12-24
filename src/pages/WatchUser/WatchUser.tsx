import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PostsList from '../../components/PostList/PostList';
import './WatchUser.css';

interface User {
  username: string;
  full_name: string | null;
  posts: number;
}

const WatchUser: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${username}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      const authUsername = localStorage.getItem('username');
      const authPassword = localStorage.getItem('password');
      const isAuthenticated = Boolean(authUsername && authPassword);
      const encodedCredentials = isAuthenticated ? btoa(`${authUsername}:${authPassword}`) : null;

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

        const fetchedPosts = response.data.posts || response.data;

        if (fetchedPosts.length < 10) {
          setHasMore(false);
        }

        setPosts((prevPosts) =>
          currentPage === 1 ? fetchedPosts : [...prevPosts, ...fetchedPosts]
        );
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserPosts();
    }
  }, [username, currentPage]);

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (!user && loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="watch-user-wrapper">
      <Header />
      {user && (
        <div className="user-info">
          <h1>{user.username}</h1>
          <p><strong>Full name:</strong> {user.full_name || 'No full name provided'}</p>
          <p><strong>Total posts:</strong> {user.posts}</p>
        </div>
      )}
      <h3>Posts of user:</h3>
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

export default WatchUser;
