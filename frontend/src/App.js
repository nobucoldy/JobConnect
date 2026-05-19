import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import './styles/variables.css';
import './App.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListPage from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import MyJobs from './pages/MyJobs';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route
              path="/jobs/create"
              element={
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/edit/:id"
              element={
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute>
                  <MyJobs />
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
