# 💬 Chatify — Real-Time Chat & Messaging Application

A full-stack, real-time messaging web application built with the **MERN** stack (MongoDB, Express, React, Node.js), **Socket.io** for instant messaging & online presence, **Tailwind CSS + DaisyUI** for custom themes, and **Supabase Storage** for media uploads.

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication supporting both HTTP-only Cookies and Authorization headers.
- ⚡ **Real-Time Messaging**: Instant 1-on-1 messaging powered by Socket.io.
- 🟢 **Live Online / Offline Status**: Real-time user presence detection.
- 📸 **Image & Media Sharing**: Upload and send images in chat powered by Supabase Storage.
- 👤 **Profile Customization**: Update profile pictures with instant preview and cloud storage sync.
- 🎨 **30+ Theme Selector**: Dynamic theme switcher with 32 DaisyUI themes, persisted via local storage.
- 📱 **Responsive UI**: Fully responsive layout designed for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Real-time Client**: [Socket.io-client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with ES Modules
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Real-time Engine**: [Socket.io](https://socket.io/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Media Storage**: [Supabase Storage](https://supabase.com/storage)
- **CORS & Cookies**: `cors` + `cookie-parser`

---

## 📁 Project Structure

```text
chatify/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, message)
│   │   ├── lib/                 # Database, Supabase, Socket, and utility configs
│   │   ├── middleware/          # Auth protection middleware
│   │   ├── models/              # Mongoose models (User, Message)
│   │   ├── routes/              # Express API routes
│   │   └── index.js             # Server entry point & CORS configuration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Sidebar, Chat, Navbar, Skeletons)
│   │   ├── constants/           # Themes and config constants
│   │   ├── lib/                 # Axios & utility helpers
│   │   ├── pages/               # Pages (Home, Login, SignUp, Profile, Settings)
│   │   ├── store/               # Zustand state stores (useAuthStore, useChatStore, useThemeStore)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database URI (MongoDB Atlas or local instance)
- Supabase Project (with buckets `profile-pics` and `message-media` created)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   PORT=5001
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Supabase Storage Credentials
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## ☁️ Deployment Guide & Cookie Configuration

When deploying frontend and backend to different domains (e.g. Frontend on **Vercel** and Backend on **Render / Railway / Fly.io**):

### Crucial Production Environment Variables

#### Backend (.env in production)
```env
PORT=5001
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatify
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app

SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Important Notes for Deployment:**
> 1. **Do not include a trailing slash** in `FRONTEND_URL` (e.g., use `https://my-app.vercel.app` instead of `https://my-app.vercel.app/`).
> 2. Ensure `NODE_ENV=production` is set in your backend hosting platform dashboard so cookies use `SameSite=None` and `Secure=true`.
> 3. Express is configured with `app.set("trust proxy", 1)` to correctly recognize HTTPS headers forwarded by reverse proxies (Render, Railway, Heroku, etc.).

#### Frontend (.env in production)
```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in user & receive session cookie/token | No |
| `POST` | `/api/auth/logout` | Clear auth cookie and session | No |
| `GET` | `/api/auth/check` | Verify current session and retrieve user | Yes |
| `PUT` | `/api/auth/update-profile`| Upload profile picture | Yes |

### Message Routes (`/api/message`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/message/users` | Retrieve list of sidebar users | Yes |
| `GET` | `/api/message/:id` | Fetch conversation history with user `id` | Yes |
| `POST` | `/api/message/send/:id`| Send a message (text or image) to user `id` | Yes |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
