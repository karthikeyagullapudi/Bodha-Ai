# Bodha AI

A full-stack AI chat application built with React, Node.js, and LangChain that supports real-time web search and multi-model fallback logic.

Bodha AI allows users to chat with an AI assistant that can browse the web live via Tavily to answer queries about current events, news, sports, and real-time facts. It features a dark-themed glassmorphism interface, thread management, markdown rendering, and automatic conversation titling.

## Features

- **Live Web Search:** Uses Tavily search via LangChain tools to fetch up-to-date information for queries beyond model knowledge cutoffs (e.g. current sports results, news, weather).
- **Multi-Model Fallback System:** Uses Gemini 3.6 Flash as the primary model and falls back to Mistral Small if rate limits (HTTP 429) or quota errors occur.
- **Auto Chat Titling:** Generates short 2–4 word titles for new chat sessions using AI.
- **Rich Markdown & Code Blocks:** Renders tables, lists, and code blocks with syntax highlighting and a one-click copy button.
- **Full Chat History:** Create, rename, delete, and switch between past chat threads.
- **Authentication:** Secure user signup and login using JWTs stored in HTTP-only cookies with bcrypt password hashing.
- **Socket.IO Integration:** Backend server prepared with WebSockets for real-time state sync.

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
│   │   ├── middleware/    # Auth middleware (JWT verification)
│   │   ├── model/         # User, Chat, and Message database schemas
│   │   ├── routes/        # Express API endpoints
│   │   ├── services/      # AI service (LangChain agents & Tavily tool)
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
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas connection string)
- API Keys:
  - Google Gemini API Key
  - Mistral AI API Key
  - Tavily Search API Key

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
```

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

Open `http://localhost:5173` in your browser.

## How the AI Service Works

The AI service (`backend/src/services/ai.service.js`) uses LangChain `createAgent` with a custom `searchInternet` tool powered by Tavily:

1. **System Prompt & Date Injection:** Each turn injects today's date into the system message so the LLM understands current context.
2. **Tool Invocation:** When asked about sports results, news, or recent facts, the agent automatically executes Tavily web search to retrieve context before answering.
3. **Fallback Logic:** If the primary model (`gemini-3.6-flash`, override with `GEMINI_MODEL`) returns a rate-limit error, the service automatically falls back to `mistral-small-latest` so responses never fail.

## License

ISC
