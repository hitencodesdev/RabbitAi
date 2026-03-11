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

const allowedOrigins = [
  "https://rabbit-ai-xi.vercel.app",
  "https://rabbitai-m5ka.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a Vercel deployment URL
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      // Return false instead of Error to prevent Express error handling issues
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));



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