# Personal Finance Dashboard

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
  - [Transaction Routes](#transaction-routes)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
The **Personal Finance Dashboard** is a web application designed to help users manage their personal finances. It allows users to track their income and expenses, view analytics, and manage transactions.

## Features
- User authentication (register, login, logout)
- Add, edit, and delete transactions
- View income and expenditure analytics
- Responsive design for mobile and desktop

## Technologies Used
- **Frontend:** React, Next.js, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Styling:** CSS, Tailwind CSS

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Akki-OOK/personal-finance-dashboard.git
   cd personal-finance-dashboard
   ```
2. **Install dependencies:**
   ```sh
   # For the client
   cd client
   npm install

   # For the server
   cd ../server
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `server` directory and add the following:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. **Run the application:**
   ```sh
   # Start the server
   cd server
   npm start

   # Start the client
   cd ../client
   npm run dev
   ```
5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Usage
### Register
- Navigate to the Register page.
- Fill in your name, email, and password.
- Click the "Register" button.

### Login
- Navigate to the Login page.
- Enter your email and password.
- Click the "Login" button.

### Add Transaction
- Navigate to the Transactions page.
- Fill in the transaction details (category, amount, type).
- Click the "Add Transaction" button.

### View Analytics
- Navigate to the Analytics page.
- View the income and expenditure charts.

## API Documentation
### User Routes
#### `POST /api/users/register`
- Registers a new user.
- **Request body:** `{ name, email, password }`
- **Response:** `{ message, user }`

#### `POST /api/users/login`
- Logs in a user.
- **Request body:** `{ email, password }`
- **Response:** `{ token, user }`

#### `GET /api/users/me`
- Gets the current logged-in user.
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:** `{ user }`

### Transaction Routes
#### `GET /api/transactions`
- Gets all transactions for the logged-in user.
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:** `{ transactions }`

#### `POST /api/transactions`
- Adds a new transaction.
- **Request body:** `{ category, amount, type }`
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:** `{ message, transaction }`

#### `DELETE /api/transactions/:id`
- Deletes a transaction.
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:** `{ message }`

## Folder Structure
```
personal-finance-dashboard/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env
│   ├── package.json
│   └── README.md
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes.
4. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
5. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
6. Open a pull request.

## Running Tests
```sh
# Run backend tests
cd server
npm test

# Run frontend tests
cd ../client
npm test
```

## License
This project is licensed under the **MIT License**.
