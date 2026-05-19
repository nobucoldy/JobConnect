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

## Development Phases

### ✅ Phase 1: Project Setup (COMPLETED)
- Backend structure with Express, MongoDB connection
- Frontend structure with React Router
- Design system setup
- Basic routing

### 🔄 Phase 2: Authentication (NEXT)
- User model and authentication APIs
- Register and login pages
- JWT middleware
- Auth context

### ⏳ Phase 3: Job Management
- Job model and CRUD APIs
- Job posting and editing UI
- Job listing and detail pages

### ⏳ Phase 4: Application System
- Application model and APIs
- Apply to jobs
- Manage applications

### ⏳ Phase 5: Review System
- Review model and APIs
- Two-way review UI
- User ratings

### ⏳ Phase 6: Admin Dashboard
- Admin routes
- Statistics dashboard
- User and job management

## Documentation

- [Database Schema](docs/database-schema.md) - MongoDB collections and relationships
- [Design Specification](docs/design-specification.md) - UI/UX design system
- [Feature Work Breakdown](docs/feature_work.md) - Detailed implementation guide

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
