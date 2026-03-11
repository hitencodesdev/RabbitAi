import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

import uploadRoutes from './routes/uploadRoutes.js';
import { swaggerSpec } from './config/swaggerConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* -----------------------------
   CORS Configuration (FIXED)
------------------------------*/

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin === "https://rabbit-ai-xi.vercel.app" ||
      origin === "https://rabbitai-uzsu.onrender.com" ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

app.use(cors(corsOptions));
/* -----------------------------
   Rate Limiting
------------------------------*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

/* -----------------------------
   Body Parsers
------------------------------*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------
   Static Uploads (Debugging)
------------------------------*/

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* -----------------------------
   Routes
------------------------------*/

app.use('/api', uploadRoutes);

/* -----------------------------
   Swagger Docs
------------------------------*/

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -----------------------------
   Base Route
------------------------------*/

app.get('/', (req, res) => {
  res.json({
    message: 'Sales Insight Automator API is running.'
  });
});

export default app;