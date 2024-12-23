import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /*useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);*/

  useEffect(() => {
    const mockPosts = [
      { id: '1', title: 'Test Post', content: 'This is a test post.', author: 'User1', likes: 5 },
    ];
    setPosts(mockPosts);
    setLoading(false);
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header />
      <h1>Welcome to the Microblogging Platform</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.content.slice(0, 100)}...</p>
            <p>
              <strong>Author:</strong> {post.author}
            </p>
            <p>
              <strong>Likes:</strong> {post.likes}
            </p>
            <a href={`/posts/${post.id}`}>Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
