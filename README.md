# TrustAll Backend

Welcome to the TrustAll Backend repository! This repository contains the source code for the backend of the TrustAll platform, which is designed to simplify the process of checking cars before purchase. This README will guide you through the setup and provide an overview of the backend components.

## Technologies Used

The TrustAll Backend is built using the following technologies:

- **Node.js:** A JavaScript runtime environment for building server-side applications.
- **Express.js:** A web application framework for Node.js that simplifies the development of APIs.
- **MongoDB:** A NoSQL database used for storing data related to car inspections, users, and more.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB, used to define data schemas and interact with the database.
- **JSON Web Tokens (JWT):** Used for authentication and authorization.
- **NPM/Yarn:** Package managers for installing and managing project dependencies.

## Installation and Setup

To set up the TrustAll Backend on your local machine, follow these steps:

1. Clone this repository to your local machine.

    ```bash
    git clone "https://github.com/Yassine-Benlaria/TrustAll-back"
    ```

2. Navigate to the project directory.

    ```bash
    cd trustall-backend
    ```

3. Install the required dependencies.

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory of the project and configure the following environment variables:

    ```env
    PORT=8000
    DATABASE_URL="mongodb://localhost/trustall" # Replace with your MongoDB connection string
    JWT_SECRET="your-secret-key" # Replace with a strong and unique secret key
    ```

5. Start the application.

    ```bash
    npm start
    ```

The backend server will now be running on `http://localhost:8000`.

## API Endpoints

The TrustAll Backend provides various API endpoints to interact with the platform. Here are some of the main endpoints:

- `/api/client`: Handles clients accounts.
- `/api/cars`: Manages car data, including inspection reports.
- `/api/command`: Manages car inspection commands.
- `/api/agent`: Manages agents accounts.
- `/api/plans`: Manages inspection plans for different prices.
- `/api/notifications`: Handles notifications for users.
- `/api/bloggers`: Manages blog posts related to car inspections and buying tips.

Please refer to the API documentation for detailed information about available endpoints and their functionalities.

## Authentication

The backend uses JWT (JSON Web Tokens) for user authentication and authorization. Users must obtain a valid JWT token by logging in or registering to access protected endpoints.


Thank you for using TrustAll! If you have any questions or need assistance, feel free to reach out to us. Happy coding!
