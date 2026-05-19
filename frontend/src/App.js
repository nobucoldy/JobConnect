import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/variables.css';
import './App.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<div style={{ padding: '40px' }}><h1>Jobs Page</h1><p>Coming soon in Phase 4</p></div>} />
          <Route path="/my-jobs" element={<div style={{ padding: '40px' }}><h1>My Jobs Page</h1><p>Coming soon in Phase 4</p></div>} />
          <Route path="/applications" element={<div style={{ padding: '40px' }}><h1>Applications Page</h1><p>Coming soon in Phase 6</p></div>} />
          <Route path="*" element={<div style={{ padding: '40px' }}><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
