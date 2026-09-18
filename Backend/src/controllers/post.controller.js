const postModel = require("../models/post.model.js");
const { generateCaption } = require("../service/ai.service.js");
const { uploadImage } = require("../service/imagekit.service.js");

const createPostController = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }
  try {
    const base64File = file.buffer.toString("base64");
    const caption = await generateCaption(base64File, file);
    const image = await uploadImage(file);
    const post = await postModel.create({
      image: image.url,
      caption,
      user: req.user._id,
    });

    return res.status(201).json({
      post,
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    return res.status(400).json({
      message: error.message || "Unable to create post",
    });
  }
};

module.exports = { createPostController };
