import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'; // Assuming you already have this component
import './SinglePostPage.css';

interface Post {
  id: string;
  content: string;
  author: {
    full_name: string;
    posts: number;
    username: string;
  };
  likes: number;
  is_liked?: boolean; // Available if authenticated
  created_at: string;
}

const SinglePostPage: React.FC = () => {
  const { username, post_id } = useParams<{ username: string; post_id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  // Function to get the encoded credentials from localStorage
  const getAuthHeaders = () => {
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    
    if (!usernameStored || !passwordStored) {
      return null;
    }

    return {
      Authorization: `Basic ${btoa(`${usernameStored}:${passwordStored}`)}`,
    };
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const authHeaders = getAuthHeaders();

      try {
        const response = await axios.get(
          `/api/users/${username}/posts/${post_id}`,
          {
            headers: authHeaders ? authHeaders : undefined,
          }
        );

        const postData: Post = response.data;
        setPost(postData);
        setIsLiked(postData.is_liked);
      } catch (err) {
        setError('Post not found or error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [username, post_id]);

  const handleLike = async () => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      alert('You must be logged in to like/unlike a post');
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        // Unlike action
        const response = await axios.delete(
          `/api/users/${username}/posts/${post_id}/like`,
          {
            headers: authHeaders,
          }
        );

        if (response.status === 204) {
          setIsLiked(false);
          setPost((prevPost) => prevPost && {
            ...prevPost,
            likes: prevPost.likes - 1,
          });
        }
      } else {
        // Like action
        const response = await axios.put(
          `/api/users/${username}/posts/${post_id}/like`,
          {},
          {
            headers: authHeaders,
          }
        );

        if (response.status === 201) {
          setIsLiked(true);
          setPost((prevPost) => prevPost && {
            ...prevPost,
            likes: prevPost.likes + 1,
          });
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('User not logged in');
      } else if (err.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to perform the action.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  return (
    <div className="single-post-page">
      <Header />
      <h1>Post Details</h1>
      <div className="post-card">
        <h2>{post.content}</h2>
        <p>
          <strong>Author:</strong> {post.author.full_name} (@{post.author.username})
        </p>
        <p>
          <strong>Likes:</strong> {post.likes}{' '}
          <button
            onClick={handleLike}
            className="like-button"
            disabled={isLiked === undefined}
          >
            {isLiked ? '❤️' : '♡'}
          </button>
        </p>
        <p>
          <strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SinglePostPage;
