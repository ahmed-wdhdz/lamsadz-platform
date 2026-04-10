/**
 * Multer Configuration
 * File upload handling for images
 */

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { config } = require('./env');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lamsadz',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize || 5242880
  }
});

module.exports = upload;
