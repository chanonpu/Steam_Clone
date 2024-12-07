# Game Store App (Steam Clone)

This project is a full-stack web application that allows users to register, log in, view their profiles, upload games, and manage game data. It's a clone of the Steam platform where users can upload games with specific details, view their game library, and manage their account information.

## Features

- **User Registration and Login**: Users can register and log in to the platform using their credentials.
- **Profile Page**: Displays user information and the list of games they own.
- **Game Upload**: Users can upload games with fields like name, description, price, genre, image, and platform.
- **Game Library**: Users can view their uploaded games and details about each game.
- **Responsive Design**: The web application is responsive and works well on different devices.

## Tech Stack

### Frontend:
- **React**: A JavaScript library for building user interfaces.
- **Axios**: Used for making HTTP requests from the frontend to the backend.
- **CSS**: Custom styling for the components and pages.

### Backend:
- **Node.js**: JavaScript runtime environment for running the backend.
- **Express.js**: Web framework for Node.js used to handle routes and API requests.
- **Multer**: Middleware used for handling file uploads.

### Database:
- **MongoDB**: Used for storing user and game data

### Authentication:
- **JSON Web Tokens (JWT)**: Used to secure access

## Installation and Setup

Follow the steps below to set up and run the project locally.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/chanonpu/Steam_Clone.git
   cd Steam_Clone
   ```

2. **Install Dependencies**
   Navigate to both the frontend and backend directories and install the required dependencies.
   
  For the backend:
  
  ```bash
  cd server
  npm install
  ```

  For the frontend:
  
  ```bash
  cd client
  npm install
  ```

3. **Configure Environment Variables**
   Create a .env file in both the frontend and backend directory and configure the following environment variables:

  For the backend:
   ```makeafile
   PORT = 8000 or any PORT you want
   mongoDB = Your Mongo DB URL
   JWT_SECRET = your-secret-key
   ```

  For the frontend:
  ```makeafile
  VITE_SERVER_URL = http://localhost:8000 or your PORT / Server
  ```

4. **Run the Backend Server**

  From the backend directory:
  ```bash
    nodemon index.js
  ```

5. **Run the Frontend**

  From the front end directory:
  ```bash
    npm run dev
  ```

6. **Access the App**

  Open your browser and go to:
  ```arduino
  http://localhost:3000 or your frontend server
  ```

