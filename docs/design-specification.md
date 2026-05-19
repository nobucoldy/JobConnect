# JobConnect - Design Specification

Based on sample_frontend designs (JobConnect style)

---

## Design System Overview

### Visual Style
- **Modern & Clean**: Minimalist, spacious layouts
- **Professional**: Business-friendly color palette
- **Friendly**: Rounded corners, soft shadows
- **3D Illustrations**: Modern isometric/3D graphics for hero sections

---

## Color Palette

### Primary Colors
```css
--primary-blue: #0066FF;        /* Main CTA buttons, links, active states */
--primary-blue-dark: #0052CC;   /* Hover states */
--primary-blue-light: #E6F2FF;  /* Light backgrounds, badges */
```

### Neutral Colors
```css
--white: #FFFFFF;
--gray-50: #F8F9FA;             /* Page background */
--gray-100: #F1F3F5;            /* Card backgrounds, input backgrounds */
--gray-200: #E9ECEF;            /* Borders, dividers */
--gray-300: #DEE2E6;            /* Disabled states */
--gray-500: #ADB5BD;            /* Secondary text, placeholders */
--gray-700: #495057;            /* Body text */
--gray-900: #212529;            /* Headings */
```

### Semantic Colors
```css
--success: #28A745;             /* Success messages, completed status */
--warning: #FFC107;             /* Warning messages, pending status */
--danger: #DC3545;              /* Error messages, rejected status */
--info: #17A2B8;                /* Info messages */
```

### Category Colors (for job category badges)
```css
--category-delivery: #FF6B6B;
--category-cleaning: #4ECDC4;
--category-tutoring: #FFA07A;
--category-tech: #9D84B7;
--category-other: #95E1D3;
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```
**Alternative**: 'Plus Jakarta Sans', 'Poppins', or 'DM Sans'

### Font Sizes
```css
--font-size-xs: 12px;           /* Small labels, captions */
--font-size-sm: 14px;           /* Body text, form labels */
--font-size-base: 16px;         /* Default body text */
--font-size-lg: 18px;           /* Large body text */
--font-size-xl: 20px;           /* Small headings */
--font-size-2xl: 24px;          /* Section headings */
--font-size-3xl: 32px;          /* Page headings */
--font-size-4xl: 40px;          /* Hero headings */
--font-size-5xl: 48px;          /* Large hero headings */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights
```css
--line-height-tight: 1.2;       /* Headings */
--line-height-normal: 1.5;      /* Body text */
--line-height-relaxed: 1.75;    /* Large paragraphs */
```

### Typography Classes
```css
.heading-1 {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--gray-900);
}

.heading-2 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--gray-900);
}

.heading-3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--gray-900);
}

.body-large {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--gray-700);
}

.body-regular {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--gray-700);
}

.body-small {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--gray-500);
}

.caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--gray-500);
}
```

---

## Spacing System

### Base Unit: 4px

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Usage Guidelines
- **Component padding**: 16px (space-4) or 24px (space-6)
- **Section spacing**: 48px (space-12) or 64px (space-16)
- **Card spacing**: 20px (space-5) or 24px (space-6)
- **Input padding**: 12px horizontal, 10px vertical

---

## Border Radius

```css
--radius-sm: 6px;               /* Small elements, badges */
--radius-md: 8px;               /* Inputs, small buttons */
--radius-lg: 12px;              /* Cards, large buttons */
--radius-xl: 16px;              /* Large cards, modals */
--radius-2xl: 24px;             /* Hero sections */
--radius-full: 9999px;          /* Pills, circular avatars */
```

---

## Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.16);
```

### Usage
- **Cards**: shadow-sm or shadow-md
- **Dropdowns**: shadow-lg
- **Modals**: shadow-xl
- **Hover states**: Increase shadow slightly

---

## Layout

### Container Widths
```css
--container-sm: 640px;          /* Mobile landscape */
--container-md: 768px;          /* Tablet */
--container-lg: 1024px;         /* Desktop */
--container-xl: 1280px;         /* Large desktop */
--container-2xl: 1440px;        /* Max width */
```

### Grid System
- **12-column grid**
- **Gap**: 24px (space-6) default
- **Mobile**: Stack columns vertically

### Layout Patterns

**Two-Column Layout** (Job List Page):
```
Sidebar (3 columns) | Main Content (9 columns)
25%                  | 75%
```

**Three-Column Layout** (Login Page):
```
Form (4 columns) | Illustration (4 columns) | Info (4 columns)
```

**Form Layout**:
- Max width: 500px for single-column forms
- Label above input
- Error messages below input

---

## Components

### 1. Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--primary-blue-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  box-shadow: none;
}
```

#### Secondary Button (Outline)
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  border: 2px solid var(--primary-blue);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--primary-blue-light);
}
```

#### Button Sizes
```css
.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 18px;
}
```

---

### 2. Input Fields

```css
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--gray-900);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--primary-blue-light);
}

.input::placeholder {
  color: var(--gray-500);
}

.input:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--danger);
}
```

#### Input with Icon
```html
<div class="input-group">
  <span class="input-icon">🔍</span>
  <input class="input" placeholder="Search..." />
</div>
```

---

### 3. Cards

#### Basic Card
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

#### Job Card
```html
<div class="job-card">
  <div class="job-card-header">
    <span class="job-icon">📦</span>
    <span class="job-category">Delivery</span>
  </div>
  <h3 class="job-title">Nhân viên giao hàng nội thành</h3>
  <div class="job-meta">
    <span>📍 Quận 1, HCM</span>
    <span>⏱️ 2 giờ trước</span>
    <span>👤 1 người</span>
  </div>
  <div class="job-footer">
    <div class="job-price">50.000₫ <span>/giờ</span></div>
    <div class="job-actions">
      <a href="#" class="link">Xem chi tiết</a>
      <button class="btn-primary btn-sm">Ứng tuyển ngay</button>
    </div>
  </div>
</div>
```

```css
.job-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.job-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.job-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue-light);
  border-radius: var(--radius-md);
  font-size: 20px;
}

.job-category {
  background: var(--primary-blue-light);
  color: var(--primary-blue);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 12px;
}

.job-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--gray-500);
  margin-bottom: 16px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
}

.job-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
}

.job-price span {
  font-size: 14px;
  font-weight: 400;
  color: var(--gray-500);
}

.job-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
```

---

### 4. Navigation Header

```html
<header class="navbar">
  <div class="container">
    <div class="navbar-brand">
      <a href="/" class="logo">JobConnect</a>
    </div>
    <nav class="navbar-menu">
      <a href="/" class="nav-link active">Trang chủ</a>
      <a href="/jobs" class="nav-link">Tìm việc</a>
      <a href="/my-jobs" class="nav-link">Đăng việc</a>
      <a href="/applications" class="nav-link">Ứng tuyển</a>
    </nav>
    <div class="navbar-actions">
      <span class="user-name">Xin chào, John</span>
      <button class="btn-primary">Đăng tin tuyển</button>
    </div>
  </div>
</header>
```

```css
.navbar {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-700);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-blue);
}

.navbar-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-name {
  font-size: 14px;
  color: var(--gray-700);
}
```

---

### 5. Badges & Tags

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
}

.badge-primary {
  background: var(--primary-blue-light);
  color: var(--primary-blue);
}

.badge-success {
  background: #D4EDDA;
  color: var(--success);
}

.badge-warning {
  background: #FFF3CD;
  color: #856404;
}

.badge-danger {
  background: #F8D7DA;
  color: var(--danger);
}

/* Status badges */
.badge-open { /* OPEN jobs */
  background: var(--primary-blue-light);
  color: var(--primary-blue);
}

.badge-assigned { /* ASSIGNED jobs */
  background: #FFF3CD;
  color: #856404;
}

.badge-completed { /* COMPLETED jobs */
  background: #D4EDDA;
  color: var(--success);
}

.badge-cancelled { /* CANCELLED jobs */
  background: #F8D7DA;
  color: var(--danger);
}
```

---

### 6. Modals

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gray-500);
}

.modal-body {
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

---

### 7. Form Components

#### Form Group
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.form-help {
  display: block;
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 4px;
}

.form-error {
  display: block;
  font-size: 12px;
  color: var(--danger);
  margin-top: 4px;
}
```

#### Select Dropdown
```css
.select {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--gray-900);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--primary-blue-light);
}
```

#### Textarea
```css
.textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: inherit;
  color: var(--gray-900);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--primary-blue-light);
}
```

---

### 8. Pagination

```html
<div class="pagination">
  <button class="pagination-btn" disabled>❮</button>
  <button class="pagination-btn active">1</button>
  <button class="pagination-btn">2</button>
  <button class="pagination-btn">3</button>
  <span class="pagination-dots">...</span>
  <button class="pagination-btn">10</button>
  <button class="pagination-btn">❯</button>
</div>
```

```css
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-300);
  background: white;
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.pagination-btn.active {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-dots {
  color: var(--gray-500);
  padding: 0 4px;
}
```

---

### 9. Loading States

#### Spinner
```css
.spinner {
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-100) 25%,
    var(--gray-200) 50%,
    var(--gray-100) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 10. Rating Stars

```html
<div class="rating">
  <span class="star filled">★</span>
  <span class="star filled">★</span>
  <span class="star filled">★</span>
  <span class="star filled">★</span>
  <span class="star">★</span>
  <span class="rating-score">4.0</span>
</div>
```

```css
.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 20px;
  color: var(--gray-300);
}

.star.filled {
  color: #FFC107;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-left: 4px;
}
```

---

## Page-Specific Layouts

### Home Page
1. **Hero Section**
   - Large heading (48px)
   - Subtitle (18px)
   - Search bar with icon
   - 3D illustration on right
   - Background: Light gradient (white to light blue)

2. **Category Section**
   - Grid: 4 columns (desktop), 2 columns (mobile)
   - Category cards with icon + label
   - Hover effect: slight scale + shadow

3. **Job List Section**
   - Heading + "Xem tất cả" link
   - Grid: 3 columns (desktop)
   - Job cards

4. **Footer**
   - 4 columns
   - Links in each column
   - Copyright at bottom

### Job List Page
1. **Search Bar** (full width)
   - Keyword input + Category dropdown + Location dropdown
   - "Lọc chi tiết" button

2. **Layout**: Sidebar + Main
   - **Sidebar (left, 25%)**:
     - Filters: Price range slider, Location (map), Tags
   - **Main (right, 75%)**:
     - Results count + Sort dropdown
     - Job cards (stacked)
     - Pagination

### Job Detail Page
1. **Breadcrumb** navigation
2. **Two-column layout**:
   - **Left (70%)**:
     - Job title
     - Poster info (avatar, name, rating)
     - Job details
     - Description
     - Reviews section
   - **Right (30%)**:
     - Sticky card with:
       - Price
       - "Ứng tuyển ngay" button
       - Job meta (date, location, etc.)

### Login/Register Page
1. **Three-panel layout** (equal width):
   - Left: Form
   - Center: Illustration + tagline
   - Right: Benefits/stats

### Create/Edit Job Page
1. **Stepper** at top (3 steps)
2. **Two-column layout**:
   - Left (60%): Form
   - Right (40%): Preview card

### Profile Page
1. **Header section**:
   - Avatar (large, left)
   - User info + rating (right)
   - Stats cards

2. **Tabs**:
   - "As Job Poster" tab
   - "As Worker" tab
   - "Reviews" tab

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack all columns */
  /* Hide sidebar, show as drawer */
  /* Smaller font sizes */
  /* Full-width buttons */
}

/* Tablet */
@media (max-width: 1024px) {
  /* 2-column grids instead of 3-4 */
  /* Adjust sidebar width */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full layout as designed */
}
```

---

## Animation & Transitions

### Standard Transitions
```css
transition: all 0.2s ease-in-out;  /* For buttons, inputs */
transition: all 0.3s ease-in-out;  /* For cards, modals */
```

### Hover Effects
- **Cards**: Slight lift (translateY -2px) + shadow increase
- **Buttons**: Lift + shadow + color darken
- **Links**: Color change + underline

### Page Transitions
- Fade in content on route change
- Duration: 300ms

---

## Icons

### Icon Library Recommendations
- **React Icons**: https://react-icons.github.io/react-icons/
- **Lucide Icons**: https://lucide.dev/
- **Heroicons**: https://heroicons.com/

### Icon Sizes
```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 40px;
```

### Category Icons
- Delivery: 📦 or truck icon
- Cleaning: 🧹 or broom icon
- Tutoring: 📚 or book icon
- Tech Support: 💻 or laptop icon
- Other: ⭐ or star icon

---

## Accessibility

### Color Contrast
- Text on white: Minimum AA compliance
- Use gray-700 (#495057) for body text
- Use gray-900 (#212529) for headings

### Focus States
- All interactive elements must have visible focus state
- Use blue outline with 3px offset

### Alt Text
- All images must have descriptive alt text
- Decorative images: alt=""

### Keyboard Navigation
- All actions accessible via keyboard
- Tab order should be logical

---

## Implementation Tips

### CSS Organization
```
styles/
├── variables.css        (colors, spacing, etc.)
├── reset.css            (normalize)
├── typography.css       (font classes)
├── components/
│   ├── button.css
│   ├── card.css
│   ├── input.css
│   ├── modal.css
│   └── ...
└── pages/
    ├── home.css
    ├── job-list.css
    └── ...
```

### Component Structure (React)
```
components/
├── common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   └── Modal.jsx
├── layout/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── Container.jsx
└── job/
    ├── JobCard.jsx
    ├── JobList.jsx
    ├── JobFilter.jsx
    └── JobDetail.jsx
```

---

## Quick Start Checklist

- [ ] Install design system CSS variables
- [ ] Import font (Inter or similar)
- [ ] Create base components (Button, Input, Card)
- [ ] Build Navbar component
- [ ] Create page layouts
- [ ] Test responsive design
- [ ] Add animations/transitions
- [ ] Accessibility audit
