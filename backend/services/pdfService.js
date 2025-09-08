const { spawn } = require("child_process");

exports.convertPdfToImages = (filePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", ["./services/convert_pdf.py", filePath]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`PDF Conversion Error: ${data}`);
        });

        pythonProcess.on("close", () => {
            try {
                const parsedResult = JSON.parse(result);
                if (parsedResult.success) {
                    resolve(parsedResult.images); // Returns array of image paths
                } else {
                    reject(parsedResult.error);
                }
            } catch (error) {
                reject("Failed to parse PDF conversion output");
            }
        });
    });
};