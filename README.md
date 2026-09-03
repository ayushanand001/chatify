# Chatify

A real-time one-on-one chat application built with the MERN stack and Socket.IO. Users can sign up, log in, see who's online, and exchange text and image messages instantly.

## Features

- **Authentication** — signup/login/logout with JWT stored in an HTTP-only cookie, and password hashing via bcrypt
- **Real-time messaging** — instant message delivery over WebSockets using Socket.IO
- **Online presence** — see which users are currently online
- **Image sharing in chat** — send images alongside text messages
- **Profile pictures** — upload and update a profile photo
- **Theming** — 30+ selectable UI themes (via DaisyUI) with persisted preference
- **Responsive UI** — built with React 19, Tailwind CSS 4, and DaisyUI

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4 / DaisyUI
- Zustand (state management)
- React Router
- Axios
- Socket.IO client
- react-hot-toast, lucide-react

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing
- Supabase (storage) for profile pictures and message images
- CORS, cookie-parser, dotenv

## Project Structure

```
chatify/
├── backend/
│   └── src/
│       ├── controllers/     # auth.controller.js, message.controller.js
│       ├── middleware/      # auth.middleware.js (route protection)
│       ├── models/          # user.model.js, message.model.js
│       ├── routes/          # auth.route.js, message.route.js
│       ├── lib/             # db.js, socket.js, supabase.js, utils.js
│       └── index.js         # app entry point
└── frontend/
    └── src/
        ├── components/      # Navbar, Sidebar, ChatContainer, ChatHeader, etc.
        ├── pages/           # HomePage, LoginPage, SignUpPage, ProfilePage, SettingsPage
        ├── store/           # useAuthStore, useChatStore, useThemeStore (Zustand)
        ├── lib/             # axios instance, utils
        ├── constants/       # theme list
        └── App.jsx
```

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (e.g. MongoDB Atlas)
- A Supabase project with storage buckets `profile-pics` and `message-media`

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd chatify

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment variables

**`backend/.env`**

```env
MONGODB_URL=<your MongoDB connection string>
PORT=5001
JWT_SECRET=<a long, random secret>
NODE_ENV=development
SUPABASE_URL=<your Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<your Supabase service role key>
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5001
```

### 3. Run in development

```bash
# from backend/
npm run dev      # starts the API with nodemon on PORT (default 5001)

# from frontend/, in a separate terminal
npm run dev       # starts Vite dev server, typically on http://localhost:5173
```

### 4. Build for production

```bash
cd frontend
npm run build     # outputs static assets, e.g. to frontend/dist
```

```bash
cd backend
npm start          # runs the API with node (no auto-reload)
```

## API Overview

Base path: `/api`

**Auth** (`/api/auth`)
| Method | Endpoint          | Description                          | Auth required |
|--------|-------------------|---------------------------------------|----------------|
| POST   | `/signup`         | Create a new account                  | No             |
| POST   | `/login`          | Log in, sets `jwt` cookie             | No             |
| POST   | `/logout`         | Clear the auth cookie                 | No             |
| PUT    | `/update-profile` | Update profile picture (base64)       | Yes            |
| GET    | `/check`          | Return the current authenticated user | Yes            |

**Messages** (`/api/message`)
| Method | Endpoint     | Description                                 | Auth required |
|--------|--------------|-----------------------------------------------|----------------|
| GET    | `/users`     | List all users for the sidebar (excluding self) | Yes          |
| GET    | `/:id`       | Get the message history with user `:id`       | Yes            |
| POST   | `/send/:id`  | Send a text and/or image message to user `:id` | Yes           |

Real-time events are handled over a Socket.IO connection at the backend's root URL, keyed by `userId` in the handshake query, with `onlineUsers` and `newMessage` events pushed to connected clients.

## License

No license file is currently included in this project.
