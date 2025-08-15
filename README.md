# 🎬 WatchNest

A modern video streaming platform inspired by YouTube, built with the MERN stack and TypeScript.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## 🎯 About

WatchNest is a full-stack video streaming platform that allows users to upload, watch, and share videos. Built with modern web technologies, it provides a seamless YouTube-like experience with features including user authentication, video management, playlists, comments, likes, subscriptions, and more.

Figma design for the home page:-

![WatchNest Banner](./Home%20Page%20Figma%20Design.png)

## ✨ Features

### User Management
- 🔐 User registration and authentication
- 👤 User profiles with customizable avatars and cover images
- 🔄 Profile editing and account management
- 🔒 Secure JWT-based authentication

### Video Features
- 📹 Video upload with thumbnail generation
- 🎮 Advanced video player with quality and speed controls
- 👍 Like system
- 💬 Comment system 
- 📊 View count tracking
- 🎯 Video recommendations

### Social Features
- 📺 Channel subscriptions
- 📋 Custom playlists creation and management
- 📤 Video sharing functionality
- 🏠 Personalized dashboard

### Advanced Features
- 🔍 Search functionality
- 📱 Responsive design for all devices
- 📈 Analytics dashboard
- 🔄 State management with Redux
- 🎨 Modern UI with Vanilla CSS and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **RSuite** - UI component library
- **Formik** - Form handling
- **Yup** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Media storage and processing
- **CORS** - Cross-origin resource sharing

### Tools & Services
- **Cloudinary** - Image and video storage
- **MongoDB Atlas** - Cloud database
- **Git** - Version control
- **Postman** - API testing
- **GitHub** - Version control and collaboration
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🗄️ Database Design

![Database Design](./Database%20Design.png)

The application uses MongoDB with the following main collections:
- **Users** - User account information
- **Videos** - Video metadata and content
- **Comments** - User comments on videos
- **Likes** - Like/dislike records
- **Playlists** - User-created playlists
- **Subscriptions** - Channel subscription data
- **Tweets** - Community posts

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend (.env)
```env
PORT=8001
CORS_ORIGIN=http://localhost:8001
mongoURI=your_mongodb_connection_string
CORS_FRONTEND_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env)
```env
VITE_api_URL=http://localhost:8001
VITE_cloudinary_client_id=your_cloudinary_client_id
```

## 💻 Installation

1. **Clone the repository**
```bash
git clone https://github.com/manasTiwari-IR/WatchNest.git
cd WatchNest
```

2. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../Frontend
npm install
```

4. **Set up environment variables**
- Create `.env` files as described above

5. **Start the application**

**Option 1: Start both servers together (from Frontend directory)**
```bash
npm run start
```

**Option 2: Start servers separately**

Backend:
```bash
cd Backend
npm run devstart
```

Frontend:
```bash
cd Frontend
npm run dev
```

## 🎮 Usage

1. **Access the application** at `watchnest-frontend.vercel.app`
2. **Register** a new account or **login** with existing credentials
3. **Upload videos** from your dashboard
4. **Explore** videos on the home page
5. **Create playlists** and **subscribe** to channels
6. **Interact** with videos through likes and comments

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### Video Endpoints
- `GET /api/v1/videos` - Get all videos
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos/:videoId` - Get video by ID
- `PATCH /api/v1/videos/:videoId` - Update video
- `DELETE /api/v1/videos/:videoId` - Delete video

### User Endpoints
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update user account
- `PATCH /api/v1/users/avatar` - Update user avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Additional Endpoints
- Comments: `/api/v1/comments`
- Likes: `/api/v1/likes`
- Playlists: `/api/v1/playlists`
- Subscriptions: `/api/v1/subscriptions`
- Dashboard: `/api/v1/dashboard`

## 📁 Project Structure

```
WatchNest/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── cssfiles/        # CSS stylesheets
│   │   ├── functions/       # Utility functions
│   │   ├── ReduxStateManagement/ # Redux store
│   │   └── assets/          # Static assets
│   └── package.json
├── Database Design.png      # Database schema
├── Home Page Figma Design.png # UI design
└── README.md
```

## 🚀 Future Enhancements
- **Tweets**: Add community posts feature
- Add video recommendations based on user preferences
- Enhance search functionality with advanced filters
- Performance optimizations for large-scale video handling
- Implement dark mode



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch 
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manas Tiwari**
- GitHub: [@manasTiwari-IR](https://github.com/manasTiwari-IR)
- Project: [WatchNest Repository](https://github.com/manasTiwari-IR/WatchNest)

## 🙏 Special Thanks

I would like to express my gratitude to:

- **Hitesh Choudhary** - For invaluable guidance and inspiration
- **The open-source community** - For providing amazing tools and libraries
- **Github Copilot** - For assisting with code and making development smoother

---
Your contributions and support have been essential to making this project possible.

⭐ If you found this project helpful, please give it a star!

📧 For any questions or support, feel free to reach out!
