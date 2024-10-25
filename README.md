# User Management System

A comprehensive user management system built using **React**, **Next.js**, and **Node.js** with **MySQL** and **Sequelize** for the backend. This application includes features for user registration, profile management, and image uploads, along with secure authentication using email verification and JWT tokens. Additionally, Redis is used for caching to improve performance.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

### Frontend

- **User Registration**

  - Users can register with their full name, email, and password.
  - Image upload feature allows users to upload a profile picture during registration.
  - The application sends a verification link to the user's email upon successful registration.

- **User Login**

  - Users can log in via an email verification link instead of traditional password authentication.
  - **Google Login** option allows users to log in with their Google account for a seamless experience.
  - The application generates JWT tokens with refresh tokens upon successful login.

- **Profile Management**

  - Users can view and edit their profiles, including updating their name, email, and password.
  - Users can upload a new profile picture and preview it before saving.
  - The application keeps the existing password unchanged unless a new one is provided.

- **Error Handling**

  - User-friendly error messages are displayed for registration and login issues.
  - Validation is enforced using Zod schemas, ensuring proper data input.

- **Responsive Design**
  - The user interface is designed to be responsive, ensuring a seamless experience on various devices.

### Backend

- **RESTful API**

  - Built using Node.js and Express, providing a set of RESTful endpoints for user management.

- **User Management**

  - CRUD operations for user accounts, including creating, reading, updating, and deleting users.

- **Database Integration**

  - Utilizes MySQL with Sequelize ORM for database interactions.
  - User information is stored securely in the database.

- **Authentication**

  - JWT-based authentication for secure access to protected routes.
  - Passwords are hashed for security.

- **Email Verification**

  - Sends verification emails to users during registration, ensuring valid user accounts.

- **Image Upload**

  - Supports image uploads via an S3 bucket, enabling users to upload profile pictures.

- **Caching with Redis**
  - Utilizes Redis for caching frequently accessed data, improving application performance and response times.

## Technologies

- **Frontend:**

  - React
  - Next.js
  - Axios for API calls
  - Zod for form validation
  - Tailwind CSS for styling

- **Backend:**
  - Node.js
  - Express
  - MySQL
  - Sequelize ORM
  - Redis for caching
  - JSON Web Tokens (JWT) for authentication
  - Multer for handling file uploads

## Installation

### Frontend

1. Clone the repository

```bash
  git clone <repository-url>
```

- Backend

```bash
   cd frontend
   pnpm i
   pnpm run dev
```

- Frontend
  ```bash
  cd frontend
  pnpm i
  pnpm run dev
  ```
