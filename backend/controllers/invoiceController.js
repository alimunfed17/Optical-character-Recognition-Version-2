// const fs = require("fs").promises;
// const path = require("path");
// const { convertPdfToImages } = require("../services/pdfService");
// const { processWithTesseract } = require("../services/tesseractService");
// const { processWithEasyOCR } = require("../services/easyOCRService");
// const { validateWithLLM } = require("../services/geminiService");

// const extractedDataFile = path.join(__dirname, "../data/extractedInvoices.json");

// exports.processInvoice = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded." });
//     }

//     const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
//     if (!allowedMimeTypes.includes(req.file.mimetype)) {
//         return res.status(400).json({ error: "Invalid file type." });
//     }

//     const filePath = req.file.path;

//     try {
//         console.log("Processing file:", filePath);

//         let imagePaths = [];
//         if (req.file.mimetype === "application/pdf") {
//             imagePaths = await convertPdfToImages(filePath); // 🔥 Use new fast conversion
//         } else {
//             imagePaths = [filePath]; // If image, process directly
//         }

//         let bestExtractedData = { text: "", confidence: 0 };

//         for (const imagePath of imagePaths) {
//             const tesseractResult = await processWithTesseract(imagePath);
//             const easyOCRResult = await processWithEasyOCR(imagePath);

//             console.log("Tesseract Result:", tesseractResult);
//             console.log("EasyOCR Result:", easyOCRResult);

//             const bestResult = tesseractResult.confidence > easyOCRResult.confidence ? tesseractResult : easyOCRResult;
//             if (bestResult.confidence > bestExtractedData.confidence) {
//                 bestExtractedData = bestResult;
//             }
//         }

//         if (!bestExtractedData.text) {
//             return res.status(500).json({ error: "Failed to extract text from invoice." });
//         }

//         // Validate extracted data using LLM
//         const validatedData = await validateWithLLM(bestExtractedData.text);

//         let existingData = [];
//         try {
//             const fileContent = await fs.readFile(extractedDataFile, "utf-8");
//             existingData = JSON.parse(fileContent) || [];
//         } catch (err) {
//             if (err.code !== "ENOENT") throw err;
//         }

//         const storedData = { text: validatedData, timestamp: new Date().toISOString() };
//         existingData.push(storedData);

//         await fs.writeFile(extractedDataFile, JSON.stringify(existingData, null, 2));

//         res.json({ extractedData: validatedData });

//     } catch (error) {
//         console.error("Error processing invoice:", error);
//         res.status(500).json({ error: "Failed to process the invoice." });
//     }
// };



const fs = require("fs").promises;
const path = require("path");
const { convertPdfToImages } = require("../services/pdfService");
const { processWithTesseract } = require("../services/tesseractService");
// const { processWithEasyOCR } = require("../services/easyOCRService"); // ❌ Commented out
const { validateWithGeminiAI } = require("../services/geminiService");

const extractedDataFile = path.join(__dirname, "../data/extractedInvoices.json");

exports.processInvoice = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type." });
    }

    const filePath = req.file.path;

    try {
        console.log("Processing file:", filePath);

        let imagePaths = [];
        if (req.file.mimetype === "application/pdf") {
            imagePaths = await convertPdfToImages(filePath); 
        } else {
            imagePaths = [filePath]; // If image, process directly
        }

        let bestExtractedData = { text: "", confidence: 0 };

        for (const imagePath of imagePaths) {
            const tesseractResult = await processWithTesseract(imagePath);
            // const easyOCRResult = await processWithEasyOCR(imagePath); // ❌ Commented out

            console.log("Tesseract Result:", tesseractResult);
            // console.log("EasyOCR Result:", easyOCRResult); // ❌ Commented out

            // Since EasyOCR is removed, we only consider Tesseract's result
            bestExtractedData = tesseractResult;
        }

        if (!bestExtractedData.text) {
            return res.status(500).json({ error: "Failed to extract text from invoice." });
        }

        // Validate extracted data using LLM
        const validatedData = await validateWithGeminiAI(bestExtractedData.text);


        let existingData = [];
        try {
            const fileContent = await fs.readFile(extractedDataFile, "utf-8");
            existingData = JSON.parse(fileContent) || [];
        } catch (err) {
            if (err.code !== "ENOENT") throw err;
        }

        const storedData = { text: validatedData, timestamp: new Date().toISOString() };
        existingData.push(storedData);

        await fs.writeFile(extractedDataFile, JSON.stringify(existingData, null, 2));

        res.json({ extractedData: validatedData });

    } catch (error) {
        console.error("Error processing invoice:", error);
        res.status(500).json({ error: "Failed to process the invoice." });
    }
};
