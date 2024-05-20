const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pdftest-import.html"));
});

// Handle PDF file uploads and text extraction
app.post("/upload", upload.single("pdf"), async (req, res) => {
    const pdfPath = path.join(
        __dirname,
        "resume_pdf/imports",
        "2c10aa91-6f7f-4fe8-9eb0-9420ebd3844a.pdf"
    );
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
