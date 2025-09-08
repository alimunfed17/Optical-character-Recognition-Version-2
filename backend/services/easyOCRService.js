const { spawn } = require("child_process");

exports.processWithEasyOCR = (filePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", ["./services/easyocr_script.py", filePath]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`EasyOCR Error: ${data}`);
        });

        pythonProcess.on("close", () => {
            try {
                const parsedResult = JSON.parse(result);
                resolve(parsedResult);
            } catch (error) {
                reject("Failed to parse EasyOCR output");
            }
        });
    });
};
