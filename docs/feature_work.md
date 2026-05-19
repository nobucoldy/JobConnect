# JobConnect - Detailed Feature Work Breakdown

## Overview

**Total Timeline**: 6-7 weeks (120-140 hours)  
**Phases**: 12 phases  
**Average Phase Duration**: 3-4 days

---

## Phase Structure

Each phase includes:
- **Duration**: Estimated time
- **Dependencies**: What must be completed first
- **Backend Tasks**: API and database work
- **Frontend Tasks**: UI and integration work
- **Testing Checklist**: What to verify
- **Deliverable**: What should work by end of phase

---

# PHASE 1: Project Setup & Infrastructure

**Duration**: 2-3 days (10-12 hours)  
**Dependencies**: None

## Backend Tasks

### 1.1 Initialize Backend Project
```bash
mkdir jobconnect-backend
cd jobconnect-backend
npm init -y
```

- [ ] Install dependencies
  ```bash
  npm install express mongoose dotenv bcrypt jsonwebtoken express-validator cors
  npm install --save-dev nodemon
  ```

- [ ] Create folder structure
  ```
  backend/
  ├── src/
  │   ├── models/
  │   ├── controllers/
  │   ├── routes/
  │   ├── middlewares/
  │   ├── services/
  │   ├── utils/
  │   └── config/
  ├── .env
  ├── .gitignore
  ├── package.json
  └── server.js
  ```

- [ ] Setup .env file
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/jobconnect
  JWT_SECRET=your-secret-key-here
  JWT_EXPIRE=7d
  NODE_ENV=development
  ```

- [ ] Create server.js
  - Express app setup
  - CORS configuration
  - Body parser
  - Error handling middleware
  - 404 handler

- [ ] Create config/database.js
  - MongoDB connection function
  - Connection error handling
  - Connection success logging

- [ ] Create middlewares/errorHandler.js
  - Global error handler
  - Format error responses
  - Log errors in development

- [ ] Test server starts successfully
  ```bash
  npm run dev
  ```

### 1.2 Database Setup

- [ ] Install MongoDB locally or setup MongoDB Atlas
- [ ] Test database connection
- [ ] Create initial database indexes (will add more later)

---

## Frontend Tasks

### 1.3 Initialize Frontend Project

```bash
npx create-react-app jobconnect-frontend
cd jobconnect-frontend
```

- [ ] Install dependencies
  ```bash
  npm install react-router-dom axios react-icons
  ```

- [ ] Create folder structure
  ```
  frontend/
  ├── src/
  │   ├── components/
  │   │   ├── common/
  │   │   ├── layout/
  │   │   └── job/
  │   ├── pages/
  │   ├── services/
  │   ├── context/
  │   ├── utils/
  │   ├── styles/
  │   └── App.js
  ├── public/
  └── package.json
  ```

- [ ] Setup CSS variables (from design-specification.md)
  - Create src/styles/variables.css
  - Import in App.js

- [ ] Setup React Router
  - Install react-router-dom
  - Setup basic routes in App.js
  - Create placeholder pages

- [ ] Create Axios instance (src/services/api.js)
  ```javascript
  import axios from 'axios';
  
  const API = axios.create({
    baseURL: 'http://localhost:5000/api',
  });
  
  // Request interceptor to add token
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // Response interceptor for error handling
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export default API;
  ```

- [ ] Test frontend starts successfully
  ```bash
  npm start
  ```

---

## Testing Checklist

- [ ] Backend server runs on http://localhost:5000
- [ ] Frontend app runs on http://localhost:3000
- [ ] MongoDB connection successful
- [ ] No console errors
- [ ] Folder structure is correct
- [ ] Git repository initialized with .gitignore

---

## Deliverable

- ✅ Backend server running with error handling
- ✅ Frontend React app running
- ✅ Database connected
- ✅ Project structure established
- ✅ Development environment ready

**Estimated Time**: 2-3 days

---

# PHASE 2: User Model & Authentication Backend

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 1

## Backend Tasks

### 2.1 Create User Model

**File**: src/models/User.js

- [ ] Define User schema
  ```javascript
  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  }, {
    timestamps: true
  });
  ```

- [ ] Add pre-save hook to hash password
  ```javascript
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  ```

- [ ] Add method to compare password
  ```javascript
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  ```

- [ ] Add method to exclude password from JSON
  ```javascript
  userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
  };
  ```

- [ ] Add indexes
  ```javascript
  userSchema.index({ email: 1 });
  userSchema.index({ role: 1 });
  userSchema.index({ averageRating: -1 });
  ```

### 2.2 Create Auth Middleware

**File**: src/middlewares/auth.js

- [ ] Create JWT verification middleware
  ```javascript
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  
  exports.protect = async (req, res, next) => {
    try {
      let token;
      
      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, no token'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  };
  ```

- [ ] Create admin check middleware
  ```javascript
  exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }
      next();
    };
  };
  ```

**File**: src/middlewares/checkRole.js
- [ ] Admin-only middleware using authorize

### 2.3 Create Auth Controller

**File**: src/controllers/authController.js

- [ ] **Register function**
  - Validate input (email, password, name, phone)
  - Check if email already exists
  - Create user with role='user'
  - Generate JWT token
  - Return user and token
  ```javascript
  exports.register = async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      // Create user
      const user = await User.create({
        email,
        password,
        name,
        phone,
        role: 'user'
      });
      
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      
      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Login function**
  - Validate input
  - Check if user exists
  - Compare password
  - Generate JWT token
  - Return user and token
  ```javascript
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if email and password provided
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }
      
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      
      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get current user function**
  - Return req.user (attached by protect middleware)
  ```javascript
  exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

### 2.4 Create Auth Routes

**File**: src/routes/authRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const { register, login, getMe } = require('../controllers/authController');
  const { protect } = require('../middlewares/auth');
  
  router.post('/register', register);
  router.post('/login', login);
  router.get('/me', protect, getMe);
  
  module.exports = router;
  ```

- [ ] Mount routes in server.js
  ```javascript
  app.use('/api/auth', require('./routes/authRoutes'));
  ```

### 2.5 Input Validation

**File**: src/utils/validators.js

- [ ] Create validation functions
  ```javascript
  const { body } = require('express-validator');
  
  exports.registerValidator = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name min 2 chars'),
    body('phone').trim().isLength({ min: 10 }).withMessage('Phone min 10 chars')
  ];
  
  exports.loginValidator = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ];
  ```

- [ ] Apply validators to routes

---

## Testing Checklist

### Manual API Testing (Use Postman/Thunder Client)

- [ ] **POST /api/auth/register**
  - Success case: Returns user and token
  - Error: Email already exists
  - Error: Missing required fields
  - Error: Invalid email format
  - Error: Password too short

- [ ] **POST /api/auth/login**
  - Success case: Returns user and token
  - Error: Invalid email
  - Error: Invalid password
  - Error: Missing fields

- [ ] **GET /api/auth/me**
  - Success with valid token
  - Error 401 without token
  - Error 401 with invalid token

- [ ] Password is hashed in database (check MongoDB)
- [ ] Password is not returned in responses
- [ ] Token can be decoded (jwt.io)

---

## Deliverable

- ✅ User model with password hashing
- ✅ Register endpoint working
- ✅ Login endpoint working
- ✅ JWT authentication middleware working
- ✅ Get current user endpoint working
- ✅ All validation working

**Estimated Time**: 3-4 days

---

# PHASE 3: Authentication Frontend & Context

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 2

## Frontend Tasks

### 3.1 Create AuthContext

**File**: src/context/AuthContext.js

- [ ] Create context and provider
  ```javascript
  import React, { createContext, useState, useContext, useEffect } from 'react';
  import API from '../services/api';
  
  const AuthContext = createContext();
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Check token on mount
    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await API.get('/auth/me');
            setUser(res.data.data);
          } catch (error) {
            localStorage.removeItem('token');
          }
        }
        setLoading(false);
      };
      checkAuth();
    }, []);
    
    const register = async (email, password, name, phone) => {
      const res = await API.post('/auth/register', { email, password, name, phone });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    };
    
    const login = async (email, password) => {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    };
    
    const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
    };
    
    const value = {
      user,
      loading,
      register,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    };
    
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  };
  ```

- [ ] Wrap App with AuthProvider in index.js

### 3.2 Create Common Components

**File**: src/components/common/Button.jsx & Button.css
- [ ] Implement Button component (from component-implementation-guide.md)

**File**: src/components/common/Input.jsx & Input.css
- [ ] Implement Input component (from component-implementation-guide.md)

**File**: src/components/common/Card.jsx & Card.css
- [ ] Implement Card component

### 3.3 Create Login Page

**File**: src/pages/Login.jsx & Login.css

- [ ] Implement login form (from component-implementation-guide.md)
- [ ] Two-panel layout (form + illustration)
- [ ] Form validation
- [ ] Error handling
- [ ] Loading state
- [ ] Redirect after successful login
- [ ] Link to register page

**Features**:
- Email and password inputs
- Submit button with loading state
- Client-side validation
- Display server errors
- "Chưa có tài khoản? Đăng ký ngay" link

### 3.4 Create Register Page

**File**: src/pages/Register.jsx & Register.css

- [ ] Similar layout to Login
- [ ] Form fields: email, password, name, phone
- [ ] Validation
- [ ] Error handling
- [ ] Auto-login after registration
- [ ] Redirect to home
- [ ] Link to login page

### 3.5 Create Protected Route Component

**File**: src/components/common/ProtectedRoute.jsx

- [ ] Check authentication
- [ ] Redirect to login if not authenticated
- [ ] Show loading state while checking
  ```javascript
  import React from 'react';
  import { Navigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (adminOnly && !isAdmin) {
      return <Navigate to="/" />;
    }
    
    return children;
  };
  
  export default ProtectedRoute;
  ```

### 3.6 Create Navbar Component

**File**: src/components/layout/Navbar.jsx & Navbar.css

- [ ] Implement navbar (from component-implementation-guide.md)
- [ ] Show different menu items based on auth state
- [ ] User avatar/name when logged in
- [ ] Logout button
- [ ] Responsive design

### 3.7 Setup Routes

**File**: src/App.js

- [ ] Setup React Router with all routes
  ```javascript
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { AuthProvider } from './context/AuthContext';
  import Navbar from './components/layout/Navbar';
  import ProtectedRoute from './components/common/ProtectedRoute';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import Home from './pages/Home';
  
  function App() {
    return (
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<div>Jobs Page</div>} />
            <Route 
              path="/my-jobs" 
              element={
                <ProtectedRoute>
                  <div>My Jobs</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    );
  }
  ```

### 3.8 Create Placeholder Home Page

**File**: src/pages/Home.jsx

- [ ] Simple welcome page
- [ ] Show user name if logged in
- [ ] CTA buttons (Find Jobs, Post Job)

---

## Testing Checklist

- [ ] Register new user via form
- [ ] See validation errors for invalid inputs
- [ ] See error message for duplicate email
- [ ] Redirect to home after successful registration
- [ ] Token saved in localStorage
- [ ] User data stored in context
- [ ] Navbar shows user name
- [ ] Login with registered credentials
- [ ] See error for wrong password
- [ ] Logout clears token and redirects
- [ ] Protected routes redirect to login when not authenticated
- [ ] After logout, can't access protected routes
- [ ] Page refresh maintains login state (if token exists)

---

## Deliverable

- ✅ Full authentication flow (register + login + logout)
- ✅ Protected routes working
- ✅ User state managed globally with Context
- ✅ Token persisted in localStorage
- ✅ Navbar shows auth state
- ✅ Form validation working

**Estimated Time**: 3-4 days

---

# PHASE 4: Job Model & CRUD Backend

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 2

## Backend Tasks

### 4.1 Create Job Model

**File**: src/models/Job.js

- [ ] Define Job schema
  ```javascript
  const jobSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Delivery', 'Cleaning', 'Tutoring', 'Tech Support', 'Other']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      minlength: [5, 'Location must be at least 5 characters'],
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [10000, 'Salary must be at least 10,000 VND']
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  ```

- [ ] Add validation for dates
  ```javascript
  jobSchema.pre('save', function(next) {
    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
      return next(new Error('End date must be after start date'));
    }
    if (this.startDate && this.startDate < new Date()) {
      return next(new Error('Start date cannot be in the past'));
    }
    next();
  });
  ```

- [ ] Add virtual for applications
  ```javascript
  jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job'
  });
  ```

- [ ] Add indexes
  ```javascript
  jobSchema.index({ poster: 1 });
  jobSchema.index({ assignedWorker: 1 });
  jobSchema.index({ status: 1 });
  jobSchema.index({ category: 1 });
  jobSchema.index({ status: 1, createdAt: -1 });
  ```

### 4.2 Create Job Controller

**File**: src/controllers/jobController.js

- [ ] **Create job**
  ```javascript
  exports.createJob = async (req, res) => {
    try {
      const jobData = {
        ...req.body,
        poster: req.user._id,
        status: 'OPEN'
      };
      
      const job = await Job.create(jobData);
      await job.populate('poster', 'name email phone averageRating');
      
      res.status(201).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get all jobs** (with filters & pagination)
  ```javascript
  exports.getAllJobs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Build query
      const query = {};
      
      if (req.query.category) {
        query.category = req.query.category;
      }
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      if (req.query.location) {
        query.location = { $regex: req.query.location, $options: 'i' };
      }
      
      // Execute query
      const jobs = await Job.find(query)
        .populate('poster', 'name averageRating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Job.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get job by ID**
  ```javascript
  exports.getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate('poster', 'name email phone averageRating totalReviews')
        .populate('assignedWorker', 'name phone averageRating');
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Update job**
  ```javascript
  exports.updateJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check ownership
      if (job.poster.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this job'
        });
      }
      
      // Cannot edit completed or cancelled jobs
      if (['COMPLETED', 'CANCELLED'].includes(job.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot edit completed or cancelled jobs'
        });
      }
      
      // Update job
      Object.assign(job, req.body);
      await job.save();
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Delete job**
  ```javascript
  exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check ownership
      if (job.poster.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this job'
        });
      }
      
      // Can only delete OPEN jobs
      if (job.status !== 'OPEN') {
        return res.status(400).json({
          success: false,
          message: 'Can only delete OPEN jobs with no accepted applications'
        });
      }
      
      await job.deleteOne();
      
      res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get my jobs** (jobs posted by current user)
  ```javascript
  exports.getMyJobs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const query = { poster: req.user._id };
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      const jobs = await Job.find(query)
        .populate('assignedWorker', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Job.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Mark job as completed**
  ```javascript
  exports.markJobComplete = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check ownership
      if (job.poster.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
      
      // Can only complete ASSIGNED jobs
      if (job.status !== 'ASSIGNED') {
        return res.status(400).json({
          success: false,
          message: 'Can only complete assigned jobs'
        });
      }
      
      job.status = 'COMPLETED';
      await job.save();
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

### 4.3 Create Job Routes

**File**: src/routes/jobRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
    markJobComplete
  } = require('../controllers/jobController');
  const { protect } = require('../middlewares/auth');
  
  router.get('/', getAllJobs);
  router.get('/my/posted', protect, getMyJobs);
  router.get('/:id', getJobById);
  router.post('/', protect, createJob);
  router.put('/:id', protect, updateJob);
  router.delete('/:id', protect, deleteJob);
  router.put('/:id/complete', protect, markJobComplete);
  
  module.exports = router;
  ```

- [ ] Mount in server.js
  ```javascript
  app.use('/api/jobs', require('./routes/jobRoutes'));
  ```

---

## Testing Checklist

### API Testing (Postman)

- [ ] **POST /api/jobs** (protected)
  - Success: Create job with all fields
  - Error: Missing required fields
  - Error: Invalid category
  - Error: No token (401)
  - Verify poster is set to current user
  - Verify status is 'OPEN'

- [ ] **GET /api/jobs**
  - Returns paginated list
  - Filter by category works
  - Filter by status works
  - Search by location works
  - Poster info is populated

- [ ] **GET /api/jobs/:id**
  - Returns job detail with poster info
  - Error 404 for invalid ID

- [ ] **PUT /api/jobs/:id** (protected)
  - Success: Update own job
  - Error: Cannot update other user's job (403)
  - Error: Cannot update completed job

- [ ] **DELETE /api/jobs/:id** (protected)
  - Success: Delete own OPEN job
  - Error: Cannot delete other user's job
  - Error: Cannot delete ASSIGNED job

- [ ] **GET /api/jobs/my/posted** (protected)
  - Returns only current user's jobs
  - Filter by status works

- [ ] **PUT /api/jobs/:id/complete** (protected)
  - Success: Mark ASSIGNED job as COMPLETED
  - Error: Cannot complete non-ASSIGNED job
  - Error: Cannot complete other user's job

---

## Deliverable

- ✅ Job model with validation
- ✅ Full CRUD endpoints for jobs
- ✅ Pagination working
- ✅ Filters working (category, status, location)
- ✅ Authorization checks (ownership)
- ✅ Mark job as complete endpoint

**Estimated Time**: 3-4 days

---

# PHASE 5: Job UI & Pages

**Duration**: 4-5 days (15-20 hours)  
**Dependencies**: Phase 3, Phase 4

## Frontend Tasks

### 5.1 Create Job Service

**File**: src/services/jobService.js

- [ ] Create API functions
  ```javascript
  import API from './api';
  
  export const jobService = {
    getAllJobs: (params) => API.get('/jobs', { params }),
    getJobById: (id) => API.get(`/jobs/${id}`),
    createJob: (data) => API.post('/jobs', data),
    updateJob: (id, data) => API.put(`/jobs/${id}`, data),
    deleteJob: (id) => API.delete(`/jobs/${id}`),
    getMyJobs: (params) => API.get('/jobs/my/posted', { params }),
    markJobComplete: (id) => API.put(`/jobs/${id}/complete`)
  };
  ```

### 5.2 Create Job Components

**File**: src/components/common/Badge.jsx & Badge.css
- [ ] Implement Badge component (from component-implementation-guide.md)

**File**: src/components/job/JobCard.jsx & JobCard.css
- [ ] Implement JobCard component (from component-implementation-guide.md)
- [ ] Show: icon, category, status, title, description, meta, price
- [ ] "Xem chi tiết" and "Ứng tuyển ngay" buttons

**File**: src/components/job/JobList.jsx & JobList.css
- [ ] Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- [ ] Map jobs to JobCard components
- [ ] Empty state if no jobs
- [ ] Loading skeleton

**File**: src/components/job/JobFilter.jsx & JobFilter.css
- [ ] Category dropdown
- [ ] Status dropdown (for My Jobs page)
- [ ] Location search input
- [ ] "Lọc" button

### 5.3 Create Job List Page

**File**: src/pages/JobList.jsx & JobList.css

- [ ] Layout: Search bar + Filter + Job list + Pagination
- [ ] Fetch jobs on mount
- [ ] Apply filters
- [ ] Pagination controls
- [ ] Loading state
- [ ] Error handling

**Features**:
- Search bar at top
- Filter sidebar or top bar
- Job grid
- Pagination
- "Không tìm thấy công việc" empty state

### 5.4 Create Job Detail Page

**File**: src/pages/JobDetail.jsx & JobDetail.css

- [ ] Two-column layout (70% content, 30% sidebar)
- [ ] Show full job info
- [ ] Show poster info with rating
- [ ] "Ứng tuyển" button (if not applied, not owner, status OPEN)
- [ ] "Sửa" button (if owner)
- [ ] "Xóa" button (if owner and OPEN)
- [ ] "Hoàn thành" button (if owner and ASSIGNED)
- [ ] Loading state
- [ ] Error handling (404 if job not found)

**Layout**:
```
┌─────────────────────────────┬──────────────┐
│ Breadcrumb                  │              │
├─────────────────────────────┤   Sidebar    │
│ Job Title                   │              │
│ Poster Info (avatar+rating) │   - Price    │
│                             │   - Meta     │
│ Description                 │   - Button   │
│                             │              │
│ Job Details                 │              │
└─────────────────────────────┴──────────────┘
```

### 5.5 Create Job Form Page (Create & Edit)

**File**: src/pages/CreateJob.jsx & CreateJob.css
**File**: src/pages/EditJob.jsx & EditJob.css

- [ ] Form with all job fields:
  - Title (input)
  - Description (textarea)
  - Category (dropdown)
  - Location (input)
  - Salary (number input)
  - Start Date (date picker - optional)
  - End Date (date picker - optional)

- [ ] Client-side validation
- [ ] Submit handler
- [ ] Error display
- [ ] Loading state during submit
- [ ] Redirect after success

**Create Job**:
- Empty form
- POST to /api/jobs
- Redirect to job detail after creation

**Edit Job**:
- Pre-fill form with existing data
- PUT to /api/jobs/:id
- Redirect to job detail after update

### 5.6 Create My Jobs Page

**File**: src/pages/MyJobs.jsx & MyJobs.css

- [ ] Tabs or sections by status:
  - All
  - OPEN
  - ASSIGNED
  - COMPLETED
  - CANCELLED

- [ ] List of jobs posted by current user
- [ ] Show: title, status badge, created date, actions
- [ ] Actions: View, Edit, Delete (if OPEN), Mark Complete (if ASSIGNED)
- [ ] Empty state
- [ ] Loading state
- [ ] Pagination

**Layout**:
```
┌────────────────────────────────────┐
│ Công việc của tôi                  │
├────────────────────────────────────┤
│ [All] [OPEN] [ASSIGNED] [COMPLETED]│
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ Job Card                       │ │
│ │ [View] [Edit] [Delete]         │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ Job Card                       │ │
│ └────────────────────────────────┘ │
├────────────────────────────────────┤
│ Pagination                         │
└────────────────────────────────────┘
```

### 5.7 Update Navbar

- [ ] Add "Tìm việc" link → /jobs
- [ ] Add "Đăng việc" button → /jobs/create
- [ ] Add "Công việc của tôi" link → /my-jobs (if logged in)

### 5.8 Create Home Page

**File**: src/pages/Home.jsx & Home.css

- [ ] Hero section
  - Large heading
  - Subtitle
  - Search bar
  - CTA button "Tìm việc ngay"
  - 3D illustration (optional - can use placeholder)

- [ ] Category section
  - Grid of 5 categories
  - Icon + name
  - Click to filter jobs by category

- [ ] Recent jobs section
  - Show 6 most recent jobs
  - "Xem tất cả" link to /jobs

- [ ] Stats section (optional)
  - Total jobs
  - Total users
  - Total reviews

---

## Testing Checklist

- [ ] Home page displays correctly
- [ ] Click category navigates to filtered job list
- [ ] Job list page shows all jobs
- [ ] Filter by category works
- [ ] Search by location works
- [ ] Pagination works
- [ ] Click job card opens detail page
- [ ] Job detail page shows full info
- [ ] "Ứng tuyển" button visible for OPEN jobs (if not owner)
- [ ] Create job form validates inputs
- [ ] Create job redirects to detail after success
- [ ] Created job appears in My Jobs
- [ ] Edit job pre-fills form
- [ ] Edit job saves changes
- [ ] Delete job removes from list
- [ ] Mark complete changes status to COMPLETED
- [ ] Cannot edit/delete other user's jobs
- [ ] Responsive design works on mobile

---

## Deliverable

- ✅ Complete job browsing experience
- ✅ Job detail page with actions
- ✅ Create/Edit job forms
- ✅ My Jobs dashboard
- ✅ Home page with hero and categories
- ✅ All job features working end-to-end

**Estimated Time**: 4-5 days

---

# PHASE 6: Application Model & Backend

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 4

## Backend Tasks

### 6.1 Create Application Model

**File**: src/models/Application.js

- [ ] Define Application schema
  ```javascript
  const applicationSchema = new mongoose.Schema({
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      maxlength: [500, 'Cover letter cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    }
  }, {
    timestamps: true
  });
  ```

- [ ] Add compound unique index
  ```javascript
  applicationSchema.index({ job: 1, worker: 1 }, { unique: true });
  ```

- [ ] Add other indexes
  ```javascript
  applicationSchema.index({ job: 1 });
  applicationSchema.index({ worker: 1 });
  applicationSchema.index({ status: 1 });
  applicationSchema.index({ job: 1, status: 1 });
  ```

### 6.2 Create Application Controller

**File**: src/controllers/applicationController.js

- [ ] **Apply to job**
  ```javascript
  exports.applyJob = async (req, res) => {
    try {
      const { jobId, coverLetter } = req.body;
      
      // Check if job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check if job is OPEN
      if (job.status !== 'OPEN') {
        return res.status(400).json({
          success: false,
          message: 'This job is not accepting applications'
        });
      }
      
      // Check if user is not the poster
      if (job.poster.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot apply to your own job'
        });
      }
      
      // Check if already applied
      const existingApplication = await Application.findOne({
        job: jobId,
        worker: req.user._id
      });
      
      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied to this job'
        });
      }
      
      // Create application
      const application = await Application.create({
        job: jobId,
        worker: req.user._id,
        coverLetter,
        status: 'PENDING'
      });
      
      await application.populate('worker', 'name phone averageRating');
      await application.populate('job', 'title category');
      
      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get applications for a job** (poster only)
  ```javascript
  exports.getApplicationsForJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check if user is the poster
      if (job.poster.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view applications'
        });
      }
      
      const query = { job: req.params.jobId };
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      const applications = await Application.find(query)
        .populate('worker', 'name phone email averageRating totalReviews')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get my applications** (worker)
  ```javascript
  exports.getMyApplications = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const query = { worker: req.user._id };
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      const applications = await Application.find(query)
        .populate({
          path: 'job',
          select: 'title category location salary status',
          populate: {
            path: 'poster',
            select: 'name averageRating'
          }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Application.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Accept application** (with MongoDB Transaction)
  ```javascript
  exports.acceptApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const application = await Application.findById(req.params.id).session(session);
      
      if (!application) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      const job = await Job.findById(application.job).session(session);
      
      if (!job) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Check if user is the poster
      if (job.poster.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
      
      // Check if job is still OPEN
      if (job.status !== 'OPEN') {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Job is not accepting applications'
        });
      }
      
      // Check if application is PENDING
      if (application.status !== 'PENDING') {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Application is not pending'
        });
      }
      
      // Update application to ACCEPTED
      application.status = 'ACCEPTED';
      await application.save({ session });
      
      // Update job status and assign worker
      job.status = 'ASSIGNED';
      job.assignedWorker = application.worker;
      await job.save({ session });
      
      // Reject all other PENDING applications for this job
      await Application.updateMany(
        {
          job: job._id,
          _id: { $ne: application._id },
          status: 'PENDING'
        },
        { status: 'REJECTED' },
        { session }
      );
      
      await session.commitTransaction();
      
      await application.populate('worker', 'name phone');
      
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  };
  ```

- [ ] **Reject application**
  ```javascript
  exports.rejectApplication = async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      const job = await Job.findById(application.job);
      
      // Check if user is the poster
      if (job.poster.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
      
      application.status = 'REJECTED';
      await application.save();
      
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

### 6.3 Create Application Routes

**File**: src/routes/applicationRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    applyJob,
    getApplicationsForJob,
    getMyApplications,
    acceptApplication,
    rejectApplication
  } = require('../controllers/applicationController');
  const { protect } = require('../middlewares/auth');
  
  router.post('/', protect, applyJob);
  router.get('/job/:jobId', protect, getApplicationsForJob);
  router.get('/my', protect, getMyApplications);
  router.put('/:id/accept', protect, acceptApplication);
  router.put('/:id/reject', protect, rejectApplication);
  
  module.exports = router;
  ```

- [ ] Mount in server.js
  ```javascript
  app.use('/api/applications', require('./routes/applicationRoutes'));
  ```

---

## Testing Checklist

### API Testing (Postman)

- [ ] **POST /api/applications** (protected)
  - Success: Apply to OPEN job
  - Error: Cannot apply to own job
  - Error: Cannot apply twice to same job
  - Error: Cannot apply to non-OPEN job
  - Error: Job not found

- [ ] **GET /api/applications/job/:jobId** (protected)
  - Success: Poster sees all applications
  - Error: Non-poster gets 403
  - Filter by status works

- [ ] **GET /api/applications/my** (protected)
  - Returns worker's applications
  - Populates job and poster info
  - Filter by status works
  - Pagination works

- [ ] **PUT /api/applications/:id/accept** (protected)
  - Success: Accept pending application
  - Verify application status = ACCEPTED
  - Verify job status = ASSIGNED
  - Verify job.assignedWorker is set
  - Verify other pending applications = REJECTED
  - Error: Cannot accept if not poster
  - Error: Cannot accept non-pending application
  - Test transaction rollback on error

- [ ] **PUT /api/applications/:id/reject** (protected)
  - Success: Reject pending application
  - Error: Cannot reject if not poster

---

## Deliverable

- ✅ Application model with unique constraint
- ✅ Apply to job endpoint
- ✅ View applications (poster)
- ✅ View my applications (worker)
- ✅ Accept application with transaction
- ✅ Reject application
- ✅ All business rules enforced

**Estimated Time**: 3-4 days

---

# PHASE 7: Application UI & Integration

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 5, Phase 6

## Frontend Tasks

### 7.1 Create Application Service

**File**: src/services/applicationService.js

- [ ] Create API functions
  ```javascript
  import API from './api';
  
  export const applicationService = {
    applyJob: (data) => API.post('/applications', data),
    getApplicationsForJob: (jobId, params) => 
      API.get(`/applications/job/${jobId}`, { params }),
    getMyApplications: (params) => API.get('/applications/my', { params }),
    acceptApplication: (id) => API.put(`/applications/${id}/accept`),
    rejectApplication: (id) => API.put(`/applications/${id}/reject`)
  };
  ```

### 7.2 Update Job Detail Page

**File**: src/pages/JobDetail.jsx

- [ ] Add "Ứng tuyển" button
  - Show if: logged in, not owner, status OPEN, not already applied
  - Opens modal with cover letter textarea
  - Submit calls applyJob API
  - Success: Show "Đã ứng tuyển" badge, disable button

- [ ] Add "Xem ứng viên" button (if owner and has applications)
  - Opens modal or navigates to applications list

- [ ] Check if already applied
  - On page load, call API to check
  - If applied, show badge and disable button

### 7.3 Create Application Modal

**File**: src/components/application/ApplicationModal.jsx & .css

- [ ] Modal with textarea for cover letter
- [ ] Character count (max 500)
- [ ] Submit button
- [ ] Loading state
- [ ] Success/error messages

### 7.4 Create Application Card

**File**: src/components/application/ApplicationCard.jsx & .css

- [ ] Display application info:
  - Worker name, rating, phone
  - Cover letter
  - Status badge
  - Applied date

- [ ] Actions (if poster and status PENDING):
  - "Chấp nhận" button (green)
  - "Từ chối" button (red)

- [ ] Confirmation modal before accept/reject

### 7.5 Create Application List (for Job Poster)

**File**: src/components/application/ApplicationList.jsx & .css

- [ ] List all applications for a job
- [ ] Group by status (tabs):
  - All
  - Pending
  - Accepted
  - Rejected

- [ ] Map to ApplicationCard components
- [ ] Empty state
- [ ] Loading state

### 7.6 Update My Jobs Page

- [ ] Add "Ứng viên" badge showing application count
- [ ] Click to view applications
- [ ] Show ApplicationList component in modal or separate view

### 7.7 Create My Applications Page

**File**: src/pages/MyApplications.jsx & MyApplications.css

- [ ] List all applications by current user
- [ ] Tabs by status:
  - All
  - Pending
  - Accepted
  - Rejected

- [ ] Each application shows:
  - Job title
  - Poster name and rating
  - Application status badge
  - Applied date
  - Cover letter (collapsed)
  - "Xem công việc" button

- [ ] Empty state
- [ ] Loading state
- [ ] Pagination

**Layout**:
```
┌────────────────────────────────────┐
│ Ứng tuyển của tôi                  │
├────────────────────────────────────┤
│ [All] [Pending] [Accepted][Rejected│
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ Job Title                      │ │
│ │ Poster: John (★4.5)            │ │
│ │ Status: PENDING                │ │
│ │ [Xem công việc]                │ │
│ └────────────────────────────────┘ │
├────────────────────────────────────┤
│ Pagination                         │
└────────────────────────────────────┘
```

### 7.8 Update Navbar

- [ ] Add "Ứng tuyển" link → /applications (if logged in)
- [ ] Show notification badge if has pending applications (optional)

---

## Testing Checklist

- [ ] Job detail shows "Ứng tuyển" button correctly
- [ ] Click "Ứng tuyển" opens modal
- [ ] Submit application with cover letter
- [ ] After applying, button disabled and shows "Đã ứng tuyển"
- [ ] Cannot apply to own job (button hidden)
- [ ] Cannot apply to ASSIGNED/COMPLETED jobs
- [ ] My Applications page lists all applications
- [ ] Filter by status works
- [ ] Click "Xem công việc" navigates to job detail
- [ ] Job poster can see "Xem ứng viên" button
- [ ] Click shows list of applications
- [ ] Poster can accept application
- [ ] After accepting, application status updates
- [ ] After accepting, other applications marked rejected
- [ ] After accepting, job status becomes ASSIGNED
- [ ] Poster can reject application
- [ ] Real-time updates after accept/reject (refresh or optimistic update)
- [ ] Responsive design works

---

## Deliverable

- ✅ Complete application flow (apply → view → accept/reject)
- ✅ My Applications dashboard
- ✅ Application management for job posters
- ✅ All application features working end-to-end

**Estimated Time**: 3-4 days

---

# PHASE 8: Review Model & Backend

**Duration**: 2-3 days (10-12 hours)  
**Dependencies**: Phase 6

## Backend Tasks

### 8.1 Create Review Model

**File**: src/models/Review.js

- [ ] Define Review schema
  ```javascript
  const reviewSchema = new mongoose.Schema({
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    reviewerRole: {
      type: String,
      enum: ['poster', 'worker'],
      required: true
    }
  }, {
    timestamps: true
  });
  ```

- [ ] Add compound unique index
  ```javascript
  reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true });
  ```

- [ ] Add other indexes
  ```javascript
  reviewSchema.index({ reviewee: 1, createdAt: -1 });
  reviewSchema.index({ job: 1 });
  reviewSchema.index({ reviewer: 1 });
  ```

### 8.2 Create Review Service

**File**: src/services/reviewService.js

- [ ] Function to update user rating
  ```javascript
  const User = require('../models/User');
  const Review = require('../models/Review');
  
  exports.updateUserRating = async (userId) => {
    try {
      const reviews = await Review.find({ reviewee: userId });
      
      if (reviews.length === 0) {
        await User.findByIdAndUpdate(userId, {
          averageRating: 0,
          totalReviews: 0
        });
        return;
      }
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await User.findByIdAndUpdate(userId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: reviews.length
      });
    } catch (error) {
      console.error('Error updating user rating:', error);
      throw error;
    }
  };
  ```

### 8.3 Create Review Controller

**File**: src/controllers/reviewController.js

- [ ] **Create review**
  ```javascript
  const reviewService = require('../services/reviewService');
  
  exports.createReview = async (req, res) => {
    try {
      const { jobId, rating, comment } = req.body;
      
      // Check if job exists and is COMPLETED
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      if (job.status !== 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'Can only review completed jobs'
        });
      }
      
      // Determine reviewer role and reviewee
      let reviewerRole, reviewee;
      
      if (job.poster.toString() === req.user._id.toString()) {
        // Poster reviewing worker
        reviewerRole = 'poster';
        reviewee = job.assignedWorker;
      } else if (job.assignedWorker?.toString() === req.user._id.toString()) {
        // Worker reviewing poster
        reviewerRole = 'worker';
        reviewee = job.poster;
      } else {
        return res.status(403).json({
          success: false,
          message: 'You did not work on this job'
        });
      }
      
      // Check if already reviewed
      const existingReview = await Review.findOne({
        job: jobId,
        reviewer: req.user._id
      });
      
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this job'
        });
      }
      
      // Create review
      const review = await Review.create({
        job: jobId,
        reviewer: req.user._id,
        reviewee,
        rating,
        comment,
        reviewerRole
      });
      
      // Update reviewee's rating
      await reviewService.updateUserRating(reviewee);
      
      await review.populate('reviewer', 'name');
      await review.populate('reviewee', 'name');
      await review.populate('job', 'title');
      
      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get reviews for a user**
  ```javascript
  exports.getReviewsForUser = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const reviews = await Review.find({ reviewee: req.params.userId })
        .populate('reviewer', 'name')
        .populate('job', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Review.countDocuments({ reviewee: req.params.userId });
      
      res.status(200).json({
        success: true,
        data: reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get reviews for a job**
  ```javascript
  exports.getReviewsForJob = async (req, res) => {
    try {
      const reviews = await Review.find({ job: req.params.jobId })
        .populate('reviewer', 'name')
        .populate('reviewee', 'name')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

### 8.4 Create Review Routes

**File**: src/routes/reviewRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    createReview,
    getReviewsForUser,
    getReviewsForJob
  } = require('../controllers/reviewController');
  const { protect } = require('../middlewares/auth');
  
  router.post('/', protect, createReview);
  router.get('/user/:userId', getReviewsForUser);
  router.get('/job/:jobId', getReviewsForJob);
  
  module.exports = router;
  ```

- [ ] Mount in server.js
  ```javascript
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  ```

---

## Testing Checklist

### API Testing (Postman)

- [ ] **POST /api/reviews** (protected)
  - Success: Poster reviews worker on completed job
  - Success: Worker reviews poster on completed job
  - Verify reviewee's rating is updated
  - Error: Cannot review non-COMPLETED job
  - Error: Cannot review if not part of job
  - Error: Cannot review twice for same job
  - Error: Missing rating or comment
  - Error: Rating out of range (1-5)

- [ ] **GET /api/reviews/user/:userId**
  - Returns all reviews for user
  - Populates reviewer and job info
  - Sorted by most recent
  - Pagination works

- [ ] **GET /api/reviews/job/:jobId**
  - Returns reviews for job (max 2)
  - Shows both poster and worker reviews

- [ ] Check user rating calculation:
  - Create multiple reviews for a user
  - Verify averageRating is correct
  - Verify totalReviews is correct

---

## Deliverable

- ✅ Review model with two-way capability
- ✅ Create review endpoint with validation
- ✅ Auto-update user rating after review
- ✅ Get reviews for user
- ✅ Get reviews for job
- ✅ All business rules enforced

**Estimated Time**: 2-3 days

---

# PHASE 9: Review UI & Integration

**Duration**: 2-3 days (10-12 hours)  
**Dependencies**: Phase 7, Phase 8

## Frontend Tasks

### 9.1 Create Review Service

**File**: src/services/reviewService.js

- [ ] Create API functions
  ```javascript
  import API from './api';
  
  export const reviewService = {
    createReview: (data) => API.post('/reviews', data),
    getReviewsForUser: (userId, params) => 
      API.get(`/reviews/user/${userId}`, { params }),
    getReviewsForJob: (jobId) => API.get(`/reviews/job/${jobId}`)
  };
  ```

### 9.2 Create Rating Component

**File**: src/components/common/Rating.jsx & Rating.css

- [ ] Implement Rating component (from component-implementation-guide.md)
- [ ] Display mode (read-only stars)
- [ ] Interactive mode (clickable stars for input)

### 9.3 Create Review Form Component

**File**: src/components/review/ReviewForm.jsx & .css

- [ ] Rating selector (1-5 stars, interactive)
- [ ] Comment textarea (10-500 chars)
- [ ] Character count
- [ ] Submit button
- [ ] Loading state
- [ ] Success/error messages

### 9.4 Create Review Card Component

**File**: src/components/review/ReviewCard.jsx & .css

- [ ] Display review info:
  - Reviewer name
  - Rating (stars)
  - Comment
  - Date
  - Reviewer role badge ("Job Poster" / "Worker")

### 9.5 Create Review List Component

**File**: src/components/review/ReviewList.jsx & .css

- [ ] Map reviews to ReviewCard components
- [ ] Empty state ("Chưa có đánh giá")
- [ ] Pagination (if needed)

### 9.6 Update Job Detail Page

- [ ] Show "Viết đánh giá" button if:
  - Job is COMPLETED
  - User is poster or assigned worker
  - User hasn't reviewed yet

- [ ] Check if user has already reviewed
  - On page load, fetch reviews for job
  - Check if current user's ID is in reviews

- [ ] Click button opens ReviewForm modal

- [ ] Show reviews section at bottom:
  - Title: "Đánh giá"
  - ReviewList component
  - Max 2 reviews (poster review + worker review)

### 9.7 Create Profile Page

**File**: src/pages/Profile.jsx & Profile.css

- [ ] View own profile or other user's profile
- [ ] Two sections: "As Job Poster" and "As Worker"

**Layout**:
```
┌─────────────────────────────────────┐
│  Avatar  Name              [Edit]   │
│          ★★★★☆ 4.2 (15 reviews)     │
├─────────────────────────────────────┤
│  Email: user@email.com              │
│  Phone: 0123456789                  │
├─────────────────────────────────────┤
│  As Job Poster                      │
│  ┌───────────────────────────────┐  │
│  │ Job Title - COMPLETED         │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  As Worker                          │
│  ┌───────────────────────────────┐  │
│  │ Job Title - COMPLETED         │  │
│  │ Review: ★★★★★ Great work!     │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  All Reviews (15)                   │
│  [ReviewCard]                       │
│  [ReviewCard]                       │
└─────────────────────────────────────┘
```

**Features**:
- [ ] Show user info (name, email, phone, rating, total reviews)
- [ ] "Edit Profile" button (if viewing own profile)
- [ ] Jobs as poster section (list with status)
- [ ] Jobs as worker section (completed jobs only)
- [ ] All reviews received section (ReviewList)
- [ ] Pagination for reviews

### 9.8 Create Edit Profile Page

**File**: src/pages/EditProfile.jsx & EditProfile.css

- [ ] Form with fields:
  - Name (editable)
  - Email (read-only, displayed but disabled)
  - Phone (editable)

- [ ] Validation
- [ ] Submit button
- [ ] Loading state
- [ ] Redirect back to profile after success

### 9.9 Create User Service

**File**: src/services/userService.js

- [ ] Create API functions
  ```javascript
  import API from './api';
  
  export const userService = {
    getUserProfile: (userId) => API.get(`/users/${userId}`),
    updateProfile: (data) => API.put('/users/profile', data)
  };
  ```

### 9.10 Update Backend for User Profile

**File**: src/controllers/userController.js

- [ ] **Get user profile**
  ```javascript
  exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Get jobs as poster
      const jobsAsPoster = await Job.find({ poster: user._id })
        .select('title status createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
      
      // Get jobs as worker
      const jobsAsWorker = await Job.find({ 
        assignedWorker: user._id,
        status: 'COMPLETED'
      })
        .select('title status createdAt')
        .populate('poster', 'name')
        .sort({ createdAt: -1 })
        .limit(10);
      
      // Get reviews
      const reviews = await Review.find({ reviewee: user._id })
        .populate('reviewer', 'name')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .limit(20);
      
      res.status(200).json({
        success: true,
        data: {
          user,
          jobsAsPoster,
          jobsAsWorker,
          reviews
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Update profile**
  ```javascript
  exports.updateProfile = async (req, res) => {
    try {
      const { name, phone } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone },
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

**File**: src/routes/userRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const { getUserProfile, updateProfile } = require('../controllers/userController');
  const { protect } = require('../middlewares/auth');
  
  router.get('/:id', getUserProfile);
  router.put('/profile', protect, updateProfile);
  
  module.exports = router;
  ```

- [ ] Mount in server.js
  ```javascript
  app.use('/api/users', require('./routes/userRoutes'));
  ```

---

## Testing Checklist

- [ ] Job detail shows "Viết đánh giá" button for completed jobs
- [ ] Poster can write review for worker
- [ ] Worker can write review for poster
- [ ] Rating selector works (clickable stars)
- [ ] After submitting review, it appears in job detail
- [ ] After submitting review, button disabled or shows "Đã đánh giá"
- [ ] Cannot review twice for same job
- [ ] Reviews appear in job detail page
- [ ] Profile page displays correctly
- [ ] View own profile works
- [ ] View other user's profile works
- [ ] Jobs as poster section shows all posted jobs
- [ ] Jobs as worker section shows completed jobs
- [ ] All reviews section displays all reviews
- [ ] Edit profile form pre-fills data
- [ ] Edit profile saves changes
- [ ] Email cannot be edited (field disabled)
- [ ] User rating updates after receiving new review
- [ ] Responsive design works

---

## Deliverable

- ✅ Complete review flow (write review → appears on profile)
- ✅ Two-way reviews working
- ✅ User profiles with ratings and history
- ✅ Edit profile functionality
- ✅ All review features working end-to-end

**Estimated Time**: 2-3 days

---

# PHASE 10: Admin Dashboard

**Duration**: 2-3 days (10-12 hours)  
**Dependencies**: Phase 9

## Backend Tasks

### 10.1 Create Admin Controller

**File**: src/controllers/adminController.js

- [ ] **Get all users**
  ```javascript
  exports.getAllUsers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      
      const query = {};
      
      if (req.query.role) {
        query.role = req.query.role;
      }
      
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await User.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get all jobs (admin)**
  ```javascript
  exports.getAllJobsAdmin = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      
      const query = {};
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      const jobs = await Job.find(query)
        .populate('poster', 'name email')
        .populate('assignedWorker', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Job.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

- [ ] **Get statistics**
  ```javascript
  exports.getStatistics = async (req, res) => {
    try {
      // Count users by role
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalAdmins = await User.countDocuments({ role: 'admin' });
      
      // Count jobs by status
      const totalJobs = await Job.countDocuments();
      const openJobs = await Job.countDocuments({ status: 'OPEN' });
      const assignedJobs = await Job.countDocuments({ status: 'ASSIGNED' });
      const completedJobs = await Job.countDocuments({ status: 'COMPLETED' });
      const cancelledJobs = await Job.countDocuments({ status: 'CANCELLED' });
      
      // Count applications
      const totalApplications = await Application.countDocuments();
      const pendingApplications = await Application.countDocuments({ status: 'PENDING' });
      const acceptedApplications = await Application.countDocuments({ status: 'ACCEPTED' });
      const rejectedApplications = await Application.countDocuments({ status: 'REJECTED' });
      
      // Count reviews
      const totalReviews = await Review.countDocuments();
      
      res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            admins: totalAdmins
          },
          jobs: {
            total: totalJobs,
            open: openJobs,
            assigned: assignedJobs,
            completed: completedJobs,
            cancelled: cancelledJobs
          },
          applications: {
            total: totalApplications,
            pending: pendingApplications,
            accepted: acceptedApplications,
            rejected: rejectedApplications
          },
          reviews: {
            total: totalReviews
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  ```

### 10.2 Create Admin Routes

**File**: src/routes/adminRoutes.js

- [ ] Define routes
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    getAllUsers,
    getAllJobsAdmin,
    getStatistics
  } = require('../controllers/adminController');
  const { protect, authorize } = require('../middlewares/auth');
  
  // All admin routes require authentication and admin role
  router.use(protect, authorize('admin'));
  
  router.get('/users', getAllUsers);
  router.get('/jobs', getAllJobsAdmin);
  router.get('/statistics', getStatistics);
  
  module.exports = router;
  ```

- [ ] Mount in server.js
  ```javascript
  app.use('/api/admin', require('./routes/adminRoutes'));
  ```

---

## Frontend Tasks

### 10.3 Create Admin Service

**File**: src/services/adminService.js

- [ ] Create API functions
  ```javascript
  import API from './api';
  
  export const adminService = {
    getAllUsers: (params) => API.get('/admin/users', { params }),
    getAllJobs: (params) => API.get('/admin/jobs', { params }),
    getStatistics: () => API.get('/admin/statistics')
  };
  ```

### 10.4 Create Admin Layout

**File**: src/components/layout/AdminLayout.jsx & .css

- [ ] Sidebar with navigation:
  - Dashboard
  - Users
  - Jobs

- [ ] Check if user is admin
  - If not, redirect to home

- [ ] Header with "Admin Panel" title

### 10.5 Create Admin Dashboard Page

**File**: src/pages/admin/Dashboard.jsx & Dashboard.css

- [ ] Fetch statistics on mount
- [ ] Display stats in cards:
  - **Users Card**: Total users, admins
  - **Jobs Card**: Total, by status (OPEN, ASSIGNED, COMPLETED, CANCELLED)
  - **Applications Card**: Total, by status
  - **Reviews Card**: Total reviews

**Layout**:
```
┌──────────────────────────────────────┐
│  Admin Dashboard                     │
├──────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Users  │ │ Jobs   │ │ Reviews│  │
│  │  120   │ │  450   │ │  230   │  │
│  └────────┘ └────────┘ └────────┘  │
├──────────────────────────────────────┤
│  Jobs by Status                      │
│  ┌─────────────────────────────────┐│
│  │ OPEN: 50 | ASSIGNED: 30         ││
│  │ COMPLETED: 300 | CANCELLED: 70  ││
│  └─────────────────────────────────┘│
└──────────────────────────────────────┘
```

### 10.6 Create Admin Users Page

**File**: src/pages/admin/Users.jsx & Users.css

- [ ] Table with columns:
  - Name
  - Email
  - Role
  - Rating
  - Total Reviews
  - Joined Date
  - Actions (View Profile)

- [ ] Filter by role dropdown
- [ ] Pagination
- [ ] Loading state
- [ ] Empty state

### 10.7 Create Admin Jobs Page

**File**: src/pages/admin/Jobs.jsx & Jobs.css

- [ ] Table with columns:
  - Title
  - Category
  - Poster (name)
  - Status
  - Salary
  - Created Date
  - Actions (View Detail)

- [ ] Filter by status dropdown
- [ ] Pagination
- [ ] Loading state
- [ ] Empty state

### 10.8 Update Routes

**File**: src/App.js

- [ ] Add admin routes
  ```javascript
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute adminOnly>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="jobs" element={<AdminJobs />} />
  </Route>
  ```

### 10.9 Update Navbar

- [ ] Show "Admin" link if user is admin

---

## Testing Checklist

### Backend Testing

- [ ] GET /api/admin/statistics (admin only)
  - Success with admin token
  - Error 403 with user token
  - Returns correct counts

- [ ] GET /api/admin/users (admin only)
  - Returns paginated users
  - Filter by role works
  - Error 403 for non-admin

- [ ] GET /api/admin/jobs (admin only)
  - Returns paginated jobs
  - Filter by status works
  - Populates poster and worker info
  - Error 403 for non-admin

### Frontend Testing

- [ ] Non-admin cannot access /admin routes (redirected)
- [ ] Admin can access admin dashboard
- [ ] Dashboard displays statistics correctly
- [ ] Admin users page shows user list
- [ ] Filter by role works
- [ ] Pagination works
- [ ] Click "View Profile" navigates to user profile
- [ ] Admin jobs page shows job list
- [ ] Filter by status works
- [ ] Pagination works
- [ ] Click "View Detail" navigates to job detail
- [ ] Responsive design works

---

## Deliverable

- ✅ Admin dashboard with statistics
- ✅ Admin can view all users
- ✅ Admin can view all jobs
- ✅ Read-only admin panel (no moderation actions)
- ✅ All admin features working

**Estimated Time**: 2-3 days

---

# PHASE 11: UI/UX Polish & Error Handling

**Duration**: 3-4 days (12-15 hours)  
**Dependencies**: Phase 10

## Frontend Tasks

### 11.1 Loading States

- [ ] Create Spinner component
  ```javascript
  // src/components/common/Spinner.jsx
  const Spinner = ({ size = 'md' }) => (
    <div className={`spinner spinner-${size}`}></div>
  );
  ```

- [ ] Create Skeleton Loader component
  ```javascript
  // src/components/common/Skeleton.jsx
  const Skeleton = ({ height, width, count = 1 }) => (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width }}></div>
      ))}
    </>
  );
  ```

- [ ] Add loading states to all pages:
  - Show spinner while fetching data
  - Show skeleton loaders for lists
  - Disable buttons during submission

### 11.2 Error Handling

- [ ] Create Toast/Notification component
  ```javascript
  // src/components/common/Toast.jsx
  const Toast = ({ message, type = 'info', onClose }) => (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
  ```

- [ ] Create Toast context
  ```javascript
  // src/context/ToastContext.js
  const ToastContext = createContext();
  
  export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    
    const showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
    
    return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </ToastContext.Provider>
    );
  };
  ```

- [ ] Add error boundaries
  ```javascript
  // src/components/common/ErrorBoundary.jsx
  class ErrorBoundary extends React.Component {
    state = { hasError: false };
    
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong.</div>;
      }
      return this.props.children;
    }
  }
  ```

- [ ] Add try-catch to all API calls
- [ ] Show user-friendly error messages
- [ ] Log errors to console in development

### 11.3 Empty States

- [ ] Create EmptyState component
  ```javascript
  // src/components/common/EmptyState.jsx
  const EmptyState = ({ icon, title, message, action }) => (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
  ```

- [ ] Add empty states to:
  - Job list (no jobs found)
  - My jobs (no jobs posted yet)
  - My applications (no applications yet)
  - Reviews (no reviews yet)
  - Admin tables (no data)

### 11.4 Confirmation Modals

- [ ] Create Confirm component
  ```javascript
  // src/components/common/Confirm.jsx
  const Confirm = ({ isOpen, onClose, onConfirm, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button variant="danger" onClick={onConfirm}>Xác nhận</Button>
      </div>
    </Modal>
  );
  ```

- [ ] Add confirmations for:
  - Delete job
  - Accept application
  - Reject application
  - Mark job as complete

### 11.5 Form Validation

- [ ] Add client-side validation to all forms:
  - Register: email format, password length, required fields
  - Login: required fields
  - Create/Edit Job: required fields, min/max lengths, salary > 0
  - Apply Job: cover letter length
  - Review: rating required, comment length

- [ ] Show validation errors inline
- [ ] Disable submit button if form invalid

### 11.6 Responsive Design

- [ ] Test all pages on:
  - Mobile (320px - 480px)
  - Tablet (768px - 1024px)
  - Desktop (1280px+)

- [ ] Make necessary adjustments:
  - Stack columns on mobile
  - Adjust font sizes
  - Make tables scrollable or use cards
  - Collapsible sidebar/menu on mobile

- [ ] Add hamburger menu for mobile navbar

### 11.7 Accessibility

- [ ] Add ARIA labels to buttons and links
- [ ] Ensure all interactive elements are keyboard accessible
- [ ] Add focus states to all inputs and buttons
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add alt text to images (if any)

### 11.8 Performance

- [ ] Lazy load routes
  ```javascript
  const JobList = lazy(() => import('./pages/JobList'));
  ```

- [ ] Optimize images (if any)
- [ ] Add React.memo to expensive components
- [ ] Debounce search inputs
- [ ] Add pagination to long lists

### 11.9 Final Touches

- [ ] Add favicon
- [ ] Update page titles
  ```javascript
  useEffect(() => {
    document.title = 'JobConnect - Find Jobs';
  }, []);
  ```

- [ ] Add meta tags for SEO (optional)
- [ ] Create 404 page
- [ ] Add footer with links
- [ ] Add breadcrumbs to detail pages

---

## Testing Checklist

- [ ] All loading states show correctly
- [ ] All error states show user-friendly messages
- [ ] Toast notifications appear and disappear
- [ ] Empty states display when no data
- [ ] Confirmation modals work before destructive actions
- [ ] All forms validate correctly
- [ ] Cannot submit invalid forms
- [ ] All pages responsive on mobile, tablet, desktop
- [ ] Navbar hamburger menu works on mobile
- [ ] All buttons and links keyboard accessible
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Page titles update correctly
- [ ] 404 page shows for invalid routes
- [ ] No console errors

---

## Deliverable

- ✅ Professional loading and error states
- ✅ User-friendly error messages
- ✅ Empty states everywhere
- ✅ Confirmation modals for important actions
- ✅ Responsive design working
- ✅ Accessible interface
- ✅ Optimized performance
- ✅ Polished, production-ready UI

**Estimated Time**: 3-4 days

---

# PHASE 12: Testing, Bug Fixes & Documentation

**Duration**: 4-5 days (15-20 hours)  
**Dependencies**: Phase 11

## Testing Tasks

### 12.1 End-to-End Testing

**Complete User Journey 1: Job Seeker**
- [ ] Register as new user
- [ ] Browse jobs
- [ ] Filter by category
- [ ] View job detail
- [ ] Apply to job with cover letter
- [ ] View my applications
- [ ] Wait for acceptance (test with another user)
- [ ] View completed job
- [ ] Write review for poster
- [ ] View own profile
- [ ] Edit profile

**Complete User Journey 2: Job Poster**
- [ ] Register as new user
- [ ] Create job posting
- [ ] View my jobs
- [ ] Edit job
- [ ] View applications for job
- [ ] Accept one application
- [ ] Verify other applications rejected
- [ ] Mark job as complete
- [ ] Write review for worker
- [ ] View own profile

**Complete User Journey 3: Dual Role**
- [ ] Register as new user
- [ ] Post a job
- [ ] Apply to someone else's job
- [ ] Get accepted
- [ ] Complete the job (as worker)
- [ ] Review the poster
- [ ] Accept application on own job (as poster)
- [ ] Complete own job
- [ ] Review the worker
- [ ] View profile showing both roles

**Admin Journey**
- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] Browse all users
- [ ] Browse all jobs
- [ ] Filter users by role
- [ ] Filter jobs by status
- [ ] View user profile
- [ ] View job detail

### 12.2 Edge Cases & Error Testing

- [ ] Try to apply to own job (should fail)
- [ ] Try to apply twice to same job (should fail)
- [ ] Try to accept application when job is ASSIGNED (should fail)
- [ ] Try to review without completing job (should fail)
- [ ] Try to review twice (should fail)
- [ ] Try to edit other user's job (should fail)
- [ ] Try to access admin routes as user (should redirect)
- [ ] Try to access protected routes without login (should redirect)
- [ ] Test with very long text inputs
- [ ] Test with special characters
- [ ] Test with SQL injection attempts (should be safe)
- [ ] Test pagination edge cases (page 0, page 9999)
- [ ] Test with invalid IDs
- [ ] Test network errors (simulate offline)

### 12.3 Browser Testing

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)

### 12.4 Performance Testing

- [ ] Test with 100+ jobs
- [ ] Test with 50+ applications
- [ ] Test with slow network (throttle to 3G)
- [ ] Check for memory leaks (open dev tools memory tab)
- [ ] Check bundle size
- [ ] Lighthouse audit (aim for 80+ score)

### 12.5 Security Testing

- [ ] Verify JWT tokens expire correctly
- [ ] Verify passwords are hashed in database
- [ ] Verify passwords never returned in responses
- [ ] Verify authorization checks work (cannot edit other's data)
- [ ] Verify SQL injection protection
- [ ] Verify XSS protection
- [ ] Check for exposed API keys (should be in .env)

---

## Bug Fix Tasks

### 12.6 Fix All Bugs Found

- [ ] Create list of all bugs found during testing
- [ ] Prioritize: Critical → High → Medium → Low
- [ ] Fix critical bugs first
- [ ] Fix high priority bugs
- [ ] Fix medium priority bugs (if time permits)
- [ ] Document low priority bugs for future

### 12.7 Code Review & Cleanup

- [ ] Remove console.logs
- [ ] Remove commented code
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Consistent code style
- [ ] Add comments for complex logic
- [ ] Refactor duplicate code
- [ ] Check for TODO comments and resolve

---

## Documentation Tasks

### 12.8 README Files

**Backend README** (backend/README.md)
- [ ] Project description
- [ ] Tech stack
- [ ] Prerequisites
- [ ] Installation steps
- [ ] Environment variables
- [ ] Running the server
- [ ] API endpoints overview
- [ ] Database schema link

**Frontend README** (frontend/README.md)
- [ ] Project description
- [ ] Tech stack
- [ ] Prerequisites
- [ ] Installation steps
- [ ] Environment variables
- [ ] Running the app
- [ ] Available scripts
- [ ] Folder structure

**Main README** (root/README.md)
- [ ] Project overview
- [ ] Features list
- [ ] Tech stack
- [ ] Project structure
- [ ] Setup instructions (both backend + frontend)
- [ ] Screenshots (optional)
- [ ] Demo video link (optional)
- [ ] License

### 12.9 API Documentation

**File**: API.md

- [ ] Document all endpoints:
  - Method and path
  - Authentication required?
  - Request body/params
  - Response format
  - Error codes
  - Example requests/responses

**Structure**:
```markdown
# JobConnect API Documentation

## Authentication

### Register
POST /api/auth/register
Body: { email, password, name, phone }
Response: { success, data: { user, token } }

### Login
POST /api/auth/login
Body: { email, password }
Response: { success, data: { user, token } }

...
```

### 12.10 Database Documentation

**Already done in database-schema.md**, but verify:
- [ ] All collections documented
- [ ] All fields documented
- [ ] All indexes documented
- [ ] All relationships documented
- [ ] Sample queries included

### 12.11 User Guide (Optional)

**File**: USER_GUIDE.md

- [ ] How to register
- [ ] How to post a job
- [ ] How to apply for a job
- [ ] How to manage applications
- [ ] How to write reviews
- [ ] How to view profile
- [ ] FAQ section

---

## Deployment Preparation (Optional for MVP)

### 12.12 Deployment Checklist

If deploying:

**Backend**
- [ ] Create production .env
- [ ] Setup MongoDB Atlas
- [ ] Deploy to Heroku/Railway/Render
- [ ] Test production API endpoints
- [ ] Setup CORS for production frontend URL

**Frontend**
- [ ] Update API base URL for production
- [ ] Build production bundle
- [ ] Deploy to Vercel/Netlify
- [ ] Test production app
- [ ] Verify all features work in production

---

## Demo Preparation

### 12.13 Demo Data

- [ ] Create 5-10 sample users
  - Mix of users with and without jobs
  - Users with different ratings
  - At least 1 admin user

- [ ] Create 20-30 sample jobs
  - Various categories
  - Various statuses (OPEN, ASSIGNED, COMPLETED)
  - Different salary ranges

- [ ] Create sample applications
  - Some pending, some accepted, some rejected

- [ ] Create sample reviews
  - Various ratings (1-5 stars)
  - Different comment lengths

### 12.14 Demo Script

**Create demo walkthrough** (5-10 minutes):

1. **Landing Page** (30 sec)
   - Show hero section
   - Show categories
   - Show recent jobs

2. **Job Browsing** (1 min)
   - Browse all jobs
   - Filter by category
   - View job detail

3. **Apply Flow** (1 min)
   - Login as worker
   - Apply to job with cover letter
   - Show "Applied" state

4. **Poster Flow** (2 min)
   - Login as poster
   - Create new job
   - View applications
   - Accept application
   - Show job status changed

5. **Complete & Review** (2 min)
   - Mark job as complete
   - Write review (both ways)
   - Show reviews on profile

6. **Profile** (1 min)
   - View public profile
   - Show rating and reviews
   - Show jobs as poster and worker

7. **Admin Dashboard** (1 min)
   - Login as admin
   - Show statistics
   - Browse users and jobs

### 12.15 Presentation Slides (Optional)

- [ ] Slide 1: Title & Team
- [ ] Slide 2: Problem Statement
- [ ] Slide 3: Solution Overview
- [ ] Slide 4: Features List
- [ ] Slide 5: Tech Stack
- [ ] Slide 6: System Architecture
- [ ] Slide 7: Database Schema
- [ ] Slide 8: Demo (live)
- [ ] Slide 9: Challenges & Solutions
- [ ] Slide 10: Future Improvements
- [ ] Slide 11: Q&A

---

## Testing Checklist Summary

### Critical Functionality
- [ ] Authentication (register, login, logout)
- [ ] Job CRUD
- [ ] Application flow (apply, accept, reject)
- [ ] Review system (two-way)
- [ ] Profile viewing and editing
- [ ] Admin dashboard

### Security
- [ ] Authorization checks
- [ ] Password hashing
- [ ] JWT security
- [ ] Input validation

### UX
- [ ] Loading states
- [ ] Error messages
- [ ] Empty states
- [ ] Responsive design
- [ ] Accessibility

### Performance
- [ ] Fast page loads
- [ ] Smooth interactions
- [ ] No memory leaks
- [ ] Efficient queries

---

## Deliverable

- ✅ All features tested and working
- ✅ All bugs fixed
- ✅ Code cleaned up
- ✅ Documentation complete
- ✅ Demo data prepared
- ✅ Demo script ready
- ✅ Production-ready application

**Estimated Time**: 4-5 days

---

# Project Timeline Summary

| Phase | Description | Duration | Cumulative |
|-------|-------------|----------|------------|
| 1 | Project Setup | 2-3 days | 2-3 days |
| 2 | Auth Backend | 3-4 days | 5-7 days |
| 3 | Auth Frontend | 3-4 days | 8-11 days |
| 4 | Job Backend | 3-4 days | 11-15 days |
| 5 | Job Frontend | 4-5 days | 15-20 days |
| 6 | Application Backend | 3-4 days | 18-24 days |
| 7 | Application Frontend | 3-4 days | 21-28 days |
| 8 | Review Backend | 2-3 days | 23-31 days |
| 9 | Review Frontend | 2-3 days | 25-34 days |
| 10 | Admin Dashboard | 2-3 days | 27-37 days |
| 11 | UI/UX Polish | 3-4 days | 30-41 days |
| 12 | Testing & Docs | 4-5 days | 34-46 days |

**Total: 34-46 days (6-7 weeks)**

---

# Progress Tracking

Use this checklist to track your progress:

## Week 1
- [ ] Phase 1 complete
- [ ] Phase 2 complete

## Week 2
- [ ] Phase 3 complete
- [ ] Phase 4 complete

## Week 3
- [ ] Phase 5 complete
- [ ] Phase 6 complete

## Week 4
- [ ] Phase 7 complete
- [ ] Phase 8 complete
- [ ] Phase 9 complete

## Week 5
- [ ] Phase 10 complete
- [ ] Phase 11 complete

## Week 6-7
- [ ] Phase 12 complete
- [ ] Project ready for demo

---

# Tips for Success

1. **Follow phases in order** - Don't skip ahead, each phase builds on previous
2. **Test after each phase** - Don't accumulate bugs
3. **Commit frequently** - Good git history helps debugging
4. **Use the checklist** - Check off tasks as you complete them
5. **Ask for help** - When stuck for >30 minutes, seek help
6. **Take breaks** - Avoid burnout, take regular breaks
7. **Document as you go** - Don't leave documentation to the end

Good luck! 🚀
