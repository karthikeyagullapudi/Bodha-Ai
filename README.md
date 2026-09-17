# Bodha AI

A full-stack AI chat application built with React, Node.js, and LangChain that supports real-time web search and multi-model fallback logic.

Bodha AI allows users to chat with an AI assistant that can browse the web live via Tavily to answer queries about current events, news, sports, and real-time facts. It features a dark-themed glassmorphism interface, thread management, markdown rendering, and automatic conversation titling.

## Features

- **Live Web Search:** Uses Tavily search via LangChain tools to fetch up-to-date information for queries beyond model knowledge cutoffs (e.g. current sports results, news, weather).
- **Multi-Model Fallback System:** Tries several Gemini models in turn (each has its own free-tier rate limit), then Mistral Small, so a rate-limited model doesn't stop the chat.
- **Auto Chat Titling:** Generates short 2–4 word titles for new chat sessions using AI.
- **Rich Markdown & Code Blocks:** Renders tables, lists, and code blocks with syntax highlighting and a one-click copy button.
- **Full Chat History:** Create, rename, delete, and switch between past chat threads.
- **Authentication:** Signup with email verification (sent through the Gmail API), login with JWTs in HTTP-only cookies, bcrypt password hashing, and rate limiting on auth and chat endpoints.
- **Live Updates (Socket.IO):** An authenticated real-time connection shows its status in the header and streams what the AI is doing ("Searching the web for …") while a reply is generated.

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Markdown:** `react-markdown` + `remark-gfm`
- **Networking:** Axios, `socket.io-client`

### Backend
- **Runtime:** Node.js (Express 5)
- **Database:** MongoDB with Mongoose
- **AI Orchestration:** LangChain JS (`@langchain/google-genai`, `@langchain/mistralai`)
- **Web Search Engine:** `@tavily/core`
- **Auth & Security:** JWT (`jsonwebtoken`), `cookie-parser`, `bcrypt`

## Project Structure

```text
Bodha-Ai/
├── backend/
│   ├── src/
│   │   ├── config/        # MongoDB connection
│   │   ├── controller/    # Auth & Chat HTTP request handlers
│   │   ├── middleware/    # JWT verification & rate limiting
│   │   ├── model/         # User, Chat, and Message database schemas
│   │   ├── routes/        # Express API endpoints
│   │   ├── services/      # AI service (LangChain agents & Tavily tool), email
│   │   └── sockets/       # Socket.IO setup
│   ├── app.js             # Express middleware & app configuration
│   └── server.js          # Entry point (HTTP server + DB connection)
│
└── frontend/
    ├── src/
    │   ├── app/           # Redux store
    │   ├── features/
    │   │   ├── auth/      # Login & Signup pages and slice
    │   │   └── chat/      # Chat Dashboard, components, API hooks
    │   └── main.jsx
    └── vite.config.js
```

## Getting Started

### 1. Prerequisites
- Node.js (v20 or higher; v24 recommended)
- MongoDB instance (local or MongoDB Atlas connection string)
- API Keys:
  - Google Gemini API Key
  - Mistral AI API Key
  - Tavily Search API Key
  - Google OAuth client + refresh token for the Gmail API (to send verification emails)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

GOOGLE_USER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

See `backend/.env.example` for the optional settings (`APP_URL`, `GEMINI_MODELS`).

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Vite forwards `/api` and Socket.IO requests to the backend on port 3000.

## Deployment

The app deploys as a single Node web service (for example on Render): Express serves the built React app, so the site and API share one URL.

- **Build command:** `npm run build` (from the repository root)
- **Start command:** `npm start`
- **Environment:** the variables from `backend/.env`, plus `APP_URL` set to the public URL. Don't set `PORT`; the host provides it.

Email is sent over HTTPS through the Gmail API rather than SMTP, because hosts like Render's free plan block outgoing SMTP. The Gmail API must be enabled in the Google Cloud project, and the refresh token needs the `https://mail.google.com/` or `gmail.send` scope. If the OAuth consent screen is in "Testing" mode, Google expires refresh tokens after 7 days, so publish it to production.

## How the AI Service Works

The AI service (`backend/src/services/ai.service.js`) uses LangChain `createAgent` with a custom `searchInternet` tool powered by Tavily:

1. **System Prompt & Date Injection:** Each turn injects today's date into the system message so the LLM understands current context.
2. **Tool Invocation:** When asked about sports results, news, or recent facts, the agent automatically executes Tavily web search to retrieve context before answering.
3. **Fallback Logic:** The agent tries `gemini-3.6-flash`, `gemini-2.5-flash` and `gemini-flash-lite-latest` in order (override with `GEMINI_MODELS`), then `mistral-small-latest`. If every model fails, the user gets a "busy, try again" message within seconds and nothing is saved.

## License

ISC
