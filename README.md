# BatChit Backend API

Backend API for BatChit - A real-time chat and video calling application.

## 🚀 Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database
- **Stream.io** - Real-time chat and video
- **Cloudinary** - Image uploads
- **JWT** - Authentication

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Stream.io account
- Cloudinary account

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=7000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Stream.io
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

See `.env.example` for a template.

## 📦 Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status

### Users
- `GET /api/users` - Get all users
- `POST /api/users/friend-request` - Send friend request
- `POST /api/users/accept-request` - Accept friend request
- `GET /api/users/friends` - Get user's friends
- `GET /api/users/notifications` - Get notifications

### Chat
- `GET /api/chat/token` - Get Stream chat token

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Call
- `POST /api/call/history` - Save call history
- `GET /api/call/history` - Get call history

## 🚀 Deploy to Render

### Using Render Dashboard:

1. Create new **Web Service**
2. Connect this GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Add all variables from `.env`

### Environment Variables on Render:

Add these in the Render dashboard:
- `NODE_ENV` = `production`
- `PORT` = `7000`
- `MONGO_URI` = (your MongoDB Atlas connection string)
- `JWT_SECRET` = (generate a secure random string)
- `STREAM_API_KEY` = (from Stream.io dashboard)
- `STREAM_API_SECRET` = (from Stream.io dashboard)
- `CLOUDINARY_CLOUD_NAME` = (from Cloudinary dashboard)
- `CLOUDINARY_API_KEY` = (from Cloudinary dashboard)
- `CLOUDINARY_API_SECRET` = (from Cloudinary dashboard)
- `FRONTEND_URL` = (your deployed frontend URL)

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/       # Route controllers
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── call.controller.js
│   │   ├── upload.controller.js
│   │   └── user.controller.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── FriendRequest.js
│   │   └── CallHistory.js
│   ├── routes/           # API routes
│   │   ├── auth.route.js
│   │   ├── chat.route.js
│   │   ├── call.route.js
│   │   ├── upload.route.js
│   │   └── user.route.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.middleware.js
│   ├── lib/             # Utility functions
│   │   ├── dbconn.js
│   │   ├── cloudinary.js
│   │   └── stream.js
│   └── server.js        # Entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Security Notes

- Never commit `.env` file
- Use strong JWT secret
- Whitelist frontend URL in CORS
- Use MongoDB IP whitelist in production

## 📝 Notes

- Free tier on Render spins down after 15 minutes of inactivity
- First request after idle may take 30-60 seconds (cold start)
- MongoDB Atlas free tier: 512MB storage
- Cloudinary free tier: 25GB storage, 25GB bandwidth

## 🆘 Troubleshooting

**MongoDB connection fails:**
- Check if IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
- Verify connection string format

**CORS errors:**
- Ensure `FRONTEND_URL` matches your frontend URL exactly
- Check that `credentials: true` is set in CORS config

**Port already in use:**
- Change `PORT` in `.env` file
- Kill process using the port: `npx kill-port 7000`

## 📄 License

MIT

## 👤 Author

Deep Guchhait
- GitHub: [@deepguchhait1](https://github.com/deepguchhait1)
