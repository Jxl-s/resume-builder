const puppeteer = require("puppeteer");
const fs = require("fs");

async function htmlToPDF(htmlContent, outputPath) {
    // Launch a headless browser
    const browser = await puppeteer.launch({
        product: "firefox",
    });

    // Open a new page
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    await page.pdf({ path: outputPath, format: "Letter", margin: 0 });

    // Close the browser
    await browser.close();

    console.log(`PDF saved at: ${outputPath}`);
}

// Example usage
// const htmlContent = "<html><body><h1>Hello, world!</h1></body></html>";
const outputPath = "output.pdf";

htmlToPDF(fs.readFileSync("pdftest.html", "utf8"), outputPath)
    .then(() => {
        console.log("PDF generation completed");
    })
    .catch((err) => {
        console.error("Error generating PDF:", err);
    });
