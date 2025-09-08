const tesseract = require("tesseract.js");
const pdfLib = require("pdf-lib"); // Alternative to pdf-poppler
const path = require("path");
const fs = require("fs").promises;
const { exec } = require("child_process");

/**
 * Convert PDF to images (Alternative: Uses pdf-lib + pdf2image for better performance)
 */
async function convertPdfToImages(pdfFilePath) {
    try {
        const outputDir = path.dirname(pdfFilePath);
        const outputFilePrefix = path.basename(pdfFilePath, path.extname(pdfFilePath));

        // Use pdf2image (Python-based, faster than pdf-poppler)
        const command = `python3 ./services/pdf2image_script.py ${pdfFilePath} ${outputDir}/${outputFilePrefix}`;
        
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("PDF Conversion Error:", stderr);
                    return reject(error);
                }
                console.log("PDF Conversion Success:", stdout);
                resolve(stdout);
            });
        });

        // Read converted images
        const files = await fs.readdir(outputDir);
        return files
            .filter(file => file.startsWith(outputFilePrefix) && file.endsWith(".png"))
            .map(file => path.join(outputDir, file));
    } catch (error) {
        console.error("Error converting PDF to images:", error);
        throw error;
    }
}

/**
 * Process PDF using Tesseract OCR
 */
async function processPdf(pdfFilePath) {
    try {
        console.log("Converting PDF to images...");
        const imagePaths = await convertPdfToImages(pdfFilePath);
        
        let extractedText = "";
        let totalConfidence = 0;

        for (const imagePath of imagePaths) {
            const { data: { text, confidence } } = await tesseract.recognize(imagePath, "eng", {
                logger: (m) => console.log(m), // Logs progress
            });
            extractedText += text + "\n";
            totalConfidence += confidence;
        }

        return { text: extractedText.trim(), confidence: totalConfidence / imagePaths.length };
    } catch (error) {
        console.error("Error processing PDF:", error);
        throw error;
    }
}

/**
 * Direct Tesseract OCR processing (For images only)
 */
async function processWithTesseract(filePath) {
    try {
        const { data: { text, confidence } } = await tesseract.recognize(filePath, "eng", {
            logger: (m) => console.log(m),
        });
        return { text, confidence };
    } catch (error) {
        console.error("Tesseract OCR Error:", error);
        throw error;
    }
}

// Export both functions
module.exports = { processPdf, processWithTesseract };