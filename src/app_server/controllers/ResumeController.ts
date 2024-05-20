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
import fonts from "@/app/fonts";
import heading from "../components/heading";
import education from "../components/education";
import experience from "../components/experience";
import project from "../components/project";
import { text } from "stream/consumers";

const exportSchema = z.object({
    resume: z.string(),
});

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
            const outputPath = path.join(
                process.cwd(),
                "resume_pdf/imports",
                `${uuid}.pdf`
            );

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
        const data = BaseController.checkSchema(exportSchema, body);
        if (!data) {
            return BaseController.makeStatus(400, "Invalid data");
        }

        // Read the PDF format
        const pdfBasePath = path.join(
            process.cwd(),
            "resume_pdf/pdf_base.html"
        );

        const pdfBase = fs.readFileSync(pdfBasePath, "utf8");

        // Start transforming
        let transformedPdf = pdfBase;

        // Transform the PDF
        transformedPdf = transformedPdf.replace("__NAME__", body.header.name);
        transformedPdf = transformedPdf.replace(
            "__SUBTITLE__",
            body.header.subtitle
        );
        transformedPdf = transformedPdf.replace(
            "__CONTACT__",
            body.header.contact
        );

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
                    sectionString += project({
                        ...item.value,
                        hideLinks: true,
                    });
                }

                if (item.type === "text") {
                    sectionString += text(item.value.text);
                }
            }

            sectionString += `</section>`;
        }

        transformedPdf = transformedPdf.replace("__SECTIONS__", sectionString);
    },
};
