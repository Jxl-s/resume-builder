import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "fs/promises";
import education from "../../../utils/server/components/education";
import experience from "../../../utils/server/components/experience";
import project from "../../../utils/server/components/project";
import text from "../../../utils/server/components/text";
import fonts from "../../fonts";
import heading from "../../../utils/server/components/heading";

async function htmlToPDF(htmlContent: string, outputPath: string) {
    // Launch a headless browser
    const browser = await puppeteer.launch({
        product: process.env.PUPPETEER_PRODUCT,
    });

    // Open a new page
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    await page.pdf({ path: outputPath, format: "Letter" });

    // Close the browser
    await browser.close();

    console.log(`PDF saved at: ${outputPath}`);
}

export async function POST(request: NextRequest) {
    // Get the json body
    const body = await request.json();

    const uuid = uuidv4();
    const outputPath = path.join(
        process.cwd(),
        "resume_pdf/exports",
        `${uuid}.pdf`
    );

    try {
        await htmlToPDF(transformedPdf, outputPath);
        // also write the HTML to the same file, but .html
        fs.writeFileSync(outputPath.replace(".pdf", ".html"), transformedPdf);

        const buffer = await readFile(outputPath);

        // set the headers to tell the browser to download the file
        const headers = new Headers();

        // remember to change the filename `test.pdf` to whatever you want the downloaded file called
        headers.append(
            "Content-Disposition",
            'attachment; filename="resume.pdf"'
        );

        headers.append("Content-Type", "application/pdf");
        return new Response(buffer, { headers });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
