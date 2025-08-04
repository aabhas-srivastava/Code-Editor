# Real-Time Collaborative Code Editor

Welcome! This project is a real-time collaborative code editor built with React, Monaco Editor, Node.js, Socket.io, and MongoDB. It’s designed for anyone who wants to code together, live, in a beautiful and modern interface.

## Why This Project?

I wanted a code editor that feels fast, looks great, and lets multiple people work on the same code at the same time—without the hassle. This app is the result: simple to run, easy to use, and ready for you to hack on or extend.

## Features

- **Real-time collaboration:** See everyone’s changes instantly, no refresh needed.
- **Language selector:** Switch between Java, C, C++, Python, JavaScript, and more with a slick animated dropdown.
- **Active user count:** Know how many people are editing with you, live.
- **Monaco Editor:** Enjoy VS Code-like editing, themes, and fonts.
- **Persistent storage:** Your code is saved in MongoDB, so you don’t lose your work.
- **Modern UI:** Built with Vite and React for speed and smoothness.

## Tech Stack

- **Frontend:** React, Vite, Monaco Editor, Socket.io-client
- **Backend:** Node.js, Express, Socket.io, MongoDB

### Prerequisites

- Node.js (v16 or newer)
- npm
- MongoDB (local or Atlas)

### Setup

1. **Clone this repo:**
   ```bash
   git clone <repo-url>
   cd "Real-time Monaco Editor (Project)"
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start MongoDB:**
   - Make sure MongoDB is running locally (`mongod`) or update the connection string in `server/index.js` for Atlas.

5. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   - Go to [http://localhost:5173](http://localhost:5173)

## How to Use

- Open the app in several tabs or on different devices to see real-time collaboration in action.
- Pick your favorite language from the dropdown.
- Watch the active user count update as people join or leave.
- All code changes are synced and saved automatically.

## Customizing

- Want more languages? Add them in `App.jsx`.
- Prefer a different font or theme? Tweak the Monaco Editor options.
- Need authentication, chat, or multi-file support? The backend is ready for you to extend.

## Project Structure

```
Real-time Monaco Editor (Project)/
├── server/           # Node.js + Socket.io backend
│   └── index.js
├── src/              # React frontend
│   ├── App.jsx
│   ├── App.css
│   └── ...
├── package.json
├── README.md
└── ...
```

## License

MIT — use it, modify it, share it. If you build something cool with it, let me know!
