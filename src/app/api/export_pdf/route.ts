import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "fs/promises";
import education from "./components/education";
import experience from "./components/experience";
import project from "./components/project";
import text from "./components/text";
import fonts from "../../fonts";
import heading from "./components/heading";

async function htmlToPDF(htmlContent: string, outputPath: string) {
    // Launch a headless browser
    const browser = await puppeteer.launch();

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

    const pdfBase = fs.readFileSync(
        path.join(process.cwd(), "resume_pdf/pdf_base.html"),
        "utf8"
    );

    let transformedPdf = pdfBase;

    // Transform the PDF
    transformedPdf = transformedPdf.replace("__NAME__", body.header.name);
    transformedPdf = transformedPdf.replace(
        "__SUBTITLE__",
        body.header.subtitle
    );
    transformedPdf = transformedPdf.replace("__CONTACT__", body.header.contact);

    // Settings
    const font = body.settings.font as keyof typeof fonts;
    transformedPdf = transformedPdf.replace(
        "__FONT_EXPORT__",
        fonts[font].export
    );
    transformedPdf = transformedPdf.replace(
        "__FONT_FAMILY__",
        fonts[font].display
    );

    transformedPdf = transformedPdf.replace(
        "__TITLE_SIZE__",
        body.settings.titleSize
    );

    transformedPdf = transformedPdf.replace(
        "__TITLE_HEIGHT__",
        ((body.settings.titleSize as number) * 1.1).toString()
    );

    transformedPdf = transformedPdf.replace(
        "__HEADING_SIZE__",
        body.settings.headingSize
    );

    transformedPdf = transformedPdf.replace(
        "__CONTENT_SIZE__",
        body.settings.contentSize
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_TOP__",
        body.settings.marginTop
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_BOTTOM__",
        body.settings.marginBottom
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_LEFT__",
        body.settings.marginLeft
    );

    transformedPdf = transformedPdf.replace(
        "__MARGIN_RIGHT__",
        body.settings.marginRight
    );

    // Make the sections
    let sectionString = "";
    for (const section of body.sections) {
        sectionString += `<section>`;
        sectionString += heading(section.title);
        // Add the articles
        for (const item of section.items) {
            if (item.type === "education") {
                sectionString += education(item.value);
            }

            if (item.type === "experience") {
                sectionString += experience(item.value);
            }

            if (item.type === "project") {
                sectionString += project(item.value);
            }

            if (item.type === "project-nolinks") {
                sectionString += project({ ...item.value, hideLinks: true });
            }

            if (item.type === "text") {
                sectionString += text(item.value.text);
            }
        }

        sectionString += `</section>`;
    }

    transformedPdf = transformedPdf.replace("__SECTIONS__", sectionString);

    const uuid = uuidv4();
    const outputPath = path.join(
        process.cwd(),
        "resume_pdf/builds",
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
