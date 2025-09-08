const express = require("express");
const multer = require("multer");
const path = require("path");
const { processInvoice } = require("../controllers/invoiceController");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Route to process invoice
router.post("/process-invoice", upload.single("file"), processInvoice);

module.exports = router;