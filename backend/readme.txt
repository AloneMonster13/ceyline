emerald-quiz/
├─ backend/                 # Node/Express backend (Render)
│   ├─ .env                 # Store MONGO_URI here
│   ├─ package.json
│   ├─ server.js            # Main Express server
│   └─ routes/
│       └─ addUser.js       # POST /addUser route
├─ frontend/                # Your React app (Vite + TS + shadcn)
│   ├─ package.json
│   ├─ vite.config.ts
│   └─ src/
│       └─ components/
│           └─ auth/
│               └─ EmailLogin.tsx
├─ README.md