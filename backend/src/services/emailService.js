import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { marked } from 'marked';
dotenv.config();

/**
 * Sends the generated AI summary via email. 
 * Uses Ethereal Email by default if SMTP credentials are not configured.
 */
export const sendEmail = async (toEmail, summaryText) => {
  let transporter;

  // Use Ethereal fake SMTP for testing if real SMTP isn't set up
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log(`[Email Service] Operating in Ethereal Test Mode`);
  } else {
    // Real SMTP configuration
    transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service wrapper for easier connection
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password
      },
    });
  }

  const htmlContent = marked.parse(summaryText);

  const mailOptions = {
    from: `"Sales Insight Automator 🐰" <${process.env.SMTP_USER || 'no-reply@rabbit.ai'}>`,
    to: toEmail,
    subject: 'Your Executive Sales Outline - Q1 2026',
    text: summaryText,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0; font-size: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Executive Sales Brief</h2>
        <p style="color: #64748b; font-size: 15px;">Here is the distilled structural summary of your latest sales data upload:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; margin: 25px 0; font-size: 15px; line-height: 1.6; color: #334155;">
          ${htmlContent}
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 30px;">
          Automated securely by Rabbit AI - Sales Insight Automator
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  
  const testUrl = nodemailer.getTestMessageUrl(info);
  if (testUrl) {
    console.log(`Preview Email sent to Ethereal URL: ${testUrl}`);
  }
  
  return { 
    messageId: info.messageId, 
    url: testUrl || null
  };
};
