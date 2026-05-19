import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/variables.css';
import './App.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<div style={{ padding: '40px' }}><h1>Jobs Page</h1><p>Coming soon in Phase 4</p></div>} />
            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '40px' }}><h1>My Jobs Page</h1><p>Coming soon in Phase 4</p></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '40px' }}><h1>Applications Page</h1><p>Coming soon in Phase 6</p></div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div style={{ padding: '40px' }}><h1>404 - Page Not Found</h1></div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
