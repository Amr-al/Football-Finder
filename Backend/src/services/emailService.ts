import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Interface for email options
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create a transporter
const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host (e.g., smtp.gmail.com)
  port: 587, // Use 465 for secure, or 587 for TLS
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Get from environment variables
    pass: process.env.EMAIL_PASS, // Get from environment variables
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with transporter configuration:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Function to send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"Play Finder" <${process.env.EMAIL_USER}>`, // Replace with your "from" email
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
