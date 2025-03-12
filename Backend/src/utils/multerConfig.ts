import 'dotenv/config'; // Loads environment variables from .env
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Validate environment variables
if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error('Cloudinary environment variables are not set. Check .env file.');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Configure Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'PlayFinder', // Adjust the folder name as needed
      format: file.mimetype.split('/')[1], // Keep the file's original format
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Unique identifier
    };
  },
});

// Initialize Multer with Cloudinary Storage
const upload = multer({ storage });

export default upload;
