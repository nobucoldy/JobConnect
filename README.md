# JobConnect

A platform for posting and finding short-term jobs. Connect job posters with workers for tasks like delivery, cleaning, tutoring, tech support, and more.

## Features

### Core Features (MVP)
- ✅ User authentication (register, login, JWT)
- ✅ Job posting and management
- ✅ Job browsing and filtering
- ✅ Application system
- ✅ Two-way review system
- ✅ User profiles with ratings
- ✅ Admin dashboard

### Job Poster Features
- Post job listings with details (title, description, category, location, salary)
- View applications from workers
- Accept/reject applications
- Mark jobs as complete
- Review workers after job completion

### Worker Features
- Browse available jobs
- Filter by category, location
- Apply to jobs with cover letter
- View application status
- Review job posters after completion

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React (v19)
- React Router DOM
- Axios
- React Icons

## Project Structure

```
JobConnect/
├── backend/          # Backend API
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   └── server.js
├── frontend/         # Frontend React app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── styles/
├── docs/            # Documentation
│   ├── database-schema.md
│   ├── design-specification.md
│   └── feature_work.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd JobConnect
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```


## Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## API Documentation

API documentation will be available at `/api/docs` after Phase 2 implementation.

## License

MIT

## Contributors

[Your name/team]
