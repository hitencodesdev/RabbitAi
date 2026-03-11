import { Router } from 'express';
import { uploadData } from '../controllers/uploadController.js';
import multer from 'multer';

const router = Router();

// Configure multer (Store in memory for rapid processing without disk I/O bottlenecks)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload Sales Data
 *     description: Uploads a `.csv` or `.xlsx` file containing sales data, generates an insights summary using Gemini AI, and emails it to the provided address.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: binary
 *                 description: The sales data file (.csv or .xlsx)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *             required:
 *               - data
 *               - email
 *     responses:
 *       200:
 *         description: Insights generated and sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 mailUrl:
 *                   type: string
 *                   format: uri
 *       400:
 *         description: Bad request (missing file or email)
 *       500:
 *         description: Internal server error
 */
router.post('/upload', upload.single('data'), uploadData);

export default router;
