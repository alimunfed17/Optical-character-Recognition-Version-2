const axios = require("axios");

const GEMINI_VALIDATION_API = process.env.GEMINI_VALIDATION_API || "https://your-gemini-api.com/validate";

exports.processWithGeminiAI = async (text) => {
    try {
        const response = await axios.post("GEMINI_API_URL", { text });
        return { text: response.data.processedText, confidence: response.data.confidence || 0.95 };
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return { text: "", confidence: 0 };
    }
};

exports.validateWithGeminiAI = async (text) => {
    try {
        const response = await axios.post("GEMINI_VALIDATION_API", { text });
        return response.data.validatedText;
    } catch (error) {
        console.error("Validation Error:", error);
        return text; // Return original text if validation fails
    }
};