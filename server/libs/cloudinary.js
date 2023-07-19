const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: 'dgjqarywu',
  api_key: '454465712334421',
  api_secret: 'FMSVbmdJhbhIo2eWU1s4YD8K0d8',
});

const uploadImage = async (filePath) => {
  return await cloudinary.v2.uploader.upload(filePath, {
    folder: 'patientsAvatar',
  });
};

const deleteImage = async (publicId) => {
  return await cloudinary.v2.uploader.destroy(publicId);
};

module.exports = {
  uploadImage,
  deleteImage,
};
