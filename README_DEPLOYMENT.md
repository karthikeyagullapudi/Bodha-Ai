# 🚀 Bodha AI - Deployment & Live Launch Guide

This guide walks you through publishing **Bodha AI** live on the web by the end of today.

---

## 🏗 System Requirements & Services

| Service | Recommended Host | Free Tier Available? |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | ✅ Yes |
| **Backend API** | [Render](https://render.com) or [Railway](https://railway.app) | ✅ Yes |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | ✅ Yes |

---

## 🔑 Required Environment Variables

### 1. Backend (`backend/.env`)

Ensure the following environment variables are set in your backend hosting environment (e.g. Render Dashboard):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/Bodha_AI?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key

# AI Model Credentials
GEMINI_API_KEY=your_google_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TEVILY_API_KEY=your_tavily_search_api_key

# Email Credentials (For Verification Emails)
GOOGLE_USER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

---

## 🌐 Step 1: Deploy Backend to Render

1. Push your repository to **GitHub**.
2. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set Build & Start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Under **Environment Variables**, paste all keys from your `backend/.env`.
7. Click **Deploy Web Service**. Render will generate a URL like `https://bodha-ai-backend.onrender.com`.

---

## 💻 Step 2: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Set **Framework Preset** to `Vite`.
4. Set **Root Directory** to `frontend`.
5. (Optional) If hosting backend under a custom domain or Render URL, update the `baseURL` in:
   - `frontend/src/features/chat/service/chat.api.js`
   - `frontend/src/features/auth/services/auth.api.js`
   Or use an environment variable `VITE_API_BASE_URL`.
6. Click **Deploy**. Vercel will generate your live production URL (e.g. `https://bodha-ai.vercel.app`).

---

## ⚙️ Step 3: CORS & Verification Check

In `backend/app.js`, verify CORS configuration allows your Vercel frontend URL:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://bodha-ai.vercel.app',
  credentials: true
}));
```

---

## 🎉 Live Features Ready for Users

- 💬 **Gemini 2.5 Flash AI Intelligence**: Fast, structured markdown answers with code snippets.
- 🌐 **Real-time Web Search Integration**: Tavily API fallback for up-to-date web research.
- 💡 **Interactive Prompt Starter Cards**: One-click prompt launchers for Coding, Web Research, and Architecture.
- 📋 **Copy Code & Full Message Toolbar**: Easily copy code blocks with syntax headers.
- ✏️ **Inline Session Rename & Delete**: Complete control over recent chat history.
- 📱 **Mobile Responsive Navigation**: Seamless user experience across mobile and desktop.
