import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Register from './pages/Register/Register';
import LogIn from './pages/LogIn/LogIn';
import CreatePost from './pages/CreatePost/CreatePost';
import SinglePostPage from './pages/SinglePostPage/SinglePostPage';
import WatchUser from './pages/WatchUser/WatchUser';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} /> {/* Register page route */}
        <Route path="/login" element={<LogIn />} /> {/* Register page route */}
        <Route path="/create-post" element={<CreatePost />} /> {/* Register page route */}
        <Route path="/posts/:username/:post_id" element={<SinglePostPage />} />
        <Route path="/watch-user/:username" element={<WatchUser />} />

      </Routes>
    </Router>
  );
};

export default App;
