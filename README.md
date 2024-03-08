# Recolect - Social Media Platform for Collectors

Recolect is a social media platform designed for collectors to share their collections and connect with other enthusiasts. Whether you collect stamps, coins, memorabilia, or anything else, Recolect provides a dedicated space for users to showcase their collections, interact with fellow collectors, and explore diverse hobbies.

## Features

-   **User Authentication:** Secure user registration and login system using bcrypt for password hashing and JWT for token-based authentication.
-   **Profile Management:** Create and manage user profiles, complete with customizable profile pictures and bio sections.
-   **Image Upload:** Users can upload images of their collectibles, with each image tied to the user who uploaded it.
-   **Image Gallery:** Explore and view images uploaded by other users based on their profiles.
-   **Image Deletion:** Securely delete uploaded images, ensuring only the owner can remove their content.
-   **Responsive Design:** User-friendly interface accessible across various devices.

## Technologies Used

-   **Frontend:** React.js, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JWT, bcrypt
-   **File Uploads:** Multer
-   **Middleware:** CORS, Body-parser

## Project Structure

-   **`frontend/`:** Contains the React.js application for the user interface.
-   **`backend/`:** Houses the Node.js server, Express routes, and MongoDB database connections.
-   **`uploads/`:** Directory for storing user-uploaded images.

## Getting Started

1. **Clone the repository:**

bash\
git clone https://github.com/your-username/recolect.git\
cd recolect\

2. **Install dependencies for both frontend and backend:**

## Install frontend dependencies

cd frontend\
npm install\

## Install backend dependencies

cd ../backend\
npm install\

3. **Configure MongoDB:**

Update config.js in the backend/ directory with your MongoDB URI.

4. **Start the application:**

## Start frontend (from the 'frontend/' directory)

npm start

## Start backend (from the 'backend/' directory)

npm start

5. **Access Recolect in your browser at http://localhost:3000**

Note: Ensure you have Node.js, npm, and MongoDB installed on your machine before running the application.

Contributing
Feel free to open issues, submit pull requests, or suggest new features.

License
This project is licensed under the MIT License
