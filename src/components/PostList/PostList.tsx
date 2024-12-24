import React from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  content: string;
  author: {
    full_name: string;
    posts: number;
    username: string;
  };
  likes: number;
  is_liked?: boolean; // Only available for authenticated users
  created_at: string;
}

interface PostsListProps {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  error: string | null;
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, hasMore, onLoadMore, error }) => {
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h2>{post.content.slice(0, 50)}...</h2>
          <p>
            <strong>Author:</strong> {post.author.full_name} (@{post.author.username})
          </p>
          <p>
            <strong>Likes:</strong> {post.likes}{' '}
            {post.is_liked !== undefined && (
              <span>{post.is_liked ? '❤️ Liked' : '♡ Not Liked'}</span>
            )}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}
          </p>
          <Link to={`/posts/${post.author.username}/${post.id}`} className="read-more-link">
            Read More
          </Link>
        </div>
      ))}
      {hasMore && !loading && (
        <button onClick={onLoadMore} className="load-more-button">
          Load More
        </button>
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PostsList;
