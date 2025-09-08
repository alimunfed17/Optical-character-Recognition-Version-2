import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("http://localhost:3000/api/invoice/process-invoice", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setData(res.data.extractedData);
        } catch (err) {
            console.error("Upload failed", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else if (err.message === "Network Error") {
                setError("Network Error. Please check your connection.");
            } else {
                setError("Failed to upload and process the invoice.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Invoice</h2>

            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                accept=".pdf,.jpg,.jpeg,.png"
            />

            {file && <p className="text-sm text-gray-600">Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}

            <button onClick={handleUpload} disabled={loading} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
                {loading ? "Processing..." : "Upload"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {data && (
                <div className="mt-4 p-4 bg-gray-100 rounded border border-gray-300 text-sm">
                    <h3 className="font-semibold mb-2">Extracted Invoice Data:</h3>
                    <pre className="whitespace-pre-wrap">{data}</pre>
                </div>
            )}
        </div>
    );
};

export default FileUpload;