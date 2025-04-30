# Strong By Yoga Booking System

A comprehensive booking system for yoga studios that allows users to book both one-on-one sessions and group classes, manage their schedule, and access virtual sessions.

## Features

- **Membership Management**:
  - Tiered membership plans (Basic, Premium, etc.)
  - Credit-based booking system
  - Unlimited group classes option

- **Class Booking**:
  - Book group classes using membership benefits
  - Schedule one-on-one sessions with instructors
  - Real-time availability checking
  - Calendar view of all classes

- **Virtual Sessions**:
  - Zoom integration for online classes
  - Automated meeting creation
  - Secure access for confirmed bookings

- **User Experience**:
  - Interactive dashboard
  - Class filtering options
  - Booking management (confirmation, cancellation)
  - Email notifications

## Tech Stack

### Frontend
- React
- React Router for navigation
- FullCalendar for calendar views
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Zoom API integration

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Zoom API credentials (for virtual sessions)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/strong-by-yoga.git
cd strong-by-yoga
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install UI dependencies:
```
cd ../ui
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the server directory with the following:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ZOOM_API_KEY=your_zoom_api_key
   ZOOM_API_SECRET=your_zoom_api_secret
   ZOOM_EMAIL=your_zoom_account_email
   ```

### Running the Application

1. Start the server:
```
cd server
npm run dev
```

2. Start the frontend:
```
cd ../ui
npm start
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Booking Endpoints
- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/bookings/calendar` - Get calendar view of classes
- `GET /api/bookings/availability/:sessionId` - Check class availability

### Class Endpoints
- `GET /api/classes/group` - Get group classes
- `GET /api/classes/one-on-one` - Get one-on-one sessions
- `GET /api/classes/:id` - Get a specific class

### Zoom Endpoints
- `GET /api/zoom/meeting/:classId` - Get Zoom meeting for a class
- `POST /api/zoom/create-meeting` - Create a new Zoom meeting

## License

This project is licensed under the MIT License - see the LICENSE file for details. 