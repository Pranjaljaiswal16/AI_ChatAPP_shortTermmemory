require("dotenv").config();
const ImageKit = require("imagekit");

const getImageKitClient = () => {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error(
      "ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env."
    );
  }

  return new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });
};

const uploadImage = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("A valid image file is required for upload.");
  }

  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const imageKit = getImageKitClient();
  const extension = file.originalname && file.originalname.includes(".")
    ? file.originalname.slice(file.originalname.lastIndexOf("."))
    : "";

  return imageKit.upload({
    file: file.buffer,
    fileName: `post-${Date.now()}${extension}`,
    folder: "/posts",
    useUniqueFileName: true,
  });
};

module.exports = { uploadImage };