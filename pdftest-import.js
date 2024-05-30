const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "resume_pdf/imports/" });

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pdftest-import.html"));
});

// Handle PDF file uploads and text extraction
app.post("/upload", upload.single("pdf"), async (req, res) => {
    const pdfPath = path.join(__dirname, "resume_pdf/imports", req.file.filename);
    const dataBuffer = fs.readFileSync(pdfPath);

    try {
        const data = await pdfParse(dataBuffer);
        res.send(data.text);
    } catch (error) {
        res.status(500).send("Error parsing PDF");
    } finally {
        fs.unlinkSync(pdfPath); // Clean up the uploaded file
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
