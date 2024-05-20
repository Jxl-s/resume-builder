import { NextRequest } from "next/server";
import { z } from "zod";
import { BaseController } from "./BaseController";
import { importPrompt } from "@/utils/server/prompts";
import { promptMetaLlama } from "@/utils/server/prompt_llm";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import pdfParse from "pdf-parse";
import puppeteer from "puppeteer";
import { pdfSchema, transformPdf } from "@/utils/server/transform_pdf";

const IMPORT_PATH = path.join(process.cwd(), "resume_pdf/imports");
const EXPORT_PATH = path.join(process.cwd(), "resume_pdf/exports");

async function htmlToPDF(htmlContent: string, outputPath: string) {
    // Launch a headless browser
    const browser = await puppeteer.launch({
        product: process.env.PUPPETEER_PRODUCT as "chrome" | "firefox",
    });

    // Open a new page
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: "Letter" });
    await browser.close();

    console.log(`PDF saved at: ${outputPath}`);
}

// would be so much better if i used OpenAI
export const ResumeController = {
    async importResume(req: NextRequest) {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const textInput = formData.get("text") as string;

        let text = "";
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            if (file.type !== "application/pdf") {
                return BaseController.makeStatus(400, "Invalid file type");
            }

            // Write file to folder
            const uuid = uuidv4();
            const outputPath = path.join(IMPORT_PATH, `${uuid}.pdf`);

            fs.writeFileSync(outputPath, buffer);

            // Process the written PDF
            const fileBuffer = fs.readFileSync(outputPath);
            try {
                const data = await pdfParse(fileBuffer);
                text = data.text;
            } catch (e) {
                console.error(e);
                return BaseController.makeStatus(500, "Failed to parse PDF");
            }
        } else if (textInput) {
            text = textInput;
        }

        // Make the prompt
        let prompt = importPrompt;
        prompt = prompt.replace("__RESUME_TEXT__", text);

        const response = await promptMetaLlama({
            message: prompt,
        });

        return BaseController.makeSuccess(200, JSON.parse(response));
    },
    async exportResume(req: NextRequest) {
        const body = await req.json();
        const data = BaseController.checkSchema(pdfSchema, body);
        if (!data) {
            return BaseController.makeStatus(400, "Invalid data");
        }

        const transformed = transformPdf(data);

        // Make the output
        const uuid = uuidv4();
        const outputPath = path.join(EXPORT_PATH, `${uuid}.pdf`);

        try {
            // Write the PDF, and the HTML
            await htmlToPDF(transformed, outputPath);
            fs.writeFileSync(outputPath.replace(".pdf", ".html"), transformed);

            // Prepare the file to be downloaded
            const buffer = fs.readFileSync(outputPath);
            const headers = new Headers();

            headers.append(
                "Content-Disposition",
                'attachment; filename="resume.pdf"'
            );

            headers.append("Content-Type", "application/pdf");
            return new Response(buffer, { headers });
        } catch (error) {
            return BaseController.makeStatus(500, "Failed to write PDF");
        }
    },
};
