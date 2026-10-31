# NoteNest – Personal Notes Management Application

NoteNest is a full-stack web application built using the MERN stack that allows users to securely create, manage, and access their personal notes. It provides user authentication, user-specific data access, and complete CRUD functionality through a responsive interface.

## Features

- **User Authentication:** Signup and login using JSON Web Tokens (JWT).
- **Password Security:** Passwords are hashed using bcrypt before being stored.
- **Personalized Notes:** Each user can access and manage only their own notes.
- **CRUD Operations:** Create, read, update, and delete notes.
- **Protected Routes:** Authentication is required to access the notes dashboard.
- **Input Validation:** Frontend and backend validation for user inputs.
- **Persistent Storage:** Notes and user information are stored in MongoDB.
- **State Management:** React Context API manages application state and note operations.
- **Session Management:** JWT-based authentication with automatic session verification.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, HTML5, CSS3, Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT), bcryptjs |
| State Management | React Context API |
| Routing | React Router |

## Application Architecture

NoteNest follows a client-server architecture.

1. **Frontend:** React components provide the user interface and communicate with the backend using HTTP requests.
2. **Backend:** Express.js exposes REST API endpoints for authentication and note management.
3. **Authentication:** JWT tokens are issued after successful signup or login. Protected routes verify these tokens using authentication middleware.
4. **Database:** MongoDB stores user information and notes. Each note is associated with its owner's user ID.
5. **Authorization:** Note operations are restricted to the authenticated user's records.

## Project Structure

```text
NoteNest/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── About.js
│   │   ├── AddNote.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   ├── Noteitem.js
│   │   ├── Notes.js
│   │   └── Signup.js
│   │
│   ├── context/
│   │   └── notes/
│   │       ├── NoteState.js
│   │       └── noteContext.js
│   │
│   ├── App.js
│   ├── App.css
│   └── index.css
│
├── backend/
│   ├── middleware/
│   │   └── fetchuser.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── db.js
│   ├── index.js
│   └── .env
│
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/createuser` | Register a new user |
| POST | `/api/auth/login` | Authenticate an existing user |
| POST | `/api/auth/getuser` | Retrieve authenticated user details |

### Notes Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes/fetchallnotes` | Fetch notes belonging to the logged-in user |
| POST | `/api/notes/addnote` | Create a new note |
| PUT | `/api/notes/updatenote/:id` | Update an existing note |
| DELETE | `/api/notes/deletenote/:id` | Delete a note |

Protected endpoints require the `auth-token` request header containing a valid JWT.

## Database Design

### User Collection

Stores registered user information, including name, email, and hashed password.

### Notes Collection

Each note contains:

| Field | Description |
|---|---|
| `_id` | Unique note identifier |
| `user` | Reference to the owning user |
| `title` | Note title |
| `description` | Note content |
| `tag` | Note category (defaults to General) |
| `date` | Note creation date |

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB installed and running locally
- Git

### 1. Clone the repository

```bash
git clone https://github.com/kushagra-abc/notenest.git
cd notenest
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
MONGO_URI=mongodb://127.0.0.1:27017/notenest
PORT=5000
JWT_SECRET=your_secure_random_secret
```

Replace the JWT secret with your own randomly generated secret. Never commit your `.env` file to GitHub.

### 5. Start the backend

From the `backend` directory:

```bash
npm start
```

The backend runs at:

`http://localhost:5000`

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm start
```

The frontend runs at:

`http://localhost:3000`

## Future Improvements

- Search and filter notes by title or tag.
- Rich-text editing for note descriptions.
- Improved responsive design and user experience.
- Automated backend and frontend testing.
- Deployment with a production database and secure authentication configuration.

## Author

**Kushagra Raj Kashyap**

[GitHub – kushagra-abc](https://github.com/kushagra-abc)
