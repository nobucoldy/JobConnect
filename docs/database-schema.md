# JobConnect - Database Schema

## Collections Overview
- users
- jobs
- applications
- reviews

---

## 1. users Collection

### Fields

```javascript
{
  _id: ObjectId,
  email: String,           // unique, required
  password: String,        // hashed with bcrypt, required
  name: String,            // required
  phone: String,           // required
  role: String,            // enum: ['user', 'admin'], default: 'user'
  
  // Rating aggregation
  averageRating: Number,   // calculated average, default: 0
  totalReviews: Number,    // count of reviews received, default: 0
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ email: 1 }              // unique index
{ role: 1 }               // for admin queries
{ averageRating: -1 }     // for sorting by rating
```

### Validation Rules
- email: valid email format, unique
- password: min 6 characters (hashed before save)
- name: min 2 characters, max 50 characters
- phone: min 10 characters, max 15 characters
- role: must be 'user' or 'admin'
- averageRating: 0-5 range
- totalReviews: >= 0

### Notes
- Password MUST be hashed with bcrypt (salt rounds: 10)
- averageRating and totalReviews auto-updated when reviews are created
- Soft delete không cần trong MVP (hard delete)

---

## 2. jobs Collection

### Fields

```javascript
{
  _id: ObjectId,
  title: String,              // required
  description: String,        // required
  category: String,           // required, enum
  location: String,           // required
  salary: Number,             // required, in VND
  
  // Relationships
  poster: ObjectId,           // ref: 'User', required
  assignedWorker: ObjectId,   // ref: 'User', nullable
  
  // Status
  status: String,             // enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED']
  
  // Dates
  startDate: Date,            // optional
  endDate: Date,              // optional
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Enums

**category:**
- 'Delivery'
- 'Cleaning'
- 'Tutoring'
- 'Tech Support'
- 'Other'

**status:**
- 'OPEN' - mới tạo, chấp nhận applications
- 'ASSIGNED' - đã chọn worker
- 'COMPLETED' - hoàn thành
- 'CANCELLED' - hủy bỏ

### Indexes
```javascript
{ poster: 1 }                    // query jobs by poster
{ assignedWorker: 1 }            // query jobs by worker
{ status: 1 }                    // filter by status
{ category: 1 }                  // filter by category
{ status: 1, createdAt: -1 }     // list open jobs (most recent first)
{ poster: 1, status: 1 }         // poster's jobs by status
```

### Validation Rules
- title: min 5 characters, max 100 characters
- description: min 20 characters, max 1000 characters
- category: must be one of enum values
- location: min 5 characters, max 200 characters
- salary: must be positive number, min 10000 (10k VND)
- poster: must reference existing user
- assignedWorker: must reference existing user (if set)
- status: must be one of enum values
- startDate: cannot be in the past (if provided)
- endDate: must be after startDate (if both provided)

### Business Logic
- Default status: 'OPEN'
- When application is accepted:
  - job.status → 'ASSIGNED'
  - job.assignedWorker → accepted applicant
- Only OPEN jobs can receive applications
- Only poster can update job
- COMPLETED/CANCELLED jobs cannot be edited

---

## 3. applications Collection

### Fields

```javascript
{
  _id: ObjectId,
  
  // Relationships
  job: ObjectId,              // ref: 'Job', required
  worker: ObjectId,           // ref: 'User', required
  
  // Application details
  coverLetter: String,        // optional message from worker
  status: String,             // enum: ['PENDING', 'ACCEPTED', 'REJECTED']
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Enums

**status:**
- 'PENDING' - vừa apply, chờ poster review
- 'ACCEPTED' - poster chấp nhận
- 'REJECTED' - poster từ chối

### Indexes
```javascript
{ job: 1, worker: 1 }         // unique compound index (prevent duplicate application)
{ job: 1 }                    // query applications by job
{ worker: 1 }                 // query applications by worker
{ status: 1 }                 // filter by status
{ job: 1, status: 1 }         // job's pending applications
```

### Validation Rules
- job: must reference existing job
- worker: must reference existing user
- coverLetter: max 500 characters (optional)
- status: must be one of enum values
- Unique constraint: one worker can only apply once to same job

### Business Logic
- Default status: 'PENDING'
- Worker cannot apply to own job
- Worker cannot apply twice to same job
- Worker cannot apply if job.status != 'OPEN'
- When accepted:
  - application.status → 'ACCEPTED'
  - job.status → 'ASSIGNED'
  - job.assignedWorker → worker
  - All other PENDING applications for same job → 'REJECTED'
  - **MUST use MongoDB Transaction** for these operations

---

## 4. reviews Collection

### Fields

```javascript
{
  _id: ObjectId,
  
  // Relationships
  job: ObjectId,              // ref: 'Job', required (must be COMPLETED)
  reviewer: ObjectId,         // ref: 'User', required (người đánh giá)
  reviewee: ObjectId,         // ref: 'User', required (người được đánh giá)
  
  // Review content
  rating: Number,             // required, 1-5
  comment: String,            // required
  reviewerRole: String,       // enum: ['poster', 'worker'], required
  
  // Timestamps
  createdAt: Date
}
```

### Enums

**reviewerRole:**
- 'poster' - review từ job poster về worker
- 'worker' - review từ worker về poster

### Indexes
```javascript
{ job: 1, reviewer: 1 }            // unique compound (prevent duplicate review)
{ reviewee: 1, createdAt: -1 }     // get reviews for a user
{ job: 1 }                         // get reviews for a job
{ reviewer: 1 }                    // get reviews by reviewer
```

### Validation Rules
- job: must reference existing COMPLETED job
- reviewer: must reference existing user
- reviewee: must reference existing user
- rating: integer between 1-5
- comment: min 10 characters, max 500 characters
- reviewerRole: must be 'poster' or 'worker'
- Unique constraint: one reviewer can only review once per job
- Business validation: reviewer and reviewee must have worked together on this job

### Business Logic
- Can only review after job.status = 'COMPLETED'
- Poster can review assignedWorker
- Worker can review poster
- Each completed job can have max 2 reviews (one from each party)
- After creating review:
  - Recalculate reviewee's averageRating
  - Increment reviewee's totalReviews

### Review Calculation
```javascript
// When new review is created for reviewee
averageRating = (sum of all ratings for reviewee) / (total reviews for reviewee)
totalReviews = count of all reviews for reviewee
```

---

## Relationships Diagram

```
User (1) ----< (many) Job [as poster]
User (1) ----< (many) Job [as assignedWorker]
User (1) ----< (many) Application [as worker]
User (1) ----< (many) Review [as reviewer]
User (1) ----< (many) Review [as reviewee]

Job (1) ----< (many) Application
Job (1) ----< (0-2) Review

Application (many) >---- (1) Job
Application (many) >---- (1) User [as worker]

Review (many) >---- (1) Job
Review (many) >---- (1) User [as reviewer]
Review (many) >---- (1) User [as reviewee]
```

---

## Data Integrity Rules

### Critical Constraints

1. **Application uniqueness**: (job, worker) compound unique index
2. **Review uniqueness**: (job, reviewer) compound unique index
3. **Transaction required**: Accept application operation
4. **Cascade considerations**: 
   - Delete job → should handle existing applications (recommend soft delete or status update)
   - Delete user → complex, recommend account deactivation instead

### Referential Integrity

- All ObjectId references must point to existing documents
- Use Mongoose `ref` and `.populate()` for relationships
- Consider using Mongoose middleware for:
  - Updating user rating when review is created
  - Validating business rules before save

---

## Sample Data Size Estimates

For MVP testing:
- Users: 20-30 accounts
- Jobs: 50-100 jobs
- Applications: 100-200 applications
- Reviews: 30-50 reviews

---

## Mongoose Schema Tips

### Virtual fields to consider:
```javascript
// User schema
userSchema.virtual('jobsAsWorker', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'assignedWorker'
});

userSchema.virtual('jobsAsPoster', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'poster'
});

userSchema.virtual('reviewsReceived', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewee'
});

// Job schema
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job'
});

jobSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'job'
});
```

### Pre-save hooks to consider:
```javascript
// Hash password before save
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Validate dates before save
jobSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    next(new Error('endDate must be after startDate'));
  }
  next();
});
```

---

## Pagination Strategy

For list endpoints, use:
- Default page size: 10 items
- Max page size: 50 items
- Query params: `?page=1&limit=10`
- Return metadata: `{ data: [], total: 100, page: 1, totalPages: 10 }`

---

## Performance Considerations

1. **Indexes**: Create all indexes listed above
2. **Pagination**: Always paginate list queries
3. **Populate**: Be selective with `.populate()` - only load needed fields
4. **Aggregation**: Use for complex queries (e.g., rating calculation)
5. **Caching**: Not needed for MVP, consider for future

---

## Security Considerations

1. **Password**: NEVER return password in API responses
   ```javascript
   userSchema.methods.toJSON = function() {
     const user = this.toObject();
     delete user.password;
     return user;
   };
   ```

2. **Validation**: Always validate on backend, never trust client
3. **Authorization**: Check ownership before allowing updates/deletes
4. **Rate limiting**: Consider for production (not MVP)
