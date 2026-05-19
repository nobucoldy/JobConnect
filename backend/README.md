# JobConnect Backend

Backend API for JobConnect - a platform for short-term job posting and worker hiring.

## Tech Stack

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running locally or update MONGODB_URI for Atlas

## Running the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── models/         # Mongoose models
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── config/         # Configuration files
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json
```

## API Endpoints (Coming Soon)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (protected)
- ... (more endpoints to be added)

## Current Status

✅ Phase 1 Complete: Project setup, database connection, error handling
⏳ Phase 2: Authentication system
⏳ Phase 3: Job management
