import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Register from './pages/Register/Register';
import LogIn from './pages/LogIn/LogIn';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} /> {/* Register page route */}
        <Route path="/login" element={<LogIn />} /> {/* Register page route */}

      </Routes>
    </Router>
  );
};

export default App;
