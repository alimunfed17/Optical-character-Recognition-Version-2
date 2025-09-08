const { exec } = require("child_process");

exports.processWithOcropus = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`ocropus-rpred -Q 2 ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve({ text: stdout, confidence: 0.85 }); // Approx confidence
            }
        });
    });
};