# Sales Insight Automator 🐰

The **Sales Insight Automator** is a "Quick-Response Tool" engineered to help executive teams distill massive CSV/Excel datasets into clean, actionable AI-generated briefs instantly delivered to their inbox.

## 🚀 Quick Start (Docker Compose)

The entire ecosystem is containerized for portability. Follow these steps:

1. **Clone the repository.**
2. **Environment Variables:**
   - Navigate to the `backend` directory.
   - Copy `.env.example` to `.env` (`cp backend/.env.example backend/.env`).
   - Fill in your `GEMINI_API_KEY`. (If you omit SMTP email details, the app automatically falls back to an Ethereal Test Email and logs the preview URL in your terminal).
3. **Run the stack:**
   ```bash
   docker-compose up --build
   ```
4. **Access Applications:**
   - **Frontend UI:** [https://rabbit-ai-xi.vercel.app/](https://rabbit-ai-xi.vercel.app/) (Production) or [http://localhost:5173](http://localhost:5173) (Local)
   - **Backend API:** [https://rabbitai-uzsu.onrender.com](https://rabbitai-uzsu.onrender.com) (Production) or [http://localhost:5000](http://localhost:5000) (Local)
   - **Swagger Docs:** [https://rabbitai-uzsu.onrender.com/api-docs](https://rabbitai-uzsu.onrender.com/api-docs)

## 🛡️ Security Implementations

"Secured Endpoints" interpretation within this ecosystem:

1. **DDoS Protection via Rate Limiting:** 
   The `express-rate-limit` middleware ensures single IP addresses do not abuse our AI generation endpoint or spam SMTP servers (Capped at 100 requests / 15 mins).
2. **CORS Policy Restrictions:**
   The backend restricts Cross-Origin Resource Sharing (CORS) strictly allowing traffic only from trusted frontend URLs (`https://rabbit-ai-xi.vercel.app`, and local environments).
3. **Memory Storage Uploads over Disk I/O:**
   Multer is configured using `multer.memoryStorage()`. This prevents malicious file payloads from writing persistent arbitrary executable scripts to the disk. Furthermore, `multer` enforces a 10MB hard-limit to prevent buffer overflows.
4. **Environment Isolation:**
   All sensitive API keys and mail credentials are kept out of source using `.env` files.

## ☁️ Deployment

- **Frontend:** Deployed easily to Vercel/Netlify using the built `dist` from Vite.
- **Backend:** Deployed via Render/Railway leveraging the robust `Dockerfile`.
- **CI/CD:** Governed by our `.github/workflows/ci.yml` pipeline validating builds upon Pull Requests to `main`.
