# Real-Time Chat Application

## About the App

Real-time web-based chat application built using Node.js, Express, Socket.IO, and EJS. It allows users to register, log in, update their profiles, and communicate in room-based chats. The application includes features such as user authentication using JSON Web Tokens (JWT), password hashing with bcrypt, and form validation using express-validator. The system is structured following a layered MVC-style architecture to separate concerns and maintain modularity.

---

## How to Run the App Locally

**Requirements:**
- Node.js (v16 or higher)
- npm (Node package manager)

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Megach-ffs/Meyram.git
   cd Meyram
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   JWT_SECRET=your_secret_key_here
   ```

4. Run the application:
   ```bash
   node app.js
   ```

5. Open your browser and visit:
   ```
   http://localhost:8000
   ```

---

## Application Dependencies

| Package            | Description                             |
|--------------------|-----------------------------------------|
| express            | Web server and routing engine           |
| ejs                | Templating engine for dynamic HTML      |
| socket.io          | Real-time communication (WebSockets)    |
| bcryptjs           | Password hashing                        |
| jsonwebtoken       | Token-based authentication              |
| cookie-parser      | Handling cookies                        |
| dotenv             | Loading environment variables           |
| express-validator  | Form and input validation               |

---

## GitHub Repository and Live Hosting Link

- **GitHub Repository:** [https://github.com/Megach-ffs/Meyram](https://github.com/Megach-ffs/Meyram)
- **Live Hosted Version:** [Web App](https://guttural-furtive-bee.glitch.me/)

---

## Project Structure

```
/meyram (project root)
│
├── app.js                   # Entry point of the server
├── package.json             # Project metadata and dependencies
├── .env                     # Environment configuration (JWT secret, port)
├── .gitignore               # Ignored files/folders for version control
│
│
├── /views                   # EJS template files
│   ├── index.ejs
│   ├── register.ejs
│   ├── login.ejs
│   ├── user.ejs
│   └── 401.ejs
│
├── /routes                  # Routing modules
│   ├── index.js
│   └── /web
│       └── index.js
│   └── /api
│
├── /controllers             # Controller functions for each route
│   └── user.js
│
├── /services                # Business logic / data layer
│   └── user.js
│
├── /middleware              # Custom middleware (e.g., authentication)
│   └── auth.js
│
├── /sockets                 # WebSocket (Socket.IO) logic
│   └── chat.js
│
└── /validators              # Input validation rules using express-validator
    └── user.js
```

# This is the beginning of the project that begins the journey
- Hello
- World


## Plan:
- Chat room ✔️ 

- Authentication system ✔️

- Layered architecture ✔️

- CRUD users w/ validation (no admin panel yet) ✔️

- CRUD rooms

- CRUD posts (maybe)

- Frontend

This project will be finished!!!
