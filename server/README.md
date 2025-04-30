# Strong By Yoga Platform

A MERN (MongoDB, Express, React, Node.js) stack application for a yoga platform with features for classes, instructors, payment integration, and video conferencing.

## Project Structure

- `/server` - Backend Express.js API with MongoDB integration
- `/ui` - Frontend React application with Tailwind CSS

## Features

- User authentication with JWT
- Role-based access control (user, instructor, admin)
- Online yoga class scheduling and registration
- Payment processing with Stripe
- Video conferencing with Zoom API integration
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Stripe account for payment processing
- Zoom API credentials

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/strong-by-yoga.git
cd strong-by-yoga
```

2. Install server dependencies

```bash
cd server
npm install
```

3. Configure environment variables
   Create a `.env` file in the server directory with the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/strongByYoga
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=30d

# Stripe API keys
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Zoom API credentials
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
```

4. Install frontend dependencies

```bash
cd ../ui
npm install
```

### Running the Application

1. Start the backend server

```bash
cd server
npm run dev
```

2. Start the frontend development server

```bash
cd ui
npm start
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:5000.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user (admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update user password
- `GET /api/users/classes` - Get user's enrolled classes
- `GET /api/users/classes/teaching` - Get instructor's classes

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a new class (instructor only)
- `GET /api/classes/:id` - Get specific class
- `PUT /api/classes/:id` - Update class (instructor only)
- `DELETE /api/classes/:id` - Delete class (instructor only)
- `POST /api/classes/:id/enroll` - Enroll in a class

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/create-subscription` - Create subscription
- `POST /api/payments/webhook` - Handle Stripe webhook events

### Zoom
- `POST /api/zoom/create-meeting` - Create a Zoom meeting
- `GET /api/zoom/meeting/:classId` - Get Zoom meeting details

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Stripe
- Zoom API 