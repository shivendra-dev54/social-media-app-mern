# Social Media App

A full-stack social media application with authentication, posts, likes, and image uploads.  
Built with a modern React frontend and an Express + MongoDB backend.

Created by **Shivendra Devadhe**

---

## Features

### Authentication
- Cookie-based authentication
- JWT access tokens
- Persistent login using Zustand store
- Protected routes

### Posts
- Create posts with text and/or image
- Update posts (owner only)
- Delete posts (owner only)
- Fetch all posts in a feed
- Image uploads via Cloudinary

### Likes & Comments
- Like / unlike posts (toggle)
- Optimistic UI updates
- Comment count displayed (comments API ready)

### UI / UX
- Dark theme
- Responsive (mobile + desktop)
- Bootstrap 5 styling
- Smooth SPA navigation (no reloads)

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Bootstrap 5
- Axios
- Zustand (state management)
- React Router

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Multer (file uploads)
- Cloudinary (image storage)
- JWT (authentication)
- Cookie-parser
- CORS

---

## Project Structure

### Backend
```

backend/
├── Controllers/
├── Routes/
├── Middleware/
├── db/
│   └── schema/
├── utils/
├── interfaces/
└── app.ts

```

### Frontend
```

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── lib/
│   └── main.tsx

```

---

## Environment Variables

### Backend (`.env`)
```

PORT=64000
MONGO_URI=your_mongodb_uri
ACCESS_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

```

### Frontend (`.env`)
```

VITE_BACKEND_URL=[http://localhost:64000](http://localhost:64000)

```

---

## Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:64000
```

---

## Authentication Flow

* User signs in → JWT stored in **httpOnly cookie**
* Zustand stores user metadata
* Protected routes ensure only authenticated users can:

  * Create posts
  * Edit posts
  * Delete posts
  * Like posts

---

## API Endpoints (Core)

### Auth

```
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/logout
```

### Posts

```
GET    /api/post
POST   /api/post
PATCH  /api/post/:id
DELETE /api/post/:id
PATCH  /api/post/:id/like
```

---

## Key Design Decisions

* **Route-level body parsing** to avoid Multer conflicts
* **Derived vs stateful UI state** handled carefully (likes)
* **Optimistic UI updates** for better UX
* **Single styling system (Bootstrap)** to avoid conflicts
* **No global redirects** in layout components

---

## Author

**Shivendra Devadhe**