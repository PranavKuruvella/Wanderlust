# Wanderlust - Travel Accommodation Platform

A full-stack web application for listing and discovering travel accommodations built with Node.js, Express, MongoDB, and EJS.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **Listing Management**: Create, read, update, and delete accommodation listings
- **Image Upload**: Cloudinary integration for image storage
- **Reviews & Ratings**: Star-based rating system with comments
- **Interactive Maps**: Mapbox integration to show listing locations
- **Responsive Design**: Bootstrap-based responsive UI
- **Search & Filter**: Filter listings by various criteria

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Template Engine**: EJS
- **File Upload**: Multer with Cloudinary
- **Maps**: Mapbox GL JS
- **Styling**: Bootstrap 5, Custom CSS
- **Validation**: Joi for server-side validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Mapbox account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wanderlust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/wanderlust
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAP_TOKEN=your_mapbox_token
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   PORT=8080
   ```

4. **Initialize the database** (optional)
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
wanderlust/
├── app.js                 # Main application file
├── cloudConfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware functions
├── schema.js             # Joi validation schemas
├── controllers/          # Route controllers
├── models/              # Mongoose models
├── routes/              # Express routes
├── utils/               # Utility functions
├── views/               # EJS templates
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   └── js/             # Client-side JavaScript
└── init/               # Database initialization
```

## API Endpoints

### Authentication
- `GET /signup` - Sign up page
- `POST /signup` - Create new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Create new review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Bootstrap for the UI framework
- Mapbox for mapping services
- Cloudinary for image storage
- Unsplash for sample images 