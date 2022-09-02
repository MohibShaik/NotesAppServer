const dotenv = require('dotenv');
dotenv.config();

const cloudinary = require('cloudinary').v2;
const {
  CloudinaryStorage,
} = require('multer-storage-cloudinary');
const multer = require('multer');

initializeCloudinary = async (folderName) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folderName,
      },
    });
    return storage;
  } catch (error) {
    return error;
  }
};

module.exports = {
  initializeCloudinary,
};
