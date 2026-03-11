import { parseData } from '../services/dataParser.js';
import { generateSummary } from '../services/aiEngine.js';
import { sendEmail } from '../services/emailService.js';

export const uploadData = async (req, res) => {
  try {
    const file = req.file;
    const { email } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!email) {
      return res.status(400).json({ error: 'No recipient email provided' });
    }

    // 1. Parse File Content
    const parsedData = await parseData(file);

    // 2. Generate AI Summary
    const aiSummary = await generateSummary(parsedData);

    // 3. Send Email
    const mailInfo = await sendEmail(email, aiSummary);

    res.status(200).json({ 
      message: 'Insights generated and sent successfully!',
      summary: aiSummary,
      mailUrl: mailInfo.url // Optionally return Ethereal URL to frontend for demo purposes
    });

  } catch (error) {
    console.error('File upload logic error:', error);
    res.status(500).json({ error: error.message || 'Error processing the file' });
  }
};
