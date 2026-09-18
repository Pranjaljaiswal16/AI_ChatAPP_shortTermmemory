const { GoogleGenAI } = require("@google/genai");

const getGeminiMimeType = (file) => {
  const mimeType = file?.mimetype || "image/jpeg";
  return mimeType.startsWith("image/") ? mimeType : "image/jpeg";
};

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment.",
    );
  }

  return new GoogleGenAI({ apiKey });
};

async function generateCaption(base64ImageFile, file = {}) {
  const ai = getGenAIClient();
  const mimeType = getGeminiMimeType(file);

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    system_instruction: `
      You are an expert in generating captions for images.
      You generate a single caption for the image.
      Your caption should be short and concise.
      You use hashtags in the caption.
    `,

    input: [
      {
        type: "text",
        text: "Caption this image.",
      },
      {
        type: "image",
        data: base64ImageFile,
        mime_type: mimeType,
      },
    ],
  });

  return interaction.output_text;
}

module.exports = {
  generateCaption,
  getGeminiMimeType,
};
